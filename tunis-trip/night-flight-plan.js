(()=>{
const D=window.TRIP_DATA;
if(!D)return;
const obj=(id,date,title,overnight)=>({id,date,title,overnight});

D.days=[
 obj('D1','Fri 18 Sep','Night flight from Riyadh',null),
 obj('D2','Sat 19 Sep','Arrive Tunis + first Tunis day','tunisRiad'),
 obj('D3','Sun 20 Sep','Second Tunis day: history, shopping and dining','tunisRiad'),
 obj('D4','Mon 21 Sep','Tunis → Kairouan → Sousse','centralBase'),
 obj('D5','Tue 22 Sep','Second Sousse / Kairouan day','centralBase'),
 obj('D6','Wed 23 Sep','El Jem or Mahdia → Hammamet','hammametBeach'),
 obj('D7','Thu 24 Sep','Hammamet, Nabeul and beach time','hammametBeach'),
 obj('D8','Fri 25 Sep','Hammamet → Tunis airport → Riyadh',null)
];

const t=D.staySegments.find(s=>s.id==='tunisRiad');
const c=D.staySegments.find(s=>s.id==='centralBase');
const h=D.staySegments.find(s=>s.id==='hammametBeach');
if(t)Object.assign(t,{label:'Tunis · Saturday and Sunday nights',dates:'Nights 1–2 · 19–20 Sep',badge:'MEDINA / PRIVATE DAR'});
if(c)Object.assign(c,{label:'Sousse / Kairouan · Monday and Tuesday nights',dates:'Nights 3–4 · 21–22 Sep',badge:'CENTRAL TUNISIA · TWO NIGHTS'});
if(h)Object.assign(h,{label:'Hammamet · Wednesday and Thursday nights',dates:'Nights 5–6 · 23–24 Sep',badge:'PRIVATE BEACH STAY'});
D.staySegments=[t,c,h].filter(Boolean);

D.fixed=[
 {id:'depart-ruh',day:'D1',time:'20:15',order:1,name:'Depart Riyadh at night',category:'airport',lat:null,lng:null,description:'Preferred pattern: Royal Jordanian RJ737 from Riyadh at 20:15, connecting in Amman to RJ553 and arriving Tunis at 02:15 Saturday. Confirm the full itinerary is issued on one protected ticket.'},
 {id:'arrive-tun',day:'D2',time:'02:15',order:1,name:'Tunis–Carthage Airport arrival',category:'airport',lat:36.851,lng:10.2272,description:'Early Saturday arrival. Use a pre-booked driver, check in immediately and keep the morning light.'},
 {id:'airport-to-tunis',day:'D2',time:'03:00',order:2,name:'Airport → Tunis stay',category:'transfer',lat:36.799,lng:10.171,description:'Transfer directly to the selected Tunis stay. Confirm late-night reception or self check-in before paying.'},
 {id:'to-kairouan',day:'D4',time:'08:00',order:1,name:'Tunis → Kairouan',category:'transfer',lat:35.681,lng:10.102,description:'Check out after two Tunis nights and drive south with luggage in the selected luxury SUV.'},
 {id:'to-sousse',day:'D4',time:'15:30',order:70,name:'Kairouan → Sousse / central base',category:'transfer',lat:35.827,lng:10.638,description:'Continue to the selected Sousse or Kairouan stay for the first of two central-Tunisia nights.'},
 {id:'central-night-two',day:'D5',time:'Night',order:98,name:'Second night in Sousse / Kairouan',category:'stay',lat:35.8268,lng:10.6378,description:'Stay a second central-Tunisia night. Sousse gives coast and easier logistics; Kairouan gives deeper historical immersion.'},
 {id:'to-eljem',day:'D6',time:'08:30',order:1,name:'Sousse / Kairouan → El Jem or Mahdia',category:'transfer',lat:35.2964,lng:10.7069,description:'Choose the amphitheatre or coastal Mahdia route before continuing north.'},
 {id:'to-hammamet',day:'D6',time:'16:00',order:85,name:'Continue to Hammamet',category:'transfer',lat:36.405,lng:10.608,description:'Check into the selected private beach stay for the final two hotel nights.'},
 {id:'airport-return',day:'D8',time:'TBC',order:1,name:'Hammamet → Tunis–Carthage Airport',category:'transfer',lat:36.851,lng:10.2272,description:'Allow roughly 1.5–2 hours for the drive plus the airline check-in buffer. Match the departure time to the selected return flight.'},
 {id:'return-ruh',day:'D8',time:'Flight',order:90,name:'Return to Riyadh',category:'airport',lat:36.851,lng:10.2272,description:'Recheck baggage, connection protection and the final Riyadh arrival date before payment.'}
];

const dayMap={D1:'D2',D2:'D3',D3:'D4',D4:'D5',D5:'D6',D6:'D7',D7:'D3',D8:'D8'};
D.activities.forEach(a=>{
 const oldDay=a.day;
 const newDay=dayMap[oldDay]||oldDay;
 a.day=newDay;
 if(a.slot)a.slot=`${newDay}-${oldDay}-${a.slot}`;
 if(oldDay==='D7')a.slotLabel=`Additional Tunis choice · ${a.slotLabel||a.time}`;
});

const currentFlight=localStorage.getItem('tn-flight-v1');
if(!currentFlight||['turkey-1605','qatar-midday-mix','qatar-unsafe-1540'].includes(currentFlight))localStorage.setItem('tn-flight-v1','rj-evening');

const sources=[
 ['Royal Jordanian RJ737 · Riyadh to Amman','https://www.flight.info/RJ737'],
 ['Royal Jordanian RJ553 · Amman to Tunis','https://www.flight.info/RJ553'],
 ['Flyadeal F3151 · Riyadh to Jeddah','https://www.flight.info/F3151'],
 ['Jeddah to Tunis schedules','https://www.wego.com/schedules/jed/tun/flight-schedules-from-jeddah-to-tunis'],
 ['Doha to Tunis schedules','https://www.wego.com/schedules/doh/tun/flight-schedules-from-doha-to-tunus']
];
const seen=new Set((D.sources||[]).map(x=>x[1]));
D.sources=[...(D.sources||[]),...sources.filter(x=>!seen.has(x[1]))];
})();