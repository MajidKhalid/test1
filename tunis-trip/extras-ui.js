(()=>{
const D=window.TRIP_DATA;if(!D)return;
const flightKey='tn-flight-v1';
let selectedFlight=localStorage.getItem(flightKey)||(D.flights?.[0]?.id||'');
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function renderFlights(){
 const host=document.querySelector('#flightOptions');const summary=document.querySelector('#flightSelected');
 if(!host||!summary||!D.flights?.length)return;
 const chosen=D.flights.find(f=>f.id===selectedFlight)||D.flights[0];selectedFlight=chosen.id;localStorage.setItem(flightKey,selectedFlight);
 summary.innerHTML=`<div class="selected-flight"><div><span class="selected-label">YOUR CURRENT FLIGHT PICK</span><h4>${esc(chosen.name)}</h4><p>${esc(chosen.route)} · ${esc(chosen.depart)} → ${esc(chosen.arrive)}</p></div><div class="selected-flight-score">${chosen.overall}<small>/100</small></div></div>`;
 host.innerHTML=D.flights.map((f,i)=>`<article class="flight-card ${f.id===selectedFlight?'chosen':''}">
   <div class="flight-card-top"><div><span class="flight-rank">#${i+1}</span><span class="flight-tag">${esc(f.tag)}</span></div><span class="flight-overall">${f.overall}</span></div>
   <h4>${esc(f.name)}</h4>
   <div class="flight-route">${esc(f.route)}</div>
   <div class="flight-times"><div><small>DEPART</small><b>${esc(f.depart)}</b></div><span>→</span><div><small>ARRIVE</small><b>${esc(f.arrive)}</b></div></div>
   <div class="flight-metrics">
    <div><span>💰 Price</span><b>${f.priceScore}/10</b><small>${esc(f.price)}</small></div>
    <div><span>⏱ Length</span><b>${f.durationScore}/10</b><small>${esc(f.duration)}</small></div>
    <div><span>🕌 Timing</span><b>${f.timingScore}/10</b><small>Friday fit</small></div>
   </div>
   <p class="flight-note-text">${esc(f.note)}</p>
   ${f.self?'<div class="self-connect">⚠ Self-connect / mixed-ticket candidate — verify baggage and protection.</div>':''}
   <div class="flight-actions"><button class="choose-flight ${f.id===selectedFlight?'selected':''}" data-flight="${esc(f.id)}">${f.id===selectedFlight?'✓ Chosen':'Choose'}</button><a href="${esc(f.book)}" target="_blank" rel="noopener">Check live ↗</a></div>
 </article>`).join('');
 host.querySelectorAll('.choose-flight').forEach(b=>b.onclick=()=>{selectedFlight=b.dataset.flight;localStorage.setItem(flightKey,selectedFlight);renderFlights()});
}

function decorateStays(){
 const host=document.querySelector('#staySegments');if(!host)return;
 const segments=[...host.querySelectorAll('.stay-segment')];
 segments.forEach((segmentEl,si)=>{
   const seg=D.staySegments[si];if(!seg)return;
   const cards=[...segmentEl.querySelectorAll('.stay-card')];
   cards.forEach((card,i)=>{
     const o=seg.options[i];if(!o||card.querySelector('.stay-metrics'))return;
     const meta=card.querySelector('.stay-meta');
     const html=`<div class="stay-metrics"><div><span>✨ Experience</span><b>${o.experience}/10</b></div><div><span>🔒 Privacy</span><b>${o.privacy}/10</b></div><div><span>💰 Price</span><b>${o.priceScore}/10</b><small>${esc(o.priceTier)}</small></div></div>`;
     if(meta)meta.insertAdjacentHTML('afterend',html);else card.querySelector('.stay-body')?.insertAdjacentHTML('beforeend',html);
     if(i===0&&!card.querySelector('.best-ribbon'))card.insertAdjacentHTML('afterbegin','<div class="best-ribbon">BEST OPTION</div>');
     const score=card.querySelector('.stay-score');if(score)score.title='Combined fit score: experience + privacy + price value';
   });
 });
}

function observeStays(){
 const host=document.querySelector('#staySegments');if(!host)return;
 decorateStays();
 let queued=false;
 const obs=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorateStays()})});
 obs.observe(host,{childList:true,subtree:true});
}

renderFlights();observeStays();
document.querySelector('#restoreBtn')?.addEventListener('click',()=>{selectedFlight=D.flights?.[0]?.id||'';localStorage.setItem(flightKey,selectedFlight);renderFlights()});
})();