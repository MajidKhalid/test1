# CLAUDE.md — SPARK Project

> Project memory. Loaded every session. Full narrative context: `SPARK_Context_Handoff.md` at repo root (read once for depth).

## The project
**SPARK (شرارة)** — the Ministry of Energy (Saudi Arabia, ITDT dept) governed AI sandbox. Self-hosted open-weight LLMs on Ministry GPU in GCP me-central2 (Dammam), inside the Sandboxes folder. No data leaves the boundary. Run as an internal **product**; the user is sole **Product Owner**.

**THE NARRATIVE — v3.0, do not drift:**
> **The AI Governance Framework is the solution. SPARK is that framework, implemented.**
One solution, two states: *written* (signed July 2026, adopted only by its authors) and *running* (clauses executing automatically). Never frame SPARK as a separate initiative, a companion, or "governance + enablement" — it is the framework's running state. Key line: *"We are following the framework's own instructions for implementing the framework."*

## The user
Abdulmajid Aldamigh (Majid), Strategic Planning Specialist. **Non-developer** — builds via AI. Manager: Nasser Almurshed. Client/skip-level: **Alanoud AlShuraym, GM Digital EA** (framework owner, endorsement target).
**Private, never in stakeholder artifacts:** SPARK is his promotion vehicle this year. Keep all recognition framing out of anything shown to others.

## VERIFIED GCP FACTS (live-checked — trust these)
- Org `moenergy.gov.sa` = `507803040597` → **Isolated Workloads** `726656836540` → **Sandboxes** `969004756048`
- Existing project: `prj-moenergy-iw-sb-development` (number `1044864071282`)
- Billing: `0131EC-6DEF7A-3CB945` — user linked it himself ⇒ has `billing.user`
- **ORG POLICY: all project IDs must start `prj-moenergy-`** (30-char cap). **Workspace naming = org-path derivation (July 2026):** `prj-moenergy-iw-<entity>-<gd>-<dept>-<usecase>` — e.g. `prj-moenergy-iw-it-dtgd-ad-ne` = ITDT · Digital Transformation GD · Applications Dept · Notification Center. Segment codes 2–4 chars from the official org circular (never invented); use-case tag ≤ 4 chars. The old `prj-moenergy-spark-NNN-tag` convention is retired from all artifacts. Engine project alone keeps **`prj-moenergy-spark-000-eng`** (replaced the old non-compliant `spark-ai-services` everywhere).
- `projectCreator` **confirmed by successful test create/delete**
- **GPU quota in me-central2 CONFIRMED** (Google email). L4 / A100 / T4 etc. present. Quota ≠ capacity: on `ZONE_RESOURCE_POOL_EXHAUSTED`, try another zone.
- **Never run `gcloud auth login` in Cloud Shell** — it wipes built-in creds. Fix = ⋮ → Restart.
- **Phase 0 complete.** Next: ask Cloud Computing for VPC/subnet + external-IP setting, then build the GPU VM.

## Settled decisions
- **One project per USE CASE, never per person.** People added via IAM into the use case's project.
- Shared model server; workspaces call `http://INTERNAL_IP:11434` over internal VPC. Firewall `tcp:11434` from internal ranges, tag `spark-model-server`. No public IP.
- **No per-person API keys in v1** — Ollama has no built-in auth; that needs a gateway service. v1 attributes **by project** (labels → billing → showback) = 7 of 9 governance questions answered with zero extra infra. Gateway triggers: >10 workspaces, an authority asking "who uses most" for a real decision, or chargeback.
- Projects created **just-in-time** after intake passes; the pipeline lives in the register, not as empty projects. Exception: the shared engine project.
- Folder-scoped delegated admin; privileged roles → automation by **day 90**; quarterly access reviews; break-glass with Cloud Ops.
- **Budgets ALERT, don't CAP.** Idle GPU schedule (19:00 stop / 07:00 start, Sun–Thu) is the biggest cost control.
- **Spend guardrails (settled, documented in Admin Guide s5 + brief s07):** **Budget A** every workspace — alerts only, one project, all services, monthly, read-only-for-project-users, thresholds **50/85/100% actual + 100% forecasted**, requester emailed via notification channel, events → Pub/Sub **`spark-budget-alerts`**; display name `SPARK-<org path>` maps to the project. **Budget B** only where Vertex AI / Gemini API used — spend-cap enforcement, honestly scoped (caps cover Cloud Run / Vertex / CR Functions / Gemini API, **not Compute Engine** → cannot protect the GPU VM). **Killswitch** = shared Pub/Sub + one Cloud Run fn in the admin project: stops VMs (reversible), never disables billing. Cost data lags hours → forecast threshold is the early warning. Prototype caps ≈ **$100 scale**. Compute-Engine cap gap documented as fact; no live project framed as an uncapped exception in artifacts (Majid, 30 Jul).
- **Portal intake form: supervisor email is required** and the mailto goes to SPARK@MoEnergy.gov.sa **with the supervisor in CC**; email-format validation; clipboard fallback includes the Cc line.
- Live in **Month 1**; contingency = managed services if GPU constrained — the date never moves.
- FinOps: unit cost per validated use case · 2nd GPU only at sustained >60% busy-time · digest carries forecast, >10% variance explained · commitments deferred 6 months.
- **FACT CORRECTED (Majid, 1 Aug 2026): the Ministry DOES have M365 and SharePoint.** The earlier "no M365" premise was wrong. Standing design decisions stay until Majid revisits them (register store = central register list, v1 .xlsx; scheduled automation = Cloud Scheduler → Cloud Function; feed drops = /feeds bucket) — but they are no longer forced by platform absence; revisiting them is an open thread. Artifacts are not personally branded. Credit line: "Prepared and maintained by Abdulmajid Aldamigh — Planning".
- **Customer-portal hosting (decided 1 Aug, criteria = max flexibility + easiest maintenance): host the HTML on the Ministry's existing GCP platform (static file on Cloud Storage / Cloud Run in the SPARK admin project), and use SharePoint/announcements as the *channel* that carries the link.** Rationale: SharePoint modern pages block custom JavaScript (would kill the chat illustration, 3D, and EN/AR switcher) and document libraries download rather than render HTML; GCP static hosting runs the page exactly as built, gives Phase 3 (ecosystem, outside the tenant) a reachable URL with controls, and maintenance = replacing one file. If IT ever mandates SharePoint-native, the page must be re-authored as a native page and loses its interactive layer — decision to be revisited only then.
- **Intake = mailto:** the portal application form and the register intake page both build a pre-filled `mailto:` to **SPARK@MoEnergy.gov.sa** (opens Outlook on the device; client-agnostic; clipboard-copy fallback included). **The mailbox does not exist yet — must be requested from the IT service desk before either form goes live.**
- **Register feeders = 5 + amnesty** (M365/Copilot feeder deleted): SPARK workspaces (automatic, row-at-birth) · portal applications · register intake form (non-SPARK, self-service) · procurement quarterly PO scan · Cyber monthly shadow-AI count · one-time transition amnesty window. Outputs: Command Centre · monthly digest · EA quarterly report.
- **Lafet has a broken `§` glyph** — never use `§` in these files; write **"Clause NN"** (framework clauses) or "section NN" (internal doc refs).
- **Embedded mode:** every page adds `html.embedded` when `window.self!==window.top` (i.e., inside the Hub iframe) → inner sidebar logo + foot hidden, rail slims to 190px. Fixes the double-sidebar look.
- **Command Centre honesty:** SPARK feed auto-loads on open (green LIVE banner). v1 = bundled snapshot refreshed by the operator; v2 = reads the central register list. Ministry-wide rows arrive by dropping the AI Register workbook (SheetJS, in-browser, nothing uploads).

## The two portals (added 1 Aug 2026 — the SPARK launch)
- **`SPARK_Customer_Portal.html`** — the launch page the **official announcement** links to, phase by phase: **Phase 1 IT staff · Phase 2 all MoEnergy staff · Phase 3 energy ecosystem**. Three flip views: ① Introducing SPARK ② Apply (intake form — **line manager email replaces supervisor**, CC'd on the mailto; **+ Project budget (banded select) + Budget justification (textarea, maxlength 600)**; >1800-char mailto auto-falls back to clipboard) ③ "SPARK in action — illustration": simulated ChatGPT-style chat (scripted, honesty chip, NO live model), sidebar + six tool boxes in a 2×3 grid (5 launch-cohort tools + coral "Submit your tool" → Apply view).
- **`SPARK_Leadership_Hub.html`** — the **internal main hub**: all of SPARK presented to leadership in 9 sections (framework running · service & customers · architecture · governance mechanisms · FinOps & guardrails · demand & pipeline (illustrative, labeled) · 3-phase launch plan + three decisions · library linking every artifact).
- **Both follow the official identity package `spark-identity/`** (repo root — source of truth for anything new): SPARK glyph (orange→gold, never recolored/rotated/translated), merged SPARK/طاقتنا رقمية mark with the gradient blade, MOE lockup as separate endorsement (header right / footer "AN INITIATIVE OF"), `--de-*` tokens, glow motifs. **Fonts are embedded base64** (Lafet + IBM Plex Sans Arabic subset woff2 — licensing forbids CDN for Lafet) → the two new pages are fully offline, no Google-Fonts link.
- **New-page patterns (settled):** EN/AR switcher = `data-ar` attributes + `setLang()` walker + `dir` flip; all new CSS uses logical properties so RTL needs no mirror rules; Arabic display headings intentionally fall back to IBM Plex Sans Arabic 700 (**Lafet has no Arabic glyphs**); email bodies keep **English labels** regardless of UI language (register is English-keyed); select options carry English `value` attributes; `prefers-reduced-motion` supported (first in the set); 3D glow shapes = layered translateZ + one shared rAF (mouse tilt + scroll parallax). **Flip-deck verifier rule: `.rv` only in the default view — hidden views use `.fv`, revealed by `switchView()`** (verify.js counts `.rv` globally and never clicks).
- **verify.js flags:** `--form` (fills the application, asserts mailto recipient/CC/budget lines), `--chat` (tool grid, typing lifecycle, submit-tool flip), `--lang` (RTL flip + Arabic-text SVG bounds re-check). All no-op on pages without the hooks. Done-criteria for the two new pages includes a green `--lang` pass.
- **`SPARK_Portal.html` is DELETED** (Majid, 1 Aug — recoverable from git history; its catalog + form live on in the customer portal). Register page cross-links point to `SPARK_Customer_Portal.html#apply`. Old `#portal` Hub deep links intentionally die.
- **Identity rule (Majid, 1 Aug): the legacy artifacts stay on the old look — they won't be used or seen — EXCEPT any page surfaced by the portals must follow spark-identity.** `SPARK_Register_AIUse.html` is linked from the customer portal's journey → rebuilt on the new identity (EN/AR, embedded fonts). If any other legacy page later joins a portal journey, re-skin it first.
- **Launch announcements live in `comms/SPARK_Launch_Announcements.html`** — three phases × Arabic/English with copy-to-clipboard, portal-URL placeholder `[PORTAL-LINK]`; Majid reviews wording before sending.

## Deliverables (9 files, one folder, open SPARK_Hub.html)
`SPARK_Hub.html` (shell; rail + tiles + iframes) · `SPARK_OneStop_DigitalEnergy.html` (**v3.1 brief — two-page structure, 9 sections**: PAGE 1 THE CASE = 01 reality · 02 the Framework elevated (hero mandates→framework→running figure) · 03 SPARK as a service (service promise cards + three customer groups incl. published-use-case adopters + mandate-owner rail + **model catalogue**: Llama 3.1 8B / Qwen 2.5 7B / Mistral 7B live, ALLaM after Clause-13 checks) · 04 sovereign & secure (prompt-travel demo + Cyber strip); PAGE 2 THE PROOF = 05 clause map (load-bearing table kept) · 06 lifecycle workflow (intake→gates→workspace→build→demo→graduate/retire + escalation lane + expiry) · 07 value & guardrails (illustrative stats + Budget A/B + killswitch + runaway-intercepted figure) · 08 month one + objections + three decisions + deliverable index. Diagram language: thin-line stroke icons foreground, pillar shapes as faint `.wm` watermarks ONLY, animated flow dashes + staged `.st` reveals + pulses) · `SPARK_Admin_Guide.html` (**operator guide v2.0, 13 sections** — access granting, foundation, GPU engine **+ API build + how workspaces call it**, money/logs, workspace recipe **+ animated JIT pipeline**, **self-updating AI Register with interactive simulator**, **runbooks R1–R5 merged from the execution manual** + decommission timeline, operate rhythm, prove-it, failures, checklist) · `SPARK_Governance_Command_Centre.html` (auto SPARK feed + optional register-workbook drop) · `SPARK_Automation_Strategy.html` (12 assets incl. the intake-form feed; platform-neutral store; Cloud Scheduler/Function path) · `SPARK_Customer_Portal.html` + `SPARK_Leadership_Hub.html` (see "The two portals" above) · `SPARK_Register_AIUse.html` (**NEW** — non-SPARK AI registration page; mailto submit) · `SPARK_How_It_Works.html` (animated architecture explainer; demo fixed: packets dock at the server port, status pills, scenario-aware caption).
**`SPARK_Execution_Manual.html` is RETIRED** — its content (runbooks, register operating model, intake spec) lives inside the operator guide. Do not re-add it to the Hub.

## Brand
navy `#081631` · blue `#0180E9` · teal `#02636A` · coral `#FE734A` · paper `#F4F6F8`. **Lafet** display font (base64-embedded) + IBM Plex Sans / IBM Plex Sans Arabic. DE + MOE logos base64. Halftone dot motif, reveal-on-scroll, scrollspy sidebar, 4 DE gradient shapes.

## How to work on these HTML files
- Each is **one self-contained file** (assets inlined). Edit in place; never split.
- **Verify every change headlessly before declaring done** (Playwright):
  - all sections render · scrollspy tracks · no JS console errors
  - every inline SVG: no `<text>` outside its `viewBox`, no text-on-text collisions
  - interactive elements actually fire (buttons, tabs, file inputs, animations)
  - test both **standalone** and **inside the Hub iframe** (embedded mode)
  - screenshot key sections and look at them
- `npm i -D playwright && npx playwright install chromium` if absent.

## Working preferences
Finished polished deliverables, not drafts · user writes informally, expects formal output · conservative and defensible (label illustrative figures, ranges over points) · **short emails** · heavy visualization, light text · formal Arabic for gov correspondence · verify current product facts, don't assert from memory · **push back honestly with reasoning** when something is a bad idea.

## Storyline decisions — CONFIRMED by Majid (30 Jul 2026)
1. **Customer groups = THREE:** ① innovators in the KSA energy ecosystem (build in the sandbox, via sponsor) · ② Ministry teams that build (sanctioned lane for their own prototypes) · ③ **every employee in the ecosystem, adopting published use cases** — use cases built by innovators, validated, then published after graduation; they benefit without ever opening a workspace. Mandate owners stay a served-stakeholder rail, not a customer. Brief section 03 carries all three; the lifecycle chip row states "graduation ends in publication".
2. **"The escalated backlog" = the use-case demand list raised to leadership** for prioritisation — a narrative point (brief section 08: demand queued and sequenced, no counts), NOT an ops lane. The lifecycle diagram's gate-escalation lane stays as process design, unrelated to this term.
3. **"The one uncapped live project" is EXCLUDED from artifacts** (ops-side matter; artifacts describe target state). The Compute-Engine spend-cap gap remains documented as a capability fact per Task 8 — no live project is singled out as an exception anywhere.
4. **"Collect the use cases"** kept OUT of artifacts — PO process task; the collection machinery (portal form, register intake, amnesty) already exists in the set.

## Open threads
0a. **Majid reviews the Arabic copy** on both new portals before the announcement goes out (formal register drafted; PO sign-off pending).
0b. **Hosting decision for the customer portal**: settled path = Ministry intranet ("SPARK Playbook" under Digital Energy). Majid floated SharePoint — conflicts with the settled NO-M365 decision and modern SharePoint blocks the page's JS; pages are host-agnostic static files either way. Decide before the Phase-1 announcement.
0c. **Legacy 8 artifacts still wear the pre-identity look** — the spark-identity rebrand of the old set is a follow-up decision, not started.
1. **Request the shared mailbox `SPARK@MoEnergy.gov.sa` from the IT service desk** — the portal application and the register intake page submit to it; both forms are blocked until it exists (they degrade gracefully to clipboard-copy meanwhile).
2. Message Cloud Computing re: VPC/subnet + external-IP for sandbox VMs (blocks the VM build).
3. Build Phase 2: GPU VM → Ollama → 3 models → firewall → idle schedule. Screenshot the first local model answer.
4. Verify **AI-003** in the EA register is actually SPARK, then send the Alanoud email (framework review first, SPARK second; ask to correct AI-003 *upward* to Tier 5).
5. Owner sign-off on each seeded catalog one-liner before the portal goes live.
6. Keep the access-verification evidence for the day-90 review.
7. When the central register list exists, point the Command Centre v2 read at it and retire the bundled SPARK snapshot.
