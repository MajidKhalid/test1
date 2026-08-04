# -*- coding: utf-8 -*-
"""Project to general-department mapping, from Majid's rules (4 Aug 2026).

(a) Chronicle and Security Command Center belong to the Cybersecurity Department.
    The account-level bucket [Charges not specific to a project] was verified to be
    exactly those security services in every period, so it lands whole on Cybersecurity.
(b) All infrastructure applications sit within Support Services GD.
(c) Anything genuinely shared is named "Shared services across departments".

Plus ITDT, which owns the sandbox and SPARK projects.
"""
import csv, os, re

CYBER, SHARED, SUPPORT, ITDT, OTHER = 'cyber', 'shared', 'support', 'itdt', 'other'

# what the project is, for the type column and the shared-services highlight
INFRA, SEC, APP = 'infra', 'sec', 'app'
KIND_NAMES = {INFRA: ('Infrastructure', 'بنية تحتية'),
              SEC:   ('Cybersecurity', 'أمن سيبراني'),
              APP:   ('Application', 'تطبيق')}

# the marketplace security appliances run as VMs inside the shared network platform,
# so they sit in the shared bucket by project while being a cybersecurity solution
APPLIANCE_PREFIXES = ('F5 BIG-IP', 'FortiGate')

# project id (lowercased, stripped) -> bucket
MAP = {
    # (a) cybersecurity
    '':                              CYBER,   # [Charges not specific to a project]
    'moe-secops-484408':             CYBER,
    'prj-moenergy-prd-security-kms': CYBER,
    'prj-moenergy-dev-security-kms': CYBER,
    # (c) shared platform and landing zone: every department runs on it
    'prj-moenergy-prd-hub':           SHARED,
    'prj-moenergy-dmz-host':          SHARED,
    'prj-moenergy-dmz-srv':           SHARED,
    'prj-moenergy-prd-host':          SHARED,
    'prj-moenergy-dev-host':          SHARED,
    'prj-moenergy-test-host':         SHARED,
    'prj-moenergy-bootstrap':         SHARED,
    'prj-moenergy-billexp':           SHARED,
    'prj-moenergy-migration-host-hq': SHARED,
    # (b) infrastructure applications
    'prj-moenergy-prd-data-dbs':     SUPPORT,
    'prj-moenergy-dev-data-dbs':     SUPPORT,
    'prj-moenergy-prd-bs-devops':    SUPPORT,
    'prj-moenergy-dev-bs-devops':    SUPPORT,
    'prj-moenergy-prd-infra-mngeng': SUPPORT,
    'prj-moenergy-prd-bc-centlogs':  SUPPORT,
    'prj-moenergy-dev-centlogs':     SUPPORT,
    'prj-moenergy-prd-bc-website':   SUPPORT,
    # ITDT: the sandbox and SPARK
    'prj-moenergy-iw-sb-development': ITDT,
    'prj-moenergy-iw-it-dtgd-ad-ne':  ITDT,
    'prj-moenergy-iw-spark-admin':    ITDT,
    # other (Majid, 4 Aug 2026)
    'moe-notebooklm':                 OTHER,
}

# project id -> (English label, Arabic label, kind)
LABELS = {
    '':                               ('Account-level security charges', 'رسوم أمن على مستوى الحساب', SEC),
    'moe-secops-484408':              ('Security operations', 'عمليات الأمن السيبراني', SEC),
    'prj-moenergy-prd-security-kms':  ('Key management (production)', 'إدارة المفاتيح (الإنتاج)', SEC),
    'prj-moenergy-dev-security-kms':  ('Key management (development)', 'إدارة المفاتيح (التطوير)', SEC),
    'prj-moenergy-prd-hub':           ('Shared network hub and landing zone', 'منصة الشبكة المشتركة ومنطقة الهبوط', INFRA),
    'prj-moenergy-dmz-host':          ('DMZ network host', 'مضيف شبكة المنطقة منزوعة السلاح', INFRA),
    'prj-moenergy-dmz-srv':           ('DMZ servers', 'خوادم المنطقة منزوعة السلاح', INFRA),
    'prj-moenergy-prd-host':          ('Landing zone host (production)', 'مضيف منطقة الهبوط (الإنتاج)', INFRA),
    'prj-moenergy-dev-host':          ('Landing zone host (development)', 'مضيف منطقة الهبوط (التطوير)', INFRA),
    'prj-moenergy-test-host':         ('Landing zone host (test)', 'مضيف منطقة الهبوط (الاختبار)', INFRA),
    'prj-moenergy-bootstrap':         ('Landing zone bootstrap', 'تأسيس منطقة الهبوط', INFRA),
    'prj-moenergy-billexp':           ('Billing export', 'تصدير بيانات الفوترة', INFRA),
    'prj-moenergy-migration-host-hq': ('Migration landing zone (HQ)', 'منطقة هبوط الترحيل (المقر)', INFRA),
    'prj-moenergy-prd-data-dbs':      ('Database platform (production)', 'منصة قواعد البيانات (الإنتاج)', INFRA),
    'prj-moenergy-dev-data-dbs':      ('Database platform (development)', 'منصة قواعد البيانات (التطوير)', INFRA),
    'prj-moenergy-prd-bs-devops':     ('DevOps pipeline (production)', 'خط DevOps (الإنتاج)', INFRA),
    'prj-moenergy-dev-bs-devops':     ('DevOps pipeline (development)', 'خط DevOps (التطوير)', INFRA),
    'prj-moenergy-prd-infra-mngeng':  ('Infrastructure management engine', 'محرك إدارة البنية التحتية', INFRA),
    'prj-moenergy-prd-bc-centlogs':   ('Central logging (production)', 'السجلات المركزية (الإنتاج)', INFRA),
    'prj-moenergy-dev-centlogs':      ('Central logging (development)', 'السجلات المركزية (التطوير)', INFRA),
    'prj-moenergy-prd-bc-website':    ('Ministry website', 'الموقع الإلكتروني للوزارة', APP),
    'prj-moenergy-iw-sb-development': ('AI sandbox', 'بيئة تجارب الذكاء الاصطناعي', INFRA),
    'prj-moenergy-iw-it-dtgd-ad-ne':  ('Notification Center workspace', 'مساحة عمل مركز الإشعارات', INFRA),
    'prj-moenergy-iw-spark-admin':    ('SPARK administration', 'إدارة منصة شرارة', INFRA),
    'moe-notebooklm':                 ('NotebookLM AI pilot', 'تجربة NotebookLM للذكاء الاصطناعي', APP),
}
# the security appliances are carved out of the hub row so the type column stays honest
HUB = 'prj-moenergy-prd-hub'
APPLIANCE_LABEL = ('Security appliances inside the hub (F5 BIG-IP, FortiGate)',
                   'أجهزة الأمن داخل المنصة المشتركة (F5 BIG-IP وFortiGate)', SEC)

ORDER = [CYBER, SHARED, SUPPORT, ITDT, OTHER]
NAMES = {
    CYBER:   ('Cybersecurity Department', 'إدارة الأمن السيبراني'),
    SHARED:  ('Shared services across departments', 'خدمات مشتركة بين الإدارات'),
    SUPPORT: ('Support Services GD', 'الإدارة العامة لخدمات الدعم'),
    ITDT:    ('IT and Digital Transformation', 'تقنية المعلومات والتحول الرقمي'),
    OTHER:   ('Other', 'أخرى'),
}
PAL = {CYBER: '#113879', SHARED: '#0180E9', SUPPORT: '#00A3A8', ITDT: '#E85A30', OTHER: '#8B96AC'}

# projects that stood up, or grew sharply, as business applications began moving to GCP
MIGRATION = ['prj-moenergy-migration-host-hq', 'prj-moenergy-prd-data-dbs',
             'prj-moenergy-dev-data-dbs', 'prj-moenergy-prd-bs-devops',
             'prj-moenergy-dev-bs-devops', 'prj-moenergy-prd-infra-mngeng',
             'prj-moenergy-test-host']


def read(path):
    """[{'name','pid','net','chg'}] from a by-project Reports CSV, totals dropped."""
    out = []
    with open(path, encoding='utf-8-sig') as fh:
        for r in csv.DictReader(fh):
            name = (r.get('Project name') or '').strip()
            pid = (r.get('Project ID') or '').strip().lower()
            if not name and not pid:
                continue            # the trailing total rows
            try:
                net = round(float(r['Subtotal ($)']), 2)
            except (TypeError, ValueError):
                continue
            if abs(net) < 0.005:
                net = 0.0
            out.append({'name': name, 'pid': pid, 'net': net,
                        'chg': (r.get('Percent change in subtotal compared to previous period') or '').strip()})
    return out


def split(rows):
    """-> ([(bucket, net)] in ORDER, [unmapped rows])"""
    tot = {k: 0.0 for k in ORDER}
    unknown = []
    for r in rows:
        b = MAP.get(r['pid'])
        if b is None:
            unknown.append(r)
            continue
        tot[b] += r['net']
    parts = [(k, round(tot[k], 2)) for k in ORDER if round(tot[k], 2) > 0]
    parts.sort(key=lambda t: -t[1])          # largest first, colours stay keyed to the bucket
    return parts, unknown


# Service lines that map to exactly one bucket, verified to the cent against the
# by-project export in all three periods that have one (July, H1, contract to date).
SERVICE_MAP = {
    'Chronicle':               CYBER,   # the account-level security bucket
    'Security Command Center':  CYBER,
    'Fortinet Security SaaS':   CYBER,
    'Cloud Pub/Sub':            CYBER,   # = MOE-SECOPS, to the cent
    'Vertex AI Search':         OTHER,   # = moe-notebooklm, to the cent
}


def from_services(service_rows, residual_mix):
    """A department split for a period with no by-project export.

    Everything that a service line pins to one department is taken from this
    period's own numbers. Only the shared infrastructure residual (compute,
    network, storage, logging) is apportioned, on the mix of the period that
    does have a by-project export and contains this one. Returns
    ([(bucket, net)], exact_total, residual_total).
    """
    tot = {k: 0.0 for k in ORDER}
    net = 0.0
    exact = 0.0
    for r in service_rows:
        net += r['net']
        b = SERVICE_MAP.get(r['name'])
        if b is None and r['name'].startswith(APPLIANCE_PREFIXES):
            b = SHARED
        if b is not None:
            tot[b] += r['net']
            exact += r['net']
    residual = round(net - exact, 2)
    if residual > 0:
        for b, share in residual_mix.items():
            tot[b] += residual * share
    parts = [(k, round(tot[k], 2)) for k in ORDER if round(tot[k], 2) > 0]
    parts.sort(key=lambda t: -t[1])
    return parts, round(exact, 2), max(residual, 0.0)


def residual_mix(proj_rows, service_rows):
    """How the infrastructure residual actually divided, in a period that has
    a by-project export. Used as the apportionment basis for the periods inside it."""
    parts, _ = split(proj_rows)
    got = dict(parts)
    exact = {k: 0.0 for k in ORDER}
    for r in service_rows:
        b = SERVICE_MAP.get(r['name'])
        if b is None and r['name'].startswith(APPLIANCE_PREFIXES):
            b = SHARED
        if b is not None:
            exact[b] += r['net']
    resid = {k: max(got.get(k, 0.0) - exact[k], 0.0) for k in ORDER}
    total = sum(resid.values())
    return {k: v / total for k, v in resid.items() if v > 0} if total else {}


def appliances(service_rows):
    """Net spend on the marketplace security appliances, from the by-service export.

    They are billed as VMs inside the shared network platform, so by project they
    land in the shared bucket while being a cybersecurity solution. No other shared
    project is large enough to hold them, which is what pins them to the hub.
    """
    return round(sum(r['net'] for r in service_rows
                     if r['name'].startswith(APPLIANCE_PREFIXES)), 2)


def detail_rows(rows, appliance_net=0.0):
    """[(bucket, label_en, label_ar, kind, net)] sorted by department then size,
    with the hub split into its platform and its security appliances."""
    out = []
    for r in rows:
        b = MAP.get(r['pid'])
        if b is None or r['net'] <= 0:
            continue
        en, ar, kind = LABELS[r['pid']]
        if r['pid'] == HUB and appliance_net > 0:
            out.append((b, APPLIANCE_LABEL[0], APPLIANCE_LABEL[1], APPLIANCE_LABEL[2], appliance_net))
            out.append((b, en, ar, kind, round(r['net'] - appliance_net, 2)))
        else:
            out.append((b, en, ar, kind, r['net']))
    rank = {k: i for i, k in enumerate(ORDER)}
    out.sort(key=lambda t: (rank[t[0]], -t[4]))
    return out
