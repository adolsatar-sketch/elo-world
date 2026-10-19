/* =====================================================================
   عالمنا — متحف الذكريات + المرسم (معرض الرسومات)
   الصور والرسومات تنحفظ بـ IndexedDB على هذا الجهاز فقط.
   ===================================================================== */
const WStudio = (() => {
  // يفتح المرسم الموجود بالموقع، فارغ أو لتعديل رسمة محفوظة، ويرجع للمكان اللي جا منه
  async function open(id, back){
    let d = null; if(id) d = await World.DB.get("drawings", id);
    Store.set("paint", d ? {bg:d.bg, items:d.items} : {bg:"paper", items:[]});
    Store.set("paintEdit", {id:id||null, title:d?d.title:"", note:d?d.note:"", back:back||"world:studio"});
    window.__returnTo = back || "world:studio";
    go("paint");
  }
  // يتنادى من viewPaint: يضيف زر «احفظي بالمعرض» ويحفظ الرسمة مع عنوان وملاحظة
  function attachPaint({v, st, canvases}){
    const ed = Store.get("paintEdit", null);
    const box = h(`<div class="ws-save"><button class="btn" data-gal>${ed&&ed.id?"حدّثي الرسمة بالمعرض":"احفظي بمعرض الذكريات"}</button>${ed?`<button class="btn ghost small" data-back>رجوع لعالمنا</button>`:""}</div>`);
    const anchor = v.querySelector("[data-png]"); anchor.parentNode.insertBefore(box, anchor);
    const back = box.querySelector("[data-back]"); if(back) back.onclick=()=>{ window.__returnTo=null; Store.del("paintEdit"); go(ed.back); };
    box.querySelector("[data-gal]").onclick = () => {
      const md = modal(`<div class="wd-modal"><h2>${ed&&ed.id?"تحديث الرسمة":"رسمة للمعرض"}</h2>
        <label class="wfield">العنوان<input data-t maxlength="40" value="${esc(ed?ed.title:"")}" placeholder="مثلاً: بيتنا بالليل"></label>
        <label class="wfield">ملاحظة قصيرة<textarea data-n rows="2" maxlength="140">${esc(ed?ed.note:"")}</textarea></label>
        <div class="row"><button class="btn honey" data-ok>احفظي</button></div><p class="wnote">تنحفظ على هذا الجهاز فقط.</p></div>`);
      $("[data-ok]",md.el).onclick = async () => {
        const [a,b] = canvases, c=document.createElement("canvas"); c.width=a.width; c.height=a.height; const x=c.getContext("2d"); x.drawImage(a,0,0); x.drawImage(b,0,0);
        const t=document.createElement("canvas"); const sc=Math.min(1, 420/c.width); t.width=Math.round(c.width*sc); t.height=Math.round(c.height*sc); t.getContext("2d").drawImage(c,0,0,t.width,t.height);
        const id = (ed && ed.id) || ("d"+Date.now());
        const rec = {id, title:$("[data-t]",md.el).value.trim()||"رسمة بلا عنوان", note:$("[data-n]",md.el).value.trim(), bg:st.bg, items:JSON.parse(JSON.stringify(st.items)), thumb:t.toDataURL("image/jpeg",.82), png:c.toDataURL("image/png"), t:Date.now()};
        try{ await World.DB.put("drawings", rec); }catch(e){ toast("ما قدرت أحفظ الرسمة على هذا المتصفح","close"); return; }
        if(!(ed && ed.id)){ World.stat("drawings"); World.event("draw"); }
        Store.set("paintEdit", Object.assign({}, ed||{back:"world:studio"}, {id, title:rec.title, note:rec.note}));
        md.close(); toast("انحفظت بمعرض الذكريات","check"); World.sfx("ok");
        box.querySelector("[data-gal]").textContent = "حدّثي الرسمة بالمعرض";
      };
    };
  }
  return { open, attachPaint };
})();

/* ---------- المرسم: مدخل الرسم + آخر الرسومات ---------- */
World.region("studio", (body) => {
  const v = h(`<div class="wr ws"><div class="ws-hero"><div class="ws-easel">${WART.land.studio()}</div><div class="wcard"><h3>المرسم ودفتر الرسم</h3>
    <p>قلم رفيع وسميك، فرشاة ناعمة وشمعية، ممحاة، تراجع وإعادة، ألوان، ملصقات، خلفيات، وعنوان وملاحظة لكل رسمة. والرسمة تنحفظ بالمعرض وترجعين تعدّليها وقت ما تريدين.</p>
    <div class="row"><button class="btn honey" data-new>رسمة جديدة</button></div></div></div>
    <h3 class="ws-h">رسوماتي</h3><div class="wgrid ws-grid"><p class="wnote">جاري التحميل…</p></div></div>`);
  body.appendChild(v);
  $("[data-new]",v).onclick = () => WStudio.open(null, "world:studio");
  World.DB.all("drawings").then(list => { const g=$(".ws-grid",v); if(!g) return; list.sort((a,b)=>b.t-a.t);
    g.innerHTML = list.length ? list.map(d=>`<button class="wtile ws-t" data-d="${d.id}"><img src="${d.thumb}" alt=""><b>${esc(d.title)}</b><small>اضغطي للتعديل</small></button>`).join("") : `<p class="wnote">بعد ما رسمتي شي. أول رسمة تنحفظ هنا.</p>`;
    $$("[data-d]",g).forEach(b=>b.onclick=()=>WStudio.open(b.dataset.d, "world:studio")); });
});

/* ---------- متحف الذكريات ---------- */
World.region("museum", (body) => {
  const S = World.S; S.memories = S.memories || [];
  const TABS = [["photos","جدار الصور"],["letters","صندوق الرسائل"],["art","ألبوم الرسومات"],["occasions","ركن المناسبات"],["gifts","رف الهدايا"],["log","سجل الإنجازات"]];
  let tab = Store.get("museumTab","photos"); if(!TABS.some(t=>t[0]===tab)) tab="photos";
  const COLORS = ["#FFF6D8","#F3D9D2","#D8E4CC","#D9D2EA","#CFE3EA","#F7E1B8"];
  const STK = ["star","flower","leaf","heart","moon","shell","feather","berry"].filter(k=>WART.item[k]);
  const v = h(`<div class="wr wmu"><div class="wtabs">${TABS.map(([k,n])=>`<button data-t="${k}" aria-pressed="${k===tab}">${n}</button>`).join("")}</div><div class="wmu-body"></div></div>`);
  body.appendChild(v);
  const out = $(".wmu-body",v); const urls=[];
  const photoURL = async id => { const r=await World.DB.get("photos", id); if(!r) return ""; const u=URL.createObjectURL(r.blob); urls.push(u); return u; };

  async function photos(cat){
    const list = S.memories.filter(m => cat==="occasion" ? m.cat==="occasion" : m.cat!=="occasion").slice().reverse();
    out.innerHTML = `<div class="row"><button class="btn honey" data-add>أضيفي ذكرى</button></div>
      ${cat==="occasion" && Object.keys(S.fest.keep).length ? `<div class="wgrid">${Object.entries(S.fest.keep).map(([k,f])=>`<div class="wtile done"><span class="art">${WART.item[f.sym]?WART.item[f.sym]():""}</span><b>${esc(f.title)}</b><small>${esc(f.date||"")}</small></div>`).join("")}</div>`:""}
      <div class="wmu-wall">${list.map((m,i)=>`<button class="wmu-pol" data-m="${m.id}" style="--r:${((i*37)%7)-3}deg;--c:${m.color||"#FFF6D8"}"><span class="wmu-ph">${m.photo?`<img data-ph="${m.id}" alt="">`:(WART.item[m.stk]||WART.item.star)()}</span><b>${esc(m.title)}</b><small>${esc(m.date||"")}</small></button>`).join("") || `<p class="wnote">${cat==="occasion"?"المناسبات اللي تحفظينها من المهرجانات أو تضيفينها تبين هنا.":"الجدار ينتظر أول ذكرى. أضيفي عنوان وجملة، وصورة إذا تحبين."}</p>`}</div>`;
    $$("[data-ph]",out).forEach(async im=>{ im.src = await photoURL(im.dataset.ph); });
    $("[data-add]",out).onclick=()=>editMemory(null, cat);
    $$("[data-m]",out).forEach(b=>b.onclick=()=>viewMemory(b.dataset.m));
  }
  async function viewMemory(id){
    const m=S.memories.find(x=>x.id===id); if(!m) return;
    const src = m.photo ? await photoURL(m.id) : "";
    const md = modal(`<div class="wd-modal wmu-view" style="--c:${m.color}">${src?`<img src="${src}" alt="" class="wmu-big">`:`<span class="wmu-stk">${(WART.item[m.stk]||WART.item.star)()}</span>`}<h2>${esc(m.title)}</h2>${m.date?`<p class="wnote">${esc(m.date)}</p>`:""}<p>${esc(m.text||"")}</p><div class="row"><button class="btn ghost small" data-e>عدّلي</button><button class="btn danger small" data-d>احذفي</button></div></div>`);
    $("[data-e]",md.el).onclick=()=>{ md.close(); editMemory(m.id, m.cat); };
    $("[data-d]",md.el).onclick=()=>confirmBox("تحذفين هالذكرى؟","احذفي",()=>{ S.memories=S.memories.filter(x=>x.id!==id); World.DB.del("photos", id).catch(()=>{}); World.save(); md.close(); render(); });
  }
  function editMemory(id, cat){
    const m = id ? S.memories.find(x=>x.id===id) : {title:"", date:"", text:"", color:COLORS[0], stk:"star", cat:cat==="occasion"?"occasion":"memory"};
    let color=m.color, stk=m.stk, file=null;
    const md = modal(`<div class="wd-modal"><h2>${id?"تعديل الذكرى":"ذكرى جديدة"}</h2>
      <label class="wfield">العنوان<input data-ti maxlength="40" value="${esc(m.title)}" placeholder="مثلاً: أول مرة بالمرصد"></label>
      <label class="wfield">التاريخ (اختياري)<input data-da type="date" value="${esc(m.date)}"></label>
      <label class="wfield">جملة قصيرة<textarea data-tx rows="2" maxlength="160">${esc(m.text)}</textarea></label>
      <div class="wfield">النوع<div class="wchips"><button data-cat="memory" aria-pressed="${m.cat!=="occasion"}">ذكرى</button><button data-cat="occasion" aria-pressed="${m.cat==="occasion"}">مناسبة</button></div></div>
      <div class="wfield">اللون<div class="wchips">${COLORS.map(c=>`<button class="wsw" style="background:${c}" data-c="${c}" aria-pressed="${c===color}" aria-label="لون"></button>`).join("")}</div></div>
      <div class="wfield">ملصق<div class="wchips">${STK.map(k=>`<button class="wmu-sk" data-s="${k}" aria-pressed="${k===stk}">${WART.item[k]()}</button>`).join("")}</div></div>
      <label class="wfield">صورة (اختياري)<input type="file" accept="image/*" data-f></label>
      <div class="row"><button class="btn honey" data-ok>احفظي</button></div><p class="wnote">الصور تنحفظ على هذا الجهاز فقط، وما تنرفع لأي مكان.</p></div>`);
    $$("[data-cat]",md.el).forEach(b=>b.onclick=()=>{ m.cat=b.dataset.cat; $$("[data-cat]",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); });
    $$("[data-c]",md.el).forEach(b=>b.onclick=()=>{ color=b.dataset.c; $$("[data-c]",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); });
    $$("[data-s]",md.el).forEach(b=>b.onclick=()=>{ stk=b.dataset.s; $$("[data-s]",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); });
    $("[data-f]",md.el).onchange=e=>{ file=e.target.files[0]||null; };
    $("[data-ok]",md.el).onclick = async () => {
      const title=$("[data-ti]",md.el).value.trim(); if(!title){ toast("اكتبي عنوان للذكرى","bulb"); return; }
      const rec = Object.assign(m, {id:m.id||("m"+Date.now()), title, date:$("[data-da]",md.el).value, text:$("[data-tx]",md.el).value.trim(), color, stk});
      if(file){ try{ const blob = await shrink(file); await World.DB.put("photos", {id:rec.id, blob}); rec.photo=true; }catch(e){ toast("ما قدرت أحفظ الصورة، انحفظت الذكرى بدونها","close"); } }
      if(!id){ S.memories.push(rec); World.stat("memories"); }
      World.save(); md.close(); World.sfx("ok"); render();
    };
  }
  // نصغّر الصورة قبل الحفظ حتى ما تاخذ مساحة كبيرة
  function shrink(file){ return new Promise((res, rej) => { const im=new Image(); const u=URL.createObjectURL(file); im.onload=()=>{ const sc=Math.min(1, 1280/Math.max(im.width,im.height)); const c=document.createElement("canvas"); c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); c.getContext("2d").drawImage(im,0,0,c.width,c.height); URL.revokeObjectURL(u); c.toBlob(b=>b?res(b):rej(), "image/jpeg", .86); }; im.onerror=()=>{ URL.revokeObjectURL(u); rej(); }; im.src=u; }); }

  function letters(){
    const notes = Object.keys(S.flags).filter(k=>k.startsWith("note_")).map(k=>WForest.NOTES[k.slice(5)]).filter(Boolean);
    const mail = S.mail.filter(m=>m.ready).slice().reverse();
    out.innerHTML = `<div class="wgrid">${mail.map(m=>`<button class="wtile" data-ml="${m.id}"><span class="art">${WART.envelope(m.color, m.stk?WART.item[m.stk]():"")}</span><b>${m.from?esc(m.from):"إلى "+(m.to==="elaf"?"إيلاف":"عدول")}</b><small>${esc((m.text||"").slice(0,40))}</small></button>`).join("")}
      ${notes.map(n=>`<div class="wtile done"><span class="art">${WART.note()}</span><b>${esc(n.from)}</b><small>${esc(n.text)}</small></div>`).join("")}</div>
      ${!mail.length && !notes.length ? `<p class="wnote">الرسائل اللي تكتبينها بمحطة البريد، والرسائل المخبّاة بالغابة، تتجمّع هنا.</p>`:""}
      <div class="row"><button class="btn ghost small" data-post>روحي لمحطة البريد</button></div>`;
    $$("[data-ml]",out).forEach(b=>b.onclick=()=>{ const m=S.mail.find(x=>x.id===b.dataset.ml); if(!m.read){ m.read=true; World.save(); World.event("letter"); } WPost.show(m); });
    $("[data-post]",out).onclick=()=>World.leaveTo("world:post");
  }
  async function art(){
    const list = (await World.DB.all("drawings")).sort((a,b)=>b.t-a.t);
    if(tab!=="art") return;
    out.innerHTML = `<div class="row"><button class="btn honey" data-new>رسمة جديدة</button></div><div class="wgrid">${list.map(d=>`<button class="wtile ws-t" data-d="${d.id}"><img src="${d.thumb}" alt=""><b>${esc(d.title)}</b><small>${new Date(d.t).toLocaleDateString("ar")}</small></button>`).join("") || `<p class="wnote">الألبوم فارغ. ارسمي شي بالمرسم واحفظيه.</p>`}</div>`;
    $("[data-new]",out).onclick=()=>WStudio.open(null,"world:museum");
    $$("[data-d]",out).forEach(b=>b.onclick=()=>{ const d=list.find(x=>x.id===b.dataset.d);
      const md = modal(`<div class="wd-modal" style="text-align:center"><img src="${d.png||d.thumb}" alt="" class="wmu-big"><h2>${esc(d.title)}</h2>${d.note?`<p>${esc(d.note)}</p>`:""}<div class="row" style="justify-content:center"><button class="btn honey small" data-e>عدّليها</button><button class="btn ghost small" data-dl>نزّليها</button><button class="btn danger small" data-x>احذفي</button></div></div>`, {wide:true});
      $("[data-e]",md.el).onclick=()=>{ md.close(); WStudio.open(d.id,"world:museum"); };
      $("[data-dl]",md.el).onclick=()=>{ fetch(d.png||d.thumb).then(r=>r.blob()).then(bl=>offerDownload((d.title||"rasma")+".png", bl, ()=>{})); };
      $("[data-x]",md.el).onclick=()=>confirmBox("تحذفين الرسمة من المعرض؟","احذفي",async()=>{ await World.DB.del("drawings", d.id); md.close(); art(); });
    });
  }
  function gifts(){
    const st=Object.keys(World.PAINT_STICKERS).filter(k=>S.unlocks[k]), co=Object.keys(World.PAINT_COLORS).filter(k=>S.unlocks[k]);
    out.innerHTML = `<div class="wcard"><h3>زينة البيت (${S.decor.length})</h3><div class="wgrid">${S.decor.map(k=>`<div class="wtile"><span class="art">${WART.decor[k]()}</span><small>${World.DECOR[k].n}</small></div>`).join("")}</div></div>
      <div class="wcard"><h3>ألوان وملصقات المرسم</h3><div class="wchips">${co.map(k=>`<span class="wsw" style="background:${World.PAINT_COLORS[k][0]}" title="${World.PAINT_COLORS[k][1]}"></span>`).join("")||'<span class="wnote">الأوسمة تفتح ألوان جديدة.</span>'}</div><p>${st.map(k=>World.PAINT_STICKERS[k][0]).join("، ")||'<span class="wnote">وملصقات جديدة.</span>'}</p></div>
      <div class="wcard"><h3>هدايا مفتوحة</h3><p>${(S.opened||[]).length} هدية.${S.gifts.length?` وتنتظرج ${S.gifts.length} بغرفة المفاجآت بالبيت.`:""}</p></div>`;
  }
  function log(){
    const fv=Object.keys(S.flags).filter(k=>k.startsWith("fv_")).length;
    out.innerHTML = `<div class="wd-ach">${World.ACH.map(a=>`<div class="wd-a ${S.ach[a.id]?"on":""}">${WART.badge(a.sym, S.ach[a.id]?a.c:"#D8D2C0")}<b>${a.n}</b><small>${S.ach[a.id]?"من "+S.ach[a.id]:a.d}</small></div>`).join("")}</div>
      <div class="wcard wmu-log"><h3>رحلتنا لحد هسه</h3><ul>
        <li>زرنا ${Object.keys(S.visited).length} مناطق من ${Object.keys(World.REG).length}.</li><li>اكتشفنا ${fv} أماكن بالغابة.</li>
        <li>جمعنا ${S.stats.collected||0} شي، منها ${S.stats.stars||0} نجمة.</li><li>طبخنا ${Object.keys(S.recipes).length} وصفات، وقطفنا ${S.stats.harvest||0} زهرة.</li>
        <li>لعبنا ${S.stats.games||0} لعبة، وكمّلنا ${Object.keys(S.sky.cons).length} كوكبات.</li><li>تعرفنا على ${Object.keys(S.met).length} أصدقاء.</li></ul></div>`;
  }
  const RND = {photos:()=>photos("memory"), letters, art, occasions:()=>photos("occasion"), gifts, log};
  function render(){ Store.set("museumTab", tab); $$("[data-t]",v).forEach(b=>b.setAttribute("aria-pressed", b.dataset.t===tab)); RND[tab](); }
  $$("[data-t]",v).forEach(b=>b.onclick=()=>{ tab=b.dataset.t; World.sfx("page"); render(); });
  render();
  return () => urls.forEach(u=>URL.revokeObjectURL(u));
});
