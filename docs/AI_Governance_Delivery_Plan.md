# Framework to SPARK — Delivery Plan v1.0

**Engagement:** MoEnergy AI Governance — final deliverables
**Prepared for:** MJ · Planning, DEA GD, ITDT · August 18, 2026
**Companion artifact (visual version):** https://claude.ai/code/artifact/958d035d-bdb0-48e5-b508-c8bc40c03f98

---

## 1. The three deliverables (what the client receives)

| ID | Deliverable | Format | Essence |
|----|-------------|--------|---------|
| D1 | Executive presentation: framework + SPARK bridge | .pptx (+5-slide cyber pre-brief variant) | Six-part story: why → how built → framework → process & RACI → SPARK fulfillment → dashboard. Appendix with references. |
| D2 | Automated AI use-case register | .xlsx, formulas only | 14-field entry view; engine derives eligibility, triggers, path, approvers, SLA clock, and a plain-language "Next steps" note per row. Dashboard sheet. |
| D3 | SPARK high-level design | .docx/.pdf ~12pp + diagrams | Three doors: (1) GCP project pure-infra, (2) governed hosted-LLM access with showback, (3) execute-for-me via register. Control inheritance, guardrails, lifecycle, graduation. |

All three are renderings of **one story**: a demand enters one door (Khidmatak), gets a register row, is routed RP1–RP4, decided by a named Approval Authority on a published SLA, and fulfilled through SPARK.

## 2. Source inventory (anti-hallucination foundation)

| ID | Source | Status |
|----|--------|--------|
| RA | MoEnergy AI Governance Refinement Analysis v1.0 (34pp; findings M-01–M-24, Annexes A–G) | IN HAND |
| RL | KSA Regulatory Landscape v1 (8 layers, Tier 1/2/3, official links) | IN HAND |
| F1 | MoEnergy AI Governance Framework v1.0 (44pp, Restricted) | **NEEDED** |
| F2 | AI Governance Register & Assessment Toolkit v1.0 (xlsx, 13 sheets) | **NEEDED** |
| F3/F4 | Board presentation Final v1.0 (22 slides, PDF+PPTX) | **NEEDED** |
| SC | MoEnergy_AI_Framework_Considerations_v1 (SPARK PoV) | **NEEDED** |
| CP/CS | Cybersecurity AI policy + standard | **NEEDED** |
| GIF | SPARK service concept GIF (LLM access + showback) | **NEEDED** |
| BR | Ministry PPT template/brand + org chart names | CONFIRM |

Key insight: **RA's annexes are pre-built content** — Annex A (one-page RACI), Annex B (Approval Authority Matrix + SLAs), Annex C (register schema, 3 views), Annex D (register SOP), Annex E (governed sandbox lane design), Annex F (terminology card). Deliverables are built *from* these, never from model memory. Facts rebuilt from RA's descriptions of missing files get tagged `[UNVERIFIED-vs-F1]` etc.

## 3. Delivery architecture: one content model, three renderings

```
Sources (RA·RL·F1·F2·F3·SC·CP/CS·GIF)
        │
        ▼
content-model.yaml  ←— single source of truth, every entry carries [source §ref]
(layers · bodies · gates 0–8 · RP1–RP4+SLAs · RACI · authority matrix ·
 register schema · SPARK doors · KPI dictionary · terminology · reg. register)
        │
        ├──▶ D1 deck (pptx skill)
        ├──▶ D2 register (xlsx skill)
        └──▶ D3 HLD (docx + Lucid diagrams)
```

Drift (three KPI sets, three register schemas, two naming systems — the failures RA documents) is prevented structurally: corrections happen once in the model, then re-render.

## 4. Stages and chunks

### Stage A — Consolidate ground truth (Day 0–1) · Claude Code

- **A1 Assemble the source pack.** Upload all NEEDED files to `/00_Sources`; Claude verifies extraction and builds `00_source_index.md`.
- **A2 Build the content model.** Output: `content-model.yaml` + `traceability.md` (claim → source → section). **Checkpoint: MJ signs off before any artifact is built.**
- **A3 Cyber gap map.** Three-verdict table per control area: APPLY / ADAPT / GAP vs CP/CS, quoting clause numbers exactly. Closes RA G-14. Feeds the cyber pre-brief and D3 guardrails.

**Prompt A2 (content model):**
> Read every file in /00_Sources. Build content-model.yaml: the single source of truth for a MoEnergy AI governance deck, register, and SPARK HLD. Sections: governance_layers, bodies_and_roles, gates (0–8), review_paths (RP1–RP4 with scope + authority + quorum + SLA from RA Annex B), raci (RA Annex A verbatim), register_schema (RA Annex C, three views, starred additions), sandbox_lane (RA Annex E), spark_doors (door 1: GCP project pure-infra; door 2: hosted-LLM access with showback; door 3: execute-for-me via register), kpi_dictionary (single set, 8 metrics), terminology (RA Annex F), regulatory_register (RL §10 tiers).
> Rules — no exceptions: (1) Every entry carries source: [ID §ref]. Unsourced facts go to open_items.yaml as DECISION-NEEDED or ASSUMPTION with a proposed default, never into the model. (2) Use ONLY Annex F terminology (Review and Approval Path RP1–RP4; Eligibility = Permitted / Permitted with Conditions / Prohibited / Incomplete; 5x5 Official Risk; AI Register; Approval Authority). (3) Never invent regulation names, committee names, person names, or SLAs. (4) Where F1/F2/F3 are absent and RA merely describes them, tag [UNVERIFIED-vs-F1]. Also produce traceability.md.

**Prompt A3 (gap map):**
> Compare the Cybersecurity AI policy (CP) and standard (CS) against content-model.yaml controls and RA findings S-07, G-09, G-14. Produce cyber-gap-map.md: | Framework control area | CP/CS clause | Verdict: APPLY / ADAPT / GAP | What the framework does |. Quote clause numbers exactly — never paraphrase or invent one. Where F1 §3's boundary applies ("Cybersecurity owns security standards; the framework routes and evidences"), verdict APPLY with citation. End with every GAP + one-line proposed fill flagged DECISION-NEEDED for the cyber working session.

### Stage B — Storyboard & visual language (Day 1–2) · Claude Code (+ optional Claude Design, Lucid MCP)

- **B1 Storyboard the deck** (~18 slides mapped to the six-part flow; each slide = one message + one hero visual + sources). **Checkpoint: MJ approves storyboard, not draft slides.** Optional: mock the 3 hero slides on a Claude Design canvas first.
- **B2 Diagram set, drawn once, reused everywhere:** (1) demand-to-delivery swimlane gates 0–8; (2) three-doors SPARK bridge; (3) SPARK architecture; (4) framework-on-a-page; (5) control-inheritance/graduation lifecycle. Lucid (editable, PNG export) or native PPTX shapes — see Q4.

**Proposed slide skeleton** (already grounded in RA/RL):
1. Title + the one-sentence story (RA p.4)
2. Why now — Year of AI, PDPL enforcement live, shadow AI, waiting demands [RL 1.3, RA]
3. Without governance — 4 concrete failure cases
4. How we built it — regulations (RL 8 layers) · internal policies & procedures (P14/25/26/30/34/35, cyber policy/standard) · operating design
5. Regulatory map on a page — Tier 1/2/3 [RL §10]
6. Framework on a page — layers, decision rights, one register, RP1–RP4 [RA S1]
7. Decision model — path = max(risk path, trigger path) + strategic overlay [RA S-06]
8. Demand-to-delivery swimlane — gates 0–8 [RA S-01, M-15]
9. Who decides — Approval Authority Matrix + SLA clocks [RA Annex B]
10. RACI on a page — one A per row [RA Annex A]
11. One door in — Khidmatak intake, 14-field form [RA M-12]
12. The bridge — approved demand → SPARK three doors
13. Door 1 — GCP project (requester-admin | provisioned)
14. Door 2 — governed local LLM + price showback [GIF concept]
15. Door 3 — execute-for-me → AI Register
16. SPARK guardrails — inheritance, one-time RP3, graduation rule [RA Annex E]
17. Monitoring — sample dashboard from the 8-metric dictionary
18. The ask — framework + authority matrix in one motion, 90-day amnesty, open the SPARK lane [RA §7]
Appendix: full RACI · authority matrix · register schema · cyber gap map · regulatory register with references [RL] · terminology card

**Prompt B2 (swimlane):**
> From content-model.yaml (gates + raci), create a swimlane: lanes = Requester / Khidmatak / EA Planning / Cybersecurity / DMO / Legal-Procurement / IT Ops / Approval Authority. Gates 0–8 left to right; RP routing after Gate 2 as four colored paths; the sandbox fast lane as a bypass ribbon from Gate 1 into SPARK ("inherited controls") with a graduation arrow re-entering at Gate 2. SLA badges per path. Use ONLY names and SLAs present in content-model.yaml.

### Stage C — Build (Day 2–5) · Claude Code skills

- **C1 D1 deck** (pptx skill): built from approved storyboard + content model only; Ministry template; max 12 words body text per slide outside diagrams; speaker notes = talk track + source tags; appendix with references; plus 5-slide cyber pre-brief (open with what Cyber gains: Gate 0 visibility, shadow-AI KRI, standards untouched — RA §6.5).
- **C2 D2 register** (xlsx skill): Sheets — Home/How-to · Register (14-field entry + locked engine: eligibility, triggers, 5×5 risk, path = max rule, sandbox flag, DPIA flag, approvers, SLA due) · Next Steps (formula-assembled sentence per row: current gate, who must act, approvals outstanding, SLA countdown, next action) · Config (Annex B matrix — change an approver in ONE cell) · Lookups (hidden) · Dashboard · Exceptions (time-bound, auto-aging). Formulas only, no VBA. 3 sample rows EX-AI-001..003 that satisfy every rule (fixes RA M-06).
- **C3 D3 SPARK HLD** (docx skill + Lucid): Context & scope · service catalog (3 doors: eligibility, what requester gets, what's inherited, SLA) · architecture per door (reference Ministry cloud reference architectures + me-central2; undecided components written as OPTIONS with trade-offs, flagged DECISION-NEEDED — never invented product names) · guardrails (RA Annex E verbatim, mapped to CP/CS clauses) · showback model (labels → billing export → per-department view; ties to register cost fields, RA G-13) · workspace lifecycle · ops RACI · KPIs.
- **C4 Dashboard mock** (dataviz skill): one design used twice — PNG for deck slide 17 and the Excel dashboard sheet; watermarked "sample data".

### Stage D — Verify, align, package (Day 5–7) · Claude Code + fresh subagents

- **D1 Independent fact-check per deliverable.** Fresh context, instructed to refute: every name, number, SLA, clause, instrument → CONFIRMED [source §] / NOT IN SOURCES / CONTRADICTS. Terminology drift (Annex F) flagged as a defect. Builder ≠ checker.
- **D2 Cross-deliverable consistency pass** (checklist §6): mismatches fixed in the content model, then re-rendered — never patched in one file.
- **D3 Package:**

```
MoEnergy_AI_Governance_Submission_v1/
├─ README.md
├─ 01_Executive_Deck/  MoEnergy_AI_Framework_Exec_v1.pptx · Cyber_PreBrief_v1.pptx
├─ 02_AI_Register/     MoEnergy_AI_UseCase_Register_v1.xlsx
├─ 03_SPARK_HLD/       SPARK_HLD_v1.docx (+PDF) · diagrams/
└─ 04_Traceability/    content-model.yaml · traceability.md · cyber-gap-map.md · factcheck & consistency reports
```

**Prompt D1 (verifier):**
> You are an adversarial fact-checker. You did not write this deliverable. Inputs: /00_Sources + content-model.yaml + [file]. Extract every checkable claim (names, numbers, SLAs, committee names, regulation titles, clause references, product names). For each: CONFIRMED [source §] / NOT IN SOURCES / CONTRADICTS [source §]. Check terminology against RA Annex F and flag drift. Report a table, worst first. Do not fix anything — report only.

## 5. No-hallucination protocol (enforced in every prompt)

1. **Sources first, model memory never** — general knowledge shapes structure/phrasing, never facts.
2. **Cite or flag** — every claim carries a source tag; untraceable items become explicit [ASSUMPTION]/[DECISION-NEEDED] in open_items.yaml.
3. **One content model** — facts corrected once, re-rendered everywhere.
4. **Locked vocabulary** — RA Annex F everywhere; drift is a defect.
5. **No invented instruments, names, or links** — regulations/URLs only from RL; roles/committees only from RA/F1; undecided names ship as "(to confirm in Wave 2)" — which is also the buy-in strategy.
6. **Builder ≠ checker** — adversarial verification in fresh contexts; findings fixed or explicitly accepted, never auto-resolved.
7. **Human checkpoints at cheap points** — content model (end A) and storyboard (end B), ~30 min each.

## 6. Alignment checklist (mechanical)

- RACI: deck slide 10 = Excel Config = HLD ops section (same 10 activities, one A per row)
- SLAs identical everywhere: RP1 5 / RP2 10 / RP3 20 / RP4 30 / sandbox 5 wd
- Three doors: same names/icons in deck 12–15, register dropdown, HLD catalog
- One 8-metric KPI set; deck slide 17 tiles = Excel dashboard tiles
- Zero occurrences of "Review Profile", "Governance Committee", or a second register name
- Gate names identical in swimlane, register column, HLD lifecycle
- Every appendix reference resolves to an RL entry
- Sample data marked EX-/watermarked; no demo row violates a framework rule

## 7. Tool map

| Tool | Used for | Why |
|------|----------|-----|
| Claude Code | A2–A3, C1–C4, Stage D | File-native skills (pptx/xlsx/docx/pdf/dataviz), subagents for independent verification, one versioned workspace |
| Claude Cowork | Alternative surface for Stage C | Same skills against a local folder; open/refine real files between prompts |
| Lucid (MCP) | B2 diagrams, D3 architecture | Editable, maintainable diagrams; PNG export |
| Claude Design | Optional B1 hero-slide mocks | Click-and-edit visual iteration before pptx commitment |
| dataviz skill | C4 dashboard | One visual system reused in deck and Excel |
| claude.ai chat | Talk-track rehearsal, RA §6.5 objection drills, Arabic review | Fast iteration, no files |

## 8. Clarifications

**Blocking:**
- **Q1** Upload the missing sources (F1, F2, F3/F4, CP/CS, SC, GIF). Recommended: send whatever exists; the rest is tagged UNVERIFIED.
- **Q2** Language? Recommended: English master + Arabic exec-summary slide + bilingual register headers; full Arabic variant after cyber input.
- **Q3** Ministry brand/template? Recommended: use official template; off-brand reads as external.

**Shaping (recommended defaults in parentheses):**
- **Q4** Diagrams: Lucid vs native PPTX shapes (native if no Lucid seats).
- **Q5** Excel macros allowed? (Assume no — formulas-only design.)
- **Q6** Is "SPARK" the official sandbox name? (One name everywhere, Annex F discipline.)
- **Q7** Dashboard mock vs wired to real data (mock now; Looker/billing-export as fast follow).
- **Q8** Authority Matrix names (ship RA Annex B proposals marked "to confirm" — co-owning the matrix in the working session IS the buy-in strategy, RA §6.1).

---
*Grounded in: RA — MoEnergy AI Governance Refinement Analysis v1.0 (findings M-01–M-24, S-01–S-08, G-01–G-14, Annexes A–G) · RL — KSA Regulatory Landscape v1.0 (8 layers, §10 tiers, §11 component mapping).*
