# Why the credit consumed does not equal the reported spend

**Question:** the hero card says **SAR 4,031,121.38** of purchase-order credit has been consumed to
date, and section 01 says GCP net spend to date is **SAR 3,128,009**. Why the difference?

**Short answer:** the two figures answer different questions over different windows. One is a
commercial position (what has been invoiced against the purchase orders since the contract started
on 1 June 2025, including everything the PO pays for). The other is a usage measurement (what the
billing account metered between 1 October 2025 and 31 July 2026, after discounts and credits). They
were never going to be equal. The gap is **SAR 903,112.53 (USD 240,830.00)**, about 29% of the
reported spend, and it decomposes into four things, three of which are structural and provable from
the exports themselves.

---

## 1 · The arithmetic, exactly

| | SAR | USD at 3.75 |
|---|---:|---:|
| PO 1 (fully utilized) | 333,782.21 | 89,008.59 |
| PO 2 (inc. enhanced support) | 9,351,453.60 | 2,493,720.96 |
| **Starting credit** | **9,685,235.81** | **2,582,729.55** |
| Remaining as at 31 July 2026 | 5,654,114.44 | 1,507,763.85 |
| **Consumed** | **4,031,121.37** | **1,074,965.70** |
| **Reported net spend, Oct 2025 to Jul 2026** | **3,128,008.84** | **834,135.70** |
| **Gap** | **903,112.53** | **240,830.00** |

The card prints 4,031,121.38 where the subtraction gives 4,031,121.37. That is a one-halala rounding
artifact of taking two already-rounded balances, not an error worth chasing.

What the reported figure is built from, read straight from the to-date export
(`Reports, 2025-10-01 to 2026-08-31`, grouped by service, 29 service rows):

| Line in the export | SAR | USD |
|---|---:|---:|
| List cost (gross usage) | 5,896,377.97 | 1,572,367.46 |
| Negotiated savings | -967,494.75 | -257,998.60 |
| Savings programs | -38,522.18 | -10,272.58 |
| Other savings (credits) | -1,762,352.25 | -469,960.60 |
| **Subtotal (what the report calls net spend)** | **3,128,008.84** | **834,135.70** |
| **Tax** | **0.00** | **0.00** |

---

## 2 · What is in the gap

### 2.1 Four months of contract that this billing account cannot see (structural, certain)

The contract starts **1 June 2025**. Billing account `cntxt-...-002` holds data from **1 October
2025**. So June, July, August and September 2025 are invisible to every report in the artifact, and
any spend in those months drew down the PO without ever appearing in the 3,128,009.

The visible marker is PO 1: **fully utilized at SAR 333,782.21 (USD 89,008.59)**, a small first order
of the kind that gets opened at contract start and burned before the main order takes over. This is
the open question already recorded against the account: whether an earlier billing account (`-001`)
holds the pre-October spend.

### 2.2 Tax (structural, certain that it is absent from the report)

**Every one of the 21 exports prints `Tax 0.00`.** The console Reports view for this account is a
pre-tax view of metered usage. If the invoices carry the standard 15% KSA VAT and the purchase order
is drawn VAT-inclusive, that is **SAR 469,201.33 (USD 125,120.35) on the reported spend alone, 52% of
the whole gap**, and it could never show up in section 01 no matter how the report is built.

Whether the PO is drawn gross or net of tax is a contract question, not a data question. One invoice
settles it.

### 2.3 Enhanced support (structural, certain that it is absent from the report)

The card's own credit-sources panel labels the second order **"PO 2 · inc. enhanced support"**. A
text sweep of all 21 exports finds no support line anywhere: not in the service list, not in the
project list, not in the sandbox filter. Support is invoiced against the PO and is not metered usage,
so it draws the balance down and never reaches the report.

Sized at Google's published Enhanced Support tiers (10% of the first USD 10K per month, 7% to 80K, 5%
to 250K, 3% above) against the months held: **about USD 55,035, roughly SAR 206,380, 23% of the gap**.
That is a model, not a reading. It is the right order of magnitude but the contracted rate may differ.

### 2.4 Timing (small, but it means the two are never snapped at the same instant)

The credit balance is a point-in-time read from the console. Usage data lags 24 to 48 hours, and
invoices land monthly in arrears. The to-date export is also pulled with an end date of 31 August
2026, so one or two days of August usage may sit inside the 3,128,009 while the credit balance is
stated as at 31 July. Immaterial at this scale, worth knowing before anyone tries to reconcile to the
halala.

### 2.5 What is **not** in the gap

**Credits are already inside the reported figure and cannot explain it.** The USD 450,000 migration
credit shows on the card as the struck-through **SAR 1,687,500** incentive row, and it sits inside the
export's `Other savings` column (SAR 1,762,352.25 to date, of which 1,687,500 is that credit). It has
already been subtracted from the 3,128,009. Credits make the reported number *smaller*, so they push
in the opposite direction to the gap.

Marketplace charges are also inside: Fortinet Security SaaS, F5 BIG-IP and FortiGate all appear as
service rows, so third-party billing is not a hidden component either.

---

## 3 · Two ways the gap can close, and which one fits

The three components above cannot all be full size at once, because together they would overshoot.
There are two coherent readings, and they differ only on whether the PO is drawn VAT-inclusive.

| | Model A: PO drawn **including** VAT | Model B: PO drawn **excluding** VAT |
|---|---:|---:|
| Reported net spend (given) | 834,135.70 | 834,135.70 |
| Enhanced support (modelled) | 55,035 | 55,035 |
| VAT at 15% on the total charged | 140,213 | 0 |
| **Implied pre-October 2025 usage** | **45,583** | **185,795** |
| Same in SAR | 170,934 | 696,733 |
| Implied monthly rate, Jun to Sep 2025 | USD 11,396 | USD 46,449 |
| Actual rate, Oct to Dec 2025 | USD 24,482 | USD 24,482 |

**Model A is the plausible one.** It puts the first four months of the contract at about half the
October to December run rate, which is what a ramp-up looks like. Model B requires the four earliest
months of the contract to have run at nearly twice the rate of the months that followed, while the
migration credit was still being consumed. That is not a shape spend usually takes.

So the working conclusion, to be confirmed against one invoice: **roughly half the gap is VAT, about a
quarter is enhanced support, and the remainder is pre-October usage that this billing account never
saw.**

**One clue worth following:** the gap is **USD 240,830.00, round to the dollar**. Metered usage does
not land on round dollars. A fixed-price element in the drawdown (a support subscription, a
professional-services line, a one-off) would. That is the first thing to look for on the invoices.

---

## 4 · What closes this properly

Four asks, in the order they pay off:

1. **One monthly invoice PDF, any month.** It shows immediately whether VAT and support are separate
   lines and whether the PO is drawn gross of tax. This alone decides between Model A and Model B.
2. **The partner or reseller PO drawdown statement, October 2025 to July 2026, per invoice.** Compare
   month by month against the monthly net figures already in the report. Any month that does not line
   up names its own cause.
3. **A Reports export for 1 June to 30 September 2025 from billing account `-001`, if it exists.**
   That sizes the pre-October usage exactly and closes the oldest open question on this account.
4. **A fresh Billing > Credits screenshot.** Confirms the migration credit position and that no other
   credit is open behind it.

---

## 5 · The presentational risk, and the one-line fix

Any reader who sees a "consumed" figure above a "net spend" figure on the same page will subtract
them, which is exactly what happened here. The card and section 01 currently give no signal that they
are measured on different bases and over different windows.

Recommended for the next edition (a one-line change, no data work):

- Under the credit card: **"Contract position as at 31 July 2026, including support and tax, from
  contract start on 1 June 2025."**
- Under the section 01 kicker: **"Metered GCP usage in this billing account, after discounts and
  credits, from 1 October 2025."**

Two sentences remove the question permanently and cost nothing in space.
