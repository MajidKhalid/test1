# Tunisia trip site — review and revamp notes

Reviewed 17 Sep 2026, the day before departure. Two tracks: **UI/UX** and **trip plan & choosing**. Every note below has a resolution; all were addressed in the rebuild that ships with this document.

Context that shaped the decisions:

- Flights are booked (night departure Fri 18 Sep, arrival Tunis early Sat 19 Sep, return Fri 25 Sep). The site no longer needs to sell a flight ranking.
- The family will use the site mostly **on phones, during the trip**, when someone says "what should we do now?".
- The brief: minimal, Apple-grade experience; a long pick-and-choose list with tabs for food / sights & museums / shopping / nightlife; picks reflected on the map and plan; help with the remaining bookings (stays, car, reservations).

---

## Track 1 · UI/UX

| # | Finding | Severity | Resolution |
|---|---|---|---|
| U1 | **One endless page.** Desktop page is ~24,000 px tall, mobile ~51,000 px. Map, calendar, booking, flights, cars, WhatsApp importer, stays and 84 activity cards are stacked in a single scroll. Nothing is reachable in one tap on a phone. | High | Rebuilt as three views with a segmented control and a mobile tab bar: **Plan**, **Explore**, **Book**. Each view fits its job; nothing else is on screen. |
| U2 | **The primary job is buried.** "Pick an activity for now" required scrolling to section 04-E, switching a tab, and finding the right timeslot among 28 groups. | High | **Explore** is a first-class view: category tabs (Food · Sights · Shopping · Nightlife · Relax), an area filter that defaults to where you are that day, search, and one-tap "Add to day". |
| U3 | **Visual noise.** Five type weights, three accent colours (teal, gold, navy), gradients on cards, ribbons, pills, emoji everywhere, 20-card horizontal rails with scores in three places per card. | High | One accent colour, system font stack, one card style, 1 px hairlines instead of shadows, no gradients, small monochrome SVG glyphs instead of emoji. Dark mode follows the system. |
| U4 | **Imagery is broken by design.** Most "photos" are `thum.io` / `mshots` screenshots of web pages, hot-linked Airbnb CDN files and random blog images. They load slowly, many 404 (blank white cards in the baseline screenshots), and screenshots of Wikipedia pages are not photos. | High | No hot-linked imagery. Cards are typographic with a category glyph and an area colour. This is also why the page is now light and instant. |
| U5 | **Three competing translation engines.** `i18n.js`, `i18n-urgent.js` and `i18n-latest.js` each walk every text node on every DOM mutation with a MutationObserver. They race, re-translate each other's output and cost CPU on every render. Half the UI strings had no Arabic entry. | High | One dictionary, rendered directly from data (`t()`), no DOM walking. Every UI string and every catalogue item has Arabic. RTL layout handled by `dir` on the root. |
| U6 | **Fourteen layered patch scripts.** `data.js` is overwritten by `planner-options`, `image-corrections`, `urgent-plan`, `urgent-activities-1..4`, `urgent-flights(-latest)`, `urgent-central-stays`, `urgent-finalize`, `night-flight-plan` … The effective plan is impossible to read from any single file and several patches contradict each other (see T1–T3). | High | One `data.js`, one `app.js`, one `styles.css`. Legacy files removed. |
| U7 | **Copy is written for a booking agent, not a family.** "BOOKING DEADLINE MODE", "one protected PNR", "self-connect risk", "Research refreshed 17 Sep 2026" appear above the fold. | Medium | Copy rewritten in plain language. Booking caveats live only in Book, next to the thing they concern. |
| U8 | **No sense of "today".** The site does not know which day it is, so during the trip every visit starts at the top. | Medium | Plan opens on today's day when the date falls inside the trip (otherwise the first day). |
| U9 | **Map controls compete with content.** A sticky day strip plus Routes/Pins toggles sits under a sticky header and takes 116 px of every screen. | Medium | The day strip lives inside Plan and the map is the day's map. Toggles removed; the plan is the route. |
| U10 | **Selection state is unclear.** Selected stays get a teal outline, selected flights a dark button, selected activities reduced opacity for the others. Three different signals for the same idea. | Medium | One selection language everywhere: a filled check control, and "Added · Sun 20" on the button. |
| U11 | **No way to share a plan.** Every device has its own `localStorage`; the family cannot see one plan. | Medium | **Share** copies a link that carries the plan; opening it on another phone loads the same plan. |
| U12 | **Mobile tab bar labels (Map / Calendar / Book / Configure)** name page sections, not tasks. | Low | Plan · Explore · Book. |
| U13 | **Accessibility gaps.** Segmented "tabs" are plain buttons without `role=tab`, colour contrast on muted text (#697383 on #fbfaf7) is borderline, focus rings suppressed by outline styling. | Low | Proper `tablist`/`tab`/`aria-selected`, contrast ≥ 4.5:1, visible focus rings. |
| U14 | **External dependencies on every load**: Leaflet from unpkg, OSRM routing, thum.io, mshots, OpenStreetMap tiles. | Low | Only Leaflet + one tile provider remain; both fail gracefully (a labelled placeholder replaces the map; the rest of the site works). |

## Track 2 · Trip plan & choosing

| # | Finding | Severity | Resolution |
|---|---|---|---|
| T1 | **Saturday 19 Sep is empty.** `night-flight-plan.js` shifts every activity one day later, so the old "arrival night" slots (a 23:45 airport transfer and a 00:15 supper) land on Saturday — while the flight actually lands at 02:15 Saturday. The first real day in Tunis has no daytime plan. | High | Saturday is rebuilt as a gentle first day: late start, Medina walk, souks, Sidi Bou Said at sunset. |
| T2 | **Sunday 20 Sep has duplicate, overlapping slots.** The same shift maps old Day 7 (Bardo, La Goulette, final shopping, farewell dinner) onto Day 3, so Sunday has two "morning anchors" (Bardo at 09:00 *and* Bardo at 09:30), two lunches and two shopping blocks, both recommended. | High | One coherent Sunday: Bardo → Carthage → La Goulette lunch → La Marsa → dinner in Sidi Bou Said. Dougga offered as an alternative day trip. |
| T3 | **"Nabeul Friday market" is scheduled on a Thursday.** | Medium | Nabeul day now uses the pottery quarter and permanent souk; the Friday market is listed as an option with its day stated. |
| T4 | **The "3 alternatives per slot" model fights the brief.** The family wants a long list to browse and pick from, not 28 forced choices among three. It also cannot express "add a second lunch option" or "we are in Sousse, what's near?". | High | Catalogue-and-plan model: ~110 places in five categories, filterable by area; any item can be added to any day and moved between morning / midday / afternoon / evening / night. |
| T5 | **No nightlife / drinks tab** although requested. | High | **Nightlife** tab with bars, lounges, rooftop terraces, beach clubs and evening tea spots, plus a note that Kairouan is effectively dry. |
| T6 | **Food, shopping and leisure were mixed into one tab** ("Dining · shopping · leisure"), and museums were mixed with ruins under "Historical". | Medium | Five tabs: Food · Sights · Shopping · Nightlife · Relax. |
| T7 | **Twenty flight options ranked around a departure preference** that is now moot. | Medium | Flight booking removed from the site entirely. The booked itinerary (Turkish Airlines out Sat 19 Sep 01:45 → 09:00; Saudia back Fri 25 Sep 11:40 via Jeddah) is fixed into Day 1, Day 2 and Day 8. No reservation codes, ticket numbers or seats are stored, because the Pages address is public. |
| T8 | **Stays: the fourth block ("final night Sidi Bou Said") is still in the code**, contradicting the current 2+2+2-night plan. | Medium | Three blocks only: Tunis (Sat–Mon), Sousse/Kairouan (Mon–Wed), Hammamet (Wed–Fri). |
| T9 | **Stay lists are 20-long rails with a fabricated 0–100 score** (experience×5 + privacy×3 + value×2). The score dominates the card but the formula is hidden. | Medium | Chosen stay shown first; the shortlist keeps the three visible ratings (experience, privacy, value) and drops the composite number. Lists collapsed behind "Change". |
| T10 | **Booking help is generic.** The checklist is a static 12-line list; it does not know what you actually picked. | High | Book builds its reservation list from your plan: every picked place that needs a reservation or tickets, each stay, the car, with links and check-off state. |
| T11 | **No "where to eat near here" logic.** Restaurants are scattered by day, not by place. | Medium | Explore filters by area; Plan's "+ Add" opens Explore pre-filtered to that day's area. |
| T12 | **Drives are undersold.** Tunis → Kairouan → Sousse and Sousse → El Jem → Hammamet are 2–3 h days but the plan says nothing about a break, and the excellent en-route stops (Zaghouan Water Temple, Takrouna) are missing. | Medium | Drive rows show approximate durations; Zaghouan and Takrouna are in the catalogue and Zaghouan is in the default Monday plan. |
| T13 | **Accessibility for the mother** was mentioned in copy but never modelled. | Low | Places carry an "easy walking" tag where relevant; stays note stairs/ground floor where known. |
| T14 | **Practical facts missing**: what to drink, tipping, Friday closures, mosque access, taxi vs car. | Low | A short "Good to know" block in Book. |

---

## What was removed

`app.js` (old), `planner-options.js`, `image-corrections.js`, `urgent-plan.js`, `urgent-activities-1..4.js`, `urgent-flights.js`, `urgent-flights-latest.js`, `urgent-central-stays.js`, `urgent-finalize.js`, `night-flight-plan.js`, `extras-ui.js`, `luxury-cars.js`, `luxury-cars-latest.js`, `cars-ui.js`, `car-images-ui.js`, `urgent-support.js`, `hardening.js`, `i18n.js`, `i18n-urgent.js`, `i18n-latest.js`, `night-ui.js`, `layout-v2.css`, `options-v3.css`, `image-fixes.css`, `i18n.css`, `urgent-v4.css`, `research-refresh.css`, `qa-night.spec.js`.

The researched stay and car shortlists were **kept** and ported into the new `data.js`.

## What the new site is

- `index.html` — shell, three views, one dialog.
- `styles.css` — design tokens, light/dark, RTL.
- `data.js` — trip days, areas, catalogue, stays, cars, default plan.
- `app.js` — state, rendering, map, share link.
- `qa.spec.js` — Playwright checks run by the existing workflow.
