/* =====================================================================
   عالمنا — مرصد القمر والنجوم (هادئ وليلي)
   ===================================================================== */
World.region("sky", (body) => {
  const S = World.S, K = S.sky;
  const THEMES = {indigo:["#14112B","#2E2A5C","#5A4C9A","نيلي"], plum:["#1F0F2E","#4A2A5C","#8E5A9A","بنفسجي"], teal:["#0C1E2A","#1E4A5C","#4E8E9C","فيروزي"], dawn:["#2E2A5C","#8E6AA8","#F3B6AE","فجر"]};
  const CONS = [
    {id:"cat", n:"القطة", pts:[[20,70],[22,40],[30,52],[40,52],[48,40],[50,70],[35,80]], open:()=>true},
    {id:"heart", n:"القلب", pts:[[50,80],[30,60],[24,42],[34,30],[50,40],[66,30],[76,42],[70,60]], open:()=>true},
    {id:"boat", n:"القارب", pts:[[20,60],[80,60],[68,76],[32,76],[20,60],[50,58],[50,20],[72,52]], open:()=>true},
    {id:"lantern", n:"الفانوس", pts:[[50,14],[50,26],[38,32],[38,62],[50,70],[62,62],[62,32],[50,26]], open:()=>true},
    {id:"tree", n:"الشجرة", pts:[[50,84],[50,66],[30,66],[50,40],[36,40],[50,18],[64,40],[50,40],[70,66],[50,66]], open:()=>!!S.flags.sky_sort, hint:"تنفتح بعد ترتيب النجوم"},
    {id:"crown", n:"التاج", pts:[[24,70],[24,36],[38,54],[50,28],[62,54],[76,36],[76,70],[24,70]], open:()=>!!S.flags.sky_sort, hint:"تنفتح بعد ترتيب النجوم"},
    {id:"butterfly", n:"الفراشة", pts:[[50,30],[30,20],[22,42],[50,50],[78,42],[70,20],[50,30],[50,74],[34,70],[50,50],[66,70],[50,74]], open:()=>(S.flags.sky_hidden||0)>=2, hint:"تنفتح بعد ما تلگين كوكبتين مخفيتين"},
    {id:"key", n:"المفتاح", pts:[[30,30],[44,30],[44,44],[30,44],[30,30],[44,37],[78,37],[78,48],[70,48],[70,42]], open:()=>(S.flags.sky_hidden||0)>=3, hint:"تنفتح بعد ما تلگين ثلاث كوكبات مخفية"}
  ];
  const MSGS = ["نجمة تگول: إيلاف تضحك، والسما تضوي.","رسالة من عدول: «باچر نطلع للمرصد سوا؟»","النجوم تتذكر كل أمنية انكتبت هنا.","القمر يسلّم ويگول: لا تسهرون هواية.","من إيلاف: «كل نجمة إلها اسم، وأحلاها اسمك».","الغيمة الصغيرة تمر وتلوّح.","عدول عدّ النجوم ووصل لمية… بعدين نام."];
  const rnd = (i,k=1) => { const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
  const th = () => THEMES[K.theme]||THEMES.indigo;
  const v = h(`<div class="wsk" style="--s1:${th()[0]};--s2:${th()[1]};--s3:${th()[2]}">
    <div class="wsk-sky"><svg class="wsk-stars" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice">${Array.from({length:120},(_,i)=>`<circle cx="${(rnd(i)*100).toFixed(2)}" cy="${(rnd(i,2)*60).toFixed(2)}" r="${(.08+rnd(i,3)*.22).toFixed(2)}" fill="#FFF8E0" style="animation-delay:${(-rnd(i,4)*4).toFixed(2)}s"/>`).join("")}${K.wishes.map((w,i)=>`<circle class="wish" cx="${(10+rnd(i+300)*80).toFixed(1)}" cy="${(6+rnd(i+300,2)*30).toFixed(1)}" r=".9" fill="#FFE7AE"><title>${esc(w.t)}</title></circle>`).join("")}</svg>
      <div class="wsk-moon"></div><div class="wsk-shoot"></div><div class="wsk-owl"></div></div>
    <div class="wtabs wsk-tabs">${[["cons","كوكبات"],["hidden","كوكبات مخفية"],["sort","ترتيب النجوم"],["wish","أمنية"],["msgs","رسائل النجوم"],["theme","لون السما"]].map(([k,n],i)=>`<button data-t="${k}" aria-pressed="${i===0}">${n}</button>`).join("")}</div>
    <div class="wsk-body"></div></div>`);
  body.appendChild(v);
  const out=$(".wsk-body",v);
  $(".wsk-owl",v).appendChild(World.friendEl("owl"));
  $$("[data-t]",v).forEach(b=>b.onclick=()=>{ $$("[data-t]",v).forEach(x=>x.setAttribute("aria-pressed",x===b)); World.sfx("soft"); ({cons, hidden, sort, wish, msgs, theme})[b.dataset.t](); });

  /* ---------- توصيل النجوم ---------- */
  function cons(){
    out.innerHTML = `<div class="wgrid">${CONS.map(c=>{ const o=c.open(), d=K.cons[c.id]; return `<button class="wtile ${o?"":"locked"} ${d?"done":""}" data-c="${c.id}"><span class="art">${consSVG(c, d?c.pts.length:0, true)}</span><b>${o?c.n:"كوكبة مقفولة"}</b><small>${o?(d?"كمّلتيها":"وصّلي النجوم"):c.hint}</small></button>`; }).join("")}</div>`;
    $$("[data-c]",out).forEach(b=>b.onclick=()=>{ const c=CONS.find(x=>x.id===b.dataset.c); if(!c.open()){ toast(c.hint,"lock"); return; } play(c); });
  }
  function consSVG(c, n, small){ const P=c.pts; return `<svg viewBox="0 0 100 100" class="wsk-c"><rect width="100" height="100" rx="12" fill="${small?"#2E2A5C":"none"}"/>${n>1?`<polyline points="${P.slice(0,n).map(p=>p.join(",")).join(" ")}" fill="none" stroke="#FFE7AE" stroke-width="${small?2:1.4}" stroke-linecap="round" stroke-linejoin="round"/>`:""}${small?P.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#FFF8E0"/>`).join(""):""}</svg>`; }
  function play(c){
    let n=0; const P=c.pts;
    // كل نقطة مكررة (نفس الإحداثي) تتوصّل مرة وحدة: نعرض نقاط فريدة ونمشي على الترتيب
    const uniq=[]; P.forEach(p=>{ if(!uniq.some(q=>q[0]===p[0]&&q[1]===p[1])) uniq.push(p); });
    out.innerHTML = `<div class="wcard wsk-play"><h3>${c.n}</h3><p class="wnote">اضغطي على النجمة اللي تلمع، وتتوصل الخطوط وحدها.</p><div class="wsk-board"><svg viewBox="0 0 100 100" class="wsk-c big"><polyline class="ln" fill="none" stroke="#FFE7AE" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" points=""/>${uniq.map((p,i)=>`<g class="sp" data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="6" fill="transparent"/><circle cx="${p[0]}" cy="${p[1]}" r="2.2" fill="#FFF8E0"/></g>`).join("")}</svg></div><div class="row"><button class="btn ghost small" data-b>رجوع</button></div></div>`;
    const svg=$(".wsk-board svg",out), ln=$(".ln",svg);
    const idx = p => uniq.findIndex(q=>q[0]===p[0]&&q[1]===p[1]);
    const glow = () => $$(".sp",svg).forEach(g=>g.classList.toggle("next", n<P.length && +g.dataset.i===idx(P[n])));
    glow();
    $$(".sp",svg).forEach(g=>g.addEventListener("click", ()=>{
      if(n>=P.length) return; if(+g.dataset.i!==idx(P[n])){ World.sfx("soft"); return; }
      n++; TAudio.note(n%7, .4); g.classList.add("on");
      while(n<P.length && n>0 && P[n][0]===P[n-1][0] && P[n][1]===P[n-1][1]) n++;
      ln.setAttribute("points", P.slice(0,n).map(p=>p.join(",")).join(" ")); glow();
      if(n>=P.length){ const first=!K.cons[c.id]; K.cons[c.id]=World.today(); World.save(); World.event("puzzle"); if(first){ World.give("moon",1); World.give("star",1,true); } World.checkAch(); World.sfx("ok"); svg.classList.add("done"); toast(`كمّلتي كوكبة ${c.n}!`,"star"); }
    }));
    $("[data-b]",out).onclick=cons;
  }
  /* ---------- كوكبات مخفية بالسما ---------- */
  function hidden(){
    const found = S.flags.sky_hidden||0;
    const spots = [[18,28],[72,22],[46,46],[86,52],[30,58]].map((p,i)=>({p, got:i<found}));
    out.innerHTML = `<div class="wcard"><h3>دوري على الكوكبات المخفية</h3><p class="wnote">بالسما أكو مجموعات نجوم خافتة تلمع شوية. لگيتي ${found} من 5.</p>
      <div class="wsk-hunt">${spots.map((s,i)=>`<button class="wsk-hs ${s.got?"got":""}" data-h="${i}" style="left:${s.p[0]}%;top:${s.p[1]}%" aria-label="مجموعة نجوم">${[0,1,2,3].map(k=>`<i style="--x:${(rnd(i*9+k)*30-15).toFixed(0)}px;--y:${(rnd(i*9+k,2)*30-15).toFixed(0)}px"></i>`).join("")}</button>`).join("")}${Array.from({length:50},(_,i)=>`<i class="fake" style="left:${rnd(i+50)*100}%;top:${rnd(i+50,2)*100}%"></i>`).join("")}</div>
      <button class="btn ghost small" data-hint>تلميح</button></div>`;
    $$("[data-h]",out).forEach(b=>b.onclick=()=>{ const i=+b.dataset.h; if(b.classList.contains("got")) return; if(i!==(S.flags.sky_hidden||0)){ World.sfx("soft"); toast("حلوة… بس جربي مجموعة ثانية تلمع أكثر","bulb"); return; } S.flags.sky_hidden=i+1; World.save(); World.give("star",1); World.event("puzzle"); World.sfx("sparkle"); hidden(); });
    $("[data-hint]",out).onclick=()=>{ const b=$(`[data-h="${S.flags.sky_hidden||0}"]`,out); if(b){ b.classList.add("hint"); setTimeout(()=>b.classList.remove("hint"),2200); } };
  }
  /* ---------- ترتيب النجوم حسب اللون ---------- */
  function sort(){
    const COL = [["#FFE7AE","ذهبية"],["#B6E3F0","زرقا"],["#F3B6C8","وردية"]];
    let items = Array.from({length:9},(_,i)=>({c:i%3, id:i})).sort(()=>Math.random()-.5), sel=null, placed=0;
    out.innerHTML = `<div class="wcard"><h3>رتّبي النجوم حسب لونها</h3><p class="wnote">اضغطي نجمة، بعدين اضغطي السلة اللي بنفس لونها.</p>
      <div class="wsk-pile">${items.map(it=>`<button class="wsk-st" data-s="${it.id}" data-c="${it.c}" style="--c:${COL[it.c][0]}" aria-label="نجمة ${COL[it.c][1]}">${WART.item.star().replace(/#F2D27A/,COL[it.c][0])}</button>`).join("")}</div>
      <div class="wsk-bins">${COL.map(([c,n],i)=>`<button class="wsk-bin" data-b="${i}" style="--c:${c}"><b>${n}</b><span></span></button>`).join("")}</div></div>`;
    $$(".wsk-st",out).forEach(b=>b.onclick=()=>{ sel=b; $$(".wsk-st",out).forEach(x=>x.classList.toggle("sel",x===b)); World.sfx("soft"); });
    $$(".wsk-bin",out).forEach(bin=>bin.onclick=()=>{ if(!sel) return; if(sel.dataset.c!==bin.dataset.b){ World.sfx("soft"); toast("هالنجمة لونها غير","bulb"); return; } $("span",bin).insertAdjacentHTML("beforeend", "★"); sel.remove(); sel=null; placed++; TAudio.note(placed%7,.3);
      if(placed===9){ const first=!S.flags.sky_sort; S.flags.sky_sort=1; World.save(); World.event("puzzle"); World.sfx("ok"); if(first){ World.give("star",2); toast("انفتحت كوكبتين جديدتين: الشجرة والتاج","lock"); } else toast("رتبتيها كلها!","star"); } });
  }
  /* ---------- أمنية بنجمة ---------- */
  function wish(){
    out.innerHTML = `<div class="wcard"><h3>اكتبي أمنية داخل نجمة</h3><label class="wfield">الأمنية<input data-w maxlength="80" placeholder="أتمنى…"></label><div class="row"><button class="btn honey" data-go>طيّريها للسما</button></div>
      ${K.wishes.length?`<h3>أمنياتنا بالسما</h3><ul class="wsk-wl">${K.wishes.slice().reverse().map((w,i)=>`<li>${WART.item.star()}<span>${esc(w.t)}</span><button class="btn ghost small" data-x="${K.wishes.length-1-i}">احذفي</button></li>`).join("")}</ul>`:""}<p class="wnote">الأمنيات تبقى بالمرصد على هذا الجهاز.</p></div>`;
    $("[data-go]",out).onclick=()=>{ const t=$("[data-w]",out).value.trim(); if(!t){ toast("اكتبي الأمنية أول","bulb"); return; } K.wishes.push({t, d:World.today()}); World.save(); World.event("wish"); World.sfx("sparkle");
      const f=h(`<div class="wsk-fly">${WART.item.star()}</div>`); $(".wsk-sky",v).appendChild(f); setTimeout(()=>f.remove(),1800);
      const svg=$(".wsk-stars",v), i=K.wishes.length-1; svg.insertAdjacentHTML("beforeend", `<circle class="wish" cx="${(10+rnd(i+300)*80).toFixed(1)}" cy="${(6+rnd(i+300,2)*30).toFixed(1)}" r=".9" fill="#FFE7AE"><title>${esc(t)}</title></circle>`); wish(); };
    $$("[data-x]",out).forEach(b=>b.onclick=()=>{ K.wishes.splice(+b.dataset.x,1); World.save(); wish(); });
  }
  /* ---------- رسائل النجوم: نجوم ساقطة ---------- */
  let shootT=null;
  function msgs(){
    out.innerHTML = `<div class="wcard"><h3>رسائل بين النجوم</h3><p class="wnote">لما تمر نجمة ساقطة بالسما فوگ، اضغطي عليها حتى تقرين رسالتها. لگيتي ${K.msgs.length} رسائل.</p><ul class="wsk-wl">${K.msgs.slice(-5).reverse().map(m=>`<li>${WART.item.moon()}<span>${esc(m)}</span></li>`).join("")}</ul></div>`;
    clearTimeout(shootT); const sh=()=>{ const s=$(".wsk-shoot",v); if(!s) return; const b=h(`<button class="wsk-ss" style="top:${10+Math.random()*40}%" aria-label="نجمة ساقطة"></button>`); s.appendChild(b);
      b.onclick=()=>{ const m=MSGS[(K.msgs.length)%MSGS.length]; K.msgs.push(m); World.save(); World.sfx("sparkle"); b.remove(); toast(m,"star"); if(K.msgs.length%3===0) World.give("star",1); if($(".wsk-body",v) && $("[data-t=msgs]",v).getAttribute("aria-pressed")==="true") msgs(); };
      setTimeout(()=>b.remove(), 3600); shootT=setTimeout(sh, 2600+Math.random()*2400); };
    shootT=setTimeout(sh, 600);
  }
  /* ---------- لون السما وأصوات الليل ---------- */
  function theme(){
    out.innerHTML = `<div class="wcard"><h3>اختاري لون السما</h3><div class="wchips">${Object.entries(THEMES).map(([k,t])=>`<button data-th="${k}" aria-pressed="${K.theme===k}" style="background:linear-gradient(135deg,${t[1]},${t[2]});color:#fff">${t[3]}</button>`).join("")}</div>
      <h3>أصوات الليل</h3><p class="wnote">موسيقى أصلية هادئة. التشغيل والإيقاف بيدج.</p><button class="btn ghost" data-snd>${S.opts.music?"وقّفي الموسيقى":"شغّلي موسيقى الليل"}</button></div>`;
    $$("[data-th]",out).forEach(b=>b.onclick=()=>{ K.theme=b.dataset.th; World.save(); const t=th(); v.style.setProperty("--s1",t[0]); v.style.setProperty("--s2",t[1]); v.style.setProperty("--s3",t[2]); theme(); });
    $("[data-snd]",out).onclick=()=>{ S.opts.music=!S.opts.music; World.save(); World.music("night"); const hb=document.querySelector("[data-snd].wd-b"); hb && hb.setAttribute("aria-pressed",S.opts.music); theme(); };
  }
  cons();
  return () => clearTimeout(shootT);
});
