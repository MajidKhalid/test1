# -*- coding: utf-8 -*-
"""v20: the two-up summary bar survives a narrow preview pane. SharePoint's file
preview reports well under 1100px on a scaled display, which tripped the old
stacking breakpoint and left the blade stranded on the left."""
import re, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen, blocks

DASH = '/home/user/test1/finops/FinOps_Dashboard.html'
s = open(DASH, encoding='utf-8').read(); before = len(s)
J = os.path.join(blocks.B, 'July')
JS = lambda f: os.path.join(J, 'by service', f)
JP = lambda f: os.path.join(J, 'SPARK', f)
MO = 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-07-01 #U2014 2026-07-31.csv'
H1 = 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-01-01 #U2014 2026-06-30 (1).csv'
TD = 'cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2025-10-01 #U2014 2026-08-31.csv'

def span(t, i, tag='div'):
    d = 0
    for m in re.finditer(r'<%s\b|</%s>' % (tag, tag), t[i:i+900000]):
        d += -1 if m.group(0).startswith('</') else 1
        if d == 0: return i + m.end()
    raise ValueError
def section(t, c):
    i = t.index('<section class="view %s">' % c); return i, span(t, i, 'section')
def mfig(v):
    a = v.index('class="mfig-card"'); a = v.rindex('<', 0, a); return v[a:span(v, a)]
def qsum(ms, k): return gen.merge([blocks.csvs(m, k) for m in ms])
def chg_vs(cur, prev):
    pm = {r['name']: r['net'] for r in prev} if prev else None
    for r in cur:
        if pm is None: r['chg'] = 'n/a'; continue
        p = pm.get(r['name'])
        if p is None: r['chg'] = 'New'
        elif abs(p) < 0.005: r['chg'] = 'New' if r['net'] > 0 else '0%'
        else: r['chg'] = '%d%%' % round((r['net'] - p) / p * 100)
    return cur

months = [('jul', gen.read(JS(MO)), gen.read(JP(MO)), 'July 2026', 'يوليو 2026')]
for k, f, en, ar in blocks.MONTHS[::-1]:
    months.append((k, gen.read(blocks.csvs(f, 'by service')), gen.read(blocks.csvs(f, 'Sandbox_SPARK')), en, ar))
q1g = qsum(['January','February','March'], 'by service'); q2g = qsum(['April','May','June'], 'by service')
q1s = qsum(['January','February','March'], 'Sandbox_SPARK'); q2s = qsum(['April','May','June'], 'Sandbox_SPARK')
chg_vs(q1g, None); chg_vs(q1s, None); chg_vs(q2g, q1g); chg_vs(q2s, q1s)
quarters = [('h1', gen.read(JS(H1)), gen.read(JP(H1)), 'H1 2026', 'النصف الأول 2026'),
            ('q2', q2g, q2s, 'Q2 2026', 'الربع الثاني 2026'),
            ('q1', q1g, q1s, 'Q1 2026', 'الربع الأول 2026')]
todate = [('td', gen.read(JS(TD)), gen.read(JP(TD)), 'October 2025 to July 2026', 'أكتوبر 2025 إلى يوليو 2026')]

def rebuild(view, specs, single=False):
    head = view[:view.index('>')+1]; card = mfig(view); tops = []; bodies = []
    for k, g, sb, en, ar in specs:
        t, b = blocks.build(g, sb, k, en, ar)
        if single:
            t = re.sub(r'^<div class="mv mv-\w+">', '<div>', t); b = re.sub(r'^<div class="mv mv-\w+">', '<div>', b)
        tops.append(t); bodies.append(b)
    return head + ''.join(tops) + card + ''.join(bodies) + '</section>'

for cls, specs, single in [('v-m', months, False), ('v-q', quarters, False), ('v-t', todate, True)]:
    i, j = section(s, cls); s = s[:i] + rebuild(s[i:j], specs, single) + s[j:]
    print('%s rebuilt: %d' % (cls, len(specs)))

# ---- the migration stat strip -------------------------------------------
css = ''
anchor = '/* ---- v12 compaction: same content, less scrolling ---- */'
assert s.count(anchor) == 1
s = s.replace(anchor, css + anchor)

# ---- the hero chip row: drop the version, put the mark on the currency ----
chip = ('<span class="chip"><span class="en">Version v12</span>'
        '<span class="ar">الإصدار v12</span></span>')
assert s.count(chip) == 1
s = s.replace(chip, '')
cur = ('<span class="chip"><span class="en">All figures SAR</span>'
       '<span class="ar">جميع المبالغ بالريال السعودي</span></span>')
assert s.count(cur) == 1
s = s.replace(cur, '<span class="chip"><span class="en">All figures in '
                   '<span class="rs" aria-hidden="true"></span></span>'
                   '<span class="ar">جميع المبالغ بـ<span class="rs" aria-hidden="true"></span></span></span>')

# ---- version stamp: footer only -----------------------------------------
n = s.count('Version v12') + s.count('الإصدار v12')
s = s.replace('Version v12', 'Version v20').replace('الإصدار v12', 'الإصدار v20')
# the Arabic footer line never carried a version
a = '<span class="ar">مجمّع من تقارير الفوترة في GCP · البيانات حتى </span>'
assert s.count(a) == 1
s = s.replace(a, '<span class="ar">الإصدار v20 · مجمّع من تقارير الفوترة في GCP · البيانات حتى </span>')
s = s.replace('3 August 2026', '4 August 2026').replace('3 أغسطس 2026', '4 أغسطس 2026')
print('version stamps bumped:', n + 1)

# the scripted print line said "All figures SAR"; the CSS fallback never did,
# and the currency is stated by the chip now
old = "`Reporting period: ${periodLabel[resolved]} \u00b7 All figures SAR`"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, "`Reporting period: ${periodLabel[resolved]}`")

# ---- the credit card moves above the period switch -----------------------
# It is contract position as at the data date, the same in every view, so it does
# not belong under a period selector. One copy goes into the hero; the three
# per-view copies go away.
card = None
while 'class="mfig-card"' in s:
    a = s.index('class="mfig-card"'); a = s.rindex('<', 0, a)
    b = span(s, a)
    if card is None:
        card = s[a:b]
    s = s[:a] + s[b:]
assert card is not None
# the description paragraph moves below the consumption bar, so give it a class
desc = '<div style="font:400 11.5px/1.45 \'IBM Plex Sans Arabic\',\'Segoe UI\',sans-serif;color:#454f65;max-width:470px;">'
assert card.count(desc) == 1
card = card.replace(desc, desc.replace('<div ', '<div class="mfig-desc" '))

# The card was drawn as a light panel for a light page. It now sits on the navy
# hero, so its inline colours are remapped to the hero's own dark glass. Inline
# styles would beat a stylesheet rule, so the values are rewritten in place.
surfaces = [
  ('background:#ffffff;border:1px solid #d6dce6;',
   'background:linear-gradient(180deg,rgba(255,255,255,.085),rgba(255,255,255,.035));'
   'border:1px solid rgba(255,255,255,.17);backdrop-filter:blur(16px) saturate(140%);'
   '-webkit-backdrop-filter:blur(16px) saturate(140%);'),
  ('border-top:1px solid #d6dce6;background:#ffffff;',
   'border-top:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);'),
  ('background:#f5f7fa;border-inline-start:1px solid #d6dce6;',
   'background:rgba(255,255,255,.055);border-inline-start:1px solid rgba(255,255,255,.14);'),
]
for a, b in surfaces:
    assert card.count(a) == 1, (a, card.count(a))
    card = card.replace(a, b)
ink = [('#081631', '#EEF4FF'),                  # headline ink
       ('#454f65', 'rgba(228,238,255,.78)'),    # body
       ('#616d86', 'rgba(228,238,255,.7)'),     # muted labels
       ('#00646a', '#5FD3C8'),                  # teal eyebrow and the live PO
       ('#8b96ac', 'rgba(228,238,255,.6)'),     # spent dots and strike-through
       ('#0b8f92', '#3FC4BC'),                  # the eyebrow dashes
       ('#d6dce6', 'rgba(255,255,255,.14)')]    # dividers
for a, b in ink:
    card = card.replace(a, b)
anchor2 = '<div aria-label="Reporting period" class="sw" role="radiogroup">'
assert s.count(anchor2) == 1
s = s.replace(anchor2, '<div class="mfig-hero">' + card + '</div>' + anchor2)
print('credit card moved into the hero')

layout_css = """
/* ---- v16: the credit card sits above the period switch ---- */
.mfig-hero{margin:18px 0 14px;position:relative;z-index:2}
.mfig-hero .mfig-card{margin:0!important;box-shadow:0 30px 70px -40px rgba(0,0,0,.85)!important}
/* v17: on the navy hero the meter and its caption go dark too */
.mfig-hero .mfig-meter .meter{background:rgba(255,255,255,.17)}
.mfig-hero .meter-cap{color:rgba(228,238,255,.74)}
/* the period strip spans the same width as the card above it */
.hero .sw{width:100%!important}

/* ---- v20: keep the summary bar two-up in a narrow preview pane ----
   The original breakpoint stacked it below 1100px. SharePoint's preview iframe
   reports well under that on a scaled display, so the two halves stacked and the
   56px divider was left at the start edge. Two columns now hold down to 640px,
   which is the width at which the pair genuinely stops fitting. Selectors are
   specific enough to beat the compaction block whatever the source order. */
@media (min-width:641px){
  .summary-bar{grid-template-columns:minmax(0,1fr) 56px minmax(0,1fr)!important;gap:0!important}
  .summary-bar>.summary-divider{width:56px!important;height:auto!important;align-self:stretch!important}
  .summary-bar>.summary-divider>.summary-blade{width:8px!important;height:76px!important;
    transform:skewX(-15deg)!important}
}
@media (max-width:640px){
  .summary-bar{grid-template-columns:1fr!important;gap:14px!important}
  .summary-bar>.summary-divider{width:auto!important;height:30px!important}
  .summary-bar>.summary-divider>.summary-blade{width:8px!important;height:34px!important;
    transform:rotate(90deg) skewX(-15deg)!important}
}
/* print: backdrop-filter does not render and background graphics may be off, so
   the glass falls back to solid navy panels that carry the light ink */
@media print{
  .mfig-hero .mfig-card{background:#0d2044!important;backdrop-filter:none!important;
    -webkit-backdrop-filter:none!important;box-shadow:none!important;
    -webkit-print-color-adjust:exact;print-color-adjust:exact}
  .mfig-side{background:#152a52!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .mfig-foot{background:#0d2044!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .mfig-hero .mfig-meter .meter{background:#2b3f63!important;
    -webkit-print-color-adjust:exact;print-color-adjust:exact}
}
/* credit sources on the leading edge, the main figure after it */
.mfig-row{flex-direction:row-reverse!important}
.mfig-side{border-inline-start:0!important;border-inline-end:1px solid rgba(255,255,255,.14)!important;
  width:292px!important;flex:0 0 292px!important}
/* the description reads after the bar it describes */
.mfig-desc{order:2;max-width:660px!important}
.mfig-meter{order:1;margin-top:8px!important;max-width:none!important}
@media(max-width:820px){
  .mfig-row{flex-direction:column!important}
  .mfig-side{width:auto!important;flex:1 1 auto!important;
    border-inline-end:0!important;border-bottom:1px solid rgba(255,255,255,.14)!important;
    border-top-color:rgba(255,255,255,.14)!important}
}
"""
s = s.replace('/* ---- v12 compaction: same content, less scrolling ---- */', layout_css + '/* ---- v12 compaction: same content, less scrolling ---- */')

open(DASH, 'w', encoding='utf-8').write(s)
print('%.2f MB -> %.2f MB' % (before/1e6, len(s)/1e6))
