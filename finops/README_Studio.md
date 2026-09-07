# FinOps Report Studio

`FinOps_Studio_v1.html` is one HTML page that does the whole monthly job: it asks for the month's exports, the team drops them in, the FinOps statement of the month is written in place, and the page generates the report that gets circulated (`FinOps_Dashboard.html`, the same shape as the July 2026 edition, v20, with two additions: a cloud switch between Google Cloud and Microsoft Azure, and the statement of the month above it).

It replaces `FinOps_Builder.html` and continues the version line: the July 2026 edition was Report v20, so the August 2026 edition generates as v21. The Studio itself is versioned separately (Studio v1) because it changes far less often than the report.

Everything runs in the browser. Nothing dropped into the page leaves the machine. The page it generates has zero JavaScript and makes no external requests, so it opens on SharePoint, from a file share, or as an email attachment, and prints to PDF with every detail table open.

## The credit balance is added up, not typed (Studio v1.2)

The remaining credit balance follows the model in the "GCP, Remaining Credit" slide and is recomputed every month from the spend:

| Line | Where it comes from |
|---|---|
| Total starting credit | the purchase orders (PO 1, PO 2 inc. Enhanced Support), the ledger column net of 15% VAT, read as US dollars at the peg or as riyals per the setting at the top of step 3 |
| minus Enhanced Support | a drawdown that never appears as usage |
| minus direct drawdowns from the back end | one-time payments not visible in the billing dashboard (Log Optimization and Customer Success) |
| minus total consumption based on the GCP dashboard, contract start to date | the net figure of the contract-to-date export you drop in step 2 |
| = Remaining balance | computed |
| Commitments (SecOps, Security Command Center) | contracted totals; what has been used is read from the to-date export by billing service name (Chronicle, Security Command Center); remaining = total minus used |
| = Remaining commitment, = Uncommitted balance | computed |

Fortinet is a one-time payment too, but it appears in the billing dashboard as Fortinet Security SaaS, so it is already inside consumption and is not entered twice. The Google incentives (the NotebookLM credit) sit inside the usage figures as savings and are listed as a source only. The report's credit card carries the same arithmetic in an expandable "How the balance is computed" table, English and Arabic, so leadership can see how the figure was reached.

**The ledger currency is a setting, not an assumption (v1.3).** The ledger column is read as US dollars at 3.75, as the July 2026 edition did, until procurement confirms the currency: the Q2 report noted the column equals riyals divided by 1.15, so it may be riyals net of VAT. The setting sits at the top of step 3 with a "procurement has confirmed" tick. Until the tick is set, the readiness list carries an amber item and the arithmetic note in the report says the currency is still being confirmed. Reading the column as riyals drops the starting credit to about 2.58 million and the balance goes negative, which the readiness list blocks. Commitments are matched to their billing rows case-insensitively and on part of the name ("chronicle" or "Chron" both find Chronicle); the balance panel shows which rows were read, and a commitment that matches nothing is flagged rather than silently counted as fully remaining.

## What v1.3 changed: the download is the deliverable

The file people open is the standalone HTML page the Studio downloads, so the flow now ends there. A review of the tool from the CIO and CFO seat produced these changes:

- **One click.** "Download FinOps_Dashboard_v21.html" is the only primary button, in the header, the fixed bar and step 6. It writes the versioned standalone file. A result panel then states what the file is (one page, no scripts, no internet connection, no Studio, nothing else has to travel with it) and offers three secondary actions: **Open the report in a new tab** (the same content, for the read-through), **Download the stable copy** (`FinOps_Dashboard.html`, the one SharePoint overwrites so the link never changes) and **Download the edition state**. Any edit after the download clears the panel, because the downloaded file no longer matches.
- **Above the fold.** Leadership sees the statement headline and the three "where we are heading" points first, then the key figures. The paragraphs open under "Read the full statement", a CSS-only control that needs no script and prints open. The Studio's live preview in step 5 shows the paragraphs open while you write.
- **The version derives from the month.** July 2026 was v20 and each month adds one, so August is v21 and September v22. Editing the number by hand sticks until "Refill everything from the month".
- **The published date is the download day.** It refreshes when the Studio opens, when you preview as published and when you download, unless you set it by hand in the Adjust section.
- **The ledger currency is explicit** (see the credit section above) and the report says whether procurement has confirmed it.
- **The pull guide is in the page.** Step 2 carries the Google Cloud and Azure export steps inline, so nobody has to open a runbook to know which Group by and which date range each file needs.
- **Continuity.** One person runs the Studio from one machine, so the browser keeps every edit and file between months and says so when the page reopens ("Picked up where you left off"). The edition state file is the backup and the hand-over: save it with the month's CSVs, load it on another machine to continue from there.

## How it feels to use (Studio v1.2)

Six steps, one at a time, on a light page: **Month** (a dropdown; dates, labels, to-date ranges and the quarter rule fill themselves), **Files** (one drop zone for everything, then a table that shows each slot as Loaded, Required or Optional with Replace and Remove), **Credits** (the ledger rows above, with the balance computed live in the panel beside them), **Ownership** (a picker for anything unmapped), **Statement** (token chips and a live preview) and **Generate** (the readiness list and the buttons). A progress strip shows the state of every step, a fixed bar shows the blocker count, and "Preview as published" shows exactly what will be generated.

## What v1.1 added

- **One drop zone.** Drop every CSV for the month at once. The Studio reads each file's header (GCP by service, GCP by project, Azure by service, by subscription, by location) and its date range (from the file name) and files it into the right slot. Each loaded file gets a chip with a selector to re-route or remove it. A month file whose dates do not match the edition is flagged, not refused.
- **One field drives the edition.** Set the reporting month and the data-as-of date, the edition label, the to-date ranges and the quarter rule fill themselves, English and Arabic. Edit any of them after.
- **Unmapped means a picker, not a text edit.** A project or subscription the map does not know appears with a department picker; choosing one writes the map line for you.
- **The statement writes itself around the numbers.** Click a token chip to insert it at the cursor; the live preview on the right shows the panel as it will read in the report; the preview updates as you type without re-rendering the whole report.
- **You always know where you are.** A five-step progress strip at the top, a fixed bar at the bottom with the blocker count and the Generate button, and toasts for every file loaded, mapped or refused.
- **Preview as published.** One click shows exactly what will be generated (publishing rules applied, studio hidden), and one click brings the Studio back.
- **Month-on-month in the report.** The key figures carry a delta chip against the previous month for both clouds.

## The monthly cycle

| Step | Who | What |
|---|---|---|
| 1 | Cloud team | Pull the exports on the 3rd of the month or later. Google Cloud per `GCP_Data_Pull_Runbook.md`, Azure per `Azure_Data_Pull_Runbook.md`. |
| 2 | Cloud team | Open `FinOps_Studio_v1.html` from disk, drop each file into its slot. The readiness list goes green item by item and says what still does not reconcile. |
| 3 | FinOps owner | Refresh the credit positions, write the statement of the month (English, Arabic optional), set Data as of and Published. |
| 4 | FinOps owner | Download. Open the report in a new tab from the result panel and read it through, English and Arabic. Download the stable copy and upload it to SharePoint over the previous edition so the link never changes; keep `FinOps_Dashboard_v21.html` as the archive copy; download the edition state and keep it next to the month's CSVs in `finops/data/YYYY-MM/`. |

## What the Studio asks for

**Google Cloud** (Billing > Reports, credits and discounts options ON, Download CSV):

| Slot | File | Required | Builds |
|---|---|---|---|
| Month · all GCP by service | Reports grouped by Service, the month | yes | key figures, service chart, highlight |
| Month · all GCP by project | Reports grouped by Project, the month | yes | the department donut, exact, and the project table |
| Month · sandbox by service | same as the first, filtered to `prj-moenergy-iw-sb-development` | yes | the sandbox figure and chart |
| To date · all GCP by service | 1 Oct 2025 to today | yes | the Contract to date tab |
| To date · by project, To date · sandbox | same ranges | optional | exact split and sandbox on the to-date tab |
| Quarter · three slots | the quarter | quarter-end editions only | the Quarter tab |
| Credit position | Billing > Credits plus the PO ledger | yes | the credit card in the hero |

**Microsoft Azure** (Cost Management > Cost analysis, Actual cost, billing-account scope, Download CSV):

| Slot | File | Required | Builds |
|---|---|---|---|
| Month · by service | grouped by Service name, the month | yes | key figures, service chart, highlight |
| Month · by subscription | grouped by Subscription name, the month | yes | the department donut, through the subscription map |
| Month · by resource location | grouped by Resource location | optional | the region table and the residency note |
| To date · by service | contract start to today | yes | the Contract to date tab |
| Credit position | Credits (MCA) or Prepayment (EA) | yes | the credit card |

Untick "Include Microsoft Azure" in the Edition box to publish a Google Cloud only edition; the Azure slots then stop being required.

## What the Studio checks before it lets you generate

- Every required file for the reporting month and for the to-date view is loaded.
- The by-service export carries discounts. An export pulled with the credits and discounts options off has `Subtotal ($)` equal to `List cost ($)` on every row and is refused (see the export trap in the GCP runbook).
- Every GCP project and every Azure subscription is mapped to a general department. An unmapped one is named and blocks the build, the same rule as the Python generator.
- The account-level bucket `[Charges not specific to a project]` reconciles to the security services (Chronicle, Security Command Center, Fortinet Security SaaS) to the riyal.
- The by-project total and the by-service total agree; for Azure, the by-subscription and by-service totals agree.
- The statement has a headline and at least one paragraph, and every token in it has data behind it.
- No `SAMPLE_` file is still loaded.

Warnings (amber) do not block: a missing by-project file (the split is apportioned on the latest exact period instead), a missing sandbox file, a missing region file, a to-date view still carrying the previous edition.

## The FinOps statement of the month

The statement opens the report, above the cloud switch, so it is the first thing leadership reads. Above the fold it shows the headline and the up to three "where we are heading" points; the paragraphs sit under "Read the full statement" (CSS only, open in print). It is written in the Studio, one paragraph per line, with the direction points and a signature. Tokens fill themselves from the loaded files and stay correct if a file is replaced:

`{{month}}` `{{prevMonth}}` `{{gcp.net}}` `{{gcp.gross}}` `{{gcp.discounts}}` `{{gcp.change}}` `{{gcp.sandbox}}` `{{gcp.top.name}}` `{{gcp.top.share}}` `{{gcp.td.net}}` `{{gcp.credit.remaining}}` `{{gcp.credit.pct}}` `{{azure.net}}` `{{azure.change}}` `{{azure.top.name}}` `{{azure.top.share}}` `{{azure.credit.remaining}}`

A token with no data behind it shows as an amber "awaiting August 2026 data" marker in the preview and blocks generation. The embedded draft for the September 2026 edition (August data) is written around those tokens; rewrite it freely.

## Publishing rules the Studio applies on generate

- The Quarter tab appears only in quarter-end editions (the checkbox in the Edition box; the readiness list warns if it disagrees with the month).
- The published file opens on Google Cloud, English, the reporting month.
- The `.studio-only` elements (the awaiting-data banner, the preview footer line) are removed.
- Figures are Saudi Riyals at the rate in the Edition box (3.75 to the US dollar). Google invoices in US dollars; for Azure, set the billing currency in the export (USD converted at the peg, or SAR read as is).
- The version number derives from the month (July 2026 = v20, one per month) unless set by hand, and is stamped in the footer, EN and AR, and in the file name. The Published date is the download day unless set by hand.

## Files in this folder

| File | What it is |
|---|---|
| `FinOps_Studio_v1.html` | the Studio (v1.3): intake, credits, statement, preview, download. Open from disk. Never publish. |
| `Azure_Data_Pull_Runbook.md` | the Azure half of the monthly pull |
| `README_Studio.md` | this file |
| `data/2026-08.edition.baseline.json` | the state the Studio ships with: every July-stream period (Jan to Jul 2026, Q1, Q2, H1, contract to date) lifted from `FinOps_Dashboard_v20.html`, the Azure H1 2026 figures from the Q2 quarterly report, the credit positions, the statement draft. Load it with "Load edition state" to start over. |
| `data/SAMPLE_*.csv` | the six export shapes, for testing the intake. **Every figure in them is invented.** A loaded sample file puts a "Sample data" chip on the report and blocks generation until replaced. |
| `studio-src/` | the pieces the Studio is assembled from (`report.css`, `studio.css`, `body.html`, `app.js`, the identity assets, the baseline extras) and `assemble.py`, which inlines them into the single file. Edit a piece, run the assembler, bump the Studio version. |

The GCP runbook, the Python generator and the July editions live in the `finops/` folder of the `claude/spark-site-v4-revision-jzjiqk` branch; this folder adds to it and does not change any of those files.

## House rules carried over from the July stream

- No em dash anywhere: not in the report, not in the Studio, not in commits.
- Zero JavaScript in the published file; every control is a CSS radio or a native details element, so it survives SharePoint's preview pane with scripts blocked.
- Bilingual in one page: every string ships EN and AR twins, the switch flips to RTL, charts and tables stay LTR, figures sit inside `bdi` so they never reverse.
- The credit card is a contract position (from 1 June 2025, support and tax included); the spend figures are metered usage in the billing account (from 1 October 2025). The report now says so under both, so nobody subtracts one from the other again.
- The department split is read from the billing project (or subscription), never from labels; a security appliance can be owned by IT Services GD, and the type column says so.
- Arabic added in this edition (the statement, the Azure strings, the cloud switch) is fresh modern standard Arabic and needs a native review before the first bilingual send, as the earlier additions did.

## Rebuilding the Studio

```bash
python3 finops/studio-src/assemble.py      # writes finops/FinOps_Studio_v1.html and data/2026-08.edition.baseline.json
```

The assembler refuses to write if an em dash survives anywhere outside the base64 payloads. A verification script (`studio-src/verify.js`, Playwright) opens the Studio headless, checks the derived version and date, the ledger setting, the commitment matching, drops the sample files, downloads the report through the real button, opens it in a new tab, and then exercises the downloaded file with JavaScript disabled: Read more, cloud switch, month dropdown, to-date tab, language flip, print media, zero external requests.
