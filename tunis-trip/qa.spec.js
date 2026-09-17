const { test, expect } = require('@playwright/test');
const URL = 'http://127.0.0.1:4173/tunis-trip/';

async function ready(page){
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#tripMap')).toBeVisible();
  await expect(page.locator('#flightOptions .flight-card')).toHaveCount(20);
  await expect(page.locator('#carOptions .car-card')).toHaveCount(20);
  await expect(page.locator('#staySegments .stay-segment')).toHaveCount(4);
  await expect(page.locator('#urgentBooking')).not.toBeEmpty();
}

test('01 layout order is map, calendar, booking, configuration', async ({page})=>{
  await ready(page);
  const order=await page.evaluate(()=>['map','calendar','book-now','configure'].map(id=>document.getElementById(id).getBoundingClientRect().top+scrollY));
  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);
  expect(order[2]).toBeLessThan(order[3]);
  await expect(page.locator('.bottom-nav a')).toHaveCount(4);
});

test('02 map controls and all eight day filters work', async ({page})=>{
  await ready(page);
  await expect(page.locator('#topDays .day-chip')).toHaveCount(9);
  const mapHeight=await page.locator('#tripMap').evaluate(el=>el.getBoundingClientRect().height);
  expect(mapHeight).toBeGreaterThan(350);
  const route=page.locator('#routesToggle'),pins=page.locator('#pinsToggle');
  await route.click(); await expect(route).not.toHaveClass(/active/); await route.click(); await expect(route).toHaveClass(/active/);
  await pins.click(); await expect(pins).not.toHaveClass(/active/); await pins.click(); await expect(pins).toHaveClass(/active/);
  await page.locator('#topDays .day-chip[data-day="D3"]').click();
  await expect(page.locator('#topDays .day-chip[data-day="D3"]')).toHaveClass(/active/);
});

test('03 calendar has eight days and new overnight flow', async ({page})=>{
  await ready(page);
  await expect(page.locator('#schedule .day-card')).toHaveCount(8);
  await expect(page.locator('#schedule')).toContainText('Sousse / Kairouan');
  await expect(page.locator('#schedule')).toContainText('Hammamet');
  const detail=page.locator('#detail-D4'),summary=page.locator('[data-expand="D4"]');
  const hidden=await detail.evaluate(el=>el.classList.contains('hidden'));
  await summary.click();
  expect(await detail.evaluate(el=>el.classList.contains('hidden'))).toBe(!hidden);
});

test('04 urgent booking dashboard stores dates and checklist state', async ({page})=>{
  await ready(page);
  await expect(page.locator('#datePreset option')).toHaveCount(2);
  await page.locator('#datePreset').selectOption('original');
  expect(await page.evaluate(()=>localStorage.getItem('tn-date-preset-v1'))).toBe('original');
  const first=page.locator('.booking-checklist input').first();
  await first.check();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('tn-booking-checklist-v1')||'{}'));
  expect(stored['0']).toBeTruthy();
  await expect(page.locator('#briefPreview')).toContainText('TUNISIA BOOKING BRIEF');
});

test('05 flights have twenty options, 16:05 Turkey pattern first, metrics and persistence', async ({page})=>{
  await ready(page);
  const cards=page.locator('#flightOptions .flight-card');
  await expect(cards).toHaveCount(20);
  await expect(cards.first()).toContainText('Flynas');
  await expect(cards.first()).toContainText('16:05');
  await expect(cards.first().locator('.flight-metrics>div')).toHaveCount(3);
  const second=cards.nth(1),name=(await second.locator('h4').textContent()).trim();
  await second.locator('.choose-flight').click();
  await expect(page.locator('#flightSelected')).toContainText(name);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#flightSelected')).toContainText(name);
});

test('06 luxury SUVs show twenty choices, BMW X5 then Range Rover, unique images and persistence', async ({page})=>{
  await ready(page);
  const cards=page.locator('#carOptions .car-card');
  await expect(cards).toHaveCount(20);
  await expect(cards.nth(0)).toContainText('BMW X5');
  await expect(cards.nth(1)).toContainText('Range Rover');
  await expect(cards.nth(0).locator('.car-metrics>div')).toHaveCount(3);
  await expect(cards.locator('.car-photo')).toHaveCount(20);
  const srcs=await cards.locator('.car-photo').evaluateAll(imgs=>imgs.map(i=>i.src));
  expect(new Set(srcs).size).toBe(20);
  const third=cards.nth(2),name=(await third.locator('h4').textContent()).trim();
  await third.locator('.choose-car').click();
  await expect(page.locator('#carSelected')).toContainText(name);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#carSelected')).toContainText(name);
});

test('07 four stay blocks each expose at least twenty ranked choices and three ratings', async ({page})=>{
  await ready(page);
  const segments=page.locator('#staySegments .stay-segment');
  await expect(segments).toHaveCount(4);
  for(let i=0;i<4;i++){
    const cards=segments.nth(i).locator('.stay-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(20);
    await expect(cards.first().locator('.best-ribbon')).toBeVisible();
    await expect(cards.first().locator('.stay-metrics>div')).toHaveCount(3);
  }
  await expect(segments.nth(1)).toContainText('Sousse / Kairouan');
});

test('08 choosing a central stay updates calendar and survives reload', async ({page})=>{
  await ready(page);
  const central=page.locator('#staySegments .stay-segment').nth(1),option=central.locator('.stay-card').nth(1);
  const name=(await option.locator('h3').textContent()).trim();
  await option.locator('.choose-stay').click();
  await expect(page.locator('#schedule')).toContainText(name);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#schedule')).toContainText(name);
});

test('09 activities provide exactly 28 timeslots and three choices per slot', async ({page})=>{
  await ready(page);
  const groups=page.locator('.slot-group'),cards=page.locator('.slot-group .choice-card');
  await expect(groups).toHaveCount(28);
  await expect(cards).toHaveCount(84);
  for(let i=0;i<28;i++)await expect(groups.nth(i).locator('.choice-card')).toHaveCount(3);
  const srcs=await cards.locator('.photo-rail img').evaluateAll(xs=>xs.map(x=>x.src));
  expect(new Set(srcs).size/srcs.length).toBeGreaterThan(0.95);
});

test('10 selecting another option replaces the same timeslot choice and updates calendar', async ({page})=>{
  await ready(page);
  await page.locator('.tab[data-tab="leisure"]').click();
  const group=page.locator('#leisureList .slot-group').first(),cards=group.locator('.choice-card');
  const secondName=(await cards.nth(1).locator('h3').textContent()).trim();
  await cards.nth(1).locator('.choice-toggle').click();
  await expect(cards.nth(1)).toHaveClass(/selected-choice/);
  await expect(cards.nth(0)).not.toHaveClass(/selected-choice/);
  await expect(page.locator('#schedule')).toContainText(secondName);
  const selected=await group.locator('.selected-choice').count();
  expect(selected).toBe(1);
});

test('11 a timeslot can be skipped and reset restores recommended flight, car and activities', async ({page})=>{
  await ready(page);
  const group=page.locator('#historyList .slot-group').first();
  await group.locator('.skip-slot').click();
  await expect(group.locator('.selected-choice')).toHaveCount(0);
  await page.locator('#restoreBtn').click();
  await expect(page.locator('#flightSelected')).toContainText('Flynas');
  await expect(page.locator('#carSelected')).toContainText('BMW X5');
  await expect(page.locator('#historyList .slot-group').first().locator('.selected-choice')).toHaveCount(1);
});

test('12 WhatsApp stay importer adds, persists and removes a group suggestion', async ({page})=>{
  await ready(page);
  await page.locator('#waSegment').selectOption('centralBase');
  await page.locator('#waInput').fill('Group villa suggestion https://example.com/group-villa');
  await page.locator('#waImport').click();
  await expect(page.locator('.wa-suggestion')).toContainText('Group villa suggestion');
  await expect(page.locator('#staySegments .stay-segment').nth(1)).toContainText('WHATSAPP GROUP');
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('tn-wa-suggestions-v1')||'[]'));
  expect(stored.length).toBe(1);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('.wa-suggestion')).toContainText('Group villa suggestion');
  await page.locator('[data-remove-wa]').click();
  await expect(page.locator('.wa-suggestion')).toHaveCount(0);
});

test('13 map has markers and a useful popup for selected routes', async ({page})=>{
  await ready(page);
  await page.locator('#topDays .day-chip[data-day="D3"]').click();
  await expect.poll(async()=>page.locator('#tripMap .emoji-marker').count(),{timeout:10000}).toBeGreaterThan(3);
  await page.locator('#tripMap .emoji-marker').first().click({force:true});
  await expect(page.locator('.leaflet-popup-content')).toBeVisible();
  expect((await page.locator('.leaflet-popup-content').innerText()).trim().length).toBeGreaterThan(10);
});

test('14 mobile view has no horizontal overflow and four primary navigation items', async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await ready(page);
  await expect(page.locator('.bottom-nav')).toBeVisible();
  await expect(page.locator('.bottom-nav a')).toHaveCount(4);
  await expect(page.locator('.mobile-lang-bar [data-language-toggle]')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await page.locator('.bottom-nav a').nth(2).click();
  await expect(page.locator('#book-now')).toBeInViewport();
  expect(await page.locator('.stay-rail').first().evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
});

test('15 core interactions produce no uncaught JavaScript errors', async ({page})=>{
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await ready(page);
  await page.locator('#topDays .day-chip[data-day="D5"]').click();
  await page.locator('#routesToggle').click(); await page.locator('#routesToggle').click();
  await page.locator('.tab[data-tab="leisure"]').click();
  await page.locator('#recommendedBtn').click(); await page.locator('#recommendedBtn').click();
  await page.waitForTimeout(800);
  expect(errors).toEqual([]);
});

test('16 external actions are HTTPS/noopener, IDs are unique and content images have alt text', async ({page})=>{
  await ready(page);
  const links=page.locator('a[target="_blank"]');
  expect(await links.count()).toBeGreaterThan(30);
  const bad=await links.evaluateAll(as=>as.filter(a=>!/^https:\/\//i.test(a.href)||!a.rel.split(/\s+/).includes('noopener')).map(a=>a.outerHTML));
  expect(bad).toEqual([]);
  const duplicateIds=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return [...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))]});
  expect(duplicateIds).toEqual([]);
  const missingAlt=await page.locator('img:not(.leaflet-tile)').evaluateAll(imgs=>imgs.filter(i=>!i.getAttribute('alt')?.trim()).map(i=>i.outerHTML));
  expect(missingAlt).toEqual([]);
});

test('17 Arabic switcher applies RTL to the urgent interface and persists', async ({page})=>{
  await ready(page);
  const toggle=page.locator('.topbar [data-language-toggle]');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('lang','ar');
  await expect(page.locator('html')).toHaveAttribute('dir','rtl');
  await expect(page.locator('h1')).toContainText('تونس أولًا');
  await expect(page.locator('#book-now h2')).toContainText('حجوزات');
  await expect(page.locator('#configure-cars h3')).toContainText('السيارة');
  await expect(toggle).toHaveText('EN');
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('html')).toHaveAttribute('lang','ar');
  await expect(page.locator('.topbar [data-language-toggle]')).toHaveText('EN');
  await page.locator('.topbar [data-language-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('html')).toHaveAttribute('dir','ltr');
  await expect(page.locator('h1')).toContainText('Tunis first');
});
