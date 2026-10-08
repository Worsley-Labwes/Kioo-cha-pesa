// Turns parsed transactions into the numbers the dashboard shows.
export const dk=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();

export function analyse(txs,ex){
 const out=txs.filter(t=>t.dir==='out'),S=a=>a.reduce((s,t)=>s+t.amt,0);
 const bc={},who={},day={},wd=Array(7).fill(0);let night=0;
 out.forEach(t=>{bc[t.cat]=(bc[t.cat]||0)+t.amt;const w=who[t.who]||(who[t.who]={amt:0,n:0,cat:t.cat});w.amt+=t.amt;w.n++;
  day[dk(t.d)]=(day[dk(t.d)]||0)+t.amt;wd[t.d.getDay()]+=t.amt;const h=t.d.getHours();if(h>=22||h<5)night++});
 const ds=txs.map(t=>+t.d);
 return{spent:S(out),got:S(txs.filter(t=>t.dir==='in')),fees:txs.reduce((s,t)=>s+t.fee,0)+ex.reduce((s,e)=>s+e.amt,0),
  cats:Object.entries(bc).sort((a,b)=>b[1]-a[1]),top:Object.entries(who).sort((a,b)=>b[1].amt-a[1].amt).slice(0,6),
  day,wd,night:night/out.length,from:new Date(Math.min(...ds)),to:new Date(Math.max(...ds)),n:txs.length,mx:Math.max(0,...Object.values(day))}}
