export const WORK_TYPES = [
  "incident",
  "bug",
  "feature",
  "improvement",
  "tech_debt",
  "security",
  "research",
  "task",
] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export const WORK_STATUSES = [
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
] as const;
export type WorkStatus = (typeof WORK_STATUSES)[number];

export const PRIORITIES = ["P0", "P1", "P2", "P3"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CONFIDENCES = ["low", "med", "high"] as const;
export type Confidence = (typeof CONFIDENCES)[number];

export const ROLES = [
  "requester",
  "product_owner",
  "tech_lead",
  "developer",
  "qa",
  "release_manager",
  "viewer",
  "admin",
  "support_agent",
  "support_lead",
] as const;
export type Role = (typeof ROLES)[number];

export const TICKET_CATEGORIES = [
  "complaint",
  "suggestion",
  "bug",
  "billing",
  "account",
  "other",
] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_STATUSES = [
  "new",
  "open",
  "waiting_customer",
  "waiting_internal",
  "escalated",
  "resolved",
  "closed",
  "duplicate",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["urgent", "high", "normal", "low"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const COMMENT_KINDS = [
  "note",
  "question",
  "answer",
  "decision",
  "risk",
  "evidence",
] as const;
export type CommentKind = (typeof COMMENT_KINDS)[number];

export const DECISION_KINDS = ["approve", "revise", "reject", "defer"] as const;
export type DecisionKind = (typeof DECISION_KINDS)[number];

export const MODULES = [
  "Chat",
  "Call",
  "Auth",
  "Wallet",
  "Contacts",
  "Feed",
  "Notifications",
  "Onboarding",
  "Platform",
  "Payments",
] as const;

export type WorkItem = {
  id: string;
  seq: number;
  title: string;
  type: WorkType;
  product_module: string;
  environment: string;
  current_behavior: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  steps_to_reproduce: string | null;
  affected_flow: string | null;
  affected_users: string | null;
  flag_growth: boolean;
  flag_retention: boolean;
  flag_payment: boolean;
  flag_stability: boolean;
  flag_network: boolean;
  priority: Priority;
  priority_rationale: string | null;
  urgency: string;
  rank: number | null;
  strategic_fit: number;
  user_impact: number;
  business_impact: number;
  risk_reduction: number;
  time_criticality: number;
  effort: number;
  confidence: Confidence;
  computed_score: number;
  owner_name: string | null;
  owner_id: string | null;
  assignee_name: string | null;
  assignee_id: string | null;
  qa_name: string | null;
  qa_id: string | null;
  sprint: string | null;
  release_target: string | null;
  due_date: string | null;
  status: WorkStatus;
  acceptance_criteria: string | null;
  test_scenarios: string | null;
  ux_link: string | null;
  api_requirement: string | null;
  pr_url: string | null;
  build_url: string | null;
  version: string | null;
  device: string | null;
  os_name: string | null;
  app_version: string | null;
  resolution: string | null;
  root_cause: string | null;
  lesson: string | null;
  blocked: boolean;
  blocker_note: string | null;
  parent_id: string | null;
  duplicate_of_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_transition_at: string;
};

export type Ticket = {
  id: string;
  seq: number;
  channel: string;
  category: TicketCategory;
  subject: string;
  body: string;
  expected_behavior: string | null;
  customer_name: string | null;
  customer_email: string | null;
  app_user_id: string | null;
  app_version: string | null;
  device: string | null;
  os_name: string | null;
  environment: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee_id: string | null;
  assignee_name: string | null;
  requester_id: string | null;
  sla_hours: number;
  sla_due_at: string | null;
  first_response_at: string | null;
  resolved_at: string | null;
  satisfaction: number | null;
  duplicate_of_id: string | null;
  created_at: string;
  updated_at: string;
  last_transition_at: string;
};

export type Comment = {
  id: string;
  entity_type: "work_item" | "ticket";
  entity_id: string;
  author_id: string | null;
  author_name: string;
  kind: CommentKind;
  body: string;
  resolved: boolean;
  parent_id: string | null;
  created_at: string;
};

export type Decision = {
  id: string;
  work_item_id: string;
  kind: DecisionKind;
  rationale: string;
  approver_id: string | null;
  approver_name: string;
  created_at: string;
};

export type StatusTransition = {
  id: string;
  entity_type: string;
  entity_id: string;
  from_status: string | null;
  to_status: string;
  actor_id: string | null;
  actor_name: string;
  reason: string | null;
  created_at: string;
};

export type Attachment = {
  id: string;
  entity_type: string;
  entity_id: string;
  filename: string;
  mime: string | null;
  byte_size: number | null;
  caption: string | null;
  access_scope: string;
  data_url: string | null;
  created_by: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  link: string | null;
  severity: string;
  read: boolean;
  created_at: string;
};

export type Release = {
  id: string;
  version: string;
  environment: string;
  status: string;
  rollout: string | null;
  rollback_plan: string | null;
  notes: string | null;
  owner_name: string | null;
  owner_id: string | null;
  released_at: string | null;
  created_at: string;
};

export type TestRun = {
  id: string;
  work_item_id: string;
  title: string;
  result: string;
  environment: string | null;
  evidence: string | null;
  tester_id: string | null;
  tester_name: string;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  display_name: string;
  role: Role;
  locale: string;
  created_at: string;
};

export type AuditEvent = {
  id: string;
  actor_id: string | null;
  actor_name: string;
  action: string;
  object_type: string;
  object_id: string;
  metadata: string | null;
  created_at: string;
};

export type TicketEscalation = {
  id: string;
  ticket_id: string;
  work_item_id: string;
  reason: string | null;
  created_by: string;
  created_at: string;
};

export type KpiSnapshot = {
  untriaged: number;
  untriagedAging: number;
  openWork: number;
  blocked: number;
  overdue: number;
  p0: number;
  p1: number;
  readyForQa: number;
  readyForRelease: number;
  openTickets: number;
  slaBreached: number;
  waitingCustomer: number;
  escalatedTickets: number;
  evidenceMissing: number;
  strategicMix: { growth: number; retention: number; payment: number; stability: number; polish: number };
};
