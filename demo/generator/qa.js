// QA the shareable demo: no external requests, no JS errors, the period control
// works with scripts on and off, both languages, every width down to a phone.
const {chromium} = require('playwright');
const path = require('path');
const F = process.env.QA_FILE ||
  'file://' + path.join(__dirname, '..', 'Retail_Sales_Dashboard_v1.html');
const S = process.env.QA_SHOTS || path.join(require('os').tmpdir(), 'demo-shots');

const PROBE = () => {
  const vis = e => e.getClientRects().length > 0;
  const q = s => [...document.querySelectorAll(s)].filter(vis);
  const bar = q('.summary-bar')[0];
  const r = e => e.getBoundingClientRect();
  let two = null, blade = null;
  if (bar) {
    const [a, div, b] = [...bar.children];
    const overlapY = (x, y) => Math.min(r(x).bottom, r(y).bottom) - Math.max(r(x).top, r(y).top) > 10;
    two = overlapY(a, b) && r(a).right <= r(div).left + 1 && r(div).right <= r(b).left + 1;
    const bl = div.querySelector('.summary-blade');
    blade = r(bl).left > r(a).right - 2 && r(bl).right < r(b).left + 2;
  }
  const txt = e => (e ? e.textContent.replace(/\s+/g, ' ').trim() : null);
  return {
    kickers: q('.kick').map(txt),
    headline: txt(q('.summary-value')[0]),
    ecom: txt(q('.summary-value')[1]),
    donuts: q('.dchart').length,
    donutCentre: txt(q('.dcentre')[0]),
    legendRows: q('.dleg li').length,
    barRows: q('.bars .bar-row').length,
    barNames: q('.bars .bar-name').slice(0, 3).map(txt),
    details: q('details').length,
    dollar: (document.body.innerText.match(/\$/g) || []).length,
    dir: document.documentElement.dir,
    hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    height: document.documentElement.scrollHeight,
    twoUp: two, bladeBetween: blade,
    imgs: [...document.images].map(i => i.src.slice(0, 40)),
    title: document.title,
  };
};

(async () => {
  const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH});
  const errs = [], ext = [];
  const ctx = await b.newContext({viewport: {width: 1440, height: 1000}});
  const p = await ctx.newPage();
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) ext.push(r.url()); });
  await p.goto(F); await p.waitForTimeout(900);

  console.log('title      :', await p.title());
  console.log('jsErrors   :', errs);
  console.log('external   :', ext.length ? ext : 'none');
  let r = await p.evaluate(PROBE);
  console.log('EN month   :', JSON.stringify({kick: r.kickers, headline: r.headline, ecom: r.ecom,
    donuts: r.donuts, centre: r.donutCentre, legend: r.legendRows, bars: r.barRows,
    names: r.barNames, details: r.details, imgs: r.imgs, hScroll: r.hScroll, h: r.height}));
  await p.screenshot({path: `${S}-en-top.png`, clip: {x: 0, y: 0, width: 1440, height: 1000}});
  await p.screenshot({path: `${S}-en-full.png`, fullPage: true});

  // period switch, scripts on
  for (const [id, name] of [['pv-q', 'quarter'], ['pv-t', 'ytd'], ['pv-m', 'month']]) {
    await p.evaluate(i => { document.getElementById(i).click(); }, id);
    await p.waitForTimeout(250);
    const x = await p.evaluate(PROBE);
    console.log(`view ${name.padEnd(8)}:`, x.kickers.join(' | '), '::', x.headline, '/', x.ecom, '| title:', x.title);
  }
  // month dropdown
  await p.evaluate(() => document.querySelector('label[for="m-mar"]').click());
  await p.waitForTimeout(250);
  console.log('pick March :', (await p.evaluate(PROBE)).kickers.join(' | '));
  await p.evaluate(() => document.querySelector('label[for="m-jul"]').click());

  // Arabic
  await p.evaluate(() => document.getElementById('lang').click());
  await p.waitForTimeout(400);
  r = await p.evaluate(PROBE);
  console.log('AR month   :', JSON.stringify({dir: r.dir, kick: r.kickers, headline: r.headline,
    centre: r.donutCentre, names: r.barNames, hScroll: r.hScroll}));
  await p.screenshot({path: `${S}-ar-top.png`, clip: {x: 0, y: 0, width: 1440, height: 1000}});
  const leak = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.en').forEach(e => { if (e.getClientRects().length) bad.push(e.textContent.slice(0, 40)); });
    return bad.slice(0, 5);
  });
  console.log('EN visible in AR mode:', leak.length ? leak : 'none');
  await ctx.close();

  // scripts blocked
  const c2 = await b.newContext({viewport: {width: 1440, height: 1000}, javaScriptEnabled: false});
  const p2 = await c2.newPage();
  await p2.goto(F); await p2.waitForTimeout(700);
  console.log('\n--- scripts blocked ---');
  console.log('month      :', (await p2.evaluate(PROBE)).kickers.join(' | '));
  await p2.click('label[for="pv-q"]'); await p2.waitForTimeout(200);
  console.log('quarter    :', (await p2.evaluate(PROBE)).kickers.join(' | '));
  await p2.click('.seg-qt summary'); await p2.waitForTimeout(150);
  await p2.click('label[for="q-q1"]'); await p2.waitForTimeout(200);
  console.log('pick Q1    :', (await p2.evaluate(PROBE)).kickers.join(' | '));
  await p2.click('label[for="pv-t"]'); await p2.waitForTimeout(200);
  console.log('ytd        :', (await p2.evaluate(PROBE)).kickers.join(' | '));
  await p2.click('label[for="lang"]'); await p2.waitForTimeout(300);
  const r2 = await p2.evaluate(PROBE);
  console.log('AR (no js) : dir=', r2.dir, '|', r2.kickers.join(' | '));
  await p2.screenshot({path: `${S}-nojs-ar.png`, clip: {x: 0, y: 0, width: 1440, height: 1000}});
  await c2.close();

  console.log('\n--- widths ---');
  for (const w of [1440, 1280, 1100, 950, 820, 700, 641, 640, 500, 390]) {
    const c = await b.newContext({viewport: {width: w, height: 900}});
    const pg = await c.newPage(); await pg.goto(F); await pg.waitForTimeout(350);
    const x = await pg.evaluate(PROBE);
    console.log(String(w).padStart(5), x.twoUp ? 'two-up ' : 'stacked',
      x.bladeBetween ? 'blade between' : 'blade elsewhere', x.hScroll ? 'H-SCROLL!' : 'no h-scroll',
      'donuts=' + x.donuts, 'bars=' + x.barRows);
    if (w === 390 || w === 820) await pg.screenshot({path: `${S}-w${w}.png`, fullPage: false});
    await c.close();
  }
  await b.close();
})();
