import type {
  CreatedIdea,
  CreatedLead,
  GeneratedReport,
  IdeaInput,
  LeadInput,
  QueuedReport,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function createIdea(input: IdeaInput & { userId?: string }) {
  return request<CreatedIdea>("/api/ideas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function queueReport(ideaId: string) {
  return request<QueuedReport>("/api/reports", {
    method: "POST",
    body: JSON.stringify({ ideaId }),
  });
}

export function getReport(reportId: string) {
  return request<GeneratedReport>(`/api/reports/${reportId}`, {
    method: "GET",
  });
}

export function captureLead(input: LeadInput) {
  return request<CreatedLead>("/api/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
