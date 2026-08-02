# CLAUDE.md — SPARK repo root

@SPARK_Site/CLAUDE.md

This repo is the **SPARK artifact set** handed over from a Claude Cowork session (last state: v3.1, verified green, 30 Jul 2026). The imported file above is the living project memory — narrative rule, verified GCP facts, settled decisions, open threads. Read `SPARK_Context_Handoff.md` once, at the start of your first session, for the full story.

## Layout

- `SPARK_Site/` — the product: 9 self-contained HTML files (open `SPARK_Hub.html`) + project memory. Edit these in place; never split assets out. (`SPARK_Portal.html` and `SPARK_Leadership_Hub.html` were retired and deleted 1 Aug 2026, recoverable from git history.)
- **Global writing rule: never use the em dash "—" in anything produced for this project** (artifacts, emails, UI strings, commits, PRs). See the rule block at the top of `SPARK_Site/CLAUDE.md`.
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

## What is NOT here

- The claude.ai **MoEnergy project** docs (cloud strategy PDFs, org circular, business case, EA procedures). All facts the artifacts depend on are already baked into the CLAUDE.md files — do not re-derive; ask Majid for a PDF only if truly needed (drop into `docs/source/`).
- Live GCP access. Infra steps run in Majid's Cloud Shell per the Admin Guide runbooks; your job here is the artifact set and its operating logic, not cloud mutations.
