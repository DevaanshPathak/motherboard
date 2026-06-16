# bnb-motherboard

<p align="center">
  <img src="https://gobitsnbytes.org/logo" alt="bits&bytes™ logo" width="120" height="120">
</p>

The internal operations platform for the **bits&bytes** network. 

Motherboard acts as the central Identity & Access Management (IAM) engine, provisioning worker, and event/plugin SDK platform for coordinating all local city forks, contributor roles, and discord integrations.


---

## 🚀 Key Features

*   **Identity & Access Management (IAM) Core:** Discord-linked authentication using NextAuth.js. Guild roles are imported and mapped dynamically to internal operational groups.
*   **Provisioning Engine:** An active sync worker keeping internal user roles, city forks, and entitlements synchronized with the Discord guild on-demand or scheduled.
*   **Plugin Platform:** An extensible SDK allowing first-party and third-party plugins to declare custom database migrations, Fastify routes, UI panels, permissions, and audit logs.
*   **Web Dashboard:** Next.js 15 App Router frontend leveraging Radix UI and Tailwind CSS for a premium dashboard experience.
*   **Discord Bot Integration Layer:** Structured API/WebSocket interface hook for the bits&bytes Discord bot to sync identities, roles, and targeted user profiles.

---

## 🛠️ Technology Stack

*   **Runtime:** [Bun](https://bun.sh/) (latest stable)
*   **Monorepo Tools:** Bun Workspaces + [Turborepo](https://turbo.build/)
*   **Backend:** [Fastify 5](https://fastify.dev/) (TypeScript)
*   **Frontend:** [Next.js 15](https://nextjs.org/) App Router, React 19, TypeScript
*   **Database:** PostgreSQL 16
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/) + `drizzle-kit`
*   **Auth (Web):** NextAuth.js v5 (Auth.js) with Discord provider
*   **Auth (API):** Fastify session + NextAuth JWT verification
*   **Component Library:** Radix UI primitives + Tailwind CSS

---

## 📁 Repository Structure

```
bnb-motherboard/
├── apps/
│   ├── web/                    # Next.js 15 App Router (frontend)
│   └── api/                    # Fastify 5 backend
├── packages/
│   ├── db/                     # Drizzle ORM schema, migrations, and postgres client
│   ├── iam/                    # Principal resolution, policy engine, permissions
│   ├── provisioning/           # Discord sync worker and role mapper
│   ├── events/                 # Typed internal event bus & Redis pub/sub
│   ├── plugin-sdk/             # SDK contract and lifecycle loaders
│   └── ui/                     # Shared Radix UI + Tailwind component library
├── plugins/                    # Core and third-party operational plugins
├── docker/                     # App-specific Dockerfiles
├── docker-compose.yml          # Local orchestration compose file
├── turbo.json                  # Turborepo task pipeline configuration
└── AGENTS.md                   # Single source of truth for agent guidelines and workflow rules
```

---

## ⚙️ Development Setup

### 1. Prerequisites
Make sure you have [Bun](https://bun.sh/) installed locally.

### 2. Install Dependencies
From the root of the workspace:
```bash
bun install
```

### 3. Environment Secrets
Create a `.env` file in the root based on `.env.example`:
```bash
cp .env.example .env
```
Ensure you configure your `DATABASE_URL`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_BOT_TOKEN`.

### 4. Running Locally
Spin up local dependencies (Postgres & Redis) via Docker Compose:
```bash
docker compose up -d postgres redis
```

Start the Monorepo in development mode:
```bash
bun dev
```

---

## 📜 Codebase Conventions

*   **Package Scope:** All shared packages use the `@bnb/` scope (e.g. `@bnb/db`, `@bnb/iam`).
*   **Commit Style:** Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.).
*   **Atomic Commits:** Keep commits small, isolated, and focused on a single logical change.
