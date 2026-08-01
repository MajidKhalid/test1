# SPARK — Claude Code handoff package

This folder hands the SPARK project (Ministry of Energy governed AI sandbox — artifact set + operating context) from a Claude Cowork session to **Claude Code**.

## Open it in Claude Code

```bash
cd SPARK_ClaudeCode_Handoff
claude
```

`CLAUDE.md` loads automatically (and imports `SPARK_Site/CLAUDE.md`, the full project memory).

**Suggested first prompt:**
> Read SPARK_Context_Handoff.md, then summarise current state and the open threads in priority order.

## One-time setup for the verification harness

```bash
npm install
npx playwright install chromium
```

Then verify any artifact before declaring a change done:

```bash
npm run verify -- SPARK_Site/SPARK_OneStop_DigitalEnergy.html
# optional flags: --demo --counters --form
```

Green = zero `jsErrors`, zero `svgIssues`, all `.rv` revealed, `embedded.cls: true`. Screenshots land in `./shots/` — look at them.

## Contents

| Path | What it is |
|---|---|
| `CLAUDE.md` | Root memory — repo layout, quickstart, definition of done |
| `SPARK_Context_Handoff.md` | Full narrative handoff — read once for depth |
| `SPARK_Site/` | The 8 deliverable HTML files + project memory (`CLAUDE.md`) |
| `tools/verify.js` | Playwright verifier (sections, reveals, SVG bounds/collisions, scrollspy, embedded mode, screenshots) |
| `package.json` | Playwright dep + `npm run verify` |

The claude.ai **MoEnergy project** (source strategy PDFs, org circular, business case) is *not* bundled — every fact the artifacts depend on is already baked into the two CLAUDE.md files. Download PDFs from the project into `docs/source/` only if deep source work is needed.
