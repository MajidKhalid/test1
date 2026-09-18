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
    overviewLead: ['Tap a day to open it.', 'اضغطوا على يوم لفتحه.'], min: ['min', 'دقيقة'],
    relatesTo: ['Relates to', 'يرتبط بـ'], history: ['The history behind it', 'الخلفية التاريخية'], fromWikipedia: ['Read more on Wikipedia', 'المزيد على ويكيبيديا'],
    pins: ['Places', 'الأماكن'], fDar: ['Riad · dar', 'دار · رياض'], fBeach: ['Beach', 'شاطئ'], fBoth: ['Dar + beach', 'دار + شاطئ'], fPrivate: ['Private homes only', 'بيوت خاصة فقط'],
    booked: ['Booked', 'محجوز'], checkinFrom: ['check-in from', 'تسجيل الدخول من'], sharedUpdated: ['Plan updated by the trip bot', 'حدّث مساعد الرحلة الخطة'],
    expandMap: ['Bigger map', 'تكبير الخريطة'], shrinkMap: ['Smaller map', 'تصغير الخريطة'], mapsLink: ['Open in Google Maps', 'فتح في خرائط جوجل'],
    inPlanOn: ['In your plan', 'في خطتكم'], notInPlan: ['Not in your plan yet', 'ليس في خطتكم بعد'], noMatch: ['No stay matches this filter.', 'لا إقامة تطابق هذا الفلتر.']
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

  /* ───────── Wikipedia lead image + summary (fetched once, cached on this device) ───────── */
  const WK = 'tunisia-wiki'; let wikiCache = {}; try { wikiCache = JSON.parse(localStorage.getItem(WK) || '{}'); } catch (e) { }
  const wikiPending = {};
  const wikiInfo = title => {
    if (!title) return Promise.resolve(null);
    if (wikiCache[title]) return Promise.resolve(wikiCache[title]);
    if (wikiPending[title]) return wikiPending[title];
    return wikiPending[title] = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`).then(r => r.ok ? r.json() : null).then(j => {
      const thumb = j && j.thumbnail && j.thumbnail.source; const info = { img: thumb ? thumb.replace(/\/(\d+)px-/, '/720px-') : null, thumb: thumb || null, text: (j && j.type === 'standard' && j.extract) || '', url: (j && j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page) || null };
      wikiCache[title] = info; try { localStorage.setItem(WK, JSON.stringify(wikiCache)); } catch (e) { } return info;
    }).catch(() => null);
  };
  const hydrate = root => { if (!root) return; root.querySelectorAll('[data-wiki]').forEach(el => wikiInfo(el.dataset.wiki).then(info => { if (!info || !el.isConnected) return; if (el.tagName === 'IMG') { const box = el.closest('.photo, .cardPhoto, .thumb'); if (!info.img) { if (box && box.classList.contains('thumb')) { box.classList.add('glyph'); box.innerHTML = icon('pin'); } return; } if (!el.getAttribute('src')) { el.onerror = () => { if (info.thumb && el.src !== info.thumb) el.src = info.thumb; else if (box) { if (box.classList.contains('thumb')) { box.classList.add('glyph'); box.innerHTML = icon('pin'); } else box.hidden = true; } }; el.src = info.img; if (box) box.hidden = false; } } else if (info.text) { el.textContent = info.text; el.hidden = false; const a = el.parentNode.querySelector('[data-wiki-link]'); if (a && info.url) { a.href = info.url; a.hidden = false; } } })); };
  const wikiPhoto = (p, big) => p.wiki ? `<div class="photo${big ? ' big' : ''}" hidden><img data-wiki="${esc(p.wiki)}" alt="${esc(p.n)}"></div>` : '';
  const detailHtml = p => `${wikiPhoto(p, true)}<p class="lead">${esc(tx(p, 'b'))}</p>${p.rel ? `<div class="rel"><b>${esc(t('relatesTo'))}</b> ${esc(tx(p, 'rel'))}</div>` : ''}${p.wiki ? `<div class="hist"><b>${esc(t('history'))}</b><p data-wiki="${esc(p.wiki)}" hidden></p><a data-wiki-link hidden target="_blank" rel="noopener noreferrer">${esc(t('fromWikipedia'))} ↗</a></div>` : ''}`;

  /* ───────── state ───────── */
  const byId = Object.fromEntries(T.places.map(p => [p.id, p]));
  const dayById = Object.fromEntries(T.days.map(d => [d.id, d]));
  const BASES = Object.keys(T.bases);
  const validRoute = r => Array.isArray(r) && r.length === T.nights.length && r.every(b => BASES.includes(b));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const saved = load() || {};
  const S = { lang: saved.lang === 'ar' ? 'ar' : 'en', view: 'plan', day: null, cat: 'food', area: 'all', q: '', addingTo: null, plan: null, route: validRoute(saved.route) ? saved.route : [...T.defaultRoute], stays: {}, car: saved.car || T.cars[0].id, checks: saved.checks || {}, suggestions: saved.suggestions || [], closed: {}, carOpen: false, showRoute: true, showPins: true, stayFilter: {}, stayPrivate: {}, sharedSeen: saved.sharedSeen || '', bigMap: false };
  // stays: one chosen option per base (an older version keyed a "central" block; map it to its pool)
  const oldStays = saved.stays || {};
  Object.entries(oldStays).forEach(([k, v]) => { if (BASES.includes(k)) S.stays[k] = v; else BASES.forEach(b => { if (T.stayPools[b].some(o => o.id === v)) S.stays[b] = v; }); });
  BASES.forEach(b => { if (!S.stays[b]) S.stays[b] = T.stayPools[b][0].id; });
  Object.entries(T.bookedStays || {}).forEach(([b, id]) => { S.stays[b] = id; });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ lang: S.lang, routeV: T.routeVersion, sharedSeen: S.sharedSeen, plan: S.plan, route: S.route, stays: S.stays, car: S.car, checks: S.checks, suggestions: S.suggestions })); } catch (e) { } };

  /* ───────── route → plan ───────── */
  const tuples = route => { let n = -1, prev = null; return route.map(b => { if (b !== prev) { const tk = prev && T.transitions[`${prev}>${b}`] ? `${prev}>${b}` : null; prev = b; if (tk) { n = -1; return tk; } n = 0; return `${b}:0`; } n++; return `${b}:${n}`; }); };
  const rowsFrom = list => list.map(x => { const [p, s] = x.split('@'); return { p, s: s || byId[p].slot }; });
  const templateRows = key => { if (key.includes('>')) return rowsFrom(T.transitions[key].plan); const [b, n] = key.split(':'); const tpl = T.templates[b]; return rowsFrom(tpl[Number(n) % tpl.length]); };
  const defaultPlan = route => { const plan = {}; T.days.forEach(d => plan[d.id] = []); tuples(route).forEach((k, i) => plan[T.nights[i]] = templateRows(k)); return plan; };
  S.plan = saved.plan || defaultPlan(S.route);
  const setRoute = route => { const before = tuples(S.route), after = tuples(route); after.forEach((k, i) => { if (k !== before[i]) S.plan[T.nights[i]] = templateRows(k); }); S.route = route; save(); };
  // The family fixed the route (Tunis 2 · Sousse 2 · Hammamet 2); move devices that still hold an older default.
  if (saved.routeV !== T.routeVersion) { if (saved.plan) setRoute([...T.defaultRoute]); S.routeV = T.routeVersion; save(); }

  // shared plan written by the trip bot (plan.json next to the site). Newer than what this device saw → apply.
  const applyShared = d => { if (validRoute(d.route)) S.route = d.route; if (d.plan) S.plan = d.plan; if (d.stays) Object.assign(S.stays, d.stays); if (d.car) S.car = d.car; if (d.suggestions) S.suggestions = d.suggestions; Object.entries(T.bookedStays || {}).forEach(([b, id]) => { S.stays[b] = id; }); };
  const pullShared = () => fetch(`plan.json?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(d => { if (!d || !d.updatedAt || d.updatedAt <= S.sharedSeen) return; applyShared(d); S.sharedSeen = d.updatedAt; save(); render(); toast(`${t('sharedUpdated')} · ${new Date(d.updatedAt).toLocaleString(S.lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}`); }).catch(() => { });
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
  const stayMaps = (o, base) => o.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address + ', Tunisia')}` : o.ll ? `https://www.google.com/maps/search/?api=1&query=${o.ll[0]},${o.ll[1]}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.n.split(' · ')[0] + ', ' + T.bases[base].en.split(' · ')[0] + ', Tunisia')}`;
  const airportMaps = 'https://www.google.com/maps/search/?api=1&query=Tunis-Carthage%20International%20Airport';
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
  const dayTitle = d => { const i = dayIndex(d.id), b = dayBase(d), p = prevBase(d); if (i === 0) return L2({ en: d.ten, ar: d.tar }); if (i === 1) return `${t('arriveIn')} ${baseLabel(b)}`; if (i === T.days.length - 1) return `${baseLabel(b)} ${t('toAirport')}`; if (p && p !== b) { const tr = T.transitions[`${p}>${b}`]; return `${baseLabel(p)} ${arrow(S)} ${baseLabel(b)}${tr ? ` ${L2(tr)}` : ''}`; } return baseLabel(b); };
  const poolOf = b => [...T.stayPools[b], ...S.suggestions.filter(x => x.block === b)];
  const stayFor = b => { const pool = poolOf(b); return pool.find(o => o.id === S.stays[b]) || pool[0]; };
  const blocks = () => { const out = []; S.route.forEach((b, i) => { const last = out[out.length - 1]; if (last && last.base === b && last.end === i - 1) { last.end = i; last.nights++; } else out.push({ base: b, start: i, end: i, nights: 1 }); }); return out.map(x => ({ ...x, from: dayById[T.nights[x.start]], to: dayById[T.days[dayIndex(T.nights[x.end]) + 1].id], label: `${baseLabel(x.base)} · ${dayLabel(dayById[T.nights[x.start]])} – ${dayLabel(dayById[T.days[dayIndex(T.nights[x.end]) + 1].id])} · ${x.nights} ${t('nightsIn')}` })); };
  const fixedRows = d => {
    const i = dayIndex(d.id), b = dayBase(d), p = prevBase(d), rows = [...d.fixed];
    if (i === 1 && b) { const st = stayFor(b); const ci = st.checkin ? ` · ${UI.checkinFrom[0]} ${st.checkin}` : ''; const cia = st.checkin ? ` · ${UI.checkinFrom[1]} ${st.checkin}` : ''; rows.push({ slot: 'morning', time: '09:00', en: `${UI.land[0]} ~${fmtH(T.bases[b].airport)} ${UI.to[0]} ${st.n}${ci}`, ar: `${UI.land[1]} ~${fmtH(T.bases[b].airport)} ${UI.to[1]} ${st.n}${cia}`, ll: [36.8510, 10.2272], kind: 'flight', url: stayMaps(st, b) }); }
    if (p && p !== b) { const tr = T.transitions[`${p}>${b}`]; const h = tr ? tr.h : driveH(p, b), via = tr ? ` ${L2(tr)}` : '', from = stayFor(p), to = stayFor(b); rows.push({ slot: 'morning', time: from.checkout || '', en: `${UI.checkOut[0]} ${from.n}`, ar: `${UI.checkOut[1]} ${from.n}`, kind: 'stay', url: stayMaps(from, p) }); rows.push({ slot: 'afternoon', time: '', en: `${UI.drive[0]} ${T.bases[p].en} → ${T.bases[b].en}${via} · ~${fmtH(h)} · ${UI.checkIn[0]} ${to.n}`, ar: `${UI.drive[1]} ${T.bases[p].ar} ← ${T.bases[b].ar}${via} · ~${fmtH(h)} · ${UI.checkIn[1]} ${to.n}`, ll: to.ll, kind: 'drive', url: stayMaps(to, b) }); }
    if (i === T.days.length - 1 && b) { const h = T.bases[b].airport, st = stayFor(b); rows.unshift({ slot: 'morning', time: hhmm(8 * 60 + 40 - Math.round(h * 60) - 15), en: `${UI.leave[0]} ${st.n} ${UI.leaveFor[0]} · ~${fmtH(h)}`, ar: `${UI.leave[1]} ${st.n} ${UI.leaveFor[1]} · ~${fmtH(h)}`, kind: 'drive', url: airportMaps }); }
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

  const placeSheet = pid => { const p = byId[pid]; const days = inDays(p.id); openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(areaLabel(p.area))}${p.dur ? ` · ${esc(dur(p))}` : ''}${p.price ? ` · ${p.price}` : ''}</div>${detailHtml(p)}<div class="tags">${p.tags.map(g => `<span class="tag">${esc(L2(T.tags[g]))}</span>`).join('')}</div><div class="eyebrow" style="margin-top:14px">${esc(days.length ? `${t('inPlanOn')} · ${days.map(d => dayLabel(dayById[d])).join(', ')}` : t('notInPlan'))} · ${esc(t('addTo'))}</div>${dayMenu(pid)}<ul class="menu"><li><a href="${mapsUrl(p)}" target="_blank" rel="noopener noreferrer">${icon('pin')}${esc(t('directions'))}${icon('link')}</a></li>${p.url ? `<li><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${icon('link')}${esc(t('website'))}</a></li>` : ''}</ul>`, sh => { hydrate(sh); sh.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { const d = b.dataset.day; if (b.dataset.here === '1') { removeFromDay(pid, d); toast(`${t('removed')} · ${dayLabel(dayById[d])}`, { label: t('undo'), fn: () => { addToDay(pid, d); render(); } }); } else { addToDay(pid, d); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`, { label: t('view'), fn: () => { S.day = d; setView('plan'); } }); } sh.close(); render(); }); }); };

  const rowSheet = (pid, day) => { const p = byId[pid]; const r = rowsOf(day).find(x => x.p === pid); if (!r) return; openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(areaLabel(p.area))}${p.dur ? ` · ${esc(dur(p))}` : ''}${p.price ? ` · ${p.price}` : ''}</div>${detailHtml(p)}<div class="eyebrow">${esc(t('timeOfDay'))}</div><div class="seg" role="tablist">${T.slots.map(s => `<button type="button" role="tab" aria-selected="${s.id === r.s}" data-slot="${s.id}">${esc(L2(s))}</button>`).join('')}</div><ul class="menu"><li><a href="${mapsUrl(p)}" target="_blank" rel="noopener noreferrer">${icon('pin')}${esc(t('directions'))}${icon('link')}</a></li>${p.url ? `<li><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${icon('link')}${esc(t('website'))}</a></li>` : ''}<li><button type="button" data-move>${icon('move')}${esc(t('moveTo'))}</button></li><li><button type="button" class="danger" data-remove>${icon('trash')}${esc(t('remove'))}</button></li></ul>`, sh => { hydrate(sh);
    sh.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => { setSlot(pid, day, b.dataset.slot); sh.querySelectorAll('[data-slot]').forEach(x => x.setAttribute('aria-selected', x === b)); render(); });
    $('[data-remove]', sh).onclick = () => { removeFromDay(pid, day); sh.close(); render(); toast(t('removed'), { label: t('undo'), fn: () => { addToDay(pid, day, r.s); render(); } }); };
    $('[data-move]', sh).onclick = () => openSheet(`<h2>${esc(tx(p))}</h2><div class="sub">${esc(t('moveTo'))}</div>${dayMenu(pid)}`, sh2 => sh2.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { const d = b.dataset.day; if (d !== day && b.dataset.here !== '1') { removeFromDay(pid, day); addToDay(pid, d, r.s); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`); } sh2.close(); render(); }));
  }); };

  const nightSheet = i => { const d = dayById[T.nights[i]]; openSheet(`<h2>${esc(t('night'))} ${i + 1} · ${esc(dayLabel(d))}</h2><div class="sub">${esc(t('chooseBase'))}</div><ul class="menu">${BASES.map(b => `<li><button type="button" data-base="${b}">${icon(S.route[i] === b ? 'check' : 'stay')}<span><b>${esc(baseLabel(b))}</b></span><span class="sub">${esc(stayFor(b).n)}</span></button></li>`).join('')}</ul>`, sh => sh.querySelectorAll('[data-base]').forEach(b => b.onclick = () => { const r = [...S.route]; r[i] = b.dataset.base; setRoute(r); sh.close(); render(); })); };

  /* ───────── views ───────── */
  const VIEWS = ['plan', 'explore', 'book'];
  const setView = v => { S.view = VIEWS.includes(v) ? v : 'plan'; if (location.hash.replace('#', '') !== S.view) history.replaceState(null, '', '#' + S.view); render(); if (S.view === 'plan') setTimeout(() => { if (map) map.invalidateSize(); if (gmap && window.google) window.google.maps.event.trigger(gmap, 'resize'); }, 60); window.scrollTo({ top: 0, behavior: 'instant' }); };

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

  const rowHtml = (p, r, day) => `<div class="rowWrap"><button type="button" class="row" data-row="${esc(p.id)}" data-day="${day}"><span class="glyph" style="--c:${catColor(p.cat)}">${icon(p.cat)}</span><span><b>${esc(tx(p))}</b><small>${esc(areaLabel(p.area))}${p.dur ? ` · ${esc(dur(p))}` : ''}${p.book ? ` · ${esc(t(p.book))}` : ''}</small></span><span class="chev">${icon('chevron')}</span></button><a class="rowMaps" href="${mapsUrl(p)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('directions'))} · ${esc(tx(p))}">${icon('pin')}</a></div>`;
  const fixedHtml = f => `<div class="row fixed"><span class="glyph">${icon(f.kind === 'flight' ? 'flight' : f.kind === 'stay' ? 'stay' : 'drive')}</span><span><b>${esc(L2(f))}</b><small>${esc(t(f.kind))}${f.url ? ` · <a class="mapsA" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(t('directions'))} ↗</a>` : ''}</small></span><span class="time">${esc(f.time || '')}</span></div>`;

  const renderDayPanel = () => {
    const host = $('#dayPanel');
    if (S.day === 'trip') {
      host.innerHTML = `<header class="dayHead"><div class="eyebrow">${esc(t('travelers'))} · ${esc(t('dates'))}</div><h1>${esc(t('trip'))}</h1><p class="stayLine">${esc(t('overviewLead'))}</p></header><ol class="overview">${T.days.map((d, i) => { const b = dayBase(d); const st = b ? stayFor(b) : null; const n = rowsOf(d.id).length; return `<li><button type="button" data-day="${d.id}"><span class="d">${esc(dayLabel(d))}<small>${esc(t('day'))} ${i + 1}</small></span><span><b>${esc(dayTitle(d))}</b><small>${st ? `${icon('stay')} ${esc(st.n)}` : esc(t('noStay'))}</small></span>${n ? `<span class="badge">${n}</span>` : ''}</button></li>`; }).join('')}</ol>`;
      host.querySelectorAll('[data-day]').forEach(b => b.onclick = () => { S.day = b.dataset.day; render(); });
      return;
    }
    const d = dayById[S.day]; const b = dayBase(d); const st = b ? stayFor(b) : null;
    const items = [...fixedRows(d).map((f, i) => ({ f, s: f.slot, k: i - 100 })), ...rowsOf(d.id).map((r, i) => ({ r, s: r.s, k: i }))].sort((a, b2) => slotIndex(a.s) - slotIndex(b2.s) || a.k - b2.k);
    let html = `<header class="dayHead"><div class="eyebrow">${esc(t('day'))} ${dayIndex(d.id) + 1} · ${esc(longDate(d))}</div><h1>${esc(dayTitle(d))}</h1><p class="stayLine">${icon('stay')} ${st ? `<span>${esc(st.n)}${st.n.includes(T.bases[b].en.split(' · ')[0]) ? '' : ` · ${esc(baseLabel(b))}`}</span><a href="${stayMaps(st, b)}" target="_blank" rel="noopener noreferrer">${esc(t('directions'))} ↗</a>${st.booked ? `<span class="badge">${esc(t('booked'))}</span>` : `<a href="#book" data-view-link="book">${esc(t('change'))}</a>`}` : `<span>${esc(t('noStay'))}</span>`}</p></header>`;
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
  const CFG = window.TRIP_CONFIG || {};
  const svgPin = (kind, hex) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15" fill="#fff" stroke="${hex}" stroke-width="2.5"/><g transform="translate(9 9) scale(0.67)" fill="none" stroke="${hex}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[kind] || I.pin}</g></svg>`)}`;
  const dayPts = d => { const rows = [...fixedRows(d).filter(f => f.ll).map((f, i) => ({ ll: f.ll, s: f.slot, k: i - 100, name: L2(f), sub: `${dayLabel(d)} · ${L2(T.slots[slotIndex(f.slot)])}`, kind: f.kind, url: f.url, hex: '#86868b' })), ...rowsOf(d.id).map((r, i) => { const p = byId[r.p]; return p.ll ? { ll: p.ll, s: r.s, k: i, p, name: tx(p), sub: `${dayLabel(d)} · ${L2(T.slots[slotIndex(r.s)])} · ${areaLabel(p.area)}`, kind: p.cat, url: mapsUrl(p), hex: getComputedStyle(document.documentElement).getPropertyValue('--' + p.cat).trim() || '#0071e3' } : null; }).filter(Boolean)]; return rows.sort((a, b) => slotIndex(a.s) - slotIndex(b.s) || a.k - b.k); };
  const mapPoints = () => { const pts = []; if (S.day === 'trip') T.days.forEach(d => dayPts(d).forEach(x => pts.push(x))); else pts.push(...dayPts(dayById[S.day])); return pts; };
  const popHtml = x => `<div class="pop">${x.p ? wikiPhoto(x.p) : ''}<b>${esc(x.name)}</b><small>${esc(x.sub)}</small>${x.p ? `<p>${esc(tx(x.p, 'b'))}</p>` : ''}${x.url ? `<a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(t('directions'))} ↗</a>` : ''}</div>`;
  const renderMapTools = ready => { const el = $('#mapTools'); if (!el) return; if (!ready) { el.hidden = true; return; } el.hidden = false; el.innerHTML = `<button type="button" class="tool" data-tool="route" aria-pressed="${S.showRoute}">${esc(t('route'))}</button><button type="button" class="tool" data-tool="pins" aria-pressed="${S.showPins}">${esc(t('pins'))}</button><button type="button" class="tool onlyMobile" data-tool="size" aria-pressed="${S.bigMap}">${esc(S.bigMap ? t('shrinkMap') : t('expandMap'))}</button>`; el.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => { if (b.dataset.tool === 'route') S.showRoute = !S.showRoute; else if (b.dataset.tool === 'pins') S.showPins = !S.showPins; else { S.bigMap = !S.bigMap; $('#map').classList.toggle('big', S.bigMap); } renderMap(); }); };

  // Road routes: OSRM (free, keyless) for the Leaflet map; Google Directions for the Google map. Cached per point sequence.
  const routeCache = {};
  const osrmRoute = async pts => { const key = pts.map(p => p.join(',')).join(';'); if (routeCache[key]) return routeCache[key]; const coords = pts.map(p => `${p[1]},${p[0]}`).join(';'); try { const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`); const j = await r.json(); const line = j.routes && j.routes[0] && j.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); if (line) routeCache[key] = line; return line || null; } catch (e) { return null; } };

  // Leaflet implementation
  let map, layer, routeReq = 0;
  const leafletMap = () => {
    const el = $('#map'); if (map) return true;
    if (typeof L === 'undefined') { el.classList.add('off'); el.textContent = t('mapOff'); return false; }
    map = L.map(el, { scrollWheelZoom: false, zoomSnap: .5 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    layer = L.layerGroup().addTo(map); map.setView([36.3, 10.4], 8); return true;
  };
  const pinIcon = (kind, hex) => L.divIcon({ className: 'pinWrap', html: `<div class="pinIcon" style="--c:${hex}">${icon(kind)}</div>`, iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14] });
  const renderLeaflet = () => {
    if (!leafletMap()) return; layer.clearLayers(); const pts = mapPoints(); const req = ++routeReq;
    if (S.showPins) pts.forEach(x => { const m = L.marker(x.ll, { icon: pinIcon(x.kind, x.hex) }).addTo(layer); m.bindPopup(popHtml(x), { maxWidth: 280, minWidth: 220 }); m.on('popupopen', e => hydrate(e.popup.getElement())); });
    if (S.showRoute && pts.length > 1) { const straight = L.polyline(pts.map(x => x.ll), { color: '#4285f4', weight: 3, opacity: .5, dashArray: '4 6', className: 'routeLine' }).addTo(layer); osrmRoute(pts.map(x => x.ll)).then(line => { if (line && req === routeReq && layer.hasLayer(straight)) { layer.removeLayer(straight); L.polyline(line, { color: '#4285f4', weight: 5, opacity: .85, className: 'routeLine road' }).addTo(layer); } }); }
    if (pts.length) { const b = L.latLngBounds(pts.map(x => x.ll)); map.fitBounds(b.pad(.25), { maxZoom: S.day === 'trip' ? 8 : 13, animate: false }); } else map.setView([36.3, 10.4], 8);
    setTimeout(() => map.invalidateSize(), 30);
  };

  // Google Maps implementation (used when TRIP_CONFIG.googleMapsKey is set)
  let gmap, gMarkers = [], gRoute = null, gInfo = null, gLoading = null;
  const loadGoogle = () => { if (window.google && window.google.maps) return Promise.resolve(true); if (gLoading) return gLoading; gLoading = new Promise(res => { const sc = document.createElement('script'); sc.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(CFG.googleMapsKey)}&v=weekly&language=${S.lang}&region=TN&loading=async`; sc.async = true; sc.onload = () => res(!!(window.google && window.google.maps)); sc.onerror = () => res(false); document.head.appendChild(sc); }); return gLoading; };
  const renderGoogle = async () => {
    const el = $('#map'); const ok = await loadGoogle(); if (!ok) { CFG.googleMapsKey = ''; el.innerHTML = ''; renderMap(); return; }
    const g = window.google.maps;
    if (!gmap) { gmap = new g.Map(el, { center: { lat: 36.3, lng: 10.4 }, zoom: 8, mapId: CFG.googleMapId || undefined, gestureHandling: 'greedy', mapTypeControl: false, streetViewControl: false, fullscreenControl: false, clickableIcons: false }); gInfo = new g.InfoWindow({ maxWidth: 280 }); }
    gMarkers.forEach(m => m.setMap(null)); gMarkers = []; if (gRoute) { gRoute.setMap(null); gRoute = null; }
    const pts = mapPoints(); const req = ++routeReq;
    if (S.showPins) pts.forEach(x => { const m = new g.Marker({ position: { lat: x.ll[0], lng: x.ll[1] }, map: gmap, icon: { url: svgPin(x.kind, x.hex), scaledSize: new g.Size(34, 34), anchor: new g.Point(17, 17) }, title: x.name }); m.addListener('click', () => { gInfo.setContent(popHtml(x)); gInfo.open({ map: gmap, anchor: m }); setTimeout(() => hydrate(document.querySelector('.gm-style-iw')), 50); }); gMarkers.push(m); });
    if (S.showRoute && pts.length > 1) {
      const draw = path => { if (req !== routeReq) return; gRoute = new g.Polyline({ path, map: gmap, strokeColor: '#4285f4', strokeOpacity: .9, strokeWeight: 5 }); };
      const key = 'g:' + pts.map(p => p.ll.join(',')).join(';');
      if (routeCache[key]) draw(routeCache[key]);
      else if (pts.length <= 27) { new g.DirectionsService().route({ origin: { lat: pts[0].ll[0], lng: pts[0].ll[1] }, destination: { lat: pts[pts.length - 1].ll[0], lng: pts[pts.length - 1].ll[1] }, waypoints: pts.slice(1, -1).map(p => ({ location: { lat: p.ll[0], lng: p.ll[1] }, stopover: true })), travelMode: g.TravelMode.DRIVING }, (r, status) => { if (status === 'OK' && r.routes[0]) { const path = r.routes[0].overview_path; routeCache[key] = path; draw(path); } else osrmRoute(pts.map(x => x.ll)).then(line => line && draw(line.map(c => ({ lat: c[0], lng: c[1] })))); }); }
      else osrmRoute(pts.map(x => x.ll)).then(line => line && draw(line.map(c => ({ lat: c[0], lng: c[1] }))));
    }
    if (pts.length) { const b = new g.LatLngBounds(); pts.forEach(x => b.extend({ lat: x.ll[0], lng: x.ll[1] })); gmap.fitBounds(b, 40); if (pts.length === 1) gmap.setZoom(13); } else { gmap.setCenter({ lat: 36.3, lng: 10.4 }); gmap.setZoom(8); }
  };
  const renderMap = () => { const google = !!CFG.googleMapsKey; renderMapTools(google || typeof L !== 'undefined'); if (google) renderGoogle(); else renderLeaflet(); };

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
    $('#placeGrid').innerHTML = list.length ? list.map(p => { const days = inDays(p.id); const on = S.addingTo ? days.includes(S.addingTo) : days.length > 0; const label = on ? `${t('added')}${!S.addingTo && days.length ? ` · ${days.map(d => dayLabel(dayById[d])).join(', ')}` : ''}` : t('add'); return `<article class="card"><div class="cardTop"><span class="glyph" style="--c:${catColor(p.cat)}">${icon(p.cat)}</span><span>${esc(areaLabel(p.area))}</span>${p.price ? `<span class="price">${p.price}</span>` : ''}</div>${p.wiki ? `<div class="cardPhoto" hidden><img data-wiki="${esc(p.wiki)}" alt="${esc(p.n)}" loading="lazy"></div>` : ''}<h3><button type="button" class="titleBtn" data-open="${p.id}">${esc(tx(p))}</button></h3><p>${esc(tx(p, 'b'))}</p><div class="tags">${p.dur ? `<span class="tag">${esc(dur(p))}</span>` : ''}${p.tags.map(g => `<span class="tag${g === 'friday' || g === 'closedMon' ? ' warn' : ''}">${esc(L2(T.tags[g]))}</span>`).join('')}</div><div class="actions"><button type="button" class="btn${on ? ' on' : ''}" data-add="${p.id}">${icon(on ? 'check' : 'plus')}${esc(label)}</button><a class="btn ghost" href="${mapsUrl(p)}" target="_blank" rel="noopener noreferrer">${icon('pin')}${esc(t('directions'))}</a>${p.url ? `<a class="ext" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(t('website'))} ↗</a>` : ''}</div></article>`; }).join('') : `<p class="noResults">${esc(t('noResults'))}</p>`;
    $('#placeGrid').querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const pid = b.dataset.add; if (S.addingTo) { const d = S.addingTo; if (inDays(pid).includes(d)) { removeFromDay(pid, d); toast(t('removed')); } else { addToDay(pid, d); toast(`${t('addedTo')} ${dayLabel(dayById[d])}`, { label: t('view'), fn: () => { S.addingTo = null; S.day = d; setView('plan'); } }); } render(); } else placeSheet(pid); });
    $('#placeGrid').querySelectorAll('[data-open]').forEach(b => b.onclick = () => placeSheet(b.dataset.open));
    hydrate($('#placeGrid'));
  };

  /* ── Book ── */
  const photo = (o, big) => { const imgs = o.img || []; return `<div class="photo${big ? ' big' : ''}${imgs.length > 1 ? ' rail' : ''}${imgs.length ? '' : ' none'}">${imgs.map(u => `<img loading="lazy" src="${esc(u)}" alt="${esc(o.n)}">`).join('')}<span class="photoFallback">${icon('stay')}</span></div>`; };
  const stayFilters = base => { const f = S.stayFilter[base] || 'all', pv = !!S.stayPrivate[base]; return `<div class="chips stayFilters">${[['all', 'all'], ['dar', 'fDar'], ['beach', 'fBeach'], ['both', 'fBoth']].map(([id, k]) => `<button type="button" class="chip" aria-selected="${f === id}" data-filter="${id}" data-base="${base}">${esc(t(k))}</button>`).join('')}<button type="button" class="chip" aria-selected="${pv}" data-private="${base}">${esc(t('fPrivate'))}</button></div>`; };
  const filteredPool = base => { const f = S.stayFilter[base] || 'all', pv = !!S.stayPrivate[base]; return poolOf(base).filter(o => (f === 'all' || o.x === f) && (!pv || o.priv8 || o.suggested)); };
  const stayCard = (o, base, chosen) => `<article class="stayCard${chosen ? ' chosen' : ''}">${photo(o)}<div class="stayBody"><h4>${esc(o.n)}${o.booked ? ` <span class="badge">${esc(t('booked'))}</span>` : ''}${o.suggested ? ` <span class="badge">${esc(t('suggested'))}</span>` : ''}</h4><small>${esc([o.type, o.guests, o.rating].filter(Boolean).join(' · '))}</small>${o.exp != null ? `<div class="mini"><span>${esc(t('experience'))} <b>${o.exp}</b></span><span>${esc(t('privacy'))} <b>${o.priv}</b></span><span>${esc(t('value'))} <b>${esc(o.tier || o.val)}</b></span></div>` : ''}<div class="actions"><button type="button" class="btn${chosen ? ' on' : ''}" data-stay="${base}" data-opt="${esc(o.id)}" ${T.bookedStays && T.bookedStays[base] ? 'disabled' : ''}>${chosen ? icon('check') + esc(t(o.booked ? 'booked' : 'chosen')) : esc(t('choose'))}</button><a class="btn ghost" href="${stayMaps(o, base)}" target="_blank" rel="noopener noreferrer">${icon('pin')}</a>${o.url && !o.booked ? `<a class="ext" href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openListing'))} ↗</a>` : ''}</div></div></article>`;
  const shotOf = u => u && /^https?:\/\//i.test(u) && !/google\.com/.test(u) ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(u)}?w=400` : null;
  const thumb = x => x.img ? `<span class="thumb"><img loading="lazy" src="${esc(x.img)}" alt=""></span>` : x.wiki ? `<span class="thumb"><img data-wiki="${esc(x.wiki)}" alt=""></span>` : `<span class="thumb glyph" style="--c:${x.color || 'var(--fixed)'}">${icon(x.kind || 'stay')}</span>`;
  const reservations = () => {
    const out = [];
    blocks().forEach(b => { const st = stayFor(b.base); out.push({ key: `stay:${b.base}:${b.start}`, b: st.n, s: `${b.label}${st.booked ? ` · ${t('booked')}` : ''}`, url: stayMaps(st, b.base), img: (st.img || [])[0] || null, kind: 'stay', booked: !!st.booked }); });
    const car = T.cars.find(c => c.id === S.car) || T.cars[0]; out.push({ key: 'car', b: car.n, s: t('car'), url: car.link, wiki: car.wiki, kind: 'drive' });
    T.days.forEach(d => rowsOf(d.id).forEach(r => { const p = byId[r.p]; if (p.book) out.push({ key: `p:${d.id}:${p.id}`, b: tx(p), s: `${dayLabel(d)} · ${L2(T.slots[slotIndex(r.s)])} · ${t(p.book)}`, url: p.url || mapsUrl(p), wiki: p.wiki, img: p.wiki ? null : shotOf(p.url), kind: p.cat, color: catColor(p.cat) }); }));
    return out;
  };
  const summary = () => { const lines = [`Tunisia · ${t('dates')} · ${t('travelers')}`, `${t('flights')}: ${L2(T.flight.out)}`, `${t('flights')}: ${L2(T.flight.back)}`, `${t('route')}: ${blocks().map(b => `${baseLabel(b.base)} ${b.nights}`).join(' · ')}`, ...blocks().map(b => `${b.label}: ${stayFor(b.base).n}`), `${t('car')}: ${(T.cars.find(c => c.id === S.car) || T.cars[0]).n}`, '']; T.days.forEach(d => { lines.push(`${dayLabel(d)} · ${dayTitle(d)}`); [...fixedRows(d).map((f, i) => ({ s: f.slot, k: i - 100, txt: `${f.time || '--:--'} ${L2(f)}` })), ...rowsOf(d.id).map((r, i) => ({ s: r.s, k: i, txt: `${L2(T.slots[slotIndex(r.s)])} · ${tx(byId[r.p])}` }))].sort((a, b) => slotIndex(a.s) - slotIndex(b.s) || a.k - b.k).forEach(x => lines.push('  ' + x.txt)); }); return lines.join('\n'); };
  const copy = async (text, ok) => { try { await navigator.clipboard.writeText(text); toast(ok); } catch (e) { prompt(ok, text); } };

  const renderBook = () => {
    const host = $('#bookPanel'); const car = T.cars.find(c => c.id === S.car) || T.cars[0]; const res = reservations(); const bl = blocks();
    res.forEach(x => { if (x.booked && S.checks[x.key] === undefined) { S.checks[x.key] = true; } });
    host.innerHTML = `<header class="bookHead"><h1>${esc(t('bookTitle'))}</h1><p>${esc(t('bookLead'))}</p></header>
    <section class="section" id="routeSection"><h2>${esc(t('route'))}</h2><p class="lead">${esc(t('routeLead'))}</p><div class="nights">${S.route.map((b, i) => `<button type="button" class="nightCell" data-night="${i}"><small>${esc(dayLabel(dayById[T.nights[i]]))}</small><b>${esc(baseLabel(b))}</b>${T.bookedStays && T.bookedStays[b] && S.stays[b] === T.bookedStays[b] ? `<em>${esc(t('booked'))}</em>` : ''}</button>`).join('')}</div><div class="eyebrow">${esc(t('presets'))}</div><div class="presets">${T.routePresets.map((p, i) => `<button type="button" class="chip" aria-selected="${p.route.join() === S.route.join()}" data-preset="${i}">${esc(L2(p))}</button>`).join('')}</div></section>
    <section class="section" id="staysSection"><h2>${esc(t('stays'))}</h2><p class="lead">${esc(t('staysLead'))}</p>${bl.map(b => { const st = stayFor(b.base); const pool = poolOf(b.base); const closed = S.closed[b.base]; return `<div class="panel stayPanel" data-block="${b.base}"><div class="eyebrow">${esc(b.label)}</div><article class="stayCard hero">${photo(st, true)}<div class="stayBody"><h3>${esc(st.n)}${st.booked ? ` <span class="badge">${esc(t('booked'))}</span>` : ''}${st.suggested ? ` <span class="badge">${esc(t('suggested'))}</span>` : ''}</h3><small>${esc([st.type, st.guests, st.rating].filter(Boolean).join(' · '))}</small>${st.exp != null ? `<div class="scores"><div>${esc(t('experience'))}<b>${st.exp}</b></div><div>${esc(t('privacy'))}<b>${st.priv}</b></div><div>${esc(t('value'))}<b>${esc(st.tier || st.val)}</b></div></div>` : ''}${st.note ? `<p class="note">${esc(st.note)}</p>` : ''}<div class="actions"><a class="btn" href="${stayMaps(st, b.base)}" target="_blank" rel="noopener noreferrer">${icon('pin')}${esc(t('directions'))}</a>${st.url && !st.booked ? `<a class="btn ghost" href="${esc(st.url)}" target="_blank" rel="noopener noreferrer">${esc(t('openListing'))}${icon('link')}</a>` : ''}<button type="button" class="btn ghost" data-toggle="${b.base}">${esc(closed ? t('showOptions') : t('hide'))} · ${pool.length}</button></div></div></article>${closed ? '' : `${stayFilters(b.base)}<div class="stayRail">${filteredPool(b.base).map(o => stayCard(o, b.base, o.id === st.id)).join('') || `<p class="note">${esc(t('noMatch'))}</p>`}</div><form class="suggest" data-suggest="${b.base}"><input name="n" placeholder="${esc(t('suggestName'))}" required maxlength="120"><input name="u" type="url" placeholder="${esc(t('suggestUrl'))}"><button type="submit" class="btn ghost">${icon('plus')}${esc(t('addSuggestion'))}</button></form>`}</div>`; }).join('')}</section>
    <section class="section" id="carSection"><h2>${esc(t('car'))}</h2><p class="lead">${esc(t('carLead'))}</p><div class="panel"><article class="stayCard hero">${car.wiki ? `<div class="photo big" hidden><img data-wiki="${esc(car.wiki)}" alt="${esc(car.n)}"></div>` : ''}<div class="stayBody"><h3>${esc(car.n)}</h3><p class="note">${esc(car.type)} · ${esc(car.avail)}</p><div class="scores"><div>${esc(t('luxury'))}<b>${car.lux}</b></div><div>${esc(t('comfort'))}<b>${car.comfort}</b></div><div>${esc(t('value'))}<b>${car.val}</b></div></div><p class="note">${esc(car.note)} ${esc(car.price)}.</p><div class="actions"><a class="btn" href="${esc(car.link)}" target="_blank" rel="noopener noreferrer">${esc(t('checkRentals'))}${icon('link')}</a><button type="button" class="btn ghost" data-toggle="car">${esc(S.carOpen ? t('hide') : t('showOptions'))} · ${T.cars.length}</button></div></div></article>${S.carOpen ? `<ul class="optList">${T.cars.map(c => `<li>${thumb({ wiki: c.wiki, kind: 'drive' })}<span><b>${esc(c.n)}</b><small>${esc(c.type)} · ${esc(c.tag)} · ${t('luxury')} ${c.lux} · ${t('comfort')} ${c.comfort} · ${t('value')} ${c.val}</small></span><button type="button" class="btn${c.id === car.id ? ' on' : ' ghost'}" data-car="${c.id}">${c.id === car.id ? icon('check') + esc(t('chosen')) : esc(t('choose'))}</button></li>`).join('')}</ul>` : ''}</div></section>
    <section class="section" id="resSection"><h2>${esc(t('reservations'))}</h2><p class="lead">${esc(t('reservationsLead'))}</p>${res.length ? `<ul class="checks">${res.map(x => `<li class="${S.checks[x.key] ? 'done' : ''}"><input type="checkbox" data-check="${esc(x.key)}" ${S.checks[x.key] ? 'checked' : ''} aria-label="${esc(x.b)}">${thumb(x)}<span><b>${esc(x.b)}</b><small>${esc(x.s)}</small></span>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.kind === 'stay' ? t('directions') : t('website'))} ↗</a>` : ''}</li>`).join('')}</ul>` : `<p class="note">${esc(t('nothingToBook'))}</p>`}</section>
    <section class="section"><h2>${esc(t('share'))}</h2><p class="lead">${esc(t('shareLead'))}</p><div class="share"><button type="button" class="btn" id="shareBtn">${icon('share')}${esc(t('share'))}</button><button type="button" class="btn ghost" id="copyBtn">${icon('copy')}${esc(t('copySummary'))}</button></div><pre class="brief" id="brief">${esc(summary())}</pre></section>
    <section class="section"><h2>${esc(t('goodToKnow'))}</h2><ul class="tips">${T.goodToKnow.map(g => { const s = L2(g); const i = s.indexOf(':'); return `<li>${i > 0 ? `<b>${esc(s.slice(0, i + 1))}</b>${esc(s.slice(i + 1))}` : esc(s)}</li>`; }).join('')}</ul></section>`;
    host.querySelectorAll('[data-night]').forEach(b => b.onclick = () => nightSheet(Number(b.dataset.night)));
    host.querySelectorAll('[data-preset]').forEach(b => b.onclick = () => { setRoute([...T.routePresets[Number(b.dataset.preset)].route]); render(); });
    host.querySelectorAll('[data-toggle]').forEach(b => b.onclick = () => { if (b.dataset.toggle === 'car') S.carOpen = !S.carOpen; else S.closed[b.dataset.toggle] = !S.closed[b.dataset.toggle]; render(); });
    host.querySelectorAll('[data-stay]').forEach(b => b.onclick = () => { S.stays[b.dataset.stay] = b.dataset.opt; save(); render(); });
    host.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { S.stayFilter[b.dataset.base] = b.dataset.filter; render(); });
    host.querySelectorAll('[data-private]').forEach(b => b.onclick = () => { S.stayPrivate[b.dataset.private] = !S.stayPrivate[b.dataset.private]; render(); });
    host.querySelectorAll('[data-car]').forEach(b => b.onclick = () => { S.car = b.dataset.car; save(); render(); });
    host.querySelectorAll('[data-check]').forEach(c => c.onchange = () => { S.checks[c.dataset.check] = c.checked; save(); render(); });
    host.querySelectorAll('[data-suggest]').forEach(f => f.onsubmit = e => { e.preventDefault(); const n = f.n.value.trim(); if (!n) return; const u = f.u.value.trim(); const ok = /^https?:\/\//i.test(u); const id = `sug-${Date.now().toString(36)}`; S.suggestions.push({ id, block: f.dataset.suggest, n, url: ok ? u : null, type: t('suggested'), suggested: true, img: ok ? [`https://s.wordpress.com/mshots/v1/${encodeURIComponent(u)}?w=1000`] : [] }); S.stays[f.dataset.suggest] = id; save(); render(); });
    host.querySelectorAll('.photo img:not([data-wiki])').forEach(img => { const fail = () => { const box = img.parentNode; img.remove(); if (box && !box.querySelector('img')) box.classList.add('none'); }; img.onerror = fail; if (img.complete && img.naturalWidth === 0 && img.src) setTimeout(() => { if (img.isConnected && img.complete && img.naturalWidth === 0) fail(); }, 0); });
    hydrate(host);
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
  if (loaded) toast(t('planLoaded')); else pullShared();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pullShared(); });
  window.TRIP_APP = { S, render, addToDay, removeFromDay, setView, setRoute, shareUrl, summary, dayAreas: id => dayAreas(dayById[id]), blocks, placeSheet, wikiInfo, pullShared, applyShared, mapsUrl };
})();
