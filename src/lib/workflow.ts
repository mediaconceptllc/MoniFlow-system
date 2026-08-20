import type { Role, WorkStatus, TicketStatus } from "./types";

export const WORK_TRANSITIONS: Record<WorkStatus, WorkStatus[]> = {
  new: ["triage", "needs_info", "rejected", "duplicate"],
  triage: ["needs_info", "approved_backlog", "rejected", "deferred", "duplicate"],
  needs_info: ["triage", "approved_backlog", "rejected"],
  approved_backlog: ["in_progress", "deferred", "rejected"],
  in_progress: ["in_review", "ready_for_qa", "needs_info"],
  in_review: ["in_progress", "ready_for_qa"],
  ready_for_qa: ["qa_failed", "ready_for_release"],
  qa_failed: ["in_progress", "ready_for_qa"],
  ready_for_release: ["released", "in_progress"],
  released: ["verified", "qa_failed"],
  verified: ["closed"],
  closed: [],
  deferred: ["approved_backlog", "triage"],
  rejected: [],
  duplicate: [],
};

export const TICKET_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  new: ["open", "duplicate", "closed"],
  open: ["waiting_customer", "waiting_internal", "escalated", "resolved", "duplicate"],
  waiting_customer: ["open", "resolved", "closed"],
  waiting_internal: ["open", "escalated", "resolved"],
  escalated: ["open", "resolved", "waiting_internal"],
  resolved: ["closed", "open"],
  closed: [],
  duplicate: [],
};

export const TERMINAL_WORK: WorkStatus[] = ["closed", "rejected", "duplicate"];
export const TERMINAL_TICKET: TicketStatus[] = ["closed", "duplicate"];

const WORK_ROLE_TRANSITIONS: Partial<Record<Role, WorkStatus[]>> = {
  requester: ["needs_info"],
  product_owner: [
    "triage",
    "needs_info",
    "approved_backlog",
    "deferred",
    "rejected",
    "duplicate",
    "verified",
    "closed",
  ],
  tech_lead: [
    "triage",
    "needs_info",
    "approved_backlog",
    "in_progress",
    "in_review",
    "ready_for_qa",
    "deferred",
    "duplicate",
  ],
  developer: ["in_progress", "in_review", "ready_for_qa", "needs_info"],
  qa: ["ready_for_qa", "qa_failed", "ready_for_release"],
  release_manager: ["ready_for_release", "released", "verified"],
  admin: [
    "new",
    "triage",
    "needs_info",
    "approved_backlog",
    "in_progress",
    "in_review",
    "ready_for_qa",
    "qa_failed",
    "ready_for_release",
    "released",
    "verified",
    "closed",
    "deferred",
    "rejected",
    "duplicate",
  ],
};

export function canTransitionWork(role: Role, to: WorkStatus): boolean {
  if (role === "admin") return true;
  const allowed = WORK_ROLE_TRANSITIONS[role];
  return Boolean(allowed?.includes(to));
}

export function canTransitionTicket(role: Role): boolean {
  return role === "admin" || role === "support_agent" || role === "support_lead";
}

export function canEscalate(role: Role): boolean {
  return role === "admin" || role === "support_lead";
}

export function canDecide(role: Role): boolean {
  return role === "admin" || role === "product_owner" || role === "tech_lead";
}

export function canSetPriority(role: Role): boolean {
  return role === "admin" || role === "product_owner";
}

export function canAssignWork(role: Role): boolean {
  return role === "admin" || role === "tech_lead" || role === "product_owner";
}

export function canQa(role: Role): boolean {
  return role === "admin" || role === "qa";
}

export function canRelease(role: Role): boolean {
  return role === "admin" || role === "release_manager";
}

export function isStaff(role: Role): boolean {
  return role !== "requester" && role !== "viewer";
}

export function isEngineeringStaff(role: Role): boolean {
  return [
    "product_owner",
    "tech_lead",
    "developer",
    "qa",
    "release_manager",
    "admin",
  ].includes(role);
}

export function isSupportStaff(role: Role): boolean {
  return role === "admin" || role === "support_agent" || role === "support_lead";
}

export function canAdmin(role: Role): boolean {
  return role === "admin";
}

export function nextWorkStatuses(from: WorkStatus, role: Role): WorkStatus[] {
  return (WORK_TRANSITIONS[from] ?? []).filter((to) => canTransitionWork(role, to));
}

export function nextTicketStatuses(from: TicketStatus, role: Role): TicketStatus[] {
  if (!canTransitionTicket(role)) return [];
  return TICKET_TRANSITIONS[from] ?? [];
}
