/* =====================================================================
   عالمنا — مطبخ الغابة: وصفات خيالية من مقتنيات الغابة والحديقة
   ===================================================================== */
World.region("kitchen", (body) => {
  const S = World.S;
  const DISH = {
    tea:   () => `<svg viewBox="0 0 100 80"><path d="M18 30h56v20a24 24 0 01-24 24h-8a24 24 0 01-24-24z" fill="#FBF6E8" stroke="#8C6C48" stroke-width="3"/><path d="M74 36c14 0 14 18 0 18" stroke="#8C6C48" stroke-width="4" fill="none"/><ellipse cx="46" cy="32" rx="26" ry="6" fill="#D9A06A"/><path d="M40 6c-4 6 4 10 0 16M54 6c-4 6 4 10 0 16" stroke="#C8BEEA" stroke-width="3" fill="none" class="steam"/><g transform="translate(52 22) scale(.4)"><path d="M30 25C20 6 4 6 6 20C7 30 20 30 30 26Z" fill="#F3A9B8"/><path d="M30 25C40 6 56 6 54 20C53 30 40 30 30 26Z" fill="#B9A6DD"/></g></svg>`,
    cake:  () => `<svg viewBox="0 0 100 80"><ellipse cx="50" cy="72" rx="40" ry="6" fill="#E9DDBA"/><path d="M18 40h64v28H18z" fill="#F3D9D2" stroke="#A8566A" stroke-width="2.4"/><path d="M14 40C10 30 20 22 30 26 32 14 50 12 54 22 62 12 82 18 80 30 90 30 90 40 84 40z" fill="#FFFFFF" stroke="#C8BEEA" stroke-width="2.4"/><circle cx="50" cy="20" r="5" fill="#C8507A"/></svg>`,
    juice: () => `<svg viewBox="0 0 100 80"><path d="M30 14h40l-6 60H36z" fill="#F4ECFF" stroke="#8C6C48" stroke-width="2.6" opacity=".9"/><path d="M33 34h34l-4 38H37z" fill="#C8507A"/><circle cx="44" cy="46" r="3" fill="#FFE7AE"/><circle cx="56" cy="58" r="3" fill="#FFE7AE"/><path d="M58 4l-6 30" stroke="#8EC3CF" stroke-width="4"/></svg>`,
    soup:  () => `<svg viewBox="0 0 100 80"><path d="M10 34h80a40 30 0 01-80 0z" fill="#B9A6DD" stroke="#6B5596" stroke-width="2.6"/><ellipse cx="50" cy="34" rx="40" ry="8" fill="#F2D27A"/><path d="M40 30l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1zM62 28l2 3 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#FFF0B8"/></svg>`,
    biscuit:() => `<svg viewBox="0 0 100 80">${[[30,44],[56,38],[70,56]].map(([x,y])=>`<g transform="translate(${x} ${y})"><path d="M-16 8C-18-6-4-16 14-16c0 16-10 26-30 24z" fill="#D9A06A" stroke="#8C6C48" stroke-width="2.4"/><path d="M-14 6L10-12" stroke="#8C6C48" stroke-width="1.6"/></g>`).join("")}</svg>`,
    milk:  () => `<svg viewBox="0 0 100 80"><circle cx="50" cy="40" r="34" fill="#FFF3C4" opacity=".35"/><path d="M34 16h32l-4 58H38z" fill="#FFFDF6" stroke="#8C6C48" stroke-width="2.6"/><path d="M36 30h28" stroke="#E4E1F4" stroke-width="3"/><path d="M56 40a10 10 0 1010 12 7 7 0 01-10-12z" fill="#F6E3A1"/></svg>`
  };
  const R = [
    {id:"tea", n:"شاي الفراشات", ing:[["leaf",2],["flower",1],["drop",1]], soup:"#D9A06A", r:{color:"c_sky"}, known:()=>true},
    {id:"biscuit", n:"بسكويت أوراق الشجر", ing:[["leaf",3],["honey",1]], soup:"#D9B88A", r:{decor:"garland"}, known:()=>true},
    {id:"juice", n:"عصير التوت المضيء", ing:[["berry",3],["mushroom",1],["drop",1]], soup:"#C8507A", r:{plant:"lilac"}, known:()=>true},
    {id:"cake", n:"كعكة الغيوم", ing:[["cloud",2],["honey",1],["berry",1]], soup:"#F3E8F8", r:{decor:"cloudPillow"}, known:()=>!!S.visited.beach, hint:"تنكشف بعد ما تزورين شاطئ الغيوم"},
    {id:"soup", n:"شوربة النجوم", ing:[["star",1],["mushroom",1],["leaf",1],["drop",1]], soup:"#F2D27A", r:{items:{star:3}}, known:()=>!!S.visited.sky, hint:"تنكشف بعد ما تزورين مرصد القمر"},
    {id:"milk", n:"حليب القمر", ing:[["moon",1],["drop",1],["flower",1]], soup:"#FFF3C4", r:{plant:"moon"}, known:()=>Object.keys(S.recipes).length>=2, hint:"تنكشف بعد ما تطبخين وصفتين"}
  ];
  const WHERE = {leaf:"الغابة ونبتة اليوم بالحديقة", flower:"الحديقة", drop:"النهر والسلحفاة", honey:"بستان الفواكه بالغابة", berry:"بستان الغابة والحديقة", mushroom:"منطقة الفطر المضيء", cloud:"شاطئ الغيوم", star:"الألعاب والغابة", moon:"المرصد وزهرة القمر", seed:"الغابة"};
  const v = h(`<div class="wr wk"><div class="wtabs"><button data-tab="list" aria-pressed="true">الوصفات</button><button data-tab="book" aria-pressed="false">دفتر الطبخ</button></div><div class="wk-body"></div></div>`);
  body.appendChild(v);
  const out=$(".wk-body",v);
  $$("[data-tab]",v).forEach(b=>b.onclick=()=>{ $$("[data-tab]",v).forEach(x=>x.setAttribute("aria-pressed",x===b)); b.dataset.tab==="book"?book():list(); });
  const canCook = r => r.ing.every(([k,n])=>World.has(k,n));
  function list(){
    out.innerHTML = `<div class="wk-chef"><span class="wk-cat"></span><p class="wcard">اختاري وصفة. إذا ناقصج شي، أگولج وين تلگينه.</p></div><div class="wgrid">${R.map(r=>{ const kn=r.known(); return `<button class="wtile ${kn?"":"locked"} ${S.recipes[r.id]?"done":""}" data-r="${r.id}"><span class="art">${kn?DISH[r.id]():`<span class="wd-unk">؟</span>`}</span><b>${kn?r.n:"وصفة سرية"}</b><small>${kn?r.ing.map(([k,n])=>`${n} ${World.ITEMS[k].n}`).join(" · "):r.hint}</small></button>`; }).join("")}</div>`;
    $(".wk-cat",out).appendChild(World.friendEl("cat"));
    $$("[data-r]",out).forEach(b=>b.onclick=()=>{ const r=R.find(x=>x.id===b.dataset.r); if(!r.known()){ toast(r.hint,"lock"); return; } card(r); });
  }
  function card(r){
    const ok = canCook(r);
    out.innerHTML = `<div class="wcard wk-card"><span class="wk-dish">${DISH[r.id]()}</span><h3>${r.n}</h3>
      <ol class="wk-ing">${r.ing.map(([k,n])=>{ const have=S.inv[k]||0; return `<li class="${have>=n?"ok":""}"><span>${World.itemArt(k)}</span><b>${n} ${World.ITEMS[k].n}</b><small>${have>=n?`عندج ${have}`:`ناقص — تلگينه ب${WHERE[k]}`}</small></li>`; }).join("")}</ol>
      <div class="row"><button class="btn honey" data-cook ${ok?"":"disabled"}>ابدئي الطبخ</button><button class="btn ghost" data-back>رجوع</button></div></div>`;
    $("[data-back]",out).onclick=list; const c=$("[data-cook]",out); if(c) c.onclick=()=>cook(r);
  }
  function cook(r){
    let step=0, stir=0;
    const order = r.ing.map(x=>x[0]);
    const shuffled = order.slice().sort(()=>Math.random()-.5);
    out.innerHTML = `<div class="wk-stage" style="--soup:#9EC6D8"><div class="wk-steps">${order.map((k,i)=>`<span data-s="${i}">${i+1}. ${World.ITEMS[k].n}</span>`).join("")}<span data-s="stir">${order.length+1}. حرّكي ثلاث مرات</span></div>
      <div class="wk-pot">${WART.pot(0)}<div class="wk-bub"></div></div><div class="wk-ings">${shuffled.map(k=>`<button class="wk-ingb" data-k="${k}">${World.itemArt(k)}<small>${World.ITEMS[k].n}</small></button>`).join("")}</div>
      <button class="btn honey wk-stir" data-stir hidden>حرّكي</button><p class="wk-say">ضيفي المكونات بالترتيب المكتوب.</p></div>`;
    const pot=$(".wk-pot",out), say=$(".wk-say",out);
    const mark = () => $$("[data-s]",out).forEach(s=>s.classList.toggle("on", s.dataset.s===String(step) || (s.dataset.s==="stir" && step>=order.length)));
    mark();
    $$("[data-k]",out).forEach(b=>b.onclick=()=>{
      if(b.disabled) return;
      if(b.dataset.k!==order[step]){ World.sfx("soft"); say.textContent = "مو هذا هسه. شوفي الخطوة اللي تلمع."; b.classList.remove("no"); void b.offsetWidth; b.classList.add("no"); return; }
      b.disabled=true; b.classList.add("in"); World.sfx("splash"); step++; pot.style.setProperty("--soup", step===order.length ? r.soup : ["#9EC6D8","#B8D8C8","#D8D0B8","#E0C8B8"][step%4]);
      say.textContent = step<order.length ? "حلو! الجاي." : "هسه حرّكي القدر.";
      mark(); if(step===order.length) $("[data-stir]",out).hidden=false;
    });
    $("[data-stir]",out).onclick=()=>{ stir++; pot.innerHTML = WART.pot(stir%2?1:-1)+'<div class="wk-bub"></div>'; World.sfx("soft"); if(stir>=3){ $("[data-stir]",out).hidden=true; say.textContent="تطبخ… شمّي الريحة!"; pot.classList.add("boil"); setTimeout(()=>done(r), motionOK()?1600:200); } };
  }
  function done(r){
    r.ing.forEach(([k,n])=>World.spend(k,n));
    const first = !S.recipes[r.id];
    S.recipes[r.id] = {n:(S.recipes[r.id]?.n||0)+1, d:World.today()}; World.save(); World.event("cook"); World.checkAch();
    if(first) World.gift("rec_"+r.id, "مكافأة "+r.n, r.r);
    World.sfx("ok"); if(motionOK()) confetti();
    out.innerHTML = `<div class="wcard wk-card wk-done"><span class="wk-dish big">${DISH[r.id]()}</span><h3>${r.n} جاهز!</h3><p>${first?"انضافت لدفتر الطبخ، وتنتظرج هدية بغرفة المفاجآت بالبيت.":"طبختيها مرة ثانية، وصارت أطيب."}</p><div class="row"><button class="btn honey" data-l>وصفة ثانية</button><button class="btn ghost" data-b>دفتر الطبخ</button></div></div>`;
    $("[data-l]",out).onclick=list; $("[data-b]",out).onclick=book;
  }
  function book(){
    const done=R.filter(r=>S.recipes[r.id]);
    out.innerHTML = done.length ? `<div class="wgrid">${done.map(r=>`<div class="wtile done"><span class="art">${DISH[r.id]()}</span><b>${r.n}</b><small>طبختيها ${S.recipes[r.id].n} مرة</small></div>`).join("")}</div>` : `<p class="wnote">دفتر الطبخ فارغ. أول وصفة تطبخينها تنكتب هنا.</p>`;
  }
  list();
});
