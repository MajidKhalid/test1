# Azure data pull runbook for the FinOps Report Studio

Monthly checklist for the Azure half of the report. About 10 minutes in the Azure portal once you have the right role. It mirrors `GCP_Data_Pull_Runbook.md`: exact CSV exports, no re-typing, one screenshot for the page that has no export.

Everything comes from one place: **portal.azure.com > Cost Management + Billing > Cost Management > Cost analysis**, with the scope set to the Ministry's billing account (or the enrollment, if the agreement is an Enterprise Agreement). Set the scope once at the top of the page and keep it for every download.

**Access note:** Cost analysis needs the **Cost Management Reader** role on the billing scope (view only, it grants no spending power). Reader on a single subscription is not enough for a whole-Ministry figure. If the page is empty or a subscription is missing, ask the billing admin for Cost Management Reader on the billing account, or forward this page and let them do the pull.

## Why CSV and not screenshots

CSV exports carry the exact numbers, so nothing is re-typed and nothing is misread. Screenshots are only for the credit or prepayment balance (no export) and as a visual cross-check of the headline total.

## The monthly pull (every month)

Path for every file: **Cost analysis > choose the view "Accumulated costs" or "Cost by service" > set the date range (top) > set Group by > Download (top bar) > CSV**. Leave "Actual cost" selected; do not switch to "Amortized cost" between downloads, because the two metrics do not reconcile with each other.

| # | File to save | Date range | Group by | Studio slot |
|---|---|---|---|---|
| 1 | `azure_cost_by_service_YYYY-MM.csv` | the month (e.g. 1 to 31 Aug 2026) | Service name | Azure > Month by service |
| 2 | `azure_cost_by_subscription_YYYY-MM.csv` | the month | Subscription name | Azure > Month by subscription |
| 3 | `azure_cost_by_location_YYYY-MM.csv` | the month | Resource location | Azure > Month by region (optional, powers the residency note) |
| 4 | `azure_cost_by_service_to-date.csv` | contract start to today | Service name | Azure > To date by service |
| 5 | `azure_cost_by_subscription_to-date.csv` | contract start to today | Subscription name | Azure > To date by subscription |
| 6 | credit or prepayment screenshot | n/a | n/a | typed into the Studio's Azure credit fields |

File 2 is what builds the "spend per general department" chart for Azure. The Studio maps each subscription (or resource group, if you group by that instead) to a general department through an editable table, exactly as the GCP side maps billing projects. A subscription that is not in the table stops the build with its name rather than being silently dropped.

## Quarter-end months only (Mar, Jun, Sep, Dec)

Repeat files 1 and 2 with the quarter as the date range and drop them in the Azure > Quarter slots. Outside quarter-end months the Quarter tab is hidden in the published report, the same rule as the GCP side.

## The credit or prepayment balance (file 6)

Where it lives depends on the agreement:

- **Microsoft Customer Agreement:** Cost Management + Billing > Billing scope > **Credits**. Note the remaining balance, the starting amount and the expiry date.
- **Enterprise Agreement:** Cost Management + Billing > Enrollment > **Prepayment (Azure Prepayment, formerly monetary commitment)**. Note remaining, starting and the enrollment end date.

Type the three figures into the Studio's Azure credit fields and keep the screenshot with the month's files. The Q2 2026 quarterly report stated the Microsoft credit as a three-year total; the annualised line understates later years by design, and the report says so wherever the budget position is shown.

## Rules of thumb

- Pull on the 3rd of the month or later: Azure cost data lags 8 to 24 hours and month-end credits post late.
- Keep the currency consistent. The download carries both `Cost` (billing currency) and `CostUSD`. The Studio reads `CostUSD` and converts at the official 3.75 peg; if the billing currency is already SAR, set the Azure invoice currency to SAR in the Studio and it reads `Cost` instead.
- Drop the files straight into the Studio (or into `finops/data/YYYY-MM/` in the repo). The report is rebuilt from them and re-issued with the new "Data as of" and "Published" stamps.
- If the tenant ever enables **Exports** (scheduled CSV to a storage account), the same files arrive automatically and the manual download stops being the job. Nothing in the Studio changes.

## The columns the Studio expects

The Studio reads the header row and is tolerant of the naming the portal uses in different views:

| What | Accepted column names |
|---|---|
| Name | `ServiceName`, `Service name`, `MeterCategory`, `Meter category`, `SubscriptionName`, `Subscription name`, `ResourceGroup`, `Resource group`, `ResourceLocation`, `Resource location` |
| Cost in USD | `CostUSD`, `Cost (USD)`, `PreTaxCostUSD` |
| Cost in billing currency | `Cost`, `PreTaxCost`, `CostInBillingCurrency` |
| Currency | `Currency`, `BillingCurrency` |

A file with a `UsageDate` or `Date` column (daily rows) is summed per name automatically.

The five `SAMPLE_azure_*.csv` files in `finops/data/` show the shape. **Every figure in them is invented.** They exist so the intake can be tested before the real export is available; a file whose name starts with `SAMPLE_` makes the report show a "Sample data" chip that will not go away until real files replace it.

## The monthly check that keeps this honest

Before publishing, confirm that the by-service total and the by-subscription total for the same month agree to within a few dollars of portal rounding. If they do not, one of the two downloads was taken at a different scope or with a different date range. Pull both again from the same scope, changing only the Group by between downloads.
