# V4_PROGRESS.md · SPARK_Site v4 revision tracker

> Session continuity file per the v4 brief (section 0). A fresh session resumes from this file + the v4 brief + `SPARK_Site/CLAUDE.md`. Tick an item only when its verification is green. Commit after each completed item.

## Session facts (established 1 Aug 2026, first v4 session)

- Work branch: `claude/spark-site-v4-revision-jzjiqk`, based on `origin/claude/spark-context-handoff-bm0eoh` (the v3 build; `main` does not contain the site).
- The `refs/` pack arrived as five annotated screenshots attached to the brief (not as files in the repo). Descriptions for future sessions:
  - **ref1**: How It Works section 01 figure. Sandboxes folder 969004756048 contains the shared engine card `prj-moenergy-spark-000-eng` (spark-model-server, 1 x L4 GPU, Ollama, 10.20.0.5:11434, models Llama 3.1 / Qwen 2.5 / Mistral, "one copy, shared by everyone") with dashed links to three isolated workspace cards (OCR pilot ITDT Apps, Contracts Q&A Legal, Load forecast Planning), each with people/budget/expiry/register-row; caption "every workspace calls the same private address, internal network only"; below, a "Why one project each" explainer box. Also shows the anchor-offset bug: section heading clipped under sticky bar.
  - **ref2**: the two seeded SPARK ASSISTANT bubbles shown on load ("Welcome to SPARK — the Ministry's innovation sandbox..." and "Innovators are already building here...") = what to delete for empty first load.
  - **ref3**: Claude's design UI. Chat input on top; green box = template-tile grid area below the input (adopt this zone for tool tiles); red box = the design-system chip row inside the input (do not reproduce).
  - **ref4**: Hub rail active item and page scrollspy active item both wearing the same blue pill = the hierarchy bug to fix (2.5).
  - **ref5**: brief mandates→framework→SPARK figure; red square = dead whitespace band above the caption; green circle = broken spacing inside the SPARK card (6.1).
- Environment: Playwright + Chromium pre-installed (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`). `npm run verify -- SPARK_Site/<file>.html` is the harness.
- Items the brief says to "show Majid before locking" (3.1 headline options, 3.3 empty-state greeting alternates, 7 page name): session is autonomous — implement the recommended option, list all proposals in the change report + PR body for Majid to swap.

## Phase A — structure, content, bug fixes

### ① Deletions and restructure (brief sections 4, 7)
- [x] 4 · Leadership Hub: scanned (7 unique items listed for Majid in change report: L6 demand table, L6 KPI/funnel numbers, L6 leadership-call flags, L7 newer three-decisions set incl. AI-003 correction ask [survives as CLAUDE.md open thread 4], L0 "Launched" status chip, full formal-AR leadership narrative, 2 punch lines); file deleted; only inbound refs were Hub-internal, all removed
- [x] 7 · Three Faces page: `SPARK_Three_Faces.html` created (name shipped: "The three faces of SPARK"; alternates for Majid: "SPARK, three ways" / "Who SPARK serves"). Verify green incl. --lang + embedded. NOTE: ch.1 journey strip + ch.2 chat mock are first-pass; upgrade to the ref1-adapted animation + faithful Nawaf mirror AFTER Portal rework (dependency noted in brief order deviation)
- [x] 7 · "THE TWO FACES" rail group retired; Admin Guide out of public nav (file stays); Command Centre out of rail/tiles, linked from Three Faces ch.3 (target _blank)
- [x] 7 · Hub rail, tiles (6, renumbered), names map, iframes updated; Hub home copy now three-faces; Hub visible text em-dash-free; old #lead/#guide/#centre deep links fall back to home (same pattern as retired #portal)

### ② Customer Portal (brief section 3) — verify green (--form --chat --lang, embedded, RTL)
- [x] 3.1 · Framework-led opening cut (h1/lead/strip chip/i2 h2+sub reframed value-first); trust line added end of i2: "Runs under the Ministry's AI Governance Framework"; old motif-float hero scene removed (file ~250KB lighter)
- [x] 3.1 · New hero journey loop (16s CSS, no WebGL): application → labels ✓ → approved → workspace live inside "Ministry boundary · Sandboxes folder" → private-internal-call packets to shared engine (Beta · Phase 2 badge, greyed dashes) → same event rows appearing in governance log. Reduced-motion = static final state
- [x] 3.1 · Headline shipped: "A governed space to build with AI. Apply today, build tomorrow." (brief's starting point). Alternates for Majid in change report: "Your idea, running on Ministry ground..." / "Compute, models, and a green light..."
- [x] 3.2 · Budget numeric input (inputmode=decimal, placeholder "80 USD" / AR "80 دولاراً"), BUDGET_RE validation, label "Monthly project budget (USD)", body line "Project budget (USD, monthly)"; every band/range string updated incl. cost-tool chat script (EN+AR)
- [x] 3.2 · Mailto reversed everywhere: href = mailto:<line manager>?cc=SPARK@MoEnergy.gov.sa; envelope(), form note, flow3 card, lmmail hint, clipboard fallback + Copied strings, success note (EN+AR); verify.js --form updated and green
- [x] 3.3 · Nawaf / نواف + "Powered by SPARK" sub-line; honesty chip kept (em-dash-free); who-label + placeholder updated
- [x] 3.3 · Seeded messages deleted (SCRIPTS.open removed); _chatOpen = empty state; greeting shipped: "Energy has its home" / "للطاقة هنا بيت" (Majid's suggestion). Alternates in report: "Where energy comes to think" / "Home ground for energy ideas"
- [x] 3.3 · Rail: Tools → Chat history (3 illustrative items, replay scripts) → account block pinned bottom (illustrative, sign-in at launch)
- [x] 3.3 · Colorful gradient tool logos (.tlogo per tool) in rail + tiles; coral Submit-your-tool tile kept (flip verified)
- [x] 3.3 · Tool click inserts "/toolkey " + helper card above input (desc + example prompt, ✕ close); send plays script; slash-command parsing in send()
- [x] 3.3 · ref3 layout: chathead → helper slot → composer on top → toolzone grid below; no chip row; verify.js --chat rewritten for new contract
- NOTE: FALLBACKS + cap now say the model service arrives Phase 2 (rule 2.8 honesty); pager tab label em-dash-free

### ③ Product Brief (brief section 6) — verify green (--demo --counters, 59/59 rv, 40/40 st, embedded)
- [x] 6.1 · Figure rebuilt: viewBox 960x490 (dead band killed), SPARK card re-rhythmed (24px line steps, box fits), em dashes scrubbed inside figure/caption/state cards/punch. GOTCHA fixed: old figure had nested icon <svg> closers, first replacement left a 7.8KB fragment rendering as stray text; excised
- [x] 6.2 · Group ② now "MoEnergy leadership" (governance, visibility, sector enablement); h1 + cards 1/3 scrubbed; override recorded for CLAUDE.md
- [x] 6.3 · Retitled "LLMs as a service · quality output at minimal spend" + Beta · Phase 2 chip; lead = one-shared-engine/never-buy-models message + "opens with V2"; NEW hub-and-spoke SVG (engine + 4 spokes incl. "+ your use case", animated flows + packets); table kept, em dashes scrubbed; "SPARK Portal catalogue" → customer portal; service card "Approved models, on tap" badged Beta · Phase 2
- [x] 6.4 · h1 "Sovereign by design. Data never leaves the Ministry's boundary."; lead rewritten (KSA = floor); demo SVG now nested rings (gold dashed KSA outer + green MoEnergy inner, all actors inside, internet actor moved outside both rings); svNote/narration JS strings updated (boundary language + em dashes)
- [x] 6.5 · Cyber block removed (h1 + 4 cards); section chips kept, gating-check chip scrubbed
- [x] 6.6 · Fast lane: "light EA & Cyber review" → "light EA review"; caption + Tier-0 line scrubbed
- [x] 6.7 · "One honest implication" card removed
- [x] 6.8 · Escalation arrows now class="flow" (animate like all flows); 6a/6b sub-text wrapped with tspans inside boxes; block-wide em dashes scrubbed
- [x] 6.9 · "Stated plainly" = month-3 benefit review (PO asks for evidence; evidence → continues; none → shutdown, resources to pool), institutional voice
- [x] 6.10 · Section 08 = "The ask: launch SPARK V1 now"; new V1/V2/V3 phase timeline SVG (#v123: concrete steps per phase, NOW/+2WK/M3 baseline diamonds; Phase B turbine home); "three decisions" → "One ask, two stated conditions" cards; CTA "One decision away."; contingency cap re-pointed at V2's GPU need (V1 needs no GPU)
- [x] 6.11 · Objections block removed
- [x] 6.12 · Deliverable index removed (clause table in 05 untouched)

### ④ How It Works (brief section 8)
- [ ] 8 · Revamped: two offerings + Beta badge, hub-and-spoke engine, MoEnergy-boundary sovereignty, three faces, V1/V2/V3 plan; contradictions with new Portal opening removed

### ⑤ Global sweep (brief section 2) — last, across the surviving set
- [ ] 2.1 · Em dash scrub, all user-visible text, both languages (grep = 0 at ship)
- [ ] 2.2 · Language pass (plain professional English, jargon explained)
- [ ] 2.3 · Global EN/AR switcher site-wide (same fixed position; per-page buttons removed)
- [ ] 2.4 · Favicon on every surviving page (data URI)
- [ ] 2.5 · Sidebar hierarchy fix (rail vs scrollspy distinct active states) everywhere
- [ ] 2.6 · Anchor offset / scroll-margin-top check on all pages
- [ ] 2.8 · Both offerings + Beta · Phase 2 badge everywhere the service is described; "approved to Ministry requirements" wording guard
- [ ] 2.9 · Launch announcements: em dash scrub (30), plain-language pass both languages, Phase-1 copy aligned with 6.10 (V1 now, all IT staff, immediate start); [PORTAL-LINK] kept

## Phase B — visual layer (brief section 9; only after Phase A verifies green)
- [ ] 9.1 · Motion foundation (floating-artifact kit, pointer-tilt/scroll-parallax) on every surviving page
- [ ] 9.2 · Glass top bar w/ EN/AR switcher + page title, standalone + embedded
- [ ] 9.3 · Liquid-glass cards + restrained 3D tilt-on-hover
- [ ] 9.4 · Brief section 08 horizontal timeline w/ SVG wind turbines rotating per milestone
- [ ] 9.5 · Typography stays Lafet + IBM Plex (no Inter)
- [ ] 9.6 · Quality floor: text-first paint, 375px stack, focus visible, contrast on glass, "Clause NN" rule

## Section 10 — verification & ship
- [ ] Per-page verify green (incl. updated --form expectations) + screenshot eyeball
- [ ] Scroll-animation checks standalone + Hub iframe
- [ ] RTL pass every page; mobile 375px pass; zero em dashes grep
- [ ] SPARK_Site/CLAUDE.md updated with every override (list in brief section 10)
- [ ] SPARK_Site_v4.zip + claude_SPARK_Site_v4_change_report.md (v3 report format)

## In-flight notes

- (none yet)
