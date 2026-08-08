# Shareable demo · Retail sales analytics dashboard

`Retail_Sales_Dashboard_v1.html` is a sanitised, shareable version of the FinOps report
template. It is meant to be handed to someone outside the Ministry who liked the format and
wants to build the same thing for a different subject.

**Nothing in it is real.** The company (Northwind Retail Group), the categories, the channels
and every figure are invented. The file is built by `generator/build.py`, which starts from
`finops/FinOps_Dashboard.html` and strips the artifact down to its template before filling it
with generated data.

## What was removed

| Removed | Why |
|---|---|
| The Digital Energy wordmark, the animated Digital Energy lockup, both Ministry of Energy lockups (5 embedded images, 731 KB) | They are the organisation's marks and must not travel |
| The Lafet display font (30 KB embedded OTF) | Licensed to the organisation; redistribution is not ours to give |
| The gradient orb recipe and the `de-*` class names | Part of the same identity package; the demo uses a flat accent dot and `fx-*` names |
| Every real figure, every service name, every project, every department, the credit balances and the purchase-order values | The commercially sensitive part |
| The currency mark, the Riyal conversion and the invoice-currency wording | Replaced with a plain dollar sign; the friend picks his own |
| The organisation's names in the title, hero, footer, print line, JavaScript and CSS comments | Sanitised, including in source comments |

A build-time sweep fails the build if any of about 30 terms survives anywhere in the file,
base64 payloads excluded. The output carries no images at all and makes zero external
requests.

## What was kept, because it is the part worth copying

- **One self-contained file.** No CSS, no JavaScript, no images, no fonts to ship alongside it.
  It opens from a file share, an intranet, SharePoint, or an email attachment.
- **It does not need JavaScript.** The period control, the language switch, the dropdowns and
  the expandable detail tables are all CSS: hidden radio inputs, `:checked` selectors and
  `details`/`summary`. Scripts only add URL state and the print helper.
- **Bilingual in one page.** Every string ships English and Arabic twins; the switch flips the
  page to RTL, keeps the charts and tables LTR, and wraps figures in `bdi` so `$1,234` never
  reverses.
- **One period control moves the whole report** across seven months, three quarters and the
  year to date. Eleven periods, each with its own figures, in the same file.
- **The chart set**: a donut with an HTML legend, ranked horizontal bars, a key-highlight box
  and a collapsed detail table under each chart, so the page stays short but every number can
  be checked.
- **A print path.** Printing or saving to PDF states the period in words, hides the tab strip,
  and opens every detail table so the export carries the whole report.
- **Responsive down to a phone**, with the two headline figures holding side by side to 640px.

## What to change first

1. `NORTHWIND` in the top bar and the hero, and the `YOUR LOGO` slot beside it. The slot is a
   dashed box sized for a real lockup; drop an `<img>` in and delete the placeholder styles.
2. The palette. It lives in CSS custom properties near the top of the file: the navy, the blue,
   the teal and the accent. The four floating shapes in the hero are pure CSS and can be
   recoloured or deleted with the `.fx-motifs` block.
3. The currency. One rule, `.rs::before{content:"$"}` in the `demo-neutral` style block.
4. The subject. Section 02 is channel donut, category bars, a bridge paragraph, then the
   sub-channel bars. Any "total, then its parts, then one part in detail" story fits that shape.

## Rebuilding it

```bash
python3 demo/generator/build.py          # writes demo/Retail_Sales_Dashboard_v1.html
CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
NODE_PATH=$(npm root) node demo/generator/qa.js
```

`data.py` holds the fictional dataset and generates it from a fixed seed, so a rebuild
reproduces the same numbers. The periods reconcile: the quarters are the sum of their months,
the half year is the sum of its quarters, the channel split adds back to the period total, and
the entity list adds back to the channel split.

## Two notes before sending it on

- The three embedded fonts are **IBM Plex Sans Arabic**, under the SIL Open Font License. They
  are free to redistribute inside the file; the licence notice should travel with the project.
- The demo says on its face that the data is invented: a "Sample data" chip in the hero, a line
  in the opening paragraph, a line in the notes under the charts and a line in the footer. Keep
  at least one of those if the file is forwarded again.

## QA that was run on this build

Zero external requests, zero JavaScript errors. Period switching, the month and quarter
dropdowns and the language switch verified with scripts enabled **and** with JavaScript
disabled. RTL flip confirmed to match the source template in both modes, with no English
leaking into the Arabic view. Widths 1440 down to 390 with no horizontal scroll, the headline
pair two-up to 641px and stacked at 640. Print media checked: period line rendered, tab strip
hidden, detail tables opened.
