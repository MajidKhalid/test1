# -*- coding: utf-8 -*-
"""Project to general-department mapping, from Majid's rules (4 Aug 2026).

Four departments, each owning named applications rather than a shared pool:

  Cybersecurity Department  the security monitoring platform (Chronicle, Security
                            Command Center) and security operations
  IT Services GD            every platform and appliance IT Services operates,
                            including F5, FortiGate and Fortinet, key management,
                            the landing zone, databases, pipelines and logging
  Business departments      applications a business department owns; this bucket
                            is split per department once the ownership map exists
  Other                     everything else, today the NotebookLM AI pilot

The account-level bucket [Charges not specific to a project] carries no project ID
but equals its security service lines to the cent, so split() divides it by service.
"""
import csv, os, re

CYBER, ITSVC, BUSINESS, OTHER = 'cyber', 'itsvc', 'business', 'other'

# what the project is, for the type column and the shared-services highlight
INFRA, SEC, APP = 'infra', 'sec', 'app'
KIND_NAMES = {INFRA: ('Infrastructure', 'بنية تحتية'),
              SEC:   ('Cybersecurity', 'أمن سيبراني'),
              APP:   ('Application', 'تطبيق')}

# the marketplace security appliances run as VMs inside the network platform that
# IT Services GD operates, so they are its spend while being a security solution
APPLIANCE_PREFIXES = ('F5 BIG-IP', 'FortiGate')

# project id (lowercased, stripped) -> bucket
MAP = {
    # Cybersecurity: the security monitoring platform and security operations.
    # The account-level bucket is split by service, see split(): Chronicle and
    # Security Command Center are Cybersecurity, Fortinet Security SaaS is not.
    '':                              CYBER,
    'moe-secops-484408':             CYBER,
    # IT Services GD: every platform and appliance it operates, including the
    # network security appliances (F5, FortiGate, Fortinet) and key management
    'prj-moenergy-prd-security-kms':  ITSVC,
    'prj-moenergy-dev-security-kms':  ITSVC,
    'prj-moenergy-prd-hub':           ITSVC,
    'prj-moenergy-dmz-host':          ITSVC,
    'prj-moenergy-dmz-srv':           ITSVC,
    'prj-moenergy-prd-host':          ITSVC,
    'prj-moenergy-dev-host':          ITSVC,
    'prj-moenergy-test-host':         ITSVC,
    'prj-moenergy-bootstrap':         ITSVC,
    'prj-moenergy-billexp':           ITSVC,
    'prj-moenergy-migration-host-hq': ITSVC,
    'prj-moenergy-prd-data-dbs':      ITSVC,
    'prj-moenergy-dev-data-dbs':      ITSVC,
    'prj-moenergy-prd-bs-devops':     ITSVC,
    'prj-moenergy-dev-bs-devops':     ITSVC,
    'prj-moenergy-prd-infra-mngeng':  ITSVC,
    'prj-moenergy-prd-bc-centlogs':   ITSVC,
    'prj-moenergy-dev-centlogs':      ITSVC,
    'prj-moenergy-iw-sb-development': ITSVC,
    'prj-moenergy-iw-it-dtgd-ad-ne':  ITSVC,
    'prj-moenergy-iw-spark-admin':    ITSVC,
    # Business: applications a business department owns
    'prj-moenergy-prd-bc-website':    BUSINESS,
    # Other (Majid, 4 Aug 2026)
    'moe-notebooklm':                 OTHER,
}

# the account-level bucket has no project ID; these of its service lines belong
# to IT Services GD rather than to Cybersecurity
ACCOUNT_ITSVC_SERVICES = ('Fortinet Security SaaS',)

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

ORDER = [CYBER, ITSVC, BUSINESS, OTHER]
NAMES = {
    CYBER:    ('Cybersecurity Department', 'إدارة الأمن السيبراني'),
    ITSVC:    ('IT Services GD', 'الإدارة العامة لخدمات تقنية المعلومات'),
    BUSINESS: ('Business departments', 'الإدارات المعنية بالأعمال'),
    OTHER:    ('Other', 'أخرى'),
}
PAL = {CYBER: '#113879', ITSVC: '#0180E9', BUSINESS: '#00A3A8', OTHER: '#8B96AC'}

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


def account_itsvc(service_rows):
    """The part of the account-level bucket that is IT Services GD, not Cybersecurity."""
    return round(sum(r['net'] for r in service_rows
                     if r['name'] in ACCOUNT_ITSVC_SERVICES), 2)


def split(rows, service_rows=()):
    """-> ([(bucket, net)] in ORDER, [unmapped rows])"""
    tot = {k: 0.0 for k in ORDER}
    unknown = []
    for r in rows:
        b = MAP.get(r['pid'])
        if b is None:
            unknown.append(r)
            continue
        tot[b] += r['net']
    # the account-level bucket is not all Cybersecurity: its Fortinet platform line
    # is an appliance IT Services GD operates
    move = account_itsvc(service_rows)
    if move:
        tot[CYBER] -= move
        tot[ITSVC] += move
    # every department keeps its legend row, including the ones at zero, so the
    # reader can see that a department carried nothing rather than wonder
    parts = [(k, max(round(tot[k], 2), 0.0)) for k in ORDER]
    parts.sort(key=lambda t: -t[1])          # largest first, colours stay keyed to the bucket
    return parts, unknown


# Service lines that map to exactly one bucket, verified to the cent against the
# by-project export in all three periods that have one (July, H1, contract to date).
SERVICE_MAP = {
    'Chronicle':                CYBER,   # part of the account-level security bucket
    'Security Command Center':  CYBER,
    'Cloud Pub/Sub':            CYBER,   # = MOE-SECOPS, to the cent
    'Fortinet Security SaaS':   ITSVC,   # an appliance platform IT Services operates
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
            b = ITSVC
        if b is not None:
            tot[b] += r['net']
            exact += r['net']
    residual = round(net - exact, 2)
    if residual > 0:
        for b, share in residual_mix.items():
            tot[b] += residual * share
    parts = [(k, max(round(tot[k], 2), 0.0)) for k in ORDER]
    parts.sort(key=lambda t: -t[1])
    return parts, round(exact, 2), max(residual, 0.0)


def residual_mix(proj_rows, service_rows):
    """How the infrastructure residual actually divided, in a period that has
    a by-project export. Used as the apportionment basis for the periods inside it."""
    parts, _ = split(proj_rows, service_rows)
    got = dict(parts)
    exact = {k: 0.0 for k in ORDER}
    for r in service_rows:
        b = SERVICE_MAP.get(r['name'])
        if b is None and r['name'].startswith(APPLIANCE_PREFIXES):
            b = ITSVC
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


ACCOUNT_LABEL = ('Security monitoring platform (Chronicle, Security Command Center)',
                 'منصة مراقبة الأمن (Chronicle وSecurity Command Center)', SEC)
FORTINET_LABEL = ('Fortinet security platform (SaaS)', 'منصة Fortinet الأمنية (خدمة سحابية)', SEC)


def detail_rows(rows, appliance_net=0.0, account_move=0.0):
    """[(bucket, label_en, label_ar, kind, net)] sorted by department then size.
    The hub is split into its platform and its appliances, and the account-level
    bucket into the security monitoring platform and the Fortinet platform, so
    every line names one owner and one kind of solution."""
    out = []
    for r in rows:
        b = MAP.get(r['pid'])
        if b is None or r['net'] <= 0:
            continue
        en, ar, kind = LABELS[r['pid']]
        if r['pid'] == HUB and appliance_net > 0:
            out.append((b, APPLIANCE_LABEL[0], APPLIANCE_LABEL[1], APPLIANCE_LABEL[2], appliance_net))
            out.append((b, en, ar, kind, round(r['net'] - appliance_net, 2)))
        elif r['pid'] == '' and account_move > 0:
            out.append((ITSVC, FORTINET_LABEL[0], FORTINET_LABEL[1], FORTINET_LABEL[2], account_move))
            out.append((b, ACCOUNT_LABEL[0], ACCOUNT_LABEL[1], ACCOUNT_LABEL[2],
                        round(r['net'] - account_move, 2)))
        elif r['pid'] == '':
            out.append((b, ACCOUNT_LABEL[0], ACCOUNT_LABEL[1], ACCOUNT_LABEL[2], r['net']))
        else:
            out.append((b, en, ar, kind, r['net']))
    rank = {k: i for i, k in enumerate(ORDER)}
    out.sort(key=lambda t: (rank[t[0]], -t[4]))
    return out
