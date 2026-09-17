(()=>{
const rows=window.URGENT_BUILD?.flightRows;
if(!Array.isArray(rows))return;
const patch=(id,v)=>{const r=rows.find(x=>x[0]===id);if(!r)return;Object.entries(v).forEach(([i,val])=>r[Number(i)]=val)};

patch('rj-evening',{
 1:'Royal Jordanian night via Amman · RJ737 + RJ553',
 2:'RUH → AMM → TUN',3:'Fri 20:15',4:'Sat 02:15',5:'~8h 00m',
 6:'Live Royal Jordanian through-fare',7:8,8:10,9:10,
 10:'BEST NIGHT + SATURDAY ARRIVAL',11:'https://www.rj.com/',
 12:'Best fit for the new requirement: leave Riyadh at night and land in Tunis early Saturday. RJ737 is scheduled from Riyadh at 20:15 on Friday 18 Sep and RJ553 is scheduled Amman 00:30 → Tunis 02:15 on Saturday. Book as one protected Royal Jordanian itinerary.',
 13:false,14:'AMM',15:true,16:100
});
patch('jeddah-overnight',{
 1:'Flyadeal + Tunisair night via Jeddah · F3151 + TU714',
 2:'RUH → JED → TUN',3:'Fri 21:45',4:'Sat 06:25',5:'~10h 40m',
 6:'Live separate-ticket check',7:7,8:8,9:10,
 10:'PREFERRED HUB · MORNING ARRIVAL',11:'https://www.google.com/travel/flights',
 12:'Night departure and proper Saturday-morning arrival. F3151 is scheduled RUH 21:45 → JED 23:30, then Tunisair TU714 is scheduled JED 03:30 → TUN 06:25. Treat this as a self-transfer unless checkout clearly confirms one protected ticket and through-checked baggage.',
 13:true,14:'JED',15:false,16:93
});
patch('turkish-protected-0145',{
 1:'Turkish Airlines after-midnight via Istanbul · TK141 + onward',
 2:'RUH → IST → TUN',3:'Sat 01:45',4:'Sat ~09:00',5:'~9h 15m',
 6:'Turkish live through-fare',7:7,8:9,9:9,
 10:'PREFERRED HUB · MORNING ARRIVAL',11:'https://www.turkishairlines.com/en-sa/flights-from-riyadh-to-tunis',
 12:'Protected preferred-hub option that reaches Tunis Saturday morning. It technically departs after midnight on Saturday rather than Friday night, so use it only if that date handling is acceptable.',
 13:false,14:'IST',15:true,16:92
});
patch('egyptair-cairo',{
 1:'EgyptAir night via Cairo',2:'RUH → CAI → TUN',3:'Fri ~22:20',4:'Sat ~10:00',5:'~13h 40m',
 6:'Live EgyptAir through-fare',7:7,8:6,9:9,10:'PROTECTED NIGHT BACKUP',
 12:'One-airline night departure with a Saturday-morning arrival. Longer than Amman or the Jeddah pattern, but materially safer than an unprotected self-transfer.',13:false,14:'CAI',15:true,16:86
});
patch('qatar-late-overnight',{
 1:'Qatar Airways night via Doha · QR1173 + QR1399',2:'RUH → DOH → TUN',3:'Fri 21:40',4:'Sat 13:10',5:'~17h 30m',
 6:'Live Qatar through-fare',7:6,8:4,9:7,10:'PREFERRED HUB · SATURDAY AFTERNOON',
 12:'Meets the night-departure preference but the next practical Doha–Tunis flight reaches Tunis around 13:10 Saturday, so it does not meet the morning-arrival preference.',13:false,14:'DOH',15:true,16:78
});
patch('turkey-1605',{
 1:'Flynas/Turkish daytime via Istanbul · XY299/TK7362 + TK657',3:'Fri 16:05',4:'Fri 22:45',
 10:'DAYTIME OPTION · NOT CURRENT PREFERENCE',12:'Fast, but it now falls below the night options because the requested departure is at night and arrival should be Saturday morning.',16:70
});
patch('qatar-midday-mix',{10:'DAYTIME DOHA · NOT CURRENT PREFERENCE',16:68});
patch('qatar-unsafe-1540',{10:'UNSAFE SELF-CONNECTION · DO NOT BOOK',16:35});

const order=['rj-evening','jeddah-overnight','turkish-protected-0145','egyptair-cairo','qatar-late-overnight','qatar-early','saudia-jeddah-morning','flynas-tk-late','turkey-1605','qatar-midday-mix','emirates-dubai','etihad-auh','tunisair-jeddah-early','aegean-athens','ita-rome','saudia-medina','turkish-0010','lufthansa-fra','open-search','qatar-unsafe-1540'];
const rank=new Map(order.map((id,i)=>[id,i]));
rows.sort((a,b)=>(rank.get(a[0])??999)-(rank.get(b[0])??999));
})();