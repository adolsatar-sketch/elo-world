/* =====================================================================
   دار إيلاف — مشغل التصميم، ورشة الأجنحة، غرفة القياس، متحف الإطلالات
   ===================================================================== */
const FDesign = (() => {
  const A = FArt;
  const clone = o => JSON.parse(JSON.stringify(o));

  /* ---------------- أدوات اللوحة ---------------- */
  // أزرار اختيار. kind: نوع المكافأة إذا الخيار ممكن يكون مقفول
  const chips = (key, map, val, kind, extra="") => `<div class="fc-chips" data-k="${key}" ${extra}>${Object.entries(map).map(([id,n])=>{ const lock = kind && !FW.owned(kind,id); return `<button data-v="${id}" aria-pressed="${val===id}"${lock?` data-lock="${kind}"`:""}>${lock?`<i class="fc-lk">${IC.lock}</i>`:""}${esc(n)}</button>`; }).join("")}</div>`;
  const palette = (key, val) => `<div class="fc-pal" data-k="${key}" role="group">${Object.keys(A.COLORS).map(id=>{ const lock=!FW.owned("c",id); return `<button data-v="${id}" aria-pressed="${val===id}" aria-label="${A.COLORS[id][1]}${lock?" — مقفول":""}" style="--c:${A.COLORS[id][0]}"${lock?` data-lock="c"`:""}>${lock?`<i class="fc-lk">${IC.lock}</i>`:""}</button>`; }).join("")}</div>`;
  const swatches = (key, kind, ids, val) => `<div class="fc-sws" data-k="${key}">${ids.map(id=>{ const lock=!FW.owned(kind,id); return `<button data-v="${id}" aria-pressed="${val===id}"${lock?` data-lock="${kind}"`:""}>${FW.swatch(kind,id,46)}<small>${esc(FW.KIND[kind].name(id))}</small>${lock?`<i class="fc-lk">${IC.lock}</i>`:""}</button>`; }).join("")}</div>`;
  const slider = (key, label, val, min, max, step, fmt) => `<label class="fc-sl"><span>${label}</span><input type="range" data-r="${key}" min="${min}" max="${max}" step="${step}" value="${val}"><b>${fmt?fmt(val):""}</b></label>`;
  const toggle = (key, label, on) => `<button class="fc-tg" data-tg="${key}" aria-pressed="${!!on}"><i></i>${label}</button>`;
  const sizeTxt = v => v<.85?"صغير":v>1.15?"كبير":"وسط";
  const HINT = {c:"هذا اللون ينفتح من الألعاب", p:"هالنقشة تنفتح من الألعاب", f:"هالقماش ينفتح من ألغاز قاعة الأقمشة أو المواسم أو غرفة الأسرار", w:"هالجناح ينلگى بمكان مخفي أو موسم", a:"هالإكسسوار ينفتح لما تحفظين تصاميم أكثر بالمتحف"};

  // يربط أحداث لوحة على كائن (look أو wings)
  function bindPanel(panel, get, onChange){
    panel.addEventListener("click", e => {
      const b = e.target.closest("button"); if(!b || !panel.contains(b)) return;
      if(b.dataset.lock){ FW.sfx("nope"); toast(HINT[b.dataset.lock]||"مقفول حالياً", "lock"); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); return; }
      const grp = b.closest("[data-k]");
      if(grp && b.dataset.v!=null){ const o=get(); const k=grp.dataset.k; if(o[k]===b.dataset.v && !grp.dataset.allowSame) return; o[k]=b.dataset.v; FW.sfx("soft"); onChange(k, true); return; }
      if(b.dataset.tg){ const o=get(); o[b.dataset.tg]=!o[b.dataset.tg]; FW.sfx("soft"); onChange(b.dataset.tg, true); return; }
      if(b.dataset.trim){ const o=get(); o.trims=o.trims||{}; o.trims[b.dataset.trim]=!o.trims[b.dataset.trim]; FW.sfx("soft"); onChange("trims", true); return; }
    });
    panel.addEventListener("input", e => { const r=e.target.closest("[data-r]"); if(!r) return; const o=get(); o[r.dataset.r]=+r.value; const bb=r.parentNode.querySelector("b"); if(bb && r.dataset.r.match(/size|accSize|sleeveW/)) bb.textContent=sizeTxt(+r.value); onChange(r.dataset.r, false); });
    panel.addEventListener("change", e => { const r=e.target.closest("[data-r]"); if(r) onChange(r.dataset.r, true, true); });
  }

  /* ---------------- قوالب البداية ---------------- */
  const TEMPLATES = [
    {n:"فستان الربيع", look:{type:"dress", cut:"soft", len:"midi", sleeve:"puff", collar:"peter", hem:"scallop", c1:"rose", c2:"cream", pat:"daisies", fabric:"cotton", belt:"ribbon", head:"flowers"}},
    {n:"عباءة الغيوم", look:{type:"cape", cut:"wide", len:"long", sleeve:"long", collar:"round", hem:"straight", c1:"sky", c2:"white", pat:"none", fabric:"silk", belt:"jewel"}},
    {n:"طقم الأوراق", look:{type:"set", cut:"layers", len:"midi", sleeve:"flutter", collar:"square", hem:"ruffle", c1:"mint", c2:"sage", pat:"stripes", fabric:"cotton", belt:"none"}},
    {n:"معطف الحكايات", look:{type:"coat", cut:"soft", len:"long", sleeve:"bell", collar:"peter", hem:"straight", c1:"lemon", c2:"ocean", pat:"dots", fabric:"cotton", belt:"none", trims:{buttons:true}}},
    {n:"فستان العيد", look:{type:"festive", cut:"wide", len:"long", sleeve:"puff", collar:"bow", hem:"petal", c1:"lilac", c2:"honey", pat:"none", fabric:"tulle", belt:"sash", trims:{embroidery:true}, sparkle:true}},
    {n:"زي الفراشة", look:{type:"special", cut:"bubble", len:"midi", sleeve:"cap", collar:"ruffle", hem:"zigzag", c1:"coral", c2:"lemon", pat:"none", fabric:"silk", belt:"flower"}, wings:{on:true, shape:"butterfly", c1:"coral", c2:"lemon"}}
  ];
  // القالب ياخذ بس الخيارات المفتوحة
  function fromTemplate(t){
    const l = Object.assign(A.BLANK(), clone(t.look));
    if(!FW.owned("c",l.c1)) l.c1="rose"; if(!FW.owned("c",l.c2)) l.c2="cream";
    if(!FW.owned("p",l.pat)) l.pat="none"; if(!FW.owned("f",l.fabric)) l.fabric="cotton";
    if(!FW.owned("a",l.head)) l.head="none"; if(!FW.owned("a",l.neck)) l.neck="none";
    const w = Object.assign(A.BLANK_WINGS(), FW.curWings(), clone(t.wings||{}));
    return {look:l, wings:w};
  }

  /* ---------------- مشغل إيلاف ---------------- */
  const TABS = [["piece","القطعة"],["cut","القصّة والمقاس"],["details","الأكمام والياقة"],["colors","الألوان"],["pattern","النقشة"],["fabric","القماش"],["trim","الزينة والحزام"],["acc","الإكسسوار"],["motion","اللمعة والحركة"]];
  FW.region("atelier", (body, {first}) => {
    const S = FW.S;
    let look = Object.assign(A.BLANK(), clone(S.cur.look)), wings = Object.assign(A.BLANK_WINGS(), clone(S.cur.wings));
    let name = S.cur.name || "", id = S.cur.id || null, tab = "piece", dirty = false;
    const hist = [JSON.stringify({look, wings})]; let hi = 0;
    body.innerHTML = `<div class="fa">
      <div class="fa-stage fs-atelier">
        <div class="fa-deco" aria-hidden="true"><i class="fa-lamp"></i><i class="fa-lamp b"></i><span class="fa-rack">${["#F2A7B8","#A8D2EE","#F6E08A","#C9B6E8"].map(c=>`<b style="--c:${c}"></b>`).join("")}</span></div>
        <div class="fa-plat"></div><div class="fa-doll"></div>
        <div class="fa-tools"><button class="fw-b sm" data-undo aria-label="تراجع">${IC.undo}</button><button class="fw-b sm" data-redo aria-label="إعادة">${IC.redo}</button></div>
        <div class="fa-friends"></div>
        <div class="fa-name"><input data-name maxlength="28" placeholder="اسم التصميم" aria-label="اسم التصميم"></div>
      </div>
      <div class="fa-panel">
        <div class="fa-tabs" role="tablist">${TABS.map(([k,n])=>`<button data-tab="${k}" aria-pressed="${k===tab}">${n}</button>`).join("")}</div>
        <div class="fa-opts"></div>
        <div class="fa-acts">
          <button class="btn ghost small" data-new>${IC.plus} من الصفر</button>
          <button class="btn ghost small" data-tpl>${IC.list} قوالب</button>
          <button class="btn ghost small" data-cmp>${FW.FI.compare} قارني</button>
          <button class="btn ghost small" data-owl>رأي البومة</button>
          <button class="btn honey" data-save>${IC.save} احفظي</button>
          <button class="btn ghost small" data-saveas hidden>${FW.FI.copy} نسخة جديدة</button>
        </div>
        <p class="fa-status" aria-live="polite"></p>
      </div>
    </div>`;
    fillIcons(body);
    const stage = $(".fa-stage",body), opts = $(".fa-opts",body), nameIn = $("[data-name]",body);
    nameIn.value = name;
    const dl = FW.doll($(".fa-doll",body), look, wings, {cls:"fa-d"});
    // الأصدقاء: الفأر (أدوات)، الفراشة الخيّاطة، البومة
    const fr = $(".fa-friends",body);
    const mouse = FW.friendEl("mouse","fa-mouse", ()=> hi>0 ? "تقدرين ترجعين خطوة بزر التراجع فوق!" : null); fr.appendChild(mouse);
    const seam = FW.friendEl("seam","fa-seam", ()=>`${A.FABRICS[look.fabric].n}: ${A.FABRICS[look.fabric].d}. ${FW.friendLine("seam")}`); fr.appendChild(seam);
    const clue = FW.clueEl("atelier", "fa-clue"); if(clue) stage.appendChild(clue);
    const status = t => { $(".fa-status",body).textContent = t; };
    const refreshHist = () => { $("[data-undo]",body).disabled = hi<=0; $("[data-redo]",body).disabled = hi>=hist.length-1; $("[data-saveas]",body).hidden = !id; };
    const apply = () => { dl.set(look, wings); FW.setCur(look, wings, name, id); };
    const push = () => { const s=JSON.stringify({look, wings}); if(s===hist[hi]) return; hist.splice(hi+1); hist.push(s); if(hist.length>60) hist.shift(); hi=hist.length-1; dirty=true; refreshHist(); };
    const restore = () => { const o=JSON.parse(hist[hi]); look=o.look; wings=o.wings; apply(); render(); refreshHist(); };
    function render(){
      const L = look; let s = "";
      if(tab==="piece") s = `<h4>نوع القطعة</h4>${chips("type", A.TYPES, L.type)}<p class="fc-note">${({dress:"فستان قطعة وحدة.", coat:"معطف مفتوح فوق فستان باللون الثاني.", set:"قطعة فوگ (تونيك) وتنورة باللون الثاني.", cape:"فستان وعباءة طويلة من ورا.", festive:"طبقة تول ناعمة فوق التنورة.", special:"بتلات كبيرة فوق التنورة — للعروض الخيالية."})[L.type]}</p>`;
      if(tab==="cut") s = `<h4>القصّة</h4>${chips("cut", A.CUTS, L.cut)}<h4>الطول</h4>${chips("len", A.LENGTHS, L.len)}<h4>المقاس (نسبي)</h4>${chips("size", {S:"صغير", M:"وسط", L:"كبير"}, L.size)}<p class="fc-note">المقاس يغيّر حجم القطعة بس، وإيلاف تبقى نفسها.</p>`;
      if(tab==="details") s = `<h4>الأكمام</h4>${chips("sleeve", A.SLEEVES, L.sleeve)}${slider("sleeveW","عرض الكم",L.sleeveW,.6,1.6,.1,sizeTxt)}<h4>الياقة</h4>${chips("collar", A.COLLARS, L.collar)}<h4>الحافة</h4>${chips("hem", A.HEMS, L.hem)}`;
      if(tab==="colors") s = `<h4>اللون الأساسي</h4>${palette("c1", L.c1)}<h4>اللون الثانوي</h4>${palette("c2", L.c2)}<p class="fc-note">الثانوي يروح للياقة والحزام والنقشة والبطانة.</p>`;
      if(tab==="pattern") s = `<h4>النقشة</h4>${swatches("pat","p",Object.keys(A.PATTERNS),L.pat)}${L.pat!=="none"?slider("patScale","حجم النقشة",L.patScale,.6,1.6,.1,sizeTxt):""}`;
      if(tab==="fabric") s = `<h4>القماش</h4>${swatches("fabric","f",Object.keys(A.FABRICS),L.fabric)}`;
      if(tab==="trim") s = `<h4>زينة</h4><div class="fc-tgs">${Object.entries(A.TRIMS).map(([k,n])=>`<button class="fc-tg" data-trim="${k}" aria-pressed="${!!(L.trims&&L.trims[k])}"><i></i>${n}</button>`).join("")}</div><h4>الحزام</h4>${chips("belt", A.BELTS, L.belt)}`;
      if(tab==="acc") s = `<h4>للراس</h4>${chips("head", A.HEAD_ACC, L.head, "a")}<h4>للرقبة</h4>${chips("neck", A.NECK_ACC, L.neck, "a")}${slider("accSize","حجم الإكسسوار",L.accSize,.7,1.3,.1,sizeTxt)}`;
      if(tab==="motion") s = `<div class="fc-tgs">${toggle("sparkle","لمعة خفيفة",L.sparkle)}${toggle("flow","حركة القماش",L.flow)}</div><p class="fc-note">حركة القماش تخلي التنورة تتمايل ويا المشي. اللمعة هادية وما تومض بقوة.</p><button class="btn ghost small" data-twirl>${FW.FI.spark} خليها تلف</button> <button class="btn ghost small" data-wingsgo>${FW.FI.spark} صممي جناح</button>`;
      opts.innerHTML = s; fillIcons(opts);
      const tw=$("[data-twirl]",opts); if(tw) tw.onclick = twirl;
      const wg=$("[data-wingsgo]",opts); if(wg) wg.onclick = ()=>{ FW.setCur(look,wings,name,id); go("fashion:wings"); };
    }
    bindPanel(opts, ()=>look, (k, commit, rangeEnd) => {
      apply();
      if(commit){ push(); if(!rangeEnd) render(); }
      if(k==="c1"||k==="c2"||k==="pat") dl.emo("thinking", 1200);
    });
    $$("[data-tab]",body).forEach(b=>b.onclick=()=>{ tab=b.dataset.tab; $$("[data-tab]",body).forEach(x=>x.setAttribute("aria-pressed", x===b)); render(); FW.sfx("page"); if(tab==="colors") dl.emo("thinking"); if(tab==="piece") dl.emo("sketch"); });
    $("[data-undo]",body).onclick = () => { if(hi>0){ hi--; restore(); FW.sfx("soft"); status("رجعنا خطوة"); } };
    $("[data-redo]",body).onclick = () => { if(hi<hist.length-1){ hi++; restore(); FW.sfx("soft"); status("رجعت الخطوة"); } };
    nameIn.addEventListener("input", () => { name = nameIn.value.trim(); FW.setCur(look, wings, name, id); });
    $("[data-new]",body).onclick = () => { look = A.BLANK(); wings = Object.assign(A.BLANK_WINGS(), {on:false}); id=null; name=""; nameIn.value=""; apply(); push(); render(); dl.emo("sketch"); status("ورقة جديدة! (تقدرين ترجعين بالتراجع)"); };
    $("[data-tpl]",body).onclick = () => {
      const md = modal(`<div class="fw-modal"><h2>قوالب للبداية</h2><p class="d-note">اختاري قالب وعدّلي عليه براحتج. الخيارات المقفولة تتبدل بأقرب شي مفتوح.</p><div class="fw-tpl">${TEMPLATES.map((t,i)=>{ const f=fromTemplate(t); return `<button data-i="${i}"><span class="fw-mini">${A.dollHTML(f.look, f.wings, {anim:false})}</span><b>${t.n}</b></button>`; }).join("")}</div></div>`, {wide:true});
      $$("[data-i]",md.el).forEach(b=>b.onclick=()=>{ const f=fromTemplate(TEMPLATES[+b.dataset.i]); look=f.look; wings=f.wings; id=null; name=TEMPLATES[+b.dataset.i].n; nameIn.value=name; apply(); push(); render(); md.close(); dl.emo("happy"); status("بدأنا من قالب: "+name); });
    };
    $("[data-cmp]",body).onclick = () => compareModal({name:name||"التصميم الحالي", look, wings});
    $("[data-owl]",body).onclick = () => { FW.sfx("soft"); const md = modal(`<div class="fw-modal fw-owl"><span class="fw-owlart">${A.F.owl()}</span><p>${esc(FW.critique(look, wings))}</p><p class="d-note">البومة تقترح بس — القرار إلج دائماً.</p></div>`); };
    const doSave = asNew => {
      const ask = modal(`<div class="fw-modal"><h2>${asNew?"نسخة جديدة":"حفظ التصميم"}</h2><label class="fw-field"><span>اسم التصميم</span><input data-n maxlength="28" value="${esc(name||"")}" placeholder="مثلاً: فستان الغيمة"></label><div class="row"><button class="btn honey" data-ok>${IC.save} احفظي بالمتحف</button></div></div>`);
      $("[data-ok]",ask.el).onclick = () => { name = $("[data-n]",ask.el).value.trim() || name; const d = FW.saveDesign(look, wings, name, asNew?null:id); id=d.id; name=d.name; nameIn.value=name; ask.close(); dirty=false; refreshHist(); dl.emo("happy"); FW.sfx("ok"); toast("انحفظت بمتحف الإطلالات: "+d.name, "check"); status("محفوظة ✓"); };
    };
    $("[data-save]",body).onclick = () => doSave(false);
    $("[data-saveas]",body).onclick = () => doSave(true);
    function twirl(){ if(!motionOK()){ dl.emo("happy"); return; } const f=$(".fd-flip",dl.el); f.classList.remove("twirl"); void f.offsetWidth; f.classList.add("twirl"); dl.c.rig.flare=1; setTimeout(()=>f.classList.remove("twirl"), 1300); }
    render(); refreshHist();
    if(first) setTimeout(()=>FW.say(seam, "أهلاً بالمشغل! اختاري نوع القطعة، وبعدين لعبي بالألوان."), 600);
    const shelf = FW.gameShelf(body, ["inspire","steps","three"], "ألعاب المشغل", {onOpen:o=>{ $(".fa",body).hidden=o; }});
    return () => { dl.stop(); shelf.destroy(); FW.setCur(look, wings, name, id); };
  });

  /* ---------------- مقارنة تصميمين ---------------- */
  function compareModal(a, preB){
    const S = FW.S;
    const opts = [{id:"__cur", name:a.name, look:a.look, wings:a.wings}].concat(S.designs);
    const md = modal(`<div class="fw-modal"><h2>قارني تصميمين</h2>
      <div class="fw-cmp"><div class="fw-cmpc"><select data-a aria-label="التصميم الأول">${opts.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join("")}</select><div class="fw-cmpd" data-da></div></div>
      <div class="fw-cmpc"><select data-b aria-label="التصميم الثاني">${opts.map((d,i)=>`<option value="${d.id}" ${(preB?d.id===preB:i===1)?"selected":""}>${esc(d.name)}</option>`).join("")}</select><div class="fw-cmpd" data-db></div></div></div>
      <ul class="fw-diff"></ul>${opts.length<2?`<p class="d-note">احفظي تصميم واحد على الأقل حتى تقارنين.</p>`:""}</div>`, {wide:true});
    const find = v => opts.find(d=>d.id===v) || opts[0];
    const draw = () => { const x=find($("[data-a]",md.el).value), y=find($("[data-b]",md.el).value);
      $("[data-da]",md.el).innerHTML = A.dollHTML(x.look, x.wings, {anim:false}); $("[data-db]",md.el).innerHTML = A.dollHTML(y.look, y.wings, {anim:false});
      const diff = []; const L=(k,map)=>{ if(x.look[k]!==y.look[k]) diff.push(`${map[x.look[k]]||x.look[k]} ← → ${map[y.look[k]]||y.look[k]}`); };
      L("type",A.TYPES); L("cut",A.CUTS); L("len",A.LENGTHS); L("sleeve",A.SLEEVES); L("hem",A.HEMS); L("pat",A.PATTERNS);
      if(x.look.fabric!==y.look.fabric) diff.push(`${A.FABRICS[x.look.fabric].n} ← → ${A.FABRICS[y.look.fabric].n}`);
      if(x.look.c1!==y.look.c1) diff.push(`${A.COLORS[x.look.c1][1]} ← → ${A.COLORS[y.look.c1][1]}`);
      if(!!x.wings.on!==!!y.wings.on) diff.push(x.wings.on?"الأول بجناح":"الثاني بجناح");
      $(".fw-diff",md.el).innerHTML = diff.length ? diff.map(d=>`<li>${esc(d)}</li>`).join("") : `<li>نفس التصميم تقريباً!</li>`; };
    $("[data-a]",md.el).onchange = draw; $("[data-b]",md.el).onchange = draw; draw();
  }

  /* ---------------- ورشة الأجنحة ---------------- */
  const WTABS = [["shape","الشكل"],["size","الحجم والفرد"],["color","الألوان"],["pat","النقشة"],["shine","اللمعة والشفافية"],["move","الحركة"]];
  FW.region("wings", (body, {first}) => {
    const S = FW.S;
    let look = Object.assign(A.BLANK(), clone(S.cur.look)), w = Object.assign(A.BLANK_WINGS(), clone(S.cur.wings));
    if(!w.on){ w.on = true; }
    let tab="shape", playing = true;
    const hist=[JSON.stringify(w)]; let hi=0;
    body.innerHTML = `<div class="fa fwg">
      <div class="fa-stage fs-wings"><div class="fwg-sky" aria-hidden="true">${[0,1,2,3,4].map(i=>`<i style="left:${10+i*19}%;--d:${-i*1.3}s"></i>`).join("")}</div><div class="fa-plat"></div><div class="fa-doll"></div>
        <div class="fa-tools"><button class="fw-b sm" data-undo aria-label="تراجع">${IC.undo}</button><button class="fw-b sm" data-redo aria-label="إعادة">${IC.redo}</button><button class="fw-b sm" data-play aria-label="إيقاف حركة الجناح">${IC.pause}</button></div>
        <div class="fa-friends"></div></div>
      <div class="fa-panel"><div class="fwg-on">${toggle("on","الجناح ظاهر",w.on)}</div>
        <div class="fa-tabs" role="tablist">${WTABS.map(([k,n])=>`<button data-tab="${k}" aria-pressed="${k===tab}">${n}</button>`).join("")}</div>
        <div class="fa-opts"></div>
        <div class="fa-acts"><button class="btn honey" data-keep>${IC.check} البسي الجناح بالتصميم</button><button class="btn ghost small" data-save>${IC.save} احفظي التصميم</button></div>
        <p class="fa-status" aria-live="polite"></p></div></div>`;
    fillIcons(body);
    const stage=$(".fa-stage",body), opts=$(".fa-opts",body);
    const dl = FW.doll($(".fa-doll",body), look, w, {cls:"fa-d fwg-d"});
    const seam = FW.friendEl("cbfly","fa-seam", ()=>"الأجنحة تبين أحلى لما لونها قريب من لون الفستان، أو عكسه تماماً!"); $(".fa-friends",body).appendChild(seam);
    const clue = FW.clueEl("wings","fwg-clue"); if(clue) stage.appendChild(clue);
    const ownedW = A.WINGS ? Object.keys(A.WINGS) : [];
    const apply = () => { dl.set(look, w); if(!playing) pauseAnim(); };
    const pauseAnim = () => { const s=$(".fz-back svg",dl.el); try{ playing ? s.unpauseAnimations() : s.pauseAnimations(); }catch(e){} };
    const push = () => { const s=JSON.stringify(w); if(s===hist[hi]) return; hist.splice(hi+1); hist.push(s); hi=hist.length-1; ref(); };
    const ref = () => { $("[data-undo]",body).disabled=hi<=0; $("[data-redo]",body).disabled=hi>=hist.length-1; };
    function render(){
      let s="";
      if(tab==="shape"){ s = `<h4>شكل الجناح</h4>${swatches("shape","w",ownedW,w.shape)}<h4>جناح من تصميمج</h4><div class="fc-chips" data-k="shape"><button data-v="custom" aria-pressed="${w.shape==="custom"}">${FW.FI.spark} ادمجي شكلين</button></div>${w.shape==="custom"?`<h5>الجزء الفوقاني</h5>${chips("top", Object.fromEntries(ownedW.filter(x=>FW.owned("w",x)).map(x=>[x,A.WINGS[x]])), w.top)}<h5>الجزء الجوّاني</h5>${chips("bot", Object.fromEntries(ownedW.filter(x=>FW.owned("w",x)).map(x=>[x,A.WINGS[x]])), w.bot)}`:""}`; }
      if(tab==="size") s = `${slider("size","حجم الجناح",w.size,.7,1.3,.05,sizeTxt)}${slider("spread","فرد الجناح",w.spread,-10,35,1,v=>v+"°")}<h4>عدد الطبقات</h4>${chips("layers",{1:"طبقة",2:"طبقتين",3:"ثلاث"},String(w.layers))}`;
      if(tab==="color") s = `<h4>اللون الأساسي</h4>${palette("c1", w.c1)}<h4>اللون الثاني</h4>${palette("c2", w.c2)}<div class="fc-tgs">${toggle("grad","تدرّج من الوسط",w.grad)}</div>`;
      if(tab==="pat") s = `<h4>نقشة الجناح</h4>${swatches("pat","p",["none","dots","stars","hearts","waves","constellation","leaves","clouds"],w.pat)}`;
      if(tab==="shine") s = `${slider("shine","اللمعة",w.shine,0,1,.05,v=>Math.round(v*100)+"%")}${slider("alpha","الوضوح (عكس الشفافية)",w.alpha,.4,1,.05,v=>Math.round(v*100)+"%")}`;
      if(tab==="move") s = `<h4>الرفرفة</h4>${chips("flap",{none:"ثابت",soft:"هادية",flutter:"سريعة"},w.flap)}${slider("speed","سرعة الرفرفة",w.speed,.5,2,.1,v=>v<.8?"بطيئة":v>1.4?"سريعة":"وسط")}<div class="fc-tgs">${toggle("trail","أثر ضوئي",w.trail)}</div><p class="fc-note">${motionOK()?"":"الحركة مخفّضة، فالجناح يبقى ثابت."}</p>`;
      opts.innerHTML = s;
    }
    bindPanel(opts, ()=>w, (k, commit, rangeEnd) => { if(k==="layers") w.layers=+w.layers; if(k==="shape" && w.shape!=="custom"){ w.top=w.shape; w.bot=w.shape; } apply(); if(commit){ push(); if(!rangeEnd) render(); } });
    $(".fwg-on",body).onclick = e => { const b=e.target.closest("[data-tg]"); if(!b) return; w.on=!w.on; b.setAttribute("aria-pressed", w.on); apply(); push(); FW.sfx("soft"); };
    $$("[data-tab]",body).forEach(b=>b.onclick=()=>{ tab=b.dataset.tab; $$("[data-tab]",body).forEach(x=>x.setAttribute("aria-pressed",x===b)); render(); });
    $("[data-undo]",body).onclick=()=>{ if(hi>0){ hi--; w=JSON.parse(hist[hi]); apply(); render(); ref(); } };
    $("[data-redo]",body).onclick=()=>{ if(hi<hist.length-1){ hi++; w=JSON.parse(hist[hi]); apply(); render(); ref(); } };
    $("[data-play]",body).onclick = e => { playing=!playing; pauseAnim(); e.currentTarget.innerHTML = playing?IC.pause:FW.FI.play; e.currentTarget.setAttribute("aria-label", playing?"إيقاف حركة الجناح":"تشغيل حركة الجناح"); };
    $("[data-keep]",body).onclick = () => { FW.setCur(look, w); FW.sfx("ok"); dl.emo("happy"); $(".fa-status",body).textContent = "الجناح صار جزء من التصميم الحالي ✓"; };
    $("[data-save]",body).onclick = () => { const d = FW.saveDesign(look, w, S.cur.name||"", S.cur.id); dl.emo("happy"); toast("انحفظ بالمتحف: "+d.name, "check"); };
    render(); ref();
    if(first) setTimeout(()=>FW.say(seam, "هنا تصممين الأجنحة. الجناح دايماً يبقى ورا إيلاف، ما يغطي وجهها ولا ملابسها."), 500);
    const shelf = FW.gameShelf(body, ["wingsecret"], "لعبة الورشة", {onOpen:o=>{ $(".fa",body).hidden=o; }});
    return () => { dl.stop(); shelf.destroy(); };
  });

  /* ---------------- غرفة القياس ---------------- */
  const ANGLES = [["front","قدّام"],["l3","ربع يسار"],["r3","ربع يمين"],["mirror","بالمراية"],["top","قريب: الفوق"],["hem","قريب: الحافة"]];
  FW.region("fitting", (body, {first}) => {
    const S = FW.S;
    let pick = "__cur";
    const looks = () => [{id:"__cur", name:S.cur.name||"التصميم الحالي", look:S.cur.look, wings:S.cur.wings}].concat(S.designs);
    body.innerHTML = `<div class="ft">
      <div class="ft-pick"><span>جربي:</span><div class="ft-list"></div></div>
      <div class="ft-room"><div class="ft-mirror"><div class="ft-glass"></div></div><div class="ft-floor"></div><div class="ft-walk"></div><div class="ft-friends"></div></div>
      <div class="ft-ctrl">
        <div class="fc-chips ft-angles" role="group" aria-label="الزاوية">${ANGLES.map(([k,n],i)=>`<button data-a="${k}" aria-pressed="${i===0}">${n}</button>`).join("")}</div>
        <div class="ft-row"><span class="ft-lbl">تمشّي:</span><div class="ft-pad"></div><button class="btn ghost small" data-spin>${FW.FI.spark} لفّة</button></div>
        <details class="ft-quick"><summary>تعديل سريع</summary><div class="ft-qbody"></div></details>
        <p class="fa-status" aria-live="polite"></p>
      </div></div>`;
    const room=$(".ft-room",body), walk=$(".ft-walk",body);
    let cur = looks()[0];
    walk.style.left = "50%";
    let vx = 0;
    const pad = World.pad($(".ft-pad",body), ["left","right"]);
    const dl = FW.doll(walk, cur.look, cur.wings, {cls:"ft-d", tick:(dt,c)=>{
      const dir = (pad.held.has("right")?1:0) - (pad.held.has("left")?1:0);
      vx += ((dir*22) - vx) * Math.min(1, dt*6);
      if(Math.abs(vx)>.2){ let x=parseFloat(walk.style.left)+vx*dt; x=Math.max(14,Math.min(86,x)); walk.style.left=x+"%"; c.x += vx*dt*1.6; c.face = vx<0?-1:1; walk.classList.toggle("fl", c.face<0); }
    }});
    const listEl = $(".ft-list",body);
    const drawList = () => { listEl.innerHTML = looks().map(d=>`<button data-id="${d.id}" aria-pressed="${d.id===pick}">${esc(d.name)}</button>`).join(""); };
    drawList();
    listEl.onclick = e => { const b=e.target.closest("[data-id]"); if(!b) return; pick=b.dataset.id; cur=looks().find(d=>d.id===pick); dl.set(cur.look, cur.wings); drawList(); quick(); FW.sfx("soft"); dl.emo("happy"); };
    $(".ft-angles",body).onclick = e => { const b=e.target.closest("[data-a]"); if(!b) return; $$(".ft-angles [data-a]",body).forEach(x=>x.setAttribute("aria-pressed",x===b)); room.dataset.angle=b.dataset.a; FW.sfx("soft"); };
    $("[data-spin]",body).onclick = () => { if(!motionOK()) return; const f=$(".fd-flip",dl.el); f.classList.remove("twirl"); void f.offsetWidth; f.classList.add("twirl"); dl.c.rig.flare=1; setTimeout(()=>f.classList.remove("twirl"),1300); };
    // تعديل سريع: يطبق على نسخة العمل الحالية
    function quick(){
      const q=$(".ft-qbody",body), L=cur.look;
      q.innerHTML = `<h5>القصّة</h5>${chips("cut",A.CUTS,L.cut)}<h5>الطول</h5>${chips("len",A.LENGTHS,L.len)}<h5>المقاس</h5>${chips("size",{S:"صغير",M:"وسط",L:"كبير"},L.size)}<h5>اللون</h5>${palette("c1",L.c1)}<h5>إكسسوار الراس</h5>${chips("head",A.HEAD_ACC,L.head,"a")}<p class="fc-note">التعديل يصير على «التصميم الحالي»، واحفظيه من المشغل أو هنا.</p><button class="btn honey small" data-qsave>${IC.save} احفظي</button>`;
      fillIcons(q);
      $("[data-qsave]",q).onclick = () => { const d=FW.saveDesign(cur.look, cur.wings, cur.name==="التصميم الحالي"?"":cur.name, pick==="__cur"?S.cur.id:pick); pick=d.id; cur=looks().find(x=>x.id===pick)||cur; drawList(); toast("انحفظت: "+d.name,"check"); dl.emo("happy"); };
    }
    const qb = $(".ft-qbody",body);
    bindPanel(qb, ()=>{ if(pick!=="__cur"){ const d=FW.designById(pick); FW.setCur(d.look, d.wings, d.name, d.id); pick="__cur"; cur=looks()[0]; drawList(); } return cur.look; }, (k, commit) => { FW.setCur(cur.look, cur.wings); dl.set(cur.look, cur.wings); if(commit) quick(); });
    quick();
    const fr=$(".ft-friends",body); const cb=FW.friendEl("cbfly","ft-cb", ()=>"جربي ربع يمين وربع يسار… كل زاوية تبين تفصيلة!"); fr.appendChild(cb);
    if(first) setTimeout(()=>FW.say(cb, "هنا تجربين الإطلالة من كل زاوية، وتتمشين حتى تشوفين حركة القماش."), 500);
    const shelf = FW.gameShelf(body, ["dressup"], "لعبة غرفة القياس", {onOpen:o=>{ $(".ft",body).hidden=o; }});
    return () => { dl.stop(); pad.destroy(); shelf.destroy(); };
  });

  /* ---------------- متحف الإطلالات ---------------- */
  FW.region("museum", (body) => {
    const S = FW.S;
    let tab = "looks", cmp = [];
    body.innerHTML = `<div class="fmu"><div class="fmu-hall" aria-hidden="true"></div>
      <div class="seg fmu-tabs" role="tablist"><button data-t="looks" aria-pressed="true">الإطلالات</button><button data-t="photos" aria-pressed="false">الصور</button><button data-t="seasons" aria-pressed="false">صفحات المواسم</button><button data-t="awards" aria-pressed="false">الجوائز</button></div>
      <div class="fmu-body"></div></div>`;
    const box = $(".fmu-body",body);
    const urls = [];
    const fmtD = t => { try{ return new Date(t).toLocaleDateString("ar-IQ",{day:"numeric",month:"long"}); }catch(e){ return ""; } };
    const card = d => `<div class="fmu-card" data-id="${d.id}"><div class="fmu-frame">${A.dollHTML(d.look, d.wings, {anim:false, label:d.name})}</div><b>${esc(d.name)}</b><small>${fmtD(d.at)}${d.season&&FSeasons()[d.season]?` · ${FSeasons()[d.season].n}`:""}${d.shows?` · ${d.shows} عرض`:""}</small>
      <div class="fmu-acts"><button class="btn honey small" data-edit>${IC.pen} عدّلي</button><button class="fw-b sm" data-dup aria-label="نسخة">${FW.FI.copy}</button><button class="fw-b sm" data-ren aria-label="تغيير الاسم">${IC.pen}</button><button class="fw-b sm" data-cmp aria-label="اختاري للمقارنة" aria-pressed="${cmp.includes(d.id)}">${FW.FI.compare}</button><button class="fw-b sm" data-del aria-label="حذف">${IC.trash}</button></div></div>`;
    async function render(){
      urls.forEach(u=>URL.revokeObjectURL(u)); urls.length=0;
      if(tab==="looks"){
        box.innerHTML = S.designs.length ? `<p class="fc-note">${S.designs.length} إطلالة محفوظة. اختاري اثنين بزر المقارنة حتى تقارنينهم.</p><div class="fmu-grid">${S.designs.map(card).join("")}</div>` : `<div class="fmu-empty"><p>المتحف ينتظر أول تصميم!</p><button class="btn honey" data-go>${IC.pen} روحي للمشغل</button></div>`;
        fillIcons(box);
      }
      if(tab==="photos"){
        const ph = (await FW.DB.all("photos")).sort((a,b)=>b.at-a.at);
        box.innerHTML = ph.length ? `<div class="fmu-photos">${ph.map(p=>{ const u=URL.createObjectURL(p.blob); urls.push(u); return `<button class="fmu-ph" data-ph="${p.id}"><img src="${u}" alt="${esc(p.name||"صورة")}"><small>${esc(p.name||"")}</small></button>`; }).join("")}</div>` : `<div class="fmu-empty"><p>ماكو صور بعد. صوّري إطلالتج باستوديو الصور أو بعد العرض.</p><button class="btn honey" data-gophoto>${FW.FI.camera} استوديو الصور</button></div>`;
        $$("[data-ph]",box).forEach(b=>b.onclick=()=>{ const p=ph.find(x=>x.id===b.dataset.ph); const u=$("img",b).src;
          const md=modal(`<div class="fw-modal"><img class="fmu-big" src="${u}" alt=""><div class="row"><button class="btn honey" data-dl>${IC.save} نزّلي الصورة</button><button class="btn danger small" data-x>${IC.trash} احذفي</button></div></div>`, {wide:true});
          $("[data-dl]",md.el).onclick=()=>offerDownload((p.name||"dar-elaf")+".png", p.blob, ()=>toast("ما گدرت أنزّل الصورة","close"));
          $("[data-x]",md.el).onclick=()=>confirmBox("تحذفين الصورة؟","احذفي",()=>{ FW.DB.del("photos",p.id).then(()=>{ md.close(); render(); }); }); });
        const gp=$("[data-gophoto]",box); if(gp) gp.onclick=()=>go("fashion:photo");
      }
      if(tab==="seasons"){
        const SE = FSeasons(); const keys = Object.keys(SE).filter(k=>S.seasons.done[k] || S.seasons.active===k || S.designs.some(d=>d.season===k));
        box.innerHTML = keys.length ? keys.map(k=>{ const ds=S.designs.filter(d=>d.season===k); return `<section class="fmu-season" style="--sa:${SE[k].c1};--sb:${SE[k].c2}"><h3>${esc(SE[k].n)}</h3><p>${S.seasons.done[k]?"✓ تحدي الموسم مكتمل":"الموسم شغّال"} · ${ds.length} تصميم</p><div class="fmu-grid sm">${ds.map(card).join("")||`<p class="fc-note">صممي شي والموسم شغّال حتى ينضاف هنا.</p>`}</div></section>`; }).join("") : `<div class="fmu-empty"><p>صفحات المواسم تتعبى لما تشاركين بمواسم ساحة المهرجان.</p><button class="btn honey" data-gofest>ساحة المهرجان</button></div>`;
        fillIcons(box); const gf=$("[data-gofest]",box); if(gf) gf.onclick=()=>go("fashion:festival");
      }
      if(tab==="awards"){
        const aw = Object.entries(S.awards||{});
        box.innerHTML = `<p class="fc-note">جوائز مرحة من العروض — كلها للفرح، ماكو مسابقة.</p>` + (aw.length ? `<div class="fmu-aw">${aw.map(([k,a])=>`<div class="fmu-a">${FShow.awardArt(k)}<b>${esc(a.n)}</b><small>${esc(a.look||"")}</small></div>`).join("")}</div>` : `<div class="fmu-empty"><p>بعد أول عرض بالمسرح تظهر الجوائز هنا.</p><button class="btn honey" data-gostage>مسرح العرض</button></div>`);
        const gs=$("[data-gostage]",box); if(gs) gs.onclick=()=>go("fashion:stage");
      }
      const g=$("[data-go]",box); if(g) g.onclick=()=>go("fashion:atelier");
    }
    box.addEventListener("click", e => {
      const c = e.target.closest(".fmu-card"); if(!c) return; const d = FW.designById(c.dataset.id); if(!d) return;
      if(e.target.closest("[data-edit]")){ FW.setCur(d.look, d.wings, d.name, d.id); FW.sfx("page"); go("fashion:atelier"); }
      else if(e.target.closest("[data-dup]")){ const n = FW.saveDesign(d.look, d.wings, d.name+" (نسخة)"); FW.sfx("ok"); toast("انعملت نسخة: "+n.name, "check"); render(); }
      else if(e.target.closest("[data-ren]")){ const md=modal(`<div class="fw-modal"><h2>اسم جديد</h2><label class="fw-field"><span>الاسم</span><input data-n maxlength="28" value="${esc(d.name)}"></label><button class="btn honey" data-ok>${IC.check} تم</button></div>`); fillIcons(md.el); $("[data-ok]",md.el).onclick=()=>{ const v=$("[data-n]",md.el).value.trim(); if(v){ d.name=v; if(S.cur.id===d.id) S.cur.name=v; FW.save(); } md.close(); render(); }; }
      else if(e.target.closest("[data-del]")){ confirmBox(`تحذفين «${d.name}» من المتحف؟`, "احذفي", () => { S.designs = S.designs.filter(x=>x.id!==d.id); if(S.cur.id===d.id) S.cur.id=null; FW.save(); render(); }); }
      else if(e.target.closest("[data-cmp]")){ if(cmp.includes(d.id)) cmp=cmp.filter(x=>x!==d.id); else cmp.push(d.id); if(cmp.length>2) cmp.shift(); if(cmp.length===2){ const a=FW.designById(cmp[0]); compareModal({name:a.name, look:a.look, wings:a.wings}, cmp[1]); cmp=[]; } render(); }
    });
    $$("[data-t]",body).forEach(b=>b.onclick=()=>{ tab=b.dataset.t; $$("[data-t]",body).forEach(x=>x.setAttribute("aria-pressed",x===b)); render(); FW.sfx("page"); });
    render();
    const shelf = FW.gameShelf(body, ["memory"], "لعبة المتحف", {onOpen:o=>{ $(".fmu",body).hidden=o; }});
    return () => { urls.forEach(u=>URL.revokeObjectURL(u)); shelf.destroy(); };
  });
  const FSeasons = () => (typeof FShow!=="undefined" && FShow.SEASONS) || {};

  return { chips, palette, swatches, slider, toggle, bindPanel, TEMPLATES, fromTemplate, compareModal };
})();
