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

# the periods whose window actually contains the platform build-out
MIG_PERIODS = ('jul', 'td')
MIG_NAMES = {
  'prj-moenergy-migration-host-hq': ('Migration landing zone (HQ)', 'منطقة هبوط الترحيل (المقر)'),
  'prj-moenergy-prd-data-dbs':      ('Database platform (production)', 'منصة قواعد البيانات (الإنتاج)'),
  'prj-moenergy-dev-data-dbs':      ('Database platform (development)', 'منصة قواعد البيانات (التطوير)'),
  'prj-moenergy-prd-bs-devops':     ('DevOps pipeline (production)', 'خط DevOps (الإنتاج)'),
  'prj-moenergy-dev-bs-devops':     ('DevOps pipeline (development)', 'خط DevOps (التطوير)'),
  'prj-moenergy-prd-infra-mngeng':  ('Infrastructure management engine', 'محرك إدارة البنية التحتية'),
  'prj-moenergy-test-host':         ('Test landing zone', 'منطقة هبوط الاختبار'),
}

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
    'Departments are read from the billing project each charge sits in. The account-level security charges '
    'reconcile to the cent with Chronicle, Security Command Center and Fortinet Security SaaS, so they are '
    'assigned whole to Cybersecurity. Infrastructure application projects sit with Support Services GD, and '
    'the landing zone and network platform every department runs on is shown as shared. The F5 BIG-IP and '
    'FortiGate appliances run inside that shared hub and are counted there.',
    'تُنسب الإدارات وفق مشروع الفوترة الذي يقع تحته كل بند. وتتطابق رسوم الأمن على مستوى الحساب تماماً مع '
    'خدمات Chronicle وSecurity Command Center وFortinet Security SaaS، ولذلك تُنسب بالكامل إلى الأمن '
    'السيبراني. وتقع مشاريع تطبيقات البنية التحتية ضمن الإدارة العامة لخدمات الدعم، بينما تظهر منطقة '
    'الهبوط ومنصة الشبكة التي تعتمد عليها جميع الإدارات كخدمات مشتركة. أما أجهزة F5 BIG-IP وFortiGate '
    'فتعمل داخل تلك المنصة المشتركة وتُحتسب ضمنها.') + '</p>')

def dept_card(key, gnet, period_en, period_ar):
    rows = PROJ_ROWS.get(key)
    if rows is None:
        # honest placeholder: the split is a data pull away, not a modelling exercise
        return ('<div class="card"><h3>' + DEPT_HEAD + '</h3><p class="note" style="margin-top:2px">' + tw(
          'A department view for %s needs the by-project export for the same date range. The current data set '
          'carries it for July 2026, H1 2026 and the contract to date, where the split is read from the '
          'billing project each charge sits in rather than from labels: GCP stamps every billing row with the '
          'labels that existed when the usage was metered, so a label applied today never reaches a past row.'
          % period_en,
          'يتطلب عرض الإنفاق حسب الإدارة العامة خلال %s سحب تقرير حسب المشروع للفترة نفسها. وتتوفر هذه '
          'البيانات حالياً ليوليو 2026 والنصف الأول 2026 ومدة العقد حتى تاريخه، حيث يُقرأ التوزيع من مشروع '
          'الفوترة الذي يقع تحته كل بند لا من الوسوم: إذ تسجّل GCP كل سطر فوترة بالوسوم القائمة وقت قياس '
          'الاستهلاك، فلا يصل وسم يُضاف اليوم إلى سطر سابق.' % period_ar) + '</p></div>')

    parts_raw, unknown = depts.split(rows)
    assert not unknown, unknown
    tot = sum(v for _, v in parts_raw) or 1
    parts = [(depts.NAMES[b][0], v, v/tot, depts.PAL[b]) for b, v in parts_raw]
    svg = gen.donut_chart(parts, 'TOTAL NET SPEND', m0(gnet))
    leg = ['<ul class="dleg">']
    for b, v in parts_raw:
        en, ar = depts.NAMES[b]
        leg.append('<li><span class="dot" style="background:%s"></span>'
                   '<span class="dl-name">%s</span><span class="dl-val">%s</span>'
                   '<span class="dl-share">%s</span></li>'
                   % (depts.PAL[b], tw(gen.esc(en), gen.esc(ar)), m0(v), gen._pct(v/tot*100)))
    leg.append('</ul>')
    return ('<div class="card"><h3>' + DEPT_HEAD + '</h3>'
      + '<div class="dwrap">' + svg + '\n'.join(leg) + '</div>' + DEPT_METHOD + '</div>')


def pbars(items):
    """items: (en, ar, net, chg). Same bar form as the service charts, with twins."""
    peak = max([abs(v) for _, _, v, _ in items] + [1])
    tot = sum(v for _, _, v, _ in items) or 1
    out = ['<div class="bars">']
    for i, (en, ar, v, chg) in enumerate(items):
        col = gen.PAL[i] if i < len(gen.PAL) else '#5B7AA8'
        out.append('<div class="bar-row"><div class="bar-head">'
                   '<span class="bar-name">%s</span><span class="bar-val">%s</span>'
                   '<span class="bar-share">%s</span><span class="bar-chg">%s</span></div>'
                   '<div class="bar-track"><i style="width:%.1f%%;background:%s"></i></div></div>'
                   % (tw(gen.esc(en), gen.esc(ar)), m0(v), gen._pct(v/tot*100), gen._chg_html(chg),
                      max(abs(v)/peak*100, 0.6), col))
    out.append('</div>')
    return '\n'.join(out)


def migration_card(key, gnet, period_en, period_ar):
    """Business applications started moving to GCP in July. Show it where the
    period's window actually contains the build-out."""
    if key not in MIG_PERIODS: return ''
    by = {r['pid']: r for r in PROJ_ROWS[key]}
    items, grp, prev, derivable, fresh = [], 0.0, 0.0, True, []
    for pid in depts.MIGRATION:
        r = by.get(pid)
        if r is None or r['net'] <= 0: continue
        en, ar = MIG_NAMES[pid]
        items.append((en, ar, r['net'], r['chg']))
        grp += r['net']
        if r['chg'] == 'New':
            fresh.append(en)
        else:
            try: prev += r['net'] / (1 + float(r['chg'].replace('%', '')) / 100)
            except ValueError: derivable = False
    if not items: return ''
    items.sort(key=lambda t: -t[2])
    share = gen._pct(grp / gnet * 100) if gnet else '0%'

    if key == 'jul':
        growth = ''
        if derivable and prev > 0:
            growth = (' and up %d%% on the previous month' % round((grp - prev) / prev * 100),
                      ' بارتفاع %d%% عن الشهر السابق' % round((grp - prev) / prev * 100))
        en = ('Business applications have started moving to GCP. In %s the migration and application platform '
              'carried %s of net spend, %s of the GCP total%s. Four of these projects opened for the first '
              'time this month: the migration landing zone, both DevOps pipelines and the infrastructure '
              'management engine.'
              % (period_en, m0(grp), share, growth[0] if growth else ''))
        ar = ('بدأ ترحيل تطبيقات الأعمال إلى GCP. فخلال %s استحوذت منصة الترحيل والتطبيقات على %s من صافي '
              'الإنفاق، أي %s من إجمالي الإنفاق على GCP%s. وقد فُتحت أربعة من هذه المشاريع لأول مرة هذا '
              'الشهر: منطقة هبوط الترحيل، وخطا DevOps، ومحرك إدارة البنية التحتية.'
              % (period_ar, m0(grp), share, growth[1] if growth else ''))
    else:
        jul = sum(r['net'] for r in PROJ_ROWS['jul'] if r['pid'] in depts.MIGRATION)
        en = ('Business applications have started moving to GCP. Across %s the migration and application '
              'platform carried %s of net spend, %s of the GCP total, and %d%% of that landed in July 2026 '
              'alone: the migration landing zone, both DevOps pipelines and the infrastructure management '
              'engine all opened that month.'
              % (period_en, m0(grp), share, round(jul / grp * 100)))
        ar = ('بدأ ترحيل تطبيقات الأعمال إلى GCP. فخلال %s استحوذت منصة الترحيل والتطبيقات على %s من صافي '
              'الإنفاق، أي %s من إجمالي الإنفاق على GCP، وتركّز %d%% منها في يوليو 2026 وحده: ففي ذلك الشهر '
              'فُتحت منطقة هبوط الترحيل وخطا DevOps ومحرك إدارة البنية التحتية.'
              % (period_ar, m0(grp), share, round(jul / grp * 100)))

    stats = ('<div class="mstat">'
      '<div><b>%s</b><span>%s</span></div>'
      '<div><b>%s</b><span>%s</span></div>'
      '<div><b>%d</b><span>%s</span></div></div>'
      % (m0(grp), tw('Net spend on the migration and application platform',
                     'صافي الإنفاق على منصة الترحيل والتطبيقات'),
         share, tw('Share of net GCP spend', 'النسبة من صافي الإنفاق على GCP'),
         len(items), tw('Platform projects carrying spend', 'مشاريع المنصة التي تحمل إنفاقاً')))

    return ('<h3 class="subhead">' + tw('Business application migration', 'ترحيل تطبيقات الأعمال') + '</h3>'
      '<div class="card"><p class="lead" style="margin:0 0 10px">' + tw(en, ar) + '</p>'
      + stats + pbars(items) + '<p class="note">' + tw(
        'These are the platform projects the applications land on: the landing zone, the databases, the '
        'delivery pipelines and the management engine. Application workloads that move onto them will show '
        'up under the general department that owns the application.',
        'هذه هي مشاريع المنصة التي تهبط عليها التطبيقات: منطقة الهبوط وقواعد البيانات وخطوط التسليم ومحرك '
        'الإدارة. أما أحمال التطبيقات التي تنتقل إليها فستظهر تحت الإدارة العامة المالكة للتطبيق.')
      + '</p></div>')

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
      + dept_card(key, gnet, period_en, period_ar)
      # 2b · overall spend by service
      + '<h3 class="subhead">' + tw('Overall spend by service','إجمالي الإنفاق حسب الخدمة') + '</h3>'
      + '<div class="card">' + gen.bars(gcp_rows) + NOTE + det(gcp_rows)
      + highlight(gcp_rows, period_en, period_ar) + '</div>'
      # 2c · business application migration, where the window contains it
      + migration_card(key, gnet, period_en, period_ar)
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
