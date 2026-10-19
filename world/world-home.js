/* =====================================================================
   عالمنا — البيت فوق الشجرة (نقطة البداية والرجوع)
   غرف: الجلوس، الذكريات، الرسم، المطبخ، الشرفة، المفاجآت
   ===================================================================== */
World.region("home", (body, {first}) => {
  const S = World.S, H = S.home;
  const ROOMS = [
    ["living","غرفة الجلوس"], ["memories","غرفة الذكريات"], ["draw","غرفة الرسم"],
    ["kitchen","المطبخ"], ["balcony","الشرفة"], ["gifts","غرفة المفاجآت"]
  ];
  const WEATHER = [["day","نهار"],["sunset","غروب"],["night","ليل"],["rain","مطر خفيف"]];
  const WALLS = ["#E9D6B8","#F3D9D2","#D8E4CC","#D9D2EA","#CFE3EA"].concat(Object.keys(World.PAINT_COLORS).filter(k=>S.unlocks[k]).map(k=>World.PAINT_COLORS[k][0]));
  const COMMENTS = {
    sofa:["هاي الكنبة تاكل الريموت كل يوم.","أحلى مكان للقيلولة."], rug:["السجادة تتذكر كل رقصة."], lamp:["ضوّيته؟ لا، هو يضوي وحده."],
    plant:["سقيتيها اليوم؟ هي تگول لا."], shelf:["كتب الحكايات كلها هنا."], table:["على هالطاولة صار أحلى كيك… واحترق."],
    bed:["بس خمس دقايق بعد…"], clock:["الساعة تمشي، إحنا لا."], garland:["هاي زينة كل يوم عيد."], starLamp:["نجمة بالبيت، حتى بالنهار."],
    cloudPillow:["مخدة من غيمة حقيقية!"], moonMobile:["القمر ينام فوگ السرير."], shellFrame:["صورة من شاطئ الغيوم."], flowerVase:["زهور من حديقتنا."]
  };
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const v = h(`<div class="wh wh-${H.weather}">
    <div class="wtabs wh-tabs" role="tablist">${ROOMS.map(([k,n])=>`<button data-room="${k}" aria-pressed="${H.room===k}">${n}${k==="gifts"&&(S.gifts.length||S.mail.some(m=>m.deliver==="home"&&!m.read&&m.ready))?' <i class="wh-dot"></i>':""}</button>`).join("")}</div>
    <div class="wh-scene" style="--wall:${H.wall}">
      <div class="wh-wall"></div><div class="wh-floor"></div>
      <div class="wh-win"><div class="wh-sky"></div><div class="wamb wh-wamb"></div></div>
      <div class="wh-room"></div>
      <div class="wh-cast"></div>
      <div class="wh-light"></div>
    </div>
    <div class="wh-ui"></div>
    <div class="wchips wh-weather" role="group" aria-label="الجو">${WEATHER.map(([k,n])=>`<button data-w="${k}" aria-pressed="${H.weather===k}">${n}</button>`).join("")}</div>
  </div>`);
  body.appendChild(v);
  const scene=$(".wh-scene",v), roomEl=$(".wh-room",v), ui=$(".wh-ui",v), wamb=$(".wh-wamb",v);
  const cs = World.cast($(".wh-cast",v), {h:24, x:[38,62], range:[14,86], onTap:w=>say(w)});
  const say = w => { const c=cs.chars.find(x=>x.who===w); if(!c) return; bubble(c.el, pick(w==="elaf"?["هلا! شنسوي اليوم؟","تعالي نشوف الحديقة.","البيت دافي بالمطر."]:["أنا جاهز للمغامرة.","شمّيتي ريحة الكيك؟","خلّي نرتّب الغرفة سوا."])); };
  function bubble(el, t){ const b=h(`<span class="wh-bub">${esc(t)}</span>`); el.appendChild(b); setTimeout(()=>b.remove(), 2800); }

  function weather(w){
    H.weather=w; World.save(); v.className = "wh wh-"+w; $$("[data-w]",v).forEach(b=>b.setAttribute("aria-pressed", b.dataset.w===w));
    wamb.innerHTML = !motionOK() ? "" : w==="rain" ? Array.from({length:22},()=>`<i class="rain" style="left:${Math.random()*100}%;animation-delay:${-Math.random()}s;animation-duration:${.7+Math.random()*.5}s"></i>`).join("")
      : w==="night" ? Array.from({length:8},()=>`<i class="ff" style="left:${Math.random()*90}%;top:${20+Math.random()*70}%;animation-delay:${-Math.random()*6}s"></i>`).join("") : "";
  }
  $$("[data-w]",v).forEach(b=>b.onclick=()=>{ World.sfx("soft"); weather(b.dataset.w); if(H.room==="balcony") room("balcony"); });
  weather(H.weather);

  /* ---------- غرفة الجلوس: ترتيب الأثاث بالسحب ---------- */
  function living(){
    roomEl.innerHTML = H.items.map((it,i)=>`<button class="wh-it" data-i="${i}" style="left:${it.x}%;top:${it.y}%;width:${it.s}%" aria-label="${World.DECOR[it.k].n} — اسحبيه لمكان ثاني">${WART.decor[it.k]()}</button>`).join("");
    ui.innerHTML = `<div class="wcard"><div class="wh-row"><b>اسحبي أي قطعة وغيّري مكانها، أو اضغطي عليها.</b><button class="btn ghost small" data-drawer>أغراض البيت</button></div>
      <div class="wh-row"><span>لون الجدار:</span>${WALLS.map(c=>`<button class="wsw" style="background:${c}" data-wall="${c}" aria-pressed="${H.wall===c}" aria-label="لون الجدار"></button>`).join("")}</div>
      <div class="wh-drawer" hidden>${S.decor.map(k=>{ const on=H.items.some(x=>x.k===k); return `<button class="wtile ${on?"done":""}" data-dk="${k}"><span class="art">${WART.decor[k]()}</span><small>${World.DECOR[k].n}${on?" — بالغرفة":""}</small></button>`; }).join("")}</div></div>`;
    $("[data-drawer]",ui).onclick=()=>{ const d=$(".wh-drawer",ui); d.hidden=!d.hidden; };
    $$("[data-wall]",ui).forEach(b=>b.onclick=()=>{ H.wall=b.dataset.wall; scene.style.setProperty("--wall",H.wall); World.save(); $$("[data-wall]",ui).forEach(x=>x.setAttribute("aria-pressed",x===b)); });
    $$("[data-dk]",ui).forEach(b=>b.onclick=()=>{ const k=b.dataset.dk, i=H.items.findIndex(x=>x.k===k); if(i>=0) H.items.splice(i,1); else H.items.push({k, x:30+Math.random()*40, y:k==="garland"||k==="moonMobile"||k==="starLamp"?24:78, s:{bed:30,garland:30,cloudPillow:14,moonMobile:10,starLamp:8,shellFrame:9,flowerVase:8}[k]||12}); World.save(); World.sfx("pop"); living(); $(".wh-drawer",ui).hidden=false; });
    $$(".wh-it",roomEl).forEach(el => {
      const it = H.items[+el.dataset.i]; let st=null;
      el.addEventListener("pointerdown", e => { e.preventDefault(); el.setPointerCapture(e.pointerId); const r=scene.getBoundingClientRect(); st={x:e.clientX, y:e.clientY, ox:it.x, oy:it.y, w:r.width, h:r.height, moved:false}; el.classList.add("drag"); });
      el.addEventListener("pointermove", e => { if(!st) return; const dx=(e.clientX-st.x)/st.w*100, dy=(e.clientY-st.y)/st.h*100; if(Math.abs(dx)+Math.abs(dy)>1.2) st.moved=true; it.x=Math.min(96-it.s/2, Math.max(it.s/2+2, st.ox+dx)); it.y=Math.min(96, Math.max(16, st.oy+dy)); el.style.left=it.x+"%"; el.style.top=it.y+"%"; });
      const up = () => { if(!st) return; el.classList.remove("drag"); if(!st.moved){ el.classList.remove("wig"); void el.offsetWidth; el.classList.add("wig"); World.sfx("soft"); const c=cs.chars[Math.floor(Math.random()*2)]; bubble(c.el, pick(COMMENTS[it.k]||["حلو!"])); } else World.save(); st=null; };
      el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    });
    catVisit();
  }
  // القطة مشمشة تزور البيت أحياناً
  function catVisit(){ if(Math.random()<.55 || first){ const c=World.friendEl("cat","wh-cat"); c.style.left=(20+Math.random()*50)+"%"; roomEl.appendChild(c); } }

  /* ---------- غرفة الذكريات ---------- */
  function memories(){
    roomEl.innerHTML = `<div class="wh-cork">${(S.memories||[]).slice(-6).reverse().map((m,i)=>`<div class="wh-pin" style="--r:${(i%3-1)*4}deg;background:${m.color||"#FFF6D8"}"><b>${esc(m.title)}</b><small>${esc(m.text||"")}</small></div>`).join("") || `<div class="wh-pin" style="--r:-3deg"><b>لوحة الذكريات</b><small>الذكريات اللي تحفظينها بالمتحف تتعلّق هنا.</small></div>`}</div>`;
    ui.innerHTML = `<div class="wcard wh-row"><b>كل ذكرى تحفظينها تبين هنا.</b><button class="btn honey small" data-go="museum">روحي لمتحف الذكريات</button></div>`;
    $("[data-go]",ui).onclick=()=>World.leaveTo("world:museum");
  }
  /* ---------- غرفة الرسم ---------- */
  function draw(){
    roomEl.innerHTML = `<div class="wh-easel"><svg viewBox="0 0 120 130"><path d="M30 130L50 20M90 130L70 20M60 30v100" stroke="#7A5A3A" stroke-width="5"/><rect x="14" y="20" width="92" height="70" rx="4" fill="#FBF6E8" stroke="#B8A57A" stroke-width="3"/></svg><img class="wh-thumb" alt="" hidden></div>`;
    ui.innerHTML = `<div class="wcard wh-row"><b>المرسم يفتح مباشرة من هنا.</b><button class="btn honey small" data-new>رسمة جديدة</button><button class="btn ghost small" data-gal>معرض الرسومات</button></div>`;
    World.DB.all("drawings").then(a=>{ const last=a.sort((x,y)=>y.t-x.t)[0]; const im=$(".wh-thumb",roomEl); if(last && im){ im.src=last.thumb; im.hidden=false; } });
    $("[data-new]",ui).onclick=()=>WStudio.open(null, "world:home");
    $("[data-gal]",ui).onclick=()=>{ Store.set("museumTab","art"); World.leaveTo("world:museum"); };
  }
  /* ---------- المطبخ ---------- */
  function kitchen(){
    roomEl.innerHTML = `<div class="wh-stove">${WART.pot(0)}</div>`;
    const open = World.isOpen("kitchen"), n=Object.keys(S.recipes).length;
    ui.innerHTML = `<div class="wcard wh-row"><b>${open?`طبختي ${n} من 6 وصفات.`:World.REG.kitchen.hint}</b>${open?`<button class="btn honey small" data-go>روحي لمطبخ الغابة</button>`:""}</div>`;
    const g=$("[data-go]",ui); if(g) g.onclick=()=>World.leaveTo("world:kitchen");
  }
  /* ---------- الشرفة ---------- */
  function balcony(){
    roomEl.innerHTML = `<div class="wh-view"><div class="wh-hills"></div><div class="wh-trees">${Array.from({length:7},(_,i)=>`<i style="left:${i*15}%;--s:${.7+((i*37)%5)/10}"></i>`).join("")}</div><div class="wh-rail"></div>
      ${H.weather==="day"?`<span class="wh-bfly">${WART.butterfly()}</span>`:""}</div>`;
    ui.innerHTML = `<div class="wcard wh-row"><b>${{day:"شمس دافية على الغابة.",sunset:"الغروب يلوّن كل الأشجار.",night:"اليراعات طلعت تسلّم.",rain:"مطر خفيف وريحة تراب."}[H.weather]}</b><button class="btn ghost small" data-next>غيّري الجو</button></div>`;
    $("[data-next]",ui).onclick=()=>{ const i=WEATHER.findIndex(w=>w[0]===H.weather); weather(WEATHER[(i+1)%4][0]); balcony(); };
  }
  /* ---------- غرفة المفاجآت + صندوق البريد ---------- */
  function gifts(){
    const letters = S.mail.filter(m=>m.ready && m.deliver==="home" && !m.read);
    roomEl.innerHTML = `<div class="wh-gifts">${S.gifts.map(g=>`<button class="wh-gift" data-g="${g.id}" aria-label="افتحي ${esc(g.title)}">${WART.gift(["#E9A79E","#B9A6DD","#8EC3CF","#9DBF8E"][g.id.length%4])}<small>${esc(g.title)}</small></button>`).join("")}
      ${letters.map(m=>`<button class="wh-gift" data-m="${m.id}" aria-label="رسالة">${WART.envelope(m.color, m.stk?WART.item[m.stk]():"")}<small>رسالة إلى ${m.to==="elaf"?"إيلاف":"عدول"}</small></button>`).join("")}</div>`;
    if(!S.gifts.length && !letters.length) roomEl.insertAdjacentHTML("beforeend", `<p class="wh-empty">الغرفة تنتظر مفاجآت. الأوسمة والوصفات والمهرجانات تجيب هدايا هنا.</p>`);
    ui.innerHTML = `<div class="wcard"><b>الهدايا اللي تنفتح إلج تنتظر هنا. اضغطي على أي صندوق.</b>${(S.opened||[]).length?`<p class="wnote">فتحتي ${(S.opened||[]).length} هدية لحد هسه.</p>`:""}</div>`;
    $$("[data-g]",roomEl).forEach(b=>b.onclick=()=>{ b.classList.add("opening"); World.sfx("sparkle"); setTimeout(()=>{ const g=World.openGift(b.dataset.g); if(g){ modal(`<div class="wd-modal" style="text-align:center"><h2>${esc(g.title)}</h2><p style="font-size:1.1rem">${esc(World.rewardText(g.reward))||"هدية حلوة!"}</p><p class="wnote">الزينة تلگينها بغرفة الجلوس ← أغراض البيت. الألوان والملصقات بالمرسم.</p></div>`); if(motionOK()) confetti(); } room("gifts"); }, motionOK()?650:0); });
    $$("[data-m]",roomEl).forEach(b=>b.onclick=()=>{ const m=S.mail.find(x=>x.id===b.dataset.m); m.read=true; World.save(); World.event("letter"); WPost.show(m); room("gifts"); });
  }
  const R = {living, memories, draw, kitchen, balcony, gifts};
  function room(k){ H.room=k; World.save(); $$("[data-room]",v).forEach(b=>b.setAttribute("aria-pressed", b.dataset.room===k)); scene.dataset.room=k; roomEl.innerHTML=""; R[k](); }
  $$("[data-room]",v).forEach(b=>b.onclick=()=>{ World.sfx("page"); room(b.dataset.room); });
  room(H.room||"living");
  // رسائل جاهزة من الشخصيات تنفتح مع التقدّم
  WPost.deliver("home");
  if(first){ setTimeout(()=>{ bubble(cs.chars[0].el, "هلا بيج ببيتنا! كل غرفة بيها شي."); cs.wave("elaf"); }, 700); setTimeout(()=>bubble(cs.chars[1].el, "اسحبي الأثاث ورتّبيه مثل ما تحبين."), 3200); }
  return () => cs.stop();
});
