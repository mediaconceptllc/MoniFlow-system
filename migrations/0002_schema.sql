-- MoniFlow: two strictly separated tracks
--   work_items  = internal engineering (never mixed with tickets)
--   tickets     = customer helpdesk / complaints / suggestions

create table if not exists counters (
  name  text primary key,
  value integer not null default 0
);

insert into counters (name, value) values
  ('work_item', 0),
  ('ticket', 0),
  ('comment', 0),
  ('decision', 0),
  ('attachment', 0),
  ('notification', 0),
  ('release', 0),
  ('test_run', 0),
  ('audit', 0)
on conflict (name) do nothing;

create table if not exists profiles (
  id            text primary key,
  email         text,
  display_name  text not null,
  role          text not null default 'requester',
  -- requester | product_owner | tech_lead | developer | qa
  -- release_manager | viewer | admin | support_agent | support_lead
  locale        text not null default 'mn',
  created_at    timestamptz not null default now()
);

create table if not exists work_items (
  id                    text primary key,
  seq                   integer not null,
  title                 text not null,
  type                  text not null,
  -- incident | bug | feature | improvement | tech_debt | security | research | task
  product_module        text not null default 'Chat',
  environment           text not null default 'Production',
  current_behavior      text,
  expected_behavior     text,
  actual_behavior       text,
  steps_to_reproduce    text,
  affected_flow         text,
  affected_users        text,
  flag_growth           boolean not null default false,
  flag_retention        boolean not null default false,
  flag_payment          boolean not null default false,
  flag_stability        boolean not null default false,
  flag_network          boolean not null default false,
  priority              text not null default 'P2',
  priority_rationale    text,
  urgency               text not null default 'normal',
  rank                  integer,
  strategic_fit         integer not null default 2,
  user_impact           integer not null default 2,
  business_impact       integer not null default 2,
  risk_reduction        integer not null default 1,
  time_criticality      integer not null default 2,
  effort                integer not null default 3,
  confidence            text not null default 'med',
  computed_score        real not null default 0,
  owner_name            text,
  owner_id              text,
  assignee_name         text,
  assignee_id           text,
  qa_name               text,
  qa_id                 text,
  sprint                text,
  release_target        text,
  due_date              date,
  status                text not null default 'new',
  acceptance_criteria   text,
  test_scenarios        text,
  ux_link               text,
  api_requirement       text,
  pr_url                text,
  build_url             text,
  version               text,
  device                text,
  os_name               text,
  app_version           text,
  resolution            text,
  root_cause            text,
  lesson                text,
  blocked               boolean not null default false,
  blocker_note          text,
  parent_id             text,
  duplicate_of_id       text,
  created_by            text not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  last_transition_at    timestamptz not null default now()
);

create index if not exists work_items_status_idx on work_items (status);
create index if not exists work_items_priority_idx on work_items (priority);
create index if not exists work_items_assignee_idx on work_items (assignee_id);
create index if not exists work_items_updated_idx on work_items (updated_at desc);

create table if not exists work_item_links (
  id          text primary key,
  from_id     text not null,
  to_id       text not null,
  kind        text not null,
  -- dependency | blocker | related | parent | duplicate
  created_at  timestamptz not null default now()
);

create table if not exists tickets (
  id                  text primary key,
  seq                 integer not null,
  channel             text not null default 'portal',
  -- portal | in_app | email | phone
  category            text not null,
  -- complaint | suggestion | bug | billing | account | other
  subject             text not null,
  body                text not null,
  expected_behavior   text,
  customer_name       text,
  customer_email      text,
  app_user_id         text,
  app_version         text,
  device              text,
  os_name             text,
  environment         text not null default 'Production',
  status              text not null default 'new',
  -- new | open | waiting_customer | waiting_internal | escalated | resolved | closed | duplicate
  priority            text not null default 'normal',
  -- urgent | high | normal | low   (NOT P0-P3 — those belong to engineering)
  assignee_id         text,
  assignee_name       text,
  requester_id        text,
  sla_hours           integer not null default 24,
  sla_due_at          timestamptz,
  first_response_at   timestamptz,
  resolved_at         timestamptz,
  satisfaction        integer,
  duplicate_of_id     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  last_transition_at  timestamptz not null default now()
);

create index if not exists tickets_status_idx on tickets (status);
create index if not exists tickets_requester_idx on tickets (requester_id);
create index if not exists tickets_assignee_idx on tickets (assignee_id);
create index if not exists tickets_updated_idx on tickets (updated_at desc);

-- Escalation bridge only — records stay in their own tables
create table if not exists ticket_escalations (
  id             text primary key,
  ticket_id      text not null,
  work_item_id   text not null,
  reason         text,
  created_by     text not null,
  created_at     timestamptz not null default now()
);

create table if not exists comments (
  id           text primary key,
  entity_type  text not null,
  -- work_item | ticket
  entity_id    text not null,
  author_id    text,
  author_name  text not null,
  kind         text not null default 'note',
  -- question | answer | decision | risk | evidence | note
  body         text not null,
  resolved     boolean not null default false,
  parent_id    text,
  created_at   timestamptz not null default now()
);

create index if not exists comments_entity_idx on comments (entity_type, entity_id, created_at);

create table if not exists decisions (
  id            text primary key,
  work_item_id  text not null,
  kind          text not null,
  -- approve | revise | reject | defer
  rationale     text not null,
  approver_id   text,
  approver_name text not null,
  created_at    timestamptz not null default now()
);

create table if not exists status_transitions (
  id            text primary key,
  entity_type   text not null,
  entity_id     text not null,
  from_status   text,
  to_status     text not null,
  actor_id      text,
  actor_name    text not null,
  reason        text,
  created_at    timestamptz not null default now()
);

create table if not exists attachments (
  id            text primary key,
  entity_type   text not null,
  entity_id     text not null,
  filename      text not null,
  mime          text,
  byte_size     integer,
  caption       text,
  access_scope  text not null default 'internal',
  -- internal | restricted | public
  data_url      text,
  created_by    text,
  created_at    timestamptz not null default now()
);

create table if not exists audit_events (
  id           text primary key,
  actor_id     text,
  actor_name   text not null,
  action       text not null,
  object_type  text not null,
  object_id    text not null,
  metadata     text,
  created_at   timestamptz not null default now()
);

create index if not exists audit_events_object_idx on audit_events (object_type, object_id, created_at);

create table if not exists notifications (
  id          text primary key,
  user_id     text not null,
  title       text not null,
  body        text,
  link        text,
  severity    text not null default 'info',
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (user_id, read, created_at desc);

create table if not exists releases (
  id             text primary key,
  version        text not null,
  environment    text not null default 'Production',
  status         text not null default 'planned',
  -- planned | in_qa | ready | rolling_out | released | rolled_back
  rollout        text,
  rollback_plan  text,
  notes          text,
  owner_name     text,
  owner_id       text,
  released_at    timestamptz,
  created_at     timestamptz not null default now()
);

create table if not exists release_items (
  release_id    text not null,
  work_item_id  text not null,
  primary key (release_id, work_item_id)
);

create table if not exists test_runs (
  id            text primary key,
  work_item_id  text not null,
  title         text not null,
  result        text not null,
  -- pass | fail | blocked | skip
  environment   text,
  evidence      text,
  tester_id     text,
  tester_name   text not null,
  created_at    timestamptz not null default now()
);
