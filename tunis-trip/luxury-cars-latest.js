(()=>{
const cars=window.LUXURY_CARS;if(!Array.isArray(cars))return;
const patch=(id,updates)=>{const c=cars.find(x=>x.id===id);if(c)Object.assign(c,updates)};
patch('land-cruiser-prado',{
 overall:97,
 tag:'BEST VERIFIED LOCAL FULL-SIZE SUV',
 price:'VIPCAR benchmark: €420/day',
 availability:'VIPCAR currently lists a 2025 Prado in Tunisia',
 note:'The strongest currently surfaced full-size SUV for immediate booking: seven seats, automatic transmission and four-bag capacity. Less plush than a Range Rover or BMW X5, but far more credible for a next-day exact-model booking.',
 link:'https://vipcar.com.tn/en/services/rental'
});
patch('mercedes-gla',{
 overall:88,
 tag:'VERIFIED LOCAL PREMIUM SUV',
 price:'LAC Rent A Car: from 350 TND/day',
 availability:'Currently listed by a Tunis airport agency',
 note:'A genuine premium SUV currently listed by a Tunis-based agency. Easier in old-city streets than a full-size SUV, but confirm boot capacity for three large suitcases.',
 link:'https://www.lacrentacar.com/'
});
patch('vw-tiguan',{
 overall:86,
 tag:'VERIFIED LOCAL PREMIUM-PRACTICAL',
 price:'LAC Rent A Car: from 250 TND/day',
 availability:'Currently listed automatic at Tunis airport',
 note:'The most realistic premium-practical fallback: automatic, manageable in Tunis, comfortable for the Sousse/Kairouan road section and locally listed now.',
 link:'https://www.lacrentacar.com/'
});
const order=['bmw-x5','range-rover-sport','land-cruiser-prado','mercedes-gle','audi-q7','volvo-xc90','bmw-x3','mercedes-glc','lexus-rx','porsche-cayenne','audi-q5','volvo-xc60','mercedes-gla','vw-tiguan','peugeot-5008','jetour-t2','skoda-karoq','hyundai-santa-fe','kia-sorento','nissan-xtrail'];
cars.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
})();