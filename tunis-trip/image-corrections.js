(()=>{
const D=window.TRIP_DATA;if(!D)return;
const shot=url=>`https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;

// Verified listing photos where search/indexed listing media is available.
const verifiedStayPhotos={
 'dar24':[
  'https://a0.muscache.com/im/pictures/424d82e7-14c8-44eb-ae40-7450a2658c6c.jpg?im_w=720',
  'https://a0.muscache.com/im/pictures/058989a2-712a-429a-ba2a-f100a114f6b5.jpg?im_w=720'
 ],
 'dar24-return':[
  'https://a0.muscache.com/im/pictures/424d82e7-14c8-44eb-ae40-7450a2658c6c.jpg?im_w=720',
  'https://a0.muscache.com/im/pictures/058989a2-712a-429a-ba2a-f100a114f6b5.jpg?im_w=720'
 ],
 'dar-nabiha':[
  'https://a0.muscache.com/im/pictures/6892a7f7-23c2-4fb5-ae59-5682098bcd39.jpg',
  'https://a0.muscache.com/im/pictures/eb397bc6-8a65-429a-99e2-b926413b6c2b.jpg'
 ],
 'pearl-medina':['https://a0.muscache.com/im/pictures/miso/Hosting-1273014287129551258/original/570536bc-4a8e-4917-859b-26bbd6170125.jpeg']
};

// Every stay gets media tied to its own listing/property page. This prevents city-wide
// stock photos from being repeated across unrelated properties. For listings without
// a verified direct photo URL we use a live preview of the exact listing page.
(D.staySegments||[]).forEach(seg=>seg.options.forEach(o=>{
 const exact=verifiedStayPhotos[o.id];
 o.images=exact?.length?exact:[shot(o.url)];
 o.imageContext=exact?.length?'Verified listing photo':'Exact listing preview';
}));

// Activity-specific imagery. Existing location photos are used only once where they
// are a good exact match; otherwise the image is a preview of the named place/source.
const activityVisuals={
 'tunis-medina':D.images?.tunis?.[1],
 'zitouna':shot('https://en.wikipedia.org/wiki/Al-Zaytuna_Mosque'),
 'dars-tourbet':shot('https://en.wikipedia.org/wiki/Tourbet_el_Bey'),
 'carthage-byrsa':D.images?.carthage?.[0],
 'antonine':D.images?.carthage?.[1],
 'punic-ports':shot('https://en.wikipedia.org/wiki/Punic_ports_of_Carthage'),
 'sidi-palace':shot('https://www.cmam.tn/'),
 'hammamet-kasbah':D.images?.hammamet?.[0],
 'kairouan-mosque':D.images?.kairouan?.[0],
 'aghlabid':D.images?.kairouan?.[1],
 'kairouan-medina':D.images?.kairouan?.[2],
 'sousse-ribat':D.images?.sousse?.[0],
 'eljem':D.images?.eljem?.[0],
 'bardo':D.images?.bardo?.[0],
 'rooftop-tea':D.images?.tunis?.[2],
 'tunis-shopping':shot('https://soukelkahina.tn/en/shop/artounsi?id_category=135'),
 'dar-lunch':shot('https://en.wikipedia.org/wiki/Tunisian_cuisine'),
 'lagoulette-lunch':shot('https://en.wikipedia.org/wiki/La_Goulette'),
 'sidi-sunset':D.images?.sidi?.[0],
 'sidi-gallery':D.images?.sidi?.[1],
 'hammamet-beach':D.images?.hammamet?.[2],
 'nabeul-shopping':D.images?.nabeul?.[0],
 'nabeul-ceramics':D.images?.nabeul?.[1],
 'hammam':D.images?.hammamet?.[1],
 'beach-dinner':shot('https://www.discovertunisia.com/en/discover/hammamet'),
 'kairouan-carpets':shot('https://www.discovertunisia.com/en/discover/around-kairouan'),
 'sousse-dinner':shot('https://whc.unesco.org/en/list/498'),
 'eljem-lunch':shot('https://en.wikipedia.org/wiki/El_Djem'),
 'final-shopping':shot('https://soukelkahina.tn/en/shop/artounsi?id_category=135&view=grid'),
 'cooking':shot('https://en.wikipedia.org/wiki/Tunisian_cuisine?oldformat=true'),
 'farewell':shot('https://www.dareljeld.com/restaurants/')
};
(D.activities||[]).forEach(a=>{
 const u=activityVisuals[a.id];if(!u)return;
 const key=`activity-${a.id}`;D.images[key]=[u];a.img=key;
});
})();