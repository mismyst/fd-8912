import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

const ideaSchema = z.object({
  ideaTitle: z.string().min(3),
  targetMarket: z.string().min(2),
  problemDescription: z.string().min(5),
  customerSegment: z.string().min(2),
  userId: z.string().uuid().optional(),
});

const leadSchema = z.object({
  email: z.email(),
  ideaId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "backend", timestamp: new Date().toISOString() });
});

app.post("/api/ideas", (req, res) => {
  const parsed = ideaSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid idea payload", issues: parsed.error.issues });
  }

  return res.status(201).json({
    id: randomUUID(),
    ...parsed.data,
    status: "created",
    createdAt: new Date().toISOString(),
  });
});

app.post("/api/reports", (req, res) => {
  const reportRequest = z.object({ ideaId: z.string().uuid() }).safeParse(req.body);

  if (!reportRequest.success) {
    return res.status(400).json({ error: "Invalid report request", issues: reportRequest.error.issues });
  }

  return res.status(202).json({
    reportId: randomUUID(),
    ideaId: reportRequest.data.ideaId,
    status: "queued",
    queuedAt: new Date().toISOString(),
  });
});

app.get("/api/reports/:id", (req, res) => {
  const id = req.params.id;

  return res.status(200).json({
    id,
    viabilityScore: 74,
    summary: "Initial mock report. Wire to orchestrator in Phase 3.",
    sections: {
      market: "TAM/SAM/SOM pending",
      competitors: "Competitor breakdown pending",
      pricing: "Pricing model pending",
      roadmap: "MVP milestones pending",
      investorPitch: "Executive summary pending",
    },
    createdAt: new Date().toISOString(),
  });
});

app.post("/api/leads", (req, res) => {
  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid lead payload", issues: parsed.error.issues });
  }

  return res.status(201).json({
    id: randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
