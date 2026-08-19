# -*- coding: utf-8 -*-
"""Synthetic retail sales data for the shareable demo build.

Nothing here comes from a real business. The numbers are generated from a fixed
seed so every rebuild reproduces the same figures, and the periods reconcile the
way real ones would: the quarters are the sum of their months, the half-year is
the sum of its quarters, and the channel split adds back to the period total.
"""
import random

CATS = [
    # key, English, Arabic, share of net, e-commerce penetration
    ('grocery',   'Grocery and Fresh Food',  'البقالة والأغذية الطازجة', .265, .09),
    ('apparel',   'Apparel and Footwear',    'الملابس والأحذية',          .185, .34),
    ('home',      'Home and Living',         'المنزل والمعيشة',           .145, .22),
    ('electro',   'Electronics',             'الإلكترونيات',              .125, .41),
    ('beauty',    'Health and Beauty',       'الصحة والجمال',             .095, .27),
    ('sports',    'Sports and Outdoor',      'الرياضة والأنشطة الخارجية', .062, .25),
    ('toys',      'Toys and Baby',           'الألعاب ومستلزمات الأطفال', .052, .30),
    ('books',     'Books and Stationery',    'الكتب والقرطاسية',          .038, .38),
    ('pet',       'Pet Supplies',            'مستلزمات الحيوانات الأليفة', .033, .21),
]

# channel keys, in the order the donut draws them
STORES, ECOM, WHOLESALE, MARKET = 'stores', 'ecom', 'wholesale', 'market'
CHANNELS = [STORES, ECOM, WHOLESALE, MARKET]
CH_NAMES = {
    STORES:    ('Retail stores',      'المتاجر'),
    ECOM:      ('E-commerce',         'التجارة الإلكترونية'),
    WHOLESALE: ('Wholesale',          'البيع بالجملة'),
    MARKET:    ('Marketplaces',       'المنصات الخارجية'),
}
CH_PAL = {STORES: '#113879', ECOM: '#0180E9', WHOLESALE: '#00A3A8', MARKET: '#8B96AC'}

# month key, English, Arabic, net sales, discount rate on gross
MONTHS = [
    ('dec', 'December 2025', 'ديسمبر 2025',  9_180_000, .131),   # baseline only, never shown
    ('jan', 'January 2026',  'يناير 2026',   8_420_000, .118),
    ('feb', 'February 2026', 'فبراير 2026',  7_960_000, .126),
    ('mar', 'March 2026',    'مارس 2026',    9_310_000, .132),
    ('apr', 'April 2026',    'أبريل 2026',   8_870_000, .115),
    ('may', 'May 2026',      'مايو 2026',    9_640_000, .121),
    ('jun', 'June 2026',     'يونيو 2026',  10_120_000, .128),
    ('jul', 'July 2026',     'يوليو 2026',  11_050_000, .142),
]

# how the two non-store, non-digital channels drift across the seven months
WHOLESALE_SHARE = [.091, .088, .086, .087, .084, .082, .080, .079]
MARKET_SHARE    = [.049, .051, .052, .054, .055, .057, .058, .060]


def _rows(net_total, disc, mix, ecom_lift):
    """Split a period total across the categories, twice: whole business and the
    e-commerce channel inside it."""
    all_rows, ecom_rows = [], []
    for i, (k, en, ar, _base, pen) in enumerate(CATS):
        net = net_total * mix[i]
        gross = net / (1 - disc)
        all_rows.append(dict(key=k, name=en, name_ar=ar, net=round(net, 2),
                             gross=round(gross, 2), chg=''))
        enet = net * min(pen * ecom_lift, .72)
        egross = enet / (1 - min(disc + .022, .4))
        ecom_rows.append(dict(key=k, name=en, name_ar=ar, net=round(enet, 2),
                              gross=round(egross, 2), chg=''))
    return all_rows, ecom_rows


def _mix(rnd):
    """Category shares with a little month-to-month movement, renormalised."""
    raw = [c[3] * (1 + rnd.uniform(-.085, .085)) for c in CATS]
    t = sum(raw)
    return [v / t for v in raw]


def months():
    rnd = random.Random(20260804)
    out = []
    for i, (k, en, ar, net, disc) in enumerate(MONTHS):
        rows, erows = _rows(net, disc, _mix(rnd), 1 + .017 * i)
        enet = sum(r['net'] for r in erows)
        ch = channels(net, enet, i)
        out.append(dict(key=k, en=en, ar=ar, rows=rows, ecom=erows, channels=ch))
    return out


def channels(net_total, ecom_net, i):
    w = round(net_total * WHOLESALE_SHARE[i], 2)
    m = round(net_total * MARKET_SHARE[i], 2)
    e = round(ecom_net, 2)
    s = round(net_total - w - m - e, 2)
    return [(STORES, s), (ECOM, e), (WHOLESALE, w), (MARKET, m)]


def add(*periods):
    """Sum whole periods. Category sums are additive, so a quarter is exactly its
    months and the half-year is exactly its quarters."""
    rows, ecom, ch = {}, {}, {}
    for p in periods:
        for src, acc in ((p['rows'], rows), (p['ecom'], ecom)):
            for r in src:
                a = acc.setdefault(r['key'], dict(key=r['key'], name=r['name'],
                                                  name_ar=r['name_ar'], net=0.0, gross=0.0, chg=''))
                a['net'] += r['net']; a['gross'] += r['gross']
        for c, v in p['channels']:
            ch[c] = ch.get(c, 0.0) + v
    for acc in (rows, ecom):
        for a in acc.values():
            a['net'] = round(a['net'], 2); a['gross'] = round(a['gross'], 2)
    return dict(rows=[rows[c[0]] for c in CATS], ecom=[ecom[c[0]] for c in CATS],
                channels=[(c, round(ch[c], 2)) for c in CHANNELS])


def chg(cur, prev):
    """Percent change per category against the previous period of the same kind."""
    pm = {r['key']: r['net'] for r in prev} if prev else None
    for r in cur:
        if pm is None:
            r['chg'] = 'n/a'; continue
        p = pm.get(r['key'])
        if not p:
            r['chg'] = 'New'
        else:
            r['chg'] = '%d%%' % round((r['net'] - p) / p * 100)
    return cur


def build():
    """Eleven periods: seven months, three quarters, the year to date."""
    ms = months()
    by = {m['key']: m for m in ms}
    for i, m in enumerate(ms):
        if i == 0: continue
        chg(m['rows'], ms[i-1]['rows']); chg(m['ecom'], ms[i-1]['ecom'])

    q1 = add(by['jan'], by['feb'], by['mar'])
    q2 = add(by['apr'], by['may'], by['jun'])
    h1 = add(q1, q2)
    td = add(h1, by['jul'])
    chg(q1['rows'], None); chg(q1['ecom'], None)
    chg(q2['rows'], q1['rows']); chg(q2['ecom'], q1['ecom'])
    chg(h1['rows'], None); chg(h1['ecom'], None)
    chg(td['rows'], None); chg(td['ecom'], None)

    def spec(key, en, ar, d):
        return dict(key=key, en=en, ar=ar, rows=d['rows'], ecom=d['ecom'], channels=d['channels'])

    month_specs = [spec(m['key'], m['en'], m['ar'], m)
                   for m in ms[1:][::-1]]                      # July first, January last
    quarter_specs = [spec('h1', 'H1 2026', 'النصف الأول 2026', h1),
                     spec('q2', 'Q2 2026', 'الربع الثاني 2026', q2),
                     spec('q1', 'Q1 2026', 'الربع الأول 2026', q1)]
    todate_specs = [spec('td', 'January to July 2026', 'يناير إلى يوليو 2026', td)]
    return month_specs, quarter_specs, todate_specs


# ---- the sales entities behind each channel, for the validation table --------
ENTITIES = [
    (STORES,    'Flagship stores (4)',      'المتاجر الرئيسية (4)',        'owned', .34),
    (STORES,    'City stores (26)',         'متاجر المدن (26)',            'owned', .45),
    (STORES,    'Convenience format (58)',  'المتاجر الصغيرة (58)',        'owned', .21),
    (ECOM,      'Web store',                'المتجر الإلكتروني',            'digital', .46),
    (ECOM,      'Mobile app',               'تطبيق الجوال',                 'digital', .54),
    (WHOLESALE, 'Partner accounts',         'حسابات الشركاء',              'b2b', .72),
    (WHOLESALE, 'Contract catering',        'عقود التموين',                'b2b', .28),
    (MARKET,    'Marketplace A',            'المنصة أ',                    'third', .61),
    (MARKET,    'Marketplace B',            'المنصة ب',                    'third', .39),
]
KIND_NAMES = {'owned': ('Owned retail', 'تجزئة مملوكة'), 'digital': ('Digital', 'رقمي'),
              'b2b': ('B2B', 'بيع للشركات'), 'third': ('Third party', 'طرف ثالث')}


def entities(channel_totals):
    """Every selling entity, its channel and its net, summing to the period total."""
    tot = dict(channel_totals)
    out, used = [], {c: 0.0 for c in CHANNELS}
    per_ch = {}
    for ch, en, ar, kind, share in ENTITIES:
        per_ch.setdefault(ch, []).append((en, ar, kind, share))
    for ch in CHANNELS:
        items = per_ch[ch]
        for i, (en, ar, kind, share) in enumerate(items):
            if i == len(items) - 1:                 # last one absorbs the rounding
                v = round(tot[ch] - used[ch], 2)
            else:
                v = round(tot[ch] * share, 2); used[ch] += v
            out.append((ch, en, ar, kind, v))
    return out
