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
- [ ] 4 · Leadership Hub: scan for unique load-bearing content (list for Majid if any), then delete `SPARK_Leadership_Hub.html`; remove Hub tile "08 · FOR LEADERSHIP", rail links, deep links, cross-references
- [ ] 7 · Three Faces page: create new page (proposed name pending) with chapters Innovator / End User / Leadership; built on spark-identity
- [ ] 7 · Retire "THE TWO FACES" rail group; Admin Guide out of public nav (file stays in repo); Governance Command Centre linked from ch.3
- [ ] 7 · Hub rail, tiles, cross-links updated across the set

### ② Customer Portal (brief section 3)
- [ ] 3.1 · Cut framework-led opening; one quiet trust line; remove current hero animation
- [ ] 3.1 · New hero animation: full journey loop adapted from ref1 (apply → labels → approval → workspace live → governance log), both offerings, Beta · Phase 2 badge on LLM lane
- [ ] 3.1 · Value-first headline (options for Majid, recommended one shipped)
- [ ] 3.2 · Budget: numeric input, placeholder `80 USD`, justification + counter kept; all "band/range" copy updated
- [ ] 3.2 · Mailto reversed: To = line manager, CC = SPARK@MoEnergy.gov.sa (both languages, all strings incl. clipboard fallback); verify.js --form expectations updated
- [ ] 3.3 · Assistant renamed Nawaf / نواف, "Powered by SPARK" sub-line, honesty chip kept
- [ ] 3.3 · Seeded welcome messages deleted; empty-state greeting centered (options for Majid)
- [ ] 3.3 · Left rail: Tools, Chat history (illustrative), user account block pinned bottom
- [ ] 3.3 · Tools wear real logos/brand colors; Submit-your-tool tile kept
- [ ] 3.3 · Tool click inserts /toolname + helper card above input
- [ ] 3.3 · Layout per ref3: input on top, tiles below; no chip row

### ③ Product Brief (brief section 6)
- [ ] 6.1 · Mandates→framework→SPARK figure rebuilt (whitespace band killed, SPARK card spacing fixed)
- [ ] 6.2 · Customer group ② replaced with MoEnergy leadership (override of 30 Jul decision 1 — record in CLAUDE.md)
- [ ] 6.3 · Model catalogue: retitle (no em dash), LLM-as-a-service message, Beta · Phase 2 badge, hub-and-spoke animation from ref1
- [ ] 6.4 · Sovereignty: "data never leaves MoEnergy's own boundary", nested-boundary animation (MoEnergy inside KSA)
- [ ] 6.5 · "What Cybersecurity gets from the same design" block removed
- [ ] 6.6 · Lanes figure: Cyber approval step removed from fast lane; caption em dash scrubbed
- [ ] 6.7 · "One honest implication, stated up front" removed
- [ ] 6.8 · Lifecycle figure: escalation dashed arrows animate; 6a/6b grey text overflow fixed
- [ ] 6.9 · "Stated plainly" rewritten around month-3 benefit review (institutional voice)
- [ ] 6.10 · Section 08 rebuilt: single ask (approve V1 launch now + announcement to all IT staff + immediate start), V2 two weeks later w/ two conditions, V3 month three; timeline shows phases with concrete steps; "three decisions" cards replaced
- [ ] 6.11 · "Objections, answered before they're asked" removed
- [ ] 6.12 · "Deliverable index · the one-stop map" removed (clause table in 05 stays)

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
