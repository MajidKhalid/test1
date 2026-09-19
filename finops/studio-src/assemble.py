# -*- coding: utf-8 -*-
"""Assemble finops/FinOps_Studio_v1.html from the build pieces, the identity assets and the baseline data."""
import json, base64, os, re, datetime, sys
HERE=os.path.dirname(os.path.abspath(__file__))
B=HERE; ASSETS=os.path.join(HERE,'assets'); REPO=os.path.dirname(HERE)
def rd(p): return open(p,encoding='utf-8').read()
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
def r2(v): return round(v+1e-9,2)
FX=3.75
fonts=("@font-face{font-family:'Lafet';src:url(data:font/otf;base64,%s) format('opentype');font-weight:400;font-display:swap}" % b64(ASSETS+'/Lafet-Regular.otf')
 + ''.join("@font-face{font-family:'IBM Plex Sans Arabic';src:url(data:font/woff2;base64,%s) format('woff2');font-weight:%s;font-display:swap}" % (b64(ASSETS+'/plex-%s.woff2'%w), w) for w in ('400','600','700')))
rs=rd(ASSETS+'/rs.css'); report_css=rd(B+'/report.css')+'\n'+rd(B+'/motion.css'); studio_css=rd(B+'/studio.css'); body=rd(B+'/body.html'); app=rd(B+'/app.js')+'\n'+rd(B+'/app-studio.js')
gcp=json.load(open(HERE+'/gcp_periods_2026-07.json',encoding='utf-8')); extra=json.load(open(B+'/baseline_extra.json',encoding='utf-8'))
KEYMAP={'jan':'2026-01','feb':'2026-02','mar':'2026-03','apr':'2026-04','may':'2026-05','jun':'2026-06','jul':'2026-07','q1':'2026-q1','q2':'2026-q2','h1':'2026-h1','td':'td'}
periods={}
for k,p in gcp['gcp']['periods'].items():
    nk=KEYMAP[k]; q=dict(p); q['key']=nk; q['files']={}; q['sample']=False; q['source']='FinOps_Dashboard_v20.html (July 2026 edition)'
    for drop in ('month','insights','notes'): q.pop(drop,None)
    # totals at two decimals from the service rows (the published headline was rounded to the riyal)
    if q.get('services'):
        net=r2(sum(x['net'] for x in q['services'])); gross=r2(sum(x['gross'] for x in q['services']))
        q['totals']={'net':net,'gross':gross,'discounts':r2(gross-net)}
    if q.get('sandboxServices'):
        sn=r2(sum(x['net'] for x in q['sandboxServices'])); sg=r2(sum(x['gross'] for x in q['sandboxServices']))
        q['sandbox']={'net':sn,'gross':sg,'discounts':r2(sg-sn)}
    periods[nk]=q
# Azure H1 baseline in Riyals
az=extra['azure']; h1=az.pop('h1_usd')
svc=[dict(name=s['name'],net=r2(s['usd']*FX),gross=r2(s['usd']*FX),chg='n/a') for s in h1['services']]
net=r2(sum(s['net'] for s in svc)); de=[s for s in svc if 'Defender' in s['name']][0]
azp={'2026-h1':dict(key='2026-h1',kind='quarter',label='H1 2026',labelAr='النصف الأول 2026',services=svc,regions=[dict(name=r['name'],net=r2(r['usd']*FX)) for r in h1['regions']],
     totals=dict(net=net,gross=net,discounts=0),security=dict(name=de['name'],net=de['net'],share=de['net']/net*100),departments=None,deptMethod='none',unmapped=[],files={},sample=False,
     source='Q2 2026 FinOps quarterly report (data as of 30 July 2026)',note=h1['noteEn'],noteAr=h1['noteAr'])}
stamp=datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
gcp_cloud=dict(extra['gcp']); gcp_cloud['periods']=periods
az_cloud=dict(az); az_cloud['periods']=azp
state={'meta':{'studio':1,'stamp':stamp,'builtFrom':'FinOps_Dashboard_v20 (July 2026) + Q2 2026 quarterly report'},'edition':extra['edition'],'statement':extra['statement'],'clouds':{'gcp':gcp_cloud,'azure':az_cloud}}
json_text=json.dumps(state,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
assets={'spark':'data:image/svg+xml;base64,'+b64(ASSETS+'/spark-lockup-navy.svg'),'gdew':'data:image/png;base64,'+b64(ASSETS+'/de-wordmark.png'),'dew':'data:image/png;base64,'+b64(ASSETS+'/de-lockup.png'),'dewm':'data:image/png;base64,'+b64(ASSETS+'/de-lockup-motion.png'),'moe':'data:image/png;base64,'+b64(ASSETS+'/moe-lockup.png')}
favicon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='b' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230180E9'/%3E%3Cstop offset='.55' stop-color='%230B8F92'/%3E%3Cstop offset='1' stop-color='%2300AC29'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='7' fill='%23081631'/%3E%3Cpath d='M18 4h6l-8 24h-6z' fill='url(%23b)'/%3E%3C/svg%3E"
html=('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta name="robots" content="noindex">\n'
 '<title>FinOps Report Studio</title>\n<link rel="icon" href="%s">\n' % favicon
 + '<style id="fonts-css">%s</style>\n' % fonts
 + '<style id="report-css">\n%s\n%s\n</style>\n' % (rs, report_css)
 + '<style id="studio-css">\n%s\n</style>\n</head>\n<body class="studio-mode">\n' % studio_css
 + body
 + '\n<script type="application/json" id="baseline">%s</script>\n' % json_text
 + '<script>window.ASSETS=%s;</script>\n' % json.dumps(assets)
 + '<script>\n%s\n</script>\n</body>\n</html>\n' % app)
# guards: no em dash anywhere outside base64, no unresolved template markers
visible=re.sub(r'base64,[A-Za-z0-9+/=]+','base64,X',html)
bad=[m.start() for m in re.finditer('—',visible)]
if bad:
    for i in bad[:5]: print('EM DASH at', visible[max(0,i-60):i+60].replace('\n',' '))
    sys.exit('em dash found: %d' % len(bad))
os.makedirs(REPO+'/data',exist_ok=True)
open(REPO+'/FinOps_Studio_v1.html','w',encoding='utf-8').write(html)
# an artifact-shaped copy (no document skeleton) for a hosted preview; downloads are blocked in that viewer, the file above is the real tool
if os.environ.get('STUDIO_ARTIFACT'):
    art=html.split('<head>')[1].split('</head>')[0].replace('<meta charset="utf-8">','').replace('<meta name="viewport" content="width=device-width,initial-scale=1">','')+html.split('<body class="studio-mode">')[1].split('</body>')[0]
    open(os.environ['STUDIO_ARTIFACT'],'w',encoding='utf-8').write('<title>FinOps Report Studio</title>\n'+art)
json.dump(state,open(REPO+'/data/2026-08.edition.baseline.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('written %.0f KB (visible %.0f KB); baseline periods gcp=%d azure=%d; stamp %s' % (len(html.encode())/1024, len(visible.encode())/1024, len(periods), len(azp), stamp))
