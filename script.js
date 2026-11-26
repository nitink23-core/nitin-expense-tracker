const $=s=>document.querySelector(s),root=document.documentElement;
const CATS={Food:'🍔',Transport:'🚌',Shopping:'🛍️',Bills:'💡',Health:'💊',Education:'📚',Entertainment:'🎬',Salary:'💼',Other:'📦'};
const fmt=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let tx=load('tx',[]),budgets=load('budgets',{}),type='expense',editId=null;
const today=new Date().toISOString().slice(0,10);
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
$('#theme').onclick=()=>{const d=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;root.dataset.theme=d?'light':'dark';try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}};
const opts=Object.keys(CATS).map(c=>`<option>${c}</option>`).join('');
$('#c').innerHTML=opts;$('#fc').innerHTML='<option value="all">All categories</option>'+opts;
$('#dt').value=today;$('#fm').value=today.slice(0,7);
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{type=b.dataset.t;document.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b))});

$('#f').onsubmit=e=>{e.preventDefault();
 const d=$('#d').value.trim(),a=parseFloat($('#a').value),dt=$('#dt').value;
 const msg=!d?'Enter a description.':!(a>0)?'Amount must be greater than 0.':!dt?'Choose a date.':'';
 $('#e').textContent=msg;if(msg)return;
 const item={id:editId||Date.now(),d,a,dt,type,c:$('#c').value};
 tx=editId?tx.map(t=>t.id===editId?item:t):[item,...tx];
 save('tx',tx);resetForm();render();
};
function resetForm(){editId=null;$('#f').reset();$('#dt').value=today;$('#ft').textContent='Add transaction';$('#sb').textContent='Add transaction';$('#cancel').hidden=true;$('#e').textContent=''}
$('#cancel').onclick=resetForm;
$('#list').onclick=e=>{const b=e.target.closest('button');if(!b)return;const id=+b.dataset.id,t=tx.find(x=>x.id===id);
 if(b.dataset.a==='del'){if(confirm('Delete this transaction?')){tx=tx.filter(x=>x.id!==id);save('tx',tx);if(editId===id)resetForm();render()}}
 else{editId=id;type=t.type;document.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x.dataset.t===type));
  $('#d').value=t.d;$('#a').value=t.a;$('#dt').value=t.dt;$('#c').value=t.c;$('#ft').textContent='Edit transaction';$('#sb').textContent='Save changes';$('#cancel').hidden=false;$('#d').focus()}};
['#q','#ft1','#fc','#fm'].forEach(s=>$(s).addEventListener('input',render));
$('#bl').addEventListener('input',()=>{const m=$('#fm').value||'all';budgets[m]=parseFloat($('#bl').value)||0;save('budgets',budgets);render(true)});

function render(keepBudget){
 const q=$('#q').value.toLowerCase(),ty=$('#ft1').value,c=$('#fc').value,m=$('#fm').value;
 const rows=tx.filter(t=>(ty==='all'||t.type===ty)&&(c==='all'||t.c===c)&&(!m||t.dt.startsWith(m))&&t.d.toLowerCase().includes(q)).sort((a,b)=>b.dt.localeCompare(a.dt)||b.id-a.id);
 const sum=t=>rows.filter(r=>r.type===t).reduce((s,r)=>s+r.a,0);
 const inc=sum('income'),exp=sum('expense');
 $('#inc').textContent=fmt(inc);$('#exp').textContent=fmt(exp);$('#bal').textContent=fmt(inc-exp);
 $('#bal').className=inc-exp<0?'exp':'';
 $('#list').innerHTML=rows.length?rows.map(t=>`<li><div class="dot">${CATS[t.c]}</div><div>${esc(t.d)}<small>${t.c} · ${new Date(t.dt+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</small></div><div class="amt ${t.type==='income'?'inc':'exp'}">${t.type==='income'?'+':'−'}${fmt(t.a)}</div><div class="acts"><button class="ib" data-a="edit" data-id="${t.id}">Edit</button><button class="ib" data-a="del" data-id="${t.id}">Delete</button></div></li>`).join(''):'<div class="empty">No transactions found.</div>';
 // category chart (expenses in filtered set)
 const by={};rows.filter(r=>r.type==='expense').forEach(r=>by[r.c]=(by[r.c]||0)+r.a);
 const ent=Object.entries(by).sort((a,b)=>b[1]-a[1]);
 $('#chart').innerHTML=ent.length?ent.map(([k,v])=>`<div class="cat"><span>${CATS[k]} ${k}</span><div class="track"><i style="width:${v/exp*100}%"></i></div><span style="text-align:right">${Math.round(v/exp*100)}%</span></div>`).join(''):'<div class="empty">No expenses to summarise.</div>';
 // budget
 const key=m||'all';if(!keepBudget)$('#bl').value=budgets[key]||'';
 const lim=budgets[key]||0,spent=tx.filter(t=>t.type==='expense'&&(!m||t.dt.startsWith(m))).reduce((s,t)=>s+t.a,0),pct=lim?spent/lim*100:0;
 $('#bt').className='track budget'+(pct>100?' over':'');$('#bt i').style.width=Math.min(pct,100)+'%';
 $('#bm').textContent=lim?(pct>100?`Over budget by ${fmt(spent-lim)}.`:`${fmt(lim-spent)} left (${Math.round(pct)}% used).`):'No budget set for this period.';
}
render();
