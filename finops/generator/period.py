"""Turn a Reports-by-service CSV into the numbers the dashboard states.
Validated against the July 2026 view that is already published."""
import csv, os

def read(path):
    rows=[]
    with open(path, encoding='utf-8-sig', newline='') as f:
        for r in csv.DictReader(f):
            n=(r.get('Service description') or '').strip()
            if not n: continue
            f2=lambda k: float((r.get(k) or '0').replace(',','') or 0)
            rows.append(dict(name=n, gross=f2('List cost ($)'), net=f2('Subtotal ($)'),
                             neg=f2('Negotiated savings ($)'), sav=f2('Savings programs ($)'),
                             oth=f2('Other savings ($)'),
                             chg=(r.get('Percent change in subtotal compared to previous period') or '').strip()))
    return rows

def summarise(rows, top=4):
    gross=sum(r['gross'] for r in rows); net=sum(r['net'] for r in rows)
    rows=sorted(rows, key=lambda r:-r['net'])
    head=rows[:top]; tail=rows[top:]
    out=[dict(name=r['name'], net=r['net'], share=r['net']/net if net else 0, chg=r['chg']) for r in head]
    if tail:
        out.append(dict(name='Other (%d services)'%len(tail), net=sum(r['net'] for r in tail),
                        share=sum(r['net'] for r in tail)/net if net else 0, chg='n/a'))
    return dict(gross=gross, net=net, discounts=gross-net,
                discountsCarried=sum(abs(r['neg'])+abs(r['sav'])+abs(r['oth']) for r in rows)>0.005,
                services=len(rows), top=out)

if __name__=='__main__':
    B='gcpdata/GCP Monthly Reports'
    cases=[('July 2026 (published)', 'July/by service/cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-07-01 #U2014 2026-07-31.csv'),
           ('July sandbox (published)','July/SPARK/cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-07-01 #U2014 2026-07-31.csv'),
           ('H1 2026 (published)',   'July/by service/cntxt-ministry.of.energy-moenergy.gov.sa-002_Reports, 2026-01-01 #U2014 2026-06-30 (1).csv')]
    for label, p in cases:
        s=summarise(read(os.path.join(B,p)))
        print('%s' % label)
        print('   net $%s   gross $%s   discounts $%s   discounts in file: %s'
              % (format(round(s['net']),',d'), format(round(s['gross']),',d'),
                 format(round(s['discounts']),',d'), s['discountsCarried']))
        for t in s['top']:
            print('      %-46s $%-11s %4.0f%%  %s' % (t['name'][:46], format(round(t['net']),',d'), t['share']*100, t['chg']))
        print()
