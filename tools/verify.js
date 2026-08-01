// SPARK artifact verifier — run: node verify.js <file.html> [--demo] [--counters] [--form] [--chat] [--lang]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const file = process.argv[2];
  const flags = process.argv.slice(3);
  const name = path.basename(file, '.html');
  const shotsDir = path.join(process.cwd(), 'shots');
  fs.mkdirSync(shotsDir, { recursive: true });
  // CHROMIUM_PATH env var overrides; otherwise Playwright's own browser (npx playwright install chromium)
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [], warnings = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await page.goto('file://' + path.resolve(file), { waitUntil: 'load' });
  await page.waitForTimeout(800);

  // 1 · sections render + reveal
  const secInfo = await page.evaluate(() => {
    const secs = [...document.querySelectorAll('section.page, section[id]')];
    return secs.map(s => ({ id: s.id, h: s.offsetHeight }));
  });
  const report = { file: name, sections: secInfo.length, revealed: 0, stTotal: 0, stIn: 0, svgIssues: [], useMissing: [], scrollspy: 'n/a', extra: {} };
  for (const s of secInfo) {
    if (!s.id) continue;
    await page.evaluate(id => document.getElementById(id).scrollIntoView({ block: 'start' }), s.id);
    await page.waitForTimeout(1900);
  }
  await page.waitForTimeout(600);
  const reveal = await page.evaluate(() => {
    const rv = [...document.querySelectorAll('.rv')];
    const st = [...document.querySelectorAll('.st')];
    return {
      rvTotal: rv.length, rvIn: rv.filter(e => e.classList.contains('in')).length,
      stTotal: st.length,
      stIn: st.filter(e => { const o = getComputedStyle(e).opacity; return parseFloat(o) > 0.9; }).length
    };
  });
  report.revealed = `${reveal.rvIn}/${reveal.rvTotal} .rv in`;
  report.stTotal = reveal.stTotal; report.stIn = reveal.stIn;

  // 2 · SVG text bounds, collisions, unresolved <use>
  const svgCheck = await page.evaluate(() => {
    const issues = [], missing = [];
    document.querySelectorAll('use').forEach(u => {
      const href = u.getAttribute('href') || u.getAttribute('xlink:href') || '';
      if (href.startsWith('#') && !document.getElementById(href.slice(1))) missing.push(href);
    });
    document.querySelectorAll('svg[viewBox]').forEach((svg, si) => {
      const vb = svg.viewBox.baseVal; if (!vb || (vb.width === 0 && vb.height === 0)) return;
      const texts = [...svg.querySelectorAll(':scope text')].filter(t => t.closest('svg') === svg);
      const boxes = [];
      texts.forEach(t => {
        let b; try { b = t.getBBox(); } catch (e) { return; }
        if (b.width === 0 && b.height === 0) return;
        // skip transient/hidden elements (animated packets etc.)
        let el = t, hid = false;
        while (el && el !== svg) { const cs = getComputedStyle(el); if (parseFloat(cs.opacity) < 0.05 || el.getAttribute('opacity') === '0') { hid = true; break; } el = el.parentElement; }
        if (hid) return;
        const pad = 2;
        if (b.x < vb.x - pad || b.y < vb.y - pad || b.x + b.width > vb.x + vb.width + pad || b.y + b.height > vb.y + vb.height + pad) {
          issues.push(`svg#${si}: text "${(t.textContent || '').trim().slice(0, 34)}" outside viewBox (${Math.round(b.x)},${Math.round(b.y)},${Math.round(b.width)}x${Math.round(b.height)} vs ${vb.x},${vb.y},${vb.width}x${vb.height})`);
        }
        boxes.push({ b, t: (t.textContent || '').trim().slice(0, 26), hidden: false });
      });
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].b, c = boxes[j].b;
        if (boxes[i].hidden || boxes[j].hidden) continue;
        const ix = Math.max(0, Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x));
        const iy = Math.max(0, Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y));
        const inter = ix * iy, minA = Math.min(a.width * a.height, c.height * c.width);
        if (minA > 0 && inter / minA > 0.30) issues.push(`svg#${si}: text collision "${boxes[i].t}" × "${boxes[j].t}" (${Math.round(inter / minA * 100)}%)`);
      }
    });
    return { issues, missing: [...new Set(missing)] };
  });
  report.svgIssues = svgCheck.issues; report.useMissing = svgCheck.missing;

  // 3 · scrollspy state at bottom
  const spy = await page.evaluate(() => {
    const on = document.querySelector('.nav a.on');
    return on ? (on.getAttribute('data-p') ?? on.getAttribute('href')) : null;
  });
  report.scrollspy = spy;

  // 4 · optional: demo buttons
  if (flags.includes('--demo')) {
    await page.evaluate(() => document.getElementById('svdemo')?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(2500);
    const demo = await page.evaluate(async () => {
      const r = {};
      const gB = document.getElementById('svGB'), gC = document.getElementById('svGC');
      document.getElementById('svBlocked')?.click(); await new Promise(s => setTimeout(s, 300));
      r.blocked = gB?.getAttribute('opacity');
      document.getElementById('svCross')?.click(); await new Promise(s => setTimeout(s, 300));
      r.cross = gC?.getAttribute('opacity');
      document.getElementById('svPlay')?.click(); await new Promise(s => setTimeout(s, 1200));
      r.pktRunning = document.getElementById('svPktReq')?.classList.contains('run');
      return r;
    });
    report.extra.demo = demo;
  }
  // 5 · optional: counters
  if (flags.includes('--counters')) {
    const cnt = await page.evaluate(() => [...document.querySelectorAll('.cnt')].map(c => c.textContent));
    report.extra.counters = cnt;
  }
  // 5b · optional: application form (pages exposing _switchView + #af-submit)
  if (flags.includes('--form')) {
    const form = await page.evaluate(async () => {
      const r = {};
      if (!document.getElementById('af-submit')) return 'no form hooks on this page';
      if (window._switchView) { window._switchView('apply'); await new Promise(s => setTimeout(s, 900)); }
      document.getElementById('af-submit').click(); await new Promise(s => setTimeout(s, 200));
      r.emptyRejected = /missing|ناقصة/.test(document.getElementById('af-note')?.textContent || '');
      const fill = { 'af-name': 'Contract clause finder', 'af-desc': 'Finds clauses in contracts', 'af-owner': 'A. Analyst · Legal · a@moenergy.gov.sa', 'af-sponsor': 'Head of Legal', 'af-lmmail': 'line.manager@moenergy.gov.sa', 'af-budget': '80', 'af-how': 'Cuts review time', 'af-success': 'Review time halved in 90 days', 'af-just': 'Covers workspace compute and storage for the prototype phase', 'af-notes': '' };
      for (const id in fill) { const e = document.getElementById(id); if (e) { e.value = fill[id]; } }
      for (const id of ['af-pillar', 'af-cap', 'af-data', 'af-pii']) { const e = document.getElementById(id); if (e) e.selectedIndex = 1; }
      const stop = ev => { ev.preventDefault(); }; window.addEventListener('beforeunload', stop);
      document.getElementById('af-submit').click(); await new Promise(s => setTimeout(s, 300));
      const href = window._lastMailto || '';
      // v4: mailto direction reversed — To = line manager, SPARK team in CC
      r.mailtoOk = href.startsWith('mailto:line.manager@moenergy.gov.sa');
      r.ccOk = href.includes('cc=SPARK@MoEnergy.gov.sa');
      const body = decodeURIComponent(href.split('&body=')[1] || '');
      r.budgetInBody = /Project budget \(USD, monthly\): 80/.test(body) && /Budget justification/.test(body);
      r.lineManagerInBody = /Line manager \(To\): line\.manager@moenergy\.gov\.sa/.test(body) && /SPARK team \(Cc\): SPARK@MoEnergy\.gov\.sa/.test(body);
      r.hrefLength = href.length;
      return r;
    });
    report.extra.form = form;
    try { await page.screenshot({ path: `${shotsDir}/${name}-form.png` }); } catch (e) { }
  }
  // 5c · optional: chat illustration (pages exposing _switchView + #chatlog)
  if (flags.includes('--chat')) {
    // v4 chat contract: empty first load, tool tiles in #toolzone under the composer,
    // tool click inserts /toolname + helper card, script plays on send
    const chat = await page.evaluate(async () => {
      const r = {};
      const log = document.getElementById('chatlog');
      if (!log) return 'no chat hooks on this page';
      if (window._switchView) window._switchView('action');
      await new Promise(s => setTimeout(s, 1200));
      r.emptyFirstLoad = log.children.length === 0 && !!document.getElementById('chatempty');
      r.toolCards = document.querySelectorAll('#toolzone .tool').length;
      const first = document.querySelector('#toolzone .tool[data-script]');
      first?.click();
      await new Promise(s => setTimeout(s, 300));
      const input = document.getElementById('chatin');
      r.slashInserted = (input?.value || '').startsWith('/');
      r.helperShown = !document.getElementById('toolhelp')?.hidden;
      document.getElementById('chatsend')?.click();
      await new Promise(s => setTimeout(s, 1200));
      r.typingShown = !!document.querySelector('#chatlog .typing');
      await new Promise(s => setTimeout(s, 4800));
      r.typingCleared = !document.querySelector('#chatlog .typing') || undefined;
      r.bubbles = document.querySelectorAll('#chatlog .msg').length;
      return r;
    });
    report.extra.chat = chat;
    try { await page.screenshot({ path: `${shotsDir}/${name}-chat.png` }); } catch (e) { }
    // "Submit your tool" flips to the apply view
    report.extra.chatSubmitFlips = await page.evaluate(async () => {
      if (!document.getElementById('chatnew') || !document.getElementById('v-apply')) return undefined;
      window._switchView('action');
      document.getElementById('chatnew').click(); await new Promise(s => setTimeout(s, 600));
      document.querySelector('#toolzone .tool.submit')?.click();
      await new Promise(s => setTimeout(s, 700));
      return document.getElementById('v-apply').classList.contains('on');
    });
  }
  // 5d · optional: Arabic / RTL pass (pages exposing _setLang)
  if (flags.includes('--lang')) {
    const hasLang = await page.evaluate(() => !!window._setLang);
    if (!hasLang) { report.extra.lang = 'no _setLang on this page'; }
    else {
      await page.evaluate(() => window._setLang('ar'));
      await page.waitForTimeout(700);
      const lang = await page.evaluate(() => {
        const r = { dir: document.documentElement.getAttribute('dir'), lang: document.documentElement.getAttribute('lang'), svgIssues: [] };
        document.querySelectorAll('svg[viewBox]').forEach((svg, si) => {
          const vb = svg.viewBox.baseVal; if (!vb || (vb.width === 0 && vb.height === 0)) return;
          [...svg.querySelectorAll(':scope text')].filter(t => t.closest('svg') === svg).forEach(t => {
            let b; try { b = t.getBBox(); } catch (e) { return; }
            if (b.width === 0 && b.height === 0) return;
            let el = t, hid = false;
            while (el && el !== svg) { const cs = getComputedStyle(el); if (parseFloat(cs.opacity) < 0.05 || el.getAttribute('opacity') === '0') { hid = true; break; } el = el.parentElement; }
            if (hid) return;
            const pad = 2;
            if (b.x < vb.x - pad || b.y < vb.y - pad || b.x + b.width > vb.x + vb.width + pad || b.y + b.height > vb.y + vb.height + pad) {
              r.svgIssues.push(`svg#${si} [ar]: text "${(t.textContent || '').trim().slice(0, 34)}" outside viewBox`);
            }
          });
        });
        return r;
      });
      report.extra.lang = lang;
      try { await page.screenshot({ path: `${shotsDir}/${name}-ar-top.png` }); } catch (e) { }
      await page.evaluate(() => window._setLang('en'));
      await page.waitForTimeout(400);
    }
  }
  // 6 · embedded-mode test
  const wrap = `/tmp/wrap_${name}.html`;
  fs.writeFileSync(wrap, `<!DOCTYPE html><html><body style="margin:0"><iframe src="file://${path.resolve(file)}" style="width:100%;height:100vh;border:0"></iframe></body></html>`);
  const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto('file://' + wrap, { waitUntil: 'load' });
  await p2.waitForTimeout(900);
  report.extra.embedded = await p2.frames()[1]?.evaluate(() => ({
    cls: document.documentElement.classList.contains('embedded'),
    navW: getComputedStyle(document.documentElement).getPropertyValue('--nav-w').trim()
  })).catch(e => 'iframe eval failed: ' + e.message);
  await p2.close();

  // 7 · screenshots of key figures
  const figs = await page.$$('.figbox, .stats, .grid');
  let shot = 0;
  for (const f of figs.slice(0, 14)) {
    try { await f.scrollIntoViewIfNeeded(); await page.waitForTimeout(1300); await f.screenshot({ path: `${shotsDir}/${name}-fig${shot++}.png` }); } catch (e) { }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${shotsDir}/${name}-top.png` });

  report.jsErrors = errors.filter(e => !/ERR_CONNECTION|ERR_NAME|ERR_INTERNET|ERR_ADDRESS|Failed to load resource/.test(e));
  report.netErrors = errors.filter(e => /ERR_CONNECTION|ERR_NAME|ERR_INTERNET|ERR_ADDRESS|Failed to load resource/.test(e));
  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})();
