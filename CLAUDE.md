# CLAUDE.md — SPARK repo root

@SPARK_Site/CLAUDE.md

This repo is the **SPARK artifact set** handed over from a Claude Cowork session (last state: v3.1, verified green, 30 Jul 2026). The imported file above is the living project memory — narrative rule, verified GCP facts, settled decisions, open threads. Read `SPARK_Context_Handoff.md` once, at the start of your first session, for the full story.

## Layout

- `SPARK_Site/` — the product: 9 self-contained HTML files (open `SPARK_Hub.html`) + project memory. Edit these in place; never split assets out. (`SPARK_Portal.html` and `SPARK_Leadership_Hub.html` were retired and deleted 1 Aug 2026, recoverable from git history.)
- **Global writing rule: never use the em dash "—" in anything produced for this project** (artifacts, emails, UI strings, commits, PRs). See the rule block at the top of `SPARK_Site/CLAUDE.md`.
- **Delivery rule (Majid, 2 Aug 2026): when a deliverable is finished, always attach the output file(s) directly in the chat AND give the GitHub raw link.** Both, every time, without being asked.
- `finops/` — the standalone Cloud FinOps dashboard stream (SharePoint-hosted, zero JS, NOT linked to the SPARK set). See the FinOps section below.
- `comms/` — the launch announcements (three phases × AR/EN, copy-to-clipboard, `[PORTAL-LINK]` placeholder).
- `spark-identity/` — the official identity package (logos, fonts, tokens, BRAND.md, Solids v2 components). Source of truth for the customer portal and anything built from now on.
- `tools/verify.js` — Playwright verifier (`--demo --counters --form --chat --lang`). **Every HTML change must pass it before you declare done.** If Playwright's own Chromium is unavailable, set `CHROMIUM_PATH` to a system Chromium.
- `SPARK_Context_Handoff.md` — session history, people, design contract, why each decision was made.
- `shots/` — created by the verifier; screenshots to actually look at.

## Quickstart

```bash
npm install && npx playwright install chromium   # once
npm run verify -- SPARK_Site/<file>.html         # after every change
```

## Definition of done (non-negotiable)

1. `verify.js` reports: `jsErrors: []`, `svgIssues: []`, all `.rv` revealed, all `.st` staged in, `embedded.cls: true`, `useMissing: []`.
2. You have opened and *looked at* the screenshots in `shots/` — the verifier catches geometry, not ugliness.
3. Cross-file consistency held: a fact changed in one file (project IDs, budget thresholds, narrative lines) is changed in every file that states it. `grep -l` across `SPARK_Site/*.html` before closing.
4. `SPARK_Site/CLAUDE.md` updated if a decision was made or a fact changed.

Known trap already fixed once: a broad `.figbox svg { width:100% }` rule blows up nested icon SVGs — keep such rules scoped to direct children.

## FinOps dashboard stream (`finops/`, standalone)

- Recurring artifact for IT leadership, hosted on SharePoint: one self-contained HTML file, zero JavaScript, timestamped, updated monthly. Not part of the SPARK Hub; it only borrows the DE identity (fonts, orb, palette).
- v1.1 (Q2 2026, all platforms) shipped 2 Aug 2026 with adversarial-review fixes. Superseded in direction by the client review the same day; keep the file as the Q2 archive.
- **v2 direction (client review via Majid, 2 Aug 2026):** keep it simple, short and sweet; **GCP spend ONLY** (drop Azure, Oracle, O365, SaaS budget sections); exactly **two sections: GCP spend and Sandbox spend**. Sandbox quarterly narrative: usage cost ran very high, the planning team restructured the sandbox, cost is now at a sustainable and stable level.
- **Period switch replaces the hero chip row** (Majid wants it prominent): Month and Contract-to-date always; **Quarter appears only in quarter-end months**. Implement as CSS-only radio tabs (zero JS holds, SharePoint-safe).
- "To date" means the contractual period. NOTE: the billing account (`cntxt-...-002`) only has data from **1 Oct 2025**; the contract start is 1 Jun 2025. Jun to Sep 2025 spend, if any, sits outside this account; the to-date view is labelled with its true range. Open question for Majid: whether an earlier account (-001) holds pre-Oct spend.
- **v2 SHIPPED 2 Aug 2026, operating model settled:** `finops/FinOps_Builder.html` is Majid's private local operator tool (JS allowed locally; never published). He drops the six Reports CSVs in (Month/Quarter/To-date, all-GCP + sandbox-filtered), edits the credits note and narratives, clicks Generate; it downloads **`FinOps_Dashboard.html`** (zero JS, self-contained, radio-tab period switch). He uploads that to SharePoint OVERWRITING the same file, so the public link never changes. First edition: July 2026 + H1 2026 + to-date, built from Majid's 2 Aug extracts (H1 net $614,875 matched the quarterly report to the cent).
- **Chart decision (Majid, 2 Aug 2026, chose from six rendered samples):** each section leads with a **donut + center KPI** (top 4 services + Other, on-slice percents, Lafet center figure, legend with share bars; "trendy and professional"), followed by an editable **key highlight** box (auto = fastest-growing service among those >= 3% of period net; concentration fact as fallback), and an expandable **details** block (ranked bars with gross ghost + full data table) via native details/summary, zero JS. "Simple but expandable" is the standing design goal.
- **v2.2 leadership polish (Majid, 2 Aug 2026):** sticky **liquid-glass top bar** (backdrop-filter, carries the brand plus the period tabs, CSS-only); SPARK **blade glyph** replaces the rule before each hero figure; hero carries a breathing **DE solid** (CSS 3D-look SVG, frozen under reduced motion); every sandbox section ends with a single **"The sandbox becomes SPARK"** panel = short narrative + the fixed journey animation (**Application > ServiceNow > approved > workspace > shared engine**, with the approval line firing on the same beat as the green check) + the three release phases (ITDT, all MoEnergy, energy ecosystem) + the department credit. Footer eyebrow is now **"Prepared for the eyes of"** and the credit line is the **IT Strategy & Planning Department** (never a personal name). The department is named in the hero, the glass bar, the chips, the SPARK panel and the footer. USD is explained in the hero (the console meters and invoices in USD, no conversion).
- **Credits fact (2 Aug 2026, console):** the $450K migration credit is FULLY CONSUMED (0% remaining, end date 29 Oct 2026); spend now runs at negotiated rates. Only the unused $1K Gen App Builder trial remains (expires 9 Nov 2026). The builder's credits-note field must be refreshed monthly from Billing > Credits.

## What is NOT here

- The claude.ai **MoEnergy project** docs (cloud strategy PDFs, org circular, business case, EA procedures). All facts the artifacts depend on are already baked into the CLAUDE.md files — do not re-derive; ask Majid for a PDF only if truly needed (drop into `docs/source/`).
- Live GCP access. Infra steps run in Majid's Cloud Shell per the Admin Guide runbooks; your job here is the artifact set and its operating logic, not cloud mutations.
