const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const STUDIO = 'file:///home/user/test1/finops/FinOps_Studio_v1.html';
const D = '/home/user/test1/finops/data/';
const OUT = '/tmp/finops-verify';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const errs = [], reqs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('request', r => { if (!r.url().startsWith('file:')) reqs.push(r.url()); });
  await p.goto(STUDIO); await p.waitForTimeout(800);
  const s0 = await p.evaluate(() => ({
    reportChars: document.getElementById('report').innerHTML.length,
    checkedMonth: [...document.querySelectorAll('input[name="p-gcp-month"]:checked')].map(r => r.id),
    checkedPv: [...document.querySelectorAll('input[name="pv-gcp"]:checked')].map(r => r.id),
    errs: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent.slice(0, 90)),
    genDisabled: document.getElementById('btn-gen').disabled,
    julyNet: document.querySelector('.mv-gcp-2026-07 .summary-value') && document.querySelector('.mv-gcp-2026-07 .summary-value').textContent,
    julyDepts: [...document.querySelectorAll('.mv-gcp-2026-07 .dleg li')].map(l => l.textContent.replace(/\s+/g, ' ').trim()),
    azureH1: document.querySelector('.mv-azure-2026-h1 .summary-value') && document.querySelector('.mv-azure-2026-h1 .summary-value').textContent,
    tokMissing: document.querySelectorAll('.stmt .tok-missing').length,
  }));
  console.log('INITIAL', JSON.stringify(s0, null, 1));
  await p.screenshot({ path: OUT + '/studio_initial.png', fullPage: true });
  // ---- drop the sample files ----
  const gz = '#zones-gcp .zone', az = '#zones-azure .zone';
  await p.setInputFiles(`${gz}:nth-child(1) input`, D + 'SAMPLE_gcp_cost_by_service_2026-08.csv');
  await p.setInputFiles(`${gz}:nth-child(2) input`, D + 'SAMPLE_gcp_cost_by_project_2026-08.csv');
  await p.setInputFiles(`${gz}:nth-child(3) input`, D + 'SAMPLE_gcp_sandbox_by_service_2026-08.csv');
  await p.setInputFiles(`${gz}:nth-child(7) input`, D + 'SAMPLE_gcp_cost_by_service_2026-08.csv');
  await p.setInputFiles(`${gz}:nth-child(8) input`, D + 'SAMPLE_gcp_cost_by_project_2026-08.csv');
  await p.setInputFiles(`${az}:nth-child(1) input`, D + 'SAMPLE_azure_cost_by_service_2026-08.csv');
  await p.setInputFiles(`${az}:nth-child(2) input`, D + 'SAMPLE_azure_cost_by_subscription_2026-08.csv');
  await p.setInputFiles(`${az}:nth-child(3) input`, D + 'SAMPLE_azure_cost_by_location_2026-08.csv');
  await p.setInputFiles(`${az}:nth-child(6) input`, D + 'SAMPLE_azure_cost_by_service_2026-08.csv');
  await p.waitForTimeout(900);
  const s1 = await p.evaluate(() => ({ errs: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent.slice(0, 120)), warns: [...document.querySelectorAll('#checklist li.warn')].map(l => l.textContent.slice(0, 120)) }));
  console.log('AFTER FILES (before map)', JSON.stringify(s1, null, 1));
  await p.evaluate(() => { const t = document.querySelector('[data-bind="clouds.azure.subMapText"]'); t.value = 'MOE-SEC-PRD = cyber\nMOE-INFRA-HUB = itsvc\nMOE-BUSINESS-APPS = business\n'; t.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.waitForTimeout(900);
  const s2 = await p.evaluate(() => ({
    errs: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent.slice(0, 120)),
    oks: document.querySelectorAll('#checklist li.ok').length,
    augNet: document.querySelector('.mv-gcp-2026-08 .summary-value') && document.querySelector('.mv-gcp-2026-08 .summary-value').textContent,
    augDepts: [...document.querySelectorAll('.mv-gcp-2026-08 .dleg li')].map(l => l.textContent.replace(/\s+/g, ' ').trim()),
    augProjects: document.querySelectorAll('.mv-gcp-2026-08 details tbody tr').length,
    azAug: document.querySelector('.mv-azure-2026-08 .summary-value') && document.querySelector('.mv-azure-2026-08 .summary-value').textContent,
    azDepts: [...document.querySelectorAll('.mv-azure-2026-08 .dleg li')].map(l => l.textContent.replace(/\s+/g, ' ').trim()),
    azRegions: document.querySelectorAll('.mv-azure-2026-08 .cw table tbody tr').length,
    tokMissing: document.querySelectorAll('.stmt .tok-missing').length,
    stmt: document.querySelector('.stmt .en p') && document.querySelector('.stmt .en p').textContent.slice(0, 160),
    chips: [...document.querySelectorAll('.chips .chip')].map(c => c.textContent.trim()),
  }));
  console.log('AFTER MAP', JSON.stringify(s2, null, 1));
  // generate: bypass the SAMPLE block by temporarily allowing (test only): build published html through the API and save like generate() does
  const published = await p.evaluate(() => {
    const S = window.FinOpsStudio; const html = S.build(true, { cloud: 'gcp', lang: false, pv: {}, p: {} });
    const box = document.createElement('div'); box.innerHTML = html; box.querySelectorAll('.studio-only').forEach(n => n.remove());
    const css = document.getElementById('fonts-css').textContent + '\n' + document.getElementById('report-css').textContent;
    return '<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>test</title><style>' + css + '</style></head><body class="published"><div id="report" class="report">' + box.innerHTML + '</div></body></html>';
  });
  const genPath = OUT + '/generated_test.html'; fs.writeFileSync(genPath, published);
  console.log('generated size KB', Math.round(published.length / 1024), 'scripts in generated:', (published.match(/<script/g) || []).length);
  // also try the real download path with the SAMPLE error bypassed? Not needed: the generate() function only wraps build(). Check the button is disabled because of SAMPLE:
  console.log('gen button disabled (expected true because SAMPLE files):', await p.evaluate(() => document.getElementById('btn-gen').disabled));
  await p.screenshot({ path: OUT + '/studio_loaded.png', fullPage: true });
  console.log('STUDIO errors:', errs, 'external requests:', reqs.length);
  await ctx.close();
  // ---- open the generated file with JavaScript disabled ----
  const ctx2 = await b.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const g = await ctx2.newPage(); const reqs2 = [];
  g.on('request', r => { if (!r.url().startsWith('file:')) reqs2.push(r.url()); });
  await g.goto('file://' + genPath); await g.waitForTimeout(500);
  const vis = sel => g.evaluate(s => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : 'MISSING'; }, sel);
  const t = {};
  t.gcpAugVisible = await vis('.mv-gcp-2026-08'); t.gcpJulHidden = await vis('.mv-gcp-2026-07'); t.quarterTab = await g.evaluate(() => !!document.getElementById('pv-gcp-q'));
  t.azureMainHidden = await vis('.cloud.for-azure');
  await g.click('label[for="c-azure"]'); await g.waitForTimeout(150);
  t.afterAzure_gcpHidden = await vis('.cloud.for-gcp'); t.afterAzure_azVisible = await vis('.mv-azure-2026-08'); t.azH1Hidden = await vis('.mv-azure-2026-h1');
  await g.click('label[for="c-gcp"]'); await g.click('.sw.for-gcp .seg.s-m .dd summary'); await g.waitForTimeout(150);
  t.ddOpen = await vis('.sw.for-gcp .dd-list');
  await g.click('.sw.for-gcp label.dd-opt[for="p-gcp-2026-07"]'); await g.waitForTimeout(150);
  t.afterPick_julVisible = await vis('.mv-gcp-2026-07'); t.afterPick_augHidden = await vis('.mv-gcp-2026-08');
  await g.click('.sw.for-gcp .seg.s-t label'); await g.waitForTimeout(150); t.tdVisible = await vis('.mv-gcp-td');
  await g.click('label[for="lang"]'); await g.waitForTimeout(150);
  t.arVisible = await g.evaluate(() => getComputedStyle(document.querySelector('.hero h1 .ar')).display); t.enHidden = await g.evaluate(() => getComputedStyle(document.querySelector('.hero h1 .en')).display); t.mainDir = await g.evaluate(() => getComputedStyle(document.querySelector('main')).direction); t.tableDir = await g.evaluate(() => getComputedStyle(document.querySelector('main table')).direction);
  await g.click('label[for="c-azure"]'); await g.waitForTimeout(200);
  await g.screenshot({ path: OUT + '/generated_azure_ar.png', fullPage: true });
  await g.emulateMedia({ media: 'print' }); await g.waitForTimeout(100);
  t.printPeriod = await vis('.print-period'); t.printGbar = await vis('.gbar');
  console.log('GENERATED (no JS) checks', JSON.stringify(t, null, 1), 'external requests:', reqs2.length);
  await b.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
