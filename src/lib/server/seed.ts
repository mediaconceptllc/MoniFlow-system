import type { Sql } from "@/lib/db";
import { computeScore } from "@/lib/scoring";
import { nextId, nextRawId } from "./helpers";

type SeedWork = {
  title: string;
  type: string;
  module: string;
  status: string;
  priority: string;
  rationale: string;
  expected: string;
  actual: string;
  steps: string;
  flow: string;
  users: string;
  flags: { growth?: boolean; retention?: boolean; payment?: boolean; stability?: boolean; network?: boolean };
  scores: { ui: number; bi: number; rr: number; tc: number; sf: number; effort: number; confidence: "low" | "med" | "high" };
  owner: string;
  assignee?: string;
  qa?: string;
  sprint?: string;
  release?: string;
  rank?: number;
  blocked?: boolean;
  blocker?: string;
  acceptance: string;
  device?: string;
  os?: string;
  env?: string;
  pr?: string;
  hoursAgo?: number;
};

const WORK: SeedWork[] = [
  {
    title: "[Android][Samsung A] Unread status does not update",
    type: "bug",
    module: "Chat",
    status: "in_progress",
    priority: "P0",
    rationale: "P0 — user communication state unreliable across Samsung devices.",
    expected: "Unread count and badge update immediately after a message is opened.",
    actual: "Samsung A-series keeps a stale unread badge until force-kill.",
    steps: "1. Receive a message on Samsung A54.\n2. Open the thread.\n3. Return to chat list — badge stays.",
    flow: "Chat list → thread → unread sync",
    users: "Samsung Android cohort, estimated 18% of DAU",
    flags: { retention: true, stability: true },
    scores: { ui: 5, bi: 4, rr: 3, tc: 5, sf: 5, effort: 3, confidence: "high" },
    owner: "Saruul Bat",
    assignee: "Anu Erdene",
    sprint: "2026-W34",
    release: "2.14.0",
    acceptance: "Unread count/state updates correctly online, offline, and after process death on specified Samsung devices.",
    device: "Samsung A54",
    os: "Android 14",
    hoursAgo: 6,
  },
  {
    title: "Force Update gate fails on older Play Store clients",
    type: "incident",
    module: "Platform",
    status: "ready_for_qa",
    priority: "P0",
    rationale: "P0 — users cannot enter the app after a required version bump.",
    expected: "Blocking update dialog with a working store deep-link.",
    actual: "Dialog loops; store link 404s on older Play Store.",
    steps: "Install 2.11, receive force-update remote config, tap Update.",
    flow: "Cold start → version gate",
    users: "Anyone below min supported version",
    flags: { stability: true, retention: true },
    scores: { ui: 5, bi: 5, rr: 4, tc: 5, sf: 4, effort: 2, confidence: "high" },
    owner: "Temuulen",
    assignee: "Khulan",
    qa: "Nomin",
    sprint: "2026-W34",
    release: "2.14.0",
    acceptance: "Force update completes on Play Store and App Store, including devices with store apps older than 12 months.",
    hoursAgo: 3,
  },
  {
    title: "Call log missing after process death",
    type: "bug",
    module: "Call",
    status: "triage",
    priority: "P0",
    rationale: "P0 — core call history is not durable.",
    expected: "Recent calls persist across kill/reinstall-lite.",
    actual: "Log empties after OS kills the process overnight.",
    steps: "Place 3 calls, force-stop app, reopen Call tab.",
    flow: "Call → recents",
    users: "All mobile callers",
    flags: { stability: true, retention: true },
    scores: { ui: 4, bi: 3, rr: 3, tc: 4, sf: 4, effort: 3, confidence: "med" },
    owner: "Saruul Bat",
    acceptance: "Call recents survive process death and airplane-mode restart.",
    hoursAgo: 20,
  },
  {
    title: "Unblock contact does not restore message routing",
    type: "bug",
    module: "Contacts",
    status: "qa_failed",
    priority: "P0",
    rationale: "P0 — unblock is a trust-critical social action.",
    expected: "After unblock, messages and calls route normally.",
    actual: "UI shows unblocked but incoming messages still drop.",
    steps: "Block → Unblock → send message from the other account.",
    flow: "Connections / privacy",
    users: "Anyone using block/unblock",
    flags: { stability: true, network: true },
    scores: { ui: 4, bi: 4, rr: 4, tc: 4, sf: 4, effort: 3, confidence: "high" },
    owner: "Temuulen",
    assignee: "Anu Erdene",
    qa: "Nomin",
    sprint: "2026-W34",
    blocked: true,
    blocker: "Server block-list cache TTL is 6h; needs API change.",
    acceptance: "Unblock is effective within 5 seconds on both clients.",
    hoursAgo: 8,
  },
  {
    title: "Email + OTP path blocks Bogd payment launch",
    type: "incident",
    module: "Auth",
    status: "in_review",
    priority: "P0",
    rationale: "P0 — payment dependency; OTP email delivery is the identity gate.",
    expected: "OTP arrives in <30s on Gmail, Yahoo, and .mn providers.",
    actual: "Unitel and some Gmail filters drop OTP; users cannot complete KYC.",
    steps: "Register with Unitel-forwarded Gmail, request OTP, wait 2 minutes.",
    flow: "Registration → OTP → payment KYC",
    users: "New registrations attempting wallet",
    flags: { payment: true, growth: true, stability: true },
    scores: { ui: 5, bi: 5, rr: 5, tc: 5, sf: 5, effort: 4, confidence: "med" },
    owner: "Saruul Bat",
    assignee: "Khulan",
    sprint: "2026-W34",
    release: "2.14.0",
    acceptance: "OTP success rate ≥ 98% on the top 5 Mongolian email/SMS routes. Fallback SMS works.",
    hoursAgo: 2,
  },
  {
    title: "QR image import fails on cropped gallery photos",
    type: "bug",
    module: "Wallet",
    status: "approved_backlog",
    priority: "P1",
    rationale: "P1 — payment readiness; QR is the in-person pay path.",
    expected: "Any in-focus QR from gallery decodes.",
    actual: "Cropped screenshots and low-contrast prints fail silently.",
    steps: "Save a QR screenshot, crop borders, Import from gallery.",
    flow: "Wallet → scan / import QR",
    users: "Merchants and payers using static QR",
    flags: { payment: true },
    scores: { ui: 4, bi: 5, rr: 2, tc: 4, sf: 5, effort: 2, confidence: "high" },
    owner: "Saruul Bat",
    rank: 1,
    acceptance: "Gallery import succeeds on 10 fixture QRs including cropped and printed samples.",
    hoursAgo: 28,
  },
  {
    title: "iOS incoming call profile photo is blank",
    type: "bug",
    module: "Call",
    status: "ready_for_release",
    priority: "P1",
    rationale: "Visible defect on a core flow; quick win.",
    expected: "Callee sees the caller's avatar on the full-screen incoming UI.",
    actual: "Placeholder silhouette on iOS 17+ CallKit overlay.",
    steps: "Call from an account with a custom avatar to an iPhone 15.",
    flow: "Incoming call",
    users: "iOS callers",
    flags: { retention: true },
    scores: { ui: 3, bi: 2, rr: 1, tc: 3, sf: 3, effort: 2, confidence: "high" },
    owner: "Temuulen",
    assignee: "Anu Erdene",
    qa: "Nomin",
    sprint: "2026-W34",
    release: "2.14.0",
    pr: "https://git.example/monichat/pull/441",
    acceptance: "Avatar renders on CallKit and in-app incoming screens.",
    hoursAgo: 1,
  },
  {
    title: "Mongolian copy typos on registration and OTP screens",
    type: "bug",
    module: "Auth",
    status: "in_progress",
    priority: "P1",
    rationale: "Visible defect; trust and comprehension for MN users.",
    expected: "Correct Mongolian orthography, no mixed encodings.",
    actual: "Several labels use Latin lookalikes; one button reads «Нэвтэрнэ үү».",
    steps: "Set locale MN, walk registration.",
    flow: "Registration, OTP",
    users: "MN locale (majority)",
    flags: { growth: true },
    scores: { ui: 3, bi: 3, rr: 1, tc: 3, sf: 3, effort: 1, confidence: "high" },
    owner: "Saruul Bat",
    assignee: "Khulan",
    sprint: "2026-W34",
    acceptance: "Copy reviewed by native speaker; no remaining typos on auth surfaces.",
    hoursAgo: 10,
  },
  {
    title: "Hide login name on public profile",
    type: "improvement",
    module: "Contacts",
    status: "needs_info",
    priority: "P1",
    rationale: "Privacy quick win before payment launch.",
    expected: "Login handle is not shown on the public profile card.",
    actual: "Phone / email fragment leaks on profile header.",
    steps: "Open a contact profile that registered with phone.",
    flow: "Profile",
    users: "All profiles",
    flags: { payment: true, stability: true },
    scores: { ui: 3, bi: 3, rr: 4, tc: 3, sf: 3, effort: 2, confidence: "med" },
    owner: "Saruul Bat",
    acceptance: "Public profile shows display name only; login identifiers stay private.",
    hoursAgo: 40,
  },
  {
    title: "iOS Dynamic Type ignored in chat bubbles",
    type: "bug",
    module: "Chat",
    status: "approved_backlog",
    priority: "P2",
    rationale: "User-visible accessibility issue; non-critical.",
    expected: "Chat bubble type scales with iOS font size.",
    actual: "Composer scales, bubbles stay 15pt.",
    steps: "Settings → Accessibility → Larger text, open a thread.",
    flow: "Chat thread",
    users: "iOS users with larger text",
    flags: { retention: true },
    scores: { ui: 3, bi: 2, rr: 1, tc: 1, sf: 2, effort: 2, confidence: "high" },
    owner: "Temuulen",
    rank: 4,
    acceptance: "Bubbles, timestamps, and composer respect Dynamic Type up to AX5.",
    hoursAgo: 72,
  },
  {
    title: "Hub icon contrast fails on dark wallpaper",
    type: "improvement",
    module: "Feed",
    status: "approved_backlog",
    priority: "P2",
    rationale: "User-visible, non-critical.",
    expected: "Hub glyph remains visible on light and dark wallpapers.",
    actual: "Dark-on-dark on OLED.",
    steps: "Set a black wallpaper, inspect tab bar.",
    flow: "App hub / tab bar",
    users: "Android OLED",
    flags: {},
    scores: { ui: 2, bi: 1, rr: 0, tc: 1, sf: 1, effort: 1, confidence: "high" },
    owner: "Saruul Bat",
    rank: 6,
    acceptance: "Contrast ≥ 3:1 against both wallpaper extremes.",
    hoursAgo: 96,
  },
  {
    title: "Send Contact card missing vCard preview",
    type: "feature",
    module: "Chat",
    status: "triage",
    priority: "P2",
    rationale: "User-visible share flow.",
    expected: "Sending a contact shows a preview card before send.",
    actual: "Sends immediately; receiver sees raw number.",
    steps: "Thread → attach → contact → pick.",
    flow: "Chat attach",
    users: "Anyone sharing contacts",
    flags: { network: true },
    scores: { ui: 3, bi: 2, rr: 1, tc: 2, sf: 2, effort: 3, confidence: "med" },
    owner: "Saruul Bat",
    acceptance: "Preview + confirm; receiver sees name, avatar, and tap-to-save.",
    hoursAgo: 30,
  },
  {
    title: "Chat pin does not survive relogin",
    type: "bug",
    module: "Chat",
    status: "deferred",
    priority: "P3",
    rationale: "Parity / polish — pin is not a 2026 growth lever.",
    expected: "Pinned threads stay pinned after logout.",
    actual: "Pins reset on token refresh.",
    steps: "Pin 2 chats, log out, log in.",
    flow: "Chat list pin",
    users: "Power users",
    flags: {},
    scores: { ui: 2, bi: 1, rr: 0, tc: 1, sf: 1, effort: 2, confidence: "high" },
    owner: "Temuulen",
    acceptance: "Pins stored server-side and restored on login.",
    hoursAgo: 200,
  },
  {
    title: "Sticker pack picker empty state",
    type: "improvement",
    module: "Chat",
    status: "approved_backlog",
    priority: "P3",
    rationale: "Polish / later.",
    expected: "Empty sticker tab explains how to add packs.",
    actual: "Blank pane.",
    steps: "Open sticker tab on a fresh account.",
    flow: "Composer → stickers",
    users: "New accounts",
    flags: {},
    scores: { ui: 1, bi: 1, rr: 0, tc: 0, sf: 1, effort: 1, confidence: "high" },
    owner: "Saruul Bat",
    rank: 12,
    acceptance: "Empty state with one clear action.",
    hoursAgo: 150,
  },
  {
    title: "Emoji skin-tone picker clipped on small Android",
    type: "bug",
    module: "Chat",
    status: "new",
    priority: "P3",
    rationale: "Polish.",
    expected: "Skin-tone flyout fully visible.",
    actual: "Bottom of flyout clipped on 5.5\" devices.",
    steps: "Long-press 👍 on a small Android.",
    flow: "Composer emoji",
    users: "Small-screen Android",
    flags: {},
    scores: { ui: 1, bi: 0, rr: 0, tc: 0, sf: 0, effort: 1, confidence: "high" },
    owner: "Temuulen",
    acceptance: "Flyout repositions above the composer on short screens.",
    hoursAgo: 4,
  },
  {
    title: "Presence status stays green after 30 minutes idle",
    type: "bug",
    module: "Chat",
    status: "new",
    priority: "P3",
    rationale: "Parity / later.",
    expected: "Idle after 5 minutes, offline after app backgrounded 10 minutes.",
    actual: "Green presence persists.",
    steps: "Leave app in foreground idle for 30 minutes.",
    flow: "Presence",
    users: "All contacts viewing presence",
    flags: {},
    scores: { ui: 2, bi: 1, rr: 0, tc: 1, sf: 1, effort: 2, confidence: "med" },
    owner: "Saruul Bat",
    acceptance: "Presence matches documented idle/offline timers ±30s.",
    hoursAgo: 2,
  },
  {
    title: "Lucky Draw engine",
    type: "feature",
    module: "Feed",
    status: "approved_backlog",
    priority: "P2",
    rationale: "Roadmap — acquisition campaign mechanic. Needs metric owner.",
    expected: "Fair, auditable draw with participation event.",
    actual: "Not built.",
    steps: "n/a — new capability",
    flow: "Campaigns",
    users: "Growth experiments",
    flags: { growth: true, network: true },
    scores: { ui: 4, bi: 5, rr: 1, tc: 3, sf: 5, effort: 5, confidence: "low" },
    owner: "Saruul Bat",
    rank: 8,
    acceptance: "Hypothesis, event tracking, and rollout experiment fields filled before develop.",
    hoursAgo: 48,
  },
  {
    title: "Referral attribution",
    type: "feature",
    module: "Onboarding",
    status: "triage",
    priority: "P1",
    rationale: "Acquisition lever toward 2026-12-31 gate.",
    expected: "Install → first session attributed to a referrer with fraud controls.",
    actual: "No attribution; growth team flying blind.",
    steps: "n/a",
    flow: "Invite → install → first action",
    users: "New users via invite",
    flags: { growth: true, network: true },
    scores: { ui: 4, bi: 5, rr: 2, tc: 4, sf: 5, effort: 4, confidence: "med" },
    owner: "Saruul Bat",
    acceptance: "Attributed installs reported within 1h; self-referral blocked.",
    hoursAgo: 12,
  },
  {
    title: "Group activation after first 3 members",
    type: "feature",
    module: "Chat",
    status: "deferred",
    priority: "P2",
    rationale: "Network-effect roadmap. Deferred pending analytics events.",
    expected: "Prompt and tools to get a group to 3 active members in 7 days.",
    actual: "Groups created then go silent.",
    steps: "n/a",
    flow: "Group create → activation",
    users: "New group creators",
    flags: { network: true, retention: true },
    scores: { ui: 4, bi: 4, rr: 1, tc: 2, sf: 4, effort: 4, confidence: "low" },
    owner: "Saruul Bat",
    acceptance: "D7 group activation rate instrumented and moved by the experiment.",
    hoursAgo: 160,
  },
  {
    title: "First-action onboarding",
    type: "feature",
    module: "Onboarding",
    status: "approved_backlog",
    priority: "P1",
    rationale: "D7 retention — get a first message or call in session 1.",
    expected: "Guided first action with skip, measured event.",
    actual: "Empty inbox after registration.",
    steps: "Fresh install → register → land.",
    flow: "Onboarding",
    users: "New registrations",
    flags: { retention: true, growth: true },
    scores: { ui: 5, bi: 5, rr: 1, tc: 4, sf: 5, effort: 3, confidence: "med" },
    owner: "Saruul Bat",
    rank: 2,
    sprint: "2026-W35",
    acceptance: "≥40% of new users complete a first action in session 1 on the treatment cohort.",
    hoursAgo: 18,
  },
  {
    title: "Analytics / events foundation",
    type: "tech_debt",
    module: "Platform",
    status: "in_progress",
    priority: "P1",
    rationale: "Without events, every growth bet is a guess.",
    expected: "Canonical event dictionary for acquisition, D7/D30, payment, calls.",
    actual: "Ad-hoc logs; no identity join.",
    steps: "n/a",
    flow: "Platform analytics",
    users: "Internal",
    flags: { growth: true, retention: true, payment: true },
    scores: { ui: 2, bi: 5, rr: 3, tc: 4, sf: 5, effort: 4, confidence: "med" },
    owner: "Temuulen",
    assignee: "Khulan",
    sprint: "2026-W34",
    acceptance: "Event dictionary published; 10 core events firing in prod with user_id.",
    hoursAgo: 5,
  },
  {
    title: "Bogd payment integration",
    type: "feature",
    module: "Payments",
    status: "triage",
    priority: "P0",
    rationale: "Payment launch — 2026 strategic gate. Wallet QR + Bogd rails.",
    expected: "Top-up, QR pay, and settlement against Bogd with KYC gates.",
    actual: "Spec only.",
    steps: "n/a",
    flow: "Wallet",
    users: "Payment cohort",
    flags: { payment: true, growth: true },
    scores: { ui: 5, bi: 5, rr: 5, tc: 5, sf: 5, effort: 5, confidence: "low" },
    owner: "Saruul Bat",
    acceptance: "Sandbox end-to-end with Bogd; production gated on OTP + KYC.",
    hoursAgo: 9,
  },
];

type SeedTicket = {
  subject: string;
  category: string;
  priority: string;
  status: string;
  body: string;
  expected?: string;
  customer: string;
  email: string;
  device?: string;
  os?: string;
  app?: string;
  assignee?: string;
  hoursAgo?: number;
  slaHours?: number;
  firstResponse?: boolean;
};

const TICKETS: SeedTicket[] = [
  {
    subject: "OTP ирсэнгүй — Unitel дугаар",
    category: "account",
    priority: "urgent",
    status: "open",
    body: "Шинэ бүртгэл хийхэд OTP ирсэнгүй. Unitel 99xx дугаар. Гурав дахин илгээсэн.",
    expected: "OTP 30 секундэд ирнэ.",
    customer: "Б. Энхжин",
    email: "enkhjin.b@example.mn",
    device: "Redmi Note 12",
    os: "Android 13",
    app: "2.13.4",
    assignee: "Enkhjin Support",
    hoursAgo: 1,
    slaHours: 4,
    firstResponse: true,
  },
  {
    subject: "Premium төлбөр хоёр удаа суутгагдсан",
    category: "billing",
    priority: "high",
    status: "waiting_internal",
    body: "8-р сарын 18-нд Premium 9,900₮ хоёр удаа банкны хуулга дээр харагдана. Буцаан олгоно уу.",
    customer: "Г. Бат-Эрдэнэ",
    email: "baterdene@example.mn",
    device: "iPhone 14",
    os: "iOS 17.5",
    app: "2.13.4",
    assignee: "Enkhjin Support",
    hoursAgo: 18,
    slaHours: 12,
    firstResponse: true,
  },
  {
    subject: "Чат дэлгэцэнд dark mode нэмэх санал",
    category: "suggestion",
    priority: "low",
    status: "new",
    body: "Шөнө чат ашиглахад цагаан дэвсгэр нүд өвдөнө. Системийн dark mode-той нийцүүлбэл сайн.",
    customer: "М. Номин",
    email: "nomin.m@example.mn",
    device: "Pixel 7",
    os: "Android 15",
    app: "2.13.2",
    hoursAgo: 5,
    slaHours: 72,
  },
  {
    subject: "Дуут мессеж Xiaomi дээр тоглогдохгүй",
    category: "bug",
    priority: "high",
    status: "escalated",
    body: "Найзын илгээсэн voice message дарахад spinner эргээд зогсоно. Бусад утас дээр ажиллана.",
    expected: "Voice message шууд тоглоно.",
    customer: "Т. Дөлгөөн",
    email: "dulgoon@example.mn",
    device: "Xiaomi 13T",
    os: "Android 14",
    app: "2.13.4",
    assignee: "Enkhjin Support",
    hoursAgo: 26,
    slaHours: 12,
    firstResponse: true,
  },
  {
    subject: "Группийн админ шалтгаангүй хассан",
    category: "complaint",
    priority: "normal",
    status: "waiting_customer",
    body: "Гэр бүлийн группээс хасагдсан. Админ нь ах. Буцааж оруулах боломжтой юу, лог харах уу?",
    customer: "С. Оюун",
    email: "oyun.s@example.mn",
    device: "Samsung S23",
    os: "Android 14",
    app: "2.13.4",
    assignee: "Enkhjin Support",
    hoursAgo: 30,
    slaHours: 24,
    firstResponse: true,
  },
  {
    subject: "Дэлгүүрийн QR уншигдсангүй",
    category: "bug",
    priority: "high",
    status: "open",
    body: "Номин дэлгүүрт төлөхөөр QR галерейгаас оруулахад «уншигдсангүй» гэж гарна. Камер ч мөн.",
    expected: "Хэвлэсэн QR уншина.",
    customer: "Ч. Ганбат",
    email: "ganbat.c@example.mn",
    device: "iPhone 12",
    os: "iOS 16.7",
    app: "2.13.1",
    hoursAgo: 7,
    slaHours: 12,
  },
  {
    subject: "Зургийн цомог нээхэд апп унана",
    category: "bug",
    priority: "urgent",
    status: "new",
    body: "Чат руу зураг явуулах гэж gallery нээхэд шууд хаагдана. Гурав дахин давтагдсан.",
    customer: "Э. Хулан",
    email: "khulan.e@example.mn",
    device: "Samsung A14",
    os: "Android 13",
    app: "2.13.4",
    hoursAgo: 0.5,
    slaHours: 4,
  },
  {
    subject: "Мессеж 5 минутын дотор татах санал",
    category: "suggestion",
    priority: "normal",
    status: "open",
    body: "Буруу явуулсан мессежээ 5 мин дотор устгах боломж хэрэгтэй.",
    customer: "А. Тэмүүлэн",
    email: "temuulen.a@example.mn",
    device: "iPhone 15",
    os: "iOS 18",
    app: "2.13.4",
    hoursAgo: 50,
    slaHours: 24,
    firstResponse: true,
  },
  {
    subject: "4G дээр видео дуудлага тасардаг",
    category: "bug",
    priority: "high",
    status: "waiting_internal",
    body: "Хот дотор 4G дээр видео дуудлага 20 секундэд тасарна. Wi-Fi дээр зүгээр.",
    customer: "Ж. Мөнх-Эрдэнэ",
    email: "munkherdene@example.mn",
    device: "Oppo Reno 10",
    os: "Android 14",
    app: "2.13.3",
    assignee: "Enkhjin Support",
    hoursAgo: 14,
    slaHours: 12,
    firstResponse: true,
  },
  {
    subject: "Шинэчлэлтийн дараа хэл солигдсон",
    category: "complaint",
    priority: "normal",
    status: "resolved",
    body: "2.13.4 руу шинэчлэхэд UI англи болсон. Монгол руу буцаахад settings-аас солигдохгүй байсан — одоо зүгээр.",
    customer: "Д. Алтанцэцэг",
    email: "altantsetseg@example.mn",
    device: "iPhone 11",
    os: "iOS 17.4",
    app: "2.13.4",
    assignee: "Enkhjin Support",
    hoursAgo: 80,
    slaHours: 24,
    firstResponse: true,
  },
];

export async function seedIfEmpty(sql: Sql): Promise<void> {
  const existing = await sql<{ n: number }>`select count(*)::int as n from work_items`;
  if (Number(existing[0]?.n ?? 0) > 0) return;

  const workIds: string[] = [];
  for (const w of WORK) {
    const id = await nextId(sql, "work_item", "MC");
    workIds.push(id);
    const score = computeScore({
      user_impact: w.scores.ui,
      business_impact: w.scores.bi,
      risk_reduction: w.scores.rr,
      time_criticality: w.scores.tc,
      strategic_fit: w.scores.sf,
      confidence: w.scores.confidence,
      effort: w.scores.effort,
    });
    const created = new Date(Date.now() - (w.hoursAgo ?? 8) * 3600000).toISOString();
    await sql`
      insert into work_items (
        id, seq, title, type, product_module, environment,
        current_behavior, expected_behavior, actual_behavior, steps_to_reproduce,
        affected_flow, affected_users,
        flag_growth, flag_retention, flag_payment, flag_stability, flag_network,
        priority, priority_rationale, urgency, rank,
        strategic_fit, user_impact, business_impact, risk_reduction, time_criticality,
        effort, confidence, computed_score,
        owner_name, assignee_name, qa_name,
        sprint, release_target, status, acceptance_criteria,
        device, os_name, app_version, pr_url,
        blocked, blocker_note, created_by, created_at, updated_at, last_transition_at
      ) values (
        ${id}, ${Number(id.split("-")[1])}, ${w.title}, ${w.type}, ${w.module}, ${w.env ?? "Production"},
        ${w.actual}, ${w.expected}, ${w.actual}, ${w.steps},
        ${w.flow}, ${w.users},
        ${w.flags.growth ?? false}, ${w.flags.retention ?? false}, ${w.flags.payment ?? false},
        ${w.flags.stability ?? false}, ${w.flags.network ?? false},
        ${w.priority}, ${w.rationale}, ${w.priority === "P0" ? "immediate" : w.priority === "P1" ? "soon" : "normal"},
        ${w.rank ?? null},
        ${w.scores.sf}, ${w.scores.ui}, ${w.scores.bi}, ${w.scores.rr}, ${w.scores.tc},
        ${w.scores.effort}, ${w.scores.confidence}, ${score},
        ${w.owner}, ${w.assignee ?? null}, ${w.qa ?? null},
        ${w.sprint ?? null}, ${w.release ?? null}, ${w.status}, ${w.acceptance},
        ${w.device ?? null}, ${w.os ?? null}, ${"2.13.4"}, ${w.pr ?? null},
        ${w.blocked ?? false}, ${w.blocker ?? null}, ${"system"},
        ${created}, ${created}, ${created}
      )
    `;
    const tid = await nextRawId(sql, "audit");
    await sql`
      insert into status_transitions (id, entity_type, entity_id, from_status, to_status, actor_name, reason, created_at)
      values (${tid}, ${"work_item"}, ${id}, ${"new"}, ${w.status}, ${w.owner}, ${"Seeded from MoniChat 2026-08-20 board"}, ${created})
    `;
  }

  // Decision on Bogd (last item-ish) and unread
  const unread = workIds[0];
  const bogd = workIds[workIds.length - 1];
  const d1 = await nextRawId(sql, "decision");
  await sql`
    insert into decisions (id, work_item_id, kind, rationale, approver_name)
    values (${d1}, ${unread}, ${"approve"}, ${"P0 remains. Retention risk if unread state stays wrong through September."}, ${"Saruul Bat"})
  `;
  const d2 = await nextRawId(sql, "decision");
  await sql`
    insert into decisions (id, work_item_id, kind, rationale, approver_name)
    values (${d2}, ${bogd}, ${"revise"}, ${"Scope to sandbox QR pay + KYC. Lucky Draw is not a payment dependency — keep it on the roadmap list, not this item."}, ${"Saruul Bat"})
  `;

  const c1 = await nextRawId(sql, "comment");
  await sql`
    insert into comments (id, entity_type, entity_id, author_name, kind, body)
    values (${c1}, ${"work_item"}, ${unread}, ${"Anu Erdene"}, ${"risk"}, ${"Local cache of unread is written before ack from sync API. Samsung OEM battery savers freeze the worker."})
  `;
  const c2 = await nextRawId(sql, "comment");
  await sql`
    insert into comments (id, entity_type, entity_id, author_name, kind, body)
    values (${c2}, ${"work_item"}, ${workIds[3]}, ${"Nomin"}, ${"evidence"}, ${"QA failed: unblock UI updates, incoming still dropped for 6h. Log attached in test run."})
  `;

  const tr = await nextRawId(sql, "test_run");
  await sql`
    insert into test_runs (id, work_item_id, title, result, environment, evidence, tester_name)
    values (${tr}, ${workIds[3]}, ${"Unblock round-trip on two devices"}, ${"fail"}, ${"Android 14 pair"}, ${"Message from B never arrives at A after unblock. Screenshot of drop in server log line 4412."}, ${"Nomin"})
  `;

  const rel = await nextId(sql, "release", "REL");
  await sql`
    insert into releases (id, version, environment, status, rollout, rollback_plan, notes, owner_name)
    values (
      ${rel}, ${"2.14.0"}, ${"Production"}, ${"in_qa"},
      ${"10% → 50% → 100% over 48h. Halt on crash-free < 99.5%."},
      ${"Revert to 2.13.4 via remote config force pin. OTP fallback stays on SMS."},
      ${"Includes force-update fix, iOS call avatar, unread (if QA passes), OTP email."},
      ${"Bold Release"}
    )
  `;
  for (const idx of [0, 1, 6, 4]) {
    await sql`insert into release_items (release_id, work_item_id) values (${rel}, ${workIds[idx]}) on conflict do nothing`;
  }

  const ticketIds: string[] = [];
  for (const t of TICKETS) {
    const id = await nextId(sql, "ticket", "HD");
    ticketIds.push(id);
    const created = new Date(Date.now() - (t.hoursAgo ?? 8) * 3600000);
    const slaDue = new Date(created.getTime() + (t.slaHours ?? 24) * 3600000);
    const first = t.firstResponse ? new Date(created.getTime() + 25 * 60000).toISOString() : null;
    const resolved = t.status === "resolved" ? new Date(created.getTime() + 6 * 3600000).toISOString() : null;
    await sql`
      insert into tickets (
        id, seq, channel, category, subject, body, expected_behavior,
        customer_name, customer_email, app_version, device, os_name, environment,
        status, priority, assignee_name, sla_hours, sla_due_at, first_response_at, resolved_at,
        created_at, updated_at, last_transition_at
      ) values (
        ${id}, ${Number(id.split("-")[1])}, ${"portal"}, ${t.category}, ${t.subject}, ${t.body}, ${t.expected ?? null},
        ${t.customer}, ${t.email}, ${t.app ?? null}, ${t.device ?? null}, ${t.os ?? null}, ${"Production"},
        ${t.status}, ${t.priority}, ${t.assignee ?? null}, ${t.slaHours ?? 24}, ${slaDue.toISOString()}, ${first}, ${resolved},
        ${created.toISOString()}, ${created.toISOString()}, ${created.toISOString()}
      )
    `;
  }

  // Escalate Xiaomi voice + QR shop tickets conceptually — link voice to a new comment
  const voice = ticketIds[3];
  const qrTicket = ticketIds[5];
  const gallery = ticketIds[6];

  const escId = await nextRawId(sql, "audit");
  await sql`
    insert into ticket_escalations (id, ticket_id, work_item_id, reason, created_by)
    values (${escId}, ${voice}, ${unread}, ${"Possible media playback on Xiaomi — engineering to inspect. Kept as helpdesk ticket; engineering owns the linked bug separately."}, ${"system"})
  `;
  // Link QR ticket to QR work item
  const esc2 = await nextRawId(sql, "audit");
  await sql`
    insert into ticket_escalations (id, ticket_id, work_item_id, reason, created_by)
    values (${esc2}, ${qrTicket}, ${workIds[5]}, ${"Matches P1 QR image import. Ticket stays in helpdesk; work item stays on the engineering board."}, ${"system"})
  `;

  const tc = await nextRawId(sql, "comment");
  await sql`
    insert into comments (id, entity_type, entity_id, author_name, kind, body)
    values (${tc}, ${"ticket"}, ${ticketIds[0]}, ${"Enkhjin Support"}, ${"answer"}, ${"OTP-г SMS нөөцөөр илгээлээ. Unitel email gateway дээр SPF алдаатай байгаа — инженер рүү шилжүүлэхгүй, auth incident аль хэдийн нээлттэй."})
  `;
  const tc2 = await nextRawId(sql, "comment");
  await sql`
    insert into comments (id, entity_type, entity_id, author_name, kind, body)
    values (${tc2}, ${"ticket"}, ${gallery}, ${"Enkhjin Support"}, ${"question"}, ${"Галерей нээхэд унаж байна. Samsung A14 + Android 13. Лог илгээнэ үү?"})
  `;
}
