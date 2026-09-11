/* Playwright verification for FinOps Report Studio v1.3: the operator flow end to end, the real download, and the downloaded file with JavaScript disabled. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path'), os = require('os');
// Run from anywhere with Playwright available: NODE_PATH=$(npm root -g) node finops/studio-src/verify.js
const FIN = path.resolve(__dirname, '..');
const STUDIO = 'file://' + path.join(FIN, 'FinOps_Studio_v1.html');
const D = path.join(FIN, 'data') + '/';
const OUT = path.join(os.tmpdir(), 'finops-verify');
const R = OUT + '/route/';
// copies of the sample files under the names Google writes, so the routing by file name is exercised too
fs.mkdirSync(R, { recursive: true });
fs.copyFileSync(D + 'SAMPLE_gcp_cost_by_service_2026-08.csv', R + 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-08-01 #U2014 2026-08-31.csv');
fs.copyFileSync(D + 'SAMPLE_gcp_sandbox_by_service_2026-08.csv', R + 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-08-01 #U2014 2026-08-31 (1).csv');
fs.copyFileSync(D + 'SAMPLE_gcp_cost_by_service_2026-08.csv', R + 'SAMPLE_gcp_cost_by_service_to-date.csv');
fs.copyFileSync(D + 'SAMPLE_gcp_sandbox_by_service_2026-08.csv', R + 'SAMPLE_gcp_sandbox_by_service_to-date.csv');
fs.copyFileSync(D + 'SAMPLE_azure_cost_by_service_2026-08.csv', R + 'SAMPLE_azure_cost_by_service_to-date.csv');
const near = (a, b, tol) => Math.abs(a - b) <= (tol || 0.06);
const fails = [];
const check = (name, ok, extra) => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? ' | ' + JSON.stringify(extra) : '')); if (!ok) fails.push(name); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const errs = [], reqs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('blob:')) reqs.push(r.url()); });
  await p.goto(STUDIO); await p.waitForTimeout(800);
  const today = await p.evaluate(() => { const M = ['January','February','March','April','May','June','July','August','September','October','November','December']; const d = new Date(); return d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear(); });
  // ---- step 1: version and published derivation
  let s = await p.evaluate(() => ({ version: document.getElementById('f-version').value, note: document.getElementById('ver-note').textContent, derived: document.getElementById('derived').textContent, published: window.FinOpsStudio.state().edition.published, resumed: window.FinOpsStudio.resumed() }));
  check('fresh load: version derived as 21', s.version === '21', s.note);
  check('fresh load: published refreshed to today', s.published === today, s.published);
  check('fresh load: derived chips show version and refresh note', /Version\s*v21/.test(s.derived) && /refreshed on download/.test(s.derived));
  check('fresh load: not resumed', s.resumed === false);
  await p.selectOption('#f-month', '2026-09'); await p.waitForTimeout(300);
  s = await p.evaluate(() => ({ version: document.getElementById('f-version').value, note: document.getElementById('ver-note').textContent }));
  check('month 2026-09 derives v22', s.version === '22', s.note);
  await p.selectOption('#f-month', '2026-07'); await p.waitForTimeout(300);
  check('month 2026-07 derives v20', (await p.inputValue('#f-version')) === '20');
  await p.selectOption('#f-month', '2026-08'); await p.waitForTimeout(300);
  await p.fill('#f-version', '25'); await p.waitForTimeout(300);
  await p.selectOption('#f-month', '2026-09'); await p.waitForTimeout(300);
  s = await p.evaluate(() => ({ version: document.getElementById('f-version').value, note: document.getElementById('ver-note').textContent, manual: window.FinOpsStudio.state().edition.versionManual }));
  check('hand-set version survives a month change', s.version === '25' && s.manual === true, s.note);
  await p.click('.adjust > summary'); await p.waitForTimeout(150);
  await p.fill('#f-pub', '1 January 2030'); await p.waitForTimeout(300);
  s = await p.evaluate(() => ({ manual: window.FinOpsStudio.state().edition.publishedManual, derived: document.getElementById('derived').textContent }));
  check('hand-set published date is flagged', s.manual === true && /set by hand/.test(s.derived));
  await p.click('#btn-derive'); await p.waitForTimeout(300);
  s = await p.evaluate(() => ({ version: document.getElementById('f-version').value, pub: window.FinOpsStudio.state().edition.published, vm: window.FinOpsStudio.state().edition.versionManual, pm: window.FinOpsStudio.state().edition.publishedManual }));
  check('refill returns version and published to derived', s.version === '22' && s.pub === today && !s.vm && !s.pm, s);
  await p.selectOption('#f-month', '2026-08'); await p.waitForTimeout(300);
  check('back on August: v21', (await p.inputValue('#f-version')) === '21');
  // ---- the August edition as shipped: no opening paragraph, no statement, Google Cloud only
  s = await p.evaluate(() => ({ lead: !!document.querySelector('#report .hero .wrap > p.sub'), stmt: !!document.querySelector('#report .stmt'), sw: !!document.querySelector('#report .cloudsw'), off: [...document.querySelectorAll('#checklist li.ok')].some(l => /statement of the month is switched off/.test(l.textContent)) }));
  check('as shipped: no opening paragraph, no statement, no cloud switch, and the statement check passes as switched off', !s.lead && !s.stmt && !s.sw && s.off, s);
  await p.check('input[data-bind="edition.showLead"]'); await p.check('input[data-bind="edition.showStatement"]'); await p.check('input[data-bind="clouds.azure.enabled"]'); await p.waitForTimeout(600);
  check('switching the three back on restores the paragraph, the statement and the cloud switch', await p.evaluate(() => !!document.querySelector('#report .hero .wrap > p.sub') && !!document.querySelector('#report .stmt') && !!document.querySelector('#report .cloudsw')));
  // ---- statement: collapsed in the report, open in the live preview
  s = await p.evaluate(() => ({ reportMore: !!document.querySelector('#report .stmt details.more'), reportOpen: !!document.querySelector('#report .stmt details.more[open]'), dirBeforeMore: (() => { const st = document.querySelector('#report .stmt'); const i1 = [...st.children].findIndex(e => e.classList.contains('dir')); const i2 = [...st.children].findIndex(e => e.classList.contains('more')); return i1 > -1 && i2 > i1; })(), paragraphs: document.querySelectorAll('#report .stmt .more-body .en p').length }));
  check('report statement: headline, direction points, then Read more (closed)', s.reportMore && !s.reportOpen && s.dirBeforeMore && s.paragraphs === 4, s);
  await p.click('#st-steps button[data-step="5"]'); await p.waitForTimeout(200);
  check('step 5 live preview shows the paragraphs open', await p.evaluate(() => !!document.querySelector('#stmt-preview details.more[open]')));
  // ---- Azure switched off with the draft still mentioning it: the check names the field and offers the fix
  await p.click('#st-steps button[data-step="1"]'); await p.waitForTimeout(150);
  await p.uncheck('input[data-bind="clouds.azure.enabled"]'); await p.waitForTimeout(400);
  await p.click('#st-steps button[data-step="6"]'); await p.waitForTimeout(200);
  s = await p.evaluate(() => { const li = [...document.querySelectorAll('#checklist li.err')].find(l => /Azure is not included/.test(l.textContent)); return { found: !!li, text: li ? li.textContent : '', btn: !!(li && li.querySelector('button[data-act="dropAzure"]')), tokensDead: [...document.querySelectorAll('#tokchips button.dead')].map(b => b.dataset.tok) }; });
  check('Azure off: the blocker names the Azure tokens and the fields, with a fix button', s.found && /Statement \(EN\)/.test(s.text) && /Statement \(AR\)/.test(s.text) && s.btn && s.tokensDead.includes('azure.net') && s.tokensDead.includes('azure.credit.remaining'), s.text.slice(0, 160));
  await p.click('#checklist button[data-act="dropAzure"]'); await p.waitForTimeout(500);
  s = await p.evaluate(() => { const st = window.FinOpsStudio.state().statement; return { en: st.bodyEn, ar: st.bodyAr, azureErr: [...document.querySelectorAll('#checklist li.err')].some(l => /Azure|azure/.test(l.textContent)), paragraphs: document.querySelectorAll('#report .stmt .more-body .en p').length, arParas: document.querySelectorAll('#report .stmt .more-body .ar p').length, gcpOnly: !document.querySelector('#report .cloudsw') }; });
  check('one click removes the Azure lines from both languages and clears the blocker', !/azure/i.test(s.en) && !/azure/i.test(s.ar) && !s.azureErr && s.paragraphs === 3 && s.arParas === 3 && s.gcpOnly, [s.paragraphs, s.arParas, s.azureErr, s.gcpOnly]);
  await p.click('#st-steps button[data-step="1"]'); await p.waitForTimeout(150);
  await p.check('input[data-bind="clouds.azure.enabled"]'); await p.waitForTimeout(300);
  await p.click('#st-steps button[data-step="5"]'); await p.waitForTimeout(150);
  await p.click('#btn-draft'); await p.waitForTimeout(400);
  check('Azure back on and the draft restored', await p.evaluate(() => /azure\.net/.test(window.FinOpsStudio.state().statement.bodyEn) && !!document.querySelector('#report .cloudsw')));
  // ---- step 3: ledger currency and confirmation
  await p.click('#st-steps button[data-step="3"]'); await p.waitForTimeout(300);
  let c = await p.evaluate(() => window.FinOpsStudio.creditCalc('gcp'));
  check('ledger USD: starting credit 9,685,235.81', near(c.startingSar, 9685235.81) && c.ledger === 'USD');
  const exp0 = 9685235.81 - (235520 + 128517.64) * 3.75 - 3128008.84;
  check('baseline remaining hand check', near(c.remainingSar, exp0), [c.remainingSar, exp0.toFixed(2)]);
  s = await p.evaluate(() => ({ warn: [...document.querySelectorAll('#checklist li.warn')].map(l => l.textContent).filter(t => /ledger/.test(t)).length, note: document.querySelector('#report .mfig-card.for-gcp .calc-note .en').textContent, cols: document.querySelectorAll('#report .mfig-card.for-gcp .calc thead th').length, basis: document.querySelector('#balance .basis').textContent, poLabel: document.querySelector('#ceditors .ceditor th:nth-child(3)').textContent }));
  check('unconfirmed ledger: amber checklist item, note in the report, 3 columns', s.warn === 1 && /still being confirmed with procurement/.test(s.note) && s.cols === 3 && /not yet confirmed/.test(s.basis) && s.poLabel === 'Price ($, net of VAT)', s);
  await p.check('input[data-bind="edition.ledgerConfirmed"]'); await p.waitForTimeout(400);
  s = await p.evaluate(() => ({ warn: [...document.querySelectorAll('#checklist li.warn')].map(l => l.textContent).filter(t => /ledger/.test(t)).length, note: document.querySelector('#report .mfig-card.for-gcp .calc-note .en').textContent }));
  check('confirmed ledger: warning and note gone', s.warn === 0 && !/still being confirmed/.test(s.note) && /converted at 3.75/.test(s.note));
  await p.selectOption('#f-ledger', 'SAR'); await p.waitForTimeout(400);
  c = await p.evaluate(() => window.FinOpsStudio.creditCalc('gcp'));
  s = await p.evaluate(() => ({ cols: document.querySelectorAll('#report .mfig-card.for-gcp .calc thead th').length, note: document.querySelector('#report .mfig-card.for-gcp .calc-note .en').textContent, poLabel: document.querySelector('#ceditors .ceditor th:nth-child(3)').textContent, err: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent).filter(t => /negative/.test(t)).length }));
  check('ledger SAR: starting 2,582,729.55, two columns, negative balance blocks', near(c.startingSar, 2582729.55) && s.cols === 2 && /used as they are/.test(s.note) && s.poLabel === 'Price (SAR, net of VAT)' && s.err === 1, [c.startingSar, c.remainingSar, s]);
  await p.selectOption('#f-ledger', 'USD'); await p.uncheck('input[data-bind="edition.ledgerConfirmed"]'); await p.waitForTimeout(400);
  c = await p.evaluate(() => window.FinOpsStudio.creditCalc('gcp'));
  check('ledger back to USD unconfirmed', near(c.startingSar, 9685235.81) && c.ledgerConfirmed === false);
  // commitments: paid as the service is used, read from the contract-to-date export
  const SEC = 914135 * 3.75, SCC = 81672.81 * 3.75, SECPAID = 1056037.95, SCCPAID = 109331.1;
  s = c.commitments.map(k => ({ n: k.name, sar: k.sar, used: k.usedSar, rem: k.remainingSar, found: k.found, matched: k.matched }));
  check('SecOps: committed in full, with the Chronicle rows of the to-date export counted as paid towards it', near(s[0].sar, SEC) && near(s[0].used, SECPAID) && near(s[0].rem, SEC - SECPAID) && s[0].found && s[0].matched.join() === 'Chronicle', s[0]);
  check('Security Command Center: committed less what the to-date export has already billed', near(s[1].sar, SCC) && near(s[1].used, SCCPAID) && near(s[1].rem, SCC - SCCPAID), s[1]);
  check('committed footer equals the sum of the two remaining commitments', near(c.commitRemainingSar, (SEC - SECPAID) + (SCC - SCCPAID)));
  s = await p.evaluate(() => ({ panel: document.querySelector('#balance').textContent, calcRow: document.querySelector('#report .mfig-card.for-gcp .calc tbody').textContent, fields: [...document.querySelectorAll('#ceditors input[data-ed="2"]')].map(i => i.dataset.f) }));
  check('the balance panel and the report arithmetic read as paid to date, and the editor has no start or term field', /1,056,038 paid to date, read from Chronicle/.test(s.panel) && /paid towards it to date/.test(s.calcRow) && !/instalment/i.test(s.panel + s.calcRow) && s.fields.indexOf('start') < 0 && s.fields.indexOf('term') < 0, [s.calcRow.slice(0, 90), s.fields]);
  s = await p.evaluate(() => { const i = document.querySelector('#report .mfig-card.for-gcp .meter>i'); return { width: i.style.width, cap: document.querySelector('#report .mfig-card.for-gcp .meter-cap .en').textContent, anim: getComputedStyle(i, '::after').animationName, pct: window.FinOpsStudio.creditCalc('gcp').pct }; });
  check('meter: the coloured part is the consumed share and it shines', s.width === (100 - s.pct).toFixed(1) + '%' && /^\d+\.\d% of starting credit consumed · \d+\.\d% remaining$/.test(s.cap) && s.anim === 'meter-shine', [s.width, s.cap, s.anim]);
  // tolerant commitment matching against the baseline to-date rows
  await p.fill('#ceditors input[data-ed="2"][data-i="0"][data-f="servicesText"]', 'chronicle'); await p.waitForTimeout(400);
  c = await p.evaluate(() => window.FinOpsStudio.creditCalc('gcp'));
  check('commitment matched case-insensitively (chronicle)', c.commitments[0].found && c.commitments[0].matched.length >= 1, c.commitments[0].matched);
  await p.fill('#ceditors input[data-ed="2"][data-i="0"][data-f="servicesText"]', 'Chron'); await p.waitForTimeout(400);
  c = await p.evaluate(() => window.FinOpsStudio.creditCalc('gcp'));
  check('commitment matched on a partial name (Chron)', c.commitments[0].found, c.commitments[0].matched);
  await p.fill('#ceditors input[data-ed="2"][data-i="0"][data-f="servicesText"]', 'No Such Service'); await p.waitForTimeout(400);
  s = await p.evaluate(() => ({ c: window.FinOpsStudio.creditCalc('gcp').commitments[0], warn: [...document.querySelectorAll('#checklist li.warn')].map(l => l.textContent).filter(t => /no service row/.test(t)).length, panel: document.querySelector('#balance').textContent }));
  check('unmatched commitment warns and reads as fully remaining', !s.c.found && near(s.c.usedSar, 0) && near(s.c.remainingSar, SEC) && s.warn === 1 && /no matching row in the contract-to-date export/.test(s.panel));
  await p.fill('#ceditors input[data-ed="2"][data-i="0"][data-f="servicesText"]', 'Chronicle'); await p.waitForTimeout(400);
  // ---- step 2: guide and the drop
  await p.click('#st-steps button[data-step="2"]'); await p.waitForTimeout(200);
  check('step 2 pull guide present with both clouds', await p.evaluate(() => { const g = document.querySelector('[data-panel="2"] details.guide'); return !!g && g.querySelectorAll('.guides ol').length === 2 && /Billing Account Viewer/.test(g.textContent) && /Cost Management Reader/.test(g.textContent); }));
  await p.click('[data-panel="2"] details.guide > summary'); await p.waitForTimeout(200);
  await p.screenshot({ path: OUT + '/studio_v13_files.png', fullPage: false });
  await p.setInputFiles('#bigzone input', [
    R + 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-08-01 #U2014 2026-08-31.csv',
    R + 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-08-01 #U2014 2026-08-31 (1).csv',
    D + 'SAMPLE_gcp_cost_by_project_2026-08.csv', R + 'SAMPLE_gcp_cost_by_service_to-date.csv', R + 'SAMPLE_gcp_sandbox_by_service_to-date.csv',
    D + 'SAMPLE_azure_cost_by_service_2026-08.csv', D + 'SAMPLE_azure_cost_by_subscription_2026-08.csv', D + 'SAMPLE_azure_cost_by_location_2026-08.csv', R + 'SAMPLE_azure_cost_by_service_to-date.csv',
  ]);
  await p.waitForTimeout(1500);
  c = await p.evaluate(() => window.FinOpsStudio.creditCalc('gcp'));
  const exp1 = 9685235.81 - (235520 + 128517.64) * 3.75 - 144550.33 * 3.75;
  check('uploaded to-date: remaining hand check', near(c.remainingSar, exp1) && c.basis === 'upload', [c.remainingSar, exp1.toFixed(2)]);
  check('the uploaded to-date export resets what has been paid towards each commitment', near(c.commitments[0].usedSar, 270112.5) && near(c.commitments[0].remainingSar, SEC - 270112.5) && near(c.commitments[1].usedSar, 27750) && near(c.commitments[1].remainingSar, SCC - 27750) && c.commitments[0].found, c.commitments.map(k => [k.name, k.usedSar, k.remainingSar, k.matched]));
  // ---- where did the money go: department on the left, service on the right; SPARK below with the same pairing
  s = await p.evaluate(() => {
    const mv = document.querySelector('#report .mv-gcp-2026-08'), cols = [...mv.querySelectorAll('.twocol')];
    const heads = e => [...e.children].map(c => (c.querySelector('h3') || {}).textContent || '');
    const kinds = e => [...e.children].map(c => c.querySelector('.dwrap') ? 'donut' : c.querySelector('.bars') ? 'bars' : '?');
    const sp = cols[1];
    return { cols: cols.length, heads: cols.map(heads), kinds: cols.map(kinds), stacked: !!cols[0].querySelector('.dwrap.stack'),
      mark: !!mv.querySelector('.spark-head img.spark-mark'),
      sparkKick: [...mv.querySelectorAll('.kick')].map(e => e.textContent).find(t => /SPARK/.test(t)) || '',
      sparkH2: [...mv.querySelectorAll('h2')].map(e => e.textContent).find(t => /SPARK/.test(t)) || '',
      sparkLead: [...mv.querySelectorAll('p.lead')].map(e => e.textContent).find(t => /SPARK/.test(t)) || '',
      sparkLeg: sp ? [...sp.querySelectorAll('.dleg li')].map(l => l.textContent) : [],
      sparkCounts: sp ? [...sp.querySelectorAll('.dleg li')].map(l => [l.querySelector('.dl-name .en').textContent, l.querySelector('.dl-val').textContent]) : [],
      sparkRows: sp ? sp.children[0].querySelectorAll('details table tbody tr').length : 0,
      sandbox: /sandbox/i.test(mv.textContent) };
  });
  check('the money-go row pairs the department donut on the left with the service bars on the right', s.cols === 2 && /Spend per general department/.test(s.heads[0][0]) && /Overall spend by service/.test(s.heads[0][1]) && s.kinds[0].join() === 'donut,bars' && s.stacked, [s.heads[0], s.kinds[0]]);
  check('the SPARK row pairs the use-case donut with its service bars, under the SPARK mark and its own numbered header', s.mark && /SPARK use cases per general department/.test(s.heads[1][0]) && /SPARK spend by service/.test(s.heads[1][1]) && s.kinds[1].join() === 'donut,bars' && /04 · SPARK/.test(s.sparkKick) && /What is running inside SPARK\?/.test(s.sparkH2) && /SPARK ran 7 use cases across 2 general departments/.test(s.sparkLead), [s.heads[1], s.kinds[1], s.sparkKick]);
  check('the SPARK donut counts the use-case list, not the exports, and the word sandbox is gone', s.sparkLeg.length === 2 && JSON.stringify(s.sparkCounts) === JSON.stringify([['Digital Transformation GD', '5'], ['Digital Enterprise Architecture', '2']]) && s.sparkLeg.some(t => /Digital Enterprise Architecture/.test(t)) && s.sparkRows === 7 && !s.sandbox, [s.sparkCounts, s.sparkRows, s.sandbox]);
  s = await p.evaluate(() => { const d = window.FinOpsStudio.state().clouds.gcp.periods['2026-08']; return { parts: (d.sparkDepts || []).filter(x => x.net > 0).map(x => [x.key, +x.net.toFixed(2)]), tot: d.sparkProjTotal }; });
  check('SPARK per-department spend is still read from the project ids inside the folder', JSON.stringify(s.parts) === JSON.stringify([['dtgd', 0.04], ['dea', 2826.72]]) && near(s.tot, 2826.76, 0.02), s);
  s = await p.evaluate(() => { const q = document.querySelector('#report .mv-gcp-td') || document.querySelector('#report .mv-gcp-2026-h1'); const cols = q ? [...q.querySelectorAll('.twocol')] : []; return { cols: cols.length, sparkCards: q ? [...q.querySelectorAll('.card h3')].map(h => h.textContent).filter(t => /SPARK/.test(t)) : [], lead: [...(q ? q.querySelectorAll('p.lead') : [])].map(e => e.textContent).find(t => /SPARK/.test(t)) || '' }; });
  check('a period other than the month carries one SPARK card, services only', s.cols === 1 && s.sparkCards.length === 1 && /SPARK spend by service/.test(s.sparkCards[0]) && /on the services below/.test(s.lead), s);
  s = await p.evaluate(() => { const src = document.querySelector('#report .mfig-card.for-gcp .src'); return { sub: [...src.querySelectorAll('.s.sub')].map(e => e.textContent), withSub: src.querySelectorAll('.s.with-sub').length }; });
  check('the drawdowns sit under the live purchase order and say so', s.withSub === 1 && s.sub.length === 2 && /Enhanced Support/.test(s.sub[0]) && /drawn from this order/.test(s.sub[0]) && /Log Optimization/.test(s.sub[1]), s.sub);
  await p.click('#st-steps button[data-step="4"]'); await p.waitForTimeout(200);
  check('ownership picker offers the six departments', await p.evaluate(() => { const o = [...document.querySelector('#qm-azure select[data-qm]').options].map(x => x.value).filter(Boolean); return o.length === 6 && o.includes('dtgd') && o.includes('dea'); }));
  for (const [name, dept] of Object.entries({ 'MOE-SEC-PRD': 'cyber', 'MOE-INFRA-HUB': 'itsvc', 'MOE-BUSINESS-APPS': 'dtgd' })) { await p.selectOption(`#qm-azure select[data-qm="${name}"]`, dept); await p.waitForTimeout(250); }
  await p.waitForTimeout(400);
  s = await p.evaluate(() => { const d = window.FinOpsStudio.state().clouds.azure.periods['2026-08'].departments; const leg = [...document.querySelectorAll('#report .mv-azure-2026-08 .dleg li')].map(l => l.textContent); return { dtgd: (d.find(x => x.key === 'dtgd') || {}).net, legend: leg.length, hasName: leg.some(t => /Digital Transformation GD/.test(t)), zeroShown: leg.some(t => /Digital Enterprise Architecture/.test(t)) }; });
  check('a subscription mapped to Digital Transformation GD shows in the legend; the unused department stays out', s.dtgd > 0 && s.hasName && !s.zeroShown && s.legend === 3, s);
  // ---- step 6: one-click download, result panel, open in a new tab, secondary downloads
  await p.click('#st-steps button[data-step="6"]'); await p.waitForTimeout(200);
  s = await p.evaluate(() => ({ errs: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent.slice(0, 80)), gen: document.getElementById('btn-gen').textContent, disabled: document.getElementById('btn-gen').disabled, stable: !!document.getElementById('btn-gen-stable'), bar: document.getElementById('bar-status').textContent, keep: [...document.querySelectorAll('#checklist li.ok')].some(l => /keeps every edit/.test(l.textContent)) }));
  check('step 6: one primary button, no stable button, reminder about the saved state', s.gen === 'Download FinOps_Dashboard_v21.html' && !s.stable && s.keep, s);
  console.log('   blockers left (sample files expected):', s.errs);
  // sample files block the download: prove it, then lift the block by pretending the files are real
  await p.evaluate(() => window.FinOpsStudio.generate()); await p.waitForTimeout(300);
  check('download refused while blockers remain', await p.evaluate(() => document.getElementById('gen-result').hidden === true && !window.FinOpsStudio.lastGen()));
  await p.evaluate(() => { const S = window.FinOpsStudio.state(); ['gcp', 'azure'].forEach(c => Object.values(S.clouds[c].periods).forEach(pp => { if (pp.sample) { pp.sample = false; Object.keys(pp.files).forEach(k => { pp.files[k] = pp.files[k].replace(/^SAMPLE_/i, 'real_'); }); } })); });
  await p.click('#st-steps button[data-step="1"]'); await p.waitForTimeout(100); await p.selectOption('#f-month', '2026-08'); await p.waitForTimeout(400); await p.click('#st-steps button[data-step="6"]'); await p.waitForTimeout(200);
  s = await p.evaluate(() => ({ errs: [...document.querySelectorAll('#checklist li.err')].map(l => l.textContent.slice(0, 80)), disabled: document.getElementById('btn-gen').disabled }));
  check('no blockers once real files are in', s.errs.length === 0 && !s.disabled, s.errs);
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#btn-gen')]);
  const dlName = dl.suggestedFilename(); const dlPath = OUT + '/' + dlName; await dl.saveAs(dlPath);
  await p.waitForTimeout(500);
  s = await p.evaluate(() => ({ hidden: document.getElementById('gen-result').hidden, text: document.getElementById('gen-result').textContent, btns: ['btn-open', 'btn-stable', 'btn-state'].map(id => !!document.getElementById(id)), published: window.FinOpsStudio.state().edition.published }));
  check('one click downloads the versioned standalone file', dlName === 'FinOps_Dashboard_v21.html', dlName);
  check('result panel: standalone wording and the three secondary buttons', !s.hidden && /no internet connection, no Studio/.test(s.text) && s.btns.every(Boolean) && new RegExp('published ' + today).test(s.text));
  await p.screenshot({ path: OUT + '/studio_v13_result.png', fullPage: false });
  const [dl2] = await Promise.all([p.waitForEvent('download'), p.click('#btn-stable')]);
  check('stable copy downloads as FinOps_Dashboard.html', dl2.suggestedFilename() === 'FinOps_Dashboard.html');
  const [dl3] = await Promise.all([p.waitForEvent('download'), p.click('#btn-state')]);
  check('edition state downloads as JSON for the month', dl3.suggestedFilename() === 'finops_edition_2026-08.json');
  const [np] = await Promise.all([ctx.waitForEvent('page'), p.click('#btn-open')]);
  await np.waitForLoadState(); await np.waitForTimeout(400);
  const npReqs = []; np.on('request', r => { if (!r.url().startsWith('blob:')) npReqs.push(r.url()); });
  s = await np.evaluate(() => ({ title: document.title, scripts: document.querySelectorAll('script').length, more: !!document.querySelector('.stmt details.more'), url: location.protocol }));
  check('open in a new tab shows the report itself (blob, one motion script)', /FinOps Report/.test(s.title) && s.scripts === 1 && s.more && s.url === 'blob:', s);
  await np.close();
  const published = fs.readFileSync(dlPath, 'utf8');
  check('downloaded file equals publishedHtml()', published === await p.evaluate(() => window.FinOpsStudio.publishedHtml()));
  check('downloaded file: one self-contained motion script, no em dash, standalone marker', (published.match(/<script/g) || []).length === 1 && /de-motifs/.test(published) && /addEventListener\('mousemove'/.test(published) && !/FinOpsStudio|\bS\.clouds\b/.test(published.slice(published.indexOf('<script'))) && !published.replace(/base64,[A-Za-z0-9+/=]+/g, '').includes('\u2014') && /Studio v1\.3/.test(published));
  // an edit after the download hides the stale result panel
  await p.click('#st-steps button[data-step="5"]'); await p.waitForTimeout(100);
  await p.fill('#f-sh', 'We know where every riyal sits, and we manage to it.'); await p.waitForTimeout(400);
  check('an edit after the download clears the result panel', await p.evaluate(() => document.getElementById('gen-result').hidden && !window.FinOpsStudio.lastGen()));
  await p.click('#st-steps button[data-step="6"]'); await p.waitForTimeout(200);
  await p.screenshot({ path: OUT + '/studio_v13_full.png', fullPage: true });
  console.log('STUDIO errors:', errs, 'external requests:', reqs.length);
  check('studio: zero page errors and zero external requests', errs.length === 0 && reqs.length === 0);
  // ---- resume: reload keeps everything and says so
  await p.reload(); await p.waitForTimeout(900);
  s = await p.evaluate(() => ({ resumed: window.FinOpsStudio.resumed(), head: document.getElementById('f-sh').value, toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' | '), files: document.querySelectorAll('#ftable .badge.ok').length }));
  check('reload resumes the saved state with a toast', s.resumed && /manage to it/.test(s.head) && /Picked up where you left off/.test(s.toast) && s.files >= 8, [s.files, s.toast.slice(0, 80)]);
  await p.evaluate(() => { const k = 'finops-studio-v1', st = JSON.parse(localStorage.getItem(k)); st.meta.stamp = 'older-build'; delete st.edition.showLead; delete st.edition.showStatement; delete st.clouds.gcp.sparkProjectsText; delete st.edition.showQuarter; st.edition.quarterEnd = false; localStorage.setItem(k, JSON.stringify(st)); });
  await p.reload(); await p.waitForTimeout(900);
  s = await p.evaluate(() => { const S = window.FinOpsStudio.state(); return { migrated: window.FinOpsStudio.migrated(), head: document.getElementById('f-sh').value, lead: S.edition.showLead, spark: S.clouds.gcp.sparkProjectsText, showQuarter: S.edition.showQuarter, files: document.querySelectorAll('#ftable .badge.ok').length, toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' | '), stamp: S.meta.stamp, migratedFrom: S.meta.migratedFrom }; });
  check('an older saved state is migrated into the new build: edits and files kept, new fields filled, toast shown', s.migrated && /manage to it/.test(s.head) && s.lead === false && /prj-moenergy-iw-/.test(s.spark || '') && s.showQuarter === true && s.files >= 8 && /Studio was updated/.test(s.toast) && s.stamp !== 'older-build' && s.migratedFrom === 'older-build', [s.lead, s.spark, s.showQuarter, s.files, s.toast.slice(0, 60)]);
  await ctx.close();
  // ---- the generated file with JavaScript disabled
  const ctx2 = await b.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const g = await ctx2.newPage(); const reqs2 = []; g.on('request', r => { if (!r.url().startsWith('file:')) reqs2.push(r.url()); });
  await g.goto('file://' + dlPath); await g.waitForTimeout(400);
  const vis = sel => g.evaluate(s => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : 'MISSING'; }, sel);
  const t = { aug: await vis('.mv-gcp-2026-08'), moreSummary: await vis('.stmt .more>summary'), bodyBefore: await g.evaluate(() => document.querySelector('.stmt .more-body p').checkVisibility()) };
  await g.click('.stmt .more>summary'); await g.waitForTimeout(200);
  t.bodyAfter = await g.evaluate(() => document.querySelector('.stmt .more-body p').checkVisibility());
  check('generated (no JS): Read more opens the paragraphs', t.moreSummary !== 'none' && t.bodyBefore === false && t.bodyAfter === true, t);
  await g.click('.stmt .more>summary'); await g.waitForTimeout(150);
  await g.screenshot({ path: OUT + '/generated_v13_hero.png', fullPage: false });
  await g.click('.calc>summary'); await g.waitForTimeout(150); t.calcOpenRows = await g.evaluate(() => document.querySelectorAll('.calc[open] tbody tr').length);
  t.calcNote = await g.evaluate(() => document.querySelector('.calc-note .en').textContent);
  check('generated: calc table opens and states the ledger basis plus the unconfirmed line', t.calcOpenRows >= 8 && /converted at 3.75/.test(t.calcNote) && /still being confirmed/.test(t.calcNote));
  await g.click('label[for="c-azure"]'); await g.waitForTimeout(150); t.azure = await vis('.mv-azure-2026-08');
  await g.click('label[for="lang"]'); await g.waitForTimeout(150); t.rtl = await g.evaluate(() => getComputedStyle(document.querySelector('main')).direction);
  t.arMore = await g.evaluate(() => getComputedStyle(document.querySelector('.stmt .more>summary .ar')).display);
  check('generated: cloud switch, RTL flip, Arabic Read more label', t.aug === 'block' && t.azure === 'block' && t.rtl === 'rtl' && t.arMore !== 'none', t);
  await g.click('label[for="lang"]'); await g.click('label[for="c-gcp"]'); await g.waitForTimeout(150);
  await g.emulateMedia({ media: 'print' }); await g.waitForTimeout(200);
  const pr = await g.evaluate(() => ({ summary: getComputedStyle(document.querySelector('.stmt .more>summary')).display, body: document.querySelector('.stmt .more-body p').checkVisibility(), calc: document.querySelector('.calc tbody tr td').checkVisibility(), period: getComputedStyle(document.querySelector('.print-period')).display }));
  check('generated (print): statement paragraphs and calc table open, summary hidden', pr.summary === 'none' && pr.body === true && pr.calc === true && pr.period === 'block', pr);
  await g.emulateMedia({ media: 'screen' }); await g.waitForTimeout(100);
  const q = await g.evaluate(() => ({ tab: !!document.getElementById('pv-gcp-q'), opts: [...document.querySelectorAll('.sw.for-gcp .seg.s-q .dd-opt')].map(l => l.textContent.replace(/\s+/g, ' ')) }));
  check('generated: the Quarter tab is present with Q1 2026, Q2 2026 and H1 2026, as in v20', q.tab && q.opts.length === 3 && q.opts.some(t => /Q1 2026/.test(t)) && q.opts.some(t => /Q2 2026/.test(t)) && q.opts.some(t => /H1 2026/.test(t)), q.opts);
  check('generated: zero external requests', reqs2.length === 0);
  await b.close();
  console.log(fails.length ? 'FAILED CHECKS: ' + fails.join(' ; ') : 'ALL CHECKS PASSED');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(1); });
