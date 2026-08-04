# FinOps dashboard generator

The scripts that build `FinOps_Dashboard.html` from the Google Cloud Billing Reports CSVs.
Committed so the department mapping and the chart geometry outlive any one session.

| File | What it does |
|---|---|
| `gen.py` | reads a by-service CSV, converts to Riyals at 3.75, draws the bar charts, the donut and the data tables |
| `depts.py` | the project-ID to general-department table, and the by-project CSV reader |
| `blocks.py` | builds one period block: key figures, department chart, service chart, migration block, sandbox chart |
| `riyal.py` | the 2025 Saudi Riyal mark, traced from the official artwork, emitted as a CSS mask token |
| `period.py` | the standalone CSV parser used to validate a pull before it is published |
| `install4.py` | rebuilds all eleven periods in the dashboard in place and stamps the version |

## To correct a department

Edit the `MAP` table in `depts.py`, then re-run the installer from the previous version's file.
A project that is not in the table stops the build with its name rather than being dropped.

## To rebuild

```bash
FINOPS_DATA="/path/to/GCP Monthly Reports" python3 finops/generator/install4.py
```

`install4.py` is not idempotent against its own output: it asserts on the CSS anchor it injects, so
run it against the previous version's HTML, not against a file it has already produced.

## Currency

Everything reports in Saudi Riyals at the official peg of 3.75 to the US dollar (`gen.FX`).
Google bills in US dollars and the artifact says so wherever a figure appears.
`gen.money()` returns HTML, so it must never be placed inside an SVG `<text>` element.
