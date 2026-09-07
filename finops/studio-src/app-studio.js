/* ---------- studio: routing, bindings, zones, checklist, generate (appended to app.js inside the same closure) ---------- */
var SLOTS={gcp:[{k:'m',part:'service',en:'Month · all GCP by service',req:true},{k:'m',part:'project',en:'Month · all GCP by project',req:true},{k:'m',part:'sandbox',en:'Month · sandbox by service',req:true},{k:'q',part:'service',en:'Quarter · all GCP by service',req:false,q:true},{k:'q',part:'project',en:'Quarter · all GCP by project',req:false,q:true},{k:'q',part:'sandbox',en:'Quarter · sandbox by service',req:false,q:true},{k:'t',part:'service',en:'To date · all GCP by service',req:true},{k:'t',part:'project',en:'To date · all GCP by project',req:false},{k:'t',part:'sandbox',en:'To date · sandbox by service',req:false}],
 azure:[{k:'m',part:'service',en:'Month · by service',req:true},{k:'m',part:'sub',en:'Month · by subscription',req:true},{k:'m',part:'region',en:'Month · by resource location',req:false},{k:'q',part:'service',en:'Quarter · by service',req:false,q:true},{k:'q',part:'sub',en:'Quarter · by subscription',req:false,q:true},{k:'t',part:'service',en:'To date · by service',req:true},{k:'t',part:'sub',en:'To date · by subscription',req:false}]};
var TOKENS=['month','prevMonth','gcp.net','gcp.gross','gcp.discounts','gcp.change','gcp.sandbox','gcp.top.name','gcp.top.share','gcp.td.net','gcp.credit.remaining','gcp.credit.pct','azure.net','azure.change','azure.top.name','azure.top.share','azure.credit.remaining'];
function slotKey(k){var E=S.edition;return k==='m'?E.month:k==='q'?quarterKey(E.month):'td';}
function slotLabel(c,part,k){var s=SLOTS[c].filter(function(x){return x.part===part&&x.k===k;})[0];return s?s.en:(c+' · '+part);}
function cloudName(c){return c==='gcp'?'Google Cloud':'Microsoft Azure';}
function newPeriod(c,k,key){var C=S.clouds[c];return {key:key,kind:k==='m'?'month':k==='q'?'quarter':'todate',label:k==='m'?monthLabel(key):k==='q'?quarterLabel(key):(C.tdLabelEn||'Contract to date'),labelAr:k==='m'?monthLabel(key,true):k==='q'?quarterLabel(key,true):(C.tdLabelAr||'منذ بداية العقد'),services:[],files:{},raw:{},sample:false,source:'upload'};}
function ensurePeriod(c,k,key){var P=S.clouds[c].periods,p=P[key];if(!p||p.source!=='upload')p=P[key]=newPeriod(c,k,key);if(!p.raw)p.raw={};if(!p.files)p.files={};return p;}

/* ---------- classification of a dropped file: header decides the cloud and the part, the file name the period ---------- */
function monthsBetween(a,b){var x=ym(a),y=ym(b);return (y[0]-x[0])*12+(y[1]-x[1])+1;}
function nextMonth(iso){var p=ym(iso),y=p[0],m=p[1]+1;if(m>12){m=1;y++;}return y+'-'+(m<10?'0':'')+m;}
function classify(name,rows){var E=S.edition,head=Object.keys(rows[0]||{}),has=function(n){return head.indexOf(n)>=0;},lower=name.toLowerCase(),cloud=null,part=null;
 if(has('Subtotal ($)')&&has('Project ID')){cloud='gcp';part='project';}
 else if(has('Subtotal ($)')&&has('Service description')){cloud='gcp';part='service';}
 else{var hs=head.map(function(h){return h.toLowerCase().replace(/[^a-z]/g,'');}),hasN=function(c){return hs.some(function(h){return c.indexOf(h)>=0;});};
  if(hasN(['costusd','cost','pretaxcost','costinbillingcurrency','actualcost','costinusd'])){cloud='azure';part=hasN(['subscriptionname','subscription','subscriptionid'])?'sub':hasN(['resourcelocation','location'])?'region':hasN(['servicename','metercategory','service','servicefamily'])?'service':null;}}
 if(!cloud||!part)return null;
 if(cloud==='gcp'&&part==='service'){var gross=rows.reduce(function(a,r){return a+fnum(r['List cost ($)']);},0);if(/sandbox|spark|iw-sb|sb-dev|_sb[._-]/.test(lower)||(rows.length<=14&&gross<25000))part='sandbox';}
 var dates=name.match(/\d{4}-\d{2}-\d{2}/g)||[],k='m',key=E.month,detected=null;
 if(dates.length>=2){var a=dates[0],b=dates[dates.length-1],am=a.slice(0,7),bm=b.slice(0,7),n=monthsBetween(am,bm);detected=a+' to '+b;
  if(n<=1){k='m';key=am;}else if(n===3&&(ym(am)[1]-1)%3===0){k='q';key=quarterKey(am);}else if(n===6&&(ym(am)[1]===1||ym(am)[1]===7)){k='q';key=ym(am)[0]+'-h'+(ym(am)[1]===1?'1':'2');}else{k='t';key='td';}}
 else{var one=name.match(/(\d{4})-(\d{2})(?!-?\d)/);if(/to-?date|todate|contract/.test(lower)){k='t';key='td';}else if(/\bq[1-4]\b|quarter/.test(lower)){k='q';key=quarterKey(E.month);}else if(one){k='m';key=one[1]+'-'+one[2];}}
 var warn=null;if(k==='m'&&key!==E.month)warn='covers '+monthLabel(key)+' but the edition is '+monthLabel(E.month);
 return {cloud:cloud,part:part,k:k,key:key,warn:warn,detected:detected};}
function normalizeRows(cloud,part,rows){if(cloud==='gcp')return part==='project'?gcpProjects(rows,FX()):gcpServices(rows,FX());var parsed=azureRows(rows,FX(),S.edition.azureCurrency);return parsed.rows.map(function(r){return {name:r.name,id:r.id||'',net:r.net,gross:r.net,chg:'n/a'};});}
function place(cloud,part,k,key,fileName,data){var p=ensurePeriod(cloud,k,key);
 if(cloud==='gcp'){if(part==='project')p.projectsRaw=data;else if(part==='service')p.services=data;else p.sandboxServices=data;}
 else{if(part==='service')p.services=data;else if(part==='sub')p.subsRaw=data;else p.regions=data;}
 p.raw[part]=data;p.files[part]=fileName;p.sample=Object.keys(p.files).some(function(x){return /^sample_/i.test(p.files[x]);});
 if(k==='t'){p.label=S.clouds[cloud].tdLabelEn||p.label;p.labelAr=S.clouds[cloud].tdLabelAr||p.labelAr;}
 if(cloud==='gcp')recomputeGcp(p);else recomputeAzure(p);return p;}
function unplace(cloud,key,part){var P=S.clouds[cloud].periods,p=P[key];if(!p)return;
 if(cloud==='gcp'){if(part==='project')delete p.projectsRaw;else if(part==='service')p.services=[];else p.sandboxServices=[];}
 else{if(part==='service')p.services=[];else if(part==='sub')delete p.subsRaw;else delete p.regions;}
 if(p.raw)delete p.raw[part];delete p.files[part];
 if(!Object.keys(p.files).length){delete P[key];return;}
 p.sample=Object.keys(p.files).some(function(x){return /^sample_/i.test(p.files[x]);});if(cloud==='gcp')recomputeGcp(p);else recomputeAzure(p);}
function ingestOne(file,forced){return file.text().then(function(text){var rows=parseCSV(text);if(!rows.length)throw new Error('the file has no data rows');
  var route=forced?{cloud:forced.cloud,part:forced.part,k:forced.k,key:slotKey(forced.k),warn:null}:classify(file.name,rows);
  if(!route)throw new Error('not a GCP Reports CSV (needs Service description or Project ID plus Subtotal ($)) and not an Azure Cost analysis CSV (needs a name column plus Cost or CostUSD)');
  if(route.cloud==='gcp'){if(route.part==='project'&&!('Project ID' in rows[0]))throw new Error('this is not a by-project Reports CSV');if(route.part!=='project'&&!('Service description' in rows[0]))throw new Error('this is not a by-service Reports CSV');}
  var data=normalizeRows(route.cloud,route.part,rows);if(!data.length)throw new Error('no usable rows after parsing');
  place(route.cloud,route.part,route.k,route.key,file.name,data);
  if(route.cloud==='azure'&&!S.clouds.azure.enabled){S.clouds.azure.enabled=true;syncInputs();}
  return {file:file.name,route:route};}).then(function(r){return r;},function(e){return {file:file.name,error:e.message};});}
function ingestFiles(files,forced){var list=Array.prototype.slice.call(files);Promise.all(list.map(function(f){return ingestOne(f,forced);})).then(function(results){var ok=results.filter(function(r){return r.route;}),bad=results.filter(function(r){return r.error;});
  bad.forEach(function(r){toast('Could not read '+r.file+': '+r.error,'err');});
  ok.filter(function(r){return r.route.warn;}).forEach(function(r){toast(r.file+' '+r.route.warn+'. It is filed under '+monthLabel(r.route.key)+'; re-route it below if that is not intended.','warn');});
  if(ok.length===1){var r=ok[0];toast('Loaded '+r.file+' as '+cloudName(r.route.cloud)+' · '+slotLabel(r.route.cloud,r.route.part,r.route.k),'ok');}
  else if(ok.length>1){var g=ok.filter(function(r){return r.route.cloud==='gcp';}).length,a=ok.length-g;toast('Loaded '+ok.length+' files: '+g+' Google Cloud, '+a+' Azure. Check the routing list below.','ok');}
  if(ok.length){var pick=ok.filter(function(r){return r.route.cloud==='gcp'&&r.route.k==='m';})[0]||ok.filter(function(r){return r.route.k==='m';})[0]||ok[0];focus={cloud:pick.route.cloud,k:pick.route.k,key:pick.route.key};onChange('full');}});}
function routeOptions(c,part,cur){var parts=c==='gcp'?(part==='project'?['project']:['service','sandbox']):['service','sub','region'],E=S.edition,out=[],seen={};
 parts.forEach(function(pt){[['m',E.month],['q',quarterKey(E.month)],['t','td']].forEach(function(kk){var v=c+'|'+pt+'|'+kk[0]+'|'+kk[1];seen[v]=1;out.push({v:v,label:slotLabel(c,pt,kk[0])+' · '+(kk[0]==='m'?monthLabel(kk[1]):kk[0]==='q'?quarterLabel(kk[1]):'contract to date')});});});
 if(cur&&!seen[cur]){var bits=cur.split('|');out.unshift({v:cur,label:slotLabel(bits[0],bits[1],bits[2])+' · '+(bits[2]==='m'?monthLabel(bits[3]):bits[2]==='q'?quarterLabel(bits[3]):'contract to date')});}
 return out;}
function routedChips(){var host=$('#routed'),out=[];['gcp','azure'].forEach(function(c){var P=S.clouds[c].periods;Object.keys(P).forEach(function(key){var p=P[key];if(!p||p.source!=='upload')return;Object.keys(p.files||{}).forEach(function(part){out.push({c:c,key:key,part:part,name:p.files[part],p:p});});});});
 if(!out.length){host.innerHTML='<p class="hint">No files loaded for this edition yet. The report below shows the previous edition until they are.</p>';return;}
 host.innerHTML=out.map(function(o,i){var k=kindKey(o.p),cur=o.c+'|'+o.part+'|'+k+'|'+o.key,warn=(k==='m'&&o.key!==S.edition.month)?'covers '+monthLabel(o.key)+', the edition is '+monthLabel(S.edition.month):'';
  return '<div class="rchip'+(o.p.sample?' sample':'')+(warn?' warn':'')+'"><span class="fn" title="'+esc(o.name)+'">'+esc(o.name)+'</span><span class="arrow" aria-hidden="true">&#8594;</span><select data-route="'+i+'" aria-label="Where this file goes">'+routeOptions(o.c,o.part,cur).map(function(r){return '<option value="'+esc(r.v)+'"'+(r.v===cur?' selected':'')+'>'+esc(cloudName(o.c)+' · '+r.label)+'</option>';}).join('')+'<option value="remove">Remove this file</option></select>'+(warn?'<span class="flag">'+esc(warn)+'</span>':'')+(o.p.sample?'<span class="flag">Sample file: invented figures, replace before publishing</span>':'')+'</div>';}).join('');
 $$('select[data-route]',host).forEach(function(sel){sel.addEventListener('change',function(){var o=out[+sel.dataset.route];reroute(o,sel.value);});});}
function reroute(o,value){if(value==='remove'){unplace(o.c,o.key,o.part);toast('Removed '+o.name,'ok');onChange('full');return;}
 var bits=value.split('|'),tc=bits[0],tp=bits[1],tk=bits[2],tkey=bits[3];if(tc===o.c&&tp===o.part&&tkey===o.key)return;
 var data=(o.p.raw&&o.p.raw[o.part])||[];unplace(o.c,o.key,o.part);place(tc,tp,tk,tkey,o.name,data);focus={cloud:tc,k:tk,key:tkey};toast('Moved '+o.name+' to '+cloudName(tc)+' · '+slotLabel(tc,tp,tk),'ok');onChange('full');}

/* ---------- slot zones (forced routing) ---------- */
function buildZones(){['gcp','azure'].forEach(function(c){var host=$('#zones-'+c);host.innerHTML='';SLOTS[c].forEach(function(sl,i){var z=document.createElement('div');z.className='zone';z.dataset.cloud=c;z.dataset.i=i;z.innerHTML='<b>'+esc(sl.en)+'</b><span></span><input type="file" accept=".csv,text/csv" aria-label="'+esc(sl.en)+'">';var inp=$('input',z);inp.addEventListener('change',function(){if(inp.files[0])ingestFiles([inp.files[0]],{cloud:c,part:sl.part,k:sl.k});inp.value='';});z.addEventListener('dragover',function(e){e.preventDefault();e.stopPropagation();});z.addEventListener('drop',function(e){e.preventDefault();e.stopPropagation();if(e.dataTransfer.files[0])ingestFiles([e.dataTransfer.files[0]],{cloud:c,part:sl.part,k:sl.k});});host.appendChild(z);});});}
function refreshZones(){['gcp','azure'].forEach(function(c){$$('#zones-'+c+' .zone').forEach(function(z){var sl=SLOTS[c][+z.dataset.i],key=slotKey(sl.k),p=S.clouds[c].periods[key],f=p&&p.files&&p.files[sl.part];z.classList.toggle('hide',!!sl.q&&!S.edition.quarterEnd);z.classList.remove('ok','req','opt','err');if(f){z.classList.add('ok');$('span',z).textContent=f;}else{z.classList.add(sl.req?'req':'opt');$('span',z).textContent=(sl.k==='t'?'contract start to date':sl.k==='q'?quarterLabel(key):monthLabel(key))+' · drop or click to choose the CSV';}});});}

/* ---------- edition derived from the reporting month ---------- */
function lastDay(iso){var p=ym(iso);return new Date(p[0],p[1],0).getDate();}
function deriveEdition(){var E=S.edition,m=E.month;if(!/^\d{4}-\d{2}$/.test(m||''))return false;var ld=lastDay(m),p=ym(m),nm=nextMonth(m);
 E.dataAsOf=ld+' '+MEN[p[1]-1]+' '+p[0];E.dataAsOfAr=ld+' '+MAR[p[1]-1]+' '+p[0];E.quarterEnd=isQuarterEnd(m);
 E.labelEn=monthLabel(nm)+' edition · '+monthLabel(m)+' data';E.labelAr='إصدار '+monthLabel(nm,true)+' · بيانات '+monthLabel(m,true);
 S.clouds.gcp.tdLabelEn='October 2025 to '+monthLabel(m);S.clouds.gcp.tdLabelAr='أكتوبر 2025 إلى '+monthLabel(m,true);
 S.clouds.azure.tdLabelEn='Contract start to '+ld+' '+MEN[p[1]-1]+' '+p[0];S.clouds.azure.tdLabelAr='من بداية العقد إلى '+ld+' '+MAR[p[1]-1]+' '+p[0];
 if(!E.published){var d=new Date();E.published=d.getDate()+' '+MEN[d.getMonth()]+' '+d.getFullYear();E.publishedAr=d.getDate()+' '+MAR[d.getMonth()]+' '+d.getFullYear();}
 syncInputs();return true;}

/* ---------- bindings ---------- */
function scopeOf(path){if(path.indexOf('statement.')===0)return 'statement';var m=/^clouds\.(gcp|azure)\.credit\./.exec(path);if(m)return 'credit:'+m[1];return 'full';}
function syncInputs(){$$('[data-bind]').forEach(function(el){var v=get(S,el.dataset.bind);if(el.type==='checkbox')el.checked=!!v;else if(document.activeElement!==el)el.value=v==null?'':v;});}
function bindInputs(){$$('[data-bind]').forEach(function(el){var p=el.dataset.bind;el.addEventListener('input',function(){var val=el.type==='checkbox'?el.checked:el.value;if(el.type==='number')val=el.value===''?null:+el.value;set(S,p,val);
  if(p==='edition.month'){if(/^\d{4}-\d{2}$/.test(el.value)){deriveEdition();toast('Dates, labels and to-date ranges set for '+monthLabel(el.value)+'. Edit any of them if needed.','ok');onChange('full');}return;}
  if(p==='clouds.azure.enabled'){onChange('full');return;}
  onChange(scopeOf(p));});
 if(el.hasAttribute('data-stmt'))el.addEventListener('focus',function(){lastField=el;});});}
var lastField=null;
function tokenChips(){var host=$('#tokchips'),T=tokenMap(false);host.innerHTML=TOKENS.map(function(t){return '<button type="button" data-tok="'+t+'" class="'+(T[t]==null?'dead':'')+'" title="'+(T[t]==null?'no data behind this token yet':'insert at the cursor')+'">{{'+t+'}}</button>';}).join('');
 $$('button[data-tok]',host).forEach(function(b){b.addEventListener('click',function(){var el=lastField||$('#f-sb');var ins='{{'+b.dataset.tok+'}}';if(typeof el.setRangeText==='function'){el.focus();el.setRangeText(ins,el.selectionStart||0,el.selectionEnd||0,'end');}else el.value+=ins;set(S,el.dataset.bind,el.value);onChange('statement');});});}
function updateStatement(){var el=$('#report .stmt');if(el)el.outerHTML=statement();var pv=$('#stmt-preview');if(pv)pv.innerHTML=statement();}
function updateCredit(c){var el=$('#report .mfig-card.for-'+c);if(el)el.outerHTML=creditCard(c);else renderPreview();}

/* ---------- quick maps for unmapped projects and subscriptions ---------- */
function quickMaps(){['gcp','azure'].forEach(function(c){var host=$('#qm-'+c),P=S.clouds[c].periods,un={};Object.keys(P).forEach(function(k){(P[k]&&P[k].unmapped||[]).forEach(function(u){un[u||'(blank id)']=u;});});var list=Object.keys(un);
 if(!list.length){host.innerHTML='';host.hidden=true;return;}host.hidden=false;
 host.innerHTML='<div class="lab">Unmapped '+(c==='gcp'?'projects':'subscriptions')+' · pick the owning general department</div>'+list.map(function(label){return '<div class="qm-row"><code title="'+esc(label)+'">'+esc(label)+'</code><select data-qm="'+esc(un[label])+'" aria-label="Department for '+esc(label)+'"><option value="">choose...</option>'+DEPT_ORDER.map(function(d){return '<option value="'+d+'">'+esc(DEPT[d].en)+'</option>';}).join('')+'</select></div>';}).join('');
 $$('select[data-qm]',host).forEach(function(sel){sel.addEventListener('change',function(){if(!sel.value)return;var key=c==='gcp'?'projectMapText':'subMapText',id=sel.dataset.qm===''?'[account-level]':sel.dataset.qm;S.clouds[c][key]=(S.clouds[c][key]||'').replace(/\s*$/,'')+'\n'+id+' = '+sel.value+'\n';syncInputs();toast('Mapped '+id+' to '+DEPT[sel.value].en,'ok');onChange('full');});});});}

/* ---------- readiness ---------- */
var REQ={gcp:{m:['service','project','sandbox'],t:['service']},azure:{m:['service','sub'],t:['service']}};
function recomputeAll(){['gcp','azure'].forEach(function(c){var P=S.clouds[c].periods;Object.keys(P).forEach(function(k){var p=P[k];if(p&&p.source==='upload'){if(k==='td'){p.label=S.clouds[c].tdLabelEn||p.label;p.labelAr=S.clouds[c].tdLabelAr||p.labelAr;}if(c==='gcp')recomputeGcp(p);else recomputeAzure(p);}});});}
function checklist(){var E=S.edition,m=E.month,items=[],add=function(l,t){items.push({level:l,text:t});};if(!/^\d{4}-\d{2}$/.test(m||'')){add('err','Set the reporting month in the Edition box.');return items;}
 var ML=monthLabel(m);['gcp','azure'].forEach(function(c){var C=S.clouds[c];if(c==='azure'&&!C.enabled){add('ok','Microsoft Azure is not included in this edition (tick the box in the Edition section to add it).');return;}var name=cloudName(c),p=C.periods[m];
  if(!p||!p.services||!p.services.length){add('err',name+': '+ML+' by-service export is missing.');}else{add('ok',name+': '+ML+' by service loaded ('+p.services.length+' services, net '+num(p.totals.net,0)+' Riyals'+(p.sample?', SAMPLE file':'')+').');
   if(c==='gcp'){if(p.discountTrap)add('err',name+': the by-service export shows no discounts at all (Subtotal equals List cost on every row). It was pulled with the credits and discounts options off; re-export with them on.');
    if(p.projects)add('ok',name+': by project loaded, department split exact'+(p.projTotal!=null&&Math.abs(p.projTotal-p.totals.net)>1?' but the project total ('+num(p.projTotal,0)+') differs from the service total ('+num(p.totals.net,0)+') by '+num(Math.abs(p.projTotal-p.totals.net),0)+' Riyals: check both files cover the same range and scope':'')+'.');else add('warn',name+': by-project export missing, so the department split is apportioned on the latest exact period. Drop the by-project file to make it exact.');
    if(p.acctCheck){if(Math.abs(p.acctCheck.diff)<=1)add('ok',name+': the account-level bucket reconciles with the security services to the riyal.');else add('warn',name+': the account-level bucket ('+num(p.acctCheck.bucket,0)+') differs from Chronicle + Security Command Center + Fortinet ('+num(p.acctCheck.security,0)+') by '+num(Math.abs(p.acctCheck.diff),0)+' Riyals. The bucket has picked up something that is not security; revisit the split before publishing.');}
    if(!p.sandbox)add('warn',name+': sandbox export missing; the sandbox figure will read as not loaded.');}
   else{if(p.subs)add('ok',name+': by subscription loaded, department split exact'+(p.subTotal!=null&&Math.abs(p.subTotal-p.totals.net)>5?' but the subscription total ('+num(p.subTotal,0)+') differs from the service total ('+num(p.totals.net,0)+'): check scope and date range':'')+'.');else add('warn',name+': by-subscription export missing, so the department chart will say so.');if(!p.regions||!p.regions.length)add('warn',name+': by-location export missing; the region table and residency note will not appear.');}
   if(p.unmapped&&p.unmapped.length)add('err',name+': unmapped '+(c==='gcp'?'projects':'subscriptions')+': '+p.unmapped.map(function(x){return x||'(blank id)';}).join(', ')+'. Pick their departments in the '+name+' box.');}
  if(!C.periods.td||!C.periods.td.services||!C.periods.td.services.length)add('err',name+': to-date by-service export is missing.');else if(C.periods.td.source!=='upload')add('warn',name+': the to-date view still carries the previous edition ("'+C.periods.td.label+'"). Drop the fresh to-date export to bring it to '+ML+'.');else add('ok',name+': to-date loaded ('+C.periods.td.label+').');
  if(E.quarterEnd){var qk=quarterKey(m);if(!C.periods[qk])add('err',name+': quarter-end edition but no '+quarterLabel(qk)+' export loaded.');}});
 if(!S.statement.headEn||!lines(S.statement.bodyEn).length)add('err','The FinOps statement of the month needs a headline and at least one paragraph in English.');else add('ok','Statement of the month written'+(S.statement.bodyAr&&S.statement.headAr?' in English and Arabic.':' (Arabic falls back to English).'));
 var mt=missingTokens();if(mt.length)add('err','Statement tokens still waiting for data: '+mt.map(function(t){return '{{'+t+'}}';}).join(' ')+'.');
 if(!(+S.clouds.gcp.credit.starting>0&&+S.clouds.gcp.credit.remaining>=0))add('err','Google Cloud credit position: starting and remaining balances are needed.');
 var sample=['gcp','azure'].some(function(c){var P=S.clouds[c].periods;return S.clouds[c].enabled!==false&&Object.keys(P).some(function(k){return P[k]&&P[k].sample;});});if(sample)add('err','A SAMPLE_ file is loaded. The report carries a "Sample data" chip until every sample file is replaced with a real export.');
 if(E.quarterEnd!==isQuarterEnd(m))add('warn',isQuarterEnd(m)?ML+' is a quarter-end month; the Quarter tab is switched off.':ML+' is not a quarter-end month; the Quarter tab is switched on.');
 return items;}
function flowState(items){var E=S.edition,m=E.month,st={};st[1]=(/^\d{4}-\d{2}$/.test(m||'')&&E.published&&E.dataAsOf)?'ok':'todo';
 var need=0,have=0;['gcp','azure'].forEach(function(c){if(c==='azure'&&!S.clouds.azure.enabled)return;Object.keys(REQ[c]).forEach(function(k){REQ[c][k].forEach(function(part){need++;var p=S.clouds[c].periods[slotKey(k)];if(p&&p.files&&p.files[part])have++;});});});
 st[2]=have===need?'ok':(have?'part':'todo');st.files=have+' of '+need+' required';
 var un=items.some(function(i){return /unmapped/.test(i.text);}),cr=items.some(function(i){return i.level==='err'&&/credit position/.test(i.text);});st[3]=(un||cr)?'todo':'ok';
 st[4]=(S.statement.headEn&&lines(S.statement.bodyEn).length&&!missingTokens().length)?'ok':'todo';
 st.errs=items.filter(function(i){return i.level==='err';}).length;st[5]=st.errs?'todo':'ok';return st;}
function renderStudio(){refreshZones();routedChips();quickMaps();tokenChips();var pv=$('#stmt-preview');if(pv)pv.innerHTML=statement();
 var items=checklist(),ul=$('#checklist');ul.innerHTML=items.map(function(i){return '<li class="'+i.level+'">'+esc(i.text)+'</li>';}).join('');
 var st=flowState(items),labels={1:st[1]==='ok'?monthLabel(S.edition.month):'set the month',2:st.files,3:st[3]==='ok'?'complete':'needs attention',4:st[4]==='ok'?'ready':'needs data or text',5:st.errs?st.errs+' blocker'+(st.errs>1?'s':''):'ready'};
 $$('#st-flow li').forEach(function(li){var n=+li.dataset.step;li.className=st[n];$('em',li).textContent=labels[n];});
 var ok=!st.errs;['#btn-gen','#btn-gen-stable','#btn-gen-top','#btn-gen-bar'].forEach(function(s){var b=$(s);if(b)b.disabled=!ok;});$('#btn-gen').textContent='Generate FinOps_Dashboard_v'+esc(S.edition.version)+'.html';
 var bs=$('#bar-status');bs.textContent=ok?'Ready to generate Report v'+S.edition.version+' · '+monthLabel(S.edition.month):st.errs+' blocker'+(st.errs>1?'s':'')+' before generate · see Readiness';bs.className='bar-status '+(ok?'ready':'blocked');
 $('#bz-month').textContent=monthLabel(S.edition.month);$('#st-azure').classList.toggle('off',!S.clouds.azure.enabled);}
function markSaved(){var d=new Date();$('#saved').textContent='Saved in this browser '+(d.getHours()<10?'0':'')+d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes();}
function toast(msg,kind){var host=$('#toasts');if(!host)return;var t=document.createElement('div');t.className='toast '+(kind||'');t.textContent=msg;host.appendChild(t);setTimeout(function(){t.remove();},kind==='err'?7000:4200);}
function setStatus(t,cls){toast(t,cls==='err'?'err':cls==='ok'?'ok':'warn');}
var timer=null;function onChange(scope){save();clearTimeout(timer);timer=setTimeout(function(){if(scope==='statement'){updateStatement();}else if(scope&&scope.indexOf('credit:')===0){updateCredit(scope.slice(7));}else{recomputeAll();renderPreview();}renderStudio();markSaved();},scope==='full'?40:140);}

/* ---------- generate, preview as published, state ---------- */
function download(text,name,type){var blob=new Blob([text],{type:type||'text/html;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},2000);}
function publishedHtml(){var E=S.edition,html=buildReport(true,{cloud:'gcp',lang:false,pv:{},p:{}}),box=document.createElement('div');box.innerHTML=html;$$('.studio-only',box).forEach(function(n){n.remove();});
 var css=$('#fonts-css').textContent+'\n'+$('#report-css').textContent,title='MoEnergy Cloud FinOps Report · '+monthLabel(E.month);
 return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta name="robots" content="noindex">\n<title>'+esc(title)+'</title>\n<link rel="icon" href="'+FAVICON+'">\n<style>\n'+css+'\n</style>\n</head>\n<body class="published">\n<div id="report" class="report">'+box.innerHTML+'</div>\n<!-- Report v'+esc(E.version)+' · generated by FinOps Report Studio v1.1 · zero JavaScript, no external requests -->\n</body>\n</html>\n';}
function generate(stable){var items=checklist();if(items.some(function(i){return i.level==='err';})){toast('Not ready: clear the red items in Readiness first.','err');return;}
 var E=S.edition,out=publishedHtml(),name=stable?'FinOps_Dashboard.html':'FinOps_Dashboard_v'+E.version+'.html';download(out,name);
 var r=$('#gen-result');r.hidden=false;r.innerHTML='<b>Generated '+esc(name)+'</b> ('+Math.round(out.length/1024)+' KB, Report v'+esc(E.version)+', '+esc(monthLabel(E.month))+', zero JavaScript). Next:<ol><li>Open it from your Downloads folder and read it through once, English and Arabic.</li><li>'+(stable?'Upload it to SharePoint over the previous edition; the link stays the same.':'Generate the stable FinOps_Dashboard.html too and upload that one to SharePoint over the previous edition.')+'</li><li>Save the edition state and keep it with the month\'s CSVs in finops/data/'+esc(E.month)+'/.</li></ol>';
 toast('Generated '+name+'. If nothing downloaded, this viewer blocks downloads: open the Studio file from disk in a normal browser tab.','ok');}
function saveState(){download(JSON.stringify(S,null,1),'finops_edition_'+S.edition.month+'.json','application/json');toast('Edition state saved.','ok');}
var pubPreview=false;
function togglePubPreview(on){pubPreview=on;document.body.classList.toggle('pub-preview',on);$('#btn-back').hidden=!on;if(on){$('#report').innerHTML=buildReport(true,{cloud:'gcp',lang:false,pv:{},p:{}});$$('#report .studio-only').forEach(function(n){n.remove();});window.scrollTo({top:0});}else{renderPreview();}}
function initStudio(){bindInputs();syncInputs();buildZones();
 var bz=$('#bigzone'),bzi=$('input',bz);bzi.addEventListener('change',function(){if(bzi.files.length)ingestFiles(bzi.files);bzi.value='';});['dragenter','dragover'].forEach(function(ev){bz.addEventListener(ev,function(e){e.preventDefault();bz.classList.add('over');});});['dragleave','drop'].forEach(function(ev){bz.addEventListener(ev,function(e){e.preventDefault();bz.classList.remove('over');});});bz.addEventListener('drop',function(e){if(e.dataTransfer.files.length)ingestFiles(e.dataTransfer.files);});bz.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();bzi.click();}});
 document.addEventListener('dragover',function(e){e.preventDefault();});document.addEventListener('drop',function(e){e.preventDefault();});
 ['#btn-gen','#btn-gen-top','#btn-gen-bar'].forEach(function(s){$(s).addEventListener('click',function(){generate(false);});});$('#btn-gen-stable').addEventListener('click',function(){generate(true);});$('#btn-print').addEventListener('click',function(){window.print();});
 $('#btn-save').addEventListener('click',saveState);$('#btn-derive').addEventListener('click',function(){if(deriveEdition()){toast('Dates, labels and to-date ranges refilled from '+monthLabel(S.edition.month)+'.','ok');onChange('full');}});
 $('#btn-draft').addEventListener('click',function(){S.statement=clone(BASE.statement);syncInputs();toast('The embedded statement draft is back.','ok');onChange('statement');});
 ['#btn-pubpreview','#btn-pubpreview-bar'].forEach(function(s){$(s).addEventListener('click',function(){togglePubPreview(true);});});$('#btn-back').addEventListener('click',function(){togglePubPreview(false);});
 $('#f-load').addEventListener('change',function(){var f=this.files[0];if(!f)return;f.text().then(function(t){var s=JSON.parse(t);if(!s||!s.meta||!s.clouds)throw new Error('not a Studio state file');S=s;save();location.reload();}).catch(function(e){toast('Could not load that state file: '+e.message,'err');});});
 $('#btn-reset').addEventListener('click',function(){if(!confirm('Discard every edit and file loaded in this browser and return to the embedded baseline?'))return;try{localStorage.removeItem(STORE);}catch(e){}location.reload();});
 renderPreview();renderStudio();}
document.addEventListener('DOMContentLoaded',initStudio);
window.FinOpsStudio={state:function(){return S;},build:buildReport,checklist:checklist,generate:generate,classify:classify,publishedHtml:publishedHtml};
})();
