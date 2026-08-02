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

## Quarter-end months only (Mar, Jun, Sep, Dec)

Repeat files 1 and 2 with the quarter as the date range (e.g. 1 Apr to 30 Jun). For a half-year view like H1 2026, same thing with 1 Jan to 30 Jun.

## Rules of thumb

- Pull on the 3rd of the month or later: GCP cost data lags 24 to 48 hours, so a pull on the 1st misses the last days.
- Drop the files straight into the chat (or into `docs/source/finops/YYYY-MM/` in the repo). The dashboard is rebuilt from them and re-issued with the new "Data as of" and "Published" stamps.
- No BigQuery export is needed for this. If ITDT ever enables billing export to BigQuery, the pull can be automated; until then this manual export is the whole job.
