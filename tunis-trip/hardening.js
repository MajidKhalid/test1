(()=>{
function harden(root=document){
 root.querySelectorAll?.('a[target="_blank"]').forEach(a=>{
   const rel=new Set((a.getAttribute('rel')||'').split(/\s+/).filter(Boolean));
   rel.add('noopener'); rel.add('noreferrer');
   a.setAttribute('rel',[...rel].join(' '));
 });
}
harden();
new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)harden(n)}))).observe(document.body,{childList:true,subtree:true});
})();