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
    view: ['View', 'عرض'], undo: ['Undo', 'تراجع'], flights: ['Flights', 'الرحلات الجوية'],
    route: ['Route', 'المسار'], routeLead: ['Six nights. Tap a night to change where you sleep; the stays, drives and each day’s plan follow.', 'ست ليالٍ. اضغطوا على ليلة لتغيير مكان المبيت؛ تتبعها الإقامات والمسافات وخطة كل يوم.'],
    presets: ['Presets', 'خطط جاهزة'], night: ['Night', 'ليلة'], chooseBase: ['Where do you sleep this night?', 'أين تبيتون هذه الليلة؟'],
    nightsIn: ['nights', 'ليالٍ'], checkOut: ['Check out of', 'تسجيل الخروج من'], drive: ['Drive', 'قيادة'], checkIn: ['check in at', 'وتسجيل الدخول في'],
    arriveIn: ['Arrive · first day in', 'الوصول · اليوم الأول في'], toAirport: ['→ airport → Jeddah → Riyadh', '← المطار ← جدة ← الرياض'],
    land: ['Land at Tunis–Carthage · bags, car, then', 'الهبوط في مطار تونس قرطاج · الحقائب والسيارة ثم'], to: ['to', 'إلى'],
    leaveFor: ['for Tunis–Carthage · Terminal M, be there by 08:40', 'إلى مطار تونس قرطاج · المبنى M، الوصول قبل 08:40'], leave: ['Leave', 'الانطلاق من'],
    stays: ['Stays', 'الإقامات'], staysLead: ['One home per stop. Photos are the listing’s own where available, otherwise a live preview of the listing page. Add the group’s suggestions under each stop.', 'بيت واحد لكل محطة. الصور من الإعلان نفسه حيث توفرت، وإلا فمعاينة حية لصفحة الإعلان. أضيفوا اقتراحات المجموعة أسفل كل محطة.'],
    experience: ['Experience', 'التجربة'], privacy: ['Privacy', 'الخصوصية'], value: ['Value', 'القيمة'], chosen: ['Chosen', 'المختار'], choose: ['Choose', 'اختيار'],
    openListing: ['Open listing', 'فتح الإعلان'], options: ['options', 'خيارات'], showOptions: ['Show all options', 'عرض كل الخيارات'], hide: ['Hide options', 'إخفاء الخيارات'],
    suggestName: ['Name of the place', 'اسم المكان'], suggestUrl: ['Link (optional)', 'الرابط (اختياري)'], addSuggestion: ['Add suggestion', 'إضافة اقتراح'],
    suggested: ['Group suggestion', 'اقتراح المجموعة'], car: ['Car', 'السيارة'],
    carLead: ['One SUV for the whole trip. Confirm automatic, unlimited km and full cover in writing.', 'سيارة واحدة للرحلة كلها. أكدوا الأوتوماتيك والكيلومترات غير المحدودة والتأمين الكامل كتابةً.'],
    luxury: ['Luxury', 'الفخامة'], comfort: ['Comfort', 'الراحة'], checkRentals: ['Check rentals', 'تحقق من التأجير'],
    reservations: ['Reservations', 'ما يلزم حجزه'], reservationsLead: ['Built from your route and plan. Tick things off as you book them.', 'مبنية من مساركم وخطتكم. علّموا ما حجزتموه.'],
    nothingToBook: ['Nothing in your plan needs a reservation yet.', 'لا شيء في خطتكم يحتاج حجزًا بعد.'],
    share: ['Share plan', 'مشاركة الخطة'], copySummary: ['Copy summary', 'نسخ الملخص'], linkCopied: ['Link copied. Send it in the family group.', 'تم نسخ الرابط. أرسلوه في مجموعة العائلة.'],
    copied: ['Copied', 'تم النسخ'], planLoaded: ['Plan loaded from the shared link', 'تم تحميل الخطة من الرابط'], goodToKnow: ['Good to know', 'معلومات مفيدة'],
    reset: ['Reset to recommended plan', 'إعادة الخطة المقترحة'], resetConfirm: ['Replace your plan with the recommended one for this route?', 'هل تريدون استبدال خطتكم بالخطة المقترحة لهذا المسار؟'],
    mapOff: ['Map unavailable right now. Every place still opens in Maps.', 'الخريطة غير متاحة الآن. كل مكان يفتح في الخرائط.'],
    flight: ['Flight', 'طيران'], reserve: ['Reserve', 'احجزوا'], tickets: ['Tickets', 'تذاكر'], travelers: ['3 adults', '3 بالغين'],
    bookTitle: ['Book', 'الحجوزات'], bookLead: ['Decide the route, pick a home for each stop, the car, and the tables and tickets your plan needs.', 'حددوا المسار، واختاروا بيتًا لكل محطة، والسيارة، والطاولات والتذاكر التي تحتاجها خطتكم.'],
    shareLead: ['One link carries the route, the stays and every pick. Everyone who opens it sees the same thing.', 'رابط واحد يحمل المسار والإقامات وكل الاختيارات. كل من يفتحه يرى الشيء نفسه.'],
    overviewLead: ['Tap a day to open it.', 'اضغطوا على يوم لفتحه.'], min: ['min', 'دقيقة']
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
    move: '<path d="M5 12h14M13 6l6 6-6 6"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
  };
  const icon = n => `<span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true">${I[n] || ''}</svg></span>`;
  const catColor = c => `var(--${c})`;

  /* ───────── state ───────── */
  const byId = Object.fromEntries(T.places.map(p => [p.id, p]));
  const dayById = Object.fromEntries(T.days.map(d => [d.id, d]));
  const BASES = Object.keys(T.bases);
  const validRoute = r => Array.isArray(r) && r.length === T.nights.length && r.every(b => BASES.includes(b));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const saved = load() || {};
  const S = { lang: saved.lang === 'ar' ? 'ar' : 'en', view: 'plan', day: null, cat: 'food', area: 'all', q: '', addingTo: null, plan: null, route: validRoute(saved.route) ? saved.route : [...T.defaultRoute], stays: {}, car: saved.car || T.cars[0].id, checks: saved.checks || {}, suggestions: saved.suggestions || [], closed: {}, carOpen: false };
  // stays: one chosen option per base (an older version keyed a "central" block; map it to its pool)
  const oldStays = saved.stays || {};
  Object.entries(oldStays).forEach(([k, v]) => { if (BASES.includes(k)) S.stays[k] = v; else BASES.forEach(b => { if (T.stayPools[b].some(o => o.id === v)) S.stays[b] = v; }); });
  BASES.forEach(b => { if (!S.stays[b]) S.stays[b] = T.stayPools[b][0].id; });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ lang: S.lang, plan: S.plan, route: S.route, stays: S.stays, car: S.car, checks: S.checks, suggestions: S.suggestions })); } catch (e) { } };

  /* ───────── route → plan ───────── */
  const tuples = route => { let n = 0, prev = null; return route.map(b => { n = b === prev ? n + 1 : 0; prev = b; return `${b}:${n}`; }); };
  const templateRows = key => { const [b, n] = key.split(':'); const tpl = T.templates[b]; return tpl[Number(n) % tpl.length].map(x => { const [p, s] = x.split('@'); return { p, s: s || byId[p].slot }; }); };
  const defaultPlan = route => { const plan = {}; T.days.forEach(d => plan[d.id] = []); tuples(route).forEach((k, i) => plan[T.nights[i]] = templateRows(k)); return plan; };
  S.plan = saved.plan || defaultPlan(S.route);
  const setRoute = route => { const before = tuples(S.route), after = tuples(route); after.forEach((k, i) => { if (k !== before[i]) S.plan[T.nights[i]] = templateRows(k); }); S.route = route; save(); };

  // shared link → state
  const b64e = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64d = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
  const importHash = () => {
    const m = location.hash.match(/^#s=([A-Za-z0-9_-]+)/); if (!m) return false;
    try { const d = JSON.parse(b64d(m[1])); if (validRoute(d.route)) S.route = d.route; if (d.plan) S.plan = d.plan; if (d.stays) Object.assign(S.stays, d.stays); if (d.car) S.car = d.car; if (d.suggestions) S.suggestions = d.suggestions; save(); history.replaceState(null, '', location.pathname); return true; } catch (e) { return false; }
  };
  const shareUrl = () => `${location.origin}${location.pathname}#s=${b64e(JSON.stringify({ route: S.route, plan: S.plan, stays: S.stays, car: S.car, suggestions: S.suggestions }))}`;

  /* ───────── helpers ───────── */
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dayIndex = id => T.days.findIndex(d => d.id === id);
  const slotIndex = s => T.slots.findIndex(x => x.id === s);
  const longDate = d => new Intl.DateTimeFormat(S.lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(d.date + 'T12:00:00'));
  const areaLabel = a => L2(T.areas[a]);
  const baseLabel = b => L2(T.bases[b]);
  const mapsUrl = p => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q || `${p.n.replace(/ · /g, ', ')}, ${T.areas[p.area].en.split(' · ')[0]}, Tunisia`)}`;
  const rowsOf = d => (S.plan[d] || []);
  const inDays = pid => T.days.filter(d => rowsOf(d.id).some(r => r.p === pid)).map(d => d.id);
  const dur = p => S.lang === 'ar' ? p.dur.replace(/\bh\b/g, 'س').replace(/min/g, 'د').replace('Full day', 'يوم كامل').replace('Half day', 'نصف يوم') : p.dur;
  const dayLabel = d => L2({ en: d.en, ar: d.ar });
  const fmtH = h => { const H = Math.floor(h), m = Math.round((h - H) * 60); if (S.lang === 'ar') { const hs = H === 0 ? '' : H === 1 ? 'ساعة' : H === 2 ? 'ساعتان' : `${H} ساعات`; return [hs, m ? `${m} دقيقة` : ''].filter(Boolean).join(' و'); } return H ? `${H} h${m ? ` ${m}` : ''}` : `${m} min`; };
  const hhmm = mins => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  const driveH = (a, b) => T.driveHours[`${a}-${b}`] ?? T.driveHours[`${b}-${a}`] ?? 1;
  const arrow = S => S.lang === 'ar' ? '←' : '→';

  const dayBase = d => { const i = dayIndex(d.id); return i === 0 ? null : i === T.days.length - 1 ? S.route[T.nights.length - 1] : S.route[i - 1]; };
  const prevBase = d => { const i = dayIndex(d.id); return i >= 2 && i <= T.nights.length ? S.route[i - 2] : null; };
  const dayAreas = d => { const b = dayBase(d), p = prevBase(d); return b ? [...T.bases[b].areas, ...(p && p !== b ? T.bases[p].areas : [])] : []; };
  const dayTitle = d => { const i = dayIndex(d.id), b = dayBase(d), p = prevBase(d); if (i === 0) return L2({ en: d.ten, ar: d.tar }); if (i === 1) return `${t('arriveIn')} ${baseLabel(b)}`; if (i === T.days.length - 1) return `${baseLabel(b)} ${t('toAirport')}`; return p && p !== b ? `${baseLabel(p)} ${arrow(S)} ${baseLabel(b)}` : baseLabel(b); };
  const poolOf = b => [...T.stayPools[b], ...S.suggestions.filter(x => x.block === b)];
  const stayFor = b => { const pool = poolOf(b); return pool.find(o => o.id === S.stays[b]) || pool[0]; };
  const blocks = () => { const out = []; S.route.forEach((b, i) => { const last = out[out.length - 1]; if (last && last.base === b && last.end === i - 1) { last.end = i; last.nights++; } else out.push({ base: b, start: i, end: i, nights: 1 }); }); return out.map(x => ({ ...x, from: dayById[T.nights[x.start]], to: dayById[T.days[dayIndex(T.nights[x.end]) + 1].id], label: `${baseLabel(x.base)} · ${dayLabel(dayById[T.nights[x.start]])} – ${dayLabel(dayById[T.days[dayIndex(T.nights[x.end]) + 1].id])} · ${x.nights} ${t('nightsIn')}` })); };
  const fixedRows = d => {
    const i = dayIndex(d.id), b = dayBase(d), p = prevBase(d), rows = [...d.fixed];
    if (i === 1 && b) { const st = stayFor(b); rows.push({ slot: 'morning', time: '09:00', en: `${UI.land[0]} ~${fmtH(T.bases[b].airport)} ${UI.to[0]} ${st.n}`, ar: `${UI.land[1]} ~${fmtH(T.bases[b].airport)} ${UI.to[1]} ${st.n}`, ll: [36.8510, 10.2272], kind: 'flight' }); }
    if (p && p !== b) { const h = driveH(p, b), from = stayFor(p), to = stayFor(b); rows.push({ slot: 'morning', time: '', en: `${UI.checkOut[0]} ${from.n}`, ar: `${UI.checkOut[1]} ${from.n}`, kind: 'stay' }); rows.push({ slot: 'afternoon', time: '', en: `${UI.drive[0]} ${T.bases[p].en} → ${T.bases[b].en} · ~${fmtH(h)} · ${UI.checkIn[0]} ${to.n}`, ar: `${UI.drive[1]} ${T.bases[p].ar} ← ${T.bases[b].ar} · ~${fmtH(h)} · ${UI.checkIn[1]} ${to.n}`, ll: to.ll, kind: 'drive' }); }
    if (i === T.days.length - 1 && b) { const h = T.bases[b].airport, st = stayFor(b); rows.unshift({ slot: 'morning', time: hhmm(8 * 60 + 40 - Math.round(h * 60) - 15), en: `${UI.leave[0]} ${st.n} ${UI.leaveFor[0]} · ~${fmtH(h)}`, ar: `${UI.leave[1]} ${st.n} ${UI.leaveFor[1]} · ~${fmtH(h)}`, kind: 'drive' }); }
    return rows;
  };

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
  const dayMenu = pid => { const p = byId[pid]; const present = inDays(pid); return `<ul class="menu">${T.days.filter(d => d.id !== 'D1').map(d => { const here = present.includes(d.id); const match = dayAreas(d).includes(p.area); return `<li><button type="button" data-day="${d.id}" data-here="${here ? 1 : 0}">${icon(here ? 'check' : (match ? 'pin' : 'plan'))}<span><b>${esc(dayLabel(d))}</b> · ${esc(dayTitle(d))}</span>${here ? `<span class="sub">${esc(t('added'))}</span>` : (match ? `<span class="sub">${esc(areaLabel(p.area).split(' · ')[0])}</span>` : '')}</button></li>`; }).join('')}</ul>`; };

  const placeSheet = pid => { const p = byId[pid]; openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(t('addTo'))}</div>${dayMenu(pid)}`, sh => { sh.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { const d = b.dataset.day; if (b.dataset.here === '1') { removeFromDay(pid, d); toast(`${t('removed')} · ${dayLabel(dayById[d])}`, { label: t('undo'), fn: () => { addToDay(pid, d); render(); } }); } else { addToDay(pid, d); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`, { label: t('view'), fn: () => { S.day = d; setView('plan'); } }); } sh.close(); render(); }); }); };

  const rowSheet = (pid, day) => { const p = byId[pid]; const r = rowsOf(day).find(x => x.p === pid); if (!r) return; openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(areaLabel(p.area))}${p.dur ? ` · ${esc(dur(p))}` : ''}${p.price ? ` · ${p.price}` : ''}</div><div class="eyebrow">${esc(t('timeOfDay'))}</div><div class="seg" role="tablist">${T.slots.map(s => `<button type="button" role="tab" aria-selected="${s.id === r.s}" data-slot="${s.id}">${esc(L2(s))}</button>`).join('')}</div><ul class="menu"><li><a href="${mapsUrl(p)}" target="_blank" rel="noopener noreferrer">${icon('pin')}${esc(t('directions'))}${icon('link')}</a></li>${p.url ? `<li><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${icon('link')}${esc(t('website'))}</a></li>` : ''}<li><button type="button" data-move>${icon('move')}${esc(t('moveTo'))}</button></li><li><button type="button" class="danger" data-remove>${icon('trash')}${esc(t('remove'))}</button></li></ul>`, sh => {
    sh.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => { setSlot(pid, day, b.dataset.slot); sh.querySelectorAll('[data-slot]').forEach(x => x.setAttribute('aria-selected', x === b)); render(); });
    $('[data-remove]', sh).onclick = () => { removeFromDay(pid, day); sh.close(); render(); toast(t('removed'), { label: t('undo'), fn: () => { addToDay(pid, day, r.s); render(); } }); };
    $('[data-move]', sh).onclick = () => openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(t('moveTo'))}</div>${dayMenu(pid)}`, sh2 => sh2.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { const d = b.dataset.day; if (d !== day && b.dataset.here !== '1') { removeFromDay(pid, day); addToDay(pid, d, r.s); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`); } sh2.close(); render(); }));
  }); };

  const nightSheet = i => { const d = dayById[T.nights[i]]; openSheet(`<h2>${esc(t('night'))} ${i + 1} · ${esc(dayLabel(d))}</h2><div class="sub">${esc(t('chooseBase'))}</div><ul class="menu">${BASES.map(b => `<li><button type="button" data-base="${b}">${icon(S.route[i] === b ? 'check' : 'stay')}<span><b>${esc(baseLabel(b))}</b></span><span class="sub">${esc(stayFor(b).n)}</span></button></li>`).join('')}</ul>`, sh => sh.querySelectorAll('[data-base]').forEach(b => b.onclick = () => { const r = [...S.route]; r[i] = b.dataset.base; setRoute(r); sh.close(); render(); })); };

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
  const fixedHtml = f => `<div class="row fixed"><span class="glyph">${icon(f.kind === 'flight' ? 'flight' : f.kind === 'stay' ? 'stay' : 'drive')}</span><span><b>${esc(L2(f))}</b><small>${esc(t(f.kind))}</small></span><span class="time">${esc(f.time || '')}</span></div>`;

  const renderDayPanel = () => {
    const host = $('#dayPanel');
    if (S.day === 'trip') {
      host.innerHTML = `<header class="dayHead"><div class="eyebrow">${esc(t('travelers'))} · ${esc(t('dates'))}</div><h1>${esc(t('trip'))}</h1><p class="stayLine">${esc(t('overviewLead'))}</p></header><ol class="overview">${T.days.map((d, i) => { const b = dayBase(d); const st = b ? stayFor(b) : null; const n = rowsOf(d.id).length; return `<li><button type="button" data-day="${d.id}"><span class="d">${esc(dayLabel(d))}<small>${esc(t('day'))} ${i + 1}</small></span><span><b>${esc(dayTitle(d))}</b><small>${st ? `${icon('stay')} ${esc(st.n)}` : esc(t('noStay'))}</small></span>${n ? `<span class="badge">${n}</span>` : ''}</button></li>`; }).join('')}</ol>`;
      host.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { S.day = b.dataset.day; render(); });
      return;
    }
    const d = dayById[S.day]; const b = dayBase(d); const st = b ? stayFor(b) : null;
    const items = [...fixedRows(d).map((f, i) => ({ f, s: f.slot, k: i - 100 })), ...rowsOf(d.id).map((r, i) => ({ r, s: r.s, k: i }))].sort((a, b2) => slotIndex(a.s) - slotIndex(b2.s) || a.k - b2.k);
    let html = `<header class="dayHead"><div class="eyebrow">${esc(t('day'))} ${dayIndex(d.id) + 1} · ${esc(longDate(d))}</div><h1>${esc(dayTitle(d))}</h1><p class="stayLine">${icon('stay')} ${st ? `<span>${esc(st.n)}${st.n.includes(T.bases[b].en.split(' · ')[0]) ? '' : ` · ${esc(baseLabel(b))}`}</span><a href="#book" data-view-link="book">${esc(t('change'))}</a>` : `<span>${esc(t('noStay'))}</span>`}</p></header>`;
    if (!items.length) html += `<p class="empty">${esc(t('nothingPlanned'))}</p>`;
    else { let cur = null; html += '<ol class="timeline">'; items.forEach(it => { if (it.s !== cur) { cur = it.s; html += `<li class="slotHead">${esc(L2(T.slots[slotIndex(cur)]))}</li>`; } html += '<li>' + (it.f ? fixedHtml(it.f) : rowHtml(byId[it.r.p], it.r, d.id)) + '</li>'; }); html += '</ol>'; }
    if (d.id !== 'D1') html += `<button type="button" class="addBtn" id="addFrom">${icon('plus')}${esc(t('addFromExplore'))}</button>`;
    html += `<div class="footnote"><button type="button" class="link" id="resetPlan">${esc(t('reset'))}</button></div>`;
    host.innerHTML = html;
    host.querySelectorAll('[data-row]').forEach(x => x.onclick = () => rowSheet(x.dataset.row, x.dataset.day));
    const add = $('#addFrom'); if (add) add.onclick = () => { S.addingTo = d.id; S.area = dayAreas(d)[0] || 'all'; S.q = ''; setView('explore'); };
    $('#resetPlan').onclick = () => { if (confirm(t('resetConfirm'))) { S.plan = defaultPlan(S.route); save(); render(); } };
    host.querySelectorAll('[data-view-link]').forEach(a => a.onclick = e => { e.preventDefault(); setView(a.dataset.viewLink); });
  };

  /* ── Map ── */
  let map, layer;
  const DAYC = ['#86868b', '#2563eb', '#0d9488', '#e8590c', '#c026d3', '#7c3aed', '#d97706', '#dc2626'];
  const ensureMap = () => {
    const el = $('#map'); if (map) return true;
    if (typeof L === 'undefined') { el.classList.add('off'); el.textContent = t('mapOff'); return false; }
    map = L.map(el, { scrollWheelZoom: false, zoomSnap: .5 });
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`, { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' }).addTo(map);
    layer = L.layerGroup().addTo(map); map.setView([36.3, 10.4], 8);
    return true;
  };
  const renderMap = () => {
    if (!ensureMap()) return; layer.clearLayers();
    const pts = [];
    const dayPts = d => { const rows = [...fixedRows(d).filter(f => f.ll).map((f, i) => ({ ll: f.ll, s: f.slot, k: i - 100, name: L2(f), sub: t(f.kind), hex: '#86868b' })), ...rowsOf(d.id).map((r, i) => { const p = byId[r.p]; return p.ll ? { ll: p.ll, s: r.s, k: i, name: tx(p), sub: areaLabel(p.area), url: mapsUrl(p), hex: getComputedStyle(document.documentElement).getPropertyValue('--' + p.cat).trim() || '#0071e3' } : null; }).filter(Boolean)]; return rows.sort((a, b) => slotIndex(a.s) - slotIndex(b.s) || a.k - b.k); };
    if (S.day === 'trip') T.days.forEach((d, i) => dayPts(d).forEach(x => pts.push({ ...x, hex: DAYC[i], day: d }))); else pts.push(...dayPts(dayById[S.day]));
    if (pts.length > 1) L.polyline(pts.map(x => x.ll), { color: '#86868b', weight: 2, opacity: .55, dashArray: '4 6' }).addTo(layer);
    pts.forEach((x, i) => { const m = L.circleMarker(x.ll, { radius: 8, color: '#fff', weight: 2, fillColor: x.hex, fillOpacity: 1, className: 'pin' }).addTo(layer); m.bindPopup(`<b>${esc(x.name)}</b>${esc(x.sub)}${x.day ? ` · ${esc(dayLabel(x.day))}` : ''}${x.url ? `<br><a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(t('directions'))} ↗</a>` : ''}`); if (S.day !== 'trip') m.bindTooltip(`<span>${i + 1}</span>`, { permanent: true, direction: 'top', className: 'pinLabel', offset: [0, -8] }); });
    if (pts.length) { const b = L.latLngBounds(pts.map(x => x.ll)); map.fitBounds(b.pad(.25), { maxZoom: S.day === 'trip' ? 8 : 13, animate: false }); } else map.setView([36.3, 10.4], 8);
    setTimeout(() => map.invalidateSize(), 30);
  };

  /* ── Explore ── */
  const renderExplore = () => {
    $('#catTabs').innerHTML = T.cats.map(c => `<button type="button" role="tab" aria-selected="${S.cat === c.id}" data-cat="${c.id}" style="--c:${catColor(c.id)}">${icon(c.id)}${esc(L2(c))}</button>`).join('');
    $('#catTabs').querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { S.cat = b.dataset.cat; render(); });
    const banner = $('#addingBanner');
    if (S.addingTo) { const d = dayById[S.addingTo]; banner.hidden = false; banner.innerHTML = `<span>${esc(t('addingTo'))} <b>${esc(dayLabel(d))}</b> · ${esc(dayTitle(d))}</span><button type="button" class="btn" id="doneAdding">${esc(t('done'))}</button>`; $('#doneAdding').onclick = () => { const d2 = S.addingTo; S.addingTo = null; S.day = d2; setView('plan'); }; } else banner.hidden = true;
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
  const photo = (o, big) => `<div class="photo${big ? ' big' : ''}">${(o.img || []).length ? `<img loading="lazy" src="${esc(o.img[0])}" alt="${esc(o.n)}">` : ''}<span class="photoFallback">${icon('stay')}</span></div>`;
  const stayCard = (o, base, chosen) => `<article class="stayCard${chosen ? ' chosen' : ''}">${photo(o)}<div class="stayBody"><h4>${esc(o.n)}${o.suggested ? ` <span class="badge">${esc(t('suggested'))}</span>` : ''}</h4><small>${esc([o.type, o.guests, o.rating].filter(Boolean).join(' · '))}</small>${o.exp != null ? `<div class="mini"><span>${esc(t('experience'))} <b>${o.exp}</b></span><span>${esc(t('privacy'))} <b>${o.priv}</b></span><span>${esc(t('value'))} <b>${esc(o.tier || o.val)}</b></span></div>` : ''}<div class="actions"><button type="button" class="btn${chosen ? ' on' : ''}" data-stay="${base}" data-opt="${esc(o.id)}">${chosen ? icon('check') + esc(t('chosen')) : esc(t('choose'))}</button>${o.url ? `<a class="ext" href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openListing'))} ↗</a>` : ''}</div></div></article>`;
  const reservations = () => {
    const out = [];
    blocks().forEach(b => { const st = stayFor(b.base); out.push({ key: `stay:${b.base}:${b.start}`, b: st.n, s: b.label, url: st.url }); });
    const car = T.cars.find(c => c.id === S.car) || T.cars[0]; out.push({ key: 'car', b: car.n, s: t('car'), url: car.link });
    T.days.forEach(d => rowsOf(d.id).forEach(r => { const p = byId[r.p]; if (p.book) out.push({ key: `p:${d.id}:${p.id}`, b: tx(p), s: `${dayLabel(d)} · ${L2(T.slots[slotIndex(r.s)])} · ${t(p.book)}`, url: p.url || mapsUrl(p) }); }));
    return out;
  };
  const summary = () => { const lines = [`Tunisia · ${t('dates')} · ${t('travelers')}`, `${t('flights')}: ${L2(T.flight.out)}`, `${t('flights')}: ${L2(T.flight.back)}`, `${t('route')}: ${blocks().map(b => `${baseLabel(b.base)} ${b.nights}`).join(' · ')}`, ...blocks().map(b => `${b.label}: ${stayFor(b.base).n}`), `${t('car')}: ${(T.cars.find(c => c.id === S.car) || T.cars[0]).n}`, '']; T.days.forEach(d => { lines.push(`${dayLabel(d)} · ${dayTitle(d)}`); [...fixedRows(d).map((f, i) => ({ s: f.slot, k: i - 100, txt: `${f.time || '--:--'} ${L2(f)}` })), ...rowsOf(d.id).map((r, i) => ({ s: r.s, k: i, txt: `${L2(T.slots[slotIndex(r.s)])} · ${tx(byId[r.p])}` }))].sort((a, b) => slotIndex(a.s) - slotIndex(b.s) || a.k - b.k).forEach(x => lines.push('  ' + x.txt)); }); return lines.join('\n'); };
  const copy = async (text, ok) => { try { await navigator.clipboard.writeText(text); toast(ok); } catch (e) { prompt(ok, text); } };

  const renderBook = () => {
    const host = $('#bookPanel'); const car = T.cars.find(c => c.id === S.car) || T.cars[0]; const res = reservations(); const bl = blocks();
    host.innerHTML = `<header class="bookHead"><h1>${esc(t('bookTitle'))}</h1><p>${esc(t('bookLead'))}</p></header>
    <section class="section" id="routeSection"><h2>${esc(t('route'))}</h2><p class="lead">${esc(t('routeLead'))}</p><div class="nights">${S.route.map((b, i) => `<button type="button" class="nightCell" data-night="${i}"><small>${esc(dayLabel(dayById[T.nights[i]]))}</small><b>${esc(baseLabel(b))}</b></button>`).join('')}</div><div class="eyebrow">${esc(t('presets'))}</div><div class="presets">${T.routePresets.map((p, i) => `<button type="button" class="chip" aria-selected="${p.route.join() === S.route.join()}" data-preset="${i}">${esc(L2(p))}</button>`).join('')}</div></section>
    <section class="section" id="staysSection"><h2>${esc(t('stays'))}</h2><p class="lead">${esc(t('staysLead'))}</p>${bl.map(b => { const st = stayFor(b.base); const pool = poolOf(b.base); const closed = S.closed[b.base]; return `<div class="panel stayPanel" data-block="${b.base}"><div class="eyebrow">${esc(b.label)}</div><article class="stayCard hero">${photo(st, true)}<div class="stayBody"><h3>${esc(st.n)}${st.suggested ? ` <span class="badge">${esc(t('suggested'))}</span>` : ''}</h3><small>${esc([st.type, st.guests, st.rating].filter(Boolean).join(' · '))}</small>${st.exp != null ? `<div class="scores"><div>${esc(t('experience'))}<b>${st.exp}</b></div><div>${esc(t('privacy'))}<b>${st.priv}</b></div><div>${esc(t('value'))}<b>${esc(st.tier || st.val)}</b></div></div>` : ''}${st.note ? `<p class="note">${esc(st.note)}</p>` : ''}<div class="actions">${st.url ? `<a class="btn" href="${esc(st.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openListing'))}${icon('link')}</a>` : ''}<button type="button" class="btn ghost" data-toggle="${b.base}">${esc(closed ? t('showOptions') : t('hide'))} · ${pool.length}</button></div></div></article>${closed ? '' : `<div class="stayRail">${pool.map(o => stayCard(o, b.base, o.id === st.id)).join('')}</div><form class="suggest" data-suggest="${b.base}"><input name="n" placeholder="${esc(t('suggestName'))}" required maxlength="120"><input name="u" type="url" placeholder="${esc(t('suggestUrl'))}"><button type="submit" class="btn ghost">${icon('plus')}${esc(t('addSuggestion'))}</button></form>`}</div>`; }).join('')}</section>
    <section class="section" id="carSection"><h2>${esc(t('car'))}</h2><p class="lead">${esc(t('carLead'))}</p><div class="panel"><h3>${esc(car.n)}</h3><p class="note">${esc(car.type)} · ${esc(car.avail)}</p><div class="scores"><div>${esc(t('luxury'))}<b>${car.lux}</b></div><div>${esc(t('comfort'))}<b>${car.comfort}</b></div><div>${esc(t('value'))}<b>${car.val}</b></div></div><p class="note">${esc(car.note)} ${esc(car.price)}.</p><div class="actions"><a class="btn" href="${esc(car.link)}" target="_blank" rel="noopener noreferrer">${esc(t('checkRentals'))}${icon('link')}</a><button type="button" class="btn ghost" data-toggle="car">${esc(S.carOpen ? t('hide') : t('showOptions'))} · ${T.cars.length}</button></div>${S.carOpen ? `<ul class="optList">${T.cars.map(c => `<li><span><b>${esc(c.n)}</b><small>${esc(c.type)} · ${esc(c.tag)} · ${t('luxury')} ${c.lux} · ${t('comfort')} ${c.comfort} · ${t('value')} ${c.val}</small></span><button type="button" class="btn${c.id === car.id ? ' on' : ' ghost'}" data-car="${c.id}">${c.id === car.id ? icon('check') + esc(t('chosen')) : esc(t('choose'))}</button></li>`).join('')}</ul>` : ''}</div></section>
    <section class="section" id="resSection"><h2>${esc(t('reservations'))}</h2><p class="lead">${esc(t('reservationsLead'))}</p>${res.length ? `<ul class="checks">${res.map(x => `<li class="${S.checks[x.key] ? 'done' : ''}"><input type="checkbox" data-check="${esc(x.key)}" ${S.checks[x.key] ? 'checked' : ''} aria-label="${esc(x.b)}"><span><b>${esc(x.b)}</b><small>${esc(x.s)}</small></span>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(t('website'))} ↗</a>` : ''}</li>`).join('')}</ul>` : `<p class="note">${esc(t('nothingToBook'))}</p>`}</section>
    <section class="section"><h2>${esc(t('share'))}</h2><p class="lead">${esc(t('shareLead'))}</p><div class="share"><button type="button" class="btn" id="shareBtn">${icon('share')}${esc(t('share'))}</button><button type="button" class="btn ghost" id="copyBtn">${icon('copy')}${esc(t('copySummary'))}</button></div><pre class="brief" id="brief">${esc(summary())}</pre></section>
    <section class="section"><h2>${esc(t('goodToKnow'))}</h2><ul class="tips">${T.goodToKnow.map(g => { const s = L2(g); const i = s.indexOf(':'); return `<li>${i > 0 ? `<b>${esc(s.slice(0, i + 1))}</b>${esc(s.slice(i + 1))}` : esc(s)}</li>`; }).join('')}</ul></section>`;
    host.querySelectorAll('[data-night]').forEach(b => b.onclick = () => nightSheet(Number(b.dataset.night)));
    host.querySelectorAll('[data-preset]').forEach(b => b.onclick = () => { setRoute([...T.routePresets[Number(b.dataset.preset)].route]); render(); });
    host.querySelectorAll('[data-toggle]').forEach(b => b.onclick = () => { if (b.dataset.toggle === 'car') S.carOpen = !S.carOpen; else S.closed[b.dataset.toggle] = !S.closed[b.dataset.toggle]; render(); });
    host.querySelectorAll('[data-stay]').forEach(b => b.onclick = () => { S.stays[b.dataset.stay] = b.dataset.opt; save(); render(); });
    host.querySelectorAll('[data-car]').forEach(b => b.onclick = () => { S.car = b.dataset.car; save(); render(); });
    host.querySelectorAll('[data-check]').forEach(c => c.onchange = () => { S.checks[c.dataset.check] = c.checked; save(); render(); });
    host.querySelectorAll('[data-suggest]').forEach(f => f.onsubmit = e => { e.preventDefault(); const n = f.n.value.trim(); if (!n) return; const u = f.u.value.trim(); const ok = /^https?:\/\//i.test(u); const id = `sug-${Date.now().toString(36)}`; S.suggestions.push({ id, block: f.dataset.suggest, n, url: ok ? u : null, type: t('suggested'), suggested: true, img: ok ? [`https://s.wordpress.com/mshots/v1/${encodeURIComponent(u)}?w=1000`] : [] }); S.stays[f.dataset.suggest] = id; save(); render(); });
    host.querySelectorAll('.photo img').forEach(img => { const fail = () => img.parentNode.classList.add('none'); img.onerror = fail; if (img.complete && img.naturalWidth === 0 && img.src) setTimeout(() => { if (img.complete && img.naturalWidth === 0) fail(); }, 0); });
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
  window.TRIP_APP = { S, render, addToDay, removeFromDay, setView, setRoute, shareUrl, summary, dayAreas: id => dayAreas(dayById[id]), blocks };
})();
