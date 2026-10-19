/* =====================================================================
   عالمنا — جزيرة المهرجانات (تختارينها بحرية، بدون تاريخ مفروض)
   كل مهرجان: خلفية، زينة تتحرك، نشاط، مهمة قصيرة، مقتنى، وذكرى تنحفظ.
   ===================================================================== */
World.region("festival", (body) => {
  const S = World.S;
  const balloon = c => `<svg viewBox="0 0 40 70"><ellipse cx="20" cy="20" rx="16" ry="19" fill="${c}"/><path d="M20 39l-3 5h6zM20 44q-6 12 2 26" stroke="#7A5A3A" fill="none" stroke-width="1.4"/><ellipse cx="14" cy="12" rx="4" ry="6" fill="#fff" opacity=".4"/></svg>`;
  const lantern = (on,c="#F6C86A") => `<svg viewBox="0 0 40 60"><path d="M20 0v8" stroke="#5E3B28" stroke-width="2"/>${on?`<circle cx="20" cy="32" r="22" fill="${c}" opacity=".3"/>`:""}<path d="M8 10h24l4 10v20l-4 10H8l-4-10V20z" fill="${on?c:"#6E6A80"}" stroke="#5E3B28" stroke-width="2"/></svg>`;
  const F = [
    {id:"lanterns", n:"ليلة الفوانيس", sym:"star", bg:"linear-gradient(180deg,#1E1A3C,#5A4C9A)", deco:i=>lantern(true,["#F6C86A","#E87A6A","#B9A6DD"][i%3]), act:"tap", goal:8, art:()=>lantern(false), artOn:()=>lantern(true), task:"ضوّي ثماني فوانيس", say:"كل فانوس يضوي يطير شوية للسما."},
    {id:"rain", n:"يوم المطر", sym:"drop", bg:"linear-gradient(180deg,#8E9EB0,#C8D4DC)", deco:()=>WART.item.cloud(), act:"catch", goal:10, art:()=>WART.item.drop(), task:"القطي عشر قطرات", say:"المطر يغني على السطوح."},
    {id:"flowers", n:"مهرجان الزهور", sym:"flower", bg:"linear-gradient(180deg,#FBE3EF,#E6F2DA)", deco:()=>WART.item.flower(), act:"ring", goal:6, art:()=>WART.item.flower(), task:"سوّي تاج من ست زهور", say:"تاج الزهور يليق بإيلاف."},
    {id:"stars", n:"ليلة النجوم", sym:"moon", bg:"linear-gradient(180deg,#14112B,#2E2A5C)", deco:()=>WART.item.star(), act:"connect", goal:7, art:()=>WART.item.star(), task:"وصّلي سبع نجوم", say:"النجوم ترسم شكل يعرفه بس إنتو."},
    {id:"bday_elaf", n:"عيد ميلاد إيلاف", sym:"flower", bg:"linear-gradient(180deg,#FBE3EF,#F3D9D2)", deco:i=>balloon(["#F3A9B8","#B9A6DD","#F2D27A"][i%3]), act:"cake", goal:5, cake:"#F3A9B8", task:"زيّني الكيكة بخمس شموع وطفيها", say:"كل سنة وإيلاف تضحك أكثر."},
    {id:"bday_adool", n:"عيد ميلاد عدول", sym:"leaf", bg:"linear-gradient(180deg,#E6F2DA,#CFE3EA)", deco:i=>balloon(["#9DBF8E","#8EC3CF","#F2D27A"][i%3]), act:"cake", goal:5, cake:"#9DBF8E", task:"زيّني الكيكة بخمس شموع وطفيها", say:"عدول يگول: أريد قطعة كبيرة!"},
    {id:"gifts", n:"يوم الهدايا", sym:"berry", bg:"linear-gradient(180deg,#F3E6C8,#F7D3C4)", deco:i=>WART.gift(["#E9A79E","#8EC3CF","#B9A6DD"][i%3]), act:"gifts", goal:6, task:"افتحي ست هدايا", say:"أحلى هدية: يوم سوا."},
    {id:"colors", n:"يوم الألوان", sym:"seed", bg:"linear-gradient(135deg,#FBE3EF,#E6F4FA,#F6E3A1)", deco:i=>`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="${["#E87A6A","#F2C94C","#8EC3CF","#9DBF8E","#B9A6DD"][i%5]}" opacity=".8"/></svg>`, act:"paint", goal:12, task:"لوّني ١٢ مربع", say:"الألوان تطير بالهوا!"},
    {id:"music", n:"مهرجان الموسيقى", sym:"feather", bg:"linear-gradient(180deg,#2E2A5C,#8E6AA8)", deco:()=>`<svg viewBox="0 0 40 40"><path d="M14 30V8l18-4v22" stroke="#FFE7AE" stroke-width="3" fill="none"/><circle cx="10" cy="30" r="5" fill="#FFE7AE"/><circle cx="28" cy="26" r="5" fill="#FFE7AE"/></svg>`, act:"music", goal:6, task:"اعزفي لحن من ست نغمات", say:"البومة ترقص على اللحن."},
    {id:"winter", n:"رحلة الشتاء", sym:"cloud", bg:"linear-gradient(180deg,#CFE3EA,#F4F8FB)", deco:()=>`<svg viewBox="0 0 40 40"><path d="M20 4v32M4 20h32M8 8l24 24M32 8L8 32" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`, act:"snow", goal:6, task:"ابني رجل ثلج", say:"رجل الثلج لابس وشاح عدول!"}
  ];
  const v = h(`<div class="wr wfe"><div class="wfe-pick wgrid">${F.map(f=>`<button class="wtile ${S.fest.done[f.id]?"done":""}" data-f="${f.id}" style="background:${f.bg};color:${/1E1A|14112|2E2A/.test(f.bg)?"#FFF6D8":"var(--ink)"}"><span class="art">${f.deco(0)}</span><b>${f.n}</b><small>${S.fest.done[f.id]?"احتفلتي ✓":f.task}</small></button>`).join("")}</div><div class="wfe-stage"></div></div>`);
  body.appendChild(v);
  const pickEl=$(".wfe-pick",v), stage=$(".wfe-stage",v);
  let timers=[], casts=[];
  $$("[data-f]",v).forEach(b=>b.onclick=()=>open(F.find(f=>f.id===b.dataset.f)));
  function menu(){ timers.forEach(clearInterval); timers=[]; casts.forEach(c=>c.stop()); casts=[]; stage.innerHTML=""; pickEl.hidden=false; $$("[data-f]",v).forEach(b=>{ const f=F.find(x=>x.id===b.dataset.f); b.classList.toggle("done",!!S.fest.done[f.id]); b.querySelector("small").textContent = S.fest.done[f.id]?"احتفلتي ✓":f.task; }); }
  function open(f){
    pickEl.hidden=true; World.sfx("page");
    stage.innerHTML = `<div class="wfe-scene" style="background:${f.bg}"><div class="wfe-deco">${Array.from({length:7},(_,i)=>`<i style="left:${6+i*14}%;--d:${-i*.7}s">${f.deco(i)}</i>`).join("")}</div><div class="wfe-play"></div><div class="wfe-cast"></div></div>
      <div class="wcard wfe-bar"><b class="wfe-task">${f.task} — <span class="wfe-n">0</span>/${f.goal}</b><button class="btn ghost small" data-back>المهرجانات</button></div>`;
    $("[data-back]",stage).onclick=menu;
    const cs=World.cast($(".wfe-cast",stage), {h:30, x:[18,84], range:[6,94]}); casts.push(cs);
    const play=$(".wfe-play",stage); let n=0;
    const prog = () => { n++; $(".wfe-n",stage).textContent=Math.min(n,f.goal); if(n===f.goal) complete(f, cs); };
    ({tap, catch:catchDrops, ring, connect, cake, gifts, paint, music, snow})[f.act](f, play, prog);
  }
  function complete(f, cs){
    const first=!S.fest.done[f.id]; S.fest.done[f.id]=World.today(); World.save(); World.checkAch(); World.sfx("ok"); if(motionOK()) confetti(); cs.wave("elaf"); cs.wave("adool");
    if(first){ World.give(f.sym, 2); S.fest.keep[f.id]={title:f.n, sym:f.sym, date:World.today()}; World.save(); }
    const bar=$(".wfe-bar",stage); bar.innerHTML = `<b>${f.say} ${first?`حصلتي على مقتنى «${f.n}» المحدود.`:""}</b><button class="btn honey small" data-mem>احفظيها ذكرى</button><button class="btn ghost small" data-back>المهرجانات</button>`;
    $("[data-back]",bar).onclick=menu;
    $("[data-mem]",bar).onclick=()=>{ S.memories=S.memories||[]; S.memories.push({id:"m"+Date.now(), title:f.n, date:new Date().toISOString().slice(0,10), text:f.say, color:"#F7E1B8", stk:f.sym, cat:"occasion"}); World.stat("memories"); World.save(); toast("انحفظت بركن المناسبات بالمتحف","check"); $("[data-mem]",bar).disabled=true; };
  }
  /* ---------- أنواع النشاطات ---------- */
  function tap(f, el, prog){ el.innerHTML=`<div class="wfe-grid">${Array.from({length:f.goal},(_,i)=>`<button data-i="${i}" aria-label="فانوس">${f.art()}</button>`).join("")}</div>`; $$("[data-i]",el).forEach(b=>b.onclick=()=>{ if(b.classList.contains("on")) return; b.classList.add("on"); b.innerHTML=f.artOn(); World.sfx("sparkle"); prog(); }); }
  function catchDrops(f, el, prog){ el.innerHTML=`<div class="wfe-rain"></div>`; const box=$(".wfe-rain",el); let caught=0;
    const t=setInterval(()=>{ if(!document.body.contains(box)){ clearInterval(t); return; } if(caught>=f.goal) return; const d=h(`<button class="wfe-drop" style="left:${Math.random()*86}%" aria-label="قطرة">${WART.item.drop()}</button>`); box.appendChild(d); d.onclick=()=>{ if(d.got) return; d.got=1; caught++; World.sfx("pick"); d.classList.add("got"); prog(); setTimeout(()=>d.remove(),300); }; setTimeout(()=>d.remove(), 3200); }, 650); timers.push(t); }
  function ring(f, el, prog){ el.innerHTML=`<div class="wfe-ring">${Array.from({length:f.goal},(_,i)=>`<span class="slot" style="--a:${i/f.goal*360}deg"></span>`).join("")}</div><div class="wfe-pal">${["#F3A9B8","#F2D27A","#B9A6DD","#E87A6A","#8EC3CF","#FFFFFF"].map(c=>`<button data-c="${c}" style="--c:${c}">${WART.item.flower().replace("#F3A9B8",c)}</button>`).join("")}</div>`; let i=0;
    $$("[data-c]",el).forEach(b=>b.onclick=()=>{ if(i>=f.goal) return; const s=$$(".slot",el)[i++]; s.innerHTML=b.innerHTML; s.classList.add("on"); World.sfx("pop"); prog(); }); }
  function connect(f, el, prog){ const P=Array.from({length:f.goal},(_,i)=>[12+((i*37)%76), 14+((i*53)%60)]); let n=0; el.innerHTML=`<svg class="wfe-stars" viewBox="0 0 100 80"><polyline points="" fill="none" stroke="#FFE7AE" stroke-width="1"/>${P.map((p,i)=>`<g data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="5" fill="transparent"/><circle cx="${p[0]}" cy="${p[1]}" r="1.8" fill="#FFF8E0"/></g>`).join("")}</svg>`; const pl=$("polyline",el), pts=[];
    $$("[data-i]",el).forEach(g=>g.addEventListener("click",()=>{ if(g.classList.contains("on")) return; g.classList.add("on"); pts.push(P[+g.dataset.i].join(",")); pl.setAttribute("points",pts.join(" ")); TAudio.note(n++%7,.4); prog(); })); }
  function cake(f, el, prog){ let c=0, lit=false; el.innerHTML=`<div class="wfe-cake" style="--ck:${f.cake}"><svg viewBox="0 0 160 120"><ellipse cx="80" cy="112" rx="70" ry="8" fill="rgba(0,0,0,.15)"/><rect x="20" y="60" width="120" height="50" rx="8" fill="var(--ck)" stroke="rgba(0,0,0,.3)" stroke-width="2"/><path d="M20 70q15 10 30 0t30 0 30 0 30 0" stroke="#fff" stroke-width="5" fill="none"/></svg><div class="wfe-candles"></div></div><div class="row" style="justify-content:center"><button class="btn honey small" data-add>حطي شمعة</button><button class="btn small" data-blow hidden>اطفي الشموع</button></div>`;
    $("[data-add]",el).onclick=()=>{ if(c>=f.goal) return; c++; $(".wfe-candles",el).insertAdjacentHTML("beforeend", `<i class="cd" style="left:${12+c*14}%"></i>`); World.sfx("pop"); prog(); if(c===f.goal-1) $("[data-blow]",el).hidden=false; };
    $("[data-blow]",el).onclick=()=>{ if(lit) return; lit=true; if(c<f.goal){ c=f.goal; prog(); } $$(".cd",el).forEach(x=>x.classList.add("out")); World.sfx("wind"); }; }
  function gifts(f, el, prog){ el.innerHTML=`<div class="wfe-grid">${Array.from({length:f.goal},(_,i)=>`<button data-i="${i}" aria-label="هدية">${WART.gift(["#E9A79E","#8EC3CF","#B9A6DD","#9DBF8E","#F2D27A","#F3A9B8"][i])}</button>`).join("")}</div>`; const ins=["star","flower","leaf","berry","feather","shell"];
    $$("[data-i]",el).forEach(b=>b.onclick=()=>{ if(b.classList.contains("on")) return; b.classList.add("on"); b.innerHTML=WART.item[ins[+b.dataset.i]](); World.sfx("sparkle"); prog(); }); }
  function paint(f, el, prog){ const C=["#E87A6A","#F2C94C","#8EC3CF","#9DBF8E","#B9A6DD"]; let col=C[0], n=0; el.innerHTML=`<div class="wfe-tiles">${Array.from({length:f.goal},(_,i)=>`<button data-i="${i}" aria-label="مربع"></button>`).join("")}</div><div class="wchips" style="justify-content:center">${C.map(c=>`<button class="wsw" data-c="${c}" style="background:${c}" aria-pressed="${c===col}" aria-label="لون"></button>`).join("")}</div>`;
    $$("[data-c]",el).forEach(b=>b.onclick=()=>{ col=b.dataset.c; $$("[data-c]",el).forEach(x=>x.setAttribute("aria-pressed",x===b)); });
    $$(".wfe-tiles button",el).forEach(b=>b.onclick=()=>{ const was=b.dataset.p; b.style.background=col; b.dataset.p=1; World.sfx("splash"); if(!was) prog(); }); }
  function music(f, el, prog){ const C=["#E87A6A","#F2C94C","#9DBF8E","#8EC3CF","#B9A6DD","#F3A9B8"]; const tune=[0,2,4,2,5,4]; let i=0;
    el.innerHTML=`<p class="wfe-tune">${tune.map((t,k)=>`<i style="background:${C[t]}" data-k="${k}"></i>`).join("")}</p><div class="wfe-xylo">${C.map((c,k)=>`<button data-n="${k}" style="--c:${c};--h:${100-k*9}%" aria-label="نغمة ${k+1}"></button>`).join("")}</div>`;
    const mark=()=>$$("[data-k]",el).forEach(x=>x.classList.toggle("next", +x.dataset.k===i)); mark();
    $$("[data-n]",el).forEach(b=>b.onclick=()=>{ const k=+b.dataset.n; TAudio.unlock(); TAudio.note(k,.5); b.classList.add("on"); setTimeout(()=>b.classList.remove("on"),200); if(i<tune.length && k===tune[i]){ $(`[data-k="${i}"]`,el).classList.add("on"); i++; prog(); mark(); } }); }
  function snow(f, el, prog){ const parts=[["قاعدة","base"],["بطن","mid"],["راس","head"],["قبعة","hat"],["وشاح","scarf"],["أنف جزر","nose"]]; let i=0;
    el.innerHTML=`<div class="wfe-snow"><svg viewBox="0 0 120 160"><circle class="p base" cx="60" cy="128" r="28" fill="#fff" stroke="#B8C8D8" stroke-width="2"/><circle class="p mid" cx="60" cy="86" r="21" fill="#fff" stroke="#B8C8D8" stroke-width="2"/><circle class="p head" cx="60" cy="52" r="15" fill="#fff" stroke="#B8C8D8" stroke-width="2"/><g class="p hat"><rect x="46" y="22" width="28" height="20" rx="2" fill="#3D3A50"/><rect x="40" y="38" width="40" height="5" fill="#3D3A50"/></g><path class="p scarf" d="M44 66h32l-4 6H48zM68 70l4 18h-8z" fill="#9DBF8E"/><path class="p nose" d="M60 52l14 3-14 3z" fill="#F0A35E"/><circle cx="55" cy="48" r="2" fill="#2F2A20" class="p head"/><circle cx="65" cy="48" r="2" fill="#2F2A20" class="p head"/></svg></div><div class="wchips" style="justify-content:center">${parts.map(([n,k],j)=>`<button data-j="${j}">${n}</button>`).join("")}</div>`;
    $$("[data-j]",el).forEach(b=>b.onclick=()=>{ if(+b.dataset.j!==i){ World.sfx("soft"); toast("ابني من تحت لفوگ: "+parts[i][0]+" أول","bulb"); return; } $$("."+parts[i][1],el).forEach(p=>p.classList.add("on")); b.disabled=true; i++; World.sfx("pop"); prog(); }); }
  return () => { timers.forEach(clearInterval); casts.forEach(c=>c.stop()); };
});
