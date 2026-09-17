(()=>{const D=window.TRIP_DATA;if(!D)return;
window.URGENT_BUILD={obj:(k,r)=>Object.fromEntries(k.map((x,i)=>[x,r[i]])),shot:u=>`https://image.thum.io/get/width/900/crop/650/noanimate/${encodeURIComponent(u)}`,activityRows:[],flightRows:[],centralRows:[]};
D.datePresets=[
 {id:'original',label:'Primary trip · depart Fri 18 Sep, return Fri 25 Sep',start:'2026-09-18',end:'2026-09-25'},
 {id:'backup',label:'One-day fallback · depart Sat 19 Sep, return Sat 26 Sep',start:'2026-09-19',end:'2026-09-26'}
];
D.days=[
 ["D1","Fri 18 Sep","Fly Riyadh → Tunis + late check-in","tunisRiad"],
 ["D2","Sat 19 Sep","Tunis history, food and local shopping","tunisRiad"],
 ["D3","Sun 20 Sep","Tunis → Kairouan → Sousse","centralBase"],
 ["D4","Mon 21 Sep","Second central-Tunisia day: Sousse / Kairouan / Monastir","centralBase"],
 ["D5","Tue 22 Sep","El Jem or Mahdia → Hammamet beach base","hammametBeach"],
 ["D6","Wed 23 Sep","Hammamet, Nabeul and beach time","hammametBeach"],
 ["D7","Thu 24 Sep","Return north + Sidi Bou Said / Tunis","finalHybrid"],
 ["D8","Fri 25 Sep","Airport + Riyadh",null]
].map(r=>window.URGENT_BUILD.obj(["id","date","title","overnight"],r));
D.fixed=[
 ["arrive","D1","22:45",1,"Tunis–Carthage Airport arrival","airport",36.851,10.2272,"The best match to your 16:00 preference is the Istanbul pattern: RUH 16:05, IST 19:55, then IST 21:50 to TUN 22:45. Book it only when the full journey is protected on one ticket/PNR."],
 ["to-kairouan","D3","08:00",1,"Tunis → Kairouan","transfer",35.681,10.102,"Check out with luggage and drive south. Keep the selected luxury SUV for the full trip."],
 ["to-sousse","D3","15:00",70,"Kairouan → Sousse / central base","transfer",35.827,10.638,"Continue to the selected Sousse or Kairouan base for the first of two central-Tunisia nights."],
 ["central-night-two","D4","Night",98,"Second night in Sousse / Kairouan","stay",35.8268,10.6378,"Stay a second central-Tunisia night; choose Sousse for coast and easier logistics, or Kairouan for deeper historical immersion."],
 ["to-eljem","D5","08:30",1,"Sousse / Kairouan → El Jem or Mahdia","transfer",35.2964,10.7069,"Choose the Roman amphitheatre or a coastal Mahdia route before continuing north."],
 ["to-hammamet","D5","16:00",85,"Continue to Hammamet","transfer",36.405,10.608,"Check into the selected private beach stay for two nights."],
 ["north-final","D7","09:00",1,"Hammamet → Sidi Bou Said / Tunis","transfer",36.8698,10.3414,"Return north for the final night, airport proximity and last Tunis activities."],
 ["depart","D8","Flight",90,"Tunis–Carthage Airport","airport",36.851,10.2272,"Return flight to Riyadh. Recheck the final arrival date, baggage and connection protection before payment."]
].map(r=>window.URGENT_BUILD.obj(["id","day","time","order","name","category","lat","lng","description"],r));
})();