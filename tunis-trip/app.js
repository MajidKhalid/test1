(() => {
const D=window.TRIP_DATA;
const ICON={history:'🏛️',leisure:'🎭',food:'🍽️',shopping:'🛍️',stay:'🛏️',airport:'✈️',transfer:'🚗'};
const STORE='tunisTripPlannerV4';
const defaults={
  focus:'All',routes:true,activities:true,
  stays:{Tunis:D.stays.Tunis.options[0].id,Hammamet:D.stays.Hammamet.options[0].id,Sousse:D.stays.Sousse.options[0].id},
  selected:Object.fromEntries(D.activities.map(a=>[a.id,!!a.selected]))
};
let saved={};try{saved=JSON.parse(localStorage.getItem(STORE)||'{}')}catch(e){}
const state={...defaults,...saved,stays:{...defaults.stays,...(saved.stays||{})},selected:{...defaults.selected,...(saved.selected||{})}};
const sourceMap=Object.fromEntries(D.sources.map(s=>[s.id,s]));
const el=id=>document.getElementById(id);
const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const dayById=id=>D.days.find(d=>d.id===id);
const selectedStay=city=>D.stays[city].options.find(x=>x.id===state.stays[city])||D.stays[city].options[0];
const srcLink=id=>id&&sourceMap[id]?`<a class="source-link" href="${sourceMap[id].url}" target="_blank" rel="noopener">Reference ↗</a>`:'';

function dayButtonsHTML(){return ['All',...D.days.map(d=>d.id)].map(id=>`<button data-day="${id}" class="${state.focus===id?'active':''}">${id==='All'?'Overall':dayById(id).label}</button>`).join('')}
function bindDayButtons(container,scroll){container.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>focusDay(b.dataset.day,scroll))}
function renderDayButtons(){['topDayButtons','mapDayButtons'].forEach((id,i)=>{el(id).innerHTML=dayButtonsHTML();bindDayButtons(el(id),i===0)})}
function focusDay(day,scrollToMap=false){state.focus=day;save();renderDayButtons();renderSchedule();renderMap();if(scrollToMap)el('map-section').scrollIntoView({behavior:'smooth',block:'start'})}

function syncToggles(){['toggleRoutes','toggleRoutes2'].forEach(id=>el(id).checked=state.routes);['toggleActivities','toggleActivities2'].forEach(id=>el(id).checked=state.activities)}
function bindToggles(){['toggleRoutes','toggleRoutes2'].forEach(id=>el(id).onchange=e=>{state.routes=e.target.checked;save();syncToggles();renderMap()});['toggleActivities','toggleActivities2'].forEach(id=>el(id).onchange=e=>{state.activities=e.target.checked;save();syncToggles();renderMap()})}

function renderStays(){
  el('stayChooser').innerHTML=Object.entries(D.stays).map(([city,group])=>`<div class="base-block"><div class="base-heading"><div><div class="eyebrow">${city}</div><h3>${group.nights}</h3></div><p>${city==='Tunis'?'First 2 nights + final 2 nights':city==='Hammamet'?'Mandatory 2-night stay':'One night to experience the Medina after Kairouan'}</p></div><div class="stay-grid">${group.options.map(o=>`<label class="stay-option ${state.stays[city]===o.id?'selected':''}"><input type="radio" name="stay-${city}" value="${o.id}" ${state.stays[city]===o.id?'checked':''}><span class="pill">${o.tag}</span><h3>${o.name}</h3><span class="score">${o.score}/100</span><p>${o.note}</p><small>Trip-fit score · authenticity + comfort</small><div><a class="source-link" href="${o.url}" target="_blank" rel="noopener">Property ↗</a></div></label>`).join('')}</div></div>`).join('');
  el('stayChooser').querySelectorAll('input[type=radio]').forEach(r=>r.onchange=()=>{const city=r.name.replace('stay-','');state.stays[city]=r.value;save();renderStays();renderSchedule();renderMap()})
}

function stayEvent(day){
  const map={D1:{city:'Tunis',time:'14:00',order:10,verb:'Check in'},D3:{city:'Hammamet',time:'20:00',order:95,verb:'Check in'},D5:{city:'Sousse',time:'16:00',order:75,verb:'Check in'},D6:{city:'Tunis',time:'18:00',order:90,verb:'Check in'}};
  const x=map[day];if(!x)return null;const s=selectedStay(x.city);return{id:`stay-${day}`,day,time:x.time,order:x.order,name:`${x.verb}: ${s.name}`,category:'stay',description:`Overnight base in ${x.city}.`,lat:s.lat,lng:s.lng,wiki:s.wiki,url:s.url};
}
function getDayItems(day){
  const arr=[];
  D.fixedStops.filter(x=>x.day===day).forEach(x=>arr.push({...x}));
  D.activities.filter(a=>a.day===day&&state.selected[a.id]).forEach(a=>arr.push({...a}));
  const se=stayEvent(day);if(se)arr.push(se);
  return arr.sort((a,b)=>(a.order||0)-(b.order||0));
}
function overnightLabel(day){const d=dayById(day);if(!d)return'';if(d.overnight==='Riyadh')return'Flight home';const s=selectedStay(d.overnight);return s?`${d.overnight} · ${s.name}`:d.overnight}
function renderSchedule(){
  el('liveSchedule').innerHTML=D.days.map(d=>{const items=getDayItems(d.id);return`<article class="day-card ${state.focus===d.id?'focused':''}"><div class="day-card-head"><div><div class="eyebrow">${d.date}</div><h3>${d.title}</h3></div><button class="day-badge" data-focus="${d.id}">${d.label}</button></div><div class="overnight">🛏️ ${esc(overnightLabel(d.id))}</div>${items.map(i=>`<div class="schedule-item"><time>${esc(i.time)}</time><div class="schedule-icon">${ICON[i.category]||'•'}</div><div><b>${esc(i.name)}</b><p>${esc(i.description||'')}</p>${srcLink(i.source)}</div></div>`).join('')||'<p class="micro">No optional activities selected for this day.</p>'}</article>`}).join('');
  el('liveSchedule').querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>focusDay(b.dataset.focus,true));
}

let activeTab='history';
function activityCard(a){
  const included=state.selected[a.id];const d=dayById(a.day);return`<article class="activity-card ${included?'included':''}" data-search="${esc((a.name+' '+a.city+' '+(a.relation||'')+' '+(a.description||'')).toLowerCase())}"><div><div class="activity-meta"><span>${d.label} · ${d.date}</span><span>${a.city}</span><span>${ICON[a.category]} ${a.category}</span></div><h3>${a.name}</h3>${a.kind==='history'?`<p>${a.history}</p><p class="relation"><b>Relates to:</b> ${a.relation}</p>`:`<p>${a.description}</p><p><b>Why it earns time:</b> ${a.why||''}</p>`}${srcLink(a.source)}</div><button class="include-toggle" data-activity="${a.id}">${included?'✓ Included':'+ Add'}</button></article>`
}
function renderActivities(){
  const q=(el('activitySearch')?.value||'').toLowerCase();
  ['history','leisure'].forEach(kind=>{const list=el(kind+'List');let arr=D.activities.filter(a=>a.kind===kind).sort((a,b)=>D.days.findIndex(d=>d.id===a.day)-D.days.findIndex(d=>d.id===b.day)||(a.order||0)-(b.order||0));if(q)arr=arr.filter(a=>(a.name+' '+a.city+' '+(a.relation||'')+' '+(a.description||'')+' '+(a.why||'')).toLowerCase().includes(q));list.innerHTML=arr.map(activityCard).join('');list.classList.toggle('hidden',activeTab!==kind)});
  document.querySelectorAll('[data-activity]').forEach(b=>b.onclick=()=>{const id=b.dataset.activity;state.selected[id]=!state.selected[id];save();renderActivities();renderSchedule();renderMap()});
}
function bindActivityUI(){document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{activeTab=t.dataset.tab;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===t));renderActivities()});el('activitySearch').oninput=renderActivities;el('selectRecommended').onclick=()=>{D.activities.forEach(a=>state.selected[a.id]=!!a.selected);save();renderActivities();renderSchedule();renderMap()}}

function renderShopping(){el('shoppingPlan').innerHTML=D.shopping.map(s=>`<article class="shopping-card"><div class="big-icon">${s.icon}</div><div class="eyebrow">${s.priority}</div><h3>${s.city}</h3><ul>${s.items.map(x=>`<li>${x}</li>`).join('')}</ul><p><strong>Buying strategy:</strong> ${s.tip}</p></article>`).join('')}
function renderSources(){el('sourceList').innerHTML=D.sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a>`).join('')}

const map=L.map('tripMap',{zoomControl:true}).setView([36.1,10.3],8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
const markerLayer=L.layerGroup().addTo(map),routeLayer=L.layerGroup().addTo(map);
const photoCache={};
function iconFor(cat){return L.divIcon({className:`marker-icon marker-${cat}`,html:ICON[cat]||'•',iconSize:[34,34]})}
function getSource(item){return item.source&&sourceMap[item.source]?sourceMap[item.source]:null}
function popupHTML(item){const src=getSource(item);return`<div class="popup-card"><div id="photo-${esc(item.id)}" class="popup-photo-placeholder">${ICON[item.category]||'📍'}</div><h3>${esc(item.name)}</h3><div class="popup-meta">${esc(dayById(item.day)?.label||'Trip')} · ${esc(item.time||'')} · ${esc(item.city||'')}</div><p>${esc(item.history||item.description||'')}</p>${item.relation?`<p class="popup-rel"><b>Relates to:</b> ${esc(item.relation)}</p>`:''}<div class="popup-links">${src?`<a href="${src.url}" target="_blank">History/source ↗</a>`:''}${item.url?`<a href="${item.url}" target="_blank">Property ↗</a>`:''}</div></div>`}
async function loadPhoto(item){if(!item.wiki)return;const box=document.getElementById(`photo-${item.id}`);if(!box)return;if(photoCache[item.wiki]){box.outerHTML=`<img src="${photoCache[item.wiki]}" alt="${esc(item.name)}">`;return}try{const r=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wiki)}`);const j=await r.json();const u=j.thumbnail?.source||j.originalimage?.source;if(u){photoCache[item.wiki]=u;const b=document.getElementById(`photo-${item.id}`);if(b)b.outerHTML=`<img src="${u}" alt="${esc(item.name)}">`}}catch(e){}}
function makeMarker(item){const m=L.marker([item.lat,item.lng],{icon:iconFor(item.category)}).addTo(markerLayer);m.on('click',()=>{m.bindPopup(popupHTML(item),{maxWidth:310}).openPopup();setTimeout(()=>loadPhoto(item),80)});return m}
function selectedStayMarker(city,days){const s=selectedStay(city);return{id:`hotel-${city}`,day:days[0],days,time:'Overnight',name:s.name,city,category:'stay',lat:s.lat,lng:s.lng,wiki:s.wiki,description:`Selected ${city} base · ${D.stays[city].nights}.`,url:s.url,order:0}}
function allMapItems(){const a=[];D.fixedStops.forEach(x=>a.push({...x}));a.push(selectedStayMarker('Tunis',['D1','D2','D3','D6','D7','D8']));a.push(selectedStayMarker('Hammamet',['D3','D4','D5']));a.push(selectedStayMarker('Sousse',['D5','D6']));if(state.activities)D.activities.filter(x=>state.selected[x.id]).forEach(x=>a.push({...x}));return a}
function itemVisible(item,focus){if(focus==='All')return true;if(item.days)return item.days.includes(focus);return item.day===focus}

function routePoints(day){
  const act=D.activities.filter(a=>a.day===day&&state.selected[a.id]).map(a=>({...a}));const points=[];
  const addStay=(city,order)=>{const s=selectedStay(city);points.push({id:`route-${day}-${city}-${order}`,lat:s.lat,lng:s.lng,order,category:'stay',name:s.name})};
  if(day==='D1'){points.push({...D.fixedStops.find(x=>x.id==='arrive'),order:0});addStay('Tunis',5);points.push(...act);addStay('Tunis',120)}
  if(day==='D2'){addStay('Tunis',0);points.push(...act);addStay('Tunis',120)}
  if(day==='D3'){addStay('Tunis',0);points.push(...act);addStay('Hammamet',120)}
  if(day==='D4'){addStay('Hammamet',0);points.push(...act);addStay('Hammamet',120)}
  if(day==='D5'){addStay('Hammamet',0);points.push(...act);addStay('Sousse',120)}
  if(day==='D6'){addStay('Sousse',0);points.push(...act);addStay('Tunis',120)}
  if(day==='D7'){addStay('Tunis',0);points.push(...act);addStay('Tunis',120)}
  if(day==='D8'){addStay('Tunis',0);points.push(...act);points.push({...D.fixedStops.find(x=>x.id==='depart'),order:120})}
  return points.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng)).sort((a,b)=>(a.order||0)-(b.order||0));
}
async function drawRoute(day){const pts=routePoints(day);if(pts.length<2)return;const color=D.dayColors[day]||'#444';const latlngs=pts.map(p=>[p.lat,p.lng]);if(['D1','D2'].includes(day)){L.polyline(latlngs,{color,weight:4,opacity:.72,dashArray:'7 7'}).addTo(routeLayer);return}try{const coords=pts.map(p=>`${p.lng},${p.lat}`).join(';');const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`);const j=await r.json();if(j.code==='Ok'&&j.routes?.[0]?.geometry){L.geoJSON(j.routes[0].geometry,{style:{color,weight:4,opacity:.72}}).addTo(routeLayer);return}}catch(e){}L.polyline(latlngs,{color,weight:4,opacity:.7,dashArray:'7 7'}).addTo(routeLayer)}
async function renderMap(){
  markerLayer.clearLayers();routeLayer.clearLayers();const focus=state.focus;const items=allMapItems().filter(x=>itemVisible(x,focus));items.forEach(makeMarker);
  if(state.routes){const days=focus==='All'?D.days.map(d=>d.id):[focus];days.forEach(drawRoute)}
  const fit=[];items.forEach(x=>fit.push([x.lat,x.lng]));if(state.routes){const ds=focus==='All'?D.days.map(d=>d.id):[focus];ds.forEach(d=>routePoints(d).forEach(p=>fit.push([p.lat,p.lng])))}if(fit.length){map.fitBounds(L.latLngBounds(fit).pad(.12),{maxZoom:focus==='All'?8:13})}setTimeout(()=>map.invalidateSize(),120)
}

renderDayButtons();syncToggles();bindToggles();renderStays();renderSchedule();renderActivities();bindActivityUI();renderShopping();renderSources();renderMap();
})();