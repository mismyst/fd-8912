import type { CreatedIdea, GeneratedReport, SessionProfile } from "@/lib/types";

const IDEAS_KEY = "founderz.ideas";
const REPORTS_KEY = "founderz.reports";
const PROFILE_KEY = "founderz.profile";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredIdeas() {
  return readJson<CreatedIdea[]>(IDEAS_KEY, []);
}

export function setStoredIdeas(ideas: CreatedIdea[]) {
  writeJson(IDEAS_KEY, ideas);
}

export function getStoredReports() {
  return readJson<GeneratedReport[]>(REPORTS_KEY, []);
}

export function setStoredReports(reports: GeneratedReport[]) {
  writeJson(REPORTS_KEY, reports);
}

export function getStoredProfile() {
  return readJson<SessionProfile | null>(PROFILE_KEY, null);
}

export function setStoredProfile(profile: SessionProfile | null) {
  if (!canUseStorage()) {
    return;
  }

  if (!profile) {
    window.localStorage.removeItem(PROFILE_KEY);
    return;
  }

  writeJson(PROFILE_KEY, profile);
}
