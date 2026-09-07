const { chromium } = require('playwright');
const fs = require('fs');
const STUDIO = 'file:///home/user/test1/finops/FinOps_Studio_v1.html';
const D = '/home/user/test1/finops/data/';
const OUT = '/tmp/finops-verify';
const R = OUT + '/route/';
const near = (a, b, tol) => Math.abs(a - b) <= (tol || 0.06);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const errs = [], reqs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('request', r => { if (!r.url().startsWith('file:')) reqs.push(r.url()); });
  await p.goto(STUDIO); await p.waitForTimeout(800);
  const s0 = await p.evaluate(() => {
    const c = window.FinOpsStudio.creditCalc('gcp');
    return { step1Visible: !document.querySelector('[data-panel="1"]').hidden, monthValue: document.getElementById('f-month').value, monthOptions: document.getElementById('f-month').options.length,
      derived: document.getElementById('derived').textContent.replace(/\s+/g, ' ').slice(0, 220),
      calc: { basis: c.basis, startingSar: c.startingSar, fixedSar: c.fixedSar, consumptionSar: c.consumptionSar, remainingSar: c.remainingSar, pct: +c.pct.toFixed(1), commit: c.commitments.map(k => [k.name, k.usedSar, k.remainingSar, k.found]), commitRemainingSar: c.commitRemainingSar, uncommittedSar: c.uncommittedSar },
      cardValue: document.querySelector('#report .mfig-card.for-gcp .mfig-value').textContent, calcRows: document.querySelectorAll('#report .mfig-card.for-gcp .calc tbody tr').length,
      foot: document.querySelector('#report .mfig-card.for-gcp .mfig-foot').textContent.replace(/\s+/g, ' ').slice(0, 160) };
  });
  console.log('INITIAL', JSON.stringify(s0, null, 1));
  const exp0 = 9685235.81 - (235520 + 128517.64) * 3.75 - 3128008.84;
  console.log('HAND CHECK baseline remaining', exp0.toFixed(2), 'matches:', near(s0.calc.remainingSar, exp0, 0.06));
  // step 2: drop everything on the big zone
  await p.click('#st-steps button[data-step="2"]'); await p.waitForTimeout(200);
  await p.setInputFiles('#bigzone input', [
    R + 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-08-01 #U2014 2026-08-31.csv',
    R + 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-08-01 #U2014 2026-08-31 (1).csv',
    D + 'SAMPLE_gcp_cost_by_project_2026-08.csv', R + 'SAMPLE_gcp_cost_by_service_to-date.csv',
    D + 'SAMPLE_azure_cost_by_service_2026-08.csv', D + 'SAMPLE_azure_cost_by_subscription_2026-08.csv', D + 'SAMPLE_azure_cost_by_location_2026-08.csv', R + 'SAMPLE_azure_cost_by_service_to-date.csv',
  ]);
  await p.waitForTimeout(1500);
  const s1 = await p.evaluate(() => {
    const c = window.FinOpsStudio.creditCalc('gcp');
    return { loaded: document.querySelectorAll('#ftable .badge.ok, #ftable .badge.sample').length, required: document.querySelectorAll('#ftable .badge.req').length,
      steps: [...document.querySelectorAll('#st-steps button')].map(b => b.className.replace('active', '').trim() + ':' + b.querySelector('em').textContent),
      calc: { basis: c.basis, consumptionSar: c.consumptionSar, remainingSar: c.remainingSar, commit: c.commitments.map(k => [k.name, k.usedSar, k.remainingSar, k.found]) },
      errs: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent.slice(0, 90)) };
  });
  console.log('AFTER DROP', JSON.stringify(s1, null, 1));
  const exp1 = 9685235.81 - (235520 + 128517.64) * 3.75 - 144550.33 * 3.75;
  console.log('HAND CHECK uploaded remaining', exp1.toFixed(2), 'matches:', near(s1.calc.remainingSar, exp1, 0.06), '| SecOps remaining expected', (914135 * 3.75 - 72030 * 3.75).toFixed(2), '| SCC expected', (81672.81 * 3.75 - 7400 * 3.75).toFixed(2));
  // step 3: edit a ledger row and see the balance move
  await p.click('#st-steps button[data-step="3"]'); await p.waitForTimeout(300);
  await p.screenshot({ path: OUT + '/studio_v12_credits.png', fullPage: false });
  const before = await p.evaluate(() => window.FinOpsStudio.creditCalc('gcp').remainingSar);
  await p.fill('#ceditors input[data-ed="1"][data-i="1"][data-f="usd"]', '128517.64'); await p.waitForTimeout(300);
  await p.fill('#ceditors input[data-ed="1"][data-i="1"][data-f="usd"]', '130000'); await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ rem: window.FinOpsStudio.creditCalc('gcp').remainingSar, panel: document.querySelector('#balance .big').textContent, card: document.querySelector('#report .mfig-card.for-gcp .mfig-value').textContent }));
  console.log('EDIT ROW', before, '->', after.rem, 'expected delta', ((130000 - 128517.64) * 3.75).toFixed(2), 'panel', after.panel, 'card', after.card);
  await p.fill('#ceditors input[data-ed="1"][data-i="1"][data-f="usd"]', '128517.64'); await p.waitForTimeout(300);
  await p.click('#ceditors button[data-add="3"]'); await p.waitForTimeout(200);
  const rowsAfterAdd = await p.evaluate(() => document.querySelectorAll('#ceditors .ceditor:nth-child(4) tbody tr').length);
  await p.click('#ceditors .ceditor:nth-child(4) tbody tr:last-child button[data-del]'); await p.waitForTimeout(200);
  console.log('ADD/DEL incentive row', rowsAfterAdd, '->', await p.evaluate(() => document.querySelectorAll('#ceditors .ceditor:nth-child(4) tbody tr').length));
  // step 4: quick map
  await p.click('#st-steps button[data-step="4"]'); await p.waitForTimeout(200);
  for (const [name, dept] of Object.entries({ 'MOE-SEC-PRD': 'cyber', 'MOE-INFRA-HUB': 'itsvc', 'MOE-BUSINESS-APPS': 'business' })) { await p.selectOption(`#qm-azure select[data-qm="${name}"]`, dept); await p.waitForTimeout(250); }
  await p.waitForTimeout(400);
  console.log('AFTER MAP', JSON.stringify(await p.evaluate(() => ({ allmapped: !document.getElementById('allmapped').hidden, errs: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent.slice(0, 80)), steps: [...document.querySelectorAll('#st-steps button')].map(b => b.className.replace('active', '').trim()) }))));
  // step 5 + 6
  await p.click('#st-steps button[data-step="5"]'); await p.waitForTimeout(200);
  console.log('STATEMENT preview tokens missing:', await p.evaluate(() => document.querySelectorAll('#stmt-preview .tok-missing').length), '| remaining token in preview:', await p.evaluate(() => (document.querySelector('#stmt-preview .en').textContent.match(/purchase-order balance stands at [^,]+/) || [''])[0]));
  await p.click('#st-steps button[data-step="6"]'); await p.waitForTimeout(200);
  await p.screenshot({ path: OUT + '/studio_v12_full.png', fullPage: true });
  await p.click('#btn-pubpreview'); await p.waitForTimeout(400);
  console.log('PUB PREVIEW', JSON.stringify(await p.evaluate(() => ({ cls: document.body.className, quarterTab: !!document.getElementById('pv-gcp-q'), calc: !!document.querySelector('#report .calc') }))));
  await p.click('#btn-back'); await p.waitForTimeout(300);
  const published = await p.evaluate(() => window.FinOpsStudio.publishedHtml());
  const genPath = OUT + '/generated_v12.html'; fs.writeFileSync(genPath, published);
  console.log('generated KB', Math.round(published.length / 1024), 'scripts', (published.match(/<script/g) || []).length, 'emdash', published.replace(/base64,[A-Za-z0-9+/=]+/g, '').includes('—'));
  console.log('STUDIO errors:', errs, 'external requests:', reqs.length);
  await ctx.close();
  const ctx2 = await b.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const g = await ctx2.newPage(); const reqs2 = []; g.on('request', r => { if (!r.url().startsWith('file:')) reqs2.push(r.url()); });
  await g.goto('file://' + genPath); await g.waitForTimeout(400);
  const vis = sel => g.evaluate(s => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : 'MISSING'; }, sel);
  const t = { aug: await vis('.mv-gcp-2026-08'), calcSummary: await vis('.calc>summary') };
  await g.click('.calc>summary'); await g.waitForTimeout(150); t.calcOpenRows = await g.evaluate(() => document.querySelectorAll('.calc[open] tbody tr').length);
  await g.click('label[for="c-azure"]'); await g.waitForTimeout(150); t.azure = await vis('.mv-azure-2026-08');
  await g.click('label[for="lang"]'); await g.waitForTimeout(150); t.rtl = await g.evaluate(() => getComputedStyle(document.querySelector('main')).direction);
  await g.click('label[for="c-gcp"]'); await g.waitForTimeout(200);
  await g.screenshot({ path: OUT + '/generated_v12_ar.png', fullPage: false });
  console.log('GENERATED (no JS)', JSON.stringify(t), 'external', reqs2.length);
  await b.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
