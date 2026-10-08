// Parsers for M-Pesa SMS messages and statement CSVs.
// Both return { txs, ex }: txs = transactions, ex = extra fee rows (CSV charges / Fuliza interest).
export const N=s=>parseFloat(String(s||'').replace(/,/g,'').replace(/[^\d.]/g,''))||0;
export const tc=s=>s.toLowerCase().replace(/(^|[\s'-])\w/g,c=>c.toUpperCase()).trim();
export const catOf=t=>{t=t.toLowerCase();return /fuliza/.test(t)?'Fuliza':/airtime/.test(t)?'Airtime':/withdraw|agent/.test(t)?'Cash out':/pay ?bill|for account/.test(t)?'Bills':/merchant|paid to|buy goods/.test(t)?'Shopping':/shwari|lock savings|kcb m-?pesa|ziidi/.test(t)?'Savings':/transfer|sent to/.test(t)?'People':'Other'};

export function parseSMS(t){const txs=[],ex=[];
 t.split(/(?=\b[A-Z0-9]{10} confirmed)/i).forEach(m=>{
  const dt=m.match(/on (\d{1,2})\/(\d{1,2})\/(\d{2,4}) at (\d{1,2}):(\d{2}) ?(AM|PM)/i);if(!dt||!/confirmed/i.test(m))return;
  let[,dd,mo,yy,h,mi,ap]=dt;h=+h%12+(/pm/i.test(ap)?12:0);yy=+yy<100?2000+ +yy:+yy;
  const d=new Date(yy,mo-1,dd,h,+mi),g=r=>(m.match(r)||[])[1];
  if(/fuliza/i.test(m)&&!/sent to|paid to|airtime/i.test(m)){const f=N(g(/(?:interest|access fee)[^K]*?Ksh\s?([\d,]+\.?\d*)/i));if(f)ex.push({d,amt:f});return}
  const amt=N(g(/Ksh\s?([\d,]+\.?\d*)/i)),bal=g(/balance is Ksh\s?([\d,]+\.?\d*)/i),fee=N(g(/cost,? Ksh\s?([\d,]+\.?\d*)/i));
  if(!amt)return;
  const dir=/received/i.test(m)?'in':'out';
  let who=dir==='in'?g(/received[^]*?from (.+?)(?: \+?[\d*]{7,}| on \d)/i):/withdraw/i.test(m)?g(/from \d+ - (.+?) New/i):/airtime/i.test(m)?'Airtime':g(/(?:sent to|paid to) (.+?)(?:\.? on \d| for account| \d{9,})/i);
  who=tc((who||'Unknown').replace(/[.\s]+$/,''));
  txs.push({d,amt,dir,cat:dir==='in'?'Received':catOf(m),who,fee,bal:bal?N(bal):undefined})});
 return{txs,ex}}

export function parseCSV(t){const txs=[],ex=[],rows=t.split(/\r?\n/).map(l=>l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c=>c.replace(/^"|"$/g,'').trim()));
 const hi=rows.findIndex(r=>r.some(c=>/paid in/i.test(c)));if(hi<0)return{txs,ex};
 const H=rows[hi].map(c=>c.toLowerCase()),f=k=>H.findIndex(c=>c.includes(k)),iT=f('time'),iD=f('detail'),iI=f('paid in'),iW=f('withdraw'),iB=f('balance');
 rows.slice(hi+1).forEach(r=>{const d=new Date((r[iT]||'').replace(' ','T'));if(isNaN(d))return;
  const det=r[iD]||'',pi=N(r[iI]),po=N(r[iW]);
  if(/charge/i.test(det)){ex.push({d,amt:pi||po});return}
  if(/overdraft of credit party/i.test(det)||!(pi||po))return;
  const dir=pi?'in':'out',w=(det.split(/ - /)[1]||det.replace(/^.*? (to|from) /i,'')).replace(/[\d*]{5,}/g,'').trim();
  txs.push({d,amt:pi||po,dir,cat:dir==='in'?'Received':catOf(det),who:tc(w)||'Unknown',fee:0,bal:iB>=0&&r[iB]?N(r[iB]):undefined})});
 return{txs,ex}}
