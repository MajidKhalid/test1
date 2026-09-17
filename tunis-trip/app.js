/* Tunisia trip · app. State → render. No frameworks. */
(() => {
  const T = window.TRIP; if (!T) return;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'tunisia-2026';

  /* ───────── i18n ───────── */
  const UI = {
    plan: ['Plan', 'الخطة'], explore: ['Explore', 'استكشاف'], book: ['Book', 'الحجوزات'], trip: ['Trip', 'الرحلة'], today: ['Today', 'اليوم'],
    dates: ['18–25 Sep 2026', '18–25 سبتمبر 2026'], day: ['Day', 'اليوم'], stay: ['Stay', 'الإقامة'], change: ['Change', 'تغيير'],
    noStay: ['Flight night · no stay', 'ليلة الطيران · بلا إقامة'], addFromExplore: ['Add from Explore', 'إضافة من الاستكشاف'],
    nothingPlanned: ['Nothing planned yet. Add something from Explore.', 'لا شيء مخطط بعد. أضيفوا شيئًا من الاستكشاف.'],
    add: ['Add', 'إضافة'], added: ['Added', 'مُضاف'], remove: ['Remove', 'إزالة'], directions: ['Directions', 'الاتجاهات'], website: ['Website', 'الموقع'],
    all: ['All', 'الكل'], search: ['Search places', 'ابحثوا عن مكان'], noResults: ['Nothing matches. Try another area or word.', 'لا نتائج. جرّبوا منطقة أو كلمة أخرى.'],
    addingTo: ['Adding to', 'الإضافة إلى'], done: ['Done', 'تم'], addTo: ['Add to a day', 'إضافة إلى يوم'], moveTo: ['Move to another day', 'نقل إلى يوم آخر'],
    timeOfDay: ['Time of day', 'وقت اليوم'], removeFrom: ['Remove from', 'إزالة من'], addedTo: ['Added to', 'أُضيف إلى'], removed: ['Removed', 'أُزيل'],
    view: ['View', 'عرض'], undo: ['Undo', 'تراجع'], flights: ['Flights', 'الرحلات الجوية'], booked: ['Booked', 'محجوز'], outbound: ['Outbound', 'الذهاب'],
    ret: ['Return', 'العودة'], departs: ['Departs', 'الإقلاع'], arrives: ['Arrives', 'الوصول'], leaveFor: ['Leave Hammamet', 'الانطلاق من الحمامات'],
    flightHelp: ['These times drive Day 1 and Day 8. Change them if your booking differs.', 'تُستخدم هذه الأوقات في اليومين الأول والأخير. عدّلوها إذا اختلف حجزكم.'],
    stays: ['Stays', 'الإقامات'], staysLead: ['One home per leg. The list is the researched shortlist; add the group’s suggestions below each block.', 'بيت واحد لكل مرحلة. القائمة مدروسة؛ أضيفوا اقتراحات المجموعة أسفل كل مرحلة.'],
    experience: ['Experience', 'التجربة'], privacy: ['Privacy', 'الخصوصية'], value: ['Value', 'القيمة'], chosen: ['Chosen', 'المختار'], choose: ['Choose', 'اختيار'],
    openListing: ['Open listing', 'فتح الإعلان'], otherOptions: ['Other options', 'خيارات أخرى'], hide: ['Hide options', 'إخفاء الخيارات'],
    suggestName: ['Name of the place', 'اسم المكان'], suggestUrl: ['Link (optional)', 'الرابط (اختياري)'], addSuggestion: ['Add suggestion', 'إضافة اقتراح'],
    suggested: ['Group suggestion', 'اقتراح المجموعة'], car: ['Car', 'السيارة'],
    carLead: ['One SUV for the whole trip. Confirm automatic, unlimited km and full cover in writing.', 'سيارة واحدة للرحلة كلها. أكدوا الأوتوماتيك والكيلومترات غير المحدودة والتأمين الكامل كتابةً.'],
    luxury: ['Luxury', 'الفخامة'], comfort: ['Comfort', 'الراحة'], checkRentals: ['Check rentals', 'تحقق من التأجير'],
    reservations: ['Reservations', 'ما يلزم حجزه'], reservationsLead: ['Built from your plan. Tick things off as you book them.', 'مبنية من خطتكم. علّموا ما حجزتموه.'],
    nothingToBook: ['Nothing in your plan needs a reservation yet.', 'لا شيء في خطتكم يحتاج حجزًا بعد.'],
    share: ['Share plan', 'مشاركة الخطة'], copySummary: ['Copy summary', 'نسخ الملخص'], linkCopied: ['Link copied. Send it in the family group.', 'تم نسخ الرابط. أرسلوه في مجموعة العائلة.'],
    copied: ['Copied', 'تم النسخ'], planLoaded: ['Plan loaded from the shared link', 'تم تحميل الخطة من الرابط'], goodToKnow: ['Good to know', 'معلومات مفيدة'],
    reset: ['Reset to recommended plan', 'إعادة الخطة المقترحة'], resetConfirm: ['Replace your plan with the recommended one?', 'هل تريدون استبدال خطتكم بالخطة المقترحة؟'],
    mapOff: ['Map unavailable right now. Every place still opens in Maps.', 'الخريطة غير متاحة الآن. كل مكان يفتح في الخرائط.'],
    nights: ['nights', 'ليالٍ'], flight: ['Flight', 'طيران'], drive: ['Drive', 'قيادة'], setTime: ['set time', 'حدّدوا الوقت'],
    reserve: ['Reserve', 'احجزوا'], tickets: ['Tickets', 'تذاكر'], travelers: ['3 adults', '3 بالغين'], places: ['places', 'أماكن'],
    bookTitle: ['Book', 'الحجوزات'], bookLead: ['Flights are done. What is left: the three homes, the car, and the tables and tickets your plan needs.', 'الطيران محجوز. المتبقي: البيوت الثلاثة والسيارة والطاولات والتذاكر التي تحتاجها خطتكم.'],
    shareLead: ['One link carries the whole plan and your choices. Everyone who opens it sees the same thing.', 'رابط واحد يحمل الخطة كلها واختياراتكم. كل من يفتحه يرى الشيء نفسه.'],
    overviewLead: ['Tap a day to open it.', 'اضغطوا على يوم لفتحه.'], nightsIn: ['nights in', 'ليالٍ في'],
    exploreLead: ['Everything worth your time, by mood and by place. Add anything to any day.', 'كل ما يستحق وقتكم، حسب المزاج والمكان. أضيفوا أي شيء إلى أي يوم.'],
    inPlan: ['in your plan', 'في خطتكم']
  };
  const t = k => (UI[k] || [k, k])[S.lang === 'ar' ? 1 : 0];
  const tx = (o, k = 'n') => (S.lang === 'ar' && o[k + 'a']) || o[k];
  const L2 = o => S.lang === 'ar' ? o.ar : o.en;

  /* ───────── icons ───────── */
  const I = {
    food: '<path d="M6 3v7a3 3 0 0 0 6 0V3M9 3v18M17 3c-1.6 1.2-2.5 3.2-2.5 6v4H17v8"/>',
    sights: '<path d="M3 21h18M5 21v-9M9.5 21v-9M14.5 21v-9M19 21v-9M3 12h18L12 4z"/>',
    shopping: '<path d="M6 8h12l1 13H5zM9 8V6a3 3 0 0 1 6 0v2"/>',
    nightlife: '<path d="M6 3h12l-6 9zM12 12v8M8 20h8M8.5 6.5h7"/>',
    relax: '<path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0M12 3v2M5.5 6.5 7 8M18.5 6.5 17 8M8 13a4 4 0 0 1 8 0"/>',
    flight: '<path d="M21 3 3 10.5l7.5 3L14 21z"/><path d="M21 3 10.5 13.5"/>',
    drive: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M9 17h6M3 12h18"/>',
    stay: '<path d="M3 19V7M3 12h18v7M7 12V9h5v3M21 19v-2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M5 12l5 5L20 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>', pin: '<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    link: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    share: '<path d="M12 3v12M7 8l5-5 5 5M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    plan: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    explore: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 14 14l-5.5 1.5L10 10z"/>',
    book: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', move: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
  };
  const icon = n => `<span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true">${I[n] || ''}</svg></span>`;
  const catColor = c => `var(--${c})`;

  /* ───────── state ───────── */
  const byId = Object.fromEntries(T.places.map(p => [p.id, p]));
  const dayById = Object.fromEntries(T.days.map(d => [d.id, d]));
  const stayBlock = id => T.stays.find(s => s.id === id);
  const defaultPlan = () => Object.fromEntries(Object.entries(T.defaultPlan).map(([d, ids]) => [d, ids.map(p => ({ p, s: T.defaultSlots[`${d}:${p}`] || byId[p].slot }))]));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const saved = load() || {};
  const S = {
    lang: saved.lang === 'ar' ? 'ar' : 'en', view: 'plan', day: null, cat: 'food', area: 'all', q: '', addingTo: null,
    plan: saved.plan || defaultPlan(), stays: saved.stays || Object.fromEntries(T.stays.map(s => [s.id, s.def])), car: saved.car || T.cars[0].id,
    flight: Object.assign({ out: { ...T.flight.out }, back: { ...T.flight.back } }, saved.flight || {}), checks: saved.checks || {}, suggestions: saved.suggestions || [], open: {}
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ lang: S.lang, plan: S.plan, stays: S.stays, car: S.car, flight: S.flight, checks: S.checks, suggestions: S.suggestions })); } catch (e) { } };

  // shared link → state
  const b64e = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64d = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
  const importHash = () => {
    const m = location.hash.match(/^#s=([A-Za-z0-9_-]+)/); if (!m) return false;
    try { const d = JSON.parse(b64d(m[1])); if (d.plan) S.plan = d.plan; if (d.stays) S.stays = d.stays; if (d.car) S.car = d.car; if (d.flight) S.flight = d.flight; if (d.suggestions) S.suggestions = d.suggestions; save(); history.replaceState(null, '', location.pathname); return true; } catch (e) { return false; }
  };
  const shareUrl = () => `${location.origin}${location.pathname}#s=${b64e(JSON.stringify({ plan: S.plan, stays: S.stays, car: S.car, flight: S.flight, suggestions: S.suggestions }))}`;

  /* ───────── helpers ───────── */
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dayIndex = id => T.days.findIndex(d => d.id === id);
  const slotIndex = s => T.slots.findIndex(x => x.id === s);
  const longDate = d => new Intl.DateTimeFormat(S.lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(d.date + 'T12:00:00'));
  const areaLabel = a => L2(T.areas[a]);
  const mapsUrl = p => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q || `${p.n.replace(/ · /g, ', ')}, ${T.areas[p.area].en.split(' · ')[0]}, Tunisia`)}`;
  const rowsOf = d => (S.plan[d] || []);
  const inDays = pid => T.days.filter(d => rowsOf(d.id).some(r => r.p === pid)).map(d => d.id);
  const flightTime = key => { const [a, b] = key.split('.'); return (S.flight[a] || {})[b] || ''; };
  const leaveTime = () => { if (S.flight.back.leave) return S.flight.back.leave; const dep = S.flight.back.dep; if (!dep) return ''; const [h, m] = dep.split(':').map(Number); let mins = h * 60 + m - 255; if (mins < 0) mins += 1440; return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`; };
  const fixedTime = f => f.time === 'back.leave' ? leaveTime() : (/^[a-z]+\./.test(f.time) ? flightTime(f.time) : f.time);
  const dur = p => S.lang === 'ar' ? p.dur.replace(/\bh\b/g, 'س').replace(/min/g, 'د').replace('Full day', 'يوم كامل').replace('Half day', 'نصف يوم') : p.dur;
  const stayFor = block => { const b = stayBlock(block); if (!b) return null; const id = S.stays[block]; return b.options.find(o => o.id === id) || S.suggestions.find(x => x.id === id) || b.options[0]; };
  const dayLabel = d => L2({ en: d.en, ar: d.ar });

  /* ───────── plan mutations ───────── */
  const addToDay = (pid, day, slot) => { const rows = S.plan[day] = rowsOf(day); if (rows.some(r => r.p === pid)) return false; rows.push({ p: pid, s: slot || byId[pid].slot }); save(); return true; };
  const removeFromDay = (pid, day) => { S.plan[day] = rowsOf(day).filter(r => r.p !== pid); save(); };
  const setSlot = (pid, day, slot) => { const r = rowsOf(day).find(r => r.p === pid); if (r) { r.s = slot; save(); } };

  /* ───────── toast ───────── */
  let toastTimer;
  const toast = (msg, action) => { const el = $('#toast'); el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`; el.hidden = false; if (action) $('button', el).onclick = () => { el.hidden = true; action.fn(); }; clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, 3200); };

  /* ───────── sheet ───────── */
  const sheet = $('#sheet');
  const openSheet = (html, bind) => { sheet.innerHTML = `<div class="sheetIn">${html}</div><button class="sheetClose" type="button" aria-label="Close">${icon('x')}</button>`; $('.sheetClose', sheet).onclick = () => sheet.close(); if (bind) bind(sheet); if (!sheet.open) sheet.showModal(); };
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
  const dayMenu = (pid, onPick) => { const p = byId[pid]; const present = inDays(pid); return `<ul class="menu">${T.days.filter(d => d.id !== 'D1').map(d => { const here = present.includes(d.id); const match = d.areas.includes(p.area); return `<li><button type="button" data-day="${d.id}" data-here="${here ? 1 : 0}">${icon(here ? 'check' : (match ? 'pin' : 'plan'))}<span><b>${esc(dayLabel(d))}</b> · ${esc(L2({ en: d.ten, ar: d.tar }))}</span>${here ? `<span class="sub">${esc(t('added'))}</span>` : (match ? `<span class="sub">${esc(areaLabel(p.area).split(' · ')[0])}</span>` : '')}</button></li>`; }).join('')}</ul>`; };

  const placeSheet = pid => { const p = byId[pid]; openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(t('addTo'))}</div>${dayMenu(pid)}`, sh => { sh.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { const d = b.dataset.day; if (b.dataset.here === '1') { removeFromDay(pid, d); toast(`${t('removed')} · ${dayLabel(dayById[d])}`, { label: t('undo'), fn: () => { addToDay(pid, d); render(); } }); } else { addToDay(pid, d); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`, { label: t('view'), fn: () => { S.day = d; setView('plan'); } }); } sh.close(); render(); }); }); };

  const rowSheet = (pid, day) => { const p = byId[pid]; const r = rowsOf(day).find(x => x.p === pid); if (!r) return; openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(areaLabel(p.area))}${p.dur ? ` · ${esc(dur(p))}` : ''}${p.price ? ` · ${p.price}` : ''}</div><div class="eyebrow">${esc(t('timeOfDay'))}</div><div class="seg" role="tablist">${T.slots.map(s => `<button type="button" role="tab" aria-selected="${s.id === r.s}" data-slot="${s.id}">${esc(L2(s))}</button>`).join('')}</div><ul class="menu"><li><a href="${mapsUrl(p)}" target="_blank" rel="noopener noreferrer">${icon('pin')}${esc(t('directions'))}${icon('link')}</a></li>${p.url ? `<li><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${icon('link')}${esc(t('website'))}</a></li>` : ''}<li><button type="button" data-move>${icon('move')}${esc(t('moveTo'))}</button></li><li><button type="button" class="danger" data-remove>${icon('trash')}${esc(t('remove'))}</button></li></ul>`, sh => {
    sh.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => { setSlot(pid, day, b.dataset.slot); sh.querySelectorAll('[data-slot]').forEach(x => x.setAttribute('aria-selected', x === b)); render(); });
    $('[data-remove]', sh).onclick = () => { removeFromDay(pid, day); sh.close(); render(); toast(t('removed'), { label: t('undo'), fn: () => { addToDay(pid, day, r.s); render(); } }); };
    $('[data-move]', sh).onclick = () => openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(t('moveTo'))}</div>${dayMenu(pid)}`, sh2 => sh2.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { const d = b.dataset.day; if (d !== day && b.dataset.here !== '1') { removeFromDay(pid, day); addToDay(pid, d, r.s); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`); } sh2.close(); render(); }));
  }); };

  /* ───────── views ───────── */
  const VIEWS = ['plan', 'explore', 'book'];
  const setView = v => { S.view = VIEWS.includes(v) ? v : 'plan'; if (location.hash.replace('#', '') !== S.view) history.replaceState(null, '', '#' + S.view); render(); if (S.view === 'plan') setTimeout(() => map && map.invalidateSize(), 60); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const renderChrome = () => {
    document.documentElement.lang = S.lang; document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
    $('#brandDates').textContent = t('dates'); $('.brand b').textContent = S.lang === 'ar' ? 'تونس' : 'Tunisia';
    $('#langBtn').textContent = S.lang === 'ar' ? 'English' : 'العربية';
    $('#langBtn').setAttribute('aria-label', S.lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    $('#viewTabs').innerHTML = VIEWS.map(v => `<button type="button" role="tab" id="tab-${v}" aria-selected="${S.view === v}" data-view="${v}">${esc(t(v))}</button>`).join('');
    $('#tabbar').innerHTML = VIEWS.map(v => `<button type="button" role="tab" aria-selected="${S.view === v}" data-view="${v}">${icon(v)}${esc(t(v))}</button>`).join('');
    document.querySelectorAll('[data-view]').forEach(b => b.onclick = e => { e.preventDefault(); setView(b.dataset.view); });
    $('.brand').onclick = e => { e.preventDefault(); S.addingTo = null; setView('plan'); };
    VIEWS.forEach(v => $('#' + v).hidden = S.view !== v);
    $('#search').placeholder = t('search'); $('#searchIcon').innerHTML = icon('search');
  };

  /* ── Plan ── */
  const renderDayStrip = () => {
    const today = todayIso();
    const chips = [`<button type="button" class="chip" role="tab" aria-selected="${S.day === 'trip'}" data-day="trip">${esc(t('trip'))}</button>`, ...T.days.map(d => `<button type="button" class="chip" role="tab" aria-selected="${S.day === d.id}" data-day="${d.id}">${d.date === today ? '<span class="dot"></span>' : ''}${esc(dayLabel(d))}</button>`)];
    const el = $('#dayStrip'); el.innerHTML = chips.join(''); el.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { S.day = b.dataset.day; render(); });
    const on = $('[aria-selected="true"]', el); if (on) el.scrollLeft += (on.getBoundingClientRect().left + on.offsetWidth / 2) - (el.getBoundingClientRect().left + el.clientWidth / 2);
  };

  const rowHtml = (p, r, day) => `<button type="button" class="row" data-row="${esc(p.id)}" data-day="${day}"><span class="glyph" style="--c:${catColor(p.cat)}">${icon(p.cat)}</span><span><b>${esc(tx(p))}</b><small>${esc(areaLabel(p.area))}${p.dur ? ` · ${esc(dur(p))}` : ''}${p.book ? ` · ${esc(t(p.book))}` : ''}</small></span><span class="chev">${icon('chevron')}</span></button>`;
  const fixedHtml = f => { const tm = fixedTime(f); return `<div class="row fixed"><span class="glyph">${icon(f.kind === 'flight' ? 'flight' : 'drive')}</span><span><b>${esc(L2(f))}</b><small>${esc(t(f.kind))}</small></span><span class="time">${tm ? esc(tm) : `<a class="link" href="#book" data-view-link="book">${esc(t('setTime'))}</a>`}</span></div>`; };

  const renderDayPanel = () => {
    const host = $('#dayPanel');
    if (S.day === 'trip') {
      host.innerHTML = `<header class="dayHead"><div class="eyebrow">${esc(t('travelers'))} · ${esc(t('dates'))}</div><h1>${esc(t('trip'))}</h1><p class="stayLine">${esc(t('overviewLead'))}</p></header><ol class="overview">${T.days.map((d, i) => { const st = d.stay ? stayFor(d.stay) : null; const n = rowsOf(d.id).length; return `<li><button type="button" data-day="${d.id}"><span class="d">${esc(dayLabel(d))}<small>${esc(t('day'))} ${i + 1}</small></span><span><b>${esc(L2({ en: d.ten, ar: d.tar }))}</b><small>${st ? `${icon('stay')} ${esc(st.n)}` : esc(t('noStay'))}</small></span>${n ? `<span class="badge">${n}</span>` : ''}</button></li>`; }).join('')}</ol>`;
      host.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { S.day = b.dataset.day; render(); });
      return;
    }
    const d = dayById[S.day]; const st = d.stay ? stayFor(d.stay) : null; const block = d.stay ? stayBlock(d.stay) : null;
    const items = [...d.fixed.map(f => ({ f, s: f.slot, k: 0 })), ...rowsOf(d.id).map((r, i) => ({ r, s: r.s, k: 1 + i }))].sort((a, b) => slotIndex(a.s) - slotIndex(b.s) || a.k - b.k);
    let html = `<header class="dayHead"><div class="eyebrow">${esc(t('day'))} ${dayIndex(d.id) + 1} · ${esc(longDate(d))}</div><h1>${esc(L2({ en: d.ten, ar: d.tar }))}</h1><p class="stayLine">${icon('stay')} ${st ? `<span>${esc(st.n)} · ${esc(L2({ en: block.n, ar: block.na }))}</span><a href="#book" data-view-link="book">${esc(t('change'))}</a>` : `<span>${esc(t('noStay'))}</span>`}</p></header>`;
    if (!items.length) html += `<p class="empty">${esc(t('nothingPlanned'))}</p>`;
    else { let cur = null; html += '<ol class="timeline">'; items.forEach(it => { if (it.s !== cur) { cur = it.s; html += `<li class="slotHead">${esc(L2(T.slots[slotIndex(cur)]))}</li>`; } html += '<li>' + (it.f ? fixedHtml(it.f) : rowHtml(byId[it.r.p], it.r, d.id)) + '</li>'; }); html += '</ol>'; }
    if (d.id !== 'D1') html += `<button type="button" class="addBtn" id="addFrom">${icon('plus')}${esc(t('addFromExplore'))}</button>`;
    html += `<div class="footnote"><button type="button" class="link" id="resetPlan">${esc(t('reset'))}</button></div>`;
    host.innerHTML = html;
    host.querySelectorAll('[data-row]').forEach(b => b.onclick = () => rowSheet(b.dataset.row, b.dataset.day));
    const add = $('#addFrom'); if (add) add.onclick = () => { S.addingTo = d.id; S.area = d.areas[0] || 'all'; S.q = ''; setView('explore'); };
    $('#resetPlan').onclick = () => { if (confirm(t('resetConfirm'))) { S.plan = defaultPlan(); save(); render(); } };
    host.querySelectorAll('[data-view-link]').forEach(a => a.onclick = e => { e.preventDefault(); setView(a.dataset.viewLink); });
  };

  /* ── Map ── */
  let map, layer, tiles;
  const DAYC = ['#86868b', '#2563eb', '#0d9488', '#e8590c', '#c026d3', '#7c3aed', '#d97706', '#dc2626'];
  const ensureMap = () => {
    const el = $('#map'); if (map) return true;
    if (typeof L === 'undefined') { el.classList.add('off'); el.textContent = t('mapOff'); return false; }
    map = L.map(el, { scrollWheelZoom: false, zoomSnap: .5 });
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    tiles = L.tileLayer(`https://{s}.basemaps.cartocdn.com/${dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`, { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' }).addTo(map);
    layer = L.layerGroup().addTo(map); map.setView([36.3, 10.4], 8);
    return true;
  };
  const renderMap = () => {
    if (!ensureMap()) return; layer.clearLayers();
    const pts = [];
    const dayPts = d => { const rows = [...d.fixed.filter(f => f.ll).map(f => ({ ll: f.ll, s: f.slot, k: 0, name: L2(f), sub: t(f.kind), color: 'var(--fixed)', hex: '#86868b' })), ...rowsOf(d.id).map((r, i) => { const p = byId[r.p]; return p.ll ? { ll: p.ll, s: r.s, k: 1 + i, name: tx(p), sub: areaLabel(p.area), url: mapsUrl(p), color: catColor(p.cat), hex: getComputedStyle(document.documentElement).getPropertyValue('--' + p.cat).trim() || '#0071e3', p } : null; }).filter(Boolean)]; return rows.sort((a, b) => slotIndex(a.s) - slotIndex(b.s) || a.k - b.k); };
    if (S.day === 'trip') T.days.forEach((d, i) => dayPts(d).forEach(x => pts.push({ ...x, hex: DAYC[i], day: d }))); else pts.push(...dayPts(dayById[S.day]));
    if (pts.length > 1) L.polyline(pts.map(x => x.ll), { color: '#86868b', weight: 2, opacity: .55, dashArray: '4 6' }).addTo(layer);
    pts.forEach((x, i) => { const m = L.circleMarker(x.ll, { radius: 8, color: '#fff', weight: 2, fillColor: x.hex, fillOpacity: 1 }).addTo(layer); m.bindPopup(`<b>${esc(x.name)}</b>${esc(x.sub)}${x.day ? ` · ${esc(dayLabel(x.day))}` : ''}${x.url ? `<br><a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(t('directions'))} ↗</a>` : ''}`); if (S.day !== 'trip') m.bindTooltip(`<span>${i + 1}</span>`, { permanent: true, direction: 'top', className: 'pinLabel', offset: [0, -8] }); });
    if (pts.length) { const b = L.latLngBounds(pts.map(x => x.ll)); map.fitBounds(b.pad(.25), { maxZoom: S.day === 'trip' ? 8 : 13, animate: false }); } else map.setView([36.3, 10.4], 8);
    setTimeout(() => map.invalidateSize(), 30);
  };

  /* ── Explore ── */
  const renderExplore = () => {
    $('#catTabs').innerHTML = T.cats.map(c => `<button type="button" role="tab" aria-selected="${S.cat === c.id}" data-cat="${c.id}" style="--c:${catColor(c.id)}">${icon(c.id)}${esc(L2(c))}</button>`).join('');
    $('#catTabs').querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { S.cat = b.dataset.cat; render(); });
    const banner = $('#addingBanner');
    if (S.addingTo) { const d = dayById[S.addingTo]; banner.hidden = false; banner.innerHTML = `<span>${esc(t('addingTo'))} <b>${esc(dayLabel(d))}</b> · ${esc(L2({ en: d.ten, ar: d.tar }))}</span><button type="button" class="btn" id="doneAdding">${esc(t('done'))}</button>`; $('#doneAdding').onclick = () => { const d = S.addingTo; S.addingTo = null; S.day = d; setView('plan'); }; } else banner.hidden = true;
    const inCat = T.places.filter(p => p.cat === S.cat);
    const areas = Object.keys(T.areas).filter(a => inCat.some(p => p.area === a));
    if (S.area !== 'all' && !areas.includes(S.area)) S.area = 'all';
    $('#areaChips').innerHTML = [`<button type="button" class="chip" aria-selected="${S.area === 'all'}" data-area="all">${esc(t('all'))}</button>`, ...areas.map(a => `<button type="button" class="chip" aria-selected="${S.area === a}" data-area="${a}">${esc(areaLabel(a))}</button>`)].join('');
    $('#areaChips').querySelectorAll('[data-area]').forEach(b => b.onclick = () => { S.area = b.dataset.area; render(); });
    const q = S.q.trim().toLowerCase();
    const list = inCat.filter(p => (S.area === 'all' || p.area === S.area) && (!q || `${p.n} ${p.na} ${p.b} ${p.ba} ${T.areas[p.area].en} ${T.areas[p.area].ar}`.toLowerCase().includes(q)));
    $('#placeGrid').innerHTML = list.length ? list.map(p => { const days = inDays(p.id); const on = S.addingTo ? days.includes(S.addingTo) : days.length > 0; const label = on ? `${t('added')}${!S.addingTo && days.length ? ` · ${days.map(d => dayLabel(dayById[d])).join(', ')}` : ''}` : t('add'); return `<article class="card"><div class="cardTop"><span class="glyph" style="--c:${catColor(p.cat)}">${icon(p.cat)}</span><span>${esc(areaLabel(p.area))}</span>${p.price ? `<span class="price">${p.price}</span>` : ''}</div><h3>${esc(tx(p))}</h3><p>${esc(tx(p, 'b'))}</p><div class="tags">${p.dur ? `<span class="tag">${esc(dur(p))}</span>` : ''}${p.tags.map(g => `<span class="tag${g === 'friday' || g === 'closedMon' ? ' warn' : ''}">${esc(L2(T.tags[g]))}</span>`).join('')}</div><div class="actions"><button type="button" class="btn${on ? ' on' : ''}" data-add="${p.id}">${icon(on ? 'check' : 'plus')}${esc(label)}</button>${p.ll ? `<a class="btn ghost" href="${mapsUrl(p)}" target="_blank" rel="noopener noreferrer">${icon('pin')}${esc(t('directions'))}</a>` : ''}${p.url ? `<a class="ext" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(t('website'))} ↗</a>` : ''}</div></article>`; }).join('') : `<p class="noResults">${esc(t('noResults'))}</p>`;
    $('#placeGrid').querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const pid = b.dataset.add; if (S.addingTo) { const d = S.addingTo; if (inDays(pid).includes(d)) { removeFromDay(pid, d); toast(t('removed')); } else { addToDay(pid, d); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`, { label: t('view'), fn: () => { S.addingTo = null; S.day = d; setView('plan'); } }); } render(); } else placeSheet(pid); });
  };

  /* ── Book ── */
  const scoreRow = (o, keys) => `<div class="scores">${keys.map(([k, lab]) => `<div>${esc(t(lab))}<b>${o[k] ?? '—'}</b></div>`).join('')}${o.tier ? `<div>${esc(t('value'))}<b>${esc(o.tier)}</b></div>` : ''}</div>`;
  const reservations = () => {
    const out = [];
    T.stays.forEach(b => { const st = stayFor(b.id); if (st) out.push({ key: `stay:${b.id}`, b: st.n, s: `${L2({ en: b.n, ar: b.na })} · ${S.lang === 'ar' ? b.nightsAr : b.nights}`, url: st.url }); });
    const car = T.cars.find(c => c.id === S.car) || T.cars[0]; out.push({ key: 'car', b: car.n, s: t('car'), url: car.link });
    T.days.forEach(d => rowsOf(d.id).forEach(r => { const p = byId[r.p]; if (p.book) out.push({ key: `p:${d.id}:${p.id}`, b: tx(p), s: `${dayLabel(d)} · ${L2(T.slots[slotIndex(r.s)])} · ${t(p.book)}`, url: p.url || mapsUrl(p) }); }));
    return out;
  };
  const summary = () => { const lines = [`Tunisia · ${t('dates')} · ${t('travelers')}`, `${t('flights')}: ${T.flight.airline} · ${T.flight.route} · ${S.flight.out.dep || '?'} → ${S.flight.out.arr || '?'} · ${t('ret')} ${S.flight.back.dep || '?'}`, ...T.stays.map(b => `${L2({ en: b.n, ar: b.na })}: ${stayFor(b.id)?.n || '—'}`), `${t('car')}: ${(T.cars.find(c => c.id === S.car) || T.cars[0]).n}`, '']; T.days.forEach(d => { lines.push(`${dayLabel(d)} · ${L2({ en: d.ten, ar: d.tar })}`); [...d.fixed.map(f => ({ s: f.slot, k: 0, txt: `${fixedTime(f) || '--:--'} ${L2(f)}` })), ...rowsOf(d.id).map((r, i) => ({ s: r.s, k: 1 + i, txt: `${L2(T.slots[slotIndex(r.s)])} · ${tx(byId[r.p])}` }))].sort((a, b) => slotIndex(a.s) - slotIndex(b.s) || a.k - b.k).forEach(x => lines.push('  ' + x.txt)); }); return lines.join('\n'); };
  const copy = async (text, ok) => { try { await navigator.clipboard.writeText(text); toast(ok); } catch (e) { prompt(ok, text); } };

  const renderBook = () => {
    const host = $('#bookPanel'); const car = T.cars.find(c => c.id === S.car) || T.cars[0]; const res = reservations();
    const optRow = (o, block, chosen) => `<li><span><b>${esc(o.n)}${o.suggested ? ` <span class="badge">${esc(t('suggested'))}</span>` : ''}</b><small>${esc([o.type, o.guests, o.rating, o.tag].filter(Boolean).join(' · '))}${o.exp != null ? ` · ${t('experience')} ${o.exp} · ${t('privacy')} ${o.priv} · ${t('value')} ${o.val}` : ''}</small></span><button type="button" class="btn${chosen ? ' on' : ' ghost'}" data-stay="${block}" data-opt="${esc(o.id)}">${chosen ? icon('check') + esc(t('chosen')) : esc(t('choose'))}</button></li>`;
    host.innerHTML = `<header class="bookHead"><h1>${esc(t('bookTitle'))}</h1><p>${esc(t('bookLead'))}</p></header>
    <section class="section"><h2>${esc(t('flights'))} <span class="status">${icon('check')}${esc(t('booked'))}</span></h2><p class="lead">${esc(t('flightHelp'))}</p><div class="panel"><h3>${esc(T.flight.airline)}</h3><div class="kv"><span>${esc(t('outbound'))}</span><span>${esc(T.flight.route)} · Fri 18 → Sat 19 Sep</span><span>${esc(t('ret'))}</span><span>TUN → RUH · Fri 25 Sep</span></div><div class="fields"><label class="field">${esc(t('outbound'))} · ${esc(t('departs'))}<input type="time" data-f="out.dep" value="${esc(S.flight.out.dep)}"></label><label class="field">${esc(t('outbound'))} · ${esc(t('arrives'))}<input type="time" data-f="out.arr" value="${esc(S.flight.out.arr)}"></label><label class="field">${esc(t('ret'))} · ${esc(t('departs'))}<input type="time" data-f="back.dep" value="${esc(S.flight.back.dep)}"></label><label class="field">${esc(t('leaveFor'))}<input type="time" data-f="back.leave" value="${esc(S.flight.back.leave)}" placeholder="${esc(leaveTime())}"></label></div></div></section>
    <section class="section" id="staysSection"><h2>${esc(t('stays'))}</h2><p class="lead">${esc(t('staysLead'))}</p>${T.stays.map(b => { const st = stayFor(b.id); const opts = [...b.options, ...S.suggestions.filter(x => x.block === b.id)]; const open = S.open[b.id]; return `<div class="panel" data-block="${b.id}"><div class="eyebrow">${esc(L2({ en: b.n, ar: b.na }))} · ${esc(S.lang === 'ar' ? b.nightsAr : b.nights)}</div><h3>${esc(st.n)}</h3><p class="note">${esc([st.type, st.guests, st.rating].filter(Boolean).join(' · '))}</p>${st.exp != null ? scoreRow(st, [['exp', 'experience'], ['priv', 'privacy']]) : ''}${st.note ? `<p class="note">${esc(st.note)}</p>` : ''}<div class="actions">${st.url ? `<a class="btn" href="${esc(st.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openListing'))}${icon('link')}</a>` : ''}<button type="button" class="btn ghost" data-toggle="${b.id}">${esc(open ? t('hide') : t('otherOptions'))} · ${opts.length}</button></div>${open ? `<ul class="optList">${opts.map(o => optRow(o, b.id, o.id === st.id)).join('')}</ul><form class="suggest" data-suggest="${b.id}"><input name="n" placeholder="${esc(t('suggestName'))}" required maxlength="120"><input name="u" type="url" placeholder="${esc(t('suggestUrl'))}"><button type="submit" class="btn ghost">${icon('plus')}${esc(t('addSuggestion'))}</button></form>` : ''}</div>`; }).join('')}</section>
    <section class="section" id="carSection"><h2>${esc(t('car'))}</h2><p class="lead">${esc(t('carLead'))}</p><div class="panel"><h3>${esc(car.n)}</h3><p class="note">${esc(car.type)} · ${esc(car.avail)}</p><div class="scores"><div>${esc(t('luxury'))}<b>${car.lux}</b></div><div>${esc(t('comfort'))}<b>${car.comfort}</b></div><div>${esc(t('value'))}<b>${car.val}</b></div></div><p class="note">${esc(car.note)} ${esc(car.price)}.</p><div class="actions"><a class="btn" href="${esc(car.link)}" target="_blank" rel="noopener noreferrer">${esc(t('checkRentals'))}${icon('link')}</a><button type="button" class="btn ghost" data-toggle="car">${esc(S.open.car ? t('hide') : t('otherOptions'))} · ${T.cars.length}</button></div>${S.open.car ? `<ul class="optList">${T.cars.map(c => `<li><span><b>${esc(c.n)}</b><small>${esc(c.type)} · ${esc(c.tag)} · ${t('luxury')} ${c.lux} · ${t('comfort')} ${c.comfort} · ${t('value')} ${c.val}</small></span><button type="button" class="btn${c.id === car.id ? ' on' : ' ghost'}" data-car="${c.id}">${c.id === car.id ? icon('check') + esc(t('chosen')) : esc(t('choose'))}</button></li>`).join('')}</ul>` : ''}</div></section>
    <section class="section" id="resSection"><h2>${esc(t('reservations'))}</h2><p class="lead">${esc(t('reservationsLead'))}</p>${res.length ? `<ul class="checks">${res.map(x => `<li class="${S.checks[x.key] ? 'done' : ''}"><input type="checkbox" data-check="${esc(x.key)}" ${S.checks[x.key] ? 'checked' : ''} aria-label="${esc(x.b)}"><span><b>${esc(x.b)}</b><small>${esc(x.s)}</small></span>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(t('website'))} ↗</a>` : ''}</li>`).join('')}</ul>` : `<p class="note">${esc(t('nothingToBook'))}</p>`}</section>
    <section class="section"><h2>${esc(t('share'))}</h2><p class="lead">${esc(t('shareLead'))}</p><div class="share"><button type="button" class="btn" id="shareBtn">${icon('share')}${esc(t('share'))}</button><button type="button" class="btn ghost" id="copyBtn">${icon('copy')}${esc(t('copySummary'))}</button></div><pre class="brief" id="brief">${esc(summary())}</pre></section>
    <section class="section"><h2>${esc(t('goodToKnow'))}</h2><ul class="tips">${T.goodToKnow.map(g => { const s = L2(g); const i = s.indexOf(':'); return `<li>${i > 0 ? `<b>${esc(s.slice(0, i + 1))}</b>${esc(s.slice(i + 1))}` : esc(s)}</li>`; }).join('')}</ul></section>`;
    host.querySelectorAll('[data-f]').forEach(inp => inp.onchange = () => { const [a, b] = inp.dataset.f.split('.'); S.flight[a][b] = inp.value; save(); render(); });
    host.querySelectorAll('[data-toggle]').forEach(b => b.onclick = () => { S.open[b.dataset.toggle] = !S.open[b.dataset.toggle]; render(); });
    host.querySelectorAll('[data-stay]').forEach(b => b.onclick = () => { S.stays[b.dataset.stay] = b.dataset.opt; save(); render(); });
    host.querySelectorAll('[data-car]').forEach(b => b.onclick = () => { S.car = b.dataset.car; save(); render(); });
    host.querySelectorAll('[data-check]').forEach(c => c.onchange = () => { S.checks[c.dataset.check] = c.checked; save(); render(); });
    host.querySelectorAll('[data-suggest]').forEach(f => f.onsubmit = e => { e.preventDefault(); const n = f.n.value.trim(); if (!n) return; const u = f.u.value.trim(); const id = `sug-${Date.now().toString(36)}`; S.suggestions.push({ id, block: f.dataset.suggest, n, url: /^https?:\/\//i.test(u) ? u : null, type: t('suggested'), suggested: true }); S.stays[f.dataset.suggest] = id; save(); render(); });
    $('#shareBtn').onclick = () => copy(shareUrl(), t('linkCopied'));
    $('#copyBtn').onclick = () => copy(summary(), t('copied'));
  };

  /* ───────── render ───────── */
  const render = () => {
    renderChrome();
    if (S.view === 'plan') { renderDayStrip(); renderDayPanel(); renderMap(); }
    if (S.view === 'explore') renderExplore();
    if (S.view === 'book') renderBook();
  };

  /* ───────── boot ───────── */
  const loaded = importHash();
  const today = todayIso(); S.day = (T.days.find(d => d.date === today) || T.days[1]).id;
  const h = location.hash.replace('#', ''); if (VIEWS.includes(h)) S.view = h;
  $('#langBtn').onclick = () => { S.lang = S.lang === 'ar' ? 'en' : 'ar'; save(); render(); };
  $('#search').oninput = e => { S.q = e.target.value; renderExplore(); };
  window.addEventListener('hashchange', () => { const v = location.hash.replace('#', ''); if (VIEWS.includes(v) && v !== S.view) setView(v); });
  render();
  if (loaded) toast(t('planLoaded'));
  window.TRIP_APP = { S, render, addToDay, removeFromDay, setView, shareUrl, summary };
})();
