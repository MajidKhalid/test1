# SPARK_Site v4 · change report

> One full revision pass on the artifact set per the v4 brief (1 Aug 2026), Phases A and B complete. Deliverable: `SPARK_Site_v4.zip` at the repo root (nine self-contained HTML files, 2.3 MB) plus the aligned `comms/SPARK_Launch_Announcements.html`. Final state: every page verified green with `tools/verify.js` (updated contracts) and eyeballed in EN and AR; zero user-visible em dashes and zero section-sign characters across the set; RTL pass on every bilingual page; embedded-mode pass inside the Hub iframe; 375 px mobile pass (including a post-agent kit fix so the glass nav never covers the sidebar hamburger). The v3 change report was not in this repo, so this report uses the project's documentation format.

## 1 · Decisions shipped with options for Majid

These items shipped with the recommended option so nothing blocks; swap on request.

| Item | Shipped | Alternates proposed |
|---|---|---|
| Portal headline (3.1) | "A governed space to build with AI. Apply today, build tomorrow." (the brief's starting point) | "Your idea, running on Ministry ground. Apply today, build tomorrow." · "Compute, models, and a green light. All yours, inside the Ministry." |
| Chat empty-state greeting (3.3) | "Energy has its home" / "للطاقة هنا بيت" (Majid's suggestion) | "Where energy comes to think" · "Home ground for energy ideas" |
| Three Faces page name (7) | "The three faces of SPARK" (`SPARK_Three_Faces.html`) | "SPARK, three ways" · "Who SPARK serves" |

**Arabic review (widens open thread 0a):** the v4 pass made the whole public set bilingual. The Brief (~270 strings), How It Works, Automation Strategy (124), Governance Command Centre (84 plus the JS-rendered dashboard) and the Hub carry fresh MSA written against the glossary of the existing portal pages. It needs a native proofread before the announcement goes out. Specific judgment calls are listed in section 6.

## 2 · Leadership Hub deletion: unique content inventory (section 4)

`SPARK_Leadership_Hub.html` is deleted (recoverable from git history). Content that existed nowhere else, listed rather than silently migrated:

1. The L6 illustrative demand table (rows "Licensing report assistant" and "Grid data analyst" with lanes and budget bands) appeared nowhere else. Dropped; consistent with the settled decision that the escalated backlog is narrative, not an ops lane.
2. L6 KPI row and funnel numbers (12 applications, 5 active workspaces, 7 escalated backlog, under 250k SAR asks; funnel 12, 9, 5, 0). Illustrative only; dropped.
3. L6 leadership-call flags (two asks above the SAR 50k band; prioritise the backlog; confirm the phase-two date). Dropped.
4. The L7 "three decisions" set, which was newer than the Brief's and carried the **AI-003 register-correction ask**. The three-decisions framing is superseded by the v4 single ask; the AI-003 ask survives as CLAUDE.md open thread 4.
5. The L0 status chip "Launched, phase one under way" (only artifact asserting launched status). The Portal's launch chip now carries that message.
6. The full formal-Arabic leadership narrative (126 strings). Superseded by the Brief's new full Arabic layer.
7. Two punch lines ("shall we run what we signed?", "Oversight is the system's own behaviour"). Available in history if wanted back.

## 3 · Structure changes (sections 4, 7)

- Hub rail: "The two faces" group (operator guide + command centre) replaced by "The three faces" hosting the new page; "For leadership" group removed; tiles renumbered to six; crumb names updated; old `#lead` / `#guide` / `#centre` deep links fall back to home.
- **`SPARK_Three_Faces.html` (new)**: cover + three chapters. 01 The Innovator (the request-to-workspace journey, including the animated 16-second journey loop ported from the Portal hero); 02 The End User (a faithful static mirror of the Nawaf chat: composer on top, centered greeting, tool chips, honesty chip); 03 Leadership (dashboard stat cards, illustrative label, link out to the full Command Centre). Full spark-identity boilerplate: embedded fonts, favicon, EN/AR, embedded mode, accent-bar scrollspy.
- `SPARK_Admin_Guide.html` left public nav (file stays in the folder as the internal manual; scrubbed, favicon and embedded fonts added, still EN-only by design).
- `SPARK_Governance_Command_Centre.html` left the rail; it is reached from Three Faces chapter 3.

## 4 · Customer Portal (section 3)

- View ①: framework-led opening cut; the framework's entire presence is one trust line at the end of "What SPARK is". New value-first headline and lead. The old motif-float hero was removed and replaced by one continuous journey animation (16s CSS loop, no WebGL): application, labels applied, approval, workspace live inside the Sandboxes boundary calling the shared engine (Beta · Phase 2 badge on the engine), and the same event appearing in the governance log. Reduced motion shows the completed state.
- View ②: banded budget select replaced by a numeric USD input (placeholder "80 USD", digits-only validation); **mailto direction reversed**: To = line manager, SPARK@MoEnergy.gov.sa in CC, across the envelope builder, mailto href, form notes, hints, clipboard fallback and success strings in both languages. `tools/verify.js --form` asserts the new direction.
- View ③: assistant renamed **Nawaf (نواف)** with "Powered by SPARK"; the two seeded welcome messages are deleted (empty first load with centered greeting); layout per the reference: input on top, tool tiles below, no chip row; colorful gradient tool logos; rail = Tools, illustrative Chat history, account block pinned bottom; tool click inserts `/toolname` and opens a helper card (description plus example prompt); scripts play on send; slash commands parsed. `--chat` rewritten for the new contract.
- Chat scripts and caption now say the model service arrives with Phase 2 (rule 2.8 honesty).

## 5 · Product Brief (section 6) and How It Works (section 8)

Brief, keeping the locked framework-first narrative:
1. Mandates > framework > SPARK figure rebuilt (dead whitespace band removed, SPARK card re-spaced).
2. Customer group ② is now **MoEnergy leadership** (stronger governance, clearer visibility, sector enablement). Deliberate override of the 30 Jul storyline decision; recorded in CLAUDE.md.
3. Model catalogue reframed: **LLMs as a service · quality output at minimal spend**, Beta · Phase 2 badge, one-shared-engine message, new hub-and-spoke animation (engine plus four spokes including "+ your use case"); model table kept.
4. Sovereignty: "Sovereign by design. Data never leaves the Ministry's boundary." with nested rings (KSA outer, MoEnergy inner; the internet actor sits outside both) in the interactive demo; narration updated.
5–7, 11–12. Removed: the Cybersecurity-outcomes block, the "one honest implication" card, the objections row, and the deliverable index (the clause table in 05 stays). The fast lane lost its Cyber approval step.
8. Lifecycle: escalation arrows animate like every other flow; 6a/6b text wrapped inside its boxes.
9. "Stated plainly" rewritten around the **month-3 benefit review** (institutional voice).
10. Section 08 is now **"The ask: launch SPARK V1 now"**: one decision (announcement to all IT staff, immediate start), V2 two weeks later under two stated conditions (leadership endorsement; the working team of Product Owner, Solution Architect and AI Expert freed), V3 at month three. The timeline is a horizontal scroll-snap sequence where SVG wind turbines (blue to teal to green blades) rotate 360° sequentially as each phase enters; contingency note re-pointed at V2's GPU need (V1 needs none).

How It Works: two offerings on the cover (LLM service greyed, Beta · Phase 2, "arrives with V2"), V1/V2/V3 plan line, three-faces cross-link, Beta chip on the shared-engine figure, and the same nested-ring boundary treatment in the prompt-travel demo. It remains the technical deep dive.

## 6 · Global sweep (section 2)

- **Em dashes: zero** user-visible occurrences across all ten HTML files (census-checked by grep; en dashes in numeric ranges are kept deliberately).
- **Bilingual site**: the data-ar + setLang + dir-flip pattern now runs on every public page; the Command Centre's JS-rendered dashboard uses an EN/AR dictionary with a re-render hook. Diagram SVGs are pinned LTR (settled pattern) so the RTL bounds pass is deterministic. Arabic judgment calls for review: invariant day units in the Command Centre ("24 يوم"), coined dashboard terms (صحة المسار، فجوات الموافقة), badge translations in the Automation registry (آلي/شبه/أبداً/تغذية/يدوي), "البند NN" for Clause NN, and the announcements' V1/V2 renderings (النسخة الأولى/الثانية).
- **Self-containment**: Google Fonts CDN links removed everywhere; IBM Plex Sans Arabic embedded base64 per page. One remaining exception, carried from v3: the Command Centre's SheetJS `<script>` for the optional register-workbook drop (degrades gracefully offline; inlining it would add roughly 800 KB, decision left to Majid).
- **Favicon** on every page; **scrollspy active state** is now an accent bar plus weight change, distinct from the Hub rail's filled pill; **scroll-margin-top** offsets added per page.
- **Announcements**: em-dash scrub and plain-language pass in both languages; Phase 1 copy aligned with the V1-now ask; `[PORTAL-LINK]` and clipboard mechanics intact. Wording awaits Majid's review before anything is sent.

## 7 · Visual layer (section 9, Phase B)

Executed with a CSS-only kit distilled from the floating-artifacts v2 "Solids" design handoff (committed into `spark-identity/`), adapted with gradient-faced solids so pages stay self-contained (the handoff's PNG-textured faces would have added hundreds of KB per page; Majid noted the kit was "not obliged"). No WebGL anywhere.

- Glass top bar on sidebar pages (orb, page title, the EN/AR switcher moved in); sticky-header pages (Portal, Register) and the Hub glassify their existing bars instead, so the switcher sits in the same top position everywhere.
- Hero glow fields with pointer parallax; at most one 3D ornament per page (gyro sphere or cube); liquid-glass treatment on a restrained set of cards; tilt-on-hover capped at three cards per page; blade light-sweep divider retained.
- The Brief's section 08 turbine timeline is the 9.4 centerpiece (scroll-snap plus a small JS progress driver; GSAP was not needed).
- Per page: Hub (glass topbar, cube ornament, two tilt tiles), Portal (glassified header, hero glows only since the journey loop is the centerpiece, glass on the Live V1 offer card), Register (glassified header, small gyro, glass on the why-register cards), How It Works (glass nav, cube on the dark cover, glassdark Q-cards), Automation Strategy (glass nav, gyro), Command Centre (glass nav, one glow, deliberately no ornament or tilt on data cards, plus page-local fixes for a pre-existing 375 px overflow), Three Faces (glass nav, gyro, glass offer cards).
- Quality floor: decoration is aria-hidden and never blocks text paint; heavy décor hidden at small widths; focus-visible outlines; reduced-motion freezes everything; `--de-motion-speed` governs all loops.

## 8 · Verification

- Per page: `npm run verify` with the relevant flags, green, plus screenshot review (EN and AR). Portal flags all pass under the new contracts (empty first load, slash insertion, helper card, reversed mailto).
- RTL pass on every bilingual page; embedded pass inside the Hub iframe; mobile check at 375px; em-dash grep = 0.
- Playwright note for future sessions: the pre-installed Chromium requires `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.

## 9 · CLAUDE.md

Every override is recorded in `SPARK_Site/CLAUDE.md`: audience-decides-the-opening, reversed mailto, numeric budget, the leadership customer group, the Leadership Hub deletion, Two Faces to Three Faces, Admin Guide internal, Beta · Phase 2 set-wide, identity carve-out ended, favicon and switcher rules, the em dash ban, Nawaf naming, no-WebGL, the V1/V2/V3 single ask, the month-3 benefit review, nested-boundary sovereignty, and the v4 verify.js contracts.

## 10 · Open items for Majid

1. Native Arabic proofread of the new MSA across the five newly bilingual pages plus the announcements (section 6 lists the judgment calls).
2. Swap any of the three shipped-with-alternates decisions (section 1).
3. SheetJS CDN exception on the Command Centre: keep (current), inline (~800 KB), or drop the workbook-drop feature.
4. The deleted Leadership Hub content inventory (section 2): confirm nothing there needs a new home.
5. Announcements wording sign-off before sending (unchanged rule).
