(()=>{
const imageMap={
 'jetour-t2':'https://jetourglobal.com/data/tms/website/html/images/about/us_p0_m.jpg',
 'skoda-kushaq':'https://cdn.skoda-storyboard.com/2021/03/Kushaq_front.jpg',
 'jetour-x70':'https://jetour.com.ua/assets/images/sklad-avto/x70plus/gv/front-view-2.png',
 'vw-troc':'https://www.razaoautomovel.com/wp-content/uploads/2021/11/Volkswagen_T-Roc_4_925x520_acf_cropped-925x520.jpg',
 'skoda-karoq':'https://click-or-die.ru/app/uploads/2026/04/03_47.jpg.webp',
 'peugeot-3008':'https://img.philkotse.com/temp/2024/07/26/untitled-design-de11-wm-4b80.webp',
 'hyundai-tucson':'https://images.carexpert.com.au/resize/1200/-/cms/v1/media/2024-hyundai-tucson-primary-image.png',
 'kia-sportage':'https://media.hendy.co.uk/media/KIA/Thumbnails/Sportage/sportage_0002_kia-sportage_2018-2-infra-red_0000.png.webp',
 'nissan-qashqai':'https://www.honestjohn.co.uk/media/_v6/17224298/Nissan-Qashqai-%281%29.jpg?height=426&rmode=crop&width=640',
 'dacia-stepway':'https://www.carx.it/foto/listino/dacia-sandero-stepway-2020-front.jpg',
 'jeep-renegade':'https://immagini.alvolante.it/sites/default/files/styles/image_gallery_big/public/news_galleria/2019/05/jeep-renagade-s_2.jpg',
 'toyota-corolla-cross':'https://i0.wp.com/theauto.page/wp-content/uploads/2021/11/CorollaCross_16.jpg?fit=1024%2C683&ssl=1',
 'renault-austral':'https://images.carexpert.com.au/resize/1920/-/cms/v1/media/2022-03-renault-austral-1.jpg',
 'mg-hs':'https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/1-mg-hs-2019-uk-fd-hero-front.jpg?itok=q8E8PXhv',
 'seat-ateca':'https://bluesky-cogcms.cdn.imgeng.in/media/cp3flcdc/untitled-design-12.png?center=0.5%2C0.5&mode=crop&scale=both&width=1500',
 'citroen-c5':'https://www.manouvellevoiture.com/ressources/image/c/i/4d9db1f-citroen-c5-aircross-max-3--2.jpg',
 'peugeot-2008':'https://cms-i.autodaily.vn/du-lieu/2020/12/30/peugeot-2008.jpg',
 'vw-tiguan':'https://images.coches.com/_ccom_/da584ec7-aae6-49a4-9952-f8e7c0aff831/0ad8ce20-422f-408a-a887-0a2bc265b401.png',
 'toyota-rav4':'https://ukrinfo-data.s3.amazonaws.com/media/441752/toyota_rav4_11.jpg',
 'suzuki-jimny':'https://immagini.alvolante.it/sites/default/files/styles/image_gallery_big/public/prova_galleria/2019/05/suzuki-jimny-prova-2018-12_37.jpg?itok=vYb9WhIT'
};
const officialFallback={
 'jetour-t2':'https://www.jetourksa.com/new-models/t2','skoda-kushaq':'https://www.skoda-storyboard.com/en/models/watch-the-premiere-of-the-indian-skoda-kushaq-suv/','jetour-x70':'https://jetourglobal.com/','vw-troc':'https://www.volkswagen-newsroom.com/en/t-roc-15809','skoda-karoq':'https://www.skoda-auto.com/models/range/karoq','peugeot-3008':'https://ksa.peugeot.com/en/our-models/peugeot-3008/all-new.html','hyundai-tucson':'https://www.hyundai.com/worldwide/en/suv/tucson','kia-sportage':'https://www.kia.com/us/en/sportage','nissan-qashqai':'https://www.nissan.co.uk/vehicles/new-vehicles/qashqai.html','dacia-stepway':'https://www.dacia.co.uk/vehicles/sandero-stepway.html','jeep-renegade':'https://www.jeep.com/renegade.html','toyota-corolla-cross':'https://www.toyota.com.sa/en/vehicles/corollacross','renault-austral':'https://www.renault.co.uk/hybrid-cars/austral.html','mg-hs':'https://www.mg.co.uk/new-cars/new-mg-hs','seat-ateca':'https://www.seat.com/carworlds/ateca','citroen-c5':'https://www.citroen.co.uk/models/new-c5-aircross.html','peugeot-2008':'https://ksa.peugeot.com/en/our-models/2008.html','vw-tiguan':'https://www.volkswagen-newsroom.com/en/tiguan-15833','toyota-rav4':'https://www.toyota.com/rav4/','suzuki-jimny':'https://www.globalsuzuki.com/automobile/lineup/jimny/'};
const shot=url=>`https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1000`;
function apply(){
 document.querySelectorAll('.car-card').forEach(card=>{
  if(card.querySelector('.car-photo'))return;
  const id=card.querySelector('.choose-car')?.dataset.car;if(!id)return;
  const img=document.createElement('img');img.className='car-photo';img.loading='lazy';img.alt=`${card.querySelector('h4')?.textContent||'Car'} exterior`;
  img.src=imageMap[id]||shot(officialFallback[id]||'https://www.booking.com/cars/airport/tn/tun.en-gb.html');
  img.onerror=()=>{const f=officialFallback[id];if(f&&img.dataset.fallback!=='1'){img.dataset.fallback='1';img.src=shot(f);}else{img.remove();}};
  card.insertBefore(img,card.firstChild);
 });
}
apply();
const host=document.querySelector('#carOptions');if(host)new MutationObserver(()=>requestAnimationFrame(apply)).observe(host,{childList:true,subtree:true});
})();