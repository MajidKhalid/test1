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

CYBER, SHARED, SUPPORT, ITDT = 'cyber', 'shared', 'support', 'itdt'

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
    # ITDT: the sandbox, SPARK and the AI pilots
    'prj-moenergy-iw-sb-development': ITDT,
    'prj-moenergy-iw-it-dtgd-ad-ne':  ITDT,
    'prj-moenergy-iw-spark-admin':    ITDT,
    'moe-notebooklm':                 ITDT,
}

ORDER = [CYBER, SHARED, SUPPORT, ITDT]
NAMES = {
    CYBER:   ('Cybersecurity Department', 'إدارة الأمن السيبراني'),
    SHARED:  ('Shared services across departments', 'خدمات مشتركة بين الإدارات'),
    SUPPORT: ('Support Services GD', 'الإدارة العامة لخدمات الدعم'),
    ITDT:    ('IT and Digital Transformation', 'تقنية المعلومات والتحول الرقمي'),
}
PAL = {CYBER: '#113879', SHARED: '#0180E9', SUPPORT: '#00A3A8', ITDT: '#E85A30'}

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
