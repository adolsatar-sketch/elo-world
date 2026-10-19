/* =====================================================================
   حكاياتنا — المحرّك
   • viewTales(root, arg): المسار "tales" = المكتبة، "tales:s1c1" = فصل مباشر.
   • يقرأ الحكايات من HIKAYAT (season1.js) ويشغّل «الخطوات» (beats) بالترتيب.
   • الحفظ محلي فقط: Store("tales").
   ===================================================================== */
const TalesEngine = (() => {
  const ADOOL_SRC = "assets/ADOOL_OFFICIAL_CHARACTER.png";
  const DEF = {done:{}, choices:{}, items:{}, cp:{}, memory:"", pages:[], blankTitle:"", city:null, letter:"", opts:{music:true, sfx:true, vol:.6, subs:true}, unlockAll:false};
  let SV = null;
  const save = () => Store.set("tales", SV);
  function init(){
    if(SV) return;
    SV = Object.assign(JSON.parse(JSON.stringify(DEF)), Store.get("tales", {}));
    SV.opts = Object.assign({}, DEF.opts, SV.opts||{});
    TAudio.setOpts(SV.opts);
  }
  const wait = ms => new Promise(r=>setTimeout(r, ms));
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const lerp = (a,b,t) => a+(b-a)*t;
  const ease = t => t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;

  /* ---------- الأسماء والشخصيات ---------- */
  const NAMES = { elaf:()=>heroName(), adool:()=>HIKAYAT.names.adool, jm:()=>CONFIG.companionName, sumo:()=>CONFIG.guestName, narr:()=>"الراوي" };
  const CHARS = {
    elaf: {h:28, flip:true,  color:"#F3B6AE", html:()=>TRig.html("elaf")},
    adool:{h:31, flip:true,  color:"#B8D69C", html:()=>TRig.html("adool")},
    jm:   {h:13, flip:false, color:"#7FC2A0", html:()=>`<img src="${JM_SRC}" alt="" draggable="false" decoding="async">`},
    sumo: {h:14, flip:false, color:"#E7B2C6", html:()=>ART.sumo("idle")}
  };
  function fill(t, ctx){
    if(typeof t==="function") t = t(ctx||{});
    return String(t??"").replace(/\{E\}/g, NAMES.elaf()).replace(/\{A\}/g, NAMES.adool()).replace(/\{J\}/g, NAMES.jm()).replace(/\{S\}/g, NAMES.sumo()).replace(/\{SR\}/g, HIKAYAT.names.sumoRole);
  }

  /* ---------- الأقفال والتقدّم ---------- */
  const chapList = () => HIKAYAT.stories.flatMap(s => s.chapters.map(c => ({s, c})));
  const findChap = id => chapList().find(x => x.c.id===id);
  function chapUnlocked(id){ if(SV.unlockAll) return true; const L=chapList(); const i=L.findIndex(x=>x.c.id===id); return i===0 || (i>0 && !!SV.done[L[i-1].c.id]); }
  const storyUnlocked = s => chapUnlocked(s.chapters[0].id);
  const storyDone = s => s.chapters.every(c => SV.done[c.id]);
  const seasonDone = () => HIKAYAT.stories.every(storyDone);

  /* =====================================================================
     المكتبة (رف الكتب السحري)
     ===================================================================== */
  let opened = false;
  function viewLibrary(root){
    const books = HIKAYAT.stories.map((s,i) => {
      const un = storyUnlocked(s), dn = s.chapters.filter(c=>SV.done[c.id]).length;
      const city = s.id==="s3" && SV.city ? `style="--c1:${SV.city.c1};--c2:${SV.city.c2}"` : `style="--c1:${s.cover[0]};--c2:${s.cover[1]}"`;
      return `<button class="tl-book ${un?"":"locked"} ${storyDone(s)?"done":""}" data-s="${s.id}" ${city} aria-label="${s.title}${un?"":" — مقفولة"}">
        <span class="tl-b3"><span class="tl-cover"><svg viewBox="0 0 120 130" class="tl-emb">${TART.cover(s.id)}</svg><b>${s.title}</b><i class="tl-num">${i+1}</i></span><span class="tl-spine"></span><span class="tl-edge"></span></span>
        <span class="tl-prog">${s.chapters.map(c=>`<i class="${SV.done[c.id]?"on":""}"></i>`).join("")}</span>
        ${un?"":`<span class="tl-lock">${IC.lock}</span>`}</button>`;
    }).join("");
    const blank = seasonDone() ? `<button class="tl-book blank" data-blank style="--c1:#3B3466;--c2:#5A4C9A" aria-label="كتاب جديد فارغ"><span class="tl-b3"><span class="tl-cover"><svg viewBox="0 0 120 130" class="tl-emb">${TART.cover("blank")}</svg><b>${esc(SV.blankTitle || "حكاية جاية…")}</b></span><span class="tl-spine"></span><span class="tl-edge"></span></span></button>` : "";
    const v = h(`<section class="view tl tl-lib">
      <div class="tl-sky"></div><div class="tl-stars" aria-hidden="true">${Array.from({length:40},()=>`<i style="left:${Math.random()*100}%;top:${Math.random()*60}%;animation-delay:${-Math.random()*4}s"></i>`).join("")}</div>
      <div class="tl-curtain l"></div><div class="tl-curtain r"></div><div class="tl-valance"></div>
      <header class="tl-head">
        <button class="tl-ib" data-home aria-label="رجوع للغابة">${IC.back}<span>الغابة</span></button>
        <h1>حكاياتنا</h1>
        <button class="tl-ib" data-settings aria-label="إعدادات الحكايات">${IC.gear}</button>
      </header>
      <p class="tl-tag">مسلسل مغامرات صغير، بطله ${esc(NAMES.adool())} و${esc(NAMES.elaf())}. اختاري كتاب.</p>
      <div class="tl-shelfwrap"><div class="tl-shelf">${books}${blank}</div><div class="tl-plank"></div></div>
      <div class="tl-extras">
        ${SV.memory ? `<button class="tl-x" data-memory>${TART.symbol("clock","#F6E3A1")}<span>ساعة البيت: «${esc(SV.memory)}»</span></button>` : ""}
        ${SV.pages.length ? `<button class="tl-x" data-pages>${TART.symbol("page","#FBF6E8")}<span>صفحاتنا (${SV.pages.length})</span></button>` : ""}
        ${SV.done.s4c3 ? `<span class="tl-x cloudfriend" title="الغيمة الصغيرة رجعت تزوركم">${TART.littleCloud("happy")}</span>` : ""}
      </div>
      <div class="tl-cast"><div class="tl-c e" data-w="elaf">${CHARS.elaf.html()}</div><div class="tl-c a" data-w="adool">${CHARS.adool.html()}</div></div>
      ${!opened && motionOK() ? `<div class="tl-opener" aria-hidden="true"><div class="tl-ob"><div class="tl-op back"></div>${[0,1,2].map(i=>`<div class="tl-op page p${i}"></div>`).join("")}<div class="tl-op cover"><b>حكاياتنا</b></div></div></div>` : ""}
    </section>`);
    root.appendChild(v);
    fillIcons(v);
    if(!opened && motionOK()){ const op=$(".tl-opener",v); setTimeout(()=>TAudio.sfx("page"),700); const done=()=>{ op.classList.add("gone"); setTimeout(()=>op.remove(),600); }; setTimeout(done, 2600); op.onclick=done; }
    opened = true;
    $("[data-home]",v).onclick = () => go("map");
    $("[data-settings]",v).onclick = () => openSettings(v);
    $$(".tl-book[data-s]",v).forEach(b => b.onclick = () => {
      TAudio.unlock(); const s = HIKAYAT.stories.find(x=>x.id===b.dataset.s);
      if(!storyUnlocked(s)){ TAudio.sfx("nope"); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); toast(`هالكتاب ينفتح بعد ما تخلصين «${HIKAYAT.stories[HIKAYAT.stories.indexOf(s)-1].title}»`, "lock"); return; }
      openBook(v, s, b);
    });
    const bl=$("[data-blank]",v); if(bl) bl.onclick = () => { const md=modal(`<h3>كتاب جديد فارغ</h3><p>هذا الكتاب ينتظر حكايات جاية. سمّيه:</p><input class="tl-input" maxlength="40" value="${esc(SV.blankTitle)}" placeholder="حكاية جاية…"><div class="row"><button class="btn" data-ok>احفظي العنوان</button></div>`); $("[data-ok]",md.el).onclick=()=>{ SV.blankTitle=$(".tl-input",md.el).value.trim(); save(); md.close(); go("tales",false); }; };
    const mm=$("[data-memory]",v); if(mm) mm.onclick = () => modal(`<h3>ساعة البيت الصغيرة</h3><p style="font-size:1.15rem">«${esc(SV.memory)}»</p><p class="d-note">انحفظت من حكاية «قطار الساعة اللي نسى الوقت». تتغير إذا عدتي الفصل الثالث.</p>`);
    const pg=$("[data-pages]",v); if(pg) pg.onclick = () => openPages();
    const cast=$(".tl-cast",v); const cc = {};
    $$(".tl-c",v).forEach(el => { const c={who:el.dataset.w, x:0, y:0, face:1, anim:"idle"}; TRig.attach(c, el); cc[c.who]=c; });
    cast.onclick = e => { const el=e.target.closest(".tl-c"); if(el){ const c=cc[el.dataset.w]; TRig.wave(c, 1.4); TAudio.unlock(); TAudio.sfx("soft"); } };
    let lraf=0, lt=performance.now(); const loop = now => { const dt=Math.min(.05,(now-lt)/1000); lt=now; Object.values(cc).forEach(c=>TRig.update(c, dt, !motionOK())); lraf=requestAnimationFrame(loop); }; lraf=requestAnimationFrame(loop);
    setTimeout(()=>{ if(cc.adool) TRig.greet(cc.adool); }, 1600);
    TAudio.stop();
    return () => cancelAnimationFrame(lraf);
  }

  function openPages(){
    const md = modal(`<h3>صفحاتنا بالمكتبة</h3><div class="tl-pages">${SV.pages.map((p,i)=>`<article class="tl-page"><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p><small>${esc(p.date||"")}</small><button class="btn ghost small" data-del="${i}">احذفي</button></article>`).join("")}</div><div class="row"><button class="btn small" data-exp>صدّري الصفحات</button></div><p class="d-note">محفوظة على هذا الجهاز فقط.</p>`, {wide:true});
    $$("[data-del]",md.el).forEach(b=>b.onclick=()=>confirmBox("تحذفين هالصفحة؟","احذفي",()=>{ SV.pages.splice(+b.dataset.del,1); save(); md.close(); go("tales",false); }));
    $("[data-exp]",md.el).onclick=()=>{ const txt=SV.pages.map(p=>`# ${p.title}\n${p.text}\n${p.date||""}`).join("\n\n"); offerDownload("hikayatna-pages.txt", new Blob([txt],{type:"text/plain;charset=utf-8"}), ()=>modal(`<pre style="white-space:pre-wrap">${esc(txt)}</pre>`)); };
  }

  /* ---------- فتح كتاب: صفحتين + الفصول ---------- */
  function openBook(v, s, btn){
    TAudio.sfx("page");
    const r = btn.getBoundingClientRect();
    const ov = h(`<div class="tl-reader" role="dialog" aria-modal="true" aria-label="${s.title}" style="--c1:${s.cover[0]};--c2:${s.cover[1]};--fx:${r.left+r.width/2}px;--fy:${r.top+r.height/2}px">
      <div class="tl-rb">
        <div class="tl-pg right"><div class="tl-vig" style="background:${s.vignette}"><svg viewBox="0 0 120 130">${TART.cover(s.id)}</svg></div><h2>${s.title}</h2><p>${s.blurb}</p></div>
        <div class="tl-pg left"><h3>الفصول</h3><ol class="tl-chaps">${s.chapters.map((c,i)=>{ const un=chapUnlocked(c.id), dn=SV.done[c.id], cp=SV.cp[c.id];
          return `<li><button class="tl-ch ${un?"":"locked"} ${dn?"done":""}" data-c="${c.id}" ${un?"":"disabled"}><span class="n">${i+1}</span><span class="t"><b>${c.title}</b><small>${dn?"خلصتيه — تقدرين تعيدينه":cp?"وقفتي بنصّه — كمّلي":un?c.teaser:"ينفتح بعد الفصل اللي قبله"}</small></span>${un?"":`<span class="lk">${IC.lock}</span>`}</button></li>`; }).join("")}</ol>
          <div class="tl-rrow"><button class="tl-link" data-reset>ابدئي الحكاية من جديد</button></div></div>
      </div>
      <button class="tl-ib tl-close" aria-label="إغلاق">${IC.close}</button></div>`);
    v.appendChild(ov); fillIcons(ov);
    requestAnimationFrame(()=>ov.classList.add("open"));
    const close = () => { ov.classList.remove("open"); ov.classList.add("closing"); setTimeout(()=>ov.remove(), motionOK()?450:0); document.removeEventListener("keydown", k); };
    const k = e => { if(e.key==="Escape") close(); };
    document.addEventListener("keydown", k);
    $(".tl-close",ov).onclick = close;
    ov.addEventListener("click", e => { if(e.target===ov) close(); });
    $$(".tl-ch",ov).forEach(b => b.onclick = () => {
      const id=b.dataset.c, cp=SV.cp[id];
      const enter = from => { TAudio.sfx("page"); ov.classList.add("dive"); setTimeout(()=>go("tales:"+id+(from?"@"+from:"")), motionOK()?820:0); };
      if(cp && !SV.done[id]){ const md=modal(`<h3>${c(id).title}</h3><p>تكملين من وين ما وقفتي، لو تبدين الفصل من أوله؟</p><div class="row"><button class="btn honey" data-go>كمّلي</button><button class="btn ghost" data-new>من البداية</button></div>`); $("[data-go]",md.el).onclick=()=>{md.close(); enter("cp");}; $("[data-new]",md.el).onclick=()=>{md.close(); delete SV.cp[id]; save(); enter("");}; }
      else enter("");
    });
    $("[data-reset]",ov).onclick = () => confirmBox(`نرجّع «${s.title}» من البداية؟ تنمسح اختياراتها وتقدّمها.`, "رجّعيها", () => {
      s.chapters.forEach(ch => { delete SV.done[ch.id]; delete SV.cp[ch.id]; Object.keys(SV.choices).forEach(k=>{ if(k.startsWith(ch.id+".")) delete SV.choices[k]; }); });
      (s.resetItems||[]).forEach(k=>delete SV.items[k]); if(s.id==="s3") SV.city=null; if(s.id==="s2") SV.memory="";
      save(); close(); go("tales", false);
    });
    const c = id => s.chapters.find(x=>x.id===id);
  }

  /* ---------- إعدادات الحكايات ---------- */
  function openSettings(){
    const optsSel = (arr, val) => arr.map(([v,l])=>`<option value="${v}" ${v===val?"selected":""}>${l}</option>`).join("");
    const stories = [["all","كل الحكايات"], ...HIKAYAT.stories.map(s=>[s.id, s.title])];
    const chaps = [["all","كل الفصول"], ...chapList().map(x=>[x.c.id, x.s.title+" — "+x.c.title])];
    const moods = [["all","كل المقاطع"],["intro","المقدمة"],["explore","الاستكشاف"],["emotion","اللحظة العاطفية/الانتصار"]];
    const md = modal(`<div class="tl-set"><h2>إعدادات الحكايات</h2>
      <section><h3>الصوت</h3>
        <label class="tl-sw"><input type="checkbox" data-o="music" ${SV.opts.music?"checked":""}> الموسيقى</label>
        <label class="tl-sw"><input type="checkbox" data-o="sfx" ${SV.opts.sfx?"checked":""}> المؤثرات</label>
        <label class="tl-sl">مستوى الصوت <input type="range" min="0" max="1" step=".05" value="${SV.opts.vol}" data-vol></label>
        <label class="tl-sw"><input type="checkbox" data-o="subs" ${SV.opts.subs?"checked":""}> نص الحوار (ترجمة) أسفل المشهد</label></section>
      <section><h3>أغانيكم الخاصة</h3>
        <p class="d-note">أضيفوا ملف صوت تملكون حق استخدامه، واختاروا وين يشتغل. الملف ينحفظ على هذا الجهاز فقط وما ينرفع لأي مكان.</p>
        <div class="tl-add"><input type="file" accept="audio/*" data-file>
          <select data-story>${optsSel(stories,"all")}</select><select data-chap>${optsSel(chaps,"all")}</select><select data-mood>${optsSel(moods,"all")}</select>
          <button class="btn small" data-add>أضيفي الأغنية</button></div>
        <ul class="tl-songs" data-list></ul></section>
      <section><h3>التقدّم</h3>
        <label class="tl-sw"><input type="checkbox" data-unlock ${SV.unlockAll?"checked":""}> افتحي كل الحكايات والفصول</label>
        <button class="btn ghost small" data-wipe>امسحي تقدّم الحكايات كله</button></section></div>`, {wide:true});
    const list = $("[data-list]", md.el);
    const lbl = (arr, v) => (arr.find(x=>x[0]===v)||["",v])[1];
    const drawList = () => { const ss=TAudio.songs(); list.innerHTML = ss.length ? ss.map(r=>`<li><b>${esc(r.name)}</b><small>${esc(lbl(stories,r.story))} · ${esc(lbl(chaps,r.chapter))} · ${esc(lbl(moods,r.mood))}</small><button class="btn ghost small" data-pv="${r.id}">اسمعي</button><button class="btn ghost small" data-rm="${r.id}">احذفي</button></li>`).join("") : `<li class="d-note">ماكو أغاني مضافة. الحكايات تستخدم موسيقاها الأصلية المولّدة.</li>`;
      $$("[data-rm]",list).forEach(b=>b.onclick=()=>TAudio.delSong(b.dataset.rm).then(drawList));
      let pv=null; $$("[data-pv]",list).forEach(b=>b.onclick=()=>{ const r=TAudio.songs().find(x=>x.id===b.dataset.pv); if(pv){ pv.pause(); pv=null; return; } pv=new Audio(TAudio.previewUrl(r)); pv.volume=SV.opts.vol; pv.play().catch(()=>{}); setTimeout(()=>{ pv&&pv.pause(); },12000); }); };
    drawList(); setTimeout(drawList, 400);
    $$("[data-o]",md.el).forEach(c=>c.onchange=()=>{ SV.opts[c.dataset.o]=c.checked; save(); TAudio.setOpts(SV.opts); });
    $("[data-vol]",md.el).oninput = e => { SV.opts.vol=+e.target.value; save(); TAudio.setOpts(SV.opts); };
    $("[data-add]",md.el).onclick = () => { const f=$("[data-file]",md.el).files[0]; if(!f){ toast("اختاري ملف صوت أول","sound"); return; } if(!/^audio\//.test(f.type)){ toast("هذا مو ملف صوت","close"); return; }
      TAudio.addSong({id:"s"+Date.now(), name:f.name, blob:f, story:$("[data-story]",md.el).value, chapter:$("[data-chap]",md.el).value, mood:$("[data-mood]",md.el).value}).then(()=>{ toast("انضافت الأغنية","check"); $("[data-file]",md.el).value=""; drawList(); }).catch(()=>toast("ما قدرت أحفظ الملف على هذا المتصفح","close")); };
    $("[data-unlock]",md.el).onchange = e => { SV.unlockAll=e.target.checked; save(); };
    $("[data-wipe]",md.el).onclick = () => confirmBox("تمسحين كل تقدّم الحكايات واختياراتها وصفحاتها؟","امسحي",()=>{ const o=SV.opts; SV=Object.assign(JSON.parse(JSON.stringify(DEF)),{opts:o}); save(); md.close(); go("tales",false); });
    const old = md.close; md.close = () => { old(); go("tales", false); };
  }

  /* =====================================================================
     مشغّل الفصل
     ===================================================================== */
  function viewPlayer(root, chapId, from){
    const fc = findChap(chapId);
    if(!fc || !chapUnlocked(chapId)){ go("tales", false); return; }
    const story = fc.s, chap = fc.c;
    const ctx = { story, chap, flags:{}, inv:{}, choices:SV.choices, items:SV.items, SV, get:k=>SV.choices[chap.id+"."+k] ?? SV.choices[k], aborted:false };
    const v = h(`<section class="view tl tl-play tp-enter" style="--sky:${story.sky}">
      <div class="tp-stage">
        <div class="tp-sky"></div>
        <div class="tp-world"><div class="tp-layer far"></div><div class="tp-layer mid"></div><div class="tp-layer main"></div><div class="tp-layer fore"></div></div>
        <div class="tp-fx" aria-hidden="true"></div><div class="tp-gust" aria-hidden="true"></div><div class="tp-vig" aria-hidden="true"></div>
      </div>
      <div class="tp-hud">
        <button class="tp-b" data-h="back" aria-label="رجوع للمكتبة">${IC.back}</button>
        <div class="tp-progress" aria-label="التقدّم"><i></i></div>
        <div class="tp-inv"></div>
        <button class="tp-b" data-h="swap" aria-label="بدّلي الشخصية (${esc(NAMES.elaf())} / ${esc(NAMES.adool())})" title="بدّلي الشخصية" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14l-4-4M20 16H6l4 4"/></svg></button>
        <button class="tp-b" data-h="subs" aria-pressed="${SV.opts.subs}" aria-label="نص الحوار"><span class="cc">نص</span></button>
        <button class="tp-b" data-h="sound" aria-label="الصوت">${IC.sound}</button>
        <button class="tp-b" data-h="skip" aria-label="تخطّي المشهد"><span class="cc">تخطّي</span></button>
        <button class="tp-b" data-h="pause" aria-label="إيقاف مؤقت">${IC.pause}</button>
      </div>
      <div class="tp-dialog" hidden><span class="tp-name"></span><p class="tp-text"></p><span class="tp-adv">▼</span></div>
      <div class="tp-narr" hidden><p></p><button class="tl-btn" hidden></button></div>
      <div class="tp-toast" hidden></div>
      <div class="tp-pad" hidden>
        <div class="tp-dir"><button data-k="right" aria-label="يمين">${arrow(0)}</button><button data-k="left" aria-label="يسار">${arrow(180)}</button></div>
        <div class="tp-act"><button data-k="up" class="vert" aria-label="فوق">${arrow(-90)}</button><button data-k="down" class="vert" aria-label="جوّا">${arrow(90)}</button><button data-k="jump" class="jump" aria-label="قفزة">${arrow(-90)}<small>قفزة</small></button><button data-k="act" class="actb" aria-label="تفاعل">${TART.symbol("star","#3D3A2E")}<small>تفاعل</small></button></div>
      </div>
      <div class="tp-over" hidden></div>
      <div class="tp-wipe" aria-hidden="true"></div>
    </section>`);
    root.appendChild(v); fillIcons(v);
    const stage=$(".tp-stage",v), world=$(".tp-world",v), L={far:$(".tp-layer.far",v), mid:$(".tp-layer.mid",v), main:$(".tp-layer.main",v), fore:$(".tp-layer.fore",v)};
    const dlg=$(".tp-dialog",v), narr=$(".tp-narr",v), over=$(".tp-over",v), pad=$(".tp-pad",v), fxL=$(".tp-fx",v), gustEl=$(".tp-gust",v), invEl=$(".tp-inv",v), toastEl=$(".tp-toast",v);
    setTimeout(()=>v.classList.remove("tp-enter"), 1200);

    /* ----- قياس ----- */
    let U=8, VW=100;
    function measure(){ const r=stage.getBoundingClientRect(); U = Math.max(2.5, Math.min(r.height/100, r.width/70)); VW = r.width/U; v.style.setProperty("--u", U+"px"); }
    measure();
    const ro = new ResizeObserver(()=>{ measure(); if(sc) layoutParallax(); }); ro.observe(stage);

    /* ----- حالة ----- */
    let sc=null, cam=0, camTarget=null, mode="idle", paused=false, raf=0, last=performance.now(), tNow=0;
    const chars = {};
    let P=null, playerWho="elaf", followers=[], trail=[], hazards=[], objs=[], plats=[], items=[], zones=[], guide=null, swirls=[], reflections=[];
    let skipFn=null, exploreSkip=null, camHold=false, advanceFn=null, gustT=0, gustOn=false, gustWarn=false, untilFlag=null, exploreRes=null, interacting=false, autoTarget=null, idleT=0, hintsShown=new Set();
    const keys = new Set();

    /* ----- شخصيات ----- */
    function mkChar(who){
      const C=CHARS[who];
      const el = h(`<div class="tc tc-${who}" style="--h:${C.h}"><div class="tc-shadow"></div><div class="tc-flip"><div class="tc-anim">${C.html()}</div></div><div class="tc-boat">${TART.paperBoat(who==="elaf"?"#FBE3E0":who==="adool"?"#E6F2DA":"#FBF6E8")}</div><div class="tc-mark">!</div><div class="tc-bub" hidden></div></div>`);
      L.main.appendChild(el);
      const c = {who, el, x:0, y:86, face:1, vis:true, anim:"idle", h:C.h};
      if(TRig.has(who)){ TRig.attach(c, el); el.classList.add("rigged"); }
      el.addEventListener("click", e => { if(mode==="explore" && who!==playerWho){ e.stopPropagation(); emote(who, "happy"); TAudio.sfx("soft"); bark(who, pick(HIKAYAT.barks[who]||["هلا!"]), 1800); } });
      chars[who]=c; return c;
    }
    function placeChar(c){ c.el.style.transform = `translate(${c.x}em, ${c.y}em)`; c.el.classList.toggle("fl", CHARS[c.who].flip && c.face<0); }
    function setAnim(c, a){ if(c.anim===a) return; c.el.classList.remove("a-"+c.anim); c.anim=a; c.el.classList.add("a-"+a); }
    function emote(who, e, ms=1300){ const c=chars[who]; if(!c) return; if(c.rig && e==="wave"){ TRig.wave(c, ms/1000); return; } c.el.classList.remove("e-"+e); void c.el.offsetWidth; c.el.classList.add("e-"+e); setTimeout(()=>c.el.classList.remove("e-"+e), ms); }
    function bark(who, text, ms=2400){ const c=chars[who]; if(!c||!c.vis) return; const b=$(".tc-bub",c.el); b.textContent=fill(text,ctx); b.hidden=false; clearTimeout(b._t); b._t=setTimeout(()=>{ b.hidden=true; }, ms); }

    /* ----- بناء المشهد ----- */
    function deco(d, layer){
      const art = typeof d.a==="function" ? d.a(ctx) : (TART[d.a] ? TART[d.a](...(d.args||[])) : "");
      const el = h(`<div class="tp-d ${d.cls||""} ${d.tl?"tl-anchor":""}" style="left:${d.x}em;top:${d.y}em;width:${d.w}em;${d.h?`height:${d.h}em;`:""}${d.o!=null?`opacity:${d.o};`:""}${d.z?`z-index:${d.z};`:""}">${art}</div>`);
      if(d.id) el.dataset.id=d.id;
      (L[layer]||L.mid).appendChild(el); return el;
    }
    function surfaceAt(x, preferY){
      const c=[]; if(!sc.noGround && sc.groundSegs.some(([a,b])=>x>=a&&x<=b)) c.push(sc.ground);
      plats.forEach(p=>{ if(x>=p.cx-.5 && x<=p.cx+p.w+.5) c.push(p.cy); });
      if(!c.length) return null;
      if(preferY==null) return Math.max(...c);
      const below=c.filter(y=>y>=preferY-1.5); return below.length ? Math.min(...below) : null;
    }
    function loadScene(b){
      const def = typeof b.scene==="string" ? chap.scenes[b.scene] : b.scene;
      sc = Object.assign({len:200, ground:86, mode:"walk", deco:[]}, def);
      if(def.groundSegs) sc.noGround = false;
      sc.groundSegs = sc.groundSegs || (sc.noGround ? [] : [[0, sc.len]]);
      if(sc.holes){ let segs=[[0,sc.len]]; sc.holes.forEach(([a,b2])=>{ segs=segs.flatMap(([s,e])=> b2<=s||a>=e ? [[s,e]] : [[s,a],[b2,e]].filter(([p,q])=>q-p>.5)); }); sc.groundSegs=segs; }
      Object.values(L).forEach(l=>l.innerHTML=""); Object.keys(chars).forEach(k=>delete chars[k]); fxL.innerHTML="";
      promptEl=null; near=null; camHold=false;
      objs=[]; plats=[]; items=[]; zones=(sc.zones||[]).map(z=>({...z})); guide=null; swirls=(sc.swirls||[]).map(s=>({...s})); reflections=[];
      stage.style.setProperty("--sky", sc.sky || story.sky);
      v.style.setProperty("--sat", sc.sat!=null ? sc.sat : 1);
      v.dataset.scene = b.scene; v.dataset.mode = sc.mode;
      const T = HIKAYAT.themes[sc.theme] ? HIKAYAT.themes[sc.theme](sc, VW) : {far:[],mid:[],fore:[]};
      (T.far||[]).forEach(d=>deco(d,"far")); (T.mid||[]).forEach(d=>deco(d,"mid")); (T.fore||[]).forEach(d=>deco(d,"fore")); (T.main||[]).forEach(d=>deco(d,"main"));
      (sc.deco||[]).forEach(d=>deco(d, d.layer||"main"));
      if(sc.water!=null) L.main.appendChild(h(`<div class="tp-water ${sc.waterCls||""}" style="top:${sc.water}em;width:${sc.len+40}em"></div>`));
      sc.groundSegs.forEach(([a,b2]) => L.main.appendChild(h(`<div class="tp-ground g-${sc.gk||"earth"}" style="left:${a}em;width:${b2-a}em;top:${sc.ground}em"></div>`)));
      (sc.plats||[]).forEach(p => { const el=h(`<div class="tpl k-${p.k||"wood"}" style="left:0;top:0;width:${p.w}em">${TART.plat(p.k||"wood", p.w)}</div>`); L.main.appendChild(el); plats.push({...p, el, cx:p.x, cy:p.y, px:p.x, py:p.y}); });
      (sc.hints||[]).forEach(([x,y]) => L.main.appendChild(h(`<i class="tp-hint" style="left:${x}em;top:${y}em"></i>`)));
      (sc.objs||[]).forEach(o => addObj(o));
      (sc.items||[]).forEach((it,i) => { if(it.once && SV.items[it.once]) return; const el=h(`<div class="ti" style="left:${it.x}em;top:${it.y}em">${TART.symbol(HIKAYAT.itemArt[it.k]||"star", HIKAYAT.itemColor[it.k]||"#FFE7AE")}</div>`); L.main.appendChild(el); items.push({...it, el, got:false}); });
      hazards=(sc.hazards||[]).map(z=>({...z, el:h(`<div class="tp-haz" style="left:${z.x}em;top:${z.y!=null?z.y:sc.ground}em">${TART.inkBlot()}</div>`)})); hazards.forEach(z=>L.main.appendChild(z.el));
      swirls.forEach(s => { s.el = h(`<div class="tp-swirl" style="left:${s.x}em;top:${sc.lanes[s.lane]}em">${TART.inkSwirl()}</div>`); L.main.appendChild(s.el); });
      if(sc.guide){ const g=sc.guide; guide={...g, el:h(`<div class="tp-guide" style="width:${g.w||6}em">${TART[g.a]?TART[g.a]():""}</div>`), x:g.x, y:g.y, idx:0}; L.main.appendChild(guide.el); placeGuide(); }
      // الشخصيات
      const cast = b.cast || {};
      Object.entries(cast).forEach(([who, pos]) => { const c=mkChar(who); c.x=pos[0]; c.y = pos[1]!=null ? pos[1] : (surfaceAt(pos[0]) ?? sc.ground); c.face = pos[2]||1; placeChar(c); setAnim(c,"idle"); });
      if(sc.reflect!=null) Object.values(chars).forEach(c => { const r=h(`<div class="tc-refl" style="--h:${c.h}">${CHARS[c.who].html()}</div>`); L.main.appendChild(r); reflections.push({c, el:r, hist:[]}); });
      playerWho = b.player || (cast.elaf ? "elaf" : Object.keys(cast)[0]);
      followers = b.follow || Object.keys(cast).filter(k=>k!==playerWho);
      cam = b.cam!=null ? (typeof b.cam==="function" ? b.cam(VW) : b.cam) : clamp((chars[playerWho]?chars[playerWho].x:0) - VW*.4, 0, Math.max(0, sc.len-VW));
      if(sc.amb && motionOK()) ambient(sc.amb);
      gustT = 0; gustOn=false; gustWarn=false;
      layoutParallax(); render();
      $(".tp-b[data-h=swap]",v).hidden = !(chars.elaf && chars.adool && sc.mode==="walk");
      if(b.music || sc.music) music(b.music||sc.music);
    }
    function addObj(o){
      if(o.when && !o.when(ctx)) return;
      const art = artOf(o);
      const el = h(`<button class="to ${o.cls||""} ${o.run?"act":""}" style="left:${o.x}em;top:${o.y!=null?o.y:sc.ground}em;width:${o.w}em" aria-label="${fill(o.label||o.name||"",ctx)}" ${o.hidden?"hidden":""} tabindex="-1">${art}${o.name?`<span class="to-name">${fill(o.name,ctx)}</span>`:""}</button>`);
      L.main.appendChild(el);
      const ob = {...o, el, y:o.y!=null?o.y:sc.ground, done:false};
      el.addEventListener("click", e => { e.stopPropagation(); if(mode==="explore" && !interacting && ob.run && !ob.done && !ob.hidden) goInteract(ob); });
      objs.push(ob); return ob;
    }
    function artOf(o){ return typeof o.a==="function" ? o.a(ctx) : (o.a && TART[o.a] ? TART[o.a](...(o.args||[])) : ""); }
    const getObj = id => objs.find(o=>o.id===id);
    function updObj(id, ch){ const o=getObj(id); if(!o) return; Object.assign(o, ch); if(ch.a||ch.args) o.el.innerHTML = artOf(o) + (o.name?`<span class="to-name">${fill(o.name,ctx)}</span>`:""); if("hidden" in ch) o.el.hidden=!!ch.hidden; if(ch.cls!=null){ o.el.className = `to ${ch.cls} ${o.run?"act":""}`; } if(ch.x!=null) o.el.style.left=ch.x+"em"; if(ch.y!=null) o.el.style.top=ch.y+"em"; }
    function placeGuide(){ if(guide) guide.el.style.transform=`translate(${guide.x}em, ${guide.y}em)`; }
    function ambient(kind){
      const n = {dust:22, leaves:12, stars:30, fireflies:14, paper:10, bubbles:12, rain:0, sparks:18}[kind]||14;
      let s=""; for(let i=0;i<n;i++) s+=`<i class="amb amb-${kind}" style="left:${Math.random()*100}%;top:${Math.random()*80}%;animation-delay:${-Math.random()*12}s;animation-duration:${8+Math.random()*10}s"></i>`;
      fxL.innerHTML = s;
    }
    function layoutParallax(){ const f={far:.25, mid:.55, main:1, fore:1.25}; Object.entries(L).forEach(([k,el])=>{ el.style.transform=`translate3d(${(-cam*f[k]*U).toFixed(1)}px,0,0)`; }); }

    /* ----- الصوت ----- */
    function music(m){ TAudio.play(story.id, chap.id, m, story.theme); }

    /* ----- الواجهة: حوار وراوي ----- */
    function showText(el, text){ el.textContent=""; const full=fill(text,ctx); if(!motionOK()){ el.textContent=full; return Promise.resolve(); } let i=0; return new Promise(r=>{ const tick=()=>{ i+=2; el.textContent=full.slice(0,i); if(i<full.length) el._t=setTimeout(tick, 22); else r(); }; tick(); el._done=()=>{ clearTimeout(el._t); el.textContent=full; r(); }; }); }
    function waitAdvance(){ return new Promise(r => { advanceFn = () => { advanceFn=null; r(); }; skipFn = () => { advanceFn=null; skipFn=null; r(); }; }); }
    async function say(b){
      const who=b.say, isChar=!!CHARS[who], npc = !isChar && who!=="narr" ? getObj(who) : null;
      const name = isChar||who==="narr" ? NAMES[who]() : (npc && npc.name ? fill(npc.name,ctx) : who);
      if(b.e && isChar) emote(who, b.e);
      if(b.look && isChar && chars[who]){ chars[who].face = b.look; placeChar(chars[who]); }
      const text = fill(b.t, ctx);
      const color = isChar ? CHARS[who].color : (npc && npc.color) || "#F6E3A1";
      dlg.style.setProperty("--nc", color);
      $(".tp-name",dlg).textContent = name;
      const c = isChar ? chars[who] : null;
      const subs = SV.opts.subs || !c;
      dlg.hidden = !subs; dlg.classList.toggle("narr", who==="narr");
      if(c){ const bb=$(".tc-bub",c.el); bb.hidden=false; bb.textContent = subs ? "…" : text; bb.classList.toggle("speaking", subs); }
      if(npc){ npc.el.classList.add("talking"); }
      const pm = mode; mode="talk";
      const p = subs ? showText($(".tp-text",dlg), text) : Promise.resolve();
      if(TAudio.unlocked && isChar) TAudio.sfx("soft");
      advanceFn = null;
      await new Promise(r => { const fin=()=>{ advanceFn=null; skipFn=null; r(); }; advanceFn = () => { const t=$(".tp-text",dlg); if(t._done && t.textContent.length < fill(text,ctx).length) { t._done(); return; } fin(); }; skipFn = fin; });
      if(c){ const bb=$(".tc-bub",c.el); bb.hidden=true; bb.classList.remove("speaking"); }
      if(npc) npc.el.classList.remove("talking");
      dlg.hidden = true; mode = pm==="talk" ? "idle" : pm;
    }
    async function cine(b){
      const pm = mode; mode="cine"; v.classList.add("cine"); camHold=true;
      if(b.music) music(b.music);
      if(b.during) act({act:b.during});
      const pan = b.pan ? tweenCam(b.pan[0], b.pan[1], b.dur||4000) : null;
      if(b.narr){ narr.hidden=false; narr.classList.remove("in"); void narr.offsetWidth; narr.classList.add("in"); await showText($("p",narr), b.narr); }
      const btn=$(".tl-btn",narr);
      if(b.btn){ btn.hidden=false; btn.textContent=fill(b.btn,ctx); await new Promise(r=>{ btn.onclick=()=>{ TAudio.unlock(); music(b.musicAfter||"explore"); skipFn=null; r(); }; skipFn=()=>{ skipFn=null; TAudio.unlock(); r(); }; }); btn.hidden=true; }
      else if(b.narr) await waitAdvance();
      else if(pan) await new Promise(r=>{ skipFn=()=>{ skipFn=null; camTween && camTween(performance.now()+1e9); r(); }; pan.then(()=>{ skipFn=null; r(); }); });
      narr.hidden=true; v.classList.remove("cine"); mode = pm==="cine" ? "idle" : pm;
    }
    let camTween=null;
    function tweenCam(a, bx, dur){ camHold=true; return new Promise(r => { const t0=performance.now(); const from=a==null?cam:a; camTween = now => { const t=Math.max(0,Math.min(1,(now-t0)/dur)); cam = lerp(from, bx, motionOK()?ease(t):1); if(t>=1){ camTween=null; r(); } }; }); }

    /* ----- حركات مبرمجة ----- */
    function moveChar(c, x, {run=false, speed}={}){
      return new Promise(r => {
        const sp = speed || (run?34:18); c.face = x>=c.x?1:-1; setAnim(c, run?"run":"walk"); const x0=c.x, dist=Math.abs(x-x0), dur=Math.max(150, dist/sp*1000), t0=performance.now();
        const step = now => { if(ctx.aborted) return r(); const t=Math.max(0,Math.min(1,(now-t0)/dur)); c.x = lerp(x0,x,t); const s=surfaceAt(c.x, c.y); if(s!=null) c.y = s; placeChar(c); if(t<1 && !c._skip) requestAnimationFrame(step); else { c._skip=false; c.x=x; const s2=surfaceAt(x,c.y); if(s2!=null) c.y=s2; placeChar(c); setAnim(c,"idle"); r(); } };
        requestAnimationFrame(step);
      });
    }
    function hopChar(c, x, y, dur=520){ return new Promise(r0 => { if(c.rig){ TRig.crouch(c,.12); setTimeout(()=>go2(), motionOK()?110:0); } else go2(); function go2(){ new Promise(r => { const x0=c.x, y0=c.y, t0=performance.now(); c.face = x>=x0?1:-1; setAnim(c,"jump"); TAudio.sfx("jump"); const step = now => { const t=Math.max(0,Math.min(1,(now-t0)/dur)); c.x=lerp(x0,x,t); c.y=lerp(y0,y,t)-Math.sin(t*Math.PI)*10; placeChar(c); if(t<1) requestAnimationFrame(step); else { setAnim(c,"idle"); TAudio.sfx("land"); r(); } }; requestAnimationFrame(step); }).then(r0); } }); }
    function moveGuide(path, dur){ return new Promise(r => { if(!guide) return r(); const pts=[[guide.x,guide.y],...path]; const t0=performance.now(); const seg=pts.length-1; const step=now=>{ const t=Math.max(0,Math.min(1,(now-t0)/dur)), f=t*seg, i=Math.min(seg-1,Math.floor(f)), k=f-i; guide.x=lerp(pts[i][0],pts[i+1][0],k); guide.y=lerp(pts[i][1],pts[i+1][1],k)+Math.sin(now/200)*.6; placeGuide(); if(t<1) requestAnimationFrame(step); else r(); }; requestAnimationFrame(step); }); }
    async function act(b){
      mode = mode==="explore" ? "explore" : "busy";
      const runOne = async a => {
        const [who, verb, ...args] = a;
        if(who==="wait") return wait(verb);
        if(who==="cam") return tweenCam(null, verb, args[0]||1200);
        if(who==="camfree"){ camHold=false; return; }
        if(who==="guide") return verb==="hide" ? (guide && (guide.el.hidden=true)) : verb==="show" ? (guide && (guide.el.hidden=false)) : moveGuide(verb, args[0]||1500);
        if(who==="obj") return updObj(verb, args[0]);
        if(who==="sfx") return TAudio.sfx(verb);
        if(who==="fx") return doFx(verb, args[0]);
        const c = chars[who]; if(!c) return;
        if(verb==="to") return moveChar(c, args[0], args[1]||{});
        if(verb==="hop") return hopChar(c, args[0], args[1]!=null?args[1]:(surfaceAt(args[0])??c.y), args[2]);
        if(verb==="place"){ c.x=args[0]; if(args[1]!=null) c.y=args[1]; else { const s=surfaceAt(c.x); if(s!=null) c.y=s; } placeChar(c); return; }
        if(verb==="face"){ c.face=args[0]; placeChar(c); return; }
        if(verb==="hide"){ c.vis=false; c.el.hidden=true; return; }
        if(verb==="show"){ c.vis=true; c.el.hidden=false; return; }
        if(verb==="anim"){ setAnim(c, args[0]); return; }
        if(verb==="bark"){ bark(who, args[0], args[1]||2400); return; }
        emote(who, verb, args[0]||1300); return wait(args[0]||600);
      };
      let skipped=false; const prevSkip=skipFn;
      skipFn = () => { skipped=true; Object.values(chars).forEach(c=>c._skip=true); if(camTween){ camTween(performance.now()+1e6); } };
      await Promise.all(b.act.map(runOne));
      skipFn = prevSkip;
      if(mode==="busy") mode="idle";
    }

    /* ----- مؤثرات المشهد ----- */
    async function doFx(name, arg){
      const f = HIKAYAT.fx[name];
      if(f) return f({v, stage, L, chars, getObj, updObj, deco, ctx, TAudio, wait, emote, bark, motionOK, sc, plats, SV, camX:cam, VW, setSat:s=>v.style.setProperty("--sat",s), toastIn});
    }
    function toastIn(t, ms=2200){ toastEl.textContent=fill(t,ctx); toastEl.hidden=false; toastEl.classList.remove("in"); void toastEl.offsetWidth; toastEl.classList.add("in"); clearTimeout(toastEl._t); toastEl._t=setTimeout(()=>toastEl.hidden=true, ms); }

    /* ----- الاستكشاف (لعب حر) ----- */
    function startPlayer(){
      const c=chars[playerWho]; P = {c, x:c.x, y:c.y, vx:0, vy:0, ground:true, plat:null, hold:0, lane:sc.lanes?sc.lanes.indexOf(sc.lanes.reduce((a,b)=>Math.abs(b-c.y)<Math.abs(a-c.y)?b:a)):0, safe:[c.x,c.y]};
      if(sc.mode==="boat"){ P.lane=Math.max(0,P.lane); P.y=sc.lanes[P.lane]; }
      buildTrail();
      camHold=false;
      Object.values(chars).forEach(c=>c.el.classList.toggle("boat", sc.mode==="boat"));
      Object.values(chars).forEach(c=>c.el.classList.toggle("fly", sc.mode==="fly"));
    }
    function explore(b){
      mode="explore"; untilFlag=b.explore.until; idleT=0; hintsShown=new Set();
      pad.hidden=false; v.classList.add("exploring");
      v.dataset.pmode = sc.mode;
      startPlayer();
      if(b.explore.music!==false) music(b.explore.music||"explore");
      return new Promise(r => {
        exploreRes = r;
        exploreSkip = () => { const o = b.explore.skipTo; if(o!=null){ P.x=o; const s=surfaceAt(o); P.y = s!=null?s:P.y; P.c.x=P.x; P.c.y=P.y; placeChar(P.c); } ctx.flags[untilFlag]=true; if(interacting){ interacting=false; } };
      });
    }
    function endExplore(){ mode="idle"; pad.hidden=true; v.classList.remove("exploring"); keys.clear(); autoTarget=null; hidePrompt(); Object.values(chars).forEach(c=>{ if(c.anim!=="idle") setAnim(c,"idle"); }); exploreSkip=null; const r=exploreRes; exploreRes=null; r && r(); }
    let promptEl=null, near=null;
    function showPrompt(o){ if(!promptEl){ promptEl=h(`<div class="tp-prompt"></div>`); L.main.appendChild(promptEl); } promptEl.innerHTML = `${finePointer?'<kbd>E</kbd>':""}<span>${fill(o.label||"تفاعلي",ctx)}</span>`; promptEl.style.left=o.x+"em"; promptEl.style.top=(o.y - (o.ph||o.w*0.9) - 3)+"em"; promptEl.hidden=false; pad.classList.add("can-act"); }
    function hidePrompt(){ if(promptEl) promptEl.hidden=true; pad.classList.remove("can-act"); near=null; }
    async function interact(o){
      if(interacting) return; interacting=true; keys.clear(); hidePrompt(); setAnim(P.c,"idle"); P.vx=0;
      if(o.need && !o.need(ctx)){ await runBeats(o.deny || [{say:playerWho, t:"لسه ناقصنا شي…"}]); interacting=false; return; }
      P.c.face = o.x>=P.x?1:-1; placeChar(P.c);
      if(o.once!==false) o.done=true;
      if(o.flag) ctx.flags[o.flag]=true;
      await runBeats(o.run);
      if(o.done) o.el.classList.remove("act");
      interacting=false; last=performance.now();
    }
    function goInteract(o){ if(Math.abs(o.x-P.x)<(o.r||9) && Math.abs(o.y-P.y)<(o.ry||34)) interact(o); else toastIn("قرّبي منه بأزرار الحركة أول", 1600); }

    function tryJump(){ if(sc.mode!=="walk") return; if(P.ground && !P.pre){ if(P.c.rig && motionOK()){ P.pre=.09; TRig.crouch(P.c,.1); } else launch(); } }
    function launch(){ P.pre=0; P.vy=-64; P.ground=false; P.plat=null; TAudio.sfx("jump"); setAnim(P.c,"jump"); }
    function onAction(){ if(mode!=="explore"||interacting) return; if(near) interact(near); }

    function physics(dt){
      const c=P.c, m=sc.mode;
      let dir = (keys.has("right")?1:0) - (keys.has("left")?1:0);
      if(dir) idleT=0; else idleT+=dt;
      P.hold = dir ? P.hold+dt : 0;
      const sp = m==="fly" ? 26 : m==="boat" ? 22 : (P.hold>.7 ? 33 : 19);
      P.vx = dir*sp;
      if(dir) c.face=dir;
      // ريح
      if(sc.wind){ const w=sc.wind; gustT+=dt; const ph=gustT%w.every; const warn = ph>w.every-1.3 && ph<w.every; const on = ph < w.dur; if(warn!==gustWarn){ gustWarn=warn; v.classList.toggle("gust-warn", warn); if(warn) TAudio.sfx("wind"); } if(on!==gustOn){ gustOn=on; v.classList.toggle("gusting", on); } if(on && !(w.shelters||[]).some(([a,b])=>P.x>=a&&P.x<=b)) P.vx -= w.push; }
      if(m==="walk"){
        if(P.pre>0){ P.pre-=dt; if(P.pre<=0) launch(); }
        P.vy += 170*dt; if(P.vy>110) P.vy=110;
        const px=P.x, py=P.y;
        P.x = clamp(P.x + P.vx*dt, 2, sc.len-2);
        if(P.plat && P.plat.dxv){ P.x += P.plat.dxv; }
        let ny = P.y + P.vy*dt;
        // هبوط
        let land=null, lp=null;
        if(P.vy>=0){
          if(!sc.noGround && sc.groundSegs.some(([a,b])=>P.x>=a&&P.x<=b) && py<=sc.ground+.5 && ny>=sc.ground){ land=sc.ground; }
          plats.forEach(p => { if(P.x>=p.cx-1 && P.x<=p.cx+p.w+1 && py<=p.cy+.8+(p.dyv>0?p.dyv:0) && ny>=p.cy-.1 && (land==null||p.cy<land)){ land=p.cy; lp=p; } });
        }
        if(land!=null){ if(!P.ground) { TAudio.sfx("land"); } ny=land; P.vy=0; P.ground=true; P.plat=lp; if(!lp || !lp.move) P.safe=[P.x, ny]; }
        else { P.ground=false; P.plat=null; }
        P.y=ny;
        if(P.y>112){ respawn(); return; }
        hazards.forEach(z => { if(!z.cool && Math.abs(z.x-P.x)<3.6 && P.y>(z.y!=null?z.y:sc.ground)-7){ z.cool=true; setTimeout(()=>z.cool=false, 1200); P.x=clamp(P.x-9*(c.face||1),2,sc.len-2); P.vy=-38; P.ground=false; TAudio.sfx("bump"); z.el.classList.remove("hit"); void z.el.offsetWidth; z.el.classList.add("hit"); bark(followers[0]||playerWho, pick(["بقعة حبر! دفعتنا لورا.","الحبر يضحك… خلّي نقفز فوگه.","ما صار شي، بس صرنا منقّطين."]), 1800); } });
        setAnim(c, !P.ground ? "jump" : dir ? (P.hold>.7?"run":"walk") : "idle");
      } else if(m==="boat"){
        P.x = clamp(P.x + P.vx*dt, 2, sc.len-2);
        const ty = sc.lanes[P.lane]; P.y = lerp(P.y, ty, Math.min(1, dt*8));
        swirls.forEach(s => { if(Math.abs(s.x-P.x)<5 && s.lane===P.lane && !s.cool){ s.cool=true; setTimeout(()=>s.cool=false, 1500); P.x -= 10*Math.sign(P.vx||1); TAudio.sfx("bump"); emote(P.c.who,"surprise"); bark(pick(followers.filter(f=>chars[f]))||playerWho, pick(HIKAYAT.swirlBarks), 1800); } });
        setAnim(c, dir ? "row" : "idle");
      } else if(m==="fly"){
        const vy = ((keys.has("down")?1:0) - (keys.has("up")||keys.has("jump")?1:0))*22;
        P.x = clamp(P.x + P.vx*dt, 2, sc.len-2); P.y = clamp(P.y + vy*dt, sc.flyMin||22, sc.flyMax||80);
        setAnim(c, "fly");
      }
      c.x=P.x; c.y=P.y; placeChar(c);
      // أثر الخطوات للمتابعين
      const lt=trail[trail.length-1]; if(Math.hypot(P.x-lt.x, P.y-lt.y)>.9){ trail.push({x:P.x,y:P.y}); if(trail.length>160) trail.shift(); if(m==="walk"&&P.ground&&Math.random()<.18) TAudio.sfx("step"); }
      let need=0, acc=0, ti=trail.length-1;
      followers.forEach((w,i) => { const f=chars[w]; if(!f) return; need += i===0 ? (P.c.h*.36 + f.h*.36 + 2) : (chars[followers[i-1]] ? chars[followers[i-1]].h*.36 : 6) + f.h*.36 + 2;
        while(ti>0 && acc<need){ acc += Math.hypot(trail[ti].x-trail[ti-1].x, trail[ti].y-trail[ti-1].y); ti--; } const tp=trail[ti]; const nx=lerp(f.x,tp.x,Math.min(1,dt*7)), ny=lerp(f.y,tp.y,Math.min(1,dt*9)); const mv=Math.abs(nx-f.x)/dt; f.face = nx>f.x+.01?1:nx<f.x-.01?-1:f.face; f.x=nx; f.y=ny;
        if(f.rig && m==="walk"){ if(mv>3) f.wasMoving=true; else if(f.wasMoving && mv<.5){ f.wasMoving=false; const el=chars.elaf; if(el && el!==f && Math.abs(el.x-f.x)<26){ f.face = el.x>=f.x?1:-1; TRig.greet(f); } } }
        placeChar(f); setAnim(f, m==="boat"?(mv>3?"row":"idle"):m==="fly"?"fly":(mv>24?"run":mv>2?"walk":"idle")); });
      // جمع
      items.forEach(it => { if(!it.got && Math.abs(it.x-P.x)<4.5 && Math.abs((it.y)-(P.y-8))<12){ it.got=true; it.el.classList.add("got"); ctx.inv[it.k]=(ctx.inv[it.k]||0)+1; if(it.once){ SV.items[it.once]=true; } TAudio.sfx("pick"); drawInv(); if(it.say) bark(playerWho, it.say, 2000); setTimeout(()=>it.el.remove(), 700); } });
      // مناطق
      zones.forEach(z => { if(z.fired) return; if(P.x>=z.x0 && P.x<=z.x1){ if(z.bark){ z.fired=true; bark(z.bark[0], z.bark[1], 2800); return; } if(z.need && !z.need(ctx)){ if(!z.denied){ z.denied=true; runNonBlocking(z.deny||[]); setTimeout(()=>z.denied=false, 6000); } if(z.block){ P.x = z.x0-1; } return; } z.fired = z.once!==false; if(z.flag) ctx.flags[z.flag]=true; if(z.run){ interacting=true; keys.clear(); runBeats(z.run).then(()=>{ interacting=false; }); } } });
      // دليل يمشي قدّام
      if(guide && guide.path && guide.idx<guide.path.length){ const nx=guide.path[guide.idx]; if(P.x > (guide.x - (guide.lead||18))){ guide.idx++; moveGuide([nx], 900); } }
      // أقرب تفاعل
      let best=null, bd=1e9; objs.forEach(o => { if(!o.run || o.done || o.hidden || o.el.hidden) return; const d=Math.abs(o.x-P.x); if(d<(o.r||9) && Math.abs(o.y-P.y)<(o.ry||34) && d<bd){ bd=d; best=o; } });
      if(best!==near){ if(best){ near=best; showPrompt(best); } else hidePrompt(); }
      // تلميحات عند الوقوف
      const hs = (curExplore && curExplore.hints) || [];
      hs.forEach((hh,i) => { if(!hintsShown.has(i) && idleT>hh.after){ hintsShown.add(i); bark(hh.who||followers[0]||playerWho, hh.t, 3600); } });
      if(untilFlag && ctx.flags[untilFlag] && !interacting) endExplore();
    }
    function ao_hopNeeded(){ return false; }
    function nextHop(dir, tx){
      // أقرب سطح بالاتجاه المطلوب
      const cands = plats.map(p=>({x:p.cx+p.w/2, y:p.cy})).concat(sc.groundSegs.flatMap(([a,b])=>[{x:a+2,y:sc.ground},{x:b-2,y:sc.ground}]))
        .filter(s => dir>0 ? s.x>P.x+2 && s.x<=tx+6 : s.x<P.x-2 && s.x>=tx-6).filter(s => Math.abs(s.x-P.x)<30 && s.y>P.y-16)
        .sort((a,b)=>Math.abs(a.x-P.x)-Math.abs(b.x-P.x));
      return cands[0];
    }
    let hopping=false;
    function autoHop(t){ if(hopping) return; hopping=true; hopChar(P.c, t.x, t.y, 600).then(()=>{ P.x=P.c.x; P.y=P.c.y; P.vy=0; P.ground=true; P.plat=plats.find(p=>Math.abs(p.cy-t.y)<.5 && t.x>=p.cx && t.x<=p.cx+p.w)||null; hopping=false; trail.push({x:P.x,y:P.y}); }); }
    function buildTrail(){
      // مسار يبدأ من آخر متابع وينتهي باللاعب، حتى ما يقفزون لمكان ثاني
      const pts = followers.map(w=>chars[w]).filter(Boolean).reverse().map(f=>({x:f.x,y:f.y})).concat([{x:P.x,y:P.y}]);
      if(pts.length===1) pts.unshift({x:P.x-30*(P.c.face||1), y:P.y});
      trail=[]; for(let i=0;i<pts.length-1;i++){ const a=pts[i], b2=pts[i+1], d=Math.hypot(b2.x-a.x,b2.y-a.y), n=Math.max(1,Math.ceil(d/.9)); for(let k=0;k<n;k++) trail.push({x:lerp(a.x,b2.x,k/n), y:lerp(a.y,b2.y,k/n)}); }
      trail.push({x:P.x,y:P.y});
    }
    function respawn(){ TAudio.sfx("soft"); P.x=P.safe[0]; P.y=P.safe[1]; P.vy=0; P.ground=true; P.plat=null; P.c.x=P.x; P.c.y=P.y; followers.forEach((w,i)=>{ const f=chars[w]; if(f){ f.x=P.x-(8+i*8)*(P.c.face||1); f.y=P.y; placeChar(f);} }); buildTrail(); emote(P.c.who,"surprise"); toastIn(pick(HIKAYAT.respawnLines)); }
    function drawInv(){ invEl.innerHTML = Object.entries(ctx.inv).filter(([k,n])=>n>0 && HIKAYAT.itemArt[k]).map(([k,n])=>`<span class="tp-ipill">${TART.symbol(HIKAYAT.itemArt[k], HIKAYAT.itemColor[k]||"#FFE7AE")}<b>${n}${curExplore&&curExplore.need&&curExplore.need[k]?"/"+curExplore.need[k]:""}</b></span>`).join(""); }
    function runNonBlocking(list){ list.forEach(b2 => { if(b2.say) bark(b2.say, b2.t, 2600); }); }

    /* ----- الألغاز والاختيارات ----- */
    let curExplore=null;
    function puzzle(b){
      return new Promise(res => {
        const pm = mode; mode="puzzle"; over.hidden=false; v.classList.add("overlay");
        if(b.music) music(b.music);
        const card = h(`<div class="tp-card pzc-${b.puzzle}"><h3>${fill(b.title||"لغز",ctx)}</h3>${b.intro?`<p class="pz-sub">${fill(b.intro,ctx)}</p>`:""}<div class="pz-body"></div><p class="pz-say" aria-live="polite"></p><div class="pz-foot"><button class="pz-mini" data-hint>تلميح</button></div></div>`);
        over.innerHTML=""; over.appendChild(card); requestAnimationFrame(()=>card.classList.add("in"));
        let hintFn=null, skipH=null, cleanup=null, done=false;
        const sayEl=$(".pz-say",card);
        const finish = val => { if(done) return; done=true; cleanup&&cleanup(); TAudio.sfx("ok"); card.classList.add("solved"); sayEl.textContent = fill(b.win || pick(HIKAYAT.winLines), ctx); skipFn=null; setTimeout(()=>{ over.hidden=true; over.innerHTML=""; v.classList.remove("overlay"); mode = pm==="puzzle" ? "idle" : pm; if(b.key) { SV.choices[chap.id+"."+b.key]=val; save(); } res(val); }, 1100); };
        const api = { ctx, fill:t=>fill(t,ctx), solve:finish, say:t=>{ sayEl.textContent=fill(t,ctx); sayEl.classList.remove("pop"); void sayEl.offsetWidth; sayEl.classList.add("pop"); }, sfx:(n,...a)=>TAudio.sfx(n,...a), note:(n,d,t)=>TAudio.note(n,d,t), onHint:f=>hintFn=f, onSkip:f=>skipH=f, onCleanup:f=>cleanup=f };
        TPZ[b.puzzle]($(".pz-body",card), Object.assign({}, b, {o:undefined}), api);
        $("[data-hint]",card).onclick = () => { TAudio.sfx("soft"); hintFn ? hintFn() : api.say("خذي وقتج، ماكو استعجال."); };
        skipFn = () => { const val = skipH ? skipH() : undefined; finish(val); };
      });
    }
    function choice(b){
      return new Promise(res => {
        const pm = mode; mode="choice"; over.hidden=false; v.classList.add("overlay");
        const card = h(`<div class="tp-card tp-choice"><h3>${fill(b.q,ctx)}</h3><div class="tp-opts">${b.opts.map((o,i)=>`<button class="tl-opt" data-i="${i}"><b>${fill(o.label,ctx)}</b>${o.sub?`<small>${fill(o.sub,ctx)}</small>`:""}</button>`).join("")}</div></div>`);
        over.innerHTML=""; over.appendChild(card); requestAnimationFrame(()=>card.classList.add("in"));
        const pickOpt = i => { const o=b.opts[i]; SV.choices[chap.id+"."+b.choice]=o.v; save(); TAudio.sfx("pick"); skipFn=null; over.hidden=true; over.innerHTML=""; v.classList.remove("overlay"); mode = pm==="choice" ? "idle" : pm; res(o.v); };
        $$(".tl-opt",card).forEach(btn => btn.onclick = () => pickOpt(+btn.dataset.i));
        skipFn = () => pickOpt(b.def||0);
      });
    }
    async function calm(b){
      const pm = mode; mode="calm"; v.classList.add("calm-moment");
      Object.keys(chars).forEach(w=>{ if(b.sit && b.sit.includes(w)) setAnim(chars[w],"sit"); });
      if(b.music) music(b.music);
      if(b.pan) tweenCam(b.pan[0], b.pan[1], b.dur||6000);
      for(const line of (b.lines||[])) { await say(line); }
      narr.hidden=false; $("p",narr).textContent = fill(b.t||"لحظة هدوء…",ctx); const btn=$(".tl-btn",narr); btn.hidden=false; btn.textContent="نكمّل";
      await new Promise(r=>{ btn.onclick=()=>{ skipFn=null; r(); }; skipFn=()=>{ skipFn=null; r(); }; });
      btn.hidden=true; narr.hidden=true; v.classList.remove("calm-moment");
      Object.values(chars).forEach(c=>setAnim(c,"idle")); mode = pm==="calm" ? "idle" : pm;
    }
    async function wipe(){ if(!motionOK()) return; v.classList.remove("wiping"); void v.offsetWidth; v.classList.add("wiping"); TAudio.sfx("page"); await wait(520); }

    /* ----- مشغّل الخطوات ----- */
    async function runBeat(b){
      if(ctx.aborted) return;
      if(b.if && !b.if(ctx)) return;
      if(b.scene){ if(sc) await wipe(); loadScene(b); setTimeout(()=>v.classList.remove("wiping"), 500); return; }
      if(b.cine) return cine(b);
      if(b.say) return say(b);
      if(b.act) return act(b);
      if(b.explore){ curExplore=b.explore; drawInv(); await explore(b); curExplore=null; return; }
      if(b.puzzle) return puzzle(b);
      if(b.choice) return choice(b);
      if(b.calm) return calm(b);
      if(b.fx) return doFx(b.fx, b.arg);
      if(b.set){ Object.assign(ctx.flags, b.set); return; }
      if(b.follow){ followers = b.follow.filter(w=>chars[w]); return; }
      if(b.give){ SV.items[b.give]=true; save(); toastIn(b.giveText||"انضاف للحقيبة"); TAudio.sfx("sparkle"); return; }
      if(b.obj){ updObj(b.obj, b); return; }
      if(b.music){ music(b.music); return; }
      if(b.sfx){ TAudio.sfx(b.sfx); return; }
      if(b.wait) return wait(b.wait);
      if(b.toast){ toastIn(b.toast, b.ms||2600); return; }
      if(b.run) return b.run(ctx, {chars, bark, emote, toastIn, updObj, getObj, SV, save});
    }
    async function runBeats(list){ for(const b of list){ if(ctx.aborted) return; await runBeat(b); } }

    async function runChapter(startAt){
      const beats = chap.beats;
      const start = Math.max(0, startAt||0);
      // استرجاع الحالة عند نقطة الحفظ
      if(start>0){ const cp=SV.cp[chap.id]; if(cp){ Object.assign(ctx.flags, cp.flags||{}); Object.assign(ctx.inv, cp.inv||{}); } }
      for(let i=start;i<beats.length;i++){
        if(ctx.aborted) return;
        const b = beats[i];
        $(".tp-progress i",v).style.width = (i/beats.length*100)+"%";
        if(b.scene && i>0){ SV.cp[chap.id] = {i, flags:{...ctx.flags}, inv:{...ctx.inv}}; save(); }
        await runBeat(b);
      }
      if(ctx.aborted) return;
      $(".tp-progress i",v).style.width = "100%";
      SV.done[chap.id] = true; delete SV.cp[chap.id]; save();
      chapterEnd();
    }
    function chapterEnd(){
      const L2 = chapList(), i = L2.findIndex(x=>x.c.id===chap.id), nx = L2[i+1];
      const lastOfStory = story.chapters[story.chapters.length-1].id===chap.id;
      music("emotion"); mode="end"; over.hidden=false; v.classList.add("overlay");
      const card = h(`<div class="tp-card tp-end"><span class="tp-seal">${TART.symbol(lastOfStory?"key":"star","#F6E3A1")}</span><h3>${lastOfStory?"انتهت الحكاية":"نهاية الفصل"}</h3><p class="tp-cliff">${fill(chap.cliff||"",ctx)}</p>
        ${nx ? `<div class="tp-next"><small>${nx.s.id===story.id?"الفصل التالي":"الحكاية الجاية"}</small><b>${nx.s.id===story.id?"":nx.s.title+" — "}${nx.c.title}</b><span>${nx.c.teaser}</span></div>` : `<div class="tp-next"><b>انتهى الموسم الأول</b><span>بالمكتبة كتاب جديد فارغ ينتظر حكايات جاية.</span></div>`}
        <div class="tp-endrow">${nx?`<button class="btn honey" data-next>${nx.s.id===story.id?"الفصل التالي":"افتحي الكتاب الجاي"}</button>`:""}<button class="btn ghost" data-again>إعادة الفصل</button><button class="btn ghost" data-lib>المكتبة</button></div></div>`);
      over.innerHTML=""; over.appendChild(card); requestAnimationFrame(()=>card.classList.add("in"));
      if(motionOK()) confetti();
      const n=$("[data-next]",card); if(n) n.onclick = () => go("tales:"+nx.c.id);
      $("[data-again]",card).onclick = () => go("tales:"+chap.id, false);
      $("[data-lib]",card).onclick = () => go("tales");
    }

    /* ----- إيقاف مؤقت وصوت ----- */
    function pauseMenu(){
      if(mode==="end") return;
      paused=true; v.classList.add("paused");
      const box = h(`<div class="tp-pausebox" role="dialog" aria-modal="true"><div class="tp-card in"><h3>موقوفة مؤقتاً</h3>
        <div class="tp-col"><button class="btn honey" data-resume>كمّلي</button><button class="btn ghost" data-restart>إعادة الفصل</button>
        <label class="tl-sw"><input type="checkbox" data-motion ${prefs.calm?"checked":""}> خففي الحركة</label>
        <button class="btn ghost" data-lib>رجوع للمكتبة</button></div><p class="d-note">${finePointer?"الحركة: الأسهم أو WASD · القفز: Space · التفاعل: E · الإيقاف: Esc":"الحركة: أزرار الاتجاهات تحت، والقفز والتفاعل بالأزرار اللي يمّها."}</p></div></div>`);
      v.appendChild(box);
      const close = () => { box.remove(); paused=false; v.classList.remove("paused"); last=performance.now(); };
      $("[data-resume]",box).onclick = close;
      $("[data-restart]",box).onclick = () => { delete SV.cp[chap.id]; save(); go("tales:"+chap.id, false); };
      $("[data-lib]",box).onclick = () => go("tales");
      $("[data-motion]",box).onchange = e => { prefs.calm=e.target.checked; Store.set("prefs",prefs); document.documentElement.classList.toggle("calm", prefs.calm); if(!motionOK()) fxL.innerHTML=""; else if(sc&&sc.amb) ambient(sc.amb); };
      box._close = close;
    }
    function soundMenu(btn){
      TAudio.unlock();
      const ex=$(".tp-sound",v); if(ex){ ex.remove(); return; }
      const box=h(`<div class="tp-sound"><label class="tl-sw"><input type="checkbox" data-o="music" ${SV.opts.music?"checked":""}> الموسيقى</label><label class="tl-sw"><input type="checkbox" data-o="sfx" ${SV.opts.sfx?"checked":""}> المؤثرات</label><label class="tl-sl">الصوت<input type="range" min="0" max="1" step=".05" value="${SV.opts.vol}"></label></div>`);
      v.appendChild(box);
      $$("[data-o]",box).forEach(c=>c.onchange=()=>{ SV.opts[c.dataset.o]=c.checked; save(); TAudio.setOpts(SV.opts); if(c.dataset.o==="music" && c.checked) music(curMood||"explore"); });
      $("input[type=range]",box).oninput=e=>{ SV.opts.vol=+e.target.value; save(); TAudio.setOpts(SV.opts); };
      setTimeout(()=>{ const off=e=>{ if(!box.contains(e.target) && e.target!==btn && !btn.contains(e.target)){ box.remove(); document.removeEventListener("pointerdown", off); } }; document.addEventListener("pointerdown", off); }, 0);
    }
    let curMood="explore"; const _music=music; music = m => { curMood=m; _music(m); };

    /* ----- الإدخال ----- */
    const KEYMAP = {ArrowRight:"right", KeyD:"right", ArrowLeft:"left", KeyA:"left", ArrowUp:"up", KeyW:"up", ArrowDown:"down", KeyS:"down"};
    const onKey = e => {
      if(e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if(e.type==="keydown" && (e.key==="Escape" || e.code==="KeyP")){ e.preventDefault(); const pb=$(".tp-pausebox",v); if(pb) pb._close(); else pauseMenu(); return; }
      if(paused) return;
      const k = KEYMAP[e.code];
      if(mode==="explore" && !interacting){
        if(k){ e.preventDefault(); if(e.type==="keydown"){ keys.add(k); autoTarget=null; if(k==="up"){ if(sc.mode==="walk") tryJump(); else if(sc.mode==="boat") P.lane=Math.max(0,P.lane-1); } if(k==="down"&&sc.mode==="boat") P.lane=Math.min(sc.lanes.length-1,P.lane+1); } else keys.delete(k); return; }
        if(e.code==="Space"){ e.preventDefault(); if(e.type==="keydown" && !e.repeat){ if(near && Math.abs(near.x-P.x)<7) onAction(); else tryJump(); } return; }
        if(e.code==="KeyE" && e.type==="keydown"){ e.preventDefault(); onAction(); return; }
      } else if(e.type==="keydown" && (e.code==="Space"||e.code==="Enter"||e.code==="ArrowLeft"||e.code==="KeyE") && advanceFn && !over.contains(document.activeElement)){ e.preventDefault(); advanceFn(); }
    };
    window.addEventListener("keydown", onKey); window.addEventListener("keyup", onKey);
    const releaseAll = () => { keys.clear(); $$(".tp-pad button.on",v).forEach(x=>x.classList.remove("on")); };
    window.addEventListener("blur", releaseAll); document.addEventListener("visibilitychange", releaseAll);
    stage.addEventListener("click", e => {
      TAudio.unlock();
      if(advanceFn && (mode==="talk"||mode==="cine")) { advanceFn(); return; }
    });
    dlg.addEventListener("click", () => advanceFn && advanceFn());
    narr.addEventListener("click", e => { if(e.target.closest(".tl-btn")) return; advanceFn && advanceFn(); });
    $$(".tp-pad button",v).forEach(b => {
      const k=b.dataset.k;
      const down = e => { e.preventDefault(); TAudio.unlock(); if(mode!=="explore"||interacting) return; autoTarget=null;
        if(k==="jump") { if(near && Math.abs(near.x-P.x)<7 && sc.mode==="walk" && false) onAction(); else tryJump(); }
        else if(k==="act") onAction();
        else if(k==="up"){ if(sc.mode==="boat") P.lane=Math.max(0,P.lane-1); keys.add("up"); }
        else if(k==="down"){ if(sc.mode==="boat") P.lane=Math.min(sc.lanes.length-1,P.lane+1); keys.add("down"); }
        else keys.add(k); b.classList.add("on"); };
      const up = e => { keys.delete(k); b.classList.remove("on"); };
      b.addEventListener("pointerdown", e => { try{ b.setPointerCapture(e.pointerId); }catch(_){} down(e); });
      ["pointerup","pointercancel","lostpointercapture"].forEach(t => b.addEventListener(t, up));
      b.addEventListener("contextmenu", e => e.preventDefault());
    });
    $$(".tp-hud .tp-b",v).forEach(b => b.onclick = e => { e.stopPropagation(); TAudio.unlock(); const k=b.dataset.h;
      if(k==="back") go("tales");
      if(k==="pause") pauseMenu();
      if(k==="sound") soundMenu(b);
      if(k==="subs"){ SV.opts.subs=!SV.opts.subs; save(); b.setAttribute("aria-pressed", SV.opts.subs); toastIn(SV.opts.subs?"نص الحوار ظاهر":"الحوار بالفقاعات فقط", 1500); }
      if(k==="skip"){ const f = skipFn || (mode==="explore" ? exploreSkip : null); if(f){ TAudio.sfx("page"); f(); } }
      if(k==="swap" && mode==="explore" && !interacting && chars.elaf && chars.adool){ const prev=playerWho; playerWho = playerWho==="elaf"?"adool":"elaf"; followers = [prev, ...followers.filter(x=>x!==playerWho && x!==prev)]; const c=chars[playerWho]; P.c=c; P.x=c.x; P.y=c.y; trail.push({x:P.x,y:P.y}); emote(playerWho,"happy"); toastIn(`هسه تلعبين بـ${NAMES[playerWho]()}`,1500); }
    });

    /* ----- الحلقة ----- */
    function render(){ layoutParallax(); plats.forEach(p=>{ p.el.style.transform=`translate(${p.cx}em, ${p.cy}em)`; }); }
    function frame(now){
      raf = requestAnimationFrame(frame);
      const dt = Math.min(.05, (now-last)/1000); last=now;
      if(paused) return;
      const mk = mode + (interacting?"+busy":""); if(v.dataset.m!==mk){ v.dataset.m=mk; v.classList.toggle("busy", interacting || (mode!=="explore")); }
      tNow += dt;
      plats.forEach(p => { if(p.move){ const m=p.move, ph=tNow*2*Math.PI/(m.t||4)+(m.ph||0); const nx=p.x+(m.dx||0)*Math.sin(ph), ny=p.y+(m.dy||0)*Math.sin(ph); p.dxv=nx-p.cx; p.dyv=ny-p.cy; p.cx=nx; p.cy=ny; } });
      if(mode==="explore" && P && !interacting && !hopping) physics(dt);
      if(P && P.plat && P.plat.move && mode==="explore"){ P.y=P.plat.cy; P.c.y=P.y; placeChar(P.c); }
      if(camTween) camTween(now);
      else if(sc && mode!=="cine" && !camHold && (P && mode==="explore" ? true : chars[playerWho])){ const fx0 = mode==="explore"&&P ? P.x : chars[playerWho].x; const target = clamp(fx0 - VW*.42, 0, Math.max(0, sc.len-VW)); cam = motionOK() ? lerp(cam, target, Math.min(1, dt*3.2)) : target; }
      if(sc) render();
      const calm = !motionOK(); for(const k in chars){ const c=chars[k]; if(c.rig && c.vis) TRig.update(c, dt, calm); }
      reflections.forEach(r => { const c=r.c; r.hist.push([c.x,c.y,c.face]); if(r.hist.length>18) r.hist.shift(); const [x,y,f]=r.hist[0]; r.el.style.transform=`translate(${x}em, ${sc.reflect + (sc.reflect-y)}em) scaleY(-1)`; r.el.classList.toggle("fl", CHARS[c.who].flip && f<0); r.el.hidden=!c.vis; if(motionOK() && Math.random()<dt*.12){ r.el.classList.add("silly"); setTimeout(()=>r.el.classList.remove("silly"), 1400); } });
    }
    raf = requestAnimationFrame(frame);

    // ابدأ
    const startIdx = from==="cp" && SV.cp[chapId] ? SV.cp[chapId].i : 0;
    runChapter(startIdx);

    return () => {
      ctx.aborted = true; cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", releaseAll); document.removeEventListener("visibilitychange", releaseAll);
      if(skipFn) try{ skipFn(); }catch(e){}
      TAudio.stop();
    };
  }

  function arrow(rot){ return `<svg viewBox="0 0 24 24" style="transform:rotate(${rot}deg)"><path d="M5 12h12M12 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }

  /* ---------- نقطة الدخول من الراوتر ---------- */
  let forestSound = false;
  function view(root, arg){
    init();
    if(prefs.sound){ forestSound=true; Sound.set(false); }
    const [id, from] = (arg||"").split("@");
    const clean = id ? viewPlayer(root, id, from) : viewLibrary(root);
    return () => { clean && clean(); setTimeout(()=>{ if(forestSound && !String(current).startsWith("tales")){ forestSound=false; Sound.set(true); } }, 0); };
  }
  return { view, get save(){ return SV; } };
})();
function viewTales(root, arg){ return TalesEngine.view(root, arg); }
