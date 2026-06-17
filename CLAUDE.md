Default to Bun for the frontend workspace and uv/Python for the backend.

- Use `bun install`, `bun run`, and `bunx` for the root workspace, `apps/web`, and `packages/ui`.
- Use `uv` for `apps/api`; do not add Bun/Node tooling there.
- The backend is FastAPI + SQLAlchemy/Alembic, not Fastify or Drizzle.
- Keep the Bun workspace limited to `apps/web`, `packages/ui`, and `plugins/*`.
- Treat `apps/api` as an independent Python project with its own `pyproject.toml` and lockfile.
- Always refer to and adhere to [AGENTS.md](file:///d:/motherboard/AGENTS.md) for team structure, decisions, and coding standards.

## Frontend

- `apps/web` is Next.js 15 App Router + React 19.
- `packages/ui` is the shared component library for the web app and plugins.

## Backend

- `apps/api` is FastAPI 0.111+ with Pydantic v2, SQLAlchemy 2.0 async ORM, and Alembic.
- Use `uv run` for backend commands.
- Keep Redis/Postgres container wiring in Docker Compose, but the backend itself is Python.

## Notes

- Bun automatically loads `.env`, so do not add `dotenv` for frontend work.
- Keep commands and docs aligned with the current FastAPI-edition tech spec.
- Refer to [AGENTS.md](file:///d:/motherboard/AGENTS.md) as the single source of truth for repository workflows, role ownership, and team protocols.
