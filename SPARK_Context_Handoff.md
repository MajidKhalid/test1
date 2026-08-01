# SPARK_Context_Handoff.md — the full story

> For the agent picking this up in Claude Code. `CLAUDE.md` (root + `SPARK_Site/`) is the terse memory — facts, decisions, rules. This file is the *why*: how the project got here, who it is for, and what each artifact is doing. Read once; after that, trust CLAUDE.md.

## 1 · What you are picking up

**SPARK (شرارة)** is the Ministry of Energy's (Saudi Arabia) governed AI sandbox: self-hosted open-weight LLMs (Llama 3.1 8B, Qwen 2.5 7B, Mistral 7B; ALLaM after Clause-13 checks) on Ministry GPU in GCP **me-central2 (Dammam)**, inside the org's Sandboxes folder. No data leaves the boundary. It exists because the Ministry has real shadow-AI usage and a signed-but-dormant **AI Governance Framework** (July 2026).

**The narrative — locked at v3.0, do not drift:** *The AI Governance Framework is the solution. SPARK is that framework, implemented.* One solution, two states: written and running. SPARK is never "a companion initiative" or "governance + enablement" — it is the framework's running state. Key line: *"We are following the framework's own instructions for implementing the framework."* This framing took three iterations to reach and is the artifact set's spine; every edit must survive the question "does this still read as the framework executing itself?"

## 2 · People and stakes

**Majid (Abdulmajid Aldamigh)** — Strategic Planning Specialist, ITDT, sole Product Owner. Non-developer; builds through AI, hands you screenshots, expects finished work, and *wants honest push-back with reasoning* when something is a bad idea. Writes informally; output must be formal. Formal Arabic for government correspondence. Manager: Nasser Almurshed. The endorsement target is **Alanoud AlShuraym, GM Digital EA** — owner of the framework SPARK implements. The planned move: get her to review the framework-implemented story, then correct register entry **AI-003** *upward* to Tier 5 (verify AI-003 actually is SPARK first — open thread).

**Private context, never in stakeholder artifacts:** SPARK is Majid's promotion vehicle this year. Keep recognition framing out of anything shown to others; artifacts carry the neutral credit line "Prepared and maintained by Abdulmajid Aldamigh — Planning".

## 3 · How the project got here (session history, compressed)

1. **Strategy phase.** Business case and positioning built against the Ministry's cloud strategy and DT refresh docs (these live in the claude.ai MoEnergy project). Narrative evolved v1 "sandbox + governance" → v3 "the framework, implemented".
2. **GCP foundation phase (live-verified).** Org/folder/billing chain confirmed by real gcloud runs, `projectCreator` proven by a test create/delete, me-central2 GPU quota confirmed by Google email. Phase 0 complete; Phase 2 (GPU VM → Ollama → models) blocked on Cloud Computing's VPC/subnet answer. Hard-won lesson: never `gcloud auth login` in Cloud Shell.
3. **Artifact build phase.** The 8-file set built as self-contained HTML with a shared design language; the old Execution Manual was retired into the Admin Guide (do not resurrect it); all M365 references purged (the Ministry has none — register store is an intranet-hosted central list, automation is Cloud Scheduler → Cloud Function).
4. **28–30 Jul session (the one handing over).** Workspace naming overhauled to the org-path derivation `prj-moenergy-iw-<entity>-<gd>-<dept>-<usecase>` with segment codes from the official org circular (old `spark-NNN-tag` retired; engine keeps `prj-moenergy-spark-000-eng`). Spend guardrails designed and documented (Budget A alerts-only everywhere · Budget B honest-scope caps · Pub/Sub killswitch that stops VMs, never billing). The OneStop brief rebuilt to **v3.1 two-page structure** (Page 1 The Case, Page 2 The Proof) with all diagrams redrawn to the Digital Energy language. Portal gained required supervisor email + CC. Register page's missing embedded-mode fixed. Four storyline decisions confirmed by Majid — see `SPARK_Site/CLAUDE.md` "Storyline decisions — CONFIRMED (30 Jul 2026)": three customer groups (incl. adopters of published use cases), escalated-backlog = demand narrative not ops lane, no uncapped-project exception in artifacts, use-case collection stays a PO process task.

## 4 · The artifact set — audience and moment

| File | For whom, when |
|---|---|
| `SPARK_Hub.html` | The front door. Rail + tiles + iframes; everything else loads inside it (embedded mode). Open this first. |
| `SPARK_OneStop_DigitalEnergy.html` | **The** stakeholder brief (v3.1, 9 sections, two pages). For Alanoud and leadership: the case, then the proof. Ends in three decisions. |
| `SPARK_Admin_Guide.html` | The operator's manual (13 sections, runbooks R1–R5). For whoever runs SPARK day to day — currently Majid. |
| `SPARK_Portal.html` | Employee-facing catalog + application form (mailto → SPARK@MoEnergy.gov.sa, supervisor CC'd). |
| `SPARK_Register_AIUse.html` | Non-SPARK AI self-registration (feeds the central register). |
| `SPARK_Governance_Command_Centre.html` | Live governance view; auto-loads bundled SPARK feed, accepts register-workbook drop. |
| `SPARK_How_It_Works.html` | Animated architecture explainer for technical audiences. |
| `SPARK_Automation_Strategy.html` | The 12 automation assets and their platform-neutral store. |

Deep structural details (section lists, feature inventories) are in `SPARK_Site/CLAUDE.md` — that file is authoritative.

## 5 · Design contract (violations are regressions)

Digital Energy brand: navy `#081631`, blue `#0180E9`, teal `#02636A`, coral `#FE734A`, paper `#F4F6F8`; Lafet display (base64-embedded — **broken `§` glyph**, always write "Clause NN") + IBM Plex Sans / Arabic. Figures: thin-line stroke icons in the foreground, DE pillar shapes only as faint `.wm` watermarks, **no emojis inside figures**, animated flow dashes, `.rv` reveal-on-scroll, `.st` staged reveals, pulses. Every page: scrollspy sidebar, halftone motif, and `html.embedded` styling when framed (inner logo/foot hidden, rail 190px). One self-contained file each — never split CSS/JS out. Conservative numbers: label illustrative figures as illustrative, ranges over points.

## 6 · Verification contract

`npm run verify -- SPARK_Site/<file>.html` (flags: `--demo` for the sovereignty demo, `--counters`, `--form`). It drives every section, then checks: JS console clean · every SVG `<text>` inside its viewBox · no text-on-text collisions >30% · no unresolved `<use>` refs · `.rv`/`.st` all revealed · scrollspy active · embedded mode engages in an iframe · screenshots to `shots/`. **Green output + eyeballing the screenshots = done. Neither alone suffices.** The only acceptable console noise is the external Google-Fonts fetch when offline.

## 7 · Open threads, in priority order

1. **Mailbox** `SPARK@MoEnergy.gov.sa` — request from IT service desk; both intake forms are blocked on it (they degrade to clipboard-copy).
2. **VPC/subnet + external-IP answer from Cloud Computing** — blocks the GPU VM build (Phase 2: VM → Ollama → 3 models → firewall `tcp:11434` tag `spark-model-server` → idle schedule 19:00/07:00 Sun–Thu). Screenshot the first local model answer for the brief.
3. **AI-003 verification → Alanoud email** — framework review first, SPARK second; ask to correct AI-003 upward to Tier 5. Short email; formal Arabic if she prefers.
4. Owner sign-off on each seeded catalog one-liner before the portal goes live.
5. Day-90: privileged roles → automation; keep access-verification evidence.
6. When the central register list exists on the intranet, point Command Centre v2 at it and retire the bundled snapshot.

## 8 · What Claude Code does not have

The claude.ai **MoEnergy project** holds the source corpus: cloud strategy + reference architectures + business case PDFs, the Target Cloud Operating Model, the DT strategy refresh, the detailed org structure circular (July 2022/2026 — source of naming segment codes), EA procedures, HR procedures, and the GCP label list workbook. Every load-bearing fact from those documents is already baked into the CLAUDE.md files as verified facts or settled decisions. Do not guess at source-document content; if a task truly needs one, ask Majid to download it from the project into `docs/source/`.

There is also no live GCP from here: infra actions happen in Majid's Cloud Shell, guided by the Admin Guide's runbooks. Your surface is the artifact set, its narrative, and its verification.
