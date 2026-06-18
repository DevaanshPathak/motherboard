
# bnb-motherboard Security & Production Readiness Plan

## Context

The platform is in Phase 3 (Event Bus) of a 9-phase build. Core infrastructure exists (13 DB tables, 8 routers, IAM policy engine, NextAuth v5 + Discord OAuth), but security, testing, and operational hardening have been deferred. This plan identifies **32 gaps** across 7 domains, prioritized by severity, with the rationale and recommended fix for each.

**Auth decision:** The API will issue its own JWTs. The frontend exchanges a NextAuth session for a motherboard JWT via a new `/api/auth/token` endpoint.

**Scope:** Security, testing, reliability, observability, CI/CD, and documentation. Multi-tenancy and GDPR compliance are excluded (separate product work).

---

## CRITICAL — Fix Before Any Production Traffic

### C1. Zero Authentication on 7 of 8 API Routers
**Files:** `apps/api/app/routers/users.py`, `groups.py`, `forks.py`, `audit.py`, `sync.py`, `plugins.py`, `finance.py`
**Problem:** Every endpoint (list users, create grants, delete groups, trigger sync, manage plugins) accepts anonymous requests. Anyone with network access has full CRUD.
**Fix:** Add a `CurrentUserDep` FastAPI dependency to every handler. Each handler calls `require_permission(db, principal, "resource.action")` before proceeding. Only `health.py` stays public.
**Why:** Without auth, the IAM policy engine (which exists and works) is completely bypassed.

### C2. IAM Router Is Broken — Cannot Load
**File:** `apps/api/app/routers/iam.py`
**Problem:** Three broken imports prevent the module from loading:
- `from app.dependencies import DbDep, CurrentUserDep` — neither symbol exists in `dependencies.py`
- `from app.config import settings` — only `get_settings()` exists, no module-level `settings`
- `or_` used in queries but not imported from SQLAlchemy

**Fix:** Replace `DbDep` with existing `DbSession`. Create `CurrentUserDep` in `dependencies.py` (see C3). Fix config import. Add `or_` to SQLAlchemy import.
**Why:** The IAM router has 14 endpoints for permission/grant/group management. It's completely non-functional.

### C3. No JWT Authentication Dependency Exists
**Files to create:** `apps/api/app/auth.py`; modify `apps/api/app/dependencies.py`
**Problem:** `python-jose[cryptography]` is declared as a dependency but never used. No JWT creation, validation, or FastAPI dependency exists.
**Fix:** Create `auth.py` with:
- `create_access_token(data, expires_delta)` — signs JWTs using `python-jose`
- `get_current_user(request, db)` — extracts Bearer token, validates signature/expiry, resolves principal via `resolve_principal(db, user_id)`
- Export `CurrentUserDep = Annotated[ResolvedPrincipal, Depends(get_current_user)]`

Add `DbDep = DbSession` alias in `dependencies.py` for backward compatibility with `iam.py`.
**Why:** Every other security control depends on knowing who is making the request.

### C4. Missing Auth Upsert Endpoint
**File to create:** `apps/api/app/routers/auth.py`
**Problem:** The frontend's NextAuth JWT callback (`apps/web/lib/auth.ts` lines 30-44) calls `POST /api/auth/upsert` with `X-Internal-Secret` header, but **this endpoint doesn't exist** on the backend. User creation via Discord login silently fails.
**Fix:** Create an auth router with:
- `POST /api/auth/upsert` — validates `X-Internal-Secret`, upserts User + DiscordAccount, returns a JWT
- `POST /api/auth/token` — exchanges a valid session for a short-lived API JWT
- `GET /api/auth/me` — returns current user + resolved principal

**Why:** The auth bridge between NextAuth and the FastAPI backend is a core architectural contract that was never implemented.

### C5. OAuth Tokens Stored in Plaintext
**File:** `apps/api/app/db/models.py` lines 124-125
**Problem:** `access_token` and `refresh_token` on `DiscordAccount` are `Text` columns. A code comment says "Encrypted OAuth tokens (store encrypted-at-rest in production)" but no encryption exists.
**Fix:** Create `apps/api/app/crypto.py` with Fernet-based encrypt/decrypt helpers (key derived from a new `TOKEN_ENCRYPTION_KEY` env var). Apply encryption in the auth upsert router when writing tokens. Create an Alembic data migration for any existing plaintext values.
**Why:** Leaked OAuth tokens grant full access to users' Discord accounts.

### C6. No Security Headers (Backend or Frontend)
**Files:** `apps/api/app/main.py`, `apps/web/next.config.js`
**Problem:** Zero HTTP security headers on any response. No CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy.
**Fix (backend):** Add `SecurityHeadersMiddleware` to FastAPI setting: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security: max-age=63072000; includeSubDomains`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy: default-src 'self'`.
**Fix (frontend):** Add `async headers()` to `next.config.js` with the same headers plus `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
**Why:** These headers prevent clickjacking, MIME sniffing, downgrade attacks, and cross-origin data leakage. They're a baseline security requirement.

### C7. No Rate Limiting
**Problem:** No throttle logic anywhere. Auth endpoints, sync triggers, and all CRUD operations accept unlimited requests.
**Fix:** Add `slowapi` with Redis backend (Redis is already in the stack, declared as dependency but unused). Apply `5/minute` on auth endpoints, `100/minute` on general API routes, `10/minute` on sync triggers.
**Why:** Without rate limiting, the API is vulnerable to brute-force attacks, credential stuffing, DoS, and resource exhaustion.

### C8. Hardcoded Fallback Password in Docker Compose
**Files:** `docker-compose.yml`, `docker-compose.prod.yml`
**Problem:** `POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}` — if the env var is unset, Postgres starts with password `changeme`.
**Fix:** Replace `:-changeme` with `:?POSTGRES_PASSWORD must be set` (Docker Compose errors if unset). Add a strong generated example to `.env.example`.
**Why:** A production deployment with the fallback password gives anyone Postgres superuser access.

---

## HIGH — Fix Before Public Launch

### H1. CORS Overly Broad
**File:** `apps/api/app/main.py` lines 65-71
**Problem:** `allow_methods=["*"]`, `allow_headers=["*"]`. The `cors_origins` config field exists in `config.py` but is never consumed — only `nextauth_url` is used.
**Fix:** Parse `cors_origins` (comma-separated), fall back to `[nextauth_url]`. Narrow methods to `GET, POST, PUT, PATCH, DELETE`. Narrow headers to `Content-Type, Authorization, X-Request-ID`.
**Why:** Wildcard methods/headers expand the attack surface for CORS-based exploits.

### H2. No Global Exception Handler
**File:** `apps/api/app/main.py`
**Problem:** Unhandled exceptions leak full Python stack traces (including file paths, library versions, and internal logic) to the client.
**Fix:** Add `@app.exception_handler(Exception)` returning `{"detail": "Internal server error"}` with status 500. Add handlers for `HTTPException` and `RequestValidationError` for consistent JSON shape.
**Why:** Stack traces reveal implementation details useful for targeted attacks.

### H3. No Input Sanitization
**Files:** All schemas in `apps/api/app/schemas/`
**Problem:** User-provided strings (`display_name`, `description`, `city_name`) are stored and returned without HTML/XSS stripping.
**Fix:** Add `nh3` (or `bleach`) dependency. Create a `SanitizedStr` Pydantic type or `@field_validator` on string fields that strips HTML tags.
**Why:** Stored XSS via unsanitized user input that gets rendered in the dashboard or admin panels.

### H4. No Retry Logic for External API Calls
**File:** `apps/api/app/routers/iam.py` (Discord API calls)
**Problem:** Discord API calls use `httpx.AsyncClient(timeout=10.0)` with no retry. A transient network failure causes immediate 500 to the client.
**Fix:** Add `tenacity` dependency. Wrap external HTTP calls with `@retry(stop=stop_after_attempt(3), wait=wait_exponential(...), retry=retry_if_exception_type(httpx.TransportError))`.
**Why:** External APIs have transient failures. Without retry, users see errors that would have self-healed.

### H5. No Router-Level Tests
**Files:** `apps/api/tests/` — only `test_phase1.py` (ORM CRUD) and `test_iam_policy.py` (policy unit tests) exist
**Problem:** Zero HTTP-level tests for any of the 8 routers (80+ endpoints). No auth tests, no error path tests, no CORS/security header tests.
**Fix:** Add `pytest-cov` dependency. Create `tests/test_routers/` with httpx `AsyncClient` tests for each router. Create auth fixture that generates test JWTs. Set `--cov-fail-under=70` threshold.
**Why:** Without router tests, regressions in auth, validation, or business logic go undetected.

### H6. No Frontend Tests
**Problem:** Zero test files in `apps/web/`. No test framework configured.
**Fix:** Add Vitest + `@testing-library/react` + `jsdom`. Create basic tests for middleware (auth redirect), auth flow, and key components. Set coverage thresholds.
**Why:** Frontend regressions (broken auth redirect, XSS via new components) go undetected.

### H7. No CI/CD Pipeline
**Problem:** No `.github/workflows/`, no `.gitlab-ci.yml`, no CI of any kind. Code quality, type safety, and tests are never enforced automatically.
**Fix:** Create `.github/workflows/ci.yml` with stages: backend lint (ruff), backend typecheck (mypy), backend test (pytest with Postgres service), frontend lint (ESLint), frontend typecheck (turbo typecheck), frontend test (vitest). Gate PR merges on all stages passing.
**Why:** Without CI, broken code ships to production.

### H8. No Docker Health Checks
**Files:** `docker/api.Dockerfile`, `docker/web.Dockerfile`, `docker-compose.yml`
**Problem:** No `HEALTHCHECK` in either Dockerfile. No `healthcheck:` blocks in compose files. `depends_on` waits only for container start, not readiness. Postgres can be "running" but not accepting connections, and the API starts before it's ready.
**Fix:** Add `HEALTHCHECK` to both Dockerfiles (hit `/health/live` for API, `wget` for web). Add `healthcheck:` blocks for Postgres (`pg_isready`) and Redis (`redis-cli ping`). Change `depends_on` to `condition: service_healthy`.
**Why:** Without health checks, Docker reports services as "running" when they're actually dead or unresponsive.

### H9. Health Check Doesn't Verify Database
**File:** `apps/api/app/routers/health.py`
**Problem:** `GET /health/` returns static `{"status": "ok"}` regardless of database or Redis connectivity.
**Fix:** Add `/health/live` (process liveness, no DB) and `/health/ready` (checks DB with `SELECT 1`, returns 503 if unavailable).
**Why:** Kubernetes/Docker health checks need to distinguish "process is alive" from "service can handle traffic."

### H10. No ESLint or Prettier Configuration
**Problem:** No `.eslintrc.*`, no `.prettierrc`, no code formatting enforcement. `next lint` runs but with no custom rules. Tech spec mandates "ESLint + Prettier" but neither is configured.
**Fix:** Add ESLint + Prettier + `eslint-config-next` + `eslint-config-prettier` + TypeScript ESLint. Create config files. Add `lint` and `format` scripts.
**Why:** Without linting, security anti-patterns (unused vars, `any` types, `dangerouslySetInnerHTML`) go undetected.

---

## MEDIUM — Fix Before Scale

### M1. No Pagination on List Endpoints
**Files:** `users.py`, `groups.py`, `forks.py`, `plugins.py`, `iam.py`
**Problem:** `list_users`, `list_groups`, `list_forks`, `list_plugins` return **all records** with no limit. As data grows, response times degrade and memory usage spikes.
**Fix:** Create `schemas/pagination.py` with `PaginatedResponse[T]`. Add `limit` (max 500) and `offset` query params to all list endpoints.
**Why:** Unbounded queries are a DoS vector and cause performance degradation.

### M2. No Structured Logging or Correlation IDs
**Problem:** Uses stdlib `logging` with no JSON formatter. No request IDs for tracing requests across logs.
**Fix:** Add `structlog` + `python-json-logger`. Add request logging middleware that generates `X-Request-ID`, logs method/path/status/duration, and propagates the ID through `structlog.contextvars`.
**Why:** Without structured logging and correlation IDs, debugging production issues is extremely difficult.

### M3. No Database Connection Pool Configuration
**File:** `apps/api/app/database.py`
**Problem:** `create_async_engine(url, pool_pre_ping=True)` — no `pool_size`, `max_overflow`, or `pool_timeout`. Defaults may be too low for production.
**Fix:** Add configurable `pool_size=20`, `max_overflow=10`, `pool_timeout=30`, `pool_recycle=1800` to config and engine creation.
**Why:** Default pool settings can cause connection exhaustion under load.

### M4. No Metrics or Monitoring
**Problem:** No Prometheus metrics, no Sentry error tracking, no APM, no uptime monitoring.
**Fix:** Add `prometheus-fastapi-instrumentator` for `/metrics` endpoint. Add `sentry-sdk[fastapi]` for error tracking. Add `@sentry/nextjs` for frontend error tracking.
**Why:** Without monitoring, production issues are invisible until users report them.

### M5. No Backup Strategy
**Problem:** No database backup scripts, no automated backup schedule, no tested restore procedure.
**Fix:** Create `scripts/backup-db.sh` (pg_dump with timestamp) and `scripts/restore-db.sh`. Add cron job or CI schedule for automated backups.
**Why:** Without backups, data loss from corruption, accidental deletion, or ransomware is unrecoverable.

### M6. Docker Containers Run as Root
**Files:** Both Dockerfiles
**Problem:** Both API and web containers run as root inside the container. A container escape gives root access to the host.
**Fix:** Add non-root user creation (`adduser --system appuser`) and `USER appuser` before CMD in both Dockerfiles.
**Why:** Principle of least privilege — containerized processes shouldn't run as root.

### M7. No Resource Limits on Docker Services
**Files:** Both compose files
**Problem:** No `deploy.resources.limits` on any service. A memory leak in one container can crash the entire host.
**Fix:** Add memory/CPU limits: API 512M, Web 768M, Postgres 1G, Redis 256M.
**Why:** Resource limits prevent cascading failures.

### M8. No `.dockerignore`
**Problem:** No `.dockerignore` file — build context may include `.git`, `node_modules`, `.env`, etc.
**Fix:** Create `.dockerignore` excluding `.git`, `node_modules`, `.next`, `.turbo`, `__pycache__`, `.env*`.
**Why:** Bloated build context slows CI and may leak secrets into Docker layers.

### M9. Fire-and-Forget Auth Upsert Has No Error Handling
**File:** `apps/web/lib/auth.ts` lines 30-45
**Problem:** The `fetch()` to `/api/auth/upsert` uses `.catch(() => {})` — errors are silently swallowed with no logging, no retry queue.
**Fix:** Add error logging, fetch timeout, and store the returned JWT for subsequent API calls.
**Why:** Silent failures make debugging auth issues nearly impossible.

### M10. No Pre-commit Hooks
**Problem:** No Husky, no lint-staged, no pre-commit config. Code can be committed without any linting or type-checking.
**Fix:** Add `.pre-commit-config.yaml` with ruff (Python) and prettier (JS/TS) hooks. Add Husky + lint-staged for the frontend.
**Why:** Prevents committing code that fails basic quality checks.

---

## LOW — Track and Schedule

### L1. `cors_origins` Config Field Unused
**File:** `apps/api/app/config.py` line 26
**Problem:** `cors_origins` field is defined but never consumed. Addressed by H1.

### L2. Unused Dependencies in pyproject.toml
**Problem:** `python-jose` (will be used by C3), `redis` (will be used by C7), `apscheduler` (Phase 5 provisioning worker — not yet built) are declared but unused.
**Fix:** These get consumed as phases are implemented. No action needed now.

### L3. Web Dockerfile Copies All node_modules
**File:** `docker/web.Dockerfile`
**Problem:** Copies entire `node_modules` (including devDependencies) to production image.
**Fix:** Use `bun install --production` in the runner stage, or multi-stage copy only production deps.

### L4. No ADRs or Runbooks
**Problem:** No Architecture Decision Records, no operational runbooks, no onboarding docs.
**Fix:** Create `docs/adr/` with template and initial ADRs. Create `docs/runbooks/` for common operations.
**Why:** Institutional knowledge loss when team members leave.

### L5. No Feature Flags
**Problem:** No feature flag system for gradual rollouts or kill switches.
**Fix:** Defer until the app has enough users to warrant it. A simple env-var-based flag system can be added when needed.

### L6. No Reverse Proxy Configuration
**Problem:** Prod compose exposes no ports (implying an external proxy) but no nginx/Caddy config exists in the repo.
**Fix:** Add a Caddy or nginx config for TLS termination, static file serving, and request routing.

---

## Dependency Changes Required

### Backend (`apps/api/pyproject.toml`)
| Package | Reason |
|---------|--------|
| `cryptography>=42.0` | Fernet token encryption (C5) |
| `slowapi>=0.1.9` | Rate limiting (C7) |
| `structlog>=24.1.0` | Structured logging (M2) |
| `tenacity>=8.3.0` | Retry logic (H4) |
| `nh3>=0.2.0` | Input sanitization (H3) |
| `pytest-cov>=5.0.0` | Test coverage (H5) |
| `ruff>=0.5.0` | Linting (H7) |
| `mypy>=1.10.0` | Type checking (H7) |
| `prometheus-fastapi-instrumentator>=7.0` | Metrics (M4) |
| `sentry-sdk[fastapi]>=2.0` | Error tracking (M4) |

### Frontend (`apps/web/package.json`)
| Package | Reason |
|---------|--------|
| `eslint`, `eslint-config-next`, `eslint-config-prettier` | Linting (H10) |
| `prettier` | Formatting (H10) |
| `dompurify` | Input sanitization (H3) |
| `vitest`, `@testing-library/react`, `jsdom` | Testing (H6) |
| `@sentry/nextjs` | Error tracking (M4) |

---

## Execution Order

```
Phase 1 — Critical Security (C1-C8)        ~3-4 days
  Must deploy atomically: auth dependency + auth router + router auth + frontend token storage

Phase 2 — Backend Hardening (H1-H4, M1-M3) ~2-3 days
  Independent changes, can be parallelized

Phase 3 — Frontend Hardening (H6, H9, H10, M9) ~1-2 days
  Can begin in parallel with Phase 2

Phase 4 — Testing (H5, H6)                  ~2-3 days
  Depends on Phase 1 (auth fixtures need JWT infrastructure)

Phase 5 — CI/CD & Docker (H7, H8, M6-M8, M10) ~2 days
  CI depends on Phase 4 (tests must exist). Docker changes are independent.

Phase 6 — Observability & Docs (M4, M5, L4) ~1-2 days
  Can begin after Phase 5

Total: ~11-16 engineering days
```

---

## Verification Checklist

- [ ] `curl` every router without Authorization header — all return 401 (except `/health/`)
- [ ] CORS preflight from unknown origin is rejected
- [ ] Response headers include HSTS, X-Frame-Options, CSP, X-Content-Type-Options
- [ ] 200 rapid requests to auth endpoint — 429 after limit
- [ ] Unhandled exception returns `{"detail": "Internal server error"}` with no stack trace
- [ ] `POST /api/auth/upsert` with `<script>` in display_name — tags are stripped
- [ ] Docker Compose without POSTGRES_PASSWORD errors out (not silent fallback)
- [ ] `docker compose ps` shows all services as "healthy"
- [ ] `docker compose exec api whoami` returns non-root user
- [ ] `pytest --cov-fail-under=70` passes
- [ ] CI pipeline blocks merge on failing tests
- [ ] `curl http://localhost:8000/metrics` returns Prometheus metrics
