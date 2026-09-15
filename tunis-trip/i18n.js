(()=>{
const KEY='tn-language-v1';
const dict={
'TUNISIA · 18–25 SEP':'تونس · 18–25 سبتمبر',
'Map':'الخريطة','Calendar':'الجدول','Configure':'الإعدادات',
'3 adults · Riyadh → Tunisia · 7 nights':'3 بالغين · الرياض ← تونس · 7 ليالٍ',
'Your Tunisia trip.':'رحلتكم إلى تونس.',
'Follow the map first, then the calendar. Use Configuration only to choose the flight, car, stays and activities you want.':'ابدؤوا بالخريطة، ثم راجعوا الجدول. استخدموا قسم الإعدادات فقط لاختيار الرحلة الجوية والسيارة والإقامات والأنشطة.',
'✈ Riyadh':'✈ الرياض','🚙 Tunisia road trip':'🚙 جولة برية في تونس','🏠 Tunis Medina':'🏠 مدينة تونس العتيقة','🌊 Hammamet':'🌊 الحمامات','🏡 Sidi Bou Said / Tunis':'🏡 سيدي بوسعيد / تونس',
'Routes':'المسارات','Pins':'النقاط',
'01 · Route map':'01 · خريطة المسار','Follow the trip geographically.':'تتبّعوا الرحلة جغرافيًا.',
'Choose Overall or a specific day above. Routes, activities and your selected stays update automatically when you change the plan.':'اختاروا الرحلة كاملة أو يومًا محددًا أعلاه. تتحدّث المسارات والأنشطة والإقامات المختارة تلقائيًا عند تعديل الخطة.',
'History':'تاريخ','Food':'طعام','Shopping':'تسوّق','Leisure':'ترفيه','Stay':'إقامة','Airport':'مطار','Transfer':'انتقال',
'02 · Activity calendar':'02 · جدول الأنشطة','What happens each day.':'ماذا سيحدث كل يوم.',
'This is the trip you are actually following. Tap any day to expand its activities, transfers and overnight stay.':'هذا هو البرنامج الفعلي للرحلة. اضغطوا على أي يوم لعرض الأنشطة والتنقلات ومكان المبيت.',
'03 · Configuration':'03 · الإعدادات','Choose the pieces of the trip.':'اختاروا تفاصيل الرحلة.',
'Your selections are saved on this device. Any stay or activity change immediately updates the map and calendar.':'يتم حفظ اختياراتكم على هذا الجهاز. أي تغيير في الإقامة أو الأنشطة يحدّث الخريطة والجدول مباشرة.',
'Configure flights':'اختيار الرحلات الجوية','Configure the road-trip car':'اختيار سيارة الرحلة البرية','Configure stays':'اختيار الإقامات','Configure activities':'اختيار الأنشطة',
'20 route/timing candidates for Riyadh → Tunis on Friday 18 September. The ranking favors a departure':'20 خيارًا للمسار والتوقيت من الرياض إلى تونس يوم الجمعة 18 سبتمبر. يفضّل الترتيب المغادرة',
'after Jumu’ah prayer':'بعد صلاة الجمعة',', then shorter journey time and better value.':'، ثم مدة سفر أقصر وقيمة أفضل.',
'Timing preference:':'تفضيل التوقيت:','we score departures from roughly 15:00 onward highest, leaving a practical buffer after Friday prayer and before airport check-in. Confirm your mosque’s actual Jumu’ah time before booking.':'نمنح أعلى تقييم للمغادرات من نحو الساعة 15:00 فصاعدًا، مع هامش عملي بعد صلاة الجمعة وقبل إجراءات المطار. تأكدوا من وقت صلاة الجمعة في مسجدكم قبل الحجز.',
'Flight prices shown are planning benchmarks or live-check prompts, not locked quotes. Mixed-carrier/self-connect options require extra care with baggage and missed-connection protection.':'أسعار الرحلات المعروضة مؤشرات للتخطيط أو للتحقق المباشر وليست أسعارًا نهائية. الخيارات ذات الربط الذاتي أو شركات الطيران المختلفة تحتاج تدقيقًا إضافيًا للأمتعة والحماية من فوات الربط.',
'The recommended order is':'الترتيب المقترح هو','Jetour first':'جيتور أولًا',', then a':'، ثم','Škoda SUV':'سيارة Škoda SUV','. The ranking below favors comfort for three adults, luggage space, long-road suitability and value.':'. يفضّل الترتيب أدناه الراحة لثلاثة بالغين ومساحة الأمتعة والملاءمة للطرق الطويلة والقيمة.',
'Top recommendation:':'الخيار الأول:','Second choice:':'الخيار الثاني:','Airport rental inventory often uses “or similar”, so get the exact model confirmed in writing if the vehicle itself matters to you.':'غالبًا ما تستخدم شركات التأجير عبارة «أو ما شابه»، لذلك اطلبوا تأكيد الطراز المحدد كتابةً إذا كان نوع السيارة مهمًا لكم.',
'For this itinerary, prioritize automatic transmission, unlimited mileage, full-to-full fuel, comprehensive insurance, a second driver if needed, and enough boot space for three adults’ luggage. Exact models and rates change by supplier.':'لهذا المسار، أعطوا الأولوية لناقل حركة أوتوماتيكي، كيلومترات غير محدودة، سياسة وقود ممتلئ-إلى-ممتلئ، تأمين شامل، سائق إضافي عند الحاجة، وصندوق أمتعة مناسب لثلاثة بالغين. الطرازات والأسعار تختلف حسب المورّد.',
'Each date block has':'كل فترة إقامة تتضمن','20 ranked stay options':'20 خيار إقامة مرتّبًا','. Best fit appears first. Every option shows Experience, Privacy and Price scores. Photos are now tied to the exact property/listing rather than reused city images.':'. يظهر الأنسب أولًا. يعرض كل خيار تقييم التجربة والخصوصية والسعر. الصور مرتبطة الآن بالعقار أو الإعلان المحدد بدل تكرار صور عامة للمدينة.',
'✨ Experience = how special/Tunisian the stay feels':'✨ التجربة = مدى تميّز وأصالة الإقامة التونسية','🔒 Privacy = exclusivity of the space':'🔒 الخصوصية = مدى استقلالية المكان','💰 Price = relative value; 10/10 is better value':'💰 السعر = القيمة النسبية؛ 10/10 تعني قيمة أفضل',
'Historical places are separate from leisure, dining and shopping. Add or remove anything and the calendar and map recalculate instantly.':'الأماكن التاريخية منفصلة عن الترفيه والمطاعم والتسوّق. أضيفوا أو احذفوا أي نشاط وستتحدّث الخريطة والجدول فورًا.',
'Recommended only':'المقترحة فقط','Showing all options':'عرض جميع الخيارات','Reset plan':'إعادة ضبط الخطة','🏛 Historical':'🏛 تاريخي','🎭 Leisure · dining · shopping':'🎭 ترفيه · مطاعم · تسوّق',
'Research notes & sources':'ملاحظات البحث والمصادر',
'Updated 12 Sep 2026. Availability, fares and rental inventory change quickly; verify exact dates, accessibility, baggage, vehicle model and cancellation terms before paying.':'آخر تحديث 12 سبتمبر 2026. التوفر والأسعار ومخزون التأجير تتغير بسرعة؛ تحققوا من التواريخ وإمكانية الوصول والأمتعة وطراز السيارة وشروط الإلغاء قبل الدفع.',
'Overall':'الرحلة كاملة','D1 · Fri 18':'اليوم 1 · الجمعة 18','D2 · Sat 19':'اليوم 2 · السبت 19','D3 · Sun 20':'اليوم 3 · الأحد 20','D4 · Mon 21':'اليوم 4 · الاثنين 21','D5 · Tue 22':'اليوم 5 · الثلاثاء 22','D6 · Wed 23':'اليوم 6 · الأربعاء 23','D7 · Thu 24':'اليوم 7 · الخميس 24','D8 · Fri 25':'اليوم 8 · الجمعة 25',
'Fri 18 · Arrive Tunis + settle into the dar':'الجمعة 18 · الوصول إلى تونس والاستقرار في الدار','Sat 19 · Tunis history + major local-clothing shopping':'السبت 19 · تاريخ تونس + تسوّق كبير للملابس المحلية','Sun 20 · Carthage + Sidi Bou Said → Hammamet':'الأحد 20 · قرطاج + سيدي بوسعيد ← الحمامات','Mon 21 · Hammamet Medina + beach + Nabeul':'الاثنين 21 · مدينة الحمامات + الشاطئ + نابل','Tue 22 · Kairouan + Sousse road day':'الثلاثاء 22 · القيروان + سوسة في يوم بري','Wed 23 · El Jem → Sidi Bou Said final base':'الأربعاء 23 · الجم ← سيدي بوسعيد للإقامة الأخيرة','Thu 24 · Bardo + final Tunis shopping + farewell dinner':'الخميس 24 · باردو + التسوّق الأخير في تونس + عشاء الوداع','Fri 25 · Airport + Riyadh':'الجمعة 25 · المطار + الرياض',
'YOUR CURRENT FLIGHT PICK':'اختياركم الحالي للرحلة','YOUR CURRENT CAR PICK':'اختياركم الحالي للسيارة','BEST OPTION':'أفضل خيار','SECOND CHOICE':'الخيار الثاني','DEPART':'المغادرة','ARRIVE':'الوصول','Price':'السعر','Length':'المدة','Timing':'التوقيت','Friday fit':'ملاءمة الجمعة','Road-trip fit':'ملاءمة الرحلة البرية','Comfort':'الراحة','Price/value':'السعر/القيمة','Experience':'التجربة','Privacy':'الخصوصية',
'Choose':'اختيار','✓ Chosen':'✓ تم الاختيار','✓ Included':'✓ مُدرج','+ Add':'+ إضافة','Check live ↗':'تحقق مباشر ↗','Check rentals ↗':'تحقق من التأجير ↗','Open listing ↗':'فتح الإعلان ↗','Open ↗':'فتح ↗','History behind it':'الخلفية التاريخية','Relates to:':'يرتبط بـ:',
'Entire home':'منزل كامل','Entire villa':'فيلا كاملة','Entire condo':'شقة كاملة','Entire apartment':'شقة كاملة','Entire townhouse':'تاون هاوس كامل','Boutique dar':'دار بوتيكي','Boutique hotel':'فندق بوتيكي','Historic hotel':'فندق تاريخي','Self-contained apartment':'شقة مستقلة','SUV · 5 seats':'SUV · 5 مقاعد','Compact SUV · 5 seats':'SUV مدمجة · 5 مقاعد','Crossover · 5 seats':'كروس أوفر · 5 مقاعد',
'Experience 1 · Tunis Medina':'التجربة 1 · مدينة تونس العتيقة','18–19 Sep · 2 nights':'18–19 سبتمبر · ليلتان','PRIVATE DAR EXPERIENCE':'تجربة دار خاصة','Experience 2 · Hammamet':'التجربة 2 · الحمامات','20–22 Sep · 3 nights':'20–22 سبتمبر · 3 ليالٍ','BEACH + DAR HYBRID':'شاطئ + دار','Finale · Sidi Bou Said / Tunis':'الختام · سيدي بوسعيد / تونس','23–24 Sep · 2 nights':'23–24 سبتمبر · ليلتان','SEA-VIEW TRADITIONAL HOME':'منزل تقليدي بإطلالة بحرية',
'Medina of Tunis orientation':'جولة تعريفية في مدينة تونس العتيقة','Zitouna Mosque quarter':'حي جامع الزيتونة','Historic dars + Tourbet El Bey':'الدور التاريخية + تربة الباي','Carthage · Byrsa Hill':'قرطاج · هضبة بيرصا','Antonine Baths':'حمامات أنطونيوس','Punic Ports':'الموانئ البونية','Ennejma Ezzahra Palace':'قصر النجمة الزهراء','Hammamet Kasbah + Medina':'قصبة الحمامات + المدينة العتيقة','Great Mosque of Kairouan · جامع عقبة':'جامع عقبة بن نافع · القيروان','Aghlabid Basins':'فسقيات الأغالبة','Kairouan Medina':'مدينة القيروان العتيقة','Ribat of Sousse + Medina':'رباط سوسة + المدينة العتيقة','El Jem Amphitheatre':'مسرح الجم','Bardo National Museum':'المتحف الوطني بباردو',
'Medina rooftop tea':'شاي على سطح في المدينة العتيقة','Mother’s Medina clothing spree':'جولة تسوّق الوالدة للملابس في المدينة العتيقة','Traditional dar lunch':'غداء تونسي في دار تقليدية','La Goulette seafood lunch':'غداء مأكولات بحرية في حلق الوادي','Sidi Bou Said · tea + sunset':'سيدي بوسعيد · شاي + غروب الشمس','Sidi Bou Said gallery browsing':'جولة في معارض سيدي بوسعيد','Hammamet beach time':'وقت على شاطئ الحمامات','Nabeul local market + clothing + crafts':'سوق نابل المحلي + ملابس + حرف','Nabeul ceramics workshop / pottery stop':'ورشة خزف / فخار في نابل','Private hammam / spa':'حمّام / سبا خاص','Private dinner at the beach house':'عشاء خاص في منزل الشاطئ','Kairouan carpets + makroudh':'سجاد القيروان + المقروض','Sousse Medina dinner':'عشاء في مدينة سوسة العتيقة','El Jem lunch + coffee':'غداء + قهوة في الجم','Final Tunis clothing / textile sweep':'جولة أخيرة لملابس ومنسوجات تونس','Private Tunisian cooking class':'درس طبخ تونسي خاص','Farewell Tunisian dinner':'عشاء وداع تونسي',
'Tunis–Carthage Airport':'مطار تونس قرطاج','Drive Sidi Bou Said → Hammamet':'القيادة من سيدي بوسعيد إلى الحمامات','Hammamet → Kairouan':'الحمامات ← القيروان','Kairouan → Sousse':'القيروان ← سوسة','Sousse → Hammamet':'سوسة ← الحمامات','Hammamet → El Jem':'الحمامات ← الجم','El Jem → Sidi Bou Said / Tunis':'الجم ← سيدي بوسعيد / تونس','Night':'ليلًا','Flight':'الرحلة'
};
const regexRules=[
 [/^(\d+) planned stops(?: · (.+))?$/,(m,n,stay)=>`${n} محطات مخطط لها${stay?` · ${stay}`:''}`],
 [/^Selected overnight:\s*(.+)$/,(m,s)=>`الإقامة المختارة: ${s}`],
 [/^Overnight:\s*(.+)$/,(m,s)=>`المبيت: ${s}`],
 [/^Day (\d+)$/,(m,n)=>`اليوم ${n}`],
 [/^Fri (\d+)$/,(m,n)=>`الجمعة ${n}`],[/^Sat (\d+)$/,(m,n)=>`السبت ${n}`],[/^Sun (\d+)$/,(m,n)=>`الأحد ${n}`],[/^Mon (\d+)$/,(m,n)=>`الاثنين ${n}`],[/^Tue (\d+)$/,(m,n)=>`الثلاثاء ${n}`],[/^Wed (\d+)$/,(m,n)=>`الأربعاء ${n}`],[/^Thu (\d+)$/,(m,n)=>`الخميس ${n}`]
];
let lang=localStorage.getItem(KEY)==='ar'?'ar':'en';
let applying=false;
function translateCore(core){
 if(dict[core])return dict[core];
 for(const [re,fn] of regexRules){if(re.test(core))return core.replace(re,fn)}
 return core;
}
function applyText(root=document.body){
 if(applying||!root)return; applying=true;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(p.tagName))return NodeFilter.FILTER_REJECT;return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(node=>{
   if(node.__tnOriginal===undefined)node.__tnOriginal=node.nodeValue;
   if(lang==='en'){node.nodeValue=node.__tnOriginal;return;}
   const original=node.__tnOriginal;const core=original.trim();const translated=translateCore(core);if(translated===core)return;
   const lead=original.match(/^\s*/)?.[0]||'';const trail=original.match(/\s*$/)?.[0]||'';node.nodeValue=lead+translated+trail;
 });
 applying=false;
}
function syncButtons(){
 document.querySelectorAll('[data-language-toggle]').forEach(b=>{b.textContent=lang==='ar'?'EN':'العربية';b.setAttribute('aria-label',lang==='ar'?'Switch to English':'التبديل إلى العربية');b.setAttribute('title',lang==='ar'?'Switch to English':'التبديل إلى العربية');});
}
function applyLanguage(next,save=true){lang=next==='ar'?'ar':'en';if(save)localStorage.setItem(KEY,lang);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.body.classList.toggle('lang-ar',lang==='ar');applyText(document.body);syncButtons();document.dispatchEvent(new CustomEvent('trip-language-change',{detail:{lang}}));}
function bind(){document.querySelectorAll('[data-language-toggle]').forEach(b=>b.addEventListener('click',()=>applyLanguage(lang==='ar'?'en':'ar')));}
bind();applyLanguage(lang,false);
const observer=new MutationObserver(ms=>{if(applying)return;let changed=false;for(const m of ms){if(m.type==='childList'&&m.addedNodes.length){changed=true;break;}if(m.type==='characterData'){changed=true;break;}}if(changed)requestAnimationFrame(()=>{applyText(document.body);syncButtons();});});
observer.observe(document.body,{childList:true,subtree:true,characterData:true});
window.tripLanguage={get:()=>lang,set:applyLanguage};
})();