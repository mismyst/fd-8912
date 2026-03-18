export type IdeaInput = {
  ideaTitle: string;
  targetMarket: string;
  problemDescription: string;
  customerSegment: string;
};

export type CreatedIdea = IdeaInput & {
  id: string;
  status: string;
  createdAt: string;
  userId?: string;
};

export type LeadInput = {
  email: string;
  ideaId?: string;
  userId?: string;
};

export type CreatedLead = {
  id: string;
  email: string;
  ideaId?: string;
  userId?: string;
  createdAt: string;
};

export type GeneratedReport = {
  id: string;
  viabilityScore: number;
  summary: string;
  sections: {
    market: string;
    competitors: string;
    pricing: string;
    roadmap: string;
    investorPitch: string;
  };
  createdAt: string;
};

export type QueuedReport = {
  reportId: string;
  ideaId: string;
  status: string;
  queuedAt: string;
};

export type SessionProfile = {
  email: string;
};
