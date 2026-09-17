// Playwright QA for the Tunisia trip site. Runs against a static server on :4173 (see .github/workflows/tunis-trip-qa.yml).
// The map and listing photos depend on external hosts; those checks accept the offline placeholders when the host is unreachable.
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
  await page.locator('#tabbar [data-view=book]').click();
  await expect(page.locator('#book')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('02 plan opens on a real day; flight facts sit on days 1, 2 and 8', async ({ page }) => {
  await open(page);
  const on = page.locator('#dayStrip .chip[aria-selected=true]');
  await expect(on).toHaveCount(1);
  expect(await on.getAttribute('data-day')).not.toBe('trip');
  await page.locator('#dayStrip .chip[data-day=D2]').click();
  await expect(page.locator('#dayPanel h1')).toContainText('first day in Tunis');
  await expect(page.locator('#dayPanel .row.fixed').nth(0)).toContainText('05:45');
  await expect(page.locator('#dayPanel .row.fixed').nth(1)).toContainText('09:00');
  await expect(page.locator('#dayPanel .row.fixed').nth(1)).toContainText('Dar 24');
  expect(await page.locator('#dayPanel .row[data-row]').count()).toBeGreaterThanOrEqual(6);
  await expect(page.locator('#dayPanel .slotHead').first()).toHaveText(/Morning/);
  await page.locator('#dayStrip .chip[data-day=D1]').click();
  await expect(page.locator('#dayPanel .row.fixed').nth(1)).toContainText('01:45');
  await page.locator('#dayStrip .chip[data-day=D8]').click();
  await expect(page.locator('#dayPanel .row.fixed').nth(0)).toContainText('Leave');
  await expect(page.locator('#dayPanel .row.fixed').nth(0)).toContainText('07:10');
  await expect(page.locator('#dayPanel .row.fixed').nth(1)).toContainText('11:40');
  await expect(page.locator('#dayPanel .row[data-row]')).toHaveCount(0);
});

test('03 default plan is coherent: no duplicates in a day, places match the day base, Bardo once on Sunday', async ({ page }) => {
  await open(page);
  const problems = await page.evaluate(() => {
    const T = window.TRIP, A = window.TRIP_APP, S = A.S, out = [];
    for (const d of T.days) {
      const rows = S.plan[d.id] || [], ids = rows.map(r => r.p), areas = A.dayAreas(d.id);
      if (new Set(ids).size !== ids.length) out.push(`${d.id}: duplicates`);
      for (const r of rows) { const p = T.places.find(x => x.id === r.p); if (!p) out.push(`${d.id}: unknown ${r.p}`); else if (!areas.includes(p.area)) out.push(`${d.id}: ${p.id} is in ${p.area}`); }
    }
    if ((S.plan.D3 || []).filter(r => r.p === 'bardo').length !== 1) out.push('Bardo should appear exactly once on Sunday');
    if ((S.plan.D2 || []).length < 6) out.push('Saturday is too empty');
    if ((S.plan.D1 || []).length) out.push('Flight night should have no picks');
    if ((S.plan.D8 || []).length) out.push('Departure day should have no picks');
    if (!(S.plan.D4 || []).some(r => r.p === 'great-mosque')) out.push('Kairouan night should include the Great Mosque');
    return out;
  });
  expect(problems).toEqual([]);
});

test('04 trip overview lists eight days with their base and opens one', async ({ page }) => {
  await open(page);
  await page.locator('#dayStrip .chip[data-day=trip]').click();
  await expect(page.locator('#dayPanel .overview li')).toHaveCount(8);
  await expect(page.locator('#dayPanel .overview')).toContainText('Kairouan');
  await page.locator('#dayPanel .overview [data-day=D6]').click();
  await expect(page.locator('#dayPanel h1')).toContainText('Sousse → Hammamet');
  await expect(page.locator('#dayPanel .row.fixed').filter({ hasText: 'Drive' })).toHaveCount(1);
  await expect(page.locator('#dayStrip .chip[data-day=D6]')).toHaveAttribute('aria-selected', 'true');
});

test('05 explore: five category tabs, area filter, search, and safe external links', async ({ page }) => {
  await open(page, '#explore');
  await expect(page.locator('#explore')).toBeVisible();
  await expect(page.locator('#catTabs [role=tab]')).toHaveCount(5);
  await expect(page.locator('#catTabs [role=tab]').nth(3)).toContainText('Nightlife');
  expect(await page.locator('#placeGrid .card').count()).toBeGreaterThan(20);
  await page.locator('#catTabs [data-cat=sights]').click();
  await expect(page.locator('#catTabs [data-cat=sights]')).toHaveAttribute('aria-selected', 'true');
  await page.locator('#areaChips [data-area=kairouan]').click();
  expect(await page.locator('#placeGrid .card').count()).toBeGreaterThanOrEqual(5);
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

test('07 "Add from Explore" pre-filters to the day base and adds with one tap', async ({ page }) => {
  await open(page);
  await page.locator('#dayStrip .chip[data-day=D5]').click();
  await page.locator('#addFrom').click();
  await expect(page.locator('#explore')).toBeVisible();
  await expect(page.locator('#addingBanner')).toContainText('Tue 22');
  await expect(page.locator('#areaChips [data-area=sousse]')).toHaveAttribute('aria-selected', 'true');
  const card = page.locator('#placeGrid .card', { hasText: 'Port El Kantaoui marina restaurants' });
  await card.locator('[data-add]').click();
  await expect(card.locator('[data-add]')).toContainText('Added');
  expect((await state(page)).plan.D5.some(r => r.p === 'kantaoui-marina-lunch')).toBe(true);
  await page.locator('#doneAdding').click();
  await expect(page.locator('#plan')).toBeVisible();
  await expect(page.locator('#dayPanel [data-row="kantaoui-marina-lunch"]')).toBeVisible();
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

test('09 book: no flight controls; stays with photo rails can be changed; car; reservations follow the plan', async ({ page }) => {
  await open(page, '#book');
  await expect(page.locator('#book')).toBeVisible();
  await expect(page.locator('#book input[type=time]')).toHaveCount(0);
  await expect(page.locator('#staysSection .stayPanel')).toHaveCount(4);
  await expect(page.locator('#staysSection .stayPanel').nth(0)).toContainText('Tunis');
  await expect(page.locator('#staysSection .stayPanel').nth(0)).toContainText('2 nights');
  await expect(page.locator('#staysSection [data-block=sousse] .stayRail .stayCard')).toHaveCount(11);
  await expect(page.locator('#staysSection [data-block=tunis] .stayRail .stayCard')).toHaveCount(20);
  expect(await page.locator('#staysSection .photo img').count()).toBeGreaterThan(30);
  if (await page.evaluate(() => typeof window.L !== 'undefined')) {
    await expect.poll(() => page.locator('#staysSection [data-block=tunis] .hero .photo img').first().evaluate(i => i.naturalWidth), { timeout: 20000 }).toBeGreaterThan(0);
  }
  await page.locator('#staysSection [data-block=hammamet] [data-filter=both]').click();
  await expect(page.locator('#staysSection [data-block=hammamet] .stayRail .stayCard')).toHaveCount(9);
  await page.locator('#staysSection [data-block=hammamet] [data-filter=all]').click();
  await page.locator('#staysSection [data-block=tunis] [data-private]').click();
  const privCount = await page.locator('#staysSection [data-block=tunis] .stayRail .stayCard').count();
  expect(privCount).toBeGreaterThanOrEqual(10); expect(privCount).toBeLessThan(20);
  await page.locator('#staysSection [data-block=tunis] [data-private]').click();
  await page.locator('#staysSection [data-block=sousse] [data-opt="central-dar-baaziz"]').click();
  await expect(page.locator('#staysSection [data-block=sousse] h3')).toContainText('Dar Baaziz');
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#dayStrip .chip[data-day=D5]').click();
  await expect(page.locator('#dayPanel .stayLine')).toContainText('Dar Baaziz');
  await page.locator('#viewTabs [data-view=book]').click();
  await page.locator('#carSection [data-toggle=car]').click();
  await expect(page.locator('#carSection .optList li')).toHaveCount(20);
  await page.locator('#carSection [data-car="volvo-xc90"]').click();
  await expect(page.locator('#carSection h3')).toContainText('Volvo XC90');
  const checks = page.locator('#resSection .checks li');
  expect(await checks.count()).toBeGreaterThan(6);
  await expect(page.locator('#resSection')).toContainText('Dar Baaziz');
  await expect(page.locator('#resSection')).toContainText('Volvo XC90');
  await expect(page.locator('#resSection')).toContainText('Reserve');
  await checks.first().locator('input').check();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#resSection .checks li').first()).toHaveClass(/done/);
  await expect(page.locator('#carSection h3')).toContainText('Volvo XC90');
});

test('10 a group suggestion can be added to a stop and chosen', async ({ page }) => {
  await open(page, '#book');
  const form = page.locator('#staysSection form[data-suggest=hammamet]');
  await form.locator('[name=n]').fill('Villa from the family group');
  await form.locator('[name=u]').fill('https://example.com/villa');
  await form.locator('button[type=submit]').click();
  await expect(page.locator('#staysSection [data-block=hammamet] h3')).toContainText('Villa from the family group');
  await expect(page.locator('#staysSection [data-block=hammamet] .stayRail')).toContainText('Group suggestion');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#staysSection [data-block=hammamet] h3')).toContainText('Villa from the family group');
});

test('11 share link carries route, stays and plan to another device', async ({ page, context }) => {
  await open(page);
  await page.evaluate(() => { window.TRIP_APP.setRoute(['carthage', 'carthage', 'carthage', 'hammamet', 'hammamet', 'hammamet']); window.TRIP_APP.addToDay('dougga', 'D3'); window.TRIP_APP.S.stays.carthage = 'dar-mima'; window.TRIP_APP.render(); });
  const url = await page.evaluate(() => window.TRIP_APP.shareUrl());
  expect(url).toContain('#s=');
  const other = await context.newPage();
  await other.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(other.locator('#viewTabs [role=tab]')).toHaveCount(3);
  await expect(other.locator('#toast')).toContainText('loaded');
  const s = await state(other);
  expect(s.route).toEqual(['carthage', 'carthage', 'carthage', 'hammamet', 'hammamet', 'hammamet']);
  expect(s.plan.D3.some(r => r.p === 'dougga')).toBe(true);
  expect(s.stays.carthage).toBe('dar-mima');
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
  await page.locator('#viewTabs [data-view=book]').click();
  await expect(page.locator('#routeSection h2')).toHaveText('المسار');
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
    await expect.poll(() => page.locator('#map .pinIcon').count(), { timeout: 10000 }).toBeGreaterThan(4);
    await expect(page.locator('#map .pinIcon .icon svg')).not.toHaveCount(0);
    await expect(page.locator('#map .routeLine')).toHaveCount(1);
    await page.locator('#map .leaflet-marker-icon').nth(2).dispatchEvent('click');
    await expect(page.locator('.leaflet-popup-content')).toBeVisible();
    await expect(page.locator('.leaflet-popup-content')).toContainText('Sun 20');
    await expect(page.locator('.leaflet-popup-content')).toContainText('Directions');
    await page.locator('#mapTools [data-tool=route]').click();
    await expect(page.locator('#map .routeLine')).toHaveCount(0);
    await page.locator('#mapTools [data-tool=pins]').click();
    await expect(page.locator('#map .pinIcon')).toHaveCount(0);
    await page.locator('#mapTools [data-tool=pins]').click();
    expect(await page.locator('#map .pinIcon').count()).toBeGreaterThan(4);
  } else {
    await expect(page.locator('#map.off')).toContainText('Map unavailable');
    await expect(page.locator('#mapTools')).toBeHidden();
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
  await page.locator('[data-preset="1"]').click();
  await page.locator('#viewTabs [data-view=plan]').click();
  page.once('dialog', d => d.accept());
  await page.locator('#resetPlan').click();
  expect(errors).toEqual([]);
  const dup = await page.evaluate(() => { const i = [...document.querySelectorAll('[id]')].map(e => e.id); return [...new Set(i.filter((x, n) => i.indexOf(x) !== n))]; });
  expect(dup).toEqual([]);
  const unlabelled = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).map(b => b.outerHTML));
  expect(unlabelled).toEqual([]);
});

test('15 route editor: change one night, use a preset; stays, drives, titles and plans follow', async ({ page }) => {
  await open(page, '#book');
  await expect(page.locator('#routeSection .nightCell')).toHaveCount(6);
  await expect(page.locator('#routeSection .nightCell').nth(2)).toContainText('Kairouan');
  await page.locator('#routeSection .nightCell').nth(2).click();
  await expect(page.locator('#sheet [data-base]')).toHaveCount(5);
  await page.locator('#sheet [data-base=hammamet]').click();
  const s1 = await state(page);
  expect(s1.route).toEqual(['tunis', 'tunis', 'hammamet', 'sousse', 'hammamet', 'hammamet']);
  expect(s1.plan.D4.some(r => r.p === 'hammamet-medina')).toBe(true);
  expect(s1.plan.D4.some(r => r.p === 'great-mosque')).toBe(false);
  await expect(page.locator('#staysSection .stayPanel')).toHaveCount(4);
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#dayStrip .chip[data-day=D4]').click();
  await expect(page.locator('#dayPanel h1')).toContainText('Tunis → Hammamet');
  await expect(page.locator('#dayPanel .row.fixed').filter({ hasText: 'Drive' })).toContainText('Dar Sandra');
  await expect(page.locator('#dayPanel .stayLine')).toContainText('Dar Sandra');
  await page.locator('#viewTabs [data-view=book]').click();
  await page.locator('#routeSection [data-preset="1"]').click();
  await expect(page.locator('#routeSection [data-preset="1"]')).toHaveAttribute('aria-selected', 'true');
  const s2 = await state(page);
  expect(s2.route).toEqual(['carthage', 'carthage', 'carthage', 'hammamet', 'hammamet', 'hammamet']);
  expect(s2.plan.D2.some(r => r.p === 'sidi-bou-said')).toBe(true);
  expect(s2.plan.D4.some(r => r.p === 'medina-walk')).toBe(true);
  await expect(page.locator('#staysSection .stayPanel')).toHaveCount(2);
  await expect(page.locator('#staysSection .stayPanel').nth(0)).toContainText('3 nights');
  await expect(page.locator('#staysSection [data-block=carthage] .stayRail .stayCard')).toHaveCount(20);
  await page.reload({ waitUntil: 'domcontentloaded' });
  expect((await state(page)).route).toEqual(['carthage', 'carthage', 'carthage', 'hammamet', 'hammamet', 'hammamet']);
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#dayStrip .chip[data-day=D8]').click();
  await expect(page.locator('#dayPanel .row.fixed').nth(0)).toContainText('07:10');
  await page.locator('#dayStrip .chip[data-day=D2]').click();
  await expect(page.locator('#dayPanel h1')).toContainText('Carthage');
});

test('16 a place opens a detail sheet with what it relates to; history and photo arrive from Wikipedia when online', async ({ page }) => {
  await open(page, '#explore');
  await page.locator('#catTabs [data-cat=sights]').click();
  await page.locator('#placeGrid [data-open="great-mosque"]').click();
  await expect(page.locator('#sheet')).toBeVisible();
  await expect(page.locator('#sheet h2')).toContainText('Great Mosque of Kairouan');
  await expect(page.locator('#sheet .rel')).toContainText('Uqba ibn Nafi');
  await expect(page.locator('#sheet .hist b')).toContainText('history');
  await expect(page.locator('#sheet [data-day]')).toHaveCount(7);
  const online = await page.evaluate(() => typeof window.L !== 'undefined');
  if (online) {
    await expect(page.locator('#sheet .hist p')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#sheet .hist p')).toContainText(/Kairouan|mosque/i);
    await expect(page.locator('#sheet .photo img')).toHaveAttribute('src', /wikimedia\.org/, { timeout: 15000 });
  } else {
    await expect(page.locator('#sheet .hist p')).toBeHidden();
  }
  await page.keyboard.press('Escape');
  await page.locator('#viewTabs [data-view=plan]').click();
  await page.locator('#dayStrip .chip[data-day=D4]').click();
  await page.locator('#dayPanel [data-row="great-mosque"]').click();
  await expect(page.locator('#sheet .rel')).toContainText('Aghlabid');
});
