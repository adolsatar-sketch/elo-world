/* =====================================================================
   عالمنا — محطة البريد والرسائل
   كل الرسائل تبقى داخل الموقع وعلى هذا الجهاز فقط، وما تنرسل لأي مكان.
   ===================================================================== */
const WPost = (() => {
  // رسائل جاهزة من الشخصيات تنفتح مع التقدّم
  const READY = [
    {id:"r_welcome", from:"إيلاف", to:"you", text:"هلا! هذا أول بريد بعالمنا. كل ما تزورين مكان جديد، يمكن تلگين رسالة.", when:()=>true},
    {id:"r_garden", from:"عدول", to:"you", text:"سقيت الورد اليوم… أو يمكن سقيت الكنبة. المهم الورد زين.", when:S=>(S.stats.harvest||0)>=1},
    {id:"r_kitchen", from:"إيلاف", to:"you", text:"الريحة وصلت للمرصد! باچر نطبخ كعكة الغيوم سوا.", when:S=>Object.keys(S.recipes).length>=1},
    {id:"r_stars", from:"عدول", to:"you", text:"عديت النجوم البارحة ووصلت لمية. بعدين نمت. نكمّل الليلة؟", when:S=>Object.keys(S.sky.cons).length>=1},
    {id:"r_fest", from:"البومة", to:"you", text:"هوو! الجزيرة تتذكر كل مهرجان. تعالوا للمهرجان الجاي.", when:S=>Object.keys(S.fest.done).length>=1},
    {id:"r_forest", from:"فراشة الأسرار", to:"you", text:"شش… بساحة الأشجار القديمة بوابة تحتاج ثلاث رموز.", when:S=>Object.keys(S.flags).some(k=>k.startsWith("fv_"))}
  ];
  function deliver(where){
    const S = World.S; let n=0;
    READY.forEach(r=>{ if(!S.mail.some(m=>m.id===r.id) && r.when(S)){ S.mail.push({id:r.id, from:r.from, to:"you", text:r.text, color:"#FFF6D8", stk:"star", deliver:"home", ready:true, read:false, t:Date.now()}); n++; } });
    S.mail.forEach(m=>{ if(!m.ready && (m.deliver===where)){ m.ready=true; n++; } });
    if(n){ World.save(); if(where!=="silent") toast("وصل بريد جديد لغرفة المفاجآت بالبيت","gift"); }
  }
  function show(m){
    modal(`<div class="wd-modal wp-letter" style="--c:${m.color||"#FFF6D8"}"><div class="wp-env">${WART.envelope(m.color||"#FBF0D0", m.stk?WART.item[m.stk]():"")}</div><div class="wp-paper"><p class="wp-to">${m.from?"من "+esc(m.from):"إلى "+(m.to==="elaf"?"إيلاف":"عدول")}</p><p class="wp-text">${esc(m.text)}</p></div></div>`);
    World.sfx("page");
  }
  return { deliver, show, READY };
})();

World.region("post", (body) => {
  const S = World.S;
  const COLORS = ["#FBF0D0","#F3D9D2","#D8E4CC","#D9D2EA","#CFE3EA","#F7E1B8"];
  const STK = ["star","flower","leaf","berry","feather","shell","moon"];
  const WHEN = [["now","هسه"],["home","لما تفتحين البيت"],["activity","بعد ما تلعبين لعبة"]];
  const v = h(`<div class="wr wp"><div class="wp-hero">${WART.land.post()}<div class="wp-rab"></div><p class="wcard">الأرنب يوصل الرسائل لإيلاف وعدول. كل شي يبقى داخل عالمنا.</p></div>
    <div class="wtabs"><button data-t="write" aria-pressed="true">اكتبي رسالة</button><button data-t="box" aria-pressed="false">صندوق البريد</button></div><div class="wp-body"></div></div>`);
  body.appendChild(v);
  $(".wp-rab",v).appendChild(World.friendEl("rabbit"));
  const out=$(".wp-body",v);
  $$("[data-t]",v).forEach(b=>b.onclick=()=>{ $$("[data-t]",v).forEach(x=>x.setAttribute("aria-pressed",x===b)); b.dataset.t==="box"?box():write(); });
  function write(edit){
    const m = edit || {to:"elaf", text:"", color:COLORS[0], stk:"star", deliver:"now"};
    out.innerHTML = `<div class="wcard wp-form">
      <div class="wfield">إلى<div class="wchips"><button data-to="elaf" aria-pressed="${m.to==="elaf"}">إيلاف</button><button data-to="adool" aria-pressed="${m.to==="adool"}">عدول</button></div></div>
      <label class="wfield">الرسالة<textarea data-tx rows="4" maxlength="300" placeholder="اكتبي رسالة قصيرة…">${esc(m.text)}</textarea></label>
      <div class="wfield">لون الظرف<div class="wchips">${COLORS.map(c=>`<button class="wsw" data-c="${c}" style="background:${c}" aria-pressed="${c===m.color}" aria-label="لون"></button>`).join("")}</div></div>
      <div class="wfield">ملصق<div class="wchips">${STK.map(k=>`<button class="wmu-sk" data-s="${k}" aria-pressed="${k===m.stk}">${WART.item[k]()}</button>`).join("")}</div></div>
      <div class="wfield">متى توصل؟<div class="wchips">${WHEN.map(([k,n])=>`<button data-w="${k}" aria-pressed="${k===m.deliver}">${n}</button>`).join("")}</div></div>
      <div class="wp-prev">${WART.envelope(m.color, WART.item[m.stk]())}</div>
      <div class="row"><button class="btn honey" data-send>${edit?"احفظي التعديل":"أرسليها مع الأرنب"}</button>${edit?`<button class="btn ghost" data-cancel>رجوع</button>`:""}</div></div>`;
    const prev=()=>{ $(".wp-prev",out).innerHTML=WART.envelope(m.color, WART.item[m.stk]()); };
    const tg=(sel,key)=>$$(sel,out).forEach(b=>b.onclick=()=>{ m[key]=b.dataset[sel.slice(6,-1)]; $$(sel,out).forEach(x=>x.setAttribute("aria-pressed",x===b)); prev(); });
    tg("[data-to]","to"); tg("[data-c]","color"); tg("[data-s]","stk"); tg("[data-w]","deliver");
    const c=$("[data-cancel]",out); if(c) c.onclick=box;
    $("[data-send]",out).onclick=()=>{ const text=$("[data-tx]",out).value.trim(); if(!text){ toast("اكتبي الرسالة أول","bulb"); return; }
      m.text=text; if(edit){ if(m.deliver==="now") m.ready=true; World.save(); toast("انحفظ التعديل","check"); box(); return; }
      const rec=Object.assign({}, m, {id:"l"+Date.now(), ready:m.deliver==="now", read:false, t:Date.now()}); S.mail.push(rec); World.save(); World.sfx("ok");
      const rb=$(".wp-rab .wf",v); rb && rb.classList.add("run"); setTimeout(()=>rb&&rb.classList.remove("run"),1400);
      toast(m.deliver==="now"?"الأرنب وصّل الرسالة! تلگينها بصندوق البريد":m.deliver==="home"?"الرسالة توصل لما تفتحين البيت":"الرسالة توصل بعد ما تلعبين لعبة","check"); box(); };
  }
  function box(){
    $$("[data-t]",v).forEach(x=>x.setAttribute("aria-pressed", x.dataset.t==="box"));
    const list=S.mail.slice().reverse();
    out.innerHTML = list.length ? `<div class="wp-list">${list.map(m=>`<div class="wp-item ${m.read?"read":""}"><button class="wp-open" data-o="${m.id}">${WART.envelope(m.color, m.stk?WART.item[m.stk]():"")}</button><div><b>${m.from?"من "+esc(m.from):"إلى "+(m.to==="elaf"?"إيلاف":"عدول")}</b><small>${m.ready?(m.read?"مقروءة":"وصلت — افتحيها"):"بالطريق: "+(WHEN.find(w=>w[0]===m.deliver)||[,""])[1]}</small></div>${m.from?"":`<button class="btn ghost small" data-e="${m.id}">عدّلي</button>`}<button class="btn danger small" data-x="${m.id}">احذفي</button></div>`).join("")}</div>` : `<p class="wnote">الصندوق فارغ.</p>`;
    $$("[data-o]",out).forEach(b=>b.onclick=()=>{ const m=S.mail.find(x=>x.id===b.dataset.o); if(!m.ready){ toast("الرسالة بعدها بالطريق ويا الأرنب","bulb"); return; } if(!m.read){ m.read=true; World.save(); World.event("letter"); } WPost.show(m); box(); });
    $$("[data-e]",out).forEach(b=>b.onclick=()=>write(S.mail.find(x=>x.id===b.dataset.e)));
    $$("[data-x]",out).forEach(b=>b.onclick=()=>confirmBox("تحذفين هالرسالة؟","احذفي",()=>{ S.mail=S.mail.filter(x=>x.id!==b.dataset.x); World.save(); box(); }));
  }
  WPost.deliver("silent");
  write();
});
