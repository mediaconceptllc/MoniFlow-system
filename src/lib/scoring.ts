import type { Confidence } from "./types";

const CONFIDENCE_FACTOR: Record<Confidence, number> = {
  low: 0.6,
  med: 0.85,
  high: 1,
};

export function computeScore(input: {
  user_impact: number;
  business_impact: number;
  risk_reduction: number;
  time_criticality: number;
  strategic_fit: number;
  confidence: Confidence;
  effort: number;
}): number {
  const effort = Math.max(1, input.effort);
  const sum =
    input.user_impact +
    input.business_impact +
    input.risk_reduction +
    input.time_criticality +
    input.strategic_fit;
  const raw = (sum * CONFIDENCE_FACTOR[input.confidence]) / effort;
  return Math.round(raw * 10) / 10;
}

export function slaHoursForTicketPriority(priority: string): number {
  switch (priority) {
    case "urgent":
      return 4;
    case "high":
      return 12;
    case "low":
      return 72;
    default:
      return 24;
  }
}

export function agingHoursForWork(priority: string): number {
  switch (priority) {
    case "P0":
      return 4;
    case "P1":
      return 12;
    case "P2":
      return 48;
    default:
      return 120;
  }
}

export function isAging(updatedAt: string | Date, hours: number): boolean {
  const t = typeof updatedAt === "string" ? new Date(updatedAt).getTime() : updatedAt.getTime();
  return Date.now() - t > hours * 3600 * 1000;
}
