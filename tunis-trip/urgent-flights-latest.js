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
 1:'Jeddah night pattern · F3151 + Tunisair TU714',
 2:'RUH → JED → TUN',3:'Fri 21:45',4:'Sat ~06:00 if operating',5:'~10h 15m',
 6:'Live separate-ticket and date check',7:7,8:8,9:10,
 10:'PREFERRED HUB · VERIFY SATURDAY SECTOR',11:'https://www.google.com/travel/flights',
 12:'F3151 is scheduled RUH 21:45 → JED 23:30. TU714 is commonly scheduled around JED 03:05 → TUN 06:00, but published sources differ for Saturday 19 Sep. Do not book unless live checkout confirms the exact Saturday flight and you accept any self-transfer, terminal and baggage risk.',
 13:true,14:'JED',15:false,16:90
});
patch('turkish-protected-0145',{
 1:'Turkish Airlines after-midnight via Istanbul · TK141 + TK661',
 2:'RUH → IST → TUN',3:'Sat 01:45',4:'Sat 08:45',5:'~9h 00m',
 6:'Turkish live through-fare',7:7,8:9,9:9,
 10:'PREFERRED HUB · SATURDAY MORNING',11:'https://www.turkishairlines.com/en-sa/flights-from-riyadh-to-tunis',
 12:'Protected preferred-hub option: TK141 leaves Riyadh at 01:45 Saturday and connects to TK661 from Istanbul, scheduled around 07:50 → 08:45. It departs after midnight on Saturday rather than Friday night, so confirm that date handling works for you.',
 13:false,14:'IST',15:true,16:92
});
patch('egyptair-cairo',{
 1:'EgyptAir night via Cairo',2:'RUH → CAI → TUN',3:'Fri ~22:20',4:'Sat ~10:00',5:'~13h 40m',
 6:'Live EgyptAir through-fare',7:7,8:6,9:9,10:'PROTECTED NIGHT BACKUP',
 12:'One-airline night departure with a Saturday-morning arrival. Longer than Amman or the Turkish option, but materially safer than an unprotected self-transfer.',13:false,14:'CAI',15:true,16:86
});
patch('qatar-late-overnight',{
 1:'Qatar Airways night via Doha · late RUH flight + QR1399',2:'RUH → DOH → TUN',3:'Fri 21:40–22:30',4:'Sat 13:10',5:'~16h–17h',
 6:'Live Qatar through-fare',7:6,8:4,9:7,10:'PREFERRED HUB · SATURDAY AFTERNOON',
 12:'Meets the night-departure preference, but the practical Saturday Doha–Tunis flight QR1399 arrives around 13:10, so it misses the morning-arrival preference.',13:false,14:'DOH',15:true,16:78
});
patch('turkey-1605',{
 1:'Flynas/Turkish daytime via Istanbul · XY299/TK7362 + TK657',3:'Fri 16:05',4:'Fri 22:45',
 10:'DAYTIME OPTION · NOT CURRENT PREFERENCE',12:'Fast, but it now falls below the night options because the requested departure is at night and arrival should be Saturday morning.',16:70
});
patch('qatar-midday-mix',{10:'DAYTIME DOHA · NOT CURRENT PREFERENCE',16:68});
patch('qatar-unsafe-1540',{10:'UNSAFE SELF-CONNECTION · DO NOT BOOK',16:35});

const order=['rj-evening','turkish-protected-0145','jeddah-overnight','egyptair-cairo','qatar-late-overnight','qatar-early','saudia-jeddah-morning','flynas-tk-late','turkey-1605','qatar-midday-mix','emirates-dubai','etihad-auh','tunisair-jeddah-early','aegean-athens','ita-rome','saudia-medina','turkish-0010','lufthansa-fra','open-search','qatar-unsafe-1540'];
const rank=new Map(order.map((id,i)=>[id,i]));
rows.sort((a,b)=>(rank.get(a[0])??999)-(rank.get(b[0])??999));
})();