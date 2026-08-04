# -*- coding: utf-8 -*-
"""v14: moe-notebooklm moves to Other, the shared bucket is split into infra and
cyber, and every project is listed for validation."""
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
css = '''
/* ---- v13: the migration stat strip ---- */
.mstat{display:flex;flex-wrap:wrap;gap:9px;margin:0 0 12px}
.mstat>div{flex:1 1 160px;background:#F4F7FC;border:1px solid #E3E9F2;border-radius:10px;padding:9px 12px}
.mstat b{display:block;font-family:var(--font-display),'Lafet',sans-serif;font-size:19px;font-weight:400;
  line-height:1.15;color:#0E1B2E;white-space:nowrap}
.mstat>div>span{display:block;font-size:10.5px;font-weight:600;color:#5E748E;margin-top:4px;line-height:1.4}
html.is-ar .mstat>div{text-align:right}
'''
anchor = '/* ---- v12 compaction: same content, less scrolling ---- */'
assert s.count(anchor) == 1
s = s.replace(anchor, css + anchor)

# ---- version stamp -------------------------------------------------------
n = s.count('Version v12') + s.count('الإصدار v12')
s = s.replace('Version v12', 'Version v14').replace('الإصدار v12', 'الإصدار v14')
# the Arabic footer line never carried a version
a = '<span class="ar">مجمّع من تقارير الفوترة في GCP · البيانات حتى </span>'
assert s.count(a) == 1
s = s.replace(a, '<span class="ar">الإصدار v14 · مجمّع من تقارير الفوترة في GCP · البيانات حتى </span>')
s = s.replace('3 August 2026', '4 August 2026').replace('3 أغسطس 2026', '4 أغسطس 2026')
print('version stamps bumped:', n + 1)

open(DASH, 'w', encoding='utf-8').write(s)
print('%.2f MB -> %.2f MB' % (before/1e6, len(s)/1e6))
