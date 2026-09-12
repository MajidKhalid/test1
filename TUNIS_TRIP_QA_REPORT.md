# Tunisia Trip Planner — QA Report

**Trip:** Riyadh → Tunisia · 18–25 Sep 2026 · 3 adults  
**QA date:** 12 Sep 2026  
**Automated suite:** Playwright / Chromium  
**Latest full run:** GitHub Actions run `34677569882`  
**Result:** ✅ **15 / 15 use cases passed**

## Image remediation

The site previously reused generic city imagery across multiple stays and activities. The current implementation uses the following rules:

1. **Cars:** each of the 20 car options has a model-specific image. Jetour T2, Škoda, Jetour X70, T-Roc, Karoq, 3008, Tucson, Sportage, Qashqai, Stepway, Renegade, Corolla Cross, Austral, MG HS, Ateca, C5 Aircross, 2008, Tiguan, RAV4 and Jimny use separate image sources.
2. **Stays:** verified direct listing photos are used where available. If a trustworthy direct photo URL is not available, the card uses a preview of that *exact property/listing page* rather than substituting an unrelated Tunis/Hammamet/Sidi Bou Said stock image.
3. **Activities:** imagery is tied to the named attraction or activity. Historical attractions use exact attraction/source imagery or a preview of the exact official/reference page. Leisure, shopping and dining entries no longer all reuse the same city image.
4. Broken image URLs have fallbacks where practical; cards do not intentionally substitute a photograph of a different property/model.

## Defined use cases and status

| # | Use case | Expected behavior | Status |
|---|---|---|---|
| 1 | Page information architecture | Map appears before Calendar; Calendar before Configuration; mobile nav has Map / Calendar / Configure | ✅ Pass |
| 2 | Map day filtering and controls | Overall + Days 1–8 work; Routes and Pins can be independently hidden/restored | ✅ Pass |
| 3 | Calendar navigation | 8 trip days render and each day can expand/collapse | ✅ Pass |
| 4 | Flight selection | Exactly 20 ranked flight candidates; 3 visible metrics; selecting a flight updates summary and persists after reload | ✅ Pass |
| 5 | Car selection | Exactly 20 cars; Jetour T2 #1, Škoda SUV #2; 3 metrics; 20 distinct model image sources; selection persists | ✅ Pass |
| 6 | Stay inventory | 3 stay periods, exactly 20 options per period; best option first; Experience / Privacy / Price visible | ✅ Pass |
| 7 | Stay selection propagation | Changing a stay updates the Calendar overnight and survives refresh | ✅ Pass |
| 8 | Activity configuration | Historical vs Leisure tabs work; activities can be included/removed; Reset restores recommended plan | ✅ Pass |
| 9 | Activity image uniqueness | Activity imagery is sufficiently item-specific and no longer one repeated city photo | ✅ Pass |
| 10 | Mobile usability | 390×844 viewport has no body overflow; bottom navigation works; horizontal stay chooser scrolls | ✅ Pass |
| 11 | JavaScript stability | Core map/filter/configuration interactions produce no uncaught JavaScript errors | ✅ Pass |
| 12 | Important images actually render | Jetour, Škoda, Dar Nabiha and El Jem representative images load with nonzero natural size | ✅ Pass |
| 13 | Map popup interaction | A day-filtered map renders multiple markers; clicking a marker opens a populated detail popup | ✅ Pass |
| 14 | External link safety | New-tab action/source links use HTTPS and `rel=noopener` | ✅ Pass |
| 15 | DOM/accessibility basics | No duplicate element IDs; site-owned rendered images have non-empty alt text; Leaflet map tiles are treated as decorative | ✅ Pass |

## Issues discovered during QA and corrected

- **Research/source links opened new tabs without `noopener`.** Added automatic external-link hardening.
- **Initial accessibility assertion incorrectly flagged Leaflet map tiles.** Leaflet deliberately renders raster map tiles with empty `alt` attributes because they are decorative; the QA rule now correctly tests the site-owned content images instead.
- **Repeated visual assets across unrelated stay/activity cards.** Replaced with exact property/listing previews or item-specific imagery.
- **Cars originally had no model-specific gallery.** Added one distinct vehicle image per car option with exact-model-page fallback.

## External dependencies / residual risks

These are not application defects, but should be rechecked before booking/travel:

- Airbnb/private-rental pages, inventory, listing photos and URLs can change or disappear.
- Airline fares, flight times and connection combinations are dynamic; site figures are planning benchmarks until checkout.
- Rental-car suppliers commonly sell a category as “or similar”; Jetour/Škoda exact-model availability must be confirmed in writing.
- The map depends on OpenStreetMap tiles and the public OSRM routing service. If road routing is temporarily unavailable, the application falls back to a simple route line.
- Some property cards use a live preview of the exact listing URL when a stable direct photo asset is unavailable. This is deliberate: an exact listing preview is preferable to showing a misleading photo of another property.

## Automated QA location

- Test file: `tunis-trip/qa.spec.js`
- Workflow: `.github/workflows/tunis-trip-qa.yml`
- The suite runs automatically when the trip-site files change.
