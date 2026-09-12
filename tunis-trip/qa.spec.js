const { test, expect } = require('@playwright/test');
const URL = 'http://127.0.0.1:4173/tunis-trip/';

async function ready(page){
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#tripMap')).toBeVisible();
  await expect(page.locator('#flightOptions .flight-card')).toHaveCount(20);
  await expect(page.locator('#carOptions .car-card')).toHaveCount(20);
  await expect(page.locator('#staySegments .stay-segment')).toHaveCount(3);
}

test('01 layout order is map, calendar, configuration', async ({page})=>{
  await ready(page);
  const order=await page.evaluate(()=>['map','calendar','configure'].map(id=>document.getElementById(id).getBoundingClientRect().top+scrollY));
  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);
  await expect(page.locator('.bottom-nav a')).toHaveCount(3);
});

test('02 map controls and day filters work', async ({page})=>{
  await ready(page);
  await expect(page.locator('#topDays .day-chip')).toHaveCount(9);
  const mapHeight=await page.locator('#tripMap').evaluate(el=>el.getBoundingClientRect().height);
  expect(mapHeight).toBeGreaterThan(350);
  const route=page.locator('#routesToggle'); const pins=page.locator('#pinsToggle');
  await expect(route).toHaveClass(/active/); await route.click(); await expect(route).not.toHaveClass(/active/); await route.click();
  await expect(pins).toHaveClass(/active/); await pins.click(); await expect(pins).not.toHaveClass(/active/); await pins.click();
  await page.locator('#topDays .day-chip[data-day="D5"]').click();
  await expect(page.locator('#topDays .day-chip[data-day="D5"]')).toHaveClass(/active/);
});

test('03 calendar has 8 days and expands/collapses', async ({page})=>{
  await ready(page);
  await expect(page.locator('#schedule .day-card')).toHaveCount(8);
  const d5=page.locator('[data-expand="D5"]'); const detail=page.locator('#detail-D5');
  const wasHidden=await detail.evaluate(el=>el.classList.contains('hidden'));
  await d5.click();
  expect(await detail.evaluate(el=>el.classList.contains('hidden'))).toBe(!wasHidden);
});

test('04 flight list has 20 ranked options and persists choice', async ({page})=>{
  await ready(page);
  const cards=page.locator('#flightOptions .flight-card'); await expect(cards).toHaveCount(20);
  await expect(cards.first()).toContainText('#1');
  await expect(cards.first().locator('.flight-metrics>div')).toHaveCount(3);
  const second=cards.nth(1); const name=(await second.locator('h4').textContent()).trim();
  await second.locator('.choose-flight').click(); await expect(page.locator('#flightSelected')).toContainText(name);
  await page.reload({waitUntil:'domcontentloaded'}); await expect(page.locator('#flightSelected')).toContainText(name);
});

test('05 car list has 20 options, Jetour first, Skoda second, unique images and persistence', async ({page})=>{
  await ready(page);
  const cards=page.locator('#carOptions .car-card'); await expect(cards).toHaveCount(20);
  await expect(cards.nth(0)).toContainText('Jetour T2');
  await expect(cards.nth(1)).toContainText('Škoda');
  await expect(cards.nth(0).locator('.car-metrics>div')).toHaveCount(3);
  await expect(cards.locator('.car-photo')).toHaveCount(20);
  const srcs=await cards.locator('.car-photo').evaluateAll(imgs=>imgs.map(i=>i.src));
  expect(new Set(srcs).size).toBe(20);
  const third=cards.nth(2); const name=(await third.locator('h4').textContent()).trim();
  await third.locator('.choose-car').click(); await expect(page.locator('#carSelected')).toContainText(name);
  await page.reload({waitUntil:'domcontentloaded'}); await expect(page.locator('#carSelected')).toContainText(name);
});

test('06 every stay block has 20 ranked choices and 3 visible ratings', async ({page})=>{
  await ready(page);
  const segments=page.locator('#staySegments .stay-segment'); await expect(segments).toHaveCount(3);
  for(let i=0;i<3;i++){
    const cards=segments.nth(i).locator('.stay-card'); await expect(cards).toHaveCount(20);
    await expect(cards.first().locator('.best-ribbon')).toBeVisible();
    await expect(cards.first().locator('.stay-metrics>div')).toHaveCount(3);
  }
  const staySrcs=await page.locator('#staySegments .stay-card .photo-rail img').evaluateAll(imgs=>imgs.map(i=>i.src));
  const unique=new Set(staySrcs);
  expect(unique.size/staySrcs.length).toBeGreaterThan(0.85);
});

test('07 choosing a stay updates calendar and survives reload', async ({page})=>{
  await ready(page);
  const firstSegment=page.locator('#staySegments .stay-segment').first();
  const option=firstSegment.locator('.stay-card').nth(1); const name=(await option.locator('h3').textContent()).trim();
  await option.locator('.choose-stay').click();
  await expect(page.locator('#schedule')).toContainText(name);
  await page.reload({waitUntil:'domcontentloaded'}); await expect(page.locator('#schedule')).toContainText(name);
});

test('08 activity tabs, add/remove, calendar update and reset work', async ({page})=>{
  await ready(page);
  await page.locator('.tab[data-tab="leisure"]').click();
  await expect(page.locator('#leisureList')).not.toHaveClass(/hidden/);
  await expect(page.locator('#historyList')).toHaveClass(/hidden/);
  const card=page.locator('#leisureList .choice-card').first();
  const name=(await card.locator('h3').textContent()).trim();
  const button=card.locator('.choice-toggle'); const before=(await button.textContent()).trim();
  await button.click();
  const after=(await page.locator('#leisureList .choice-card').filter({hasText:name}).locator('.choice-toggle').textContent()).trim();
  expect(after).not.toBe(before);
  await page.locator('#restoreBtn').click();
  await expect(page.locator('#flightSelected')).toContainText('Royal Jordanian evening via Amman');
  await expect(page.locator('#carSelected')).toContainText('Jetour T2');
});

test('09 activity imagery is item-specific rather than one reused city image', async ({page})=>{
  await ready(page);
  await page.locator('#recommendedBtn').click();
  const imgs=page.locator('#historyList .choice-card .photo-rail img, #leisureList .choice-card .photo-rail img');
  const srcs=await imgs.evaluateAll(xs=>xs.map(x=>x.src));
  expect(srcs.length).toBeGreaterThan(20);
  expect(new Set(srcs).size/srcs.length).toBeGreaterThan(0.75);
});

test('10 mobile view has no body overflow and primary navigation remains usable', async ({page})=>{
  await page.setViewportSize({width:390,height:844}); await ready(page);
  await expect(page.locator('.bottom-nav')).toBeVisible(); await expect(page.locator('.bottom-nav a')).toHaveCount(3);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await page.locator('.bottom-nav a').nth(2).click(); await expect(page.locator('#configure')).toBeInViewport();
  const stayRail=page.locator('.stay-rail').first(); expect(await stayRail.evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
});

test('11 no uncaught JavaScript errors during core interactions', async ({page})=>{
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await ready(page);
  await page.locator('#topDays .day-chip[data-day="D3"]').click();
  await page.locator('#routesToggle').click(); await page.locator('#routesToggle').click();
  await page.locator('.tab[data-tab="leisure"]').click();
  await page.locator('#recommendedBtn').click();
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});

test('12 verified top imagery renders successfully', async ({page})=>{
  await ready(page);
  const checks=[
    page.locator('#carOptions .car-card').nth(0).locator('.car-photo'),
    page.locator('#carOptions .car-card').nth(1).locator('.car-photo'),
    page.locator('#staySegments .stay-card').filter({hasText:'Dar Nabiha'}).first().locator('img').first(),
    page.locator('#historyList .choice-card').filter({hasText:'El Jem Amphitheatre'}).locator('img').first()
  ];
  for(const img of checks){
    await expect(img).toBeAttached();
    await img.scrollIntoViewIfNeeded();
    await expect.poll(async()=>img.evaluate(el=>el.complete&&el.naturalWidth>0),{timeout:15000}).toBeTruthy();
  }
});

test('13 map has markers and clicking a marker opens a useful popup', async ({page})=>{
  await ready(page);
  await page.locator('#topDays .day-chip[data-day="D3"]').click();
  await expect.poll(async()=>page.locator('#tripMap .emoji-marker').count(),{timeout:10000}).toBeGreaterThan(2);
  await page.locator('#tripMap .emoji-marker').first().click({force:true});
  await expect(page.locator('.leaflet-popup-content')).toBeVisible();
  const text=(await page.locator('.leaflet-popup-content').innerText()).trim();
  expect(text.length).toBeGreaterThan(10);
});

test('14 external action links are safe and valid', async ({page})=>{
  await ready(page);
  const links=page.locator('a[target="_blank"]');
  expect(await links.count()).toBeGreaterThan(20);
  const bad=await links.evaluateAll(as=>as.filter(a=>!/^https:\/\//i.test(a.href)||a.rel.split(/\s+/).indexOf('noopener')<0).map(a=>a.outerHTML));
  expect(bad).toEqual([]);
});

test('15 DOM IDs are unique and site-owned rendered images have alt text', async ({page})=>{
  await ready(page);
  await page.locator('#recommendedBtn').click();
  const duplicateIds=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return [...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))]});
  expect(duplicateIds).toEqual([]);
  // Leaflet's raster map tiles are decorative and intentionally use alt=""; test only site-owned content imagery.
  const missingAlt=await page.locator('img:not(.leaflet-tile)').evaluateAll(imgs=>imgs.filter(i=>!i.getAttribute('alt')?.trim()).map(i=>i.outerHTML));
  expect(missingAlt).toEqual([]);
});
