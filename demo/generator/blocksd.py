# -*- coding: utf-8 -*-
"""Period blocks for the shareable retail demo. Same shapes as the original
report (summary bar, donut with legend, ranked bars, details tables, highlights),
with retail copy in English and Arabic and no reference to the source project."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__)))), 'finops', 'generator'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen, data

gen.FX = 1.0            # the demo reports in the currency it is given, no conversion
gen.SHORT = {}          # no long service names to shorten here


def tw(en, ar):
    return '<span class="en">%s</span><span class="ar">%s</span>' % (en, ar)


def m0(v):
    return gen.money(v, 0)


def m2(v):
    return gen.money(v, 2)


# ---------------------------------------------------------------- charts
def bars(rows, top=6):
    """gen.bars, with a bilingual name on every row."""
    rows = sorted(rows, key=lambda r: -r['net'])
    net = sum(r['net'] for r in rows)
    head, tail = rows[:top], rows[top:]
    items = [(tw(gen.esc(r['name']), gen.esc(r['name_ar'])), r['net'], r['chg']) for r in head]
    if tail:
        items.append((tw('Other (%d categories)' % len(tail), 'أخرى (%d فئات)' % len(tail)),
                      sum(r['net'] for r in tail), 'n/a'))
    peak = max([abs(v) for _, v, _ in items] + [1])
    out = ['<div class="bars">']
    for i, (name, v, chg) in enumerate(items):
        share = (v / net * 100) if net else 0
        col = gen.PAL[i] if i < len(gen.PAL) else ('#8B96AC' if i >= len(head) else '#5B7AA8')
        out.append('<div class="bar-row"><div class="bar-head">'
                   '<span class="bar-name">%s</span><span class="bar-val">%s</span>'
                   '<span class="bar-share">%s</span><span class="bar-chg">%s</span></div>'
                   '<div class="bar-track"><i style="width:%.1f%%;background:%s"></i></div></div>'
                   % (name, m0(v), gen._pct(share), gen._chg_html(chg),
                      max(abs(v) / peak * 100, 0.6), col))
    out.append('</div>')
    return '\n'.join(out)


def table(rows):
    body = []
    for r in sorted(rows, key=lambda x: -x['gross']):
        body.append('<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
                    % (tw(gen.esc(r['name']), gen.esc(r['name_ar'])),
                       gen.num(r['gross'], 2), gen.num(r['net'], 2), gen.esc(r['chg'] or 'n/a')))
    return '\n'.join(body)


def det(rows):
    return ('<details><summary>' + tw('View details', 'عرض التفاصيل') +
            '<span aria-hidden="true" class="detail-icon">&#8599;</span></summary><h4>' +
            tw('Category list &#183; gross sales before discounts',
               'قائمة الفئات &#183; إجمالي المبيعات قبل الخصومات') +
            '</h4><div class="cw" style="margin-top:16px"><table><thead><tr><th>' +
            tw('Category', 'الفئة') + '</th><th>' +
            tw('Gross before discounts <span class="rs"></span>',
               'الإجمالي قبل الخصومات <span class="rs"></span>') + '</th><th>' +
            tw('Net after discounts <span class="rs"></span>',
               'الصافي بعد الخصومات <span class="rs"></span>') + '</th><th>' +
            tw('Change vs previous', 'التغير عن الفترة السابقة') +
            '</th></tr></thead><tbody>' + table(rows) + '</tbody></table></div></details>')


# ---------------------------------------------------------------- section 01
def summary(net, gross, enet, egross):
    disc, edisc = gross - net, egross - enet
    share = (enet / net * 100) if net else 0
    ps = ('%.1f%%' % share) if share < 1 else ('%d%%' % round(share))
    return ('<div aria-label="Key sales figures" class="summary-bar" role="group">'
      '<div class="summary-half summary-half--gcp">'
        '<div class="summary-kicker">%s</div><div class="summary-value">%s</div>'
        '<div class="summary-label">%s</div><div class="summary-sub">%s</div>'
        '<div class="summary-note">%s</div></div>'
      '<div aria-hidden="true" class="summary-divider"><span class="summary-blade"></span></div>'
      '<div class="summary-half summary-half--sandbox">'
        '<div class="summary-kicker">%s</div><div class="summary-value">%s</div>'
        '<div class="summary-label">%s</div><div class="summary-sub">%s</div>'
        '<div class="summary-note">%s</div></div></div>') % (
      tw('Total net sales', 'إجمالي صافي المبيعات'), m0(net),
      tw('Net sales', 'صافي المبيعات'),
      tw('Gross sales before discounts: <bdi>%s</bdi>' % m0(gross),
         'إجمالي المبيعات قبل الخصومات: <bdi>%s</bdi>' % m0(gross)),
      tw('Discounts and returns: <bdi>%s</bdi> &#183; All amounts in US dollars.' % m0(disc),
         'الخصومات والمرتجعات: <bdi>%s</bdi> &#183; جميع المبالغ بالدولار الأمريكي.' % m0(disc)),
      tw('E-commerce net sales', 'صافي مبيعات التجارة الإلكترونية'), m0(enet),
      tw('Net sales', 'صافي المبيعات'),
      tw('Gross sales before discounts: <bdi>%s</bdi>' % m0(egross),
         'إجمالي المبيعات قبل الخصومات: <bdi>%s</bdi>' % m0(egross)),
      tw('Discounts and returns: <bdi>%s</bdi> &#183; %s of total net sales.' % (m0(edisc), ps),
         'الخصومات والمرتجعات: <bdi>%s</bdi> &#183; أي %s من إجمالي صافي المبيعات.' % (m0(edisc), ps)))


# ---------------------------------------------------------------- section 02a
CH_METHOD = ('<p class="note">' + tw(
    'Every order is assigned to the channel it was placed in, read from the order source on the sales '
    'ledger, so nothing is estimated. Retail stores covers the owned store estate. E-commerce covers the '
    'web store and the mobile app. Wholesale covers partner accounts invoiced on contract. Marketplaces '
    'covers orders fulfilled through third-party platforms, net of their commission.',
    'يُنسب كل طلب إلى القناة التي تم الشراء من خلالها، وفق مصدر الطلب في سجل المبيعات، دون أي تقدير. '
    'وتشمل المتاجر شبكة الفروع المملوكة، وتشمل التجارة الإلكترونية المتجر الإلكتروني وتطبيق الجوال، '
    'ويشمل البيع بالجملة حسابات الشركاء المفوترة بعقود، وتشمل المنصات الخارجية الطلبات المنفذة عبر '
    'منصات الطرف الثالث بعد خصم عمولاتها.') + '</p>')


def channel_card(channels, net, period_en, period_ar):
    tot = sum(v for _, v in channels) or 1
    ordered = sorted(channels, key=lambda kv: -kv[1])
    parts = [(data.CH_NAMES[k][0], v, v / tot, data.CH_PAL[k]) for k, v in ordered]
    svg = gen.donut_chart(parts, tw('TOTAL NET SALES', 'إجمالي صافي المبيعات'), m0(net))
    leg = ['<ul class="dleg">']
    for k, v in ordered:
        en, ar = data.CH_NAMES[k]
        leg.append('<li><span class="dot" style="background:%s"></span>'
                   '<span class="dl-name">%s</span><span class="dl-val">%s</span>'
                   '<span class="dl-share">%s</span></li>'
                   % (data.CH_PAL[k], tw(gen.esc(en), gen.esc(ar)), m0(v), gen._pct(v / tot * 100)))
    leg.append('</ul>')
    return ('<div class="card"><h3>' + tw('Net sales by channel', 'صافي المبيعات حسب القناة') + '</h3>'
            + '<div class="dwrap">' + svg + '\n'.join(leg) + '</div>'
            + CH_METHOD + channel_detail(channels)
            + channel_highlight(channels, period_en, period_ar) + '</div>')


def channel_detail(channels):
    body = []
    for ch, en, ar, kind, v in data.entities(channels):
        cen, car = data.CH_NAMES[ch]
        ken, kar = data.KIND_NAMES[kind]
        body.append('<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
                    % (tw(gen.esc(en), gen.esc(ar)), tw(gen.esc(cen), gen.esc(car)),
                       tw(ken, kar), gen.num(v, 2)))
    return ('<details><summary>' + tw('View details', 'عرض التفاصيل') +
            '<span aria-hidden="true" class="detail-icon">&#8599;</span></summary><h4>' +
            tw('Every selling entity, its channel and what it is',
               'كل منفذ بيع وقناته وطبيعته') +
            '</h4><div class="cw" style="margin-top:16px"><table><thead><tr><th>' +
            tw('Selling entity', 'منفذ البيع') + '</th><th>' + tw('Channel', 'القناة') + '</th><th>' +
            tw('Type', 'النوع') + '</th><th>' +
            tw('Net sales <span class="rs"></span>', 'صافي المبيعات <span class="rs"></span>') +
            '</th></tr></thead><tbody>' + '\n'.join(body) + '</tbody></table></div></details>')


def channel_highlight(channels, period_en, period_ar):
    tot = dict(channels)
    ents = {en: v for _, en, _ar, _k, v in data.entities(channels)}
    app = ents.get('Mobile app', 0.0)
    ecom = tot[data.ECOM]
    stores_share = gen._pct(tot[data.STORES] / sum(tot.values()) * 100)
    share = gen._pct(app / ecom * 100) if ecom else '0%'
    en = ('Stores still carry %s of net sales for %s. Of the %s e-commerce carries, %s (%s) came '
          'through the mobile app, which is the fastest growing route to the customer.'
          % (stores_share, period_en, m0(ecom), m0(app), share))
    ar = ('لا تزال المتاجر تستحوذ على %s من صافي المبيعات خلال %s. ومن أصل %s للتجارة الإلكترونية، '
          'جاء %s (%s) عبر تطبيق الجوال، وهو أسرع القنوات نمواً في الوصول إلى العميل.'
          % (stores_share, period_ar, m0(ecom), m0(app), share))
    return '<div class="insight"><b>' + tw('Who sells what:', 'من يبيع ماذا:') + '</b> ' + tw(en, ar) + '</div>'


# ---------------------------------------------------------------- highlights
NOTE = ('<p class="note">' + tw(
    'Net sales are stated after discounts, returns and loyalty redemptions, and after marketplace '
    'commission where it applies. All amounts are in US dollars. Every figure in this build is '
    'synthetic sample data, created to demonstrate the report format.',
    'يُحتسب صافي المبيعات بعد الخصومات والمرتجعات ونقاط الولاء المستبدلة، وبعد عمولات المنصات '
    'الخارجية حيثما تنطبق. وجميع المبالغ بالدولار الأمريكي. وكل رقم في هذه النسخة بيانات '
    'افتراضية أُنشئت لعرض شكل التقرير فقط.') + '</p>')


def highlight(rows, period_en, period_ar):
    net = sum(r['net'] for r in rows)
    best, bestv = None, None
    for r in rows:
        if not net or r['net'] / net < 0.03: continue
        try: v = float((r['chg'] or '').replace('%', '').replace(',', ''))
        except ValueError: continue
        if v > 0 and (bestv is None or v > bestv): best, bestv = r, v
    if best is not None:
        en = ('Watch %s: net sales of %s for %s, up %s%% on the previous period. Check whether the '
              'lift holds once the promotion calendar normalises, and whether stock cover follows it.'
              % (best['name'], m0(best['net']), period_en, format(int(round(bestv)), ',d')))
        ar = ('راقب فئة %s: بلغ صافي مبيعاتها %s خلال %s بارتفاع %s%% عن الفترة السابقة. ويُنصح '
              'بالتحقق من استمرار هذا الارتفاع بعد انتهاء موسم العروض، ومن مواكبة التغطية المخزنية له.'
              % (best['name_ar'], m0(best['net']), period_ar, format(int(round(bestv)), ',d')))
    else:
        top = sorted(rows, key=lambda r: -r['net'])[:3]
        share = sum(r['net'] for r in top) / net if net else 0
        en = 'Concentration: %s carry %d%% of net sales for %s.' % (
            ', '.join(r['name'] for r in top), round(share * 100), period_en)
        ar = 'التركّز: تستحوذ %s على %d%% من صافي المبيعات خلال %s.' % (
            '، '.join(r['name_ar'] for r in top), round(share * 100), period_ar)
    return '<div class="insight"><b>' + tw('Key highlight:', 'أبرز ملاحظة:') + '</b> ' + tw(en, ar) + '</div>'


def ecom_highlight(erows, enet, net, period_en, period_ar):
    share = (enet / net * 100) if net else 0
    ps = ('%.1f%%' % share) if share < 1 else ('%d%%' % round(share))
    top = sorted(erows, key=lambda r: -r['net'])[0]
    tshare = gen._pct(top['net'] / enet * 100) if enet else '0%'
    en = ('E-commerce net sales of %s for %s are %s of the total. %s alone is %s of the channel, so '
          'its availability and delivery promise set what the channel can do next.'
          % (m0(enet), period_en, ps, top['name'], tshare))
    ar = ('بلغ صافي مبيعات التجارة الإلكترونية %s خلال %s، أي %s من الإجمالي. وتستحوذ فئة %s وحدها '
          'على %s من مبيعات القناة، ولذلك يحدد توافرها ووعد التسليم الخاص بها سقف نمو القناة.'
          % (m0(enet), period_ar, ps, top['name_ar'], tshare))
    return '<div class="insight"><b>' + tw('Key highlight:', 'أبرز ملاحظة:') + '</b> ' + tw(en, ar) + '</div>'


# ---------------------------------------------------------------- the period
def build(spec, single=False):
    rows, erows, channels = spec['rows'], spec['ecom'], spec['channels']
    net = sum(r['net'] for r in rows); gross = sum(r['gross'] for r in rows)
    enet = sum(r['net'] for r in erows); egross = sum(r['gross'] for r in erows)
    pen, par = spec['en'], spec['ar']
    share = (enet / net * 100) if net else 0
    ps = ('%.1f%%' % share) if share < 1 else ('%d%%' % round(share))
    open_ = '<div>' if single else '<div class="mv mv-%s">' % spec['key']

    top = (open_
      + '<div class="kick">' + tw('01 &#183; Key figures &#183; ', '01 &#183; المؤشرات الرئيسية &#183; ')
      + tw('<bdi>%s</bdi>' % pen, '<bdi>%s</bdi>' % par) + '</div>'
      + summary(net, gross, enet, egross) + '</div>')

    body = (open_
      + '<div class="kick">' + tw('02 &#183; Sales performance &#183; ', '02 &#183; أداء المبيعات &#183; ')
      + tw('<bdi>%s</bdi>' % pen, '<bdi>%s</bdi>' % par) + '</div>'
      + '<h2 class="question-title">' + tw('Where did the sales come from?', 'من أين جاءت المبيعات؟') + '</h2>'
      + '<p class="lead">' + tw(
          'For %s, gross sales before discounts reached %s and net sales were %s after discounts, returns '
          'and loyalty redemptions of %s.' % (pen, m0(gross), m0(net), m0(gross - net)),
          'خلال %s بلغ إجمالي المبيعات قبل الخصومات %s، بينما بلغ صافي المبيعات %s بعد خصومات '
          'ومرتجعات ونقاط ولاء قدرها %s.' % (par, m0(gross), m0(net), m0(gross - net))) + '</p>'
      + channel_card(channels, net, pen, par)
      + '<h3 class="subhead">' + tw('Overall sales by product category',
                                    'إجمالي المبيعات حسب فئة المنتج') + '</h3>'
      + '<div class="card">' + bars(rows) + NOTE + det(rows) + highlight(rows, pen, par) + '</div>'
      + '<p class="section-link">' + tw(
          'One of those channels is e-commerce. Of the %s in net sales for %s, %s (%s) was placed online, '
          'and it is broken out below.' % (m0(net), pen, m0(enet), ps),
          'ومن بين تلك القنوات التجارة الإلكترونية. فمن أصل صافي المبيعات البالغ %s خلال %s، جاء %s (%s) '
          'عبر الإنترنت، وتفصيله أدناه.' % (m0(net), par, m0(enet), ps)) + '</p>'
      + '<h3 class="subhead">' + tw('E-commerce sales by product category',
                                    'مبيعات التجارة الإلكترونية حسب فئة المنتج') + '</h3>'
      + '<div class="card">' + bars(erows) + det(erows)
      + ecom_highlight(erows, enet, net, pen, par) + '</div>'
      + '</div>')
    return top, body
