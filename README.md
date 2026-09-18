# Tunisia · 18–25 Sep 2026

Family trip site. Open `tunis-trip/index.html` from any static host (GitHub Pages works as-is).

- **Plan** — the day-by-day itinerary with a map. Tap a row to change its time of day, move it, get directions or remove it.
- **Explore** — the catalogue: Food · Sights · Shopping · Nightlife · Relax, filterable by area, searchable. Add anything to any day.
- **Book** — the route (which base for each of the six nights, with presets), a home for each stop chosen from photo rails, the car, and a reservation checklist built from the plan. **Share plan** copies a link that carries route, stays and plan to another phone. Flights are booked and appear as fixed rows on Day 1, 2 and 8; the Carthage home is booked and locked.

Every place, stay, drive and airport row has a Google Maps link. The map draws the day's route along real roads; with a Google Maps key in `tunis-trip/config.js` it becomes a Google map (see below).

## Trip-planner bot

`bot/` is a chat bot (Telegram group, or a WhatsApp number) that edits the shared plan from messages like "add El Jem on Wednesday" and publishes it to `tunis-trip/plan.json`; the site pulls that file and updates on every phone. Setup in `bot/README.md`.

## Google Maps

`tunis-trip/config.js` holds `googleMapsKey`. Empty: the site uses Leaflet with OpenStreetMap tiles and OSRM road routes, no key needed. Set: the site loads Google Maps JavaScript with Google Directions. Create the key in Google Cloud (Maps JavaScript API + Directions API enabled), restrict it to the HTTP referrer `majidkhalid.github.io/*`, paste it into `config.js`.

English and Arabic; follows the system light/dark setting.

Files: `index.html`, `styles.css`, `config.js` (map key), `data.js` (all content), `app.js`, `plan.json` (shared plan written by the bot), `qa.spec.js` (Playwright, run by the GitHub Actions workflow; the workflow also runs the bot's unit tests). Review notes and what changed: `tunis-trip/REVIEW.md`.
