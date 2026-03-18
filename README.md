# Founderz Monorepo

Phase 0 setup for the AI startup co-founder MVP.

## Stack (Phase 0)

- Frontend: Next.js App Router in apps/web
- Backend: Node.js + Express in backend
- Data: PostgreSQL/Supabase schema in infra/db/migrations
- AI prompt assets: libs/ai and libs/prompts
- CI: GitHub Actions at .github/workflows/ci.yml

## Repository Structure

```
apps/
	web/                 # Next.js frontend
backend/
	src/
		api/               # API route handlers
		llm/               # Agent/orchestrator layer
		services/          # Business logic
		models/            # Shared types and data contracts
infra/
	db/migrations/       # SQL migrations
	vector/              # Vector store docs/config
	seeds/               # Seed scripts/data
libs/
	ai/                  # AI templates and contracts
	prompts/             # Prompt catalog
```

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev:web
npm run dev:backend
```

Frontend runs on http://localhost:3000 and backend defaults to http://localhost:4000.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment Variables

Copy and populate the example files:

- .env.example
- apps/web/.env.example
- backend/.env.example

Do not commit real credentials.

## Phase 0 Deliverables Included

- Workspace-based monorepo initialized
- Backend scaffold with health + MVP endpoints
- Initial SQL migration for users, startup_ideas, reports, leads
- CI workflow for lint, typecheck, and build
