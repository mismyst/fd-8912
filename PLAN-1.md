AI Startup Co-Founder — Hackathon Plan

Context
- Build a Generative AI SaaS to help founders validate startup ideas using LLMs and AI agents.
- Target: MVP in 24–48 hours with a clean, scalable architecture (Frontend: Next.js + shadcn/ui; Backend: Node.js or FastAPI; AI Layer: LangChain-like orchestration; Vector store: Pinecone/Qdrant; DB: Supabase/PostgreSQL).
- Core workflow: user chat collects idea details, AI generates a validation report and a downloadable full report via lead capture (email).

What you will deliver (MVP ready for hackathon):
- A working Next.js frontend with a chat interface and a dashboard to view reports.
- A backend service that orchestrates LLMs and AI agents to produce a startup validation report.
- An AI agent suite (Market Research, Competitor Analysis, Pricing, MVP Planner, Investor Pitch).
- A simple vector store integration for embeddings and a Postgres-based database (Supabase) for users, ideas, reports, leads.
- A minimal but solid deployment plan (Docker + Vercel).

System Architecture Diagram (ASCII)
                               +---------------------+
                               |     Frontend        |
                               |  Next.js + shadcn/ui|
                               +----------+----------+
                                          |
                                          v
                               +---------------------+
                               |   Backend API       |
                               |  Node.js / FastAPI  |
                               +----------+----------+
                                          |
                                          v
                         +----------------+----------------+ 
                         | AI Orchestrator (LangChain)    |
                         | Agents: Market, Competitor, Pricing, MVP, Investor |
                         +---+--------------------------+---+
                             |                          |
                   +---------+--------+         +-------+---------+
                   | Vector DB (Qdrant/Pinecone)  |  LLMs (OpenAI / Open Source)  |
                   +---------+--------+         +-------+---------+
                             |                             |
                         +---------+                      |
                         |   DB (Postgres via Supabase)  |
                         +---------------------------------+

Folder structure (recommended)
- apps/
  - web/                 # Next.js frontend (App Router) with chat UI
- backend/
  - src/
    - api/                # REST/GraphQL endpoints
    - llm/                # LangChain-like orchestration and agent logic
    - services/           # Business logic services (reports, leads, etc.)
    - models/             # Pydantic/ts interfaces and DB models
- infra/
  - db/                  # Supabase/PostgreSQL schema and migrations
  - vector/              # Pinecone or Qdrant embeddings
  - seeds/               # Seed data for dev
- libs/
  - ai/                  # Agent prompts and templates
  - prompts/             # Centralized prompts for all agents
- docs/Plan.md            # This file (context and plan)

Phase-by-Phase Plan ( hackathon-ready, 24–48h MVP )
Phase 0 — Setup & Architecture (4–6h)
- Establish repo structure, pick tech stack (Next.js + Node.js, LangChain.js, Supabase, Qdrant/Pinecone).
- Initialize monorepo, add PLAN.md, READMEs, and basic CI workflow.
- Create initial database schema in Supabase; create migrations for users, startup_ideas, reports, leads.
- Set up environment variables and secrets strategy (secure storage).

Phase 1 — Frontend Scaffolding (4–8h)
- Implement Next.js app with App Router; set up shadcn/ui integration and a chat component.
- Create dashboard pages: /reports, /reports/{id}, /ideas, and simple auth scaffolding (email-only for MVP).
- Wire frontend to backend API endpoints for idea creation, report generation, and lead capture.
- Implement basic responsive UI; ensure mobile support.

Phase 2 — Backend Scaffold (4–8h)
- Build Node.js backend (Express or Fastify) or FastAPI if you prefer Python; expose endpoints:
  - POST /api/ideas: create startup idea object
  - POST /api/reports: trigger report generation for an idea
  - GET /api/reports/{id}: fetch report payload
  - POST /api/leads: capture lead (email)
- Integrate with Supabase/Postgres for data persistence; set up Prisma/TypeORM/SQLAlchemy as needed.
- Create a simple authentication placeholder (JWT or session) for MVP administrability.

Phase 3 — AI Layer & Agents (8–12h)
- Implement AI Orchestrator: a LangChain-like pipeline that coordinates agents.
- Agents (5): Market Research, Competitor Analysis, Pricing Strategy, MVP Planner, Investor Pitch Generator.
- Create agent prompts and templates; implement embedding/search with vector DB.
- Implement report assembly: combine agent outputs into a structured report object with a viability score 0–100.
- Add retry/error handling and basic monitoring hooks.

Phase 4 — Data Layer & Leads (4–6h)
- Create leads table; implement lead capture flow from the chat and report download.
- Persist downloaded report metadata; tie leads to user/idea where possible.
- Implement email download flow (mock or simple integration with SendGrid-like service for MVP).

Phase 5 — End-to-End Flow & Validation (6–8h)
- Connect chat UI to idea capture; ensure the flow collects: idea, target market, problem, customer segment.
- Trigger report generation after data capture; display report summary and breakdown in frontend.
- Ensure Go-to-Market, MVP roadmap, investor pitch, and viability score surface correctly in UI.
- Add basic unit tests and end-to-end smoke tests for critical paths.

Phase 6 — Deployment (4–6h)
- Dockerize frontend and backend; provide docker-compose for local dev.
- Deploy frontend to Vercel; deploy backend to a container platform (Render, Fly.io, or a cloud provider that supports Docker).
- Configure environment variables for OpenAI API keys, vector store keys, and DB credentials.
- Validate end-to-end in staging; ensure reporting downloads via email capture.

Phase 7 — MVP Polish & Docs (2–4h)
- Polish UI/UX: typography, spacing, micro-interactions; ensure accessibility basics.
- Document API contracts, data models, and deployment steps in README.
- Prepare a short demo script and a user guide for hackathon judges.

Phase 8 — Optional Enhancements (post-MVP)
- Add user accounts with OAuth; richer reporting visuals; investor deck export (PPTX/PDF).
- Add versioning to reports; allow users to compare viability across iterations.

Key Technology Choices (summary)
- Frontend: Next.js (App Router) + shadcn/ui; TypeScript; Tailwind CSS.
- Backend: Node.js (Express/Fastify) or Python FastAPI; REST API; LangChain.js for orchestration.
- AI Layer: OpenAI or open-source LLMs; LangChain-like orchestration; agents as microservices/modules.
- Vector Store: Pinecone or Qdrant; embeddings for research context.
- Database: Supabase (PostgreSQL) for users, ideas, leads, reports; Auth lightweight.
- Deployment: Dockerized backend; Vercel for frontend; Docker deploy on a cloud host for backend.
- Data Contracts: JSON-based report with sections; store as JSONB in Postgres for flexibility.

Database Schema (DDL – MVP)
- users(id UUID PK, email TEXT UNIQUE, name TEXT, created_at TIMESTAMP)
- startup_ideas(id UUID PK, user_id UUID FK, idea_title TEXT, target_market TEXT, problem_description TEXT, customer_segment TEXT, created_at TIMESTAMP, status TEXT)
- reports(id UUID PK, idea_id UUID FK, created_at TIMESTAMP, report_json JSONB, viability_score INT, summary TEXT)
- leads(id UUID PK, user_id UUID FK, email TEXT, idea_id UUID NULL, created_at TIMESTAMP, downloaded_at TIMESTAMP NULL)

LLM Prompts (Agent Templates)
- Market Research Agent:
  - Prompt: You are Market Research Agent. Given a startup idea, target market, and problem statement, summarize market size, growth, segmentation, and key trends. Output: market_size, growth_rate, target_segments, trends, open_questions.
- Competitor Analysis Agent:
  - Prompt: You are Competitor Analysis Agent. Identify direct/indirect competitors, pricing ranges, positioning, and differentiators. Output: competitors list, pricing_summary, strengths_weaknesses, gaps.
- Pricing Strategy Agent:
  - Prompt: You are Pricing Strategy Agent. Propose pricing models (subscription tiers, freemium, usage-based) and a recommended initial price. Include rationale.
- MVP Planner Agent:
  - Prompt: You are MVP Planner. Given the idea and market signals, propose MVP features and a numbered roadmap with 4–8 milestones and rough effort estimation.
- Investor Pitch Generator:
  - Prompt: You are Investor Pitch Generator. Produce an executive summary slide content (problem, solution, market, traction, business model, ask). Output outline with slide titles and bullet points.

Example Code Snippets (high level)
- Backend API skeleton (TypeScript, Express):
```ts
// backend/src/index.ts
import express from 'express';
const app = express();
app.use(express.json());

app.post('/api/ideas', async (req, res) => {
  // validate and persist startup idea
  res.status(201).json({ id: 'idea-uuid' });
});

app.post('/api/reports', async (req, res) => {
  // trigger LLM orchestration to generate report
  res.json({ reportId: 'report-uuid' });
});

app.listen(3000, () => console.log('Backend listening on 3000'));
```
- Agent orchestration skeleton (pseudo):
```ts
// backend/src/llm/orchestrator.ts
export async function generateReport(ideaId: string) {
  const market = await marketResearchAgent(ideaId);
  const comp = await competitorAgent(ideaId);
  const pricing = await pricingAgent(ideaId);
  const roadmap = await mvpPlannerAgent(ideaId);
  const pitch = await investorPitchAgent(ideaId);
  const report = { market, comp, pricing, roadmap, pitch };
  // compute viability score from components
  report.viability_score = computeScore(report);
  return report;
}
```

Deployment Plan (Docker + Vercel)
- Local: docker-compose up to run frontend + backend locally.
- Production: Frontend on Vercel; Backend Docker image deployed to chosen host (Render/Fly.io/AWS).
- Include vercel.json to support API routing if you want to host a hybrid setup on Vercel as well.
- Environment variables: OPENAI_API_KEY, VECTOR_STORE_KEY, DB_CONNECTION_STRING, MAIL_API_KEY.

MVP Implementation Steps (checklist)
- [ ] Scaffold project structure and install dependencies.
- [ ] Build chat UI with question prompts and form state capture.
- [ ] Implement backend endpoints and DB models.
- [ ] Integrate LangChain-like agents with prompts.
- [ ] Wire up vector store for context retrieval.
- [ ] Implement report assembly and viability scoring.
- [ ] Lead capture email flow and email download of full report.
- [ ] End-to-end tests for main flows.
- [ ] Dockerize services and deploy to Vercel (frontend) + backend host.

Acceptance Criteria
- Users can start a chat and submit startup idea details.
- The system returns a structured validation report with all sections and a viability score (0–100).
- The UI shows a dashboard listing reports per user; ability to download full report via email capture.
- Leads are stored in the database with a timestamp and optionally linked to a given idea.

Notes
- This plan aims for a hackathon-ready MVP. You can trim non-critical features (e.g., auth, analytics) if time runs short.
- Prioritize a smooth UX for the chat flow and robust report generation pipeline.
