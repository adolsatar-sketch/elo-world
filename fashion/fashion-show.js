/* =====================================================================
   دار إيلاف — الكواليس، مسرح العرض الكبير، استوديو الصور، ساحة المهرجان
   ===================================================================== */
const FShow = (() => {
  const A = FArt, D = FDesign;
  const clone = o => JSON.parse(JSON.stringify(o));
  const wait = (ms, run) => new Promise((res, rej) => { const t = setTimeout(()=>{ run.timers.delete(t); run.dead ? rej("dead") : res(); }, ms); run.timers.add(t); });

  /* ---------------- خيارات العرض ---------------- */
  const THEMES = {spring:"الربيع", clouds:"الغيوم", stars:"النجوم", garden:"الحديقة", party:"الحفلة"};
  const SEGS = {open:"الافتتاح", colors:"فقرة الألوان", dream:"فقرة الحلم", wings:"فقرة الأجنحة", finale:"الختام الكبير"};
  const LIGHTS = {warm:["#FFD9A0","دافي"], pink:["#FFB3CF","وردي"], blue:["#A8D8FF","أزرق"], lilac:["#D2BFFF","ليلكي"], gold:["#FFE38A","ذهبي"], mint:["#B8F0D8","نعناعي"]};
  const MUSIC = {none:"بدون", calm:"هادية", bright:"مرحة", dream:"حالمة", party:"احتفالية"};
  const MUSIC_TH = {calm:"atelier", bright:"stage", dream:"dream", party:"party"};
  const FX = {petals:"بتلات", stars:"نجوم", bubbles:"فقاعات", leaves:"أوراق", none:"بدون"};
  const defShow = () => ({theme:"spring", looks:["__cur"], seg:{}, nowings:{}, bg:"curtain", light:"warm", music:FW.S.opts.music?"bright":"none", fx:"petals", pose:"twirl"});
  const getShow = () => { const S = FW.S; S.show = Object.assign(defShow(), S.show||{}); S.show.looks = S.show.looks.filter(id=>id==="__cur"||FW.designById(id)); if(!S.show.looks.length) S.show.looks=["__cur"]; if(!FW.owned("bg",S.show.bg)) S.show.bg="curtain"; if(!FW.owned("pose",S.show.pose)) S.show.pose="twirl"; return S.show; };
  const resolve = id => id==="__cur" ? {id, name:FW.S.cur.name||"التصميم الحالي", look:FW.S.cur.look, wings:FW.S.cur.wings, saved:FW.S.cur.id} : (d => d && {id, name:d.name, look:d.look, wings:d.wings, saved:d.id})(FW.designById(id));

  // لوحة تجهيز العرض (تنستعمل بالكواليس وقبل العرض بالمسرح)
  function planner(host, onGo){
    const S = FW.S, sh = getShow();
    const box = h(`<div class="fp"></div>`); host.appendChild(box);
    const all = () => [{id:"__cur", name:S.cur.name||"التصميم الحالي"}].concat(S.designs.map(d=>({id:d.id, name:d.name})));
    const draw = () => {
      const lks = sh.looks.map(resolve).filter(Boolean);
      box.innerHTML = `
        <section><h4>العارضات وترتيب الدخول <small>(لحد 3 إطلالات)</small></h4>
          <ol class="fp-order">${lks.map((l,i)=>`<li><span class="fp-mini">${A.dollHTML(l.look, sh.nowings[l.id]?{on:false}:l.wings, {anim:false})}</span><div><b>${esc(l.name)}</b>
            <select data-seg="${l.id}" aria-label="الفقرة">${Object.entries(SEGS).map(([k,n])=>`<option value="${k}" ${(sh.seg[l.id]||(i===0?"open":i===lks.length-1&&i>0?"finale":"colors"))===k?"selected":""}>${n}</option>`).join("")}</select>
            ${l.wings&&l.wings.on?`<button class="fc-tg sm" data-nw="${l.id}" aria-pressed="${!sh.nowings[l.id]}"><i></i>بالجناح</button>`:""}</div>
            <span class="fp-ud"><button data-up="${i}" ${i===0?"disabled":""} aria-label="قدّميها">${IC.up}</button><button data-dn="${i}" ${i===lks.length-1?"disabled":""} aria-label="أخّريها">${IC.down}</button><button data-rm="${i}" ${lks.length<2?"disabled":""} aria-label="شيليها">${IC.close}</button></span></li>`).join("")}</ol>
          ${sh.looks.length<3?`<div class="fp-add"><span>أضيفي:</span>${all().filter(x=>!sh.looks.includes(x.id)).map(x=>`<button data-add="${x.id}">${IC.plus}${esc(x.name)}</button>`).join("")||`<small>احفظي تصاميم أكثر بالمتحف حتى تضيفينها.</small>`}</div>`:""}</section>
        <section><h4>موضوع العرض</h4>${D.chips("theme", THEMES, sh.theme)}</section>
        <section><h4>خلفية المسرح</h4>${D.swatches("bg","bg",Object.keys(FW.STAGE_BG),sh.bg)}</section>
        <section><h4>لون الإضاءة</h4><div class="fc-pal" data-k="light">${Object.entries(LIGHTS).map(([k,[c,n]])=>`<button data-v="${k}" aria-pressed="${sh.light===k}" aria-label="${n}" style="--c:${c}"></button>`).join("")}</div></section>
        <section><h4>الموسيقى</h4>${D.chips("music", MUSIC, sh.music)}</section>
        <section><h4>المؤثرات</h4>${D.chips("fx", FX, sh.fx)}</section>
        <section><h4>حركة نهاية الممر</h4>${D.chips("pose", Object.fromEntries(Object.entries(FW.POSES).map(([k,p])=>[k,p.n])), sh.pose, "pose")}</section>
        ${onGo?`<button class="btn honey fp-go" data-go>${FW.FI.play} ابدئي العرض</button>`:""}`;
      fillIcons(box);
    };
    draw();
    D.bindPanel(box, ()=>sh, () => { FW.save(); draw(); });
    box.addEventListener("click", e => {
      const b = e.target.closest("button"); if(!b) return;
      if(b.dataset.up!=null){ const i=+b.dataset.up; [sh.looks[i-1],sh.looks[i]]=[sh.looks[i],sh.looks[i-1]]; }
      else if(b.dataset.dn!=null){ const i=+b.dataset.dn; [sh.looks[i+1],sh.looks[i]]=[sh.looks[i],sh.looks[i+1]]; }
      else if(b.dataset.rm!=null){ sh.looks.splice(+b.dataset.rm,1); }
      else if(b.dataset.add){ if(sh.looks.length<3) sh.looks.push(b.dataset.add); }
      else if(b.dataset.nw){ sh.nowings[b.dataset.nw] = !sh.nowings[b.dataset.nw]; }
      else if(b.dataset.go!=null){ FW.save(); onGo && onGo(); return; }
      else return;
      FW.sfx("soft"); FW.save(); draw();
    });
    box.addEventListener("change", e => { const s=e.target.closest("[data-seg]"); if(s){ sh.seg[s.dataset.seg]=s.value; FW.save(); } });
    return box;
  }

  /* ---------------- رسومات المسرح ---------------- */
  function stageBG(id){
    const b = FW.STAGE_BG[id] || FW.STAGE_BG.curtain;
    const deco = {
      curtain:`<div class="sb-folds"></div>`,
      garden:`<div class="sb-roses">${Array.from({length:9},(_,i)=>`<i style="left:${4+i*11.5}%;--s:${.7+(i%3)*.2}">${FGames.CL.flower}</i>`).join("")}</div><div class="sb-arch"></div>`,
      night:`<div class="sb-stars">${Array.from({length:26},(_,i)=>`<i style="left:${(i*37)%100}%;top:${(i*23)%60}%;--d:${(-i*.3).toFixed(1)}s"></i>`).join("")}</div><div class="sb-moon"></div>`,
      clouds:`<div class="sb-clouds">${[0,1,2,3].map(i=>`<i style="top:${8+i*12}%;--d:${-i*9}s">${FGames.CL.cloud}</i>`).join("")}</div>`,
      crystal:`<div class="sb-chand">${[20,50,80].map(x=>`<i style="left:${x}%"></i>`).join("")}</div>`,
      sea:`<div class="sb-waves"></div><div class="sb-shells">${[12,30,70,88].map(x=>`<i style="left:${x}%">${FGames.CL.shell}</i>`).join("")}</div>`,
      lanterns:`<div class="sb-lant">${Array.from({length:7},(_,i)=>`<i style="left:${6+i*14.5}%;top:${6+(i%2)*8}%;--d:${-i*.7}s"></i>`).join("")}</div>`
    }[id] || "";
    return `<div class="sb sb-${id}" style="--a:${b.a};--b:${b.b}">${deco}</div>`;
  }
  const AUD = ["#F4EEE2","#B99472","#F3B8C8","#8EC3E8","#C9C2D2","#F6E08A","#A9DCC4"];
  const audHead = (i) => { const c=AUD[i%AUD.length], k=i%4;
    const ears = k===0?`<ellipse cx="14" cy="8" rx="4" ry="9" fill="${c}" stroke="#6E5A4E" stroke-width="1.6"/><ellipse cx="26" cy="8" rx="4" ry="9" fill="${c}" stroke="#6E5A4E" stroke-width="1.6"/>`:k===1?`<path d="M10 12l4-8 4 6M30 12l-4-8-4 6" fill="${c}" stroke="#6E5A4E" stroke-width="1.6"/>`:k===2?`<circle cx="10" cy="12" r="5" fill="${c}" stroke="#6E5A4E" stroke-width="1.6"/><circle cx="30" cy="12" r="5" fill="${c}" stroke="#6E5A4E" stroke-width="1.6"/>`:`<path d="M20 4c-2 4-1 6 0 8" stroke="#6E5A4E" stroke-width="2" fill="none"/>`;
    return `<svg viewBox="0 0 40 40">${ears}<circle cx="20" cy="24" r="13" fill="${c}" stroke="#6E5A4E" stroke-width="1.8"/><circle cx="15" cy="23" r="1.8" fill="#2E2A22"/><circle cx="25" cy="23" r="1.8" fill="#2E2A22"/><path d="M17 29q3 3 6 0" stroke="#6E5A4E" stroke-width="1.6" fill="none"/>${k===3?`<path d="M18 26l2 3 2-3z" fill="#F2C14E"/>`:""}</svg>`; };
  const fxEl = (k) => { if(k==="none"||!motionOK()) return ""; const shp = {petals:`<svg viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="5" ry="9" fill="#F7CFDA" stroke="#E59AAE"/></svg>`, stars:`<svg viewBox="0 0 20 20"><path d="M10 1l2.6 6 6.4.6-4.8 4.2 1.4 6.4L10 15l-5.6 3.2 1.4-6.4L1 7.6 7.4 7z" fill="#FFF0B0"/></svg>`, bubbles:`<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#E6F6FF" fill-opacity=".5" stroke="#A8D2EE" stroke-width="1.4"/><circle cx="7" cy="7" r="2" fill="#fff"/></svg>`, leaves:`<svg viewBox="0 0 20 20"><path d="M3 17C2 9 8 3 17 3c0 9-6 15-14 14z" fill="#9DBF8E"/></svg>`}[k];
    return `<div class="fst-fx fx-${k}">${Array.from({length:16},(_,i)=>`<i style="left:${(i*41)%100}%;--d:${(-i*.45).toFixed(2)}s;--t:${(4+i%4).toFixed(1)}s">${shp}</i>`).join("")}</div>`; };

  /* ---------------- الجوائز المرحة ---------------- */
  const AWARDS = {
    twirl:{n:"جائزة أحلى لفّة", c:"#F2A7B8"}, harmony:{n:"جائزة الألوان المتناغمة", c:"#A9DCC4"}, wings:{n:"جائزة الجناح الحالم", c:"#C9B6E8"},
    soft:{n:"جائزة أنعم قماش", c:"#F7CFC8"}, pattern:{n:"جائزة النقشة الذكية", c:"#F6E08A"}, sparkle:{n:"جائزة اللمعة الهادية", c:"#FFF0B0"},
    detail:{n:"جائزة اللمسة الصغيرة", c:"#A8D2EE"}, idea:{n:"جائزة الفكرة الحلوة", c:"#F9C49A"}, brave:{n:"جائزة الجرأة بالألوان", c:"#E86CA8"}
  };
  function awardsFor(l, w, pose){
    const out = [], c1=A.col(l.c1), c2=A.col(l.c2), d=Math.abs(A.lum(c1)-A.lum(c2));
    if(pose==="twirl") out.push("twirl"); if(w && w.on) out.push("wings");
    if(["silk","velvet","tulle","satin","moonsilk","organza"].includes(l.fabric)) out.push("soft");
    if(l.pat!=="none") out.push("pattern"); if(l.sparkle) out.push("sparkle");
    if(l.head!=="none"||l.neck!=="none"||Object.values(l.trims||{}).some(Boolean)) out.push("detail");
    if(d>.15 && d<.5) out.push("harmony"); if(d>=.5) out.push("brave");
    if(!out.length) out.push("idea");
    return shuffle(out).slice(0,2);
  }
  const awardArt = k => { const c=(AWARDS[k]||AWARDS.idea).c; return `<svg viewBox="0 0 60 70" class="faw"><path d="M20 40l-8 26 10-6 6 8 4-24zM40 40l8 26-10-6-6 8-4-24z" fill="${A.shade(c,-.15)}" stroke="${A.shade(c,-.45)}" stroke-width="1.6"/>${Array.from({length:12},(_,i)=>`<circle cx="${30+Math.cos(i/12*Math.PI*2)*18}" cy="${28+Math.sin(i/12*Math.PI*2)*18}" r="6" fill="${c}" stroke="${A.shade(c,-.35)}" stroke-width="1.2"/>`).join("")}<circle cx="30" cy="28" r="16" fill="${A.shade(c,.4)}" stroke="${A.shade(c,-.35)}" stroke-width="2"/><path d="M30 18l3 6.4 7 1-5 4.8 1.2 7L30 34l-6.2 3.2 1.2-7-5-4.8 7-1z" fill="#D9AE4E"/></svg>`; };

  /* ---------------- تشغيل العرض ---------------- */
  // الحركة: إيلاف تطلع من ورا الستارة، تمشي للكاميرا، تسوي حركة، وترجع
  function runShow(host, onEnd){
    const sh = getShow(), S = FW.S;
    const looks = sh.looks.map(resolve).filter(Boolean).map(l=>({...l, wings: sh.nowings[l.id] ? Object.assign({}, l.wings, {on:false}) : l.wings}));
    const lc = LIGHTS[sh.light][0];
    const v = h(`<div class="fst" style="--lc:${lc}">
      <div class="fst-cam">${stageBG(sh.bg)}
        <div class="fst-back"><div class="fst-cur l"></div><div class="fst-cur r"></div><span class="fst-sign">دار إيلاف · ${esc(THEMES[sh.theme])}</span></div>
        <div class="fst-runway"></div>
        <div class="fst-lights"><i></i><i></i><i></i></div>
        <div class="fst-walker"></div>
        <div class="fst-fxh"></div>
      </div>
      <div class="fst-aud">${Array.from({length:11},(_,i)=>`<span style="--d:${(-i*.37).toFixed(2)}s">${audHead(i)}</span>`).join("")}<div class="fst-hearts"></div></div>
      <div class="fst-host"><span class="fst-rab">${A.F.rabbit()}</span><p class="fst-ann" aria-live="polite"></p></div>
      <div class="fst-ctl"><button class="fw-b sm" data-skip>تخطّي</button><button class="fw-b sm" data-camb aria-label="الكاميرا">${FW.FI.camera}</button></div>
      <div class="fst-end" hidden></div>
    </div>`);
    host.appendChild(v); fillIcons(v);
    const cam=$(".fst-cam",v), walker=$(".fst-walker",v), ann=$(".fst-ann",v), endEl=$(".fst-end",v);
    const run = {dead:false, timers:new Set()};
    const calm = !motionOK();
    let p = 0, target = 0, speed = 0, posing = null, poseT = 0, autoCam = true, forced = false;
    const endMusic = () => { if(forced){ forced=false; TAudio.stop(); TAudio.setOpts({music:false, sfx:S.opts.sfx}); } else FW.music("stage"); };
    const size = () => { walker.style.fontSize = (cam.clientHeight*.56)+"px"; };
    size(); const ro = window.ResizeObserver ? new ResizeObserver(size) : null; ro && ro.observe(cam);
    const place = () => { const y = 30 + p*52, s = .4 + p*.6; walker.style.top = y+"%"; walker.style.transform = `translate(-50%,-100%) scale(${s.toFixed(3)})`; walker.style.zIndex = 5; };
    const dl = FW.doll(walker, looks[0].look, looks[0].wings, {cls:"fst-d", noLean:true,
      tick:(dt,c)=>{ if(p!==target){ const d=target-p, st=Math.sign(d)*Math.min(Math.abs(d), speed*dt); p+=st; c.x += Math.abs(st)*40; place(); } },
      post:(dt,c,d)=>{ if(!posing) return; poseT += dt; const P=c.rig.P, k=Math.min(1, poseT*3);
        if(posing==="sparkle"){ P.armL.style.transform=`rotate(${(26*k).toFixed(1)}deg)`; P.armR.style.transform=`rotate(${(-26*k).toFixed(1)}deg)`; }
        if(posing==="heart"){ P.armL.style.transform=`rotate(${(-12*k).toFixed(1)}deg)`; P.armR.style.transform=`rotate(${(12*k).toFixed(1)}deg)`; } }});
    place();
    const say = t => { ann.textContent = t; ann.classList.remove("pop"); void ann.offsetWidth; ann.classList.add("pop"); };
    const camTo = k => { if(!autoCam && k!=="wide") return; cam.classList.toggle("close", k==="close"); };
    const hearts = () => { if(calm) return; const hh=$(".fst-hearts",v); for(let i=0;i<7;i++){ const e=h(`<i style="left:${8+Math.random()*84}%;--d:${(i*.12).toFixed(2)}s">${i%2?FGames.CL.heart:FGames.CL.star}</i>`); hh.appendChild(e); setTimeout(()=>e.remove(), 2400); } };
    const walk = async (to, ms) => { if(calm){ p=target=to; place(); return; } target=to; speed=Math.abs(to-p)/(ms/1000); await wait(ms+60, run); };
    async function doPose(k){
      const f = $(".fd-flip", dl.el); posing = k; poseT = 0;
      if(k==="wave") TRig.wave(dl.c, 1.8);
      if(k==="twirl"||k==="curtsy"||k==="hop"){ f.classList.remove(k); void f.offsetWidth; if(!calm) f.classList.add(k); if(k!=="curtsy") dl.c.rig.flare=1; else TRig.crouch(dl.c,.5); }
      if(k==="heart") dl.emo("happy", 2000);
      await wait(calm?900:2000, run);
      f.classList.remove("twirl","curtsy","hop"); posing=null;
    }
    async function sequence(){
      if(sh.music==="none") TAudio.stop();
      else { forced = !S.opts.music; TAudio.setOpts({music:true, sfx:S.opts.sfx, vol:.55}); TAudio.unlock(); TAudio.play("fashion", "show-"+sh.music, "explore", FW.FTH[MUSIC_TH[sh.music]]); }
      v.classList.add("on");
      say(`أهلاً بعرض ${THEMES[sh.theme]}! الأضواء… الموسيقى…`); FW.sfx("bell");
      await wait(calm?600:1500, run);
      for(let i=0;i<looks.length;i++){
        const l = looks[i], seg = SEGS[sh.seg[l.id] || (i===0?"open":i===looks.length-1&&i>0?"finale":"colors")];
        if(i>0){ dl.set(l.look, l.wings); }
        p = target = 0; place(); walker.style.opacity = 1;
        v.classList.add("curtain"); FW.sfx("page"); say(`${seg}: «${l.name}»`);
        await wait(calm?300:800, run); v.classList.remove("curtain");
        camTo("wide"); v.classList.add("walk");
        await walk(1, 3600);
        v.classList.remove("walk"); v.classList.add("focus"); camTo("close"); FW.sfx("sparkle");
        $(".fst-fxh",v).innerHTML = fxEl(sh.fx);
        v.classList.add("react"); hearts(); FW.sfx("ok");
        await doPose(sh.pose);
        v.classList.remove("react","focus"); camTo("wide");
        if(i<looks.length-1){ await walk(0, 2600); walker.style.opacity = 0; await wait(200, run); }
      }
      say("الختام! تصفيق للمصممة إيلاف"); v.classList.add("finale","react"); hearts(); FW.sfx("ok"); if(!calm) confetti();
      await doPose("curtsy");
      await wait(calm?400:1200, run);
      finish();
    }
    function finish(){
      run.dead = true; run.timers.forEach(t=>clearTimeout(t)); run.timers.clear();
      p = target = 1; place(); walker.style.opacity = 1; v.classList.add("ended"); cam.classList.remove("close");
      endMusic();
      // مكافآت: عدّاد العروض + حركة جديدة
      S.shows = (S.shows||0)+1;
      looks.forEach(l=>{ const d = l.saved && FW.designById(l.saved); if(d){ d.shows=(d.shows||0)+1; } });
      const nextPose = FW.POSE_ORDER.find(k=>!FW.owned("pose",k));
      const aw = []; looks.forEach(l=>awardsFor(l.look, l.wings, sh.pose).forEach(k=>{ if(!aw.some(a=>a.k===k)) aw.push({k, look:l.name}); }));
      aw.slice(0,3).forEach(a=>{ S.awards[a.k] = {n:AWARDS[a.k].n, look:a.look, at:Date.now()}; });
      FW.save();
      const main = looks[looks.length-1];
      endEl.innerHTML = `<div class="fst-card"><h3>انتهى العرض!</h3>
        <div class="fst-looks">${looks.map(l=>`<div><span class="fst-th">${A.dollHTML(l.look, l.wings, {anim:false})}</span><b>${esc(l.name)}</b></div>`).join("")}</div>
        <div class="fst-aw">${aw.slice(0,3).map(a=>`<div>${awardArt(a.k)}<small>${AWARDS[a.k].n}</small></div>`).join("")}</div>
        <p class="fc-note">جوائز للفرح — ماكو فوز ولا خسارة.</p>
        <div class="fst-btns"><button class="btn honey small" data-photo>${FW.FI.camera} احفظي صورة</button><button class="btn ghost small" data-edit>${IC.pen} عدّلي الإطلالة</button><button class="btn ghost small" data-newd>${IC.plus} صممي إطلالة جديدة</button><button class="btn ghost small" data-replay>${IC.restart||IC.undo} عيدي العرض</button>${!main.saved?`<button class="btn ghost small" data-keep>${IC.save} احفظيها بالمتحف</button>`:""}</div></div>`;
      fillIcons(endEl); endEl.hidden = false;
      if(nextPose) setTimeout(()=>FW.grant("pose", nextPose, "عرض كامل"), 700);
      $("[data-photo]",endEl).onclick = async e => { const b=e.currentTarget; b.disabled = true; await savePhoto(main.look, main.wings, {bg:sh.bg, pose:sh.pose, light:lc, caption:main.name}, main.name); b.disabled = false; };
      $("[data-edit]",endEl).onclick = () => { if(main.saved){ const d=FW.designById(main.saved); if(d) FW.setCur(d.look, d.wings, d.name, d.id); } go("fashion:atelier"); };
      $("[data-newd]",endEl).onclick = () => { FW.setCur(A.BLANK(), A.BLANK_WINGS(), "", null); go("fashion:atelier"); };
      $("[data-replay]",endEl).onclick = () => { onEnd && onEnd("replay"); };
      const kp=$("[data-keep]",endEl); if(kp) kp.onclick = () => { const d=FW.saveDesign(main.look, main.wings, main.name==="التصميم الحالي"?"":main.name, null); toast("انحفظت بالمتحف: "+d.name,"check"); kp.remove(); };
    }
    $("[data-skip]",v).onclick = () => { if(!run.dead) finish(); };
    $("[data-camb]",v).onclick = e => { autoCam = !autoCam; e.currentTarget.setAttribute("aria-pressed", !autoCam); if(!autoCam) cam.classList.remove("close"); toast(autoCam?"الكاميرا تتحرك وحدها":"الكاميرا ثابتة (منظر واسع)","eye"); };
    sequence().catch(()=>{});
    return () => { run.dead = true; run.timers.forEach(t=>clearTimeout(t)); dl.stop(); ro && ro.disconnect(); if(forced){ forced=false; TAudio.stop(); TAudio.setOpts({music:false, sfx:S.opts.sfx}); } };
  }
  async function savePhoto(look, wings, o, name){
    try{
      const blob = await FW.snapshot(look, wings, o);
      if(!blob) throw 0;
      const rec = {id:"p"+Date.now().toString(36), at:Date.now(), name:name||"لقطة", blob};
      try{ await FW.DB.put("photos", rec); }catch(e){}
      FW.sfx("sparkle"); toast("انحفظت الصورة بمتحف الإطلالات", "check");
      const u = URL.createObjectURL(blob);
      const md = modal(`<div class="fw-modal"><img class="fmu-big" src="${u}" alt="${esc(name||"")}"><div class="row"><button class="btn honey" data-dl>${IC.save} نزّليها على الجهاز</button></div></div>`, {wide:true, onClose:()=>URL.revokeObjectURL(u)});
      $("[data-dl]",md.el).onclick = () => offerDownload((name||"dar-elaf")+".png", blob, ()=>toast("ما گدرت أنزّل الصورة","close"));
    }catch(e){ toast("ما گدرت أصوّر على هذا المتصفح", "close"); }
  }

  /* ---------------- الكواليس ---------------- */
  const SPOTS = [
    {id:"rack", n:"راف الملابس", x:12, y:58, bg:"night", line:"بين الفساتين لگيتي لوحة خلفية بلون الليل!"},
    {id:"mirror", n:"مراية المكياج", x:34, y:46, bg:"clouds", line:"المراية تعكس غيوم… صارت خلفية جديدة!"},
    {id:"trunk", n:"الصندوق القديم", x:58, y:70, bg:"crystal", line:"بالصندوق أكو قطع بلّور تلمع — خلفية قاعة البلّور!"},
    {id:"board", n:"لوحة الإضاءة", x:80, y:42, bg:"lanterns", line:"شغلتي الفوانيس! خلفية ساحة الفوانيس صارت إلج."},
    {id:"rope", n:"حبل الستارة", x:92, y:64, bg:"sea", line:"سحبتي الحبل وبان رسم شاطئ الصدف!"}
  ];
  FW.region("backstage", (body, {first}) => {
    const S = FW.S;
    body.innerHTML = `<div class="fb"><div class="fb-room">
        <div class="fb-wall"></div><div class="fb-floor"></div>
        ${SPOTS.map(s=>`<button class="fb-spot fb-${s.id} ${S.explore[s.id]?"seen":""}" data-s="${s.id}" style="left:${s.x}%;top:${s.y}%" aria-label="${s.n}"><span>${spotArt(s.id)}</span><small>${s.n}</small></button>`).join("")}
        <div class="fb-friends"></div></div>
      <p class="fc-note">استكشفي الكواليس (${Object.keys(S.explore).length}/${SPOTS.length}) — كل مكان يخبّي خلفية مسرح.</p>
      <section class="fb-plan"><h3>تجهيز العرض</h3></section></div>`;
    const room = $(".fb-room",body);
    const rab = FW.friendEl("rabbit","fb-rab"); $(".fb-friends",body).appendChild(rab);
    const bird = FW.friendEl("bird","fb-bird", ()=>"وزعت الدعوات! كل الغابة جاية تشوف عرضج."); $(".fb-friends",body).appendChild(bird);
    const clue = FW.clueEl("backstage","fb-clue"); if(clue) room.appendChild(clue);
    $$("[data-s]",body).forEach(b=>b.onclick=()=>{ const s=SPOTS.find(x=>x.id===b.dataset.s); b.classList.remove("peek"); void b.offsetWidth; b.classList.add("peek"); FW.sfx("soft");
      if(!S.explore[s.id]){ S.explore[s.id]=Date.now(); FW.save(); b.classList.add("seen"); FW.say(rab, s.line); setTimeout(()=>FW.grant("bg", s.bg, "استكشاف الكواليس"), 600); $(".fb .fc-note",body).textContent=`استكشفي الكواليس (${Object.keys(S.explore).length}/${SPOTS.length}) — كل مكان يخبّي خلفية مسرح.`; }
      else FW.say(rab, s.n+": رتبناه زين. "+FW.friendLine("rabbit")); });
    planner($(".fb-plan",body), () => go("fashion:stage"));
    if(first) setTimeout(()=>FW.say(rab, "أهلاً بالكواليس! رتبي العرض تحت، واستكشفي الغرفة."), 500);
    const shelf = FW.gameShelf(body, ["prep","segments","rescue"], "ألعاب الكواليس", {onOpen:o=>{ $(".fb",body).hidden=o; }});
    return () => shelf.destroy();
  });
  function spotArt(id){
    const S2 = (i) => `<svg viewBox="0 0 80 80">${i}</svg>`;
    if(id==="rack") return S2(`<path d="M8 12h64M14 12v62M66 12v62" stroke="#8C7D66" stroke-width="4"/>${["#F2A7B8","#A8D2EE","#F6E08A","#C9B6E8"].map((c,i)=>`<path d="M${20+i*12} 14l-6 10 2 30h10l2-30-6-10z" fill="${c}" stroke="${A.shade(c,-.35)}" stroke-width="1.6"/>`).join("")}`);
    if(id==="mirror") return S2(`<rect x="12" y="8" width="56" height="50" rx="8" fill="#DCEEF6" stroke="#9C6E82" stroke-width="4"/>${[0,1,2,3,4].map(i=>`<circle cx="${16+i*12}" cy="8" r="3.4" fill="#FFF0B0"/>`).join("")}<rect x="8" y="58" width="64" height="10" rx="3" fill="#C98E6E"/><path d="M24 22l10 20" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`);
    if(id==="trunk") return S2(`<rect x="8" y="30" width="64" height="40" rx="6" fill="#B98E6E" stroke="#6B4A33" stroke-width="3"/><path d="M8 30q32-22 64 0" fill="#C9A07E" stroke="#6B4A33" stroke-width="3"/><rect x="34" y="40" width="12" height="12" rx="2" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2"/>`);
    if(id==="board") return S2(`<rect x="10" y="10" width="60" height="56" rx="6" fill="#3E3A44" stroke="#1E1A24" stroke-width="3"/>${[0,1,2].map(r=>[0,1,2,3].map(c=>`<circle cx="${22+c*12}" cy="${24+r*14}" r="4" fill="${["#FFB3CF","#A8D8FF","#FFE38A","#B8F0D8"][c]}"/>`).join("")).join("")}`);
    if(id==="rope") return S2(`<path d="M40 4v52" stroke="#C9A04E" stroke-width="5"/><circle cx="40" cy="62" r="9" fill="#C8425A" stroke="#7A2236" stroke-width="3"/><path d="M34 70l6 8 6-8" fill="#C8425A"/>`);
    return "";
  }

  /* ---------------- مسرح العرض الكبير ---------------- */
  FW.region("stage", (body) => {
    let clean = null;
    const pre = () => { clean && clean(); clean=null; body.innerHTML = `<div class="fs-pre"><div class="fs-preview">${stageBG(getShow().bg)}<div class="fs-prev-d"></div><p>جهّزي اختياراتج، وبعدين ابدئي العرض.</p></div><div class="fs-plan"></div></div>`;
      const looks = getShow().looks.map(resolve).filter(Boolean);
      $(".fs-prev-d",body).innerHTML = looks.map(l=>`<span>${A.dollHTML(l.look, l.wings, {anim:false})}</span>`).join("");
      planner($(".fs-plan",body), start);
      const shelf = FW.gameShelf(body, ["reaction"], "لعبة المسرح", {onOpen:o=>{ $(".fs-pre",body).hidden=o; }});
      clean = () => shelf.destroy(); };
    const start = () => { clean && clean(); body.innerHTML = ""; clean = runShow(body, () => start()); body.scrollTop = 0; };
    pre();
    return () => { clean && clean(); };
  });

  /* ---------------- استوديو الصور ---------------- */
  FW.region("photo", (body, {first}) => {
    const S = FW.S;
    let pick = "__cur", bg = FW.owned("bg","garden") ? "garden" : "curtain", pose = "wave", light = "warm";
    const looks = () => [{id:"__cur", name:S.cur.name||"التصميم الحالي", look:S.cur.look, wings:S.cur.wings}].concat(S.designs);
    body.innerHTML = `<div class="fph"><div class="fph-set"><div class="fph-bg"></div><div class="fph-lamp l"></div><div class="fph-lamp r"></div><div class="fph-d"></div><div class="fph-glow"></div></div>
      <div class="fph-ctl"><h4>الإطلالة</h4><div class="ft-list fph-looks"></div><div class="fph-opts"></div>
        <label class="fw-field"><span>عنوان الصورة</span><input data-cap maxlength="30" placeholder="اسم الإطلالة"></label>
        <button class="btn honey" data-shot>${FW.FI.camera} التقطي الصورة</button></div></div>`;
    const set = $(".fph-set",body);
    const clue = FW.clueEl("photo","fph-clue"); if(clue) set.appendChild(clue);
    let cur = looks()[0];
    const dl = FW.doll($(".fph-d",body), cur.look, cur.wings, {cls:"fph-dd", post:(dt,c)=>{ const a=FW.POSE_ANG[pose]; if(!a) return; c.rig.P.armL.style.transform=`rotate(${a.aL}deg)`; c.rig.P.armR.style.transform=`rotate(${a.aR}deg)`; }});
    const drawBG = () => { $(".fph-bg",body).innerHTML = stageBG(bg); set.style.setProperty("--lc", LIGHTS[light][0]); };
    const drawList = () => { $(".fph-looks",body).innerHTML = looks().map(d=>`<button data-id="${d.id}" aria-pressed="${d.id===pick}">${esc(d.name)}</button>`).join(""); };
    const drawOpts = () => { $(".fph-opts",body).innerHTML = `<h4>الخلفية</h4>${D.swatches("bg","bg",Object.keys(FW.STAGE_BG),bg)}<h4>الوقفة</h4>${D.chips("pose", Object.fromEntries(Object.entries(FW.POSES).map(([k,p])=>[k,p.n])), pose, "pose")}<h4>الإضاءة</h4><div class="fc-pal" data-k="light">${Object.entries(LIGHTS).map(([k,[c,n]])=>`<button data-v="${k}" aria-pressed="${light===k}" aria-label="${n}" style="--c:${c}"></button>`).join("")}</div>`; };
    const st = {get bg(){return bg;}, set bg(v){bg=v;}, get pose(){return pose;}, set pose(v){pose=v;}, get light(){return light;}, set light(v){light=v;}};
    D.bindPanel($(".fph-opts",body), ()=>st, (k)=>{ drawBG(); drawOpts(); if(k==="pose" && (pose==="twirl"||pose==="hop")){ const f=$(".fd-flip",dl.el); f.classList.remove(pose); void f.offsetWidth; if(motionOK()) f.classList.add(pose); } });
    $(".fph-looks",body).onclick = e => { const b=e.target.closest("[data-id]"); if(!b) return; pick=b.dataset.id; cur=looks().find(d=>d.id===pick); dl.set(cur.look, cur.wings); drawList(); $("[data-cap]",body).value = cur.name==="التصميم الحالي"?"":cur.name; FW.sfx("soft"); };
    $("[data-cap]",body).value = cur.name==="التصميم الحالي"?"":cur.name;
    $("[data-shot]",body).onclick = async e => { const b=e.currentTarget; b.disabled=true; set.classList.remove("flash"); void set.offsetWidth; set.classList.add("flash"); dl.emo("happy");
      await savePhoto(cur.look, cur.wings, {bg, pose, light:LIGHTS[light][0], caption:$("[data-cap]",body).value.trim()}, $("[data-cap]",body).value.trim()||cur.name); b.disabled=false; };
    drawBG(); drawList(); drawOpts();
    const cb = FW.friendEl("cbfly","fph-cb", ()=>"جربي إضاءة وردية ويا الخلفية الليلية!"); set.appendChild(cb);
    if(first) setTimeout(()=>FW.say(cb, "اختاري خلفية ووقفة وضوء، وبعدين التقطي!"), 500);
    const shelf = FW.gameShelf(body, ["diff"], "لعبة الاستوديو", {onOpen:o=>{ $(".fph",body).hidden=o; }});
    return () => { dl.stop(); shelf.destroy(); };
  });

  /* ---------------- المواسم ---------------- */
  const lum = k => A.lum(A.col(k));
  const SEASONS = {
    spring:{n:"موسم ألوان الربيع", c1:"#F7CFDA", c2:"#CFE8C4", fx:"petals", game:"patmatch", rw:["f","blossom"], d:"بتلات تطير بالساحة، والتحدي ألوان فاتحة وورد.",
      challenge:[["لون أساسي فاتح وناعم", l=>lum(l.c1)>.72], ["نقشة ورود أو أقحوان", l=>["roses","daisies"].includes(l.pat)], ["تاج ورد", l=>l.head==="flowers"], ["طول متوسط", l=>l.len==="midi"]]},
    glow:{n:"ليلة الأجنحة المضيئة", c1:"#2E2F5E", c2:"#5E5A9E", fx:"stars", game:"wingsecret", rw:["w","glow"], d:"الساحة تطفي أضويتها، والأجنحة تضوي.",
      challenge:[["جناح", (l,w)=>w.on], ["لون غامق", l=>lum(l.c1)<.45], ["نقشة نجوم أو كوكبات", l=>["stars","constellation"].includes(l.pat)], ["تنورة طويلة", l=>l.len==="long"]]},
    odd:{n:"مهرجان الأقمشة الغريبة", c1:"#FFE6F0", c2:"#E6F6FF", fx:"bubbles", game:"hunt", rw:["f","rainbow"], d:"أقمشة بألوان ونقشات ما تتوقعينها!",
      challenge:[["نقشة مربعات أو متعرّج أو قلوب", l=>["checks","chevron","hearts"].includes(l.pat)], ["لون جريء", l=>["fuchsia","coral","turquoise","lemon","cherry","lime"].includes(l.c1)], ["فيونكة للراس", l=>l.head==="bow"], ["قصة منفوخة", l=>l.cut==="bubble"]]},
    clouds:{n:"عرض الغيوم", c1:"#EAF4FF", c2:"#FFFFFF", fx:"bubbles", game:"reaction", rw:["f","cloud"], d:"المسرح طاير فوق الغيوم.",
      challenge:[["لون أساسي فاتح", l=>lum(l.c1)>.78], ["نقشة غيوم", l=>l.pat==="clouds"], ["جناح", (l,w)=>w.on], ["قصة واسعة", l=>l.cut==="wide"]]},
    butterflies:{n:"عرض الفراشات", c1:"#FFF2E0", c2:"#F2E6FF", fx:"petals", game:"memory", rw:["w","monarch"], d:"فراشات ملونة تحضر العرض.",
      challenge:[["نقشة فراشات", l=>l.pat==="butterflies"], ["جناح", (l,w)=>w.on], ["مشبك فراشة", l=>l.head==="butterfly"], ["لونين مختلفين كلش", l=>Math.abs(lum(l.c1)-lum(l.c2))>.3]]},
    stars:{n:"سهرة النجوم", c1:"#23264E", c2:"#4E4A8E", fx:"stars", game:"dye", rw:["f","nightsky"], d:"سهرة هادية تحت سما مليانة نجوم.",
      challenge:[["لون ليلي أو كحلي أو بنفسجي", l=>["night","navy","plum"].includes(l.c1)], ["تاج صغير", l=>l.head==="tiara"], ["لمعة خفيفة", l=>l.sparkle], ["نقشة نجوم", l=>l.pat==="stars"]]},
    nature:{n:"أسبوع الطبيعة", c1:"#E8F3DA", c2:"#F6EBD2", fx:"leaves", game:"three", rw:["f","leafweave"], d:"ألوان الغابة والأوراق والخشب.",
      challenge:[["لون أخضر أو بني", l=>["sage","mint","mocha","cocoa","lime","seafoam"].includes(l.c1)], ["نقشة أوراق", l=>l.pat==="leaves"], ["حزام وردة", l=>l.belt==="flower"], ["قماش قطن أو كتان", l=>["cotton","linen"].includes(l.fabric)]]},
    drawings:{n:"معرض أجمل الرسومات", c1:"#FFF8EE", c2:"#F2E6D8", fx:"none", game:"three", rw:["p","scribble"], d:"رسوماتج من مرسم «عالمنا» تتعلق بالساحة، وتستلهمين منها تصميم.", gallery:true,
      challenge:[["نقشة شخابيط أو نقاط", l=>["scribble","dots"].includes(l.pat)], ["لون مستوحى من رسمة (أي لون غير الأبيض)", l=>l.c1!=="white"], ["تطريز", l=>!!(l.trims&&l.trims.embroidery)], ["ياقة مدوّرة", l=>l.collar==="peter"]]},
    onecolor:{n:"تحدي اللون الواحد", c1:"#F4ECF8", c2:"#E6D8F2", fx:"none", game:"dye", rw:["f","ombre"], d:"كل الإطلالة بلون واحد… بس بلمسات مختلفة.",
      challenge:[["اللون الأساسي والثانوي نفس اللون", l=>l.c1===l.c2], ["بدون نقشة", l=>l.pat==="none"], ["حافة مميزة (مو عادية)", l=>l.hem!=="straight"], ["زينة واحدة على الأقل", l=>Object.values(l.trims||{}).some(Boolean)]]},
    twofab:{n:"تحدي القماشين", c1:"#FFF0E6", c2:"#E6F0FF", fx:"petals", game:"patmatch", rw:["w","patchwork"], d:"قطعتين بقماشين ولونين يتناغمون.",
      challenge:[["قطعتين: طقم أو معطف أو عباءة", l=>["set","coat","cape"].includes(l.type)], ["لونين مختلفين", l=>l.c1!==l.c2], ["نقشة", l=>l.pat!=="none"], ["حزام", l=>l.belt!=="none"]]}
  };
  // الموسم المقترح حسب الشهر — بس اقتراح، كلها مفتوحة
  const featured = () => Object.keys(SEASONS)[new Date().getMonth() % 10];
  function decorEl(){ const id = FW.S.seasons.active; if(!id || !SEASONS[id]) return null; const se=SEASONS[id];
    return h(`<div class="fse-decor se-${id}" aria-hidden="true" style="--sa:${se.c1};--sb:${se.c2}">${fxEl(se.fx==="none"?"petals":se.fx)}</div>`); }

  FW.region("festival", (body, {first}) => {
    const S = FW.S; let open = null, shelf = null;
    const list = () => {
      shelf && shelf.destroy(); shelf=null;
      const f = featured();
      body.innerHTML = `<div class="fse"><div class="fse-plaza" aria-hidden="true"><div class="fse-bunting">${Array.from({length:14},(_,i)=>`<i style="--c:${["#F2A7B8","#A8D2EE","#F6E08A","#A9DCC4","#C9B6E8"][i%5]}"></i>`).join("")}</div><div class="fse-carousel"></div></div>
        ${S.seasons.active?`<p class="fse-now">الموسم الشغّال: <b>${esc(SEASONS[S.seasons.active].n)}</b> <button class="btn ghost small" data-off>إيقاف الموسم</button></p>`:`<p class="fse-now">اختاري موسم تحبينه — ماكو موسم إجباري.</p>`}
        <div class="fse-grid">${Object.entries(SEASONS).map(([k,se])=>`<button class="fse-card ${S.seasons.done[k]?"done":""} ${S.seasons.active===k?"on":""}" data-se="${k}" style="--sa:${se.c1};--sb:${se.c2}"><b>${esc(se.n)}</b><small>${esc(se.d)}</small><span class="fse-rw">${FW.swatch(se.rw[0], se.rw[1], 34)}${S.seasons.done[k]?"✓":""}</span>${k===f?`<i class="fse-feat">مقترح هالشهر</i>`:""}</button>`).join("")}</div></div>`;
      fillIcons(body);
      const dec = decorEl(); if(dec) $(".fse-plaza",body).appendChild(dec);
      $$("[data-se]",body).forEach(b=>b.onclick=()=>{ FW.sfx("page"); page(b.dataset.se); });
      const off=$("[data-off]",body); if(off) off.onclick=()=>{ S.seasons.active=null; FW.save(); list(); };
    };
    const page = (k) => {
      const se = SEASONS[k]; open = k;
      body.innerHTML = `<div class="fse-page" style="--sa:${se.c1};--sb:${se.c2}"><button class="btn ghost small" data-back>${IC.back} كل المواسم</button>
        <div class="fse-head"><h2>${esc(se.n)}</h2><p>${esc(se.d)}</p><div class="fse-meta"><span>المكافأة: ${FW.swatch(se.rw[0],se.rw[1],40)} ${esc(FW.kindLabel(se.rw[0],se.rw[1]))}${S.seasons.done[k]?" ✓":""}</span></div>
          <button class="btn ${S.seasons.active===k?"ghost":"honey"} small" data-act>${S.seasons.active===k?"الموسم شغّال ✓":"فعّلي الموسم"}</button></div>
        <ul class="fse-req"><li><b>تحدي الموسم:</b></li>${se.challenge.map(r=>`<li>${r[0]}</li>`).join("")}</ul>
        <p class="fc-note">لما الموسم شغّال: زينة بالساحة والخريطة، والتصاميم اللي تحفظينها تنضاف لصفحة الموسم بالمتحف.</p>
        ${se.gallery?`<section class="fse-gal"><h3>رسوماتج</h3><div class="fse-frames">جاري التحميل…</div></section>`:""}
        <div class="fse-games"></div></div>`;
      fillIcons(body);
      const dec = decorEl(); if(dec) $(".fse-page",body).prepend(dec);
      $("[data-back]",body).onclick = list;
      $("[data-act]",body).onclick = () => { S.seasons.active = k; FW.save(); FW.sfx("bell"); toast("انفعّل: "+se.n, "star"); page(k); };
      shelf = FW.gameShelf($(".fse-games",body), ["theme", se.game], "لعبة الموسم وتحديه", {season:k, onWin:(id)=>{ if(id==="theme"){ if(!S.seasons.done[k]){ S.seasons.done[k]=Date.now(); FW.save(); } setTimeout(()=>FW.grant(se.rw[0], se.rw[1], se.n), 900); } }});
      if(se.gallery) gallery($(".fse-frames",body));
    };
    async function gallery(box){
      let ds = [];
      try{ if(typeof World!=="undefined" && World.DB) ds = await World.DB.all("drawings"); }catch(e){}
      if(!box.isConnected) return;
      if(!ds.length){ box.innerHTML = `<p class="fc-note">ماكو رسومات بعد. ارسمي بمرسم «عالمنا» واحفظي بالمعرض، وترجع تتعلق هنا.</p>`; return; }
      box.innerHTML = ds.slice(0,8).map(d=>`<figure class="fse-fr"><img src="${d.thumb}" alt="${esc(d.title)}"><figcaption>${esc(d.title)}</figcaption><button class="btn ghost small" data-insp="${d.id}">استلهمي اللون</button></figure>`).join("");
      $$("[data-insp]",box).forEach(b=>b.onclick=async()=>{ const d=ds.find(x=>x.id===b.dataset.insp); const c = await avgColor(d.thumb); const L=Object.assign({}, FW.curLook(), {c1:c}); FW.setCur(L, FW.curWings()); toast("لون التصميم الحالي صار: "+A.COLORS[c][1], "check"); });
    }
    list();
    if(first) setTimeout(()=>toast("كل موسم بيه زينة وتحدي ومكافأة — اختاري اللي يعجبج", "star"), 500);
    return () => { shelf && shelf.destroy(); };
  });
  // أقرب لون مفتوح لمعدّل ألوان الرسمة
  function avgColor(src){
    return new Promise(res => { const im=new Image(); im.onload=()=>{ try{ const c=document.createElement("canvas"); c.width=c.height=12; const g=c.getContext("2d"); g.drawImage(im,0,0,12,12); const px=g.getImageData(0,0,12,12).data; let r=0,gg=0,b=0,n=0; for(let i=0;i<px.length;i+=4){ const l=(px[i]+px[i+1]+px[i+2])/3; if(l>235) continue; r+=px[i]; gg+=px[i+1]; b+=px[i+2]; n++; } if(!n){ res("cream"); return; } r/=n; gg/=n; b/=n;
      let best="rose", bd=1e9; Object.keys(A.COLORS).filter(k=>FW.owned("c",k)).forEach(k=>{ const hx=A.COLORS[k][0]; const R=parseInt(hx.slice(1,3),16), G_=parseInt(hx.slice(3,5),16), B=parseInt(hx.slice(5,7),16); const d=(R-r)**2+(G_-gg)**2+(B-b)**2; if(d<bd){ bd=d; best=k; } }); res(best); }catch(e){ res("rose"); } }; im.onerror=()=>res("rose"); im.src=src; });
  }

  return { SEASONS, AWARDS, awardArt, planner, runShow, stageBG, decorEl, LIGHTS, savePhoto };
})();
