// Playwright QA for the Tunisia trip site. Runs against a static server on :4173 (see .github/workflows/tunis-trip-qa.yml).
// The map depends on a CDN; tests accept either a working Leaflet map or the labelled offline placeholder.
const { test, expect } = require('@playwright/test');
const URL = 'http://127.0.0.1:4173/tunis-trip/';

async function open(page, hash = '') { await page.goto(URL + hash, { waitUntil: 'domcontentloaded' }); await expect(page.locator('#viewTabs [role=tab]')).toHaveCount(3); await page.waitForFunction(() => !!window.TRIP_APP); }
const state = page => page.evaluate(() => JSON.parse(JSON.stringify(window.TRIP_APP.S)));

test('01 shell: three views, one visible, no horizontal overflow on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await expect(page.locator('#viewTabs [role=tab]')).toHaveCount(3);
  await expect(page.locator('#tabbar [role=tab]')).toHaveCount(3);
  await expect(page.locator('#tabbar')).toBeVisible();
  await expect(page.locator('#plan')).toBeVisible();
  await expect(page.locator('#explore')).toBeHidden();
  await expect(page.locator('#book')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.locator('#tabbar [data-view=explore]').click();
  await expect(page.locator('#explore')).toBeVisible();
  await expect(page.locator('#plan')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('02 plan opens on a real day with a stay line, day header and timeline', async ({ page }) => {
  await open(page);
  const on = page.locator('#dayStrip .chip[aria-selected=true]');
  await expect(on).toHaveCount(1);
  expect(await on.getAttribute('data-day')).not.toBe('trip');
  await expect(page.locator('#dayPanel .dayHead h1')).not.toBeEmpty();
  await expect(page.locator('#dayPanel .stayLine')).toBeVisible();
  await page.locator('#dayStrip .chip[data-day=D2]').click();
  await expect(page.locator('#dayPanel h1')).toContainText('first day in Tunis');
  await expect(page.locator('#dayPanel .row.fixed')).toContainText('02:15');
  expect(await page.locator('#dayPanel .row[data-row]').count()).toBeGreaterThanOrEqual(6);
  await expect(page.locator('#dayPanel .slotHead').first()).toHaveText(/Morning/);
});

test('03 default plan is coherent: no duplicate places in a day, Bardo once on Sunday, places match the day area', async ({ page }) => {
  await open(page);
  const problems = await page.evaluate(() => {
    const T = window.TRIP, S = window.TRIP_APP.S, out = [];
    for (const d of T.days) {
      const rows = S.plan[d.id] || [], ids = rows.map(r => r.p);
      if (new Set(ids).size !== ids.length) out.push(`${d.id}: duplicates`);
      for (const r of rows) { const p = T.places.find(x => x.id === r.p); if (!p) out.push(`${d.id}: unknown ${r.p}`); else if (!d.areas.includes(p.area)) out.push(`${d.id}: ${p.id} is in ${p.area}`); }
    }
    if ((S.plan.D3 || []).filter(r => r.p === 'bardo').length !== 1) out.push('Bardo should appear exactly once on Sunday');
    if ((S.plan.D2 || []).length < 6) out.push('Saturday is too empty');
    if ((S.plan.D1 || []).length) out.push('Flight night should have no picks');
    return out;
  });
  expect(problems).toEqual([]);
});

test('04 trip overview lists eight days and opens one', async ({ page }) => {
  await open(page);
  await page.locator('#dayStrip .chip[data-day=trip]').click();
  await expect(page.locator('#dayPanel .overview li')).toHaveCount(8);
  await page.locator('#dayPanel .overview [data-day=D6]').click();
  await expect(page.locator('#dayPanel h1')).toContainText('El Jem');
  await expect(page.locator('#dayStrip .chip[data-day=D6]')).toHaveAttribute('aria-selected', 'true');
});

test('05 explore: five category tabs, area filter, search, and safe external links', async ({ page }) => {
  await open(page, '#explore');
  await expect(page.locator('#explore')).toBeVisible();
  await expect(page.locator('#catTabs [role=tab]')).toHaveCount(5);
  await expect(page.locator('#catTabs [role=tab]').nth(3)).toContainText('Nightlife');
  const before = await page.locator('#placeGrid .card').count();
  expect(before).toBeGreaterThan(20);
  await page.locator('#catTabs [data-cat=sights]').click();
  await expect(page.locator('#catTabs [data-cat=sights]')).toHaveAttribute('aria-selected', 'true');
  await page.locator('#areaChips [data-area=kairouan]').click();
  const kairouan = await page.locator('#placeGrid .card').count();
  expect(kairouan).toBeGreaterThanOrEqual(5);
  await expect(page.locator('#placeGrid .card').first()).toContainText('Kairouan');
  await page.locator('#areaChips [data-area=all]').click();
  await page.locator('#search').fill('bardo');
  expect(await page.locator('#placeGrid .card').count()).toBeLessThanOrEqual(3);
  await expect(page.locator('#placeGrid .card h3').first()).toContainText('Bardo');
  await page.locator('#search').fill('zzzz');
  await expect(page.locator('#placeGrid .noResults')).toBeVisible();
  await page.locator('#search').fill('');
  const links = page.locator('a[target=_blank]');
  expect(await links.count()).toBeGreaterThan(20);
  expect(await links.evaluateAll(a => a.filter(x => !/^https:\/\//i.test(x.href) || !x.rel.split(/\s+/).includes('noopener')).map(x => x.outerHTML))).toEqual([]);
});

test('06 add a place to a day from Explore, see it in Plan, survive reload, then remove it', async ({ page }) => {
  await open(page, '#explore');
  await page.locator('#catTabs [data-cat=nightlife]').click();
  const card = page.locator('#placeGrid .card', { hasText: 'Villa Didon' });
  await card.locator('[data-add]').click();
  await expect(page.locator('#sheet')).toBeVisible();
  await expect(page.locator('#sheet [data-day]')).toHaveCount(7);
  await page.locator('#sheet [data-day=D3]').click();
  await expect(page.locator('#sheet')).toBeHidden();
  await expect(card.locator('[data-add]')).toContainText('Added');
  await expect(page.locator('#toast')).toContainText('Sun 20');
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#dayStrip .chip[data-day=D3]').click();
  await expect(page.locator('#dayPanel [data-row="villa-didon"]')).toBeVisible();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#dayStrip .chip[data-day=D3]').click();
  await expect(page.locator('#dayPanel [data-row="villa-didon"]')).toBeVisible();
  await page.locator('#dayPanel [data-row="villa-didon"]').click();
  await page.locator('#sheet [data-remove]').click();
  await expect(page.locator('#dayPanel [data-row="villa-didon"]')).toHaveCount(0);
  expect((await state(page)).plan.D3.some(r => r.p === 'villa-didon')).toBe(false);
});

test('07 "Add from Explore" pre-filters to the day area and adds with one tap', async ({ page }) => {
  await open(page);
  await page.locator('#dayStrip .chip[data-day=D5]').click();
  await page.locator('#addFrom').click();
  await expect(page.locator('#explore')).toBeVisible();
  await expect(page.locator('#addingBanner')).toContainText('Tue 22');
  await expect(page.locator('#areaChips [data-area=sousse]')).toHaveAttribute('aria-selected', 'true');
  const card = page.locator('#placeGrid .card', { hasText: 'Dar Antonia' });
  await card.locator('[data-add]').click();
  await expect(card.locator('[data-add]')).toContainText('Added');
  expect((await state(page)).plan.D5.some(r => r.p === 'dar-antonia-dinner')).toBe(true);
  await page.locator('#doneAdding').click();
  await expect(page.locator('#plan')).toBeVisible();
  await expect(page.locator('#dayPanel [data-row="dar-antonia-dinner"]')).toBeVisible();
});

test('08 a plan row can change its time of day and move to another day', async ({ page }) => {
  await open(page);
  await page.locator('#dayStrip .chip[data-day=D2]').click();
  await page.locator('#dayPanel [data-row="medina-walk"]').click();
  await page.locator('#sheet [data-slot=evening]').click();
  await page.keyboard.press('Escape');
  expect((await state(page)).plan.D2.find(r => r.p === 'medina-walk').s).toBe('evening');
  const heads = await page.locator('#dayPanel .timeline > li').evaluateAll(l => l.map(x => x.classList.contains('slotHead') ? 'H:' + x.textContent.trim() : (x.querySelector('[data-row]')?.dataset.row || 'fixed')));
  expect(heads.indexOf('medina-walk')).toBeGreaterThan(heads.indexOf('H:Evening'));
  await page.locator('#dayPanel [data-row="medina-walk"]').click();
  await page.locator('#sheet [data-move]').click();
  await page.locator('#sheet [data-day=D3]').click();
  const s = await state(page);
  expect(s.plan.D2.some(r => r.p === 'medina-walk')).toBe(false);
  expect(s.plan.D3.some(r => r.p === 'medina-walk' && r.s === 'evening')).toBe(true);
});

test('09 book: flights are booked, return time drives day 8, stays and car can be changed, reservations follow the plan', async ({ page }) => {
  await open(page, '#book');
  await expect(page.locator('#book')).toBeVisible();
  await expect(page.locator('#book .status')).toContainText('Booked');
  await page.locator('[data-f="back.dep"]').fill('15:30');
  await expect(page.locator('[data-f="back.leave"]')).toHaveAttribute('placeholder', '11:15');
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#dayStrip .chip[data-day=D8]').click();
  await expect(page.locator('#dayPanel .row.fixed').nth(0)).toContainText('11:15');
  await expect(page.locator('#dayPanel .row.fixed').nth(1)).toContainText('15:30');
  await page.locator('#viewTabs [data-view=book]').click();
  await expect(page.locator('#staysSection .panel')).toHaveCount(3);
  await page.locator('#staysSection [data-toggle=central]').click();
  await expect(page.locator('#staysSection [data-block=central] .optList li')).toHaveCount(20);
  await page.locator('#staysSection [data-block=central] [data-opt="central-dar-koraich"]').click();
  await expect(page.locator('#staysSection [data-block=central] h3')).toContainText('Dar Koraich');
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#dayStrip .chip[data-day=D4]').click();
  await expect(page.locator('#dayPanel .stayLine')).toContainText('Dar Koraich');
  await page.locator('#viewTabs [data-view=book]').click();
  await page.locator('#carSection [data-toggle=car]').click();
  await expect(page.locator('#carSection .optList li')).toHaveCount(20);
  await page.locator('#carSection [data-car="volvo-xc90"]').click();
  await expect(page.locator('#carSection h3')).toContainText('Volvo XC90');
  const checks = page.locator('#resSection .checks li');
  expect(await checks.count()).toBeGreaterThan(6);
  await expect(page.locator('#resSection')).toContainText('Dar Koraich');
  await expect(page.locator('#resSection')).toContainText('Volvo XC90');
  await expect(page.locator('#resSection')).toContainText('Reserve');
  await checks.first().locator('input').check();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#resSection .checks li').first()).toHaveClass(/done/);
  await expect(page.locator('#carSection h3')).toContainText('Volvo XC90');
});

test('10 a group suggestion can be added to a stay block and chosen', async ({ page }) => {
  await open(page, '#book');
  await page.locator('#staysSection [data-toggle=hammamet]').click();
  const form = page.locator('#staysSection form[data-suggest=hammamet]');
  await form.locator('[name=n]').fill('Villa from the family group');
  await form.locator('[name=u]').fill('https://example.com/villa');
  await form.locator('button[type=submit]').click();
  await expect(page.locator('#staysSection [data-block=hammamet] h3')).toContainText('Villa from the family group');
  await expect(page.locator('#staysSection [data-block=hammamet] .optList')).toContainText('Group suggestion');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#staysSection [data-block=hammamet] h3')).toContainText('Villa from the family group');
});

test('11 share link carries the plan to another device', async ({ page, context }) => {
  await open(page);
  await page.evaluate(() => { window.TRIP_APP.addToDay('dougga', 'D3'); window.TRIP_APP.S.stays.tunis = 'dar-nabiha'; window.TRIP_APP.render(); });
  const url = await page.evaluate(() => window.TRIP_APP.shareUrl());
  expect(url).toContain('#s=');
  const other = await context.newPage();
  await other.evaluate(() => localStorage.clear()).catch(() => {});
  await other.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(other.locator('#viewTabs [role=tab]')).toHaveCount(3);
  await expect(other.locator('#toast')).toContainText('loaded');
  const s = await state(other);
  expect(s.plan.D3.some(r => r.p === 'dougga')).toBe(true);
  expect(s.stays.tunis).toBe('dar-nabiha');
  expect(other.url()).not.toContain('#s=');
});

test('12 Arabic: RTL, translated UI and catalogue, persists across reload', async ({ page }) => {
  await open(page);
  await page.locator('#langBtn').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#viewTabs [data-view=plan]')).toHaveText('الخطة');
  await page.locator('#dayStrip .chip[data-day=D2]').click();
  await expect(page.locator('#dayPanel h1')).toContainText('تونس');
  await expect(page.locator('#dayPanel [data-row="zitouna"] b')).toContainText('جامع الزيتونة');
  await page.locator('#viewTabs [data-view=explore]').click();
  await expect(page.locator('#catTabs [data-cat=food]')).toContainText('طعام');
  await expect(page.locator('#placeGrid .card').first().locator('p')).not.toBeEmpty();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await page.locator('#langBtn').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('13 map: markers for the day when Leaflet loads, a labelled placeholder when it does not', async ({ page }) => {
  await open(page);
  await page.locator('#dayStrip .chip[data-day=D3]').click();
  const hasLeaflet = await page.evaluate(() => typeof window.L !== 'undefined');
  if (hasLeaflet) {
    await expect.poll(() => page.locator('#map path.pin').count(), { timeout: 10000 }).toBeGreaterThan(4);
    await page.locator('#map path.pin').first().dispatchEvent('click');
    await expect(page.locator('.leaflet-popup-content')).toBeVisible();
    await expect(page.locator('.leaflet-popup-content')).toContainText('Directions');
  } else {
    await expect(page.locator('#map.off')).toContainText('Map unavailable');
  }
});

test('14 no uncaught errors during a full walkthrough; ids unique; controls labelled', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await open(page);
  for (const d of ['trip', 'D1', 'D4', 'D8']) await page.locator(`#dayStrip .chip[data-day=${d}]`).click();
  await page.locator('#viewTabs [data-view=explore]').click();
  for (const c of ['sights', 'shopping', 'nightlife', 'relax', 'food']) await page.locator(`#catTabs [data-cat=${c}]`).click();
  await page.locator('#viewTabs [data-view=book]').click();
  await page.locator('#copyBtn').click();
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#resetPlan').click().catch(() => {});
  expect(errors).toEqual([]);
  const dup = await page.evaluate(() => { const i = [...document.querySelectorAll('[id]')].map(e => e.id); return [...new Set(i.filter((x, n) => i.indexOf(x) !== n))]; });
  expect(dup).toEqual([]);
  const unlabelled = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).map(b => b.outerHTML));
  expect(unlabelled).toEqual([]);
});
