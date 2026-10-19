/* =====================================================================
   عالمنا — حديقة إيلاف وعدول
   ازرعي، اسقي، اقطفي، سمّي النباتات، وزيّني الحديقة. كل شي محفوظ.
   النمو سريع: كل سقية تكبّر النبتة مرحلة (بعد ثواني قليلة).
   ===================================================================== */
World.region("garden", (body, {first}) => {
  const S = World.S, G = S.garden;
  const BASE = ["rose","pink","sun","berry"];
  const kinds = () => BASE.concat(["lilac","moon","cloud"].filter(k=>S.unlocks["plant_"+k]));
  const DECO = {
    bfly:{n:"فراشة", a:()=>WART.butterfly("#F3A9B8","#F2D27A")}, bfly2:{n:"فراشة زرقا", a:()=>WART.butterfly("#8EC3CF","#B9A6DD")},
    lantern:{n:"فانوس", a:()=>WART.lanternPost(true)}, stone:{n:"حجر زينة", a:()=>`<svg viewBox="0 0 60 36"><ellipse cx="30" cy="22" rx="26" ry="12" fill="#B8B4C8" stroke="#6E6955" stroke-width="2.4"/><path d="M16 18c8-6 18-6 26-2" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/></svg>`},
    mush:{n:"فطر مضيء", a:()=>WART.item.mushroom()}, sign:{n:"لافتة", a:()=>WART.sign("حديقتنا")}
  };
  let mode = "seed", busy = {};
  const v = h(`<div class="wr wg2">
    <div class="wg2-scene"><div class="wg2-sky"></div><div class="wg2-fence"></div>
      <div class="wg2-plots">${G.plots.map((_,i)=>`<button class="wg2-plot" data-p="${i}" aria-label="حوض ${i+1}"></button>`).join("")}</div>
      <div class="wg2-deco"></div><div class="wg2-daily"></div><div class="wg2-cast"></div><div class="wg2-turtle"></div></div>
    <div class="wtabs wg2-tools" role="group" aria-label="الأداة">
      <button data-m="seed" aria-pressed="true">${WART.item.seed()} ازرعي</button>
      <button data-m="water" aria-pressed="false">${WART.can()} اسقي</button>
      <button data-m="look" aria-pressed="false">${WART.item.flower()} سمّي واقطفي</button>
      <button data-m="deco" aria-pressed="false">${WART.butterfly()} زيّني</button></div>
    <div class="wcard wg2-msg"></div>
    <div class="wg2-decobar" hidden></div></div>`);
  body.appendChild(v);
  const scene=$(".wg2-scene",v), msg=$(".wg2-msg",v);
  const cs = World.cast($(".wg2-cast",v), {h:30, x:[20,80], range:[8,92]});
  const tell = t => { msg.innerHTML = t; };
  const HINT = {seed:`اختاري حوض فارغ وازرعي بذرة. عندج <b>${S.inv.seed||0}</b> بذور.`, water:"اضغطي على نبتة حتى تسقينها. كل سقية تكبرها مرحلة.", look:"اضغطي على أي نبتة حتى تسمينها أو تكتبين إلها ملاحظة. والمزهرة تنقطف.", deco:"اختاري زينة من الشريط، واسحبيها بالحديقة لمكانها. واضغطي عليها مرتين حتى تشيلينها."};
  function setMode(m){ mode=m; $$("[data-m]",v).forEach(b=>b.setAttribute("aria-pressed", b.dataset.m===m)); $(".wg2-decobar",v).hidden = m!=="deco"; HINT.seed=`اختاري حوض فارغ وازرعي بذرة. عندج <b>${S.inv.seed||0}</b> بذور.`; tell(HINT[m]); }
  $$("[data-m]",v).forEach(b=>b.onclick=()=>{ World.sfx("soft"); setMode(b.dataset.m); });

  function drawPlots(){
    $$(".wg2-plot",v).forEach((b,i)=>{ const p=G.plots[i];
      b.innerHTML = `<span class="wg2-soil"></span>${p?`<span class="wg2-pl ${busy[i]?"drink":""}">${WART.plant(p.kind, p.stage)}</span>${p.name?`<small class="wg2-name">${esc(p.name)}</small>`:""}${p.stage>=3?'<i class="wg2-ready">✿</i>':""}`:""}`;
      b.classList.toggle("empty", !p); b.setAttribute("aria-label", p ? `${p.name||World.PLANT_NAMES[p.kind]} — ${["بذرة","برعم","تكبر","مزهرة"][p.stage]}` : `حوض ${i+1} فارغ`); });
  }
  $$(".wg2-plot",v).forEach(b => b.onclick = () => {
    const i=+b.dataset.p, p=G.plots[i];
    if(mode==="seed"){
      if(p){ tell("هذا الحوض بيه نبتة. اختاري حوض فارغ."); return; }
      if(!World.has("seed")){ tell("خلصت البذور. تلگين بذور بالغابة وبمهام اليوم، وكل زهرة تقطفينها ترجع بذرة."); World.sfx("nope"); return; }
      pickKind(kind => { World.spend("seed"); G.plots[i]={kind, stage:0, t:Date.now()}; World.save(); World.sfx("pop"); drawPlots(); setMode("water"); tell("زرعناها! هسه اسقيها."); });
    } else if(mode==="water"){
      if(!p){ tell("الحوض فارغ. ازرعي بذرة أول."); return; }
      if(p.stage>=3){ tell("هاي مزهرة! اقطفيها من «سمّي واقطفي»."); return; }
      if(busy[i]) return;
      busy[i]=true; World.sfx("splash"); b.classList.add("watering"); drawPlots(); World.event("water");
      setTimeout(()=>{ busy[i]=false; b.classList.remove("watering"); p.stage++; World.save(); drawPlots(); if(p.stage>=3){ World.sfx("sparkle"); tell(`${World.PLANT_NAMES[p.kind]} زهّرت! اقطفيها أو خليها تزيّن الحديقة.`); } }, motionOK()?1600:300);
    } else if(mode==="look"){
      if(!p){ tell("الحوض فارغ."); return; }
      plantCard(i);
    }
  });
  function pickKind(cb){
    const md = modal(`<div class="wd-modal"><h2>شنو نزرع؟</h2><div class="wgrid">${kinds().map(k=>`<button class="wtile" data-k="${k}"><span class="art">${WART.plant(k,3)}</span><b>${World.PLANT_NAMES[k]}</b></button>`).join("")}</div><p class="wnote">نباتات خاصة تنفتح من الأوسمة: زهرة القمر، الليلكية، وقطن الغيوم.</p></div>`, {wide:true});
    $$("[data-k]",md.el).forEach(b=>b.onclick=()=>{ md.close(); cb(b.dataset.k); });
  }
  function plantCard(i){
    const p=G.plots[i];
    const md = modal(`<div class="wd-modal" style="text-align:center"><span class="wg2-big">${WART.plant(p.kind,p.stage)}</span><h2>${esc(p.name||World.PLANT_NAMES[p.kind])}</h2><p class="wnote">${["بذرة نايمة","برعم صغير","تكبر يوم بعد يوم","مزهرة"][p.stage]}</p>
      <label class="wfield">اسم النبتة<input data-n maxlength="20" value="${esc(p.name||"")}" placeholder="مثلاً: وردة إيلاف"></label>
      <label class="wfield">ملاحظة<input data-o maxlength="60" value="${esc(p.note||"")}" placeholder="جملة قصيرة"></label>
      <div class="row" style="justify-content:center"><button class="btn ghost small" data-s>احفظي</button>${p.stage>=3?`<button class="btn honey small" data-h>اقطفيها</button>`:""}</div></div>`);
    $("[data-s]",md.el).onclick=()=>{ p.name=$("[data-n]",md.el).value.trim(); p.note=$("[data-o]",md.el).value.trim(); World.save(); md.close(); drawPlots(); };
    const hv=$("[data-h]",md.el); if(hv) hv.onclick=()=>{ md.close(); harvest(i); };
  }
  function harvest(i){
    const p=G.plots[i]; G.plots[i]=null; World.save();
    if(p.kind==="berry") World.give("berry",3); else if(p.kind==="cloud") World.give("cloud",2); else if(p.kind==="moon") World.give("moon",1); else World.give("flower",2);
    World.give("seed", Math.random()<.4?2:1, true); World.stat("harvest"); drawPlots();
    cs.wave(Math.random()<.5?"elaf":"adool"); tell(`قطفتي ${p.name||World.PLANT_NAMES[p.kind]}! ورجعتلج بذرة.`);
  }

  /* ---------- الزينة: سحب داخل الحديقة ---------- */
  const decoBox=$(".wg2-deco",v);
  function drawDeco(){
    decoBox.innerHTML = G.deco.map((d,i)=>`<button class="wg2-d" data-i="${i}" style="left:${d.x}%;top:${d.y}%" aria-label="${DECO[d.k].n}">${DECO[d.k].a()}</button>`).join("");
    $$(".wg2-d",decoBox).forEach(el => { const d=G.deco[+el.dataset.i]; let st=null, lastTap=0;
      el.addEventListener("pointerdown", e=>{ if(mode!=="deco") return; e.preventDefault(); el.setPointerCapture(e.pointerId); const r=scene.getBoundingClientRect(); st={x:e.clientX,y:e.clientY,ox:d.x,oy:d.y,w:r.width,h:r.height}; });
      el.addEventListener("pointermove", e=>{ if(!st) return; d.x=Math.min(95,Math.max(5, st.ox+(e.clientX-st.x)/st.w*100)); d.y=Math.min(92,Math.max(20, st.oy+(e.clientY-st.y)/st.h*100)); el.style.left=d.x+"%"; el.style.top=d.y+"%"; });
      el.addEventListener("pointerup", ()=>{ if(!st) return; st=null; World.save(); const now=Date.now(); if(now-lastTap<400){ G.deco.splice(+el.dataset.i,1); World.save(); drawDeco(); } lastTap=now; });
    });
  }
  $(".wg2-decobar",v).innerHTML = Object.entries(DECO).map(([k,d])=>`<button class="wtile" data-dk="${k}"><span class="art">${d.a()}</span><small>${d.n}</small></button>`).join("");
  $$("[data-dk]",v).forEach(b=>b.onclick=()=>{ if(G.deco.length>=14){ tell("الحديقة امتلت زينة. شيلي وحدة بالضغط عليها مرتين."); return; } G.deco.push({k:b.dataset.dk, x:20+Math.random()*60, y:30+Math.random()*20}); World.save(); World.sfx("pop"); drawDeco(); });

  /* ---------- نبتة اليوم ---------- */
  function daily(){
    const d=G.daily, today=World.today(), done=d.day===today;
    const el=$(".wg2-daily",v); el.innerHTML = `<button class="wg2-dp ${done?"done":""}" aria-label="نبتة اليوم">${WART.plant("pink", Math.min(3, 1+Math.floor((d.w||0)/2)))}<small>نبتة اليوم${done?" ✓":""}</small></button>`;
    $("button",el).onclick=()=>{ if(done){ tell(`نبتة اليوم شربت. سقيتيها ${d.w||0} أيام لحد هسه.`); return; } d.day=today; d.w=(d.w||0)+1; World.save(); World.sfx("splash"); World.give("leaf",1); World.event("water"); tell("سقيتي نبتة اليوم. شكراً إلج، عطتنا ورقة."); daily(); };
  }
  // السلحفاة شيلة تزور الحديقة مرة باليوم وتجيب شي
  const tt=World.friendEl("turtle","wg2-tt", ()=>{ const k="turtle_"+World.today(); if(!S.flags[k]){ S.flags[k]=1; World.save(); World.give(Math.random()<.5?"seed":"drop", 2); } });
  $(".wg2-turtle",v).appendChild(tt);

  drawPlots(); drawDeco(); daily(); setMode(G.plots.some(Boolean)?"water":"seed");
  if(first) tell("هلا بالحديقة! عندج 3 بذور. اختاري «ازرعي» وبعدين حوض فارغ.");
  return () => cs.stop();
});
