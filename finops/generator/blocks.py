# -*- coding: utf-8 -*-
import os, glob, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen, depts

# where the Reports CSVs live; override with FINOPS_DATA when running from the repo copy
B = os.environ.get('FINOPS_DATA') or os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'gcpdata2/GCP Monthly Reports')
MONTHS = [('jan','January','January 2026','يناير 2026'), ('feb','February','February 2026','فبراير 2026'),
          ('mar','March','March 2026','مارس 2026'),      ('apr','April','April 2026','أبريل 2026'),
          ('may','May','May 2026','مايو 2026'),          ('jun','June','June 2026','يونيو 2026')]

# by-project exports exist for these periods only; every other period cannot carry
# a department view until the same export is pulled for its date range
BYPROJ = {'jul': '2026-07-01', 'h1': '2026-01-01', 'td': '2025-10-01'}
PROJ_ROWS = {k: depts.read(glob.glob(os.path.join(B, 'July', 'by project', '*%s*.csv' % p))[0])
             for k, p in BYPROJ.items()}


# how the shared infrastructure residual actually divided across H1 2026, the
# half-year that contains every period without a by-project export of its own
def _h1_service_rows():
    f = glob.glob(os.path.join(B, 'July', 'by service', '*2026-01-01*.csv'))[0]
    return gen.read(f)
H1_SERVICES = _h1_service_rows()
RESID_MIX = depts.residual_mix(PROJ_ROWS['h1'], H1_SERVICES)

def csvs(month, kind):
    return sorted(glob.glob(os.path.join(B, month, kind, '*.csv')))[0]

def tw(en, ar):
    return '<span class="en">%s</span><span class="ar">%s</span>' % (en, ar)

def m0(v): return gen.money(v, 0)

def summary(gnet, ggross, gdisc, snet, sgross, sdisc):
    return ('<div aria-label="Key spend figures" class="summary-bar" role="group">'
      '<div class="summary-half summary-half--gcp">'
        '<div class="summary-kicker">%s</div><div class="summary-value">%s</div>'
        '<div class="summary-label">%s</div><div class="summary-sub">%s</div>'
        '<div class="summary-note">%s</div></div>'
      '<div aria-hidden="true" class="summary-divider"><span class="summary-blade"></span></div>'
      '<div class="summary-half summary-half--sandbox">'
        '<div class="summary-kicker">%s</div><div class="summary-value">%s</div>'
        '<div class="summary-label">%s</div><div class="summary-sub">%s</div>'
        '<div class="summary-note">%s</div></div></div>') % (
      tw('GCP cloud spend','إنفاق GCP السحابي'), m0(gnet), tw('Net spend','صافي الإنفاق'),
      tw('Gross usage before discounts: <bdi>%s</bdi>' % m0(ggross),
         'إجمالي الاستهلاك قبل الخصومات: <bdi>%s</bdi>' % m0(ggross)),
      tw('Discounts applied: <bdi>%s</bdi> &#183; Riyals at 3.75 to the US dollar.' % m0(gdisc),
         'إجمالي الخصومات: <bdi>%s</bdi> &#183; الريال مقابل الدولار عند 3.75.' % m0(gdisc)),
      tw('Sandbox spend','إنفاق بيئة التجارب'), m0(snet), tw('Net spend','صافي الإنفاق'),
      tw('Gross usage before discounts: <bdi>%s</bdi>' % m0(sgross),
         'إجمالي الاستهلاك قبل الخصومات: <bdi>%s</bdi>' % m0(sgross)),
      tw('Discounts applied: <bdi>%s</bdi> &#183; Governed by sandbox guardrails.' % m0(sdisc),
         'إجمالي الخصومات: <bdi>%s</bdi> &#183; الإنفاق محكوم بضوابط بيئة التجارب.' % m0(sdisc)))

NOTE = ('<p class="note">' + tw(
  'No credits remain available at the end of the period. The migration credit is fully consumed, so spend '
  'now reflects negotiated contract rates. Figures are converted from the US dollars Google bills at the '
  'official rate of 3.75 Riyals to the US dollar.',
  'لا تتبقى أرصدة متاحة بنهاية الفترة. وقد تم استهلاك رصيد الترحيل بالكامل، وبالتالي يعكس الإنفاق الآن '
  'الأسعار التعاقدية المتفق عليها. وتم تحويل المبالغ من الدولار الأمريكي الذي تصدر به Google الفواتير '
  'وفق السعر الرسمي 3.75 ريال للدولار.') + '</p>')

def det(rows):
    return ('<details><summary>' + tw('View details','عرض التفاصيل') +
      '<span aria-hidden="true" class="detail-icon">&#8599;</span></summary><h4>' +
      tw('Service list &#183; gross usage before discounts','قائمة الخدمات &#183; إجمالي الاستهلاك قبل الخصومات') +
      '</h4><div class="cw" style="margin-top:16px"><table><thead><tr><th>' +
      tw('Service','الخدمة') + '</th><th>' +
      tw('Gross before discounts <span class="rs"></span>','إجمالي الاستهلاك قبل الخصومات <span class="rs"></span>') + '</th><th>' +
      tw('Net after discounts <span class="rs"></span>','الصافي بعد الخصومات <span class="rs"></span>') + '</th><th>' +
      tw('Change vs previous','التغير عن الفترة السابقة') + '</th></tr></thead><tbody>'
      + gen.table(rows) + '</tbody></table></div></details>')

def highlight(rows, period_en, period_ar):
    net = sum(r['net'] for r in rows)
    best, bestv = None, None
    for r in rows:
        if not net or r['net'] / net < 0.03: continue
        try: v = float((r['chg'] or '').replace('%','').replace(',',''))
        except ValueError: continue
        if v > 0 and (bestv is None or v > bestv): best, bestv = r, v
    if best is not None:
        nm = gen.SHORT.get(best['name'], best['name'])
        en = ('Watch %s: net spend of %s for %s, +%s%% against the previous period. '
              'Review whether the increase comes from approved workloads, sizing, or idle resources.'
              % (nm, m0(best['net']), period_en, format(int(round(bestv)), ',d')))
        ar = ('راقب %s: بلغ صافي الإنفاق %s خلال %s بارتفاع %s%% عن الفترة السابقة. '
              'يُنصح بمراجعة ما إذا كان الارتفاع ناتجاً عن أحمال معتمدة أو عن الحجم أو عن موارد خاملة.'
              % (nm, m0(best['net']), period_ar, format(int(round(bestv)), ',d')))
    else:
        top = sorted(rows, key=lambda r: -r['net'])[:3]
        share = sum(r['net'] for r in top) / net if net else 0
        names = ', '.join(gen.SHORT.get(r['name'], r['name']) for r in top)
        en = 'Concentration: %s carry %d%% of net spend for %s.' % (names, round(share*100), period_en)
        ar = 'التركّز: تستحوذ %s على %d%% من صافي الإنفاق خلال %s.' % (names, round(share*100), period_ar)
    return '<div class="insight"><b>' + tw('Key highlight:','أبرز ملاحظة:') + '</b> ' + tw(en, ar) + '</div>'

def sandbox_highlight(snet, sgross, gnet, period_en, period_ar):
    pct = (snet / gnet * 100) if gnet else 0
    ps = ('%.1f%%' % pct) if pct < 1 else ('%d%%' % round(pct))
    if round(snet, 2) == 0:
        en = ('Sandbox usage of %s for %s was fully covered by credit, so net spend was nil. '
              'Project-level budgets, spend alerts and automated provisioning keep it bounded.' % (m0(sgross), period_en))
        ar = ('غُطي استهلاك بيئة التجارب البالغ %s خلال %s بالكامل من الرصيد، فلم يكن هناك صافي إنفاق. '
              'وتظل البيئة محكومة بميزانيات على مستوى المشاريع وتنبيهات الإنفاق والتجهيز الآلي.' % (m0(sgross), period_ar))
    else:
        en = ('Sandbox net spend of %s for %s is %s of total GCP net spend. '
              'Project-level budgets, spend alerts and automated provisioning keep it bounded.' % (m0(snet), period_en, ps))
        ar = ('بلغ صافي إنفاق بيئة التجارب %s خلال %s، أي %s من إجمالي صافي الإنفاق على GCP. '
              'وتظل البيئة محكومة بميزانيات على مستوى المشاريع وتنبيهات الإنفاق والتجهيز الآلي.' % (m0(snet), period_ar, ps))
    return '<div class="insight"><b>' + tw('Key highlight:','أبرز ملاحظة:') + '</b> ' + tw(en, ar) + '</div>'

DEPT_HEAD = tw('Spend per general department', 'الإنفاق حسب الإدارة العامة')

DEPT_METHOD = ('<p class="note">' + tw(
    'Every charge is assigned to the department that owns the application it pays for, read from the billing '
    'project it sits in. Cybersecurity owns the security monitoring platform (Chronicle and Security Command '
    'Center) and security operations. IT Services GD owns the platforms and appliances it operates, including '
    'F5 BIG-IP, FortiGate, the Fortinet platform, key management, the landing zone, the databases, the '
    'delivery pipelines and central logging. Business departments own their own applications plus the '
    'platform the business applications moving to GCP land on: the migration landing zone, the databases, '
    'the delivery pipelines and the management engine. That bucket is split per department once the '
    'ownership map exists.',
    'يُنسب كل بند إلى الإدارة المالكة للتطبيق الذي يخصه، وفق مشروع الفوترة الذي يقع تحته. فالأمن السيبراني '
    'يملك منصة مراقبة الأمن (Chronicle وSecurity Command Center) وعمليات الأمن. أما الإدارة العامة لخدمات '
    'تقنية المعلومات فتملك المنصات والأجهزة التي تشغّلها، ومنها F5 BIG-IP وFortiGate ومنصة Fortinet وإدارة '
    'المفاتيح ومنطقة الهبوط والسجلات المركزية. وتملك الإدارات المعنية بالأعمال تطبيقاتها الخاصة إضافة إلى '
    'المنصة التي تهبط عليها تطبيقات الأعمال المنتقلة إلى GCP: منطقة هبوط الترحيل وقواعد البيانات وخطوط '
    'التسليم ومحرك الإدارة. وسيُقسَّم هذا البند حسب كل إدارة عند اكتمال خريطة الملكية.') + '</p>')

def dept_card(key, gnet, period_en, period_ar, gcp_rows):
    rows = PROJ_ROWS.get(key)
    derived = None
    if rows is None:
        # No by-project export for this period. Take everything a service line pins
        # to one department from this period's own numbers, and apportion only the
        # infrastructure residual on the basis of the half-year that contains it.
        parts_raw, exact, resid = depts.from_services(gcp_rows, RESID_MIX)
        derived = (exact, resid)
    else:
        parts_raw, unknown = depts.split(rows, gcp_rows)
        assert not unknown, unknown
    tot = sum(v for _, v in parts_raw) or 1
    parts = [(depts.NAMES[b][0], v, v/tot, depts.PAL[b]) for b, v in parts_raw]
    svg = gen.donut_chart(parts, tw('TOTAL NET SPEND', 'إجمالي صافي الإنفاق'), m0(gnet))
    leg = ['<ul class="dleg">']
    for b, v in parts_raw:
        en, ar = depts.NAMES[b]
        leg.append('<li><span class="dot" style="background:%s"></span>'
                   '<span class="dl-name">%s</span><span class="dl-val">%s</span>'
                   '<span class="dl-share">%s</span></li>'
                   % (depts.PAL[b], tw(gen.esc(en), gen.esc(ar)), m0(v), gen._pct(v/tot*100)))
    leg.append('</ul>')
    if derived is None:
        tail = DEPT_METHOD + dept_detail(key, gcp_rows)
    else:
        tail = derived_method(period_en, period_ar, gnet, *derived)
    return ('<div class="card"><h3>' + DEPT_HEAD + '</h3>'
      + '<div class="dwrap">' + svg + '\n'.join(leg) + '</div>' + tail
      + owner_highlight(dict(parts_raw), gcp_rows) + '</div>')


def derived_method(period_en, period_ar, gnet, exact, resid):
    ep = round(exact / gnet * 100) if gnet else 0
    rp = 100 - ep
    if rp <= 0:
        en = ('Every charge in %s sits on a service that belongs to one general department, so this split is '
              'read straight from the billing data with nothing apportioned.' % period_en)
        ar = ('يقع كل بند في %s على خدمة تخص إدارة عامة واحدة، ولذلك يُقرأ هذا التوزيع مباشرة من بيانات '
              'الفوترة دون أي توزيع تقديري.' % period_ar)
    else:
        en = ('%d%% of %s is read straight from the billing data: the security services, the F5 BIG-IP and '
              'FortiGate appliances and the AI search platform each belong to one general department, and '
              'those identities were checked to the cent against the by-project export. The remaining %d%% is '
              'platform infrastructure (compute, network, storage, logging) and is apportioned on the '
              'verified H1 2026 ownership split, so the six months add back to the half-year exactly. A '
              'by-project export for this date range would make the whole figure exact.' % (ep, period_en, rp))
        ar = ('تُقرأ نسبة %d%% من %s مباشرة من بيانات الفوترة: فخدمات الأمن وأجهزة F5 BIG-IP وFortiGate ومنصة '
              'البحث بالذكاء الاصطناعي تخص كل منها إدارة عامة واحدة، وقد جرى التحقق من ذلك حتى الهللة مقابل '
              'التقرير حسب المشروع. أما النسبة المتبقية وقدرها %d%% فهي بنية تحتية مشتركة (الحوسبة والشبكة '
              'والتخزين والسجلات) وتُوزَّع وفق توزيع النصف الأول 2026 المتحقق منه، بحيث تعود الأشهر الستة إلى '
              'إجمالي النصف تماماً. ويكفي سحب تقرير حسب المشروع لهذه الفترة ليصبح الرقم كاملاً دقيقاً.'
              % (ep, period_ar, rp))
    return '<p class="note">' + tw(en, ar) + '</p>'


def dept_detail(key, gcp_rows):
    """Every project, its department and what kind of solution it is, so the split
    can be validated line by line."""
    det_rows = depts.detail_rows(blocks_rows(key), depts.appliances(gcp_rows),
                                 depts.account_itsvc(gcp_rows))
    body = []
    for b, en, ar, kind, net in det_rows:
        den, dar = depts.NAMES[b]
        ken, kar = depts.KIND_NAMES[kind]
        body.append('<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
                    % (tw(gen.esc(en), gen.esc(ar)), tw(gen.esc(den), gen.esc(dar)),
                       tw(ken, kar), gen.num(net, 2)))
    return ('<details><summary>' + tw('View details', 'عرض التفاصيل') +
      '<span aria-hidden="true" class="detail-icon">&#8599;</span></summary><h4>' +
      tw('Every project, its general department and what it is',
         'كل مشروع وإدارته العامة وطبيعته') +
      '</h4><div class="cw" style="margin-top:16px"><table><thead><tr><th>' +
      tw('Project', 'المشروع') + '</th><th>' +
      tw('General department', 'الإدارة العامة') + '</th><th>' +
      tw('Type', 'النوع') + '</th><th>' +
      tw('Net spend <span class="rs"></span>', 'صافي الإنفاق <span class="rs"></span>') +
      '</th></tr></thead><tbody>' + '\n'.join(body) + '</tbody></table></div></details>')


def blocks_rows(key):
    return PROJ_ROWS[key]


def owner_highlight(totals, gcp_rows):
    """Majid asked that the chart name who owns what. The security appliances are
    the case that needs saying out loud: they are a security solution, operated by
    IT Services GD, and their figure is exact in every period."""
    it = totals.get(depts.ITSVC)
    if not it: return ''
    sec = round(depts.appliances(gcp_rows) + depts.account_itsvc(gcp_rows), 2)
    if sec <= 0: return ''
    rest = round(it - sec, 2)
    share = gen._pct(sec / it * 100)
    if rest < 1:
        en = ('Of the %s IT Services GD carries, all of it is security tooling it operates: the F5 BIG-IP '
              'and FortiGate appliances and the Fortinet platform. Credits covered the platform underneath '
              'them for this period.' % m0(it))
        ar = ('من أصل %s تحملها الإدارة العامة لخدمات تقنية المعلومات، جميعها أدوات أمن تشغّلها: أجهزة '
              'F5 BIG-IP وFortiGate ومنصة Fortinet. أما المنصة تحتها فقد غطتها الأرصدة في هذه الفترة.'
              % m0(it))
    else:
        en = ('Of the %s IT Services GD carries, %s (%s) is security tooling it operates: the F5 BIG-IP and '
              'FortiGate appliances and the Fortinet platform. The remaining %s is the landing zone, the '
              'databases, the delivery pipelines and central logging.' % (m0(it), m0(sec), share, m0(rest)))
        ar = ('من أصل %s تحملها الإدارة العامة لخدمات تقنية المعلومات، هناك %s (%s) أدوات أمن تشغّلها: '
              'أجهزة F5 BIG-IP وFortiGate ومنصة Fortinet. أما المتبقي وقدره %s فهو منطقة الهبوط وقواعد '
              'البيانات وخطوط التسليم والسجلات المركزية.' % (m0(it), m0(sec), share, m0(rest)))
    return '<div class="insight"><b>' + tw('Who owns what:', 'من يملك ماذا:') + '</b> ' + tw(en, ar) + '</div>'

def build(gcp_rows, sb_rows, key, period_en, period_ar):
    gnet = sum(r['net'] for r in gcp_rows); ggross = sum(r['gross'] for r in gcp_rows)
    snet = sum(r['net'] for r in sb_rows);  sgross = sum(r['gross'] for r in sb_rows)
    pct = (snet / gnet * 100) if gnet else 0
    ps = ('%.1f%%' % pct) if pct < 1 else ('%d%%' % round(pct))

    # ---- section 01 · key figures ----
    top = ('<div class="mv mv-%s">' % key
      + '<div class="kick">' + tw('01 &#183; Key figures &#183; ','01 &#183; المؤشرات الرئيسية &#183; ')
      + tw('<bdi>%s</bdi>' % period_en, '<bdi>%s</bdi>' % period_ar) + '</div>'
      + summary(gnet, ggross, ggross-gnet, snet, sgross, sgross-snet) + '</div>')

    # ---- section 02 · GCP spend ----
    if round(snet, 2) == 0:
        schart = ('<p class="lead" style="margin:4px 0 0">' + tw(
            'Every riyal of sandbox usage in %s was covered by credit, so there is no net spend to divide. '
            'The service list below shows the usage behind it.' % period_en,
            'غُطي كل ريال من استهلاك بيئة التجارب خلال %s من الرصيد، فلا يوجد صافي إنفاق لتوزيعه. '
            'وتوضح قائمة الخدمات أدناه تفاصيل ذلك الاستهلاك.' % period_ar) + '</p>')
    else:
        schart = gen.bars(sb_rows)

    body = ('<div class="mv mv-%s">' % key
      + '<div class="kick">' + tw('02 &#183; GCP spend &#183; ','02 &#183; الإنفاق على GCP &#183; ')
      + tw('<bdi>%s</bdi>' % period_en, '<bdi>%s</bdi>' % period_ar) + '</div>'
      + '<h2 class="question-title">' + tw('Where did the money go?','أين ذهب الإنفاق؟') + '</h2>'
      + '<p class="lead">' + tw(
          'For %s, gross usage before discounts reached %s and net spend was %s after total discounts of %s.'
          % (period_en, m0(ggross), m0(gnet), m0(ggross-gnet)),
          'خلال %s بلغ إجمالي الاستهلاك قبل الخصومات %s، بينما بلغ صافي الإنفاق %s بعد خصومات إجمالية قدرها %s.'
          % (period_ar, m0(ggross), m0(gnet), m0(ggross-gnet))) + '</p>'
      # 2a · per department
      + dept_card(key, gnet, period_en, period_ar, gcp_rows)
      # 2b · overall spend by service
      + '<h3 class="subhead">' + tw('Overall spend by service','إجمالي الإنفاق حسب الخدمة') + '</h3>'
      + '<div class="card">' + gen.bars(gcp_rows) + NOTE + det(gcp_rows)
      + highlight(gcp_rows, period_en, period_ar) + '</div>'
      # bridge
      + '<p class="section-link">' + tw(
          'One of those projects is the sandbox environment. Of the %s net spend for %s, %s (%s) sat there, '
          'and it is broken out below.' % (m0(gnet), period_en, m0(snet), ps),
          'ومن بين تلك المشاريع بيئة التجارب. فمن أصل صافي الإنفاق البالغ %s خلال %s، كان نصيبها %s (%s)، '
          'وتفصيلها أدناه.' % (m0(gnet), period_ar, m0(snet), ps)) + '</p>'
      # 2c · sandbox by service
      + '<h3 class="subhead">' + tw('Overall sandbox spend by service','إجمالي إنفاق بيئة التجارب حسب الخدمة') + '</h3>'
      + '<div class="card">' + schart + det(sb_rows)
      + sandbox_highlight(snet, sgross, gnet, period_en, period_ar) + '</div>'
      + '</div>')
    return top, body
