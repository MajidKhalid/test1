(()=>{
const AR={
'TUNISIA · 18–25 SEP':'تونس · 18–25 سبتمبر',
'3 adults · Fri 18 Sep → Fri 25 Sep · booking immediately':'3 بالغين · الجمعة 18 سبتمبر ← الجمعة 25 سبتمبر · الحجز فورًا',
'Sousse & Kairouan next.':'ثم سوسة والقيروان.',
'Two nights in Tunis, two nights covering Sousse and Kairouan, two beach nights in Hammamet, then one final night near Sidi Bou Said or Tunis before the return flight.':'ليلتان في تونس، ثم ليلتان لتغطية سوسة والقيروان، ثم ليلتان على شاطئ الحمامات، وليلة أخيرة قرب سيدي بوسعيد أو تونس قبل رحلة العودة.',
'Research refreshed 17 Sep 2026.':'تحديث البحث: 17 سبتمبر 2026.',
'Flight patterns, central-Tunisia stays and premium SUVs were rechecked. WhatsApp suggestions still require a connected browser tool or manual paste into the importer.':'تمت إعادة التحقق من مسارات الطيران وإقامات وسط تونس وسيارات SUV الفاخرة. اقتراحات واتساب تحتاج إلى ربط أداة المتصفح أو لصقها يدويًا في أداة الاستيراد.',
'Every activity timeslot pulls one choice from three alternatives in Configuration.':'لكل فترة نشاط خيار واحد من ثلاثة بدائل في قسم الإعدادات.',
'Lock the flight, first Tunis stay and full-trip SUV first. Then reserve the two central-Tunisia nights, Hammamet beach stay and final Tunis/Sidi night.':'ثبّتوا الرحلة وإقامة تونس الأولى وسيارة الرحلة كاملة أولًا، ثم احجزوا ليلتي وسط تونس وإقامة الحمامات الشاطئية والليلة الأخيرة في تونس/سيدي بوسعيد.',
'Best timing match:':'أفضل تطابق للتوقيت:',
'RUH 16:05 → IST 19:55, then IST 21:50 → TUN 22:45. Use it only when the full Flynas/Turkish itinerary is issued on one protected ticket/PNR with baggage through-checked.':'الرياض 16:05 ← إسطنبول 19:55، ثم إسطنبول 21:50 ← تونس 22:45. استخدموا هذا الخيار فقط إذا صدر المسار كاملًا على تذكرة واحدة محمية ورقم حجز واحد مع نقل الأمتعة حتى تونس.',
'Overall recommendation:':'الخيار العام المقترح:',
'BMW X5 if the exact model is available. Range Rover Sport is the prestige upgrade. Toyota Land Cruiser Prado 2025 is the strongest currently surfaced full-size local option for a next-day booking.':'BMW X5 إذا توفر الطراز المحدد. Range Rover Sport هو خيار الفخامة الأعلى. Toyota Land Cruiser Prado 2025 هو أقوى خيار محلي كبير ظهر حاليًا للحجز العاجل.',
'Paste the newest stay names and links from the group. They remain labeled as group-sourced options and are added to the correct stay block without replacing the researched shortlist.':'الصقوا أحدث أسماء وروابط الإقامات من المجموعة. ستبقى مميزة كمقترحات من المجموعة وتُضاف إلى فترة الإقامة المناسبة دون استبدال القائمة المدروسة.',
'Primary trip · depart Fri 18 Sep, return Fri 25 Sep':'الرحلة الأساسية · المغادرة الجمعة 18 سبتمبر والعودة الجمعة 25 سبتمبر',
'One-day fallback · depart Sat 19 Sep, return Sat 26 Sep':'خيار احتياطي بيوم واحد · المغادرة السبت 19 سبتمبر والعودة السبت 26 سبتمبر',
'Lock the flight, first Tunis stay and luxury SUV before anything else.':'ثبّتوا الرحلة وإقامة تونس الأولى وسيارة SUV الفاخرة قبل أي شيء آخر.',
'The primary dates are Fri 18 Sep to Fri 25 Sep. Use the one-day fallback only if the exact flight or stay inventory is no longer bookable.':'التواريخ الأساسية من الجمعة 18 سبتمبر إلى الجمعة 25 سبتمبر. استخدموا خيار التأخير بيوم فقط إذا لم يعد حجز الرحلة أو الإقامة المطلوبة متاحًا.',
'Confirm the primary dates: Fri 18 Sep to Fri 25 Sep':'تأكيد التواريخ الأساسية: الجمعة 18 سبتمبر إلى الجمعة 25 سبتمبر',
'Book the 16:05 Istanbul pattern only if the full journey is one protected PNR':'احجزوا مسار إسطنبول الساعة 16:05 فقط إذا كان كامل المسار تحت رقم حجز واحد محمي',
'If the Istanbul through-fare is unavailable, compare the protected Turkish, Doha and Amman fallbacks':'إذا لم يتوفر سعر موحد عبر إسطنبول، قارنوا البدائل المحمية عبر التركية والدوحة وعمّان',
'Reserve two nights in Sousse / Kairouan — preferably one night in each if packing is acceptable':'احجزوا ليلتين في سوسة / القيروان — ويفضل ليلة في كل مدينة إذا كان تغيير الإقامة مناسبًا',
'Import or paste the latest WhatsApp group stay suggestions and verify each one':'استوردوا أو الصقوا أحدث اقتراحات الإقامة من مجموعة واتساب وتحققوا من كل خيار',
'The open WhatsApp browser tab is not connected to this planner yet.':'تبويب واتساب المفتوح في المتصفح غير متصل بهذه الخطة حتى الآن.',
'Paste the newest group messages or listing links here now. After connecting a browser connector in ChatGPT, the same shortlist can be populated from the open group without retyping.':'الصقوا أحدث رسائل المجموعة أو روابط الإقامات هنا الآن. بعد ربط أداة المتصفح في ChatGPT يمكن تعبئة القائمة من المجموعة المفتوحة دون إعادة الكتابة.',
'Tunis · first two nights':'تونس · أول ليلتين','Nights 1–2 · 18–19 Sep':'الليلتان 1–2 · 18–19 سبتمبر',
'Sousse / Kairouan · two nights':'سوسة / القيروان · ليلتان','Nights 3–4 · 20–21 Sep':'الليلتان 3–4 · 20–21 سبتمبر',
'Hammamet · two beach nights':'الحمامات · ليلتان على الشاطئ','Nights 5–6 · 22–23 Sep':'الليلتان 5–6 · 22–23 سبتمبر',
'Sidi Bou Said / Tunis · final night':'سيدي بوسعيد / تونس · الليلة الأخيرة','Night 7 · 24 Sep':'الليلة 7 · 24 سبتمبر',
'Fri 18 Sep':'الجمعة 18 سبتمبر','Sat 19 Sep':'السبت 19 سبتمبر','Sun 20 Sep':'الأحد 20 سبتمبر','Mon 21 Sep':'الاثنين 21 سبتمبر','Tue 22 Sep':'الثلاثاء 22 سبتمبر','Wed 23 Sep':'الأربعاء 23 سبتمبر','Thu 24 Sep':'الخميس 24 سبتمبر','Fri 25 Sep':'الجمعة 25 سبتمبر',
'Fly Riyadh → Tunis + late check-in':'الطيران من الرياض إلى تونس + وصول متأخر',
'Tunis history, food and local shopping':'تاريخ تونس والطعام والتسوق المحلي',
'Tunis → Kairouan → Sousse':'تونس ← القيروان ← سوسة',
'Second central-Tunisia day: Sousse / Kairouan / Monastir':'اليوم الثاني في وسط تونس: سوسة / القيروان / المنستير',
'El Jem or Mahdia → Hammamet beach base':'الجم أو المهدية ← قاعدة الحمامات الشاطئية',
'Hammamet, Nabeul and beach time':'الحمامات ونابل ووقت الشاطئ',
'Return north + Sidi Bou Said / Tunis':'العودة شمالًا + سيدي بوسعيد / تونس',
'Airport + Riyadh':'المطار + الرياض',
'Research refreshed 17 Sep 2026. Verify exact dates, live inventory, entry requirements, baggage, connection protection, accessibility and cancellation terms before paying.':'تحديث البحث 17 سبتمبر 2026. تحققوا من التواريخ والمخزون المباشر ومتطلبات الدخول والأمتعة وحماية الربط وسهولة الوصول وشروط الإلغاء قبل الدفع.'
};
const originals=new WeakMap();
function apply(){const ar=document.documentElement.lang==='ar';const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){const raw=n.nodeValue,trim=raw.trim();if(!trim)continue;if(ar&&AR[trim]){if(!originals.has(n))originals.set(n,raw);n.nodeValue=raw.replace(trim,AR[trim]);}else if(!ar&&originals.has(n)){n.nodeValue=originals.get(n);originals.delete(n);}}
}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['lang','dir']});
setTimeout(apply,0);
})();