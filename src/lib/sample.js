// Generates fictional M-Pesa SMS messages so you can demo the app without real data.
export function sample(){let s=42;const r=()=>(s=s*16807%2147483647)/2147483647,pick=a=>a[r()*a.length|0],AL='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
 const code=()=>Array.from({length:10},()=>AL[r()*AL.length|0]).join(''),Kf=n=>'Ksh'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 const fee=a=>a<=100?0:a<=500?7:a<=1000?13:a<=1500?23:a<=2500?33:a<=3500?53:a<=5000?57:a<=7500?78:90;
 const SH=['SUNRISE SUPERMARKET','KAHAWA CORNER CAFE','FRESH MART','MAMA MBOGA FRESH','PETRO STOP','CHAI & MANDAZI HUT'],PP=['Mama Njeri','Brian Otieno','Chama Wanjiku','Kamau Boda','Aisha Hassan'],BL=[['POWER PREPAID','888880'],['HOME FIBRE','150501'],['WATER BILL','444400'],['TV SUBSCRIPTION','444900']];
 let bal=18000;const out=[],now=new Date();now.setHours(12,0,0,0);
 for(let i=78;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);const dow=d.getDay(),dom=d.getDate(),wk=dow===5||dow===6?1.7:1,ev=[];
  if(dom===28)ev.push(['in',62000,'ACME LTD']);if(dom===1)ev.push(['bill',25000,'LANDLORD RENT','HSE12']);
  if(r()<.5*wk)ev.push(['shop',Math.round(120+r()*r()*2900),pick(SH)]);
  if(r()<.3*wk)ev.push(['send',Math.round(200+r()*r()*3500),pick(PP)]);
  if(r()<.18)ev.push(['air',pick([50,100,100,200]),'']);if(r()<.1)ev.push(['cash',pick([500,1000,2000,3000]),'']);
  if(r()<.07){const b=pick(BL);ev.push(['bill',Math.round(300+r()*2200),b[0],b[1]])}
  if(r()<.05)ev.push(['fz',pick([100,200,300,500]),'']);if(r()<.04)ev.push(['in',Math.round(500+r()*3000),pick(PP)]);
  ev.forEach(e=>{e.t=new Date(d);e.t.setHours(r()<.1?pick([22,23,0,1,3]):8+(r()*12|0),r()*60|0)});ev.sort((x,y)=>x.t-y.t);
  ev.forEach(e=>{const[k,a,n,ac]=e,t=e.t,f=k==='send'||k==='cash'?fee(a):0;
   const dt=`${t.getDate()}/${t.getMonth()+1}/${String(t.getFullYear()).slice(2)} at ${t.getHours()%12||12}:${String(t.getMinutes()).padStart(2,'0')} ${t.getHours()<12?'AM':'PM'}`,c=code()+' Confirmed.';
   if(k==='fz'){out.push(`${c} Fuliza M-PESA amount is ${Kf(a)}. Interest charged ${Kf(Math.round(a)/100)}. Total Fuliza M-PESA outstanding amount is ${Kf(a)} on ${dt}.`);return}
   if(k!=='in'&&bal<a+f+50)return;bal+=k==='in'?a:-(a+f);
   const B=` New M-PESA balance is ${Kf(bal)}.`;
   out.push(k==='in'?`${c} You have received ${Kf(a)} from ${n} 0700000000 on ${dt}.${B}`:
    k==='shop'?`${c} ${Kf(a)} paid to ${n}. on ${dt}.${B} Transaction cost, Ksh0.00.`:
    k==='send'?`${c} ${Kf(a)} sent to ${n} 0700000000 on ${dt}.${B} Transaction cost, ${Kf(f)}.`:
    k==='bill'?`${c} ${Kf(a)} sent to ${n} for account ${ac} on ${dt}.${B} Transaction cost, Ksh0.00.`:
    k==='air'?`${c} You bought ${Kf(a)} of airtime on ${dt}.${B}`:
    `${c} on ${dt} Withdraw ${Kf(a)} from 600123 - AGENT KAWANGWARE${B} Transaction cost, ${Kf(f)}.`)})}
 return out.join('\n\n')}
