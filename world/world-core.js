/* =====================================================================
   عالمنا — النواة: الحفظ، المقتنيات، المناطق، الخريطة، المهام والإنجازات،
   أصدقاء العالم، والأدوات المشتركة بين كل المناطق.
   الحفظ محلي فقط: Store("world") + IndexedDB للصور والرسومات.
   ===================================================================== */
const World = (() => {
  /* ---------------- المقتنيات ---------------- */
  const ITEMS = {
    seed:{n:"بذرة"}, leaf:{n:"ورقة"}, star:{n:"نجمة"}, berry:{n:"توتة"}, flower:{n:"زهرة"},
    mushroom:{n:"فطر مضيء"}, honey:{n:"عسل"}, cloud:{n:"قطعة غيم"}, moon:{n:"قطرة قمر"},
    feather:{n:"ريشة"}, shell:{n:"صدفة"}, rune:{n:"رمز البوابة"}, drop:{n:"قطرة ماي"}
  };
  const itemArt = k => (WART.item[k] || WART.item.star)();
  const DECOR = {
    sofa:{n:"كنبة", room:"home"}, rug:{n:"سجادة", room:"home"}, lamp:{n:"مصباح", room:"home"}, plant:{n:"نبتة", room:"home"},
    shelf:{n:"رف كتب", room:"home"}, table:{n:"طاولة", room:"home"}, bed:{n:"سرير", room:"home"}, clock:{n:"ساعة", room:"home"},
    garland:{n:"زينة أعلام", room:"home"}, starLamp:{n:"فانوس نجمة", room:"home"}, cloudPillow:{n:"مخدة غيمة", room:"home"},
    moonMobile:{n:"معلّقة القمر", room:"home"}, shellFrame:{n:"برواز صدف", room:"home"}, flowerVase:{n:"مزهرية", room:"home"}
  };
  const START_DECOR = ["sofa","rug","lamp","plant","shelf","table","clock"];
  const PAINT_COLORS = {c_rose:["#E05A7A","وردي الحديقة"], c_sky:["#6FB6E0","أزرق السما"], c_moon:["#F6E3A1","ضي القمر"], c_berry:["#8E2E5A","توت غامق"], c_cloud:["#E4D8F4","ليلكي الغيوم"]};
  const PAINT_STICKERS = {s_owl:["بومة", ()=>WART.owl()], s_lantern:["فانوس", ()=>WART.lanternPost(true)], s_cat:["قطة", ()=>WART.cat()], s_turtle:["سلحفاة", ()=>WART.turtle()], s_adool:["عدول", null]};

  /* ---------------- الحالة ---------------- */
  const DEF = () => ({
    inv:{seed:3, leaf:0, star:2, drop:2}, decor:START_DECOR.slice(), unlocks:{},
    visited:{}, met:{}, ach:{}, gifts:[], stats:{}, taken:{}, flags:{},
    quests:{day:"", list:[], prog:{}, claimed:{}},
    home:{weather:"day", wall:"#E9D6B8", room:"living", items:[
      {k:"rug",x:50,y:84,s:34},{k:"sofa",x:30,y:78,s:30},{k:"lamp",x:12,y:80,s:9},{k:"table",x:60,y:82,s:20},{k:"plant",x:86,y:80,s:11},{k:"shelf",x:76,y:46,s:20},{k:"clock",x:46,y:30,s:10}]},
    garden:{plots:Array.from({length:6},()=>null), deco:[], daily:{day:"", w:0}},
    recipes:{}, sky:{cons:{}, wishes:[], theme:"indigo", msgs:[]},
    fest:{done:{}, keep:{}}, mail:[], opts:{music:false, sfx:true}, owl:0, lastRegion:"home"
  });
  let S = null;
  const load = () => { if(S) return S; S = Object.assign(DEF(), Store.get("world", {})); const d=DEF(); for(const k in d) if(S[k]==null) S[k]=d[k]; return S; };
  let saveT; const save = () => { clearTimeout(saveT); saveT = setTimeout(()=>Store.set("world", S), 120); };
  const flush = () => { clearTimeout(saveT); Store.set("world", S); };
  window.addEventListener("pagehide", () => S && flush());

  /* ---------------- IndexedDB للصور والرسومات ---------------- */
  const DB = (() => {
    let p=null;
    const open = () => p || (p = new Promise((res, rej) => { try{ const r=indexedDB.open("world-media", 1); r.onupgradeneeded=()=>{ ["photos","drawings"].forEach(n=>r.result.createObjectStore(n,{keyPath:"id"})); }; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }catch(e){ rej(e); } }));
    const tx = (st, mode, fn) => open().then(db => new Promise((res, rej) => { const t=db.transaction(st, mode); const r=fn(t.objectStore(st)); t.oncomplete=()=>res(r && r.result!==undefined ? r.result : r); t.onerror=()=>rej(t.error); }));
    return { all:st=>tx(st,"readonly",s=>s.getAll()).catch(()=>[]), get:(st,id)=>tx(st,"readonly",s=>s.get(id)).catch(()=>null), put:(st,o)=>tx(st,"readwrite",s=>s.put(o)), del:(st,id)=>tx(st,"readwrite",s=>s.delete(id)) };
  })();

  /* ---------------- صوت ---------------- */
  const THEMES = {
    map:{root:62, scale:[0,2,4,7,9], tempo:88, chords:[0,3,4,2], motif:[0,null,2,4,null,4,2,null, 5,null,4,null,2,null,null,null]},
    calm:{root:60, scale:[0,2,4,5,7,9,11], tempo:72, chords:[0,5,3,4], motif:[4,null,null,2,null,0,null,null, 2,null,4,null,5,null,null,null]},
    play:{root:65, scale:[0,2,4,7,9], tempo:116, chords:[0,3,1,4], motif:[0,2,4,2,5,4,2,null, 4,5,7,5,4,2,0,null]},
    night:{root:57, scale:[0,3,5,7,10], tempo:64, chords:[0,2,3,1], motif:[4,null,null,null,2,null,null,null, 3,null,null,null,0,null,null,null]},
    dream:{root:67, scale:[0,2,4,6,7,9,11], tempo:78, chords:[0,4,5,3], motif:[0,null,4,null,7,null,6,null, 4,null,2,null,0,null,null,null]}
  };
  function music(theme){ load(); TAudio.setOpts({music:S.opts.music, sfx:S.opts.sfx, vol:.55}); if(!S.opts.music){ TAudio.stop(); return; } TAudio.unlock(); TAudio.play("world", "world", "explore", THEMES[theme]||THEMES.map); }
  const sfx = n => { load(); if(S.opts.sfx){ TAudio.unlock(); TAudio.sfx(n); } };

  /* ---------------- منح وتقدّم ---------------- */
  const today = () => { const d=new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };
  const has = (k, n=1) => (load().inv[k]||0) >= n;
  function give(k, n=1, quiet){
    load(); S.inv[k]=(S.inv[k]||0)+n; S.stats.collected=(S.stats.collected||0)+n; if(k==="star") S.stats.stars=(S.stats.stars||0)+n;
    save(); if(!quiet){ flyItem(k, n); } event("collect", n); checkAch(); refreshBag();
  }
  function spend(k, n=1){ load(); if(!has(k,n)) return false; S.inv[k]-=n; save(); refreshBag(); return true; }
  function stat(k, n=1){ load(); S.stats[k]=(S.stats[k]||0)+n; save(); checkAch(); }
  function unlock(key, label){ load(); if(S.unlocks[key]) return false; S.unlocks[key]=true; save(); if(label) toast("انفتح: "+label, "lock"); return true; }
  function addDecor(k){ load(); if(!S.decor.includes(k)){ S.decor.push(k); save(); } }
  // هدية تنتظر بغرفة المفاجآت
  function gift(id, title, reward){ load(); if(S.gifts.some(g=>g.id===id) || (S.opened||[]).includes(id)) return; S.gifts.push({id, title, reward}); save(); toast("هدية جديدة بغرفة المفاجآت بالبيت!", "gift"); }
  function openGift(id){ load(); const i=S.gifts.findIndex(g=>g.id===id); if(i<0) return null; const g=S.gifts.splice(i,1)[0]; S.opened=(S.opened||[]).concat(id); applyReward(g.reward); save(); return g; }
  function applyReward(r){ if(!r) return; if(r.decor) addDecor(r.decor); if(r.color) unlock(r.color); if(r.sticker) unlock(r.sticker); if(r.items) Object.entries(r.items).forEach(([k,n])=>give(k,n,true)); if(r.plant) unlock("plant_"+r.plant); }
  const rewardText = r => !r ? "" : [r.decor&&("زينة: "+DECOR[r.decor].n), r.color&&("لون رسم: "+PAINT_COLORS[r.color][1]), r.sticker&&("ملصق: "+PAINT_STICKERS[r.sticker][0]), r.plant&&("بذور خاصة: "+(PLANT_NAMES[r.plant]||r.plant)), r.items&&Object.entries(r.items).map(([k,n])=>`${n} ${ITEMS[k].n}`).join("، ")].filter(Boolean).join(" · ");
  const PLANT_NAMES = {rose:"وردة حمرا", pink:"وردة وردية", sun:"دوار الشمس", lilac:"زهرة ليلكية", berry:"شجيرة توت", moon:"زهرة القمر", cloud:"قطن الغيوم"};

  /* ---------------- الإنجازات ---------------- */
  const ACH = [
    {id:"explorer", n:"مستكشف الغابة", d:"زوري ست أماكن بالغابة", sym:"leaf", c:"#BCD7B4", ok:()=>Object.keys(S.flags).filter(k=>k.startsWith("fv_")).length>=6, r:{decor:"starLamp"}},
    {id:"animals", n:"صديق الحيوانات", d:"تعرّفي على ست أصدقاء بالعالم", sym:"feather", c:"#E4D8F4", ok:()=>Object.keys(S.met).length>=6, r:{decor:"cloudPillow", sticker:"s_owl"}},
    {id:"artist", n:"فنان البيت", d:"احفظي ثلاث رسمات بالمعرض", sym:"flower", c:"#F3C1BA", ok:()=>(S.stats.drawings||0)>=3, r:{decor:"garland", color:"c_rose"}},
    {id:"stars", n:"جامع النجوم", d:"اجمعي عشرين نجمة", sym:"star", c:"#F6E3A1", ok:()=>(S.stats.stars||0)>=20, r:{decor:"moonMobile", color:"c_moon"}},
    {id:"chef", n:"طاهي الغيوم", d:"اطبخي ثلاث وصفات", sym:"honey", c:"#F2D6A8", ok:()=>Object.keys(S.recipes).length>=3, r:{decor:"flowerVase", sticker:"s_cat"}},
    {id:"memories", n:"حافظ الذكريات", d:"احفظي أربع ذكريات بالمتحف", sym:"shell", c:"#F7D3C4", ok:()=>(S.stats.memories||0)>=4, r:{decor:"shellFrame"}},
    {id:"gardener", n:"اليد الخضرا", d:"اقطفي أربع زهور من الحديقة", sym:"seed", c:"#CFE3C4", ok:()=>(S.stats.harvest||0)>=4, r:{plant:"lilac", color:"c_berry"}},
    {id:"sky", n:"صديق النجوم", d:"كمّلي أربع كوكبات بالمرصد", sym:"moon", c:"#CFC5E8", ok:()=>Object.keys(S.sky.cons).length>=4, r:{plant:"moon", sticker:"s_lantern"}},
    {id:"festive", n:"روح المهرجان", d:"احتفلي بثلاث مهرجانات", sym:"rune", c:"#F3C9DE", ok:()=>Object.keys(S.fest.done).length>=3, r:{color:"c_sky", sticker:"s_turtle"}},
    {id:"bff", n:"صديق إيلاف وعدول", d:"اجمعي ست أوسمة ثانية", sym:"berry", c:"#FFE0E8", ok:()=>Object.keys(S.ach).filter(k=>k!=="bff").length>=6, r:{plant:"cloud", color:"c_cloud", sticker:"s_adool"}}
  ];
  function checkAch(){ load(); ACH.forEach(a=>{ if(!S.ach[a.id] && a.ok()){ S.ach[a.id]=today(); save(); setTimeout(()=>{ toast("وسام جديد: "+a.n, "star"); gift("ach_"+a.id, "وسام "+a.n, a.r); sfx("ok"); }, 600); } }); }

  /* ---------------- المهام اليومية ---------------- */
  const QPOOL = [
    {id:"game", t:"العبي لعبة وحدة", n:1}, {id:"water", t:"اسقي نبتة", n:1}, {id:"collect", t:"اجمعي ثلاث أشياء", n:3},
    {id:"draw", t:"احفظي رسمة صغيرة", n:1}, {id:"letter", t:"افتحي رسالة", n:1}, {id:"visit", t:"زوري منطقتين", n:2},
    {id:"puzzle", t:"حلّي لغز", n:1}, {id:"cook", t:"اطبخي وصفة", n:1}, {id:"wish", t:"اكتبي أمنية بنجمة", n:1}, {id:"friend", t:"سلّمي على صديق من الحيوانات", n:1}
  ];
  function quests(){ load(); const d=today(); if(S.quests.day!==d){ let seed=[...d].reduce((a,c)=>a*31+c.charCodeAt(0)|0, 7); const pool=QPOOL.slice(), list=[]; while(list.length<3){ seed=(seed*1103515245+12345)&0x7fffffff; list.push(pool.splice(seed%pool.length,1)[0].id); } S.quests={day:d, list, prog:{}, claimed:{}}; save(); } return S.quests; }
  function event(type, n=1){ load(); if(type==="game" && (typeof WPost!=="undefined"&&WPost)) setTimeout(()=>WPost.deliver("activity"), 1500); const q=quests(); if(!q.list.includes(type)) return; const def=QPOOL.find(x=>x.id===type); const before=q.prog[type]||0; q.prog[type]=Math.min(def.n, before+n); save(); if(before<def.n && q.prog[type]>=def.n) setTimeout(()=>toast("كمّلتي مهمة اليوم: "+def.t, "check"), 900); refreshBag(); }
  function claim(id){ const q=quests(); const def=QPOOL.find(x=>x.id===id); if(!def || q.claimed[id] || (q.prog[id]||0)<def.n) return false; q.claimed[id]=true; save(); give("star",2,true); give("seed",1,true); return true; }

  /* ---------------- المناطق ---------------- */
  const REG = {
    home:{n:"البيت فوق الشجرة", sub:"نقطة البداية", x:47, y:44, w:12, music:"calm"},
    forest:{n:"غابة الاستكشاف", sub:"ممرات وأسرار", x:22, y:30, w:15, music:"map"},
    garden:{n:"الحديقة", sub:"زراعة وسقي", x:63, y:62, w:14, music:"calm"},
    studio:{n:"المرسم", sub:"رسم ودفتر", x:34, y:62, w:10, music:"calm"},
    museum:{n:"متحف الذكريات", sub:"صور ورسائل", x:59, y:24, w:12, music:"calm"},
    kitchen:{n:"مطبخ الغابة", sub:"وصفات خيالية", x:76, y:42, w:11, music:"play", need:()=>(S.stats.collected||0)>=6, hint:"اجمعي 6 أشياء من الغابة أو الحديقة حتى ينفتح المطبخ"},
    sky:{n:"مرصد القمر", sub:"نجوم وأمنيات", x:84, y:17, w:10, music:"night", need:()=>has("star",5) || S.visited.sky, hint:"يحتاج 5 نجوم بحقيبتج. النجوم تنلگى بالألعاب والغابة"},
    river:{n:"نهر الألعاب", sub:"ألعاب مائية", x:14, y:74, w:16, music:"play"},
    arcade:{n:"ساحة الألعاب", sub:"12 لعبة قصيرة", x:49, y:80, w:13, music:"play"},
    festival:{n:"جزيرة المهرجانات", sub:"احتفالات", x:86, y:76, w:14, music:"play", need:()=>Object.keys(S.visited).length>=4, hint:"زوري أربع مناطق حتى توصلين للجزيرة"},
    beach:{n:"شاطئ الغيوم", sub:"عالم فوق الغيم", x:12, y:12, w:14, music:"dream", need:()=>has("feather") || S.visited.beach, hint:"تحتاجين ريشة حتى تطيرين للغيوم. البومة عندها وحدة بساحة الأشجار القديمة بالغابة"},
    post:{n:"محطة البريد", sub:"رسائل", x:74, y:84, w:10, music:"calm"}
  };
  const renderers = {};
  const region = (id, fn) => { renderers[id] = fn; };
  const isOpen = id => { load(); const r=REG[id]; return !r.need || r.need(); };

  /* ---------------- أصدقاء العالم ---------------- */
  const FRIENDS = {
    owl:{n:"بومة الدليل", art:b=>WART.owl(b), lines:["هوو… كل منطقة بيها سر صغير. دوري زين.","إذا ضعتي، ارجعي للخريطة. أنا دائماً هنا.","الليل بالمرصد أحلى وقت للأمنيات.","جربي تطبخين بالمطبخ، الريحة توصل لهنا!","الحديقة تحب السقي… والكلام الحلو."]},
    turtle:{n:"السلحفاة شيلة", art:()=>WART.turtle(), lines:["على كيفج… آني جايبة شي صغير إلج.","ظهري يشيل كنوز، بس ببطء.","لگيت هالشي يمّ النهر. خذيه!"]},
    rabbit:{n:"الأرنب ساعي البريد", art:()=>WART.rabbit(), lines:["رسالة جديدة؟ آني أسرع ساعي بالغابة!","أوصل الرسائل قبل لا تبرد.","عندي ظرف بلون الورد، تريدين تكتبين؟"]},
    butterfly:{n:"فراشة الأسرار", art:()=>WART.butterfly(), lines:["شش… أكو شي مخبى قريب.","أطير يم الأماكن السرية دائماً.","اتبعي اللمعة الصغيرة."]},
    cat:{n:"القطة مشمشة", art:b=>WART.cat(b), lines:["مياو… الكنبة دافية اليوم.","جيت أزوركم، عندكم حليب قمر؟","خرررر…"]},
    guard:{n:"حارس الفطر", art:()=>WART.mushGuard(), lines:["الممر محروس، بس بلطف.","جيبي أوراق، والفطر يفتحلج الطريق.","آني فطر جدّي… أحياناً."]}
  };
  function meet(id){ load(); if(!S.met[id]){ S.met[id]=today(); save(); checkAch(); } event("friend"); }
  const lastLine = {};
  function friendLine(id){ const L=FRIENDS[id].lines; let i; do{ i=Math.floor(Math.random()*L.length); }while(L.length>1 && i===lastLine[id]); lastLine[id]=i; return L[i]; }
  // عنصر صديق قابل للضغط مع فقاعة كلام
  function friendEl(id, cls="", onTap){
    const el = h(`<button class="wf wf-${id} ${cls}" aria-label="${FRIENDS[id].n}"><span class="wf-art">${FRIENDS[id].art()}</span><span class="wf-bub" hidden></span></button>`);
    el.onclick = e => { e.stopPropagation(); meet(id); sfx("soft"); const b=$(".wf-bub",el); b.textContent=friendLine(id); b.hidden=false; el.classList.remove("hop"); void el.offsetWidth; el.classList.add("hop"); clearTimeout(b._t); b._t=setTimeout(()=>b.hidden=true, 3200); onTap && onTap(); };
    return el;
  }

  /* ---------------- إيلاف وعدول داخل المشاهد ---------------- */
  // يضيف الشخصيتين بأجزائهما المتحركة لأي حاوية، ويخليهم يتمشون بهدوء
  function cast(box, opts={}){
    const who = opts.who || ["elaf","adool"], H = opts.h || 26, chars=[];
    box.classList.add("wcast");
    who.forEach((w,i) => {
      const el = h(`<div class="wc wc-${w}" style="--h:${w==="adool"?H*1.1:H}"><div class="wc-flip">${TRig.html(w)}</div></div>`);
      box.appendChild(el);
      const c = {who:w, el, x:(opts.x||[30,44])[i], y:86, face:i?-1:1, anim:"idle", tx:null, wait:2+Math.random()*4};
      TRig.attach(c, el); chars.push(c);
      el.onclick = e => { e.stopPropagation(); TRig.wave(c, 1.3); sfx("soft"); opts.onTap && opts.onTap(w); };
    });
    let raf=0, last=performance.now(), alive=true;
    const range = opts.range || [10,90];
    const loop = now => { if(!alive) return; const dt=Math.min(.05,(now-last)/1000); last=now;
      chars.forEach(c => {
        if(opts.wander!==false && motionOK()){
          if(c.tx==null){ c.wait-=dt; if(c.wait<=0){ c.tx = range[0]+Math.random()*(range[1]-range[0]); } }
          else { const d=c.tx-c.x; if(Math.abs(d)<.6){ c.tx=null; c.wait=3+Math.random()*6; const o=chars.find(x=>x!==c); if(o && Math.abs(o.x-c.x)<22){ c.face=o.x>c.x?1:-1; TRig.greet(c); } } else { c.face=Math.sign(d); c.x+=Math.sign(d)*Math.min(Math.abs(d), 9*dt); } }
        }
        c.el.style.left=c.x+"%"; c.el.classList.toggle("fl", c.face<0);
        TRig.update(c, dt, !motionOK());
      });
      raf=requestAnimationFrame(loop); };
    raf=requestAnimationFrame(loop);
    return { chars, stop(){ alive=false; cancelAnimationFrame(raf); }, wave(w){ const c=chars.find(x=>x.who===w); c && TRig.wave(c,1.4); } };
  }

  /* ---------------- أدوات واجهة ---------------- */
  function flyItem(k, n){ const el=h(`<div class="w-fly">${itemArt(k)}<b>+${n}</b></div>`); document.body.appendChild(el); sfx("pick"); setTimeout(()=>el.remove(), 1300); }
  function refreshBag(){ const b=document.querySelector(".wd-bagn"); if(b && S) b.textContent = Object.values(S.inv).reduce((a,v)=>a+(v||0),0); const q=document.querySelector(".wd-qdot"); if(q && S){ const qq=S.quests; q.hidden = !qq.list.some(id=>{ const d=QPOOL.find(x=>x.id===id); return (qq.prog[id]||0)>=d.n && !qq.claimed[id]; }); } }
  function bagModal(){
    load();
    const items = Object.entries(S.inv).filter(([k,n])=>n>0 && ITEMS[k]);
    modal(`<div class="wd-modal"><h2>الحقيبة</h2>
      ${items.length?`<div class="wd-bag">${items.map(([k,n])=>`<div class="wd-bi"><span>${itemArt(k)}</span><b>${n}</b><small>${ITEMS[k].n}</small></div>`).join("")}</div>`:`<p>الحقيبة فارغة. الغابة والحديقة والألعاب مليانة أشياء.</p>`}
      <h3>زينة البيت</h3><div class="wd-bag">${S.decor.map(k=>`<div class="wd-bi"><span>${WART.decor[k]()}</span><small>${DECOR[k].n}</small></div>`).join("")}</div>
      <p class="d-note">كل شي محفوظ على هذا الجهاز فقط.</p></div>`, {wide:true});
  }
  function journalModal(){
    load(); const q=quests();
    const md = modal(`<div class="wd-modal"><h2>دفتر المهام</h2>
      <p class="d-note">مهام اليوم خفيفة، وماكو خسارة إذا ما كملتيها.</p>
      <ul class="wd-q">${q.list.map(id=>{ const d=QPOOL.find(x=>x.id===id), p=q.prog[id]||0, done=p>=d.n; return `<li class="${done?"done":""}"><span class="wd-qt">${d.t}</span><span class="wd-qp">${p}/${d.n}</span>${q.claimed[id]?`<span class="wd-qc">${IC.check}</span>`:done?`<button class="btn honey small" data-claim="${id}">خذي الهدية</button>`:""}</li>`; }).join("")}</ul>
      <h3>الأوسمة</h3><div class="wd-ach">${ACH.map(a=>`<div class="wd-a ${S.ach[a.id]?"on":""}" title="${a.d}">${WART.badge(a.sym, S.ach[a.id]?a.c:"#D8D2C0")}<b>${a.n}</b><small>${S.ach[a.id]?"حصلتي عليه":a.d}</small></div>`).join("")}</div>
      <h3>أصدقاء العالم</h3><div class="wd-ach">${Object.entries(FRIENDS).map(([id,f])=>`<div class="wd-a ${S.met[id]?"on":""}"><span class="wd-fa">${S.met[id]?f.art():`<span class="wd-unk">؟</span>`}</span><b>${S.met[id]?f.n:"صديق ما تعرفتي عليه"}</b></div>`).join("")}</div></div>`, {wide:true});
    $$("[data-claim]",md.el).forEach(b=>b.onclick=()=>{ if(claim(b.dataset.claim)){ toast("+2 نجوم و بذرة","star"); sfx("ok"); md.close(); journalModal(); } });
  }

  /* ---------------- الغلاف المشترك لكل منطقة ---------------- */
  function shell(root, id, opts={}){
    load();
    const r = REG[id] || {n:opts.title||"عالمنا"};
    const v = h(`<section class="view wd wd-${id} ${opts.cls||""}">
      <header class="wd-head">
        <button class="wd-b" data-back aria-label="${id==="map"?"رجوع للغابة":"رجوع للخريطة"}">${IC.back}<span>${id==="map"?"الغابة":"الخريطة"}</span></button>
        <h1>${esc(opts.title || r.n)}</h1>
        <button class="wd-b" data-journal aria-label="دفتر المهام">${IC.list}<i class="wd-qdot" hidden></i></button>
        <button class="wd-b" data-bag aria-label="الحقيبة">${WART.item.seed()}<b class="wd-bagn">0</b></button>
        <button class="wd-b" data-snd aria-pressed="${S.opts.music}" aria-label="الموسيقى">${IC.sound}</button>
      </header>
      <div class="wd-body"></div>
    </section>`);
    root.appendChild(v); fillIcons(v);
    const back = opts.onBack || (() => { if(id==="map") go("map"); else leaveTo("world"); });
    $("[data-back]",v).onclick = () => { sfx("page"); back(); };
    $("[data-journal]",v).onclick = journalModal;
    $("[data-bag]",v).onclick = bagModal;
    $("[data-snd]",v).onclick = e => { S.opts.music=!S.opts.music; save(); e.currentTarget.setAttribute("aria-pressed", S.opts.music); music(r.music||"map"); toast(S.opts.music?"الموسيقى شغّالة":"الموسيقى مطفية","sound"); };
    refreshBag(); quests(); refreshBag();
    if(id!=="map" && motionOK()){ v.classList.add("wd-in"); setTimeout(()=>v.classList.remove("wd-in"), 700); }
    return { v, body:$(".wd-body",v) };
  }
  function leaveTo(route){ const v=document.querySelector(".wd"); if(v && motionOK()){ v.classList.add("wd-out"); setTimeout(()=>go(route), 280); } else go(route); }

  /* ---------------- إطار الألعاب المشترك ---------------- */
  // كل لعبة: {title, how, levels, art, run(ctx)} ← ترجع دالة تنظيف.
  // ctx.frame عنصر الإطار، وكل شي يتحرك لازم يبقى داخله (ctx.fit يحسب الحدود حسب حجم العنصر).
  function gameUI(body, g, opts={}){
    const wrap = h(`<div class="wg wg-${g.id||""}" style="${g.bg?`--wg-bg:${g.bg}`:""}">
      <div class="wg-top"><span class="wg-stat" aria-live="polite"></span><span class="wg-btns"><button class="wd-b sm" data-pause aria-label="إيقاف مؤقت" hidden>${IC.pause}</button><button class="wd-b sm" data-restart aria-label="إعادة" hidden>${IC.undo}</button></span></div>
      <div class="wg-frame"><div class="wg-layer"></div>
        <div class="wg-ov" data-intro><div class="wg-card"><span class="wg-art">${g.art?g.art():""}</span><h3>${esc(g.title)}</h3><p>${g.how}</p>
          ${g.levels?`<div class="seg wg-lv" role="group" aria-label="الصعوبة">${g.levels.map((l,i)=>`<button data-lv="${i}" aria-pressed="${i===0}">${l}</button>`).join("")}</div>`:""}
          <button class="btn honey" data-start>ابدئي</button>${opts.back?`<button class="btn ghost small" data-gback>رجوع</button>`:""}</div></div>
        <div class="wg-ov" data-pov hidden><div class="wg-card"><h3>موقوفة</h3><button class="btn honey" data-resume>كمّلي</button><button class="btn ghost small" data-restart2>من جديد</button></div></div>
        <div class="wg-ov" data-end hidden><div class="wg-card"></div></div>
      </div>
      <p class="wg-say" aria-live="polite"></p></div>`);
    body.appendChild(wrap); fillIcons(wrap);
    const frame=$(".wg-frame",wrap), layer=$(".wg-layer",wrap), intro=$("[data-intro]",wrap), pov=$("[data-pov]",wrap), endOv=$("[data-end]",wrap);
    let level=0, cleanup=null, paused=false, running=false, raf=0, last=0, loopFn=null, timers=[];
    $$("[data-lv]",wrap).forEach(b=>b.onclick=()=>{ level=+b.dataset.lv; $$("[data-lv]",wrap).forEach(x=>x.setAttribute("aria-pressed", x===b)); });
    const tick = now => { raf=requestAnimationFrame(tick); const dt=Math.min(.05,(now-last)/1000); last=now; if(!paused && loopFn) loopFn(dt, now/1000); };
    const ctx = {
      frame, layer, get level(){ return level; }, get paused(){ return paused; },
      W:()=>frame.clientWidth, H:()=>frame.clientHeight,
      fit:(x,y,w,hh)=>[Math.min(Math.max(0,x), Math.max(0,frame.clientWidth-w)), Math.min(Math.max(0,y), Math.max(0,frame.clientHeight-hh))],
      stat:t=>{ $(".wg-stat",wrap).textContent=t; }, say:t=>{ const s=$(".wg-say",wrap); s.textContent=t; s.classList.remove("pop"); void s.offsetWidth; s.classList.add("pop"); },
      loop:fn=>{ loopFn=fn; last=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(tick); },
      after:(ms,fn)=>{ const t={left:ms, fn}; timers.push(t); return t; },
      win:(msg, reward, stars)=>finish(msg, reward, stars), sfx
    };
    // مؤقتات تحترم الإيقاف
    const tcheck = setInterval(()=>{ if(paused||!running) return; timers.forEach(t=>{ t.left-=100; if(t.left<=0 && !t.done){ t.done=true; t.fn(); } }); timers=timers.filter(t=>!t.done); }, 100);
    function start(){ intro.hidden=true; endOv.hidden=true; pov.hidden=true; layer.innerHTML=""; timers=[]; paused=false; running=true; loopFn=null; cancelAnimationFrame(raf); cleanup && cleanup(); $("[data-pause]",wrap).hidden=false; $("[data-restart]",wrap).hidden=false; sfx("soft"); cleanup = g.run(ctx) || null; }
    function finish(msg, reward, stars=1){
      running=false; loopFn=null; cancelAnimationFrame(raf); $("[data-pause]",wrap).hidden=true;
      if(reward) Object.entries(reward).forEach(([k,n])=>give(k,n,true));
      event("game"); stat("games"); sfx("ok"); if(motionOK()) confetti();
      $(".wg-card",endOv).innerHTML = `<div class="wg-stars">${[1,2,3].map(i=>`<span class="${i<=stars?"on":""}">${WART.item.star()}</span>`).join("")}</div><h3>${esc(msg||"أحسنتِ!")}</h3>${reward?`<p class="wg-rw">${Object.entries(reward).map(([k,n])=>`<span>${itemArt(k)}+${n}</span>`).join("")}</p>`:""}<button class="btn honey" data-again>مرة ثانية</button><button class="btn ghost small" data-lvl>غيّري الصعوبة</button>${opts.back?`<button class="btn ghost small" data-gback2>رجوع</button>`:""}`;
      endOv.hidden=false;
      $("[data-again]",endOv).onclick=start; $("[data-lvl]",endOv).onclick=()=>{ endOv.hidden=true; intro.hidden=false; };
      const gb=$("[data-gback2]",endOv); if(gb) gb.onclick=opts.back;
    }
    $("[data-start]",wrap).onclick=start;
    const gb=$("[data-gback]",wrap); if(gb) gb.onclick=opts.back;
    $("[data-pause]",wrap).onclick=()=>{ if(!running) return; paused=true; pov.hidden=false; };
    $("[data-resume]",wrap).onclick=()=>{ paused=false; pov.hidden=true; last=performance.now(); };
    $("[data-restart]",wrap).onclick=start; $("[data-restart2]",wrap).onclick=start;
    const vis=()=>{ if(document.hidden && running){ paused=true; pov.hidden=false; } };
    document.addEventListener("visibilitychange", vis);
    return { el:wrap, ctx, destroy(){ cancelAnimationFrame(raf); clearInterval(tcheck); cleanup && cleanup(); document.removeEventListener("visibilitychange", vis); } };
  }
  // لوحة اتجاهات للألعاب (يمين/يسار/فوق/جوّا) — الحركة بس من هالأزرار
  function pad(host, keys=["left","right"], extra){
    const el = h(`<div class="wpad">${keys.map(k=>`<button data-k="${k}" aria-label="${{left:"يسار",right:"يمين",up:"فوق",down:"جوّا"}[k]}"><svg viewBox="0 0 24 24" style="transform:rotate(${{left:180,right:0,up:-90,down:90}[k]}deg)"><path d="M5 12h12M12 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`).join("")}${extra||""}</div>`);
    host.appendChild(el);
    const held = new Set();
    $$("button[data-k]",el).forEach(b => { const k=b.dataset.k;
      b.addEventListener("pointerdown", e=>{ e.preventDefault(); try{ b.setPointerCapture(e.pointerId); }catch(_){} held.add(k); b.classList.add("on"); });
      ["pointerup","pointercancel","lostpointercapture"].forEach(t=>b.addEventListener(t, ()=>{ held.delete(k); b.classList.remove("on"); })); });
    const KM={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down"};
    const kd=e=>{ const k=KM[e.code]; if(k && keys.includes(k)){ e.preventDefault(); held.add(k); } }, ku=e=>{ const k=KM[e.code]; if(k) held.delete(k); };
    window.addEventListener("keydown",kd); window.addEventListener("keyup",ku);
    const rel=()=>held.clear(); window.addEventListener("blur",rel);
    return { held, el, destroy(){ window.removeEventListener("keydown",kd); window.removeEventListener("keyup",ku); window.removeEventListener("blur",rel); } };
  }

  /* ---------------- الخريطة الرئيسية ---------------- */
  function viewMapW(root){
    load();
    const sh = shell(root, "map", {title:"عالمنا"}); const body=sh.body;
    const z0 = Store.get("worldZoom", 1);
    const tip = !S.visited.home ? "ابدئي من البيت فوق الشجرة. هناك تلگين كل شي." : FRIENDS.owl.lines[(S.owl++)%FRIENDS.owl.lines.length];
    save();
    body.innerHTML = `<div class="wm-scroll"><div class="wm" style="--z:${z0}">
        <svg class="wm-bg" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="wmSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0E8"/><stop offset="1" stop-color="#8EC3CF"/></linearGradient>
          <radialGradient id="wmLand" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#E4EBC6"/><stop offset="1" stop-color="#C9D9A8"/></radialGradient></defs>
          <rect width="1600" height="1000" fill="url(#wmSea)"/>
          <path d="M120 180C260 60 520 90 700 120S1040 40 1240 120 1540 240 1520 460 1560 820 1340 900 960 980 760 920 380 960 220 860 40 640 70 460 20 280 120 180z" fill="url(#wmLand)" stroke="#B8A57A" stroke-width="6"/>
          <path d="M0 700C140 680 220 760 360 740S560 640 700 700" fill="none" stroke="#8EC3CF" stroke-width="40" stroke-linecap="round"/>
          <path class="wm-flow" d="M0 700C140 680 220 760 360 740S560 640 700 700" fill="none" stroke="#E6F4FA" stroke-width="6" stroke-dasharray="20 18"/>
          <path d="M1260 640c80-30 220-10 300 60v300h-380c-20-160 0-300 80-360z" fill="#E9DDBA" opacity=".9"/>
          <g fill="#FDF0F7" stroke="#E3C6DD" stroke-width="4" opacity=".95"><path d="M60 160C20 160 20 110 60 106 60 66 120 56 136 90 160 50 230 62 226 108 266 110 270 160 230 160z"/><path d="M230 70C206 70 206 40 232 38 236 14 280 12 288 34 306 18 340 30 334 56 352 60 350 70 332 70z"/></g>
          <path class="wm-path" d="M750 440C620 380 460 300 360 300M750 440C860 420 960 280 950 240M750 440C700 560 560 620 540 620M750 440C880 520 990 600 1010 620M750 440C920 430 1180 420 1220 420M1220 420C1310 300 1350 200 1340 170M750 440C780 600 790 760 790 800M1010 620C1160 700 1300 760 1380 760M790 800C980 830 1120 840 1190 840M360 300C300 480 260 640 230 740M360 300C280 220 220 140 200 120" fill="none" stroke="#FBF6E8" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round"/>
          ${[[300,520],[420,190],[1100,250],[1460,560],[640,880],[980,520],[160,420]].map(([x,y])=>`<g transform="translate(${x} ${y})"><path d="M0 0l-20 46h40z" fill="#5E9277"/><path d="M0 18l-24 44h48z" fill="#4E7A5E"/><rect x="-4" y="60" width="8" height="12" fill="#6B4A33"/></g>`).join("")}
        </svg>
        <div class="wm-clouds" aria-hidden="true"><i style="top:14%;--d:0s"></i><i style="top:46%;--d:-18s"></i><i style="top:70%;--d:-34s"></i></div>
        <div class="wm-birds" aria-hidden="true">${[0,1,2].map(i=>`<i style="top:${18+i*12}%;--d:${-i*7}s">${WART.butterfly(["#F3A9B8","#F2D27A","#8EC3CF"][i],"#B9A6DD")}</i>`).join("")}</div>
        ${Object.entries(REG).map(([id,r])=>{ const open=isOpen(id); return `<button class="wm-spot ${open?"":"locked"} ${S.visited[id]?"seen":""}" data-r="${id}" style="left:${r.x}%;top:${r.y}%;--w:${r.w}" aria-label="${r.n}${open?"":" — مقفولة"}">
          <span class="wm-art">${WART.land[id]()}</span><span class="wm-tag"><b>${r.n}</b><small>${open?r.sub:"مقفولة"}</small></span>${open?(S.visited[id]?"":`<i class="wm-new">جديد</i>`):`<i class="wm-lock">${IC.lock}</i>`}</button>`; }).join("")}
        ${typeof FArt!=="undefined"?`<button class="wm-spot wm-fashion" data-fashion style="left:69%;top:9%;--w:10" aria-label="دار إيلاف"><span class="wm-art">${FArt.LM.atelier()}</span><span class="wm-tag"><b>دار إيلاف</b><small>عالم الأزياء</small></span></button>`:""}
        <div class="wm-cast" aria-hidden="false"></div>
      </div></div>
      <div class="wm-ui"><button class="wd-b" data-zin aria-label="تقريب">+</button><button class="wd-b" data-zout aria-label="تبعيد">−</button></div>
      <div class="wm-owl"></div>`;
    const wm=$(".wm",body), scroll=$(".wm-scroll",body);
    const owl = friendEl("owl", "wm-owlf"); $(".wm-owl",body).appendChild(owl);
    const tipEl = h(`<p class="wm-tip">${esc(tip)}</p>`); $(".wm-owl",body).appendChild(tipEl);
    setTimeout(()=>tipEl.classList.add("hide"), 7000);
    // الشخصيتين واقفين يمّ آخر منطقة
    const lr = REG[S.lastRegion] || REG.home;
    const castBox = $(".wm-cast",body); castBox.style.left=(lr.x-6)+"%"; castBox.style.top=(lr.y+4)+"%";
    const cs = cast(castBox, {h:56, x:[30,70], range:[20,80]});
    // تقريب داخل الخريطة فقط
    let z=z0; const setZ = nz => { const cx=(scroll.scrollLeft+scroll.clientWidth/2)/scroll.scrollWidth, cy=(scroll.scrollTop+scroll.clientHeight/2)/scroll.scrollHeight; z=Math.min(1.8,Math.max(.7,nz)); wm.style.setProperty("--z", z); Store.set("worldZoom", z); requestAnimationFrame(()=>{ scroll.scrollLeft=cx*scroll.scrollWidth-scroll.clientWidth/2; scroll.scrollTop=cy*scroll.scrollHeight-scroll.clientHeight/2; }); };
    $("[data-zin]",body).onclick=()=>setZ(z+.2); $("[data-zout]",body).onclick=()=>setZ(z-.2);
    requestAnimationFrame(()=>{ const r=REG[S.lastRegion]||REG.home; scroll.scrollLeft = r.x/100*scroll.scrollWidth - scroll.clientWidth/2; scroll.scrollTop = r.y/100*scroll.scrollHeight - scroll.clientHeight/2; });
    $$("[data-r]",body).forEach(b => b.onclick = () => {
      const id=b.dataset.r;
      if(!isOpen(id)){ sfx("nope"); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); tipEl.textContent = REG[id].hint; tipEl.classList.remove("hide"); clearTimeout(tipEl._t); tipEl._t=setTimeout(()=>tipEl.classList.add("hide"), 5000); return; }
      sfx("page"); const rr=b.getBoundingClientRect();
      document.documentElement.style.setProperty("--wox", (rr.left+rr.width/2)+"px"); document.documentElement.style.setProperty("--woy", (rr.top+rr.height/2)+"px");
      castBox.style.transition = motionOK() ? "left .6s ease, top .6s ease" : "none"; castBox.style.left=(REG[id].x-6)+"%"; castBox.style.top=(REG[id].y+4)+"%";
      if(motionOK()){ body.classList.add("wm-zoom"); b.classList.add("pick"); setTimeout(()=>go("world:"+id), 620); } else go("world:"+id);
    });
    const fz=$("[data-fashion]",body); if(fz) fz.onclick=()=>{ sfx("page"); window.__fashionFrom="world"; go("fashion"); };
    music("map");
    return () => cs.stop();
  }

  /* ---------------- نقطة الدخول ---------------- */
  function view(root, arg){
    load(); quests();
    if(prefs.sound){ Sound.set(false); }
    const id = arg || "";
    if(!id){ return viewMapW(root); }
    if(!REG[id] || !renderers[id]){ go("world", false); return; }
    if(!isOpen(id)){ toast(REG[id].hint, "lock"); go("world", false); return; }
    const first = !S.visited[id];
    S.visited[id]=today(); S.lastRegion=id; save(); event("visit"); checkAch();
    const sh = shell(root, id);
    music(REG[id].music||"map");
    const clean = renderers[id](sh.body, {first, shell:sh});
    return () => { clean && clean(); flush(); };
  }

  return { view, ITEMS, DECOR, PAINT_COLORS, PAINT_STICKERS, PLANT_NAMES, REG, FRIENDS, ACH,
    get S(){ return load(); }, save, flush, DB, has, give, spend, stat, unlock, addDecor, gift, openGift, rewardText, applyReward,
    event, quests, claim, region, isOpen, meet, friendEl, friendLine, cast, itemArt, gameUI, pad, sfx, music, leaveTo, today, checkAch };
})();
function viewWorld(root, arg){ return World.view(root, arg); }
