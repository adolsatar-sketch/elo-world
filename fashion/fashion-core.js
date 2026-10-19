/* =====================================================================
   دار إيلاف — النواة: الحفظ، المكافآت، المناطق، الخريطة، المدخل،
   الأصدقاء، الدمية المتحركة، وإطار الألعاب المشترك.
   كل شي محفوظ على الجهاز: Store("fashion") + IndexedDB للصور.
   ===================================================================== */
const FW = (() => {
  /* ---------------- أيقونات خاصة بالدار ---------------- */
  const FI = {
    hanger:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7a2 2 0 112-2c0 1.4-2 1.6-2 3.2L3 15.5c-.8.6-.4 1.8.6 1.8h16.8c1 0 1.4-1.2.6-1.8L12 8.2"/></svg>',
    camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>',
    door:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V5a7 4 0 0114 0v16M3 21h18"/><circle cx="15" cy="13" r="1"/></svg>',
    compare:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="7" height="16" rx="2"/><rect x="14" y="4" width="7" height="16" rx="2"/></svg>',
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>'
  };
  const fic = k => FI[k] || IC[k] || "";

  /* ---------------- الحالة ---------------- */
  const DEF = () => ({
    v:1, intro:0, visited:{}, last:"atelier",
    have:{c:{}, p:{}, f:{}, w:{}, a:{}, bg:{}, pose:{}},
    cur:{look:FArt.BLANK(), wings:FArt.BLANK_WINGS(), name:"", id:null},
    designs:[], clues:{}, chest:false, games:{}, puzzles:{}, explore:{}, shows:0, awards:{},
    seasons:{done:{}, active:null}, show:null, opts:{music:false, sfx:true}, owl:0, from:"map", stats:{}
  });
  let S = null;
  const load = () => { if(S) return S; S = Object.assign(DEF(), Store.get("fashion", {})); const d=DEF(); for(const k in d) if(S[k]==null) S[k]=d[k]; for(const k in d.have) if(!S.have[k]) S.have[k]={}; return S; };
  let saveT; const save = () => { clearTimeout(saveT); saveT = setTimeout(()=>Store.set("fashion", S), 150); };
  const flush = () => { clearTimeout(saveT); if(S) Store.set("fashion", S); };
  window.addEventListener("pagehide", flush);

  const DB = (() => {
    let p=null;
    const open = () => p || (p = new Promise((res, rej) => { try{ const r=indexedDB.open("fashion-media", 1); r.onupgradeneeded=()=>{ r.result.createObjectStore("photos",{keyPath:"id"}); }; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }catch(e){ rej(e); } }));
    const tx = (st, mode, fn) => open().then(db => new Promise((res, rej) => { const t=db.transaction(st, mode); const r=fn(t.objectStore(st)); t.oncomplete=()=>res(r && r.result!==undefined ? r.result : r); t.onerror=()=>rej(t.error); }));
    return { all:st=>tx(st,"readonly",s=>s.getAll()).catch(()=>[]), put:(st,o)=>tx(st,"readwrite",s=>s.put(o)), del:(st,id)=>tx(st,"readwrite",s=>s.delete(id)) };
  })();

  /* ---------------- المكافآت والفتح ---------------- */
  const KIND = {
    c:{n:"لون", all:()=>FArt.COLORS, start:FArt.START_COLORS, name:id=>FArt.COLORS[id][1]},
    p:{n:"نقشة", all:()=>FArt.PATTERNS, start:FArt.START_PATTERNS, name:id=>FArt.PATTERNS[id]},
    f:{n:"قماش", all:()=>FArt.FABRICS, start:FArt.START_FABRICS, name:id=>FArt.FABRICS[id].n},
    w:{n:"جناح", all:()=>FArt.WINGS, start:FArt.START_WINGS, name:id=>"جناح "+FArt.WINGS[id]},
    a:{n:"إكسسوار", all:()=>Object.assign({}, FArt.HEAD_ACC, FArt.NECK_ACC), start:FArt.START_ACC, name:id=>FArt.HEAD_ACC[id]||FArt.NECK_ACC[id]},
    bg:{n:"خلفية مسرح", all:()=>STAGE_BG, start:["curtain","garden"], name:id=>STAGE_BG[id].n},
    pose:{n:"حركة عرض", all:()=>POSES, start:["wave","twirl"], name:id=>POSES[id].n}
  };
  const STAGE_BG = {
    curtain:{n:"ستارة المخمل", a:"#7A2236", b:"#C8425A"}, garden:{n:"حديقة الورد", a:"#9DBF8E", b:"#F7CFDA"},
    night:{n:"سما الليل", a:"#23264E", b:"#5E5A9E"}, clouds:{n:"فوق الغيوم", a:"#A8D2EE", b:"#FBF3FF"},
    crystal:{n:"قاعة البلّور", a:"#BFE6F0", b:"#E9E1F2"}, sea:{n:"شاطئ الصدف", a:"#66C6C2", b:"#F9E7C8"}, lanterns:{n:"ساحة الفوانيس", a:"#3E2A4E", b:"#E8A64A"}
  };
  const POSES = {
    wave:{n:"تلويحة"}, twirl:{n:"لفّة"}, curtsy:{n:"انحناءة لطيفة"}, sparkle:{n:"يدين للسما"}, hop:{n:"قفزة فرح"}, heart:{n:"وقفة قلب"}
  };
  const POSE_ORDER = ["curtsy","sparkle","hop","heart"];
  const owned = (k, id) => { load(); const K=KIND[k]; return !!(K && (K.start.includes(id) || S.have[k][id])); };
  const list = (k, onlyOwned) => Object.keys(KIND[k].all()).filter(id => !onlyOwned || owned(k,id));
  // يمنح مكافأة مرة وحدة بس، ويرجع true إذا جديدة
  function grant(k, id, why, quiet){
    load(); if(!KIND[k] || owned(k,id)) return false;
    S.have[k][id] = Date.now(); save();
    if(!quiet) rewardCard(k, id, why);
    return true;
  }
  const rwParse = r => { if(!r) return null; const [k,id]=r.split(":"); return {k,id}; };
  // عيّنة صغيرة لأي مكافأة
  function swatch(k, id, size=56){
    const s = (inner, vb="0 0 60 60") => `<svg viewBox="${vb}" width="${size}" height="${size}" class="fs-sw">${inner}</svg>`;
    if(k==="c") return s(`<circle cx="30" cy="30" r="24" fill="${FArt.col(id)}" stroke="${FArt.shade(FArt.col(id),-.35)}" stroke-width="2.4"/><path d="M18 22a14 14 0 0112-8" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    if(k==="p"){ const u=FArt.uid(); return s(`<defs>${FArt.patternDef(u, id, "#8E5A9E", .8)}</defs><rect x="6" y="6" width="48" height="48" rx="10" fill="#F7E6EE" stroke="#B98EA6" stroke-width="2"/><rect x="6" y="6" width="48" height="48" rx="10" fill="url(#${u})"/>`); }
    if(k==="f"){ const u=FArt.uid(); return s(`<defs><clipPath id="${u}k"><path d="M8 14q22-10 44 0v32q-22 10-44 0z"/></clipPath>${FArt.fabricDefs(u, id, "#C9B6E8")}</defs><path d="M8 14q22-10 44 0v32q-22 10-44 0z" fill="#C9B6E8" stroke="#7E6AAE" stroke-width="2"/>${FArt.fabricDefs(u,id,"#C9B6E8")?`<rect x="0" y="0" width="60" height="60" fill="url(#${u})" clip-path="url(#${u}k)"/>`:""}<path d="M8 14q22-10 44 0v32q-22 10-44 0z" fill="none" stroke="#7E6AAE" stroke-width="2"/>`); }
    if(k==="w") return `<svg viewBox="-10 -10 380 390" width="${size}" height="${size}" class="fs-sw">${FArt.wings(Object.assign(FArt.BLANK_WINGS(), {on:true, shape:id, flap:"none", size:.62}), {anim:false})}</svg>`;
    if(k==="a"){ const look=Object.assign(FArt.BLANK(),{head:FArt.HEAD_ACC[id]?id:"none", neck:FArt.NECK_ACC[id]?id:"none", c1:"rose", c2:"lilac"}); const inner = FArt.HEAD_ACC[id] ? FArt.headAcc(look).replace(/^<svg[^>]*>|<\/svg>$/g,"") : `<g>${FArt.bodice(look).replace(/^<svg[^>]*>|<\/svg>$/g,"")}</g>`; return `<svg viewBox="${FArt.HEAD_ACC[id]?"40 -14 290 130":"130 170 110 90"}" width="${size}" height="${size}" class="fs-sw">${inner}</svg>`; }
    if(k==="bg"){ const b=STAGE_BG[id]; return s(`<rect x="4" y="8" width="52" height="44" rx="8" fill="${b.a}"/><path d="M4 40q26-14 52 0v4a8 8 0 01-8 8H12a8 8 0 01-8-8z" fill="${b.b}"/><circle cx="44" cy="20" r="5" fill="#FFF3C8" opacity=".9"/>`); }
    if(k==="pose") return s(`<circle cx="30" cy="30" r="24" fill="#F7E6EE" stroke="#B98EA6" stroke-width="2"/><path d="M30 16a4 4 0 110 8 4 4 0 010-8zM30 25v14M30 39l-6 10M30 39l6 10M30 28l${id==="sparkle"?"-9 -9M30 28l9 -9":id==="wave"?"-9 4M30 28l9 -9":"-10 6M30 28l10 6"}" stroke="#8E5A9E" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    return "";
  }
  const kindLabel = (k, id) => `${KIND[k].n}: ${KIND[k].name(id)}`;
  function rewardCard(k, id, why){
    sfx("ok");
    const el = h(`<div class="fs-reward" role="status"><div class="fs-rw-in">${swatch(k,id,70)}<div><small>${esc(why||"مكافأة جديدة")}</small><b>${esc(kindLabel(k,id))}</b><span>انضافت لخزانة الدار</span></div></div></div>`);
    document.body.appendChild(el); setTimeout(()=>el.classList.add("out"), 3000); setTimeout(()=>el.remove(), 3500);
  }

  /* ---------------- صوت ---------------- */
  const FTH = {
    intro:{root:62, scale:[0,2,4,7,9,11], tempo:70, chords:[0,5,3,4], motif:[4,null,5,null,7,null,null,null, 9,null,7,null,4,null,null,null]},
    map:{root:65, scale:[0,2,4,5,7,9,11], tempo:96, chords:[0,3,4,0], motif:[0,2,4,null,7,null,4,null, 5,4,2,null,0,null,null,null]},
    atelier:{root:60, scale:[0,2,4,5,7,9,11], tempo:84, chords:[0,5,3,4], motif:[4,null,2,null,0,null,2,4, 5,null,4,null,2,null,null,null]},
    stage:{root:64, scale:[0,2,4,7,9], tempo:112, chords:[0,3,1,4], motif:[0,2,4,7,4,2,4,null, 7,9,7,4,2,0,2,null]},
    dream:{root:67, scale:[0,2,4,6,7,9,11], tempo:74, chords:[0,4,5,3], motif:[0,null,4,null,7,null,6,null, 4,null,2,null,0,null,null,null]},
    night:{root:57, scale:[0,3,5,7,10], tempo:66, chords:[0,2,3,1], motif:[4,null,null,3,null,null,2,null, 3,null,null,null,0,null,null,null]},
    party:{root:67, scale:[0,2,4,7,9], tempo:124, chords:[0,3,4,3], motif:[0,4,7,4,9,7,4,2, 4,7,9,12,9,7,4,null]}
  };
  function music(theme){ load(); TAudio.setOpts({music:S.opts.music, sfx:S.opts.sfx, vol:.55}); if(!S.opts.music){ TAudio.stop(); return; } TAudio.unlock(); TAudio.play("fashion", theme, "explore", FTH[theme]||FTH.map); }
  const sfx = n => { load(); if(S.opts.sfx){ TAudio.setOpts({music:S.opts.music, sfx:true}); TAudio.unlock(); TAudio.sfx(n); } };

  /* ---------------- المناطق ---------------- */
  const REG = {
    atelier:{n:"مشغل إيلاف", sub:"تصميم الأزياء", x:50, y:46, w:15, th:"atelier"},
    wings:{n:"ورشة الأجنحة", sub:"أجنحة تطير", x:21, y:27, w:13, th:"dream"},
    fabrics:{n:"قاعة الأقمشة والألوان", sub:"خامات وألغاز", x:79, y:26, w:14, th:"atelier"},
    fitting:{n:"غرفة القياس", sub:"جرّبي من كل زاوية", x:30, y:64, w:12, th:"atelier"},
    backstage:{n:"الكواليس", sub:"جهّزي العرض", x:67, y:66, w:13, th:"stage"},
    stage:{n:"مسرح العرض الكبير", sub:"العرض النهائي", x:87, y:51, w:16, th:"stage"},
    museum:{n:"متحف الإطلالات", sub:"تصاميمج المحفوظة", x:50, y:16, w:13, th:"dream"},
    photo:{n:"استوديو الصور", sub:"لقطة للذكرى", x:12, y:52, w:12, th:"map"},
    secret:{n:"غرفة الأسرار", sub:"خامات نادرة", x:93, y:13, w:10, th:"night", need:()=>Object.keys(S.clues).length>=4, hint:"مقفولة… أكو أربع خيوط ذهبية مخبّاية بالمشغل، والورشة، والكواليس، والاستوديو. لگيها كلها حتى تنفتح."},
    festival:{n:"ساحة المهرجان", sub:"مواسم وفعاليات", x:46, y:84, w:15, th:"party"}
  };
  const renderers = {};
  const region = (id, fn) => { renderers[id] = fn; };
  const isOpen = id => { load(); const r=REG[id]; return !r.need || r.need(); };

  /* ---------------- الخيوط الذهبية (أماكن مخفية) ---------------- */
  const CLUES = {atelier:"crystal", wings:"phoenix", backstage:"starburst", photo:"rainbowwing"};
  function clueEl(regionId, cls=""){
    load(); if(S.clues[regionId]) return null;
    const el = h(`<button class="fs-clue ${cls}" aria-label="شي يلمع">${FArt.svg?`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="11" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2.4"/><path d="M12 20c5-6 11 6 16 0" stroke="#9C7A2E" stroke-width="2" fill="none"/><path d="M28 12l6-6" stroke="#D9AE4E" stroke-width="2.4" stroke-linecap="round"/></svg>`:""}</button>`);
    el.onclick = e => { e.stopPropagation(); if(S.clues[regionId]) return; S.clues[regionId]=Date.now(); save(); el.classList.add("got"); setTimeout(()=>el.remove(), 700); sfx("sparkle");
      const n = Object.keys(S.clues).length;
      toast(`لگيتي خيط ذهبي! (${n} من 4)`, "star");
      setTimeout(()=>grant("w", CLUES[regionId], "مكان مخفي"), 900);
      if(n>=4) setTimeout(()=>toast("انفتحت غرفة الأسرار بالخريطة!", "lock"), 2400); };
    return el;
  }

  /* ---------------- الأصدقاء ---------------- */
  const FRIENDS = {
    seam:{n:"الفراشة الخيّاطة", art:()=>FArt.F.seam(), lines:["هالقماش ينطوي بنعومة… جربيه بقصة واسعة.","عندي إبرة وخيط لكل فكرة!","الألوان الهادية تحب النقشات الصغيرة.","لا تنسين الحافة! تغيّر شكل الفستان كله."]},
    bird:{n:"عصفورة الدعوات", art:()=>FArt.F.bird(), lines:["عندي دعوات للعرض! منو جاي؟","طرت فوق المسرح، الكراسي تنتظر.","وصّلت رسالة للغابة: عرض جديد قريب!"]},
    owl:{n:"البومة الناقدة", art:()=>FArt.F.owl(), lines:["هممم… فكرة لطيفة. شنو لو جربتي لون ثاني بالحافة؟","أنا ما أحكم، بس أساعد تشوفين.","التصميم الحلو يحچي حكاية. شنو حكاية إطلالتج؟"]},
    mouse:{n:"الفأر أبو الأدوات", art:()=>FArt.F.mouse(), lines:["عندي مقص صغير وكشتبان، تحتاجين شي؟","إذا غلطتي، زر التراجع صديقج!","رتبت الإبر حسب الألوان. شوفي شلون حلوة!"]},
    rabbit:{n:"الأرنب مدير الكواليس", art:()=>FArt.F.rabbit(), lines:["دقيقتين للعرض! وين الفيونكة؟","الأضوية جاهزة، الموسيقى جاهزة… أنتِ جاهزة؟","هدوء بالكواليس رجاءً… بس بلطف."]},
    cbfly:{n:"فراشات الألوان", art:()=>FArt.F.cbfly("#C9B6E8"), lines:["الليلكي يحب الذهبي!","الوردي والنعناعي أصدقاء.","الأزرق البحري يخلي الأبيض يلمع."]}
  };
  const lastLine = {};
  function friendLine(id){ const L=FRIENDS[id].lines; let i; do{ i=Math.floor(Math.random()*L.length); }while(L.length>1 && i===lastLine[id]); lastLine[id]=i; return L[i]; }
  function friendEl(id, cls="", onTap){
    const el = h(`<button class="ff ff-${id} ${cls}" aria-label="${FRIENDS[id].n}"><span class="ff-art">${FRIENDS[id].art()}</span><span class="ff-bub" hidden></span></button>`);
    el.onclick = e => { e.stopPropagation(); sfx("soft"); say(el, onTap ? (onTap()||friendLine(id)) : friendLine(id)); };
    return el;
  }
  function say(el, text, ms=3400){ const b=$(".ff-bub",el); if(!b) return; b.textContent=text; b.hidden=false; el.classList.remove("hop"); void el.offsetWidth; el.classList.add("hop"); clearTimeout(b._t); b._t=setTimeout(()=>b.hidden=true, ms); }

  // رأي البومة: لطيف ودايماً بيه اقتراح
  function critique(look, w){
    const c1=FArt.col(look.c1), c2=FArt.col(look.c2), d=Math.abs(FArt.lum(c1)-FArt.lum(c2));
    const good = [], tip = [];
    if(d>.25) good.push("التباين بين اللونين واضح وحلو"); else tip.push("لون ثاني أفتح أو أغمق راح يبيّن التفاصيل أكثر");
    if(look.pat!=="none" && look.fabric!=="cotton") good.push("النقشة ويا القماش متناغمين");
    if(look.pat==="none" && !Object.keys(look.trims||{}).some(k=>look.trims[k])) tip.push("جربي تطريز أو شريط بالحافة");
    if(w && w.on) good.push("الجناح يكمّل الحكاية"); else tip.push("جناح خفيف ممكن يخلي الإطلالة تطير");
    if(look.head!=="none" || look.neck!=="none") good.push("الإكسسوار لمسة ذكية");
    if(look.belt==="none") tip.push("حزام ناعم يحدد الخصر");
    const g = good.length ? good[Math.floor(Math.random()*good.length)] : "فكرتج واضحة";
    const t = tip.length ? tip[Math.floor(Math.random()*tip.length)] : "كل شي بمكانه… يمكن جربي حركة عرض جديدة";
    return `هوو… ${g}. وإذا تحبين: ${t}.`;
  }

  /* ---------------- الدمية المتحركة ---------------- */
  // ترجع {el, c, set, stop} — إيلاف بالإطلالة، تتنفس وتتحرك بهدوء
  function doll(box, look, wings, opts={}){
    const el = h(`<div class="fd ${opts.cls||""}" style="--h:${opts.h||1}"><div class="fd-flip">${FArt.dollHTML(look, wings, opts)}</div><span class="fd-emo" hidden></span></div>`);
    box.appendChild(el);
    const c = {who:"elaf", el, x:opts.x??50, y:86, face:1, anim:"idle"};
    TRig.attach(c, el);
    const d = $(".fdoll", el);
    let raf=0, last=performance.now(), alive=true, paused=false;
    const loop = now => { if(!alive) return; const dt=Math.min(.05,(now-last)/1000); last=now;
      if(!paused){ opts.tick && opts.tick(dt, c); TRig.update(c, dt, !motionOK() || opts.calm); if(opts.noLean) c.rig.rig.style.transform = `translateY(${(-Math.abs(Math.sin(c.rig.ph))*1.6*c.rig.g).toFixed(2)}%)`; opts.post && opts.post(dt, c, d); FArt.dollSync(d); }
      raf=requestAnimationFrame(loop); };
    raf=requestAnimationFrame(loop);
    return { el, c, d,
      set(l, w, o){ FArt.dollSet(d, l, w, o); FArt.dollSync(d); },
      emo(kind, ms=1800){ const e=$(".fd-emo",el); e.className="fd-emo fd-"+kind; e.innerHTML=EMO[kind]||""; e.hidden=false; clearTimeout(e._t); e._t=setTimeout(()=>e.hidden=true, ms);
        if(kind==="happy"){ TRig.crouch(c,.12); el.classList.remove("hop"); void el.offsetWidth; el.classList.add("hop"); }
        if(kind==="surprised"){ el.classList.remove("jolt"); void el.offsetWidth; el.classList.add("jolt"); } },
      pause(p){ paused=p; }, stop(){ alive=false; cancelAnimationFrame(raf); } };
  }
  // تعابير: فقاعة فوق الراس (الوجه نفسه ما نغيّره)
  const EMO = {
    thinking:`<svg viewBox="0 0 60 50"><path d="M10 30a14 12 0 0124-16 12 10 0 0118 12 10 9 0 01-10 14H18A10 9 0 0110 30z" fill="#FBF6E8" stroke="#B9A07A" stroke-width="2.4"/><circle cx="8" cy="46" r="3" fill="#FBF6E8" stroke="#B9A07A" stroke-width="2"/><path d="M22 34l14-14 4 4-14 14h-4z" fill="#F2D27A" stroke="#9C7A2E" stroke-width="1.8"/></svg>`,
    happy:`<svg viewBox="0 0 60 50"><path d="M30 44s-18-10-18-22a9 9 0 0118-4 9 9 0 0118 4c0 12-18 22-18 22z" fill="#F2A7B8" stroke="#B04E86" stroke-width="2.6"/></svg>`,
    surprised:`<svg viewBox="0 0 60 50"><path d="M30 4l4 26h-8z" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2.4" stroke-linejoin="round"/><circle cx="30" cy="40" r="4.4" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2.4"/><path d="M10 14l6 4M50 14l-6 4" stroke="#D9AE4E" stroke-width="3" stroke-linecap="round"/></svg>`,
    sketch:`<svg viewBox="0 0 60 50"><rect x="8" y="6" width="40" height="36" rx="3" fill="#FBF6E8" stroke="#8C7D66" stroke-width="2.4"/><path d="M8 12h40" stroke="#E59AAE" stroke-width="2"/><path d="M22 18c-4 8-6 14-8 20h20c-2-6-4-12-8-20z" fill="none" stroke="#8E5A9E" stroke-width="2"/><path d="M40 30l12-12 3 3-12 12h-3z" fill="#F2D27A" stroke="#9C7A2E" stroke-width="1.6"/></svg>`,
    prep:`<svg viewBox="0 0 60 50"><path d="M6 36c10-10 38-10 48 0" stroke="#F2D27A" stroke-width="6" fill="none" stroke-dasharray="4 3"/><path d="M14 14l10 14M24 14l-10 14" stroke="#8C7D9E" stroke-width="3" stroke-linecap="round"/><circle cx="14" cy="12" r="4" fill="none" stroke="#8C7D9E" stroke-width="2.4"/><circle cx="24" cy="12" r="4" fill="none" stroke="#8C7D9E" stroke-width="2.4"/><circle cx="42" cy="18" r="6" fill="#E59AAE"/><path d="M42 12v-6" stroke="#8C7D9E" stroke-width="2"/></svg>`
  };

  /* ---------------- واجهة مشتركة ---------------- */
  function shell(root, id, opts={}){
    load();
    const r = REG[id] || {n:opts.title||"دار إيلاف"};
    const isMap = id==="map";
    const v = h(`<section class="view fw fw-${id} ${opts.cls||""}">
      <header class="fw-head">
        <button class="fw-b" data-back aria-label="${isMap?"رجوع لخريطة الموقع":"رجوع لخريطة الدار"}">${IC.back}<span>${isMap?"خروج":"الخريطة"}</span></button>
        <h1>${esc(opts.title || r.n)}</h1>
        <button class="fw-b" data-ward aria-label="خزانة الدار">${FI.hanger}</button>
        <button class="fw-b" data-calm aria-pressed="${prefs.calm||sysReduce.matches}" aria-label="تخفيف الحركة">${IC.calm}</button>
        <button class="fw-b" data-snd aria-pressed="${S.opts.music}" aria-label="الموسيقى">${IC.sound}</button>
      </header>
      <div class="fw-body"></div>
    </section>`);
    root.appendChild(v); fillIcons(v);
    const back = opts.onBack || (() => { if(isMap) exitHouse(); else leave("fashion:map"); });
    $("[data-back]",v).onclick = () => { sfx("page"); back(); };
    $("[data-ward]",v).onclick = wardrobe;
    $("[data-snd]",v).onclick = e => { S.opts.music=!S.opts.music; save(); e.currentTarget.setAttribute("aria-pressed", S.opts.music); music(opts.theme||r.th||"map"); toast(S.opts.music?"الموسيقى شغّالة":"الموسيقى مطفية","sound"); };
    $("[data-calm]",v).onclick = () => { if(sysReduce.matches){ toast("الحركة مخفّضة من إعدادات جهازج","calm"); return; } prefs.calm=!prefs.calm; Store.set("prefs",prefs); try{ syncToggles(); }catch(e){} toast(prefs.calm?"الحركة هادية":"الحركة رجعت","calm"); go(current, false); };
    if(!isMap && motionOK()){ v.classList.add("fw-in"); setTimeout(()=>v.classList.remove("fw-in"), 700); }
    return { v, body:$(".fw-body",v) };
  }
  function leave(route){ const v=document.querySelector(".fw"); if(v && motionOK()){ v.classList.add("fw-out"); setTimeout(()=>go(route), 260); } else go(route); }
  function exitHouse(){ load(); const to = S.from==="world" ? "world" : S.from==="intro" ? "intro" : "map"; flush(); TAudio.stop(); go(to); }

  // خزانة الدار: كل الخامات والمكافآت، المفتوحة والمقفولة مع تلميح
  const HINTS = {c:"تنفتح من الألعاب", p:"تنفتح من الألعاب", f:"تنفتح من ألغاز قاعة الأقمشة والمواسم وغرفة الأسرار", w:"تنفتح من الأماكن المخفية والمواسم", a:"تنفتح لما تحفظين تصاميم بالمتحف", bg:"تنفتح لما تستكشفين الكواليس", pose:"تنفتح بعد كل عرض كامل"};
  function wardrobe(){
    load();
    const tabs = Object.keys(KIND);
    const md = modal(`<div class="fw-modal"><h2>خزانة الدار</h2><p class="d-note">كل شي هنا محفوظ على هذا الجهاز. المقفول يبين وياه شلون ينفتح.</p>
      <div class="seg fw-tabs" role="tablist">${tabs.map((k,i)=>`<button data-t="${k}" aria-pressed="${i===0}">${KIND[k].n}</button>`).join("")}</div><div class="fw-ward"></div></div>`, {wide:true});
    const box = $(".fw-ward", md.el);
    const show = k => { const ids = list(k); const n = ids.filter(id=>owned(k,id)).length;
      box.innerHTML = `<p class="fw-count">${n} من ${ids.length}</p><div class="fw-grid">${ids.map(id=>`<div class="fw-wi ${owned(k,id)?"":"lock"}">${swatch(k,id,50)}<small>${esc(KIND[k].name(id))}</small></div>`).join("")}</div>${n<ids.length?`<p class="d-note">${HINTS[k]}</p>`:""}`; };
    $$("[data-t]", md.el).forEach(b=>b.onclick=()=>{ $$("[data-t]",md.el).forEach(x=>x.setAttribute("aria-pressed", x===b)); show(b.dataset.t); });
    show(tabs[0]);
  }

  /* ---------------- إطار الألعاب ---------------- */
  const GAMES = {};
  const game = (id, def) => { GAMES[id] = Object.assign({id}, def); };
  const LV = ["سهل","متوسط","تحدي (اختياري)"];
  function gameFrame(body, g, opts={}){
    load();
    const st = S.games[g.id] || (S.games[g.id] = {wins:{}, plays:0});
    const wrap = h(`<div class="fg fg-${g.id}">
      <div class="fg-top"><span class="fg-stat" aria-live="polite"></span><span class="fg-btns"><button class="fw-b sm" data-pause aria-label="إيقاف مؤقت" hidden>${IC.pause}</button><button class="fw-b sm" data-restart aria-label="إعادة" hidden>${IC.undo}</button></span></div>
      <div class="fg-frame" style="${g.bg?`--fg-bg:${g.bg}`:""}"><div class="fg-layer"></div>
        <div class="fg-ov" data-intro><div class="fg-card"><span class="fg-art">${g.art?g.art():""}</span><h3>${esc(g.title)}</h3><p>${g.how}</p>
          <div class="seg fg-lv" role="group" aria-label="الصعوبة">${LV.map((l,i)=>`<button data-lv="${i}" aria-pressed="${i===0}">${l}${st.wins[i]?" ✓":""}</button>`).join("")}</div>
          ${g.rw?`<p class="fg-rwn">${g.rw.map((r,i)=>{ const q=rwParse(r); return q?`<span title="${LV[i]}">${swatch(q.k,q.id,30)}</span>`:""; }).join("")}<small>مكافأة لكل مستوى</small></p>`:""}
          <button class="btn honey" data-start>ابدئي</button>${opts.back?`<button class="btn ghost small" data-gback>رجوع</button>`:""}</div></div>
        <div class="fg-ov" data-pov hidden><div class="fg-card"><h3>موقوفة</h3><button class="btn honey" data-resume>كمّلي</button><button class="btn ghost small" data-restart2>من جديد</button></div></div>
        <div class="fg-ov" data-end hidden><div class="fg-card"></div></div>
      </div>
      <p class="fg-say" aria-live="polite"></p></div>`);
    body.appendChild(wrap); fillIcons(wrap);
    const frame=$(".fg-frame",wrap), layer=$(".fg-layer",wrap), intro=$("[data-intro]",wrap), pov=$("[data-pov]",wrap), endOv=$("[data-end]",wrap);
    let level=0, cleanup=null, paused=false, running=false, raf=0, last=0, loopFn=null, timers=[];
    $$("[data-lv]",wrap).forEach(b=>b.onclick=()=>{ level=+b.dataset.lv; $$("[data-lv]",wrap).forEach(x=>x.setAttribute("aria-pressed", x===b)); });
    const tick = now => { raf=requestAnimationFrame(tick); const dt=Math.min(.05,(now-last)/1000); last=now; if(!paused && loopFn) loopFn(dt, now/1000); };
    const ctx = {
      frame, layer, get level(){ return level; }, get paused(){ return paused; }, get running(){ return running; },
      W:()=>frame.clientWidth, H:()=>frame.clientHeight,
      fit:(x,y,w,hh)=>[Math.min(Math.max(0,x), Math.max(0,frame.clientWidth-w)), Math.min(Math.max(0,y), Math.max(0,frame.clientHeight-hh))],
      stat:t=>{ $(".fg-stat",wrap).textContent=t; }, say:t=>{ const s=$(".fg-say",wrap); s.textContent=t; s.classList.remove("pop"); void s.offsetWidth; s.classList.add("pop"); },
      loop:fn=>{ loopFn=fn; last=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(tick); },
      after:(ms,fn)=>{ const t={left:ms, fn}; timers.push(t); return t; },
      win:(msg, stars=3)=>finish(true, msg, stars), fail:(msg, sol)=>finish(false, msg, 0, sol), sfx, season:opts.season||null
    };
    const tcheck = setInterval(()=>{ if(paused||!running) return; timers.forEach(t=>{ t.left-=100; if(t.left<=0 && !t.done){ t.done=true; t.fn(); } }); timers=timers.filter(t=>!t.done); }, 100);
    function start(){ intro.hidden=true; endOv.hidden=true; pov.hidden=true; cleanup && cleanup(); cleanup=null; layer.innerHTML=""; timers=[]; paused=false; running=true; loopFn=null; cancelAnimationFrame(raf); $("[data-pause]",wrap).hidden=false; $("[data-restart]",wrap).hidden=false; ctx.stat(""); sfx("soft"); st.plays++; save(); cleanup = g.run(ctx) || null; }
    function finish(won, msg, stars, sol){
      if(!running) return;
      running=false; loopFn=null; cancelAnimationFrame(raf); $("[data-pause]",wrap).hidden=true;
      let rwHTML = "";
      if(won){
        const first = !st.wins[level]; st.wins[level]=Date.now(); S.stats.wins=(S.stats.wins||0)+1; save();
        const r = rwParse(g.rw && g.rw[level]);
        if(r && grant(r.k, r.id, g.title, true)) rwHTML = `<div class="fg-rw">${swatch(r.k,r.id,54)}<span><small>مكافأة جديدة</small><b>${esc(kindLabel(r.k,r.id))}</b></span></div>`;
        else if(r) rwHTML = `<p class="fg-had">مكافأة هالمستوى صارت عندج من قبل ✓ — العبي براحتج.</p>`;
        opts.onWin && opts.onWin(level, first);
        sfx("ok"); if(motionOK()) confetti();
        if(typeof World!=="undefined" && World.event) try{ World.event("game"); }catch(e){}
      } else sfx("soft");
      $(".fg-card",endOv).innerHTML = won
        ? `<div class="fg-stars">${[1,2,3].map(i=>`<span class="${i<=stars?"on":""}">${IC.star}</span>`).join("")}</div><h3>${esc(msg||"أحسنتِ!")}</h3>${rwHTML}<button class="btn honey" data-again>مرة ثانية</button><button class="btn ghost small" data-lvl>غيّري الصعوبة</button>${opts.back?`<button class="btn ghost small" data-gback2>رجوع</button>`:""}`
        : `<h3>${esc(msg||"ما خلصت هالمرة… ولا يهمج")}</h3>${sol?`<div class="fg-sol"><small>شوفي الحل، وبعدين جربي:</small>${sol}</div>`:""}<button class="btn honey" data-again>جربي مرة ثانية</button><button class="btn ghost small" data-lvl>غيّري الصعوبة</button>${opts.back?`<button class="btn ghost small" data-gback2>رجوع</button>`:""}`;
      endOv.hidden=false;
      $("[data-again]",endOv).onclick=start; $("[data-lvl]",endOv).onclick=()=>{ endOv.hidden=true; intro.hidden=false; $$("[data-lv]",wrap).forEach((b,i)=>b.textContent=LV[i]+(st.wins[i]?" ✓":"")); };
      const gb=$("[data-gback2]",endOv); if(gb) gb.onclick=opts.back;
    }
    $("[data-start]",wrap).onclick=start;
    const gb=$("[data-gback]",wrap); if(gb) gb.onclick=opts.back;
    $("[data-pause]",wrap).onclick=()=>{ if(!running) return; paused=true; pov.hidden=false; };
    $("[data-resume]",wrap).onclick=()=>{ paused=false; pov.hidden=true; last=performance.now(); };
    $("[data-restart]",wrap).onclick=start; $("[data-restart2]",wrap).onclick=start;
    const vis=()=>{ if(document.hidden && running){ paused=true; pov.hidden=false; } };
    document.addEventListener("visibilitychange", vis);
    return { el:wrap, ctx, destroy(){ running=false; cancelAnimationFrame(raf); clearInterval(tcheck); cleanup && cleanup(); document.removeEventListener("visibilitychange", vis); } };
  }
  // لوحة ألعاب منطقة: أزرار الألعاب، وكل لعبة تفتح بإطارها
  function gameShelf(body, ids, title="ألعاب المكان", opts={}){
    const box = h(`<div class="fw-games"></div>`);
    const draw = () => { box.innerHTML = `${title?`<h3>${esc(title)}</h3>`:""}<div class="fw-gl">${ids.map(id=>{ const g=GAMES[id]; const w=S.games[id]?Object.keys(S.games[id].wins).length:0; return `<button class="fw-gi" data-g="${id}"><span class="fw-gart">${g.art?g.art():""}</span><b>${esc(g.title)}</b><small>${w?`${"★".repeat(w)}${"☆".repeat(3-w)}`:"جديدة"}</small></button>`; }).join("")}</div>`;
      $$("[data-g]",box).forEach(b=>b.onclick=()=>{ sfx("page"); open(b.dataset.g); }); };
    body.appendChild(box); draw();
    let cur = null, host = null;
    const open = id => {
      host = h(`<div class="fw-gpage"></div>`); box.after(host); box.hidden = true; opts.onOpen && opts.onOpen(true);
      cur = gameFrame(host, GAMES[id], {back:close, season:opts.season, onWin:opts.onWin && ((l,f)=>opts.onWin(id,l,f))});
      host.scrollIntoView && host.scrollIntoView({block:"start"});
    };
    const close = () => { if(cur){ cur.destroy(); cur=null; } host && host.remove(); host=null; box.hidden=false; draw(); opts.onOpen && opts.onOpen(false); };
    return { box, open, close, destroy(){ cur && cur.destroy(); } };
  }

  /* ---------------- التصاميم ---------------- */
  const clone = o => JSON.parse(JSON.stringify(o));
  const designById = id => load().designs.find(d=>d.id===id);
  function saveDesign(look, wings, name, id){
    load(); const now = Date.now();
    let d = id && designById(id);
    if(d){ Object.assign(d, {look:clone(look), wings:clone(wings), name:name||d.name, at:now}); }
    else { d = {id:"d"+now.toString(36)+Math.floor(Math.random()*99), look:clone(look), wings:clone(wings), name:name||("إطلالة "+(S.designs.length+1)), at:now, born:now, season:S.seasons.active||null}; S.designs.unshift(d); }
    S.cur = {look:clone(look), wings:clone(wings), name:d.name, id:d.id};
    save();
    // متحف: كل 3 تصاميم إكسسوار جديد
    const n = S.designs.length, acc = ["tiara","star","locket","butterfly","flower"];
    const want = Math.min(acc.length, Math.floor(n/2));
    for(let i=0;i<want;i++) if(grant("a", acc[i], "تصاميم بالمتحف")) break;
    return d;
  }
  const curLook = () => load().cur.look, curWings = () => load().cur.wings;
  function setCur(look, wings, name, id){ load(); S.cur = {look:clone(look), wings:clone(wings||S.cur.wings), name:name!==undefined?name:S.cur.name, id:id!==undefined?id:S.cur.id}; save(); }

  /* ---------------- لقطة صورة (Canvas) ---------------- */
  // ترسم إيلاف بالإطلالة على Canvas طبقة طبقة (بدون أي مصدر خارجي)
  let girlImg = null;
  const loadImg = src => new Promise((res, rej) => { const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; });
  const svgImg = s => loadImg("data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s.replace(/class="[^"]*"/,"").replace('<svg ','<svg width="360" height="500" ')));
  async function snapshot(look, wings, o={}){
    look = Object.assign(FArt.BLANK(), look); wings = Object.assign(FArt.BLANK_WINGS(), wings||{});
    const W = o.w || 720, H = o.h || 900;
    const cv = document.createElement("canvas"); cv.width=W; cv.height=H; const g = cv.getContext("2d");
    // خلفية
    const bg = STAGE_BG[o.bg] || STAGE_BG.curtain;
    const gr = g.createLinearGradient(0,0,0,H); gr.addColorStop(0,bg.a); gr.addColorStop(1,bg.b); g.fillStyle=gr; g.fillRect(0,0,W,H);
    if(o.light){ const lg=g.createRadialGradient(W/2,H*.45,10,W/2,H*.45,W*.7); lg.addColorStop(0,o.light+"AA"); lg.addColorStop(1,o.light+"00"); g.fillStyle=lg; g.fillRect(0,0,W,H); }
    g.fillStyle="rgba(255,255,255,.18)"; g.beginPath(); g.ellipse(W/2,H*.93,W*.32,H*.04,0,0,Math.PI*2); g.fill();
    // الدمية: 360×500 → مقياس
    const sc = Math.min(W/360*.82, H/500*.86), ox = (W-360*sc)/2, oy = H*.97-500*sc;
    girlImg = girlImg || await loadImg(GIRL);
    const pose = POSE_ANG[o.pose] || POSE_ANG.stand;
    const part = (k, rot=0) => { const p=FArt.DCLIP[k]; g.save(); g.translate(ox,oy); g.scale(sc,sc);
      if(rot){ g.translate(p.o[0]*3.6, p.o[1]*5); g.rotate(rot*Math.PI/180); g.translate(-p.o[0]*3.6, -p.o[1]*5); }
      g.beginPath(); p.c.forEach(([x,y],i)=> i?g.lineTo(x*3.6,y*5):g.moveTo(x*3.6,y*5)); g.closePath(); g.clip(); g.drawImage(girlImg,0,0,360,500); g.restore(); };
    const layer = async (s, k, rot=0) => { if(!s || !/<path|<rect|<circle|<ellipse|<g/.test(s)) return; const im = await svgImg(s); g.save(); g.translate(ox,oy); g.scale(sc,sc); if(rot){ const p=FArt.DCLIP[k]; g.translate(p.o[0]*3.6,p.o[1]*5); g.rotate(rot*Math.PI/180); g.translate(-p.o[0]*3.6,-p.o[1]*5); } g.drawImage(im, -360*.6, -500*.3, 360*2.2, 500*1.6); g.restore(); };
    // نكبر مساحة الـ SVG حتى الجناح ما ينقص
    const wide = s => s && s.replace('viewBox="0 0 360 500"', 'viewBox="-216 -150 792 800"');
    const Ly = FArt.layers(look, wings, {anim:false});
    await layer(wide(Ly.back));
    part("legL"); part("legR");
    await layer(wide(Ly.legL)); await layer(wide(Ly.legR));
    await layer(wide(Ly.skirt)); await layer(wide(Ly.hip));
    part("armL", pose.aL); part("armR", pose.aR); part("head");
    await layer(wide(Ly.core));
    await layer(wide(Ly.slL), "armL", pose.aL); await layer(wide(Ly.slR), "armR", pose.aR);
    // الشعر ضمن جزء الراس، والإكسسوار فوقه
    await layer(wide(Ly.acc));
    if(o.caption){ g.fillStyle="rgba(251,246,232,.9)"; const bh=H*.085; g.fillRect(0,H-bh,W,bh); g.fillStyle="#3D3A2E"; g.font=`800 ${Math.round(H*.036)}px ${getComputedStyle(document.body).fontFamily}`; g.textAlign="center"; g.direction="rtl"; g.fillText(o.caption, W/2, H-bh*.32); }
    return new Promise(res => cv.toBlob(b=>res(b), "image/png"));
  }
  const POSE_ANG = {stand:{aL:0,aR:0}, wave:{aL:0,aR:-22}, sparkle:{aL:24,aR:-24}, curtsy:{aL:-8,aR:8}, twirl:{aL:10,aR:-10}, hop:{aL:14,aR:-14}, heart:{aL:-14,aR:14}};

  /* ---------------- الخريطة ---------------- */
  function viewMap(root){
    load();
    const sh = shell(root, "map", {title:"دار إيلاف", theme:"map"}); const body = sh.body;
    const tips = ["أهلاً بالدار! ابدئي من المشغل وصممي أول إطلالة.","العصفورة توزع دعوات العرض… جهّزي الكواليس.","بالخزانة تشوفين كل الخامات اللي جمعتيها.","أكو خيوط ذهبية مخبّاية… دوري زين."];
    const tip = !S.designs.length ? tips[0] : tips[(S.owl++)%tips.length]; save();
    body.innerHTML = `<div class="fm-scroll"><div class="fm">
      <svg class="fm-bg" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="fmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7E8F2"/><stop offset="1" stop-color="#F2DDE8"/></linearGradient>
          <radialGradient id="fmPlaza" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#FFF7EE"/><stop offset="1" stop-color="#F6E3EC"/></radialGradient>
          <pattern id="fmTape" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#FBF0C8"/><path d="M0 0v10M12 0v6" stroke="#C9A04E" stroke-width="2"/></pattern>
          <pattern id="fmTile" patternUnits="userSpaceOnUse" width="80" height="80"><path d="M40 0l40 40-40 40L0 40z" fill="#F3DCE6" opacity=".55"/></pattern></defs>
        <rect width="1600" height="1000" fill="url(#fmSky)"/>
        <rect width="1600" height="1000" fill="url(#fmTile)"/>
        <ellipse cx="800" cy="520" rx="740" ry="440" fill="url(#fmPlaza)" stroke="#E3C6D6" stroke-width="6"/>
        <path class="fm-road" d="M800 470C640 400 440 330 340 280M800 470C800 330 800 230 800 170M800 470C960 400 1160 330 1260 270M800 470C680 560 560 610 480 640M800 470C920 560 1000 620 1070 660M1070 660C1200 610 1300 560 1390 520M480 640C360 600 260 560 200 530M800 470C770 640 750 760 740 840M1260 270C1360 220 1440 170 1490 140" fill="none" stroke="url(#fmTape)" stroke-width="30" stroke-linecap="round"/>
        <path d="M800 470C640 400 440 330 340 280M800 470C800 330 800 230 800 170M800 470C960 400 1160 330 1260 270M800 470C680 560 560 610 480 640M800 470C920 560 1000 620 1070 660M1070 660C1200 610 1300 560 1390 520M480 640C360 600 260 560 200 530M800 470C770 640 750 760 740 840M1260 270C1360 220 1440 170 1490 140" fill="none" stroke="#C9A04E" stroke-width="34" stroke-opacity=".25" stroke-linecap="round"/>
        <g transform="translate(800 470)"><circle r="70" fill="#E9F3F6" stroke="#9CC4D2" stroke-width="5"/><circle r="44" fill="#BFE0EA"/><path class="fm-water" d="M-30 0q15-12 30 0t30 0" stroke="#fff" stroke-width="5" fill="none"/><path d="M0-44c-30-50 40-60 10-110" stroke="#F2A7B8" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M0-44c30-40-30-70 0-110" stroke="#C9B6E8" stroke-width="8" fill="none" stroke-linecap="round"/></g>
        ${[[170,180],[420,860],[1180,840],[1480,700],[610,120],[1040,140],[150,800]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><rect x="-26" y="-60" width="52" height="16" rx="5" fill="#C98E6E"/><rect x="-20" y="-46" width="40" height="44" fill="${["#F2A7B8","#A8D2EE","#F6E08A","#C9B6E8","#A9DCC4"][i%5]}"/><path d="M-20-40h40M-20-30h40M-20-20h40M-20-10h40" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><rect x="-26" y="-4" width="52" height="16" rx="5" fill="#C98E6E"/></g>`).join("")}
        ${[[300,420],[1300,420],[560,300],[1040,780],[260,700]].map(([x,y])=>`<g transform="translate(${x} ${y})"><circle r="18" fill="#FBF6E8" stroke="#C9B6A6" stroke-width="3"/>${[[-6,-6],[6,-6],[-6,6],[6,6]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="3" fill="#C9B6A6"/>`).join("")}</g>`).join("")}
      </svg>
      <div class="fm-flyers" aria-hidden="true">${["#F2A7B8","#C9B6E8","#A9DCC4","#F6E08A"].map((c,i)=>`<i style="top:${16+i*18}%;--d:${-i*6}s">${FArt.F.cbfly(c)}</i>`).join("")}</div>
      ${Object.entries(REG).map(([id,r])=>{ const open=isOpen(id); return `<button class="fm-spot ${open?"":"locked"} ${S.visited[id]?"seen":""}" data-r="${id}" style="left:${r.x}%;top:${r.y}%;--w:${r.w}" aria-label="${r.n}${open?"":" — مقفولة"}">
        <span class="fm-art">${id==="secret"?FArt.LM.secret(open):FArt.LM[id]()}</span><span class="fm-tag"><b>${r.n}</b><small>${open?r.sub:"مقفولة"}</small></span>${open?(S.visited[id]?"":`<i class="fm-new">جديد</i>`):`<i class="fm-lock">${IC.lock}</i>`}</button>`; }).join("")}
      <div class="fm-elaf"></div>
    </div></div>
    <div class="fm-ui"><button class="btn honey small" data-quick>${IC.pen} كمّلي التصميم</button><button class="btn ghost small" data-intro>${FI.door} المدخل</button></div>
    <div class="fm-guide"></div>`;
    const fm = $(".fm",body), scroll = $(".fm-scroll",body);
    const bird = friendEl("bird", "fm-bird"); $(".fm-guide",body).appendChild(bird);
    const tipEl = h(`<p class="fm-tip">${esc(tip)}</p>`); $(".fm-guide",body).appendChild(tipEl); setTimeout(()=>tipEl.classList.add("hide"), 7000);
    // إيلاف تمشي على الخريطة بإطلالتها الحالية
    const lr = REG[S.last] || REG.atelier;
    const eb = $(".fm-elaf",body); eb.style.left=lr.x+"%"; eb.style.top=(lr.y+6)+"%";
    let target = null, walkDone = null;
    const dl = doll(eb, S.cur.look, S.cur.wings, {cls:"fm-doll", tick:(dt,c)=>{
      if(!target) return; const cx=parseFloat(eb.style.left), cy=parseFloat(eb.style.top); const dx=target.x-cx, dy=target.y-cy, d=Math.hypot(dx,dy);
      if(d<.5){ eb.style.left=target.x+"%"; eb.style.top=target.y+"%"; target=null; walkDone && walkDone(); return; }
      const sp = Math.min(d, 38*dt); eb.style.left=(cx+dx/d*sp)+"%"; eb.style.top=(cy+dy/d*sp)+"%"; c.face = dx<0?-1:1; c.x += sp*1.4*c.face; eb.classList.toggle("fl", c.face<0); }});
    requestAnimationFrame(()=>{ scroll.scrollLeft = lr.x/100*scroll.scrollWidth - scroll.clientWidth/2; scroll.scrollTop = lr.y/100*scroll.scrollHeight - scroll.clientHeight/2; });
    $$("[data-r]",body).forEach(b => b.onclick = () => {
      const id=b.dataset.r;
      if(!isOpen(id)){ sfx("nope"); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); tipEl.textContent = REG[id].hint; tipEl.classList.remove("hide"); clearTimeout(tipEl._t); tipEl._t=setTimeout(()=>tipEl.classList.add("hide"), 6000); return; }
      sfx("page"); $$("[data-r]",body).forEach(x=>x.disabled=true);
      if(motionOK()){ target = {x:REG[id].x, y:REG[id].y+6}; walkDone = () => { b.classList.add("pick"); setTimeout(()=>go("fashion:"+id), 200); }; setTimeout(()=>{ if(target){ target=null; go("fashion:"+id); } }, 2600); }
      else go("fashion:"+id);
    });
    $("[data-quick]",body).onclick = () => go("fashion:atelier");
    $("[data-intro]",body).onclick = () => go("fashion");
    music("map");
    return () => dl.stop();
  }

  /* ---------------- المدخل ---------------- */
  function viewIntro(root){
    load();
    const seen = S.intro > 0;
    const v = h(`<section class="view fw fi ${seen?"seen":""}">
      <div class="fi-top"><button class="fw-b" data-out aria-label="رجوع للموقع">${IC.back}<span>رجوع</span></button><span style="flex:1"></span>
        <button class="fw-b" data-calm aria-pressed="${prefs.calm||sysReduce.matches}" aria-label="تخفيف الحركة">${IC.calm}</button>
        <button class="fw-b" data-snd aria-pressed="${S.opts.music}" aria-label="الموسيقى">${IC.sound}</button></div>
      <div class="fi-stage">
        <div class="fi-lights" aria-hidden="true"><i></i><i></i><i></i></div>
        <svg class="fi-fabric" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true"><path class="r1" d="M-20 60C80 20 160 120 260 70S380 40 420 80" stroke="#F2A7B8" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/><path class="r2" d="M-20 120C90 90 180 170 280 120S380 100 420 140" stroke="#C9B6E8" stroke-width="12" fill="none" stroke-linecap="round" opacity=".6"/><path class="r3" d="M-20 30C100 60 200 0 300 40S390 20 420 30" stroke="#F6E08A" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/></svg>
        <div class="fi-curtain l" aria-hidden="true"></div><div class="fi-curtain r" aria-hidden="true"></div>
        <div class="fi-door"><div class="fi-glow"></div><div class="fi-leaf l"></div><div class="fi-leaf r"></div><div class="fi-sign">دار إيلاف</div></div>
        <div class="fi-sparkles" aria-hidden="true">${Array.from({length:14},(_,i)=>`<i style="left:${(i*37)%100}%;top:${(i*53)%80+5}%;--d:${(-i*.4).toFixed(1)}s">${FI.spark}</i>`).join("")}</div>
        <div class="fi-elaf"></div>
      </div>
      <div class="fi-card"><h1>دار إيلاف</h1><p>كل عرض يبدأ بفكرة… شنو راح تصممين اليوم؟</p>
        <div class="row"><button class="btn honey fi-enter" data-enter>${FI.door} ادخلي الدار</button><button class="btn ghost small" data-skip>تخطّي</button></div></div>
    </section>`);
    root.appendChild(v); fillIcons(v);
    const eb = $(".fi-elaf",v);
    const calm = !motionOK();
    let startX = (seen||calm) ? 50 : 4;
    eb.style.left = startX+"%";
    let mode = (seen||calm) ? "wait" : "walkin", entered=false;
    const dl = doll(eb, S.cur.look, S.cur.wings, {x:startX, tick:(dt,c)=>{
      const x = parseFloat(eb.style.left);
      if(mode==="walkin"){ const nx=Math.min(50, x+16*dt); eb.style.left=nx+"%"; c.x+=(nx-x)*1.6; if(nx>=50){ mode="wait"; } }
      if(mode==="into"){ const k=Math.max(0, parseFloat(eb.dataset.k||"1")-dt*.9); eb.dataset.k=k; eb.style.transform=`translateX(-50%) scale(${.55+k*.45})`; eb.style.opacity=Math.min(1,k*1.6); c.x+=dt*14; }
    }});
    const enter = () => { if(entered) return; entered=true; S.intro=(S.intro||0)+1; save(); sfx("door");
      if(calm){ go("fashion:map"); return; }
      v.classList.add("opening"); mode="into"; setTimeout(()=>{ v.classList.add("flood"); }, 700); setTimeout(()=>go("fashion:map"), 1500); };
    $("[data-enter]",v).onclick = enter;
    $("[data-skip]",v).onclick = () => { S.intro=(S.intro||0)+1; save(); go("fashion:map"); };
    $("[data-out]",v).onclick = exitHouse;
    $("[data-snd]",v).onclick = e => { S.opts.music=!S.opts.music; save(); e.currentTarget.setAttribute("aria-pressed", S.opts.music); music("intro"); };
    $("[data-calm]",v).onclick = () => { if(sysReduce.matches){ toast("الحركة مخفّضة من إعدادات جهازج","calm"); return; } prefs.calm=!prefs.calm; Store.set("prefs",prefs); try{ syncToggles(); }catch(e){} go(current,false); };
    music("intro");
    return () => dl.stop();
  }

  /* ---------------- نقطة الدخول ---------------- */
  function view(root, arg){
    load();
    if(prefs.sound && typeof Sound!=="undefined"){ Sound.set(false); }
    // نحفظ من وين دخلنا حتى زر الخروج يرجع له
    const prev = (window.__fashionFrom||"");
    if(prev){ S.from = prev; window.__fashionFrom = ""; save(); }
    const id = arg || "";
    if(!id) return viewIntro(root);
    if(id==="map") return viewMap(root);
    if(!REG[id] || !renderers[id]){ go("fashion:map", false); return; }
    if(!isOpen(id)){ toast(REG[id].hint, "lock"); go("fashion:map", false); return; }
    const first = !S.visited[id];
    S.visited[id] = Date.now(); S.last = id; save();
    const sh = shell(root, id, {theme:REG[id].th});
    music(REG[id].th || "map");
    const clean = renderers[id](sh.body, {first, shell:sh});
    return () => { clean && clean(); flush(); };
  }

  return { view, get S(){ return load(); }, save, flush, DB, FI, fic, REG, region, isOpen, owned, list, grant, swatch, kindLabel, KIND, STAGE_BG, POSES, POSE_ORDER,
    music, FTH, sfx, shell, leave, friendEl, friendLine, say, FRIENDS, critique, doll, EMO, game, GAMES, gameFrame, gameShelf, LV, clueEl, CLUES,
    saveDesign, designById, curLook, curWings, setCur, clone, snapshot, POSE_ANG, wardrobe, rewardCard };
})();
function viewFashion(root, arg){ return FW.view(root, arg); }
