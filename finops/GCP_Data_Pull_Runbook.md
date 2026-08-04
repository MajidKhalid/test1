# GCP data pull runbook for the FinOps dashboard

Monthly checklist. About 10 minutes in the Cloud Console once you have the right role.
Everything comes from one place: **console.cloud.google.com > menu > Billing**, with billing account `0131EC-6DEF7A-3CB945` selected.

**Access note:** viewing the Reports page needs the **Billing Account Viewer** role (view only, it grants no spending power). Linking projects (billing.user, which you already have) is not enough on its own. If the Reports page is empty or missing, ask the billing admin for Billing Account Viewer, or forward this page and let them do the pull.

## Why CSV and not screenshots

CSV exports carry the exact numbers, so nothing gets re-typed and nothing gets misread. Screenshots are only for the one page with no export (Credits) and as a visual cross-check of the headline totals. Excel is fine too if the console offers it; CSV is the default.

## The monthly pull (every month)

Path for every file: **Billing > Reports**. Set the date range (top right), set **Group by**, keep the credits and discounts checkboxes ON in the panel on the right, then use the **Download CSV** icon above the chart.

| # | File to save | Date range | Group by | Filter |
|---|---|---|---|---|
| 1 | `cost-by-service_YYYY-MM.csv` | the month (e.g. 1 to 31 Jul 2026) | Service | none |
| 2 | `cost-by-project_YYYY-MM.csv` | the month | Project | none |
| 3 | `cost-by-service_to-date.csv` | 1 Jun 2025 to today | Service | none |
| 4 | `cost-by-project_to-date.csv` | 1 Jun 2025 to today | Project | none |
| 5 | `sandbox-trend.csv` | 1 Jun 2025 to today | Month | Projects = `prj-moenergy-iw-sb-development` |
| 6 | credits screenshot(s) | n/a | n/a | **Billing > Credits** page: every credit's name, remaining amount, and expiry date visible |

File 5 is the evidence for the sandbox story (high usage, then restructure, then stable). File 6 powers the credit runway and the expiry warning.

**File 2 matters more than it used to.** The "spend per general department" chart is built from the by-project export rather than from labels. July 2026, H1 2026 and the contract to date have one, so their split is exact and every project is listed. The other eight periods derive their split from their own by-service export instead (see the department mapping below), which pins 76% to 100% of each period exactly and apportions only the shared infrastructure residual. Pulling file 2 for Jan, Feb, Mar, Apr, May and Jun 2026 as months, plus 1 Jan to 31 Mar and 1 Apr to 30 Jun as quarters, makes all eleven periods exact. Same panel, same settings, only the date range and the Group by change.

## Quarter-end months only (Mar, Jun, Sep, Dec)

Repeat files 1 and 2 with the quarter as the date range (e.g. 1 Apr to 30 Jun). For a half-year view like H1 2026, same thing with 1 Jan to 30 Jun.

## Rules of thumb

- Pull on the 3rd of the month or later: GCP cost data lags 24 to 48 hours, so a pull on the 1st misses the last days.
- Drop the files straight into the chat (or into `docs/source/finops/YYYY-MM/` in the repo). The dashboard is rebuilt from them and re-issued with the new "Data as of" and "Published" stamps.
- No BigQuery export is needed for this. If ITDT ever enables billing export to BigQuery, the pull can be automated; until then this manual export is the whole job.

## The one export setting that must not change

Every figure the dashboard states as **net spend** comes from the `Subtotal ($)` column. That column only carries the negotiated savings, savings programs and other savings if the credits and discounts options are switched on in the panel on the right of the Reports page. With them off, the CSV still exports cleanly, the service list and the `List cost ($)` column are correct, and `Subtotal ($)` silently equals `List cost ($)`.

There is no warning in the file. The way to spot it: open the CSV and look at the `Negotiated savings ($)` column. If every row reads `0.00`, the export was run with the options off and the net figures are unusable.

**Safest method:** pull the current month first, check that column, then change only the date range for each further period and download again. Do not touch the panel between downloads.

For scale, the Jan to Jun 2026 pull done this way reported $1,174,633 of usage as if it were the net cost. The correct net for the same six months is $614,875. The exports were understating the discount by $559,758.

## The department mapping

The department chart reads the billing project each charge sits in and maps it to a general department. The map lives in `finops/generator/depts.py` and is a plain project-ID to department table, so a correction is a one-line edit and a regeneration.

| Bucket | What lands there |
|---|---|
| Cybersecurity Department | `[Charges not specific to a project]`, `moe-secops-484408`, `prd-security-kms`, `dev-security-kms` |
| Shared services across departments | `prd-hub`, `dmz-host`, `dmz-srv`, `prd-host`, `dev-host`, `test-host`, `bootstrap`, `billexp`, `migration-host-hq` |
| Support Services GD | `prd-data-dbs`, `dev-data-dbs`, `prd-bs-devops`, `dev-bs-devops`, `prd-infra-mngeng`, `prd-bc-centlogs`, `dev-centlogs`, `prd-bc-website` |
| IT and Digital Transformation | `iw-sb-development`, `iw-it-dtgd-ad-ne`, `iw-spark-admin` |
| Other | `moe-notebooklm` |

Every project also carries a type (Cybersecurity, Infrastructure or Application) in `depts.LABELS`, and the report lists all of them under the department chart's View details so the split can be checked line by line.

The shared bucket is both infrastructure and a cybersecurity solution, so the report states the split. The F5 BIG-IP and FortiGate marketplace appliances are billed as virtual machines inside the shared network platform, so they land in the shared bucket by project. Their figure comes from the by-service export (`depts.appliances`) and is carved out of the hub row: July SAR 83,477 of SAR 178,175 shared (47%), H1 SAR 436,778 of SAR 611,374 (71%), to date SAR 522,457 of SAR 800,642 (65%). No other shared project is large enough to hold them, which is what pins them to the hub.

### Periods with no by-project export

Those periods are derived from their own by-service export. Five service lines map to exactly one department, each verified to the cent against the by-project export in all three periods that have one:

| Service line | Department | Why |
|---|---|---|
| Chronicle, Security Command Center, Fortinet Security SaaS | Cybersecurity | together they equal the account-level charge bucket exactly |
| Cloud Pub/Sub | Cybersecurity | equals `moe-secops-484408` exactly |
| Vertex AI Search | Other | equals `moe-notebooklm` exactly |
| F5 BIG-IP, FortiGate | Shared services | the marketplace appliances inside the shared network platform |

Whatever those lines do not cover is shared infrastructure (compute, network, storage, logging) and is apportioned on the H1 2026 residual mix, which is itself read from the H1 by-project export. Because the exact parts are additive and the apportionment ratio is constant, the six months and the two quarters add back to the published H1 department split exactly. Each card states the percentage it read directly versus apportioned.

The account-level bucket carries no project ID, so it cannot be mapped by project. It is assigned whole to Cybersecurity because it reconciles to the cent with the security services in the by-service export for the same period: July `$79,462.25` = Chronicle + Security Command Center; H1 and to-date add Fortinet Security SaaS. Re-run that check each month before publishing; if the two stop matching, the bucket has picked up something that is not security and the assignment has to be revisited.

Note that F5 BIG-IP and FortiGate run as marketplace appliances inside the shared network hub, so they are counted under shared services rather than Cybersecurity. A new project that is not in the table stops the build with the project name, rather than being silently dropped.
