(()=>{const D=window.TRIP_DATA,B=window.URGENT_BUILD;if(!D||!B)return;
const AF=["id","slot","slotLabel","kind","recommended","selected","day","time","order","name","city","category","lat","lng","description","relation","history","source","url","img"];
const FF=["id","name","route","depart","arrive","duration","price","priceScore","durationScore","timingScore","tag","book","note","self","hub","protected","overall"];
const SF=["id","name","type","tag","hybrid","guests","rating","note","lat","lng","url","experience","privacy","priceScore","priceTier","score"];
D.activities=B.activityRows.map(r=>B.obj(AF,r));
D.activities.forEach(a=>{const join=a.url.includes('?')?'&':'?';D.images[a.img]=[B.shot(`${a.url}${join}trip_preview=${encodeURIComponent(a.id)}`)]});
D.flights=B.flightRows.map(r=>B.obj(FF,r));
const by=id=>D.staySegments.find(s=>s.id===id),t=by('tunisRiad'),h=by('hammametBeach'),f=by('finalHybrid');
if(t)Object.assign(t,{label:'Tunis · first two nights',dates:'Nights 1–2 · 18–19 Sep',badge:'MEDINA / PRIVATE DAR'});
if(h)Object.assign(h,{label:'Hammamet · two beach nights',dates:'Nights 5–6 · 22–23 Sep',badge:'PRIVATE BEACH STAY'});
if(f)Object.assign(f,{label:'Sidi Bou Said / Tunis · final night',dates:'Night 7 · 24 Sep',badge:'FINAL COASTAL / AIRPORT BASE'});
const central={id:'centralBase',label:'Sousse / Kairouan · two nights',dates:'Nights 3–4 · 20–21 Sep',badge:'CENTRAL TUNISIA BASE',default:'central-split-koraich-antonia',options:B.centralRows.map(r=>{const o=B.obj(SF,r);o.images=[B.shot(`${o.url}${o.url.includes('?')?'&':'?'}stay_preview=${encodeURIComponent(o.id)}`)];return o})};
D.staySegments=[t,central,h,f].filter(Boolean);
try{JSON.parse(localStorage.getItem('tn-wa-suggestions-v1')||'[]').forEach(o=>{const s=D.staySegments.find(x=>x.id===o.segment);if(s&&!s.options.some(x=>x.id===o.id))s.options.unshift(o)})}catch(e){}
const add=[
['Turkish Airlines — Riyadh to Tunis','https://www.turkishairlines.com/en-sa/flights-from-riyadh-to-tunis'],
['Flynas XY299 schedule','https://www.flight.info/XY299'],
['Turkish Airlines TK657 schedule','https://www.flight.info/TK657'],
['Qatar Airways — booking','https://www.qatarairways.com/'],
['Jeddah–Tunis schedules','https://www.wego.com/schedules/jed/tun/flight-schedules-from-jeddah-to-tunis'],
['Dar Antonia — Sousse Medina','https://darantonia.com/'],
['Dar Koraich — Kairouan','https://darkoraich.com/'],
['Dar Alouini — Kairouan','https://dar-alouini.com/index.html'],
['Dar Dhiafa Klee — Kairouan','https://www.dardhiafaklee.com/'],
['Dar Djamila — Kairouan','https://www.dardjamila.com/'],
['Dar Omi — Sousse','https://www.daromi-bnb.com/'],
['VIPCAR Tunisia — premium SUV quote','https://vipcar.com.tn/en/services/rental'],
['BMW X5 Tunis airport rental search','https://bookingauto.com/en/tunisia/tunis-airport/bmw-x5']
];
const seen=new Set((D.sources||[]).map(s=>s[1]));D.sources=[...(D.sources||[]),...add.filter(s=>!seen.has(s[1]))];
delete window.URGENT_BUILD;
})();