# -*- coding: utf-8 -*-
"""Generate a dashboard period block (donut, legend, table, figures) from a
Reports-by-service CSV. Geometry reverse-engineered from the published July view."""
import csv, math, os, glob

PAL = ['#0180E9', '#E85A30', '#00A3A8', '#7C5CBF']
OTHER = '#8B96AC'
CX, CY, R, SW = 180, 150, 128, 38
GAP_DEG = math.degrees(2.4 / R)          # 2.4px of arc at the stroke centre
LABEL_MIN = 0.03                          # below this a slice gets no on-slice percent

SHORT = {
    'F5 BIG-IP BEST with IPI and Threat Campaigns (PAYG, 1Gbps)': 'F5 BIG-IP Security',
    'FortiGate Next-Generation Firewall (PAYG)': 'FortiGate Security',
    'Cloud Key Management Service (KMS)': 'Cloud KMS',
    'Trial for service fortigate-payg-fortigcp-project-001.cloudpartnerservices.goog': 'FortiGate trial',
}

def read(path):
    rows = []
    with open(path, encoding='utf-8-sig', newline='') as f:
        for r in csv.DictReader(f):
            n = (r.get('Service description') or '').strip()
            if not n: continue
            num = lambda k: float((r.get(k) or '0').replace(',', '') or 0)
            g, v = round(num('List cost ($)'), 2), round(num('Subtotal ($)'), 2)
            if abs(g) < 0.005: g = 0.0
            if abs(v) < 0.005: v = 0.0
            rows.append(dict(name=n, gross=g, net=v,
                             chg=(r.get('Percent change in subtotal compared to previous period') or '').strip()))
    return rows

def merge(paths):
    """Sum several months into one period, keeping per-service totals."""
    acc = {}
    for p in paths:
        for r in read(p):
            a = acc.setdefault(r['name'], dict(name=r['name'], gross=0.0, net=0.0, chg=''))
            a['gross'] += r['gross']; a['net'] += r['net']
    for a in acc.values():
        a['gross'] = round(a['gross'], 2); a['net'] = round(a['net'], 2)
        if abs(a['gross']) < 0.005: a['gross'] = 0.0
        if abs(a['net']) < 0.005: a['net'] = 0.0
    return list(acc.values())

FX = 3.75          # SAR per USD, the official peg the Ministry reports at

def num(v, dp=None, fx=True):
    """the figure alone, no currency mark"""
    if fx: v = v * FX
    if abs(v) < 0.005: v = 0.0
    if dp is None: dp = 2 if abs(v) < 1000 else 0
    return format(round(v, dp), ',.%df' % dp)

def money(v, dp=None, fx=True):
    """figure with the Riyal mark in front, for HTML"""
    return '<span class="rs" aria-hidden="true"></span>' + num(v, dp, fx)

def pt(deg):
    a = math.radians(deg)
    return (CX + R * math.sin(a), CY - R * math.cos(a))

def donut(parts, centre_label=None, centre_value=None):
    """parts: list of (name, net, share, colour)"""
    out = ['<circle cx="%d" cy="%d" fill="none" r="%d" stroke="#E9EDF3" stroke-width="%d"></circle>'
           % (CX, CY, R, SW)]
    cum = 0.0
    for name, net, share, col in parts:
        a0, a1 = cum * 360 + GAP_DEG, (cum + share) * 360 - GAP_DEG
        cum += share
        if a1 <= a0: continue
        x0, y0 = pt(a0); x1, y1 = pt(a1)
        large = 1 if (a1 - a0) > 180 else 0
        out.append('<path d="M%.1f %.1f A%d %d 0 %d 1 %.1f %.1f" fill="none" stroke="%s" stroke-width="%d">'
                   '<title>%s: %s (%d%%)</title></path>'
                   % (x0, y0, R, R, large, x1, y1, col, SW, esc(name), num(net, 2), round(share * 100)))
        if share >= LABEL_MIN:
            mx, my = pt((a0 + a1) / 2)
            # a narrow slice gets a smaller figure so it stays inside the band
            fs = 15 if share >= .12 else (12.5 if share >= .06 else 10.5)
            out.append('<text fill="#fff" font-size="%s" font-weight="700" text-anchor="middle" '
                       'x="%.1f" y="%.1f">%s</text>'
                       % (fs, mx, my + fs * .37, _pct(share * 100)))
    return out

def chg_cell(chg, y):
    if chg in ('', 'n/a'):
        return ('<text fill="#75849A" font-size="11" font-weight="700" text-anchor="end" '
                'x="916" y="%d">n/a</text>' % y)
    if chg == 'New':
        return ('<text fill="#75849A" font-size="11" font-weight="700" text-anchor="end" '
                'x="916" y="%d">New</text>' % y)
    try: v = float(chg.replace('%', '').replace(',', ''))
    except ValueError:
        return ('<text fill="#75849A" font-size="11" font-weight="700" text-anchor="end" '
                'x="916" y="%d">%s</text>' % (y, esc(chg)))
    if v > 0:   col, txt = '#C0341C', '&#8593; %s' % fmtpct(v)
    elif v < 0: col, txt = '#087F7C', '&#8595; %s' % fmtpct(abs(v))
    else:       col, txt = '#75849A', '0%'
    return ('<text aria-label="Change versus previous period: %s" fill="%s" font-size="11" '
            'font-weight="700" text-anchor="end" x="916" y="%d">%s</text>' % (esc(chg), col, y, txt))

def fmtpct(v):
    return ('%d%%' % round(v)) if abs(v) >= 1 else ('%.1f%%' % v)

def legend(parts, share_bar=496):
    out = ['<text fill="#75849A" font-size="9.5" font-weight="700" letter-spacing=".08em" '
           'text-anchor="end" x="812" y="52.0">NET &#183; SHARE</text>',
           '<text fill="#75849A" font-size="9.5" font-weight="700" letter-spacing=".08em" '
           'text-anchor="end" x="916" y="52.0">VS PRIOR</text>']
    chgs = []
    for i, (name, net, share, col) in enumerate(parts):
        y = 70 + i * 40
        disp = SHORT.get(name, name)
        aria = ' aria-label="%s"' % esc(disp) if disp != name else ''
        out.append('<rect fill="%s" height="12" rx="3" width="12" x="400" y="%d"></rect>' % (col, y))
        out.append('<text%s fill="#0E1B2E" font-size="13" font-weight="600" x="420" y="%d">%s</text>'
                   % (aria, y + 10, esc(disp)))
        out.append('<text fill="#0E1B2E" font-size="12.5" font-weight="700" text-anchor="end" '
                   'x="812" y="%d">%s &#183; %d%%</text>' % (y + 10, money(net), round(share * 100)))
        out.append('<rect fill="#E9EDF3" height="4" rx="2" width="%d" x="420" y="%d"></rect>' % (share_bar, y + 17))
        out.append('<rect fill="%s" height="4" rx="2" width="%.1f" x="420" y="%d"></rect>'
                   % (col, share_bar * share, y + 17))
        chgs.append((name, y + 10))
    return out, chgs

def esc(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;'))

def compose(rows, centre_label, centre_value, top=4):
    rows = sorted(rows, key=lambda r: -r['net'])
    net = sum(r['net'] for r in rows)
    head, tail = rows[:top], rows[top:]
    parts = [(r['name'], r['net'], (r['net'] / net if net else 0), PAL[i]) for i, r in enumerate(head)]
    if tail:
        parts.append(('Other (%d services)' % len(tail), sum(r['net'] for r in tail),
                      (sum(r['net'] for r in tail) / net if net else 0), OTHER))
    svg = ['<svg aria-label="Composition of net spend" role="img" viewbox="0 0 920 300">']
    svg += donut(parts, centre_label, centre_value)
    leg, chgs = legend(parts)
    svg += leg
    for i, (name, y) in enumerate(chgs):
        src = head[i]['chg'] if i < len(head) else 'n/a'
        svg.append(chg_cell(src, y))
    svg.append('</svg>')
    return '\n'.join(svg), parts

def table(rows):
    rows = sorted(rows, key=lambda r: -r['gross'])
    body = []
    for r in rows:
        body.append('<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
                    % (esc(r['name']), format(round(r['gross'] * FX, 2), ',.2f'),
                       format(round(r['net'] * FX, 2), ',.2f'), esc(r['chg'] or 'n/a')))
    return '\n'.join(body)


# ---------------------------------------------------------------- bar chart
# The form the earlier build used: name over a full-width track, the bar drawn
# to its share of the leader, value and change on the right. HTML rather than
# SVG so the Riyal mark is the same token as everywhere else on the page.
def bars(rows, top=6):
    rows = sorted(rows, key=lambda r: -r['net'])
    net = sum(r['net'] for r in rows)
    head, tail = rows[:top], rows[top:]
    items = [(r['name'], r['net'], r['chg']) for r in head]
    if tail:
        items.append(('Other (%d services)' % len(tail), sum(r['net'] for r in tail), 'n/a'))
    peak = max([abs(v) for _, v, _ in items] + [1])
    out = ['<div class="bars">']
    for i, (name, v, chg) in enumerate(items):
        share = (v / net * 100) if net else 0
        col = PAL[i] if i < len(PAL) else ('#8B96AC' if name.startswith('Other') else '#5B7AA8')
        out.append('<div class="bar-row">'
                   '<div class="bar-head">'
                   '<span class="bar-name">%s</span>'
                   '<span class="bar-val">%s</span>'
                   '<span class="bar-share">%s</span>'
                   '<span class="bar-chg">%s</span>'
                   '</div>'
                   '<div class="bar-track"><i style="width:%.1f%%;background:%s"></i></div>'
                   '</div>'
                   % (esc(SHORT.get(name, name)), money(v), _pct(share), _chg_html(chg),
                      max(abs(v) / peak * 100, 0.6), col))
    out.append('</div>')
    return '\n'.join(out)

def _pct(p):
    if 0 < p < 0.1: return '&lt;0.1%'      # a real slice, too small to round to
    return ('%.1f%%' % p) if 0 < p < 1 else ('%d%%' % round(p))

def _chg_html(chg):
    if chg in ('', 'n/a'):  return '<span class="flat">n/a</span>'
    if chg == 'New':        return '<span class="flat">New</span>'
    try: v = float(chg.replace('%', '').replace(',', ''))
    except ValueError: return '<span class="flat">%s</span>' % esc(chg)
    if v > 0:   return '<span class="up">&#8593; %s</span>' % fmtpct(v)
    if v < 0:   return '<span class="down">&#8595; %s</span>' % fmtpct(abs(v))
    return '<span class="flat">0%</span>'

# ---------------------------------------------------------------- donut only
def donut_chart(parts, centre_label, centre_value):
    """arcs plus a centre figure; the readout lives in an HTML legend beside it"""
    svg = ['<svg aria-label="Share of net spend" role="img" viewbox="26 -4 308 308">']
    svg += donut(parts)
    svg.append('</svg>')
    return ('<div class="dchart">' + '\n'.join(svg)
            + '<div class="dcentre"><span class="dc-lab">' + centre_label + '</span>'
            + '<span class="dc-val">' + centre_value + '</span></div></div>')

def donut_legend(parts, with_share=True):
    out = ['<ul class="dleg">']
    for name, v, share, col in parts:
        out.append('<li><span class="dot" style="background:%s"></span>'
                   '<span class="dl-name">%s</span>'
                   '<span class="dl-val">%s</span>'
                   '<span class="dl-share">%s</span></li>'
                   % (col, esc(SHORT.get(name, name)), money(v), _pct(share * 100)))
    out.append('</ul>')
    return '\n'.join(out)
