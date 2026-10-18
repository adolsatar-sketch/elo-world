/* =====================================================================
   حكاياتنا — الألغاز
   كل لغز: TPZ.<نوع>(body, o, api)
     body: عنصر DOM لرسم اللغز داخله
     o:    إعدادات اللغز من بيانات الفصل
     api:  { solve(value), say(text), sfx(name), note(n), onHint(fn), onSkip(fn), ctx }
   ما بيها عقوبة؛ الغلط يرجّع اللغز بلطف، والتلميح والتخطي موجودين دائماً.
   ===================================================================== */
const TPZ = (() => {
  const H = html => { const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; };
  const sh = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const wait = ms => new Promise(r=>setTimeout(r, ms));
  const pulse = (el, cls="pz-flash", ms=520) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), ms); };
  const P = {};

  /* 1) ترتيب الرموز بالنغمات */
  P.symbols = (body, o, api) => {
    const syms = o.syms, order = o.order; let pos=0, busy=false;
    const view = sh(syms.map((k,i)=>i));
    body.appendChild(H(`<div class="pz-symbols">
      <div class="pz-slots">${order.map(()=>'<span class="pz-slot"></span>').join("")}</div>
      <div class="pz-tiles">${view.map(i=>`<button class="pz-tile" data-i="${i}" aria-label="${o.labels?o.labels[i]:syms[i]}">${TART.symbol(syms[i])}</button>`).join("")}</div>
      <button class="pz-mini" data-replay>اسمعي الترتيب مرة ثانية</button></div>`));
    const tiles = [...body.querySelectorAll(".pz-tile")], slots=[...body.querySelectorAll(".pz-slot")];
    const tileOf = i => tiles.find(t=>+t.dataset.i===i);
    async function play(){ busy=true; await wait(400); for(const i of order){ pulse(tileOf(i)); api.note(i*2, .55); await wait(720); } busy=false; }
    function reset(){ pos=0; slots.forEach(s=>{ s.innerHTML=""; s.classList.remove("on"); }); }
    tiles.forEach(t => t.onclick = async () => {
      if(busy) return; const i=+t.dataset.i; api.note(i*2,.4); pulse(t);
      if(i===order[pos]){ slots[pos].innerHTML = TART.symbol(syms[i]); slots[pos].classList.add("on"); pos++; if(pos===order.length){ busy=true; await wait(350); api.solve(); } }
      else { api.sfx("nope"); body.querySelector(".pz-slots").classList.add("pz-shake"); setTimeout(()=>body.querySelector(".pz-slots").classList.remove("pz-shake"),500); api.say(o.retry || "قريبة! خلّينا نسمع الترتيب مرة ثانية."); reset(); setTimeout(play, 700); }
    });
    body.querySelector("[data-replay]").onclick = () => { if(!busy){ reset(); play(); } };
    api.onHint(() => { const t=tileOf(order[pos]); t.classList.add("pz-glow"); setTimeout(()=>t.classList.remove("pz-glow"), 2200); api.say(o.hint || "الرمز اللي يلمع هو اللي بعده."); });
    api.onSkip(() => { order.forEach((i,k)=>{ slots[k].innerHTML=TART.symbol(syms[i]); slots[k].classList.add("on"); }); });
    play();
  };

  /* 2) مراوح ألوان الريح */
  P.fans = (body, o, api) => {
    const cols=o.colors, target=o.target; let st = target.map((t,i)=>(t+1+i%2)%cols.length);
    body.appendChild(H(`<div class="pz-fans">${target.map((t,i)=>`<div class="pz-fan-col"><span class="pz-lant" style="--c:${cols[t]}">${TART.lantern(cols[t])}</span><button class="pz-fan" data-i="${i}" aria-label="مروحة ${i+1}">${TART.fan(cols[st[i]])}</button></div>`).join("")}</div>`));
    const draw = i => { const b=body.querySelector(`.pz-fan[data-i="${i}"]`); b.innerHTML = TART.fan(cols[st[i]]); b.classList.toggle("ok", st[i]===target[i]); };
    target.forEach((_,i)=>draw(i));
    body.querySelectorAll(".pz-fan").forEach(b => b.onclick = () => {
      const i=+b.dataset.i; st[i]=(st[i]+1)%cols.length; draw(i); pulse(b,"pz-spin",700); api.sfx("wind"); api.note(st[i]+i,.3);
      if(st.every((v,k)=>v===target[k])) setTimeout(()=>api.solve(), 600);
    });
    api.onHint(() => { const i=st.findIndex((v,k)=>v!==target[k]); if(i<0) return; const b=body.querySelector(`.pz-fan[data-i="${i}"]`); b.classList.add("pz-glow"); setTimeout(()=>b.classList.remove("pz-glow"),2200); api.say(o.hint || "كل مروحة لازم تصير بلون الفانوس اللي فوقها."); });
    api.onSkip(() => { st = target.slice(); target.forEach((_,i)=>draw(i)); });
  };

  /* 3) ربط أصوات بأهداف (أصداء، إيقاعات) */
  function assign(body, o, api, {srcHTML, tgtHTML, playSrc, title}){
    const n=o.answer.length; let sel=null; const put = Array(n).fill(null);
    const srcOrder = sh([...Array(n).keys()]);
    body.appendChild(H(`<div class="pz-assign"><p class="pz-sub">${title}</p>
      <div class="pz-srcs">${srcOrder.map(i=>`<button class="pz-src" data-s="${i}">${srcHTML(i)}<small>${o.srcLabels?o.srcLabels[i]:"صوت "+(i+1)}</small></button>`).join("")}</div>
      <div class="pz-tgts">${[...Array(n).keys()].map(j=>`<button class="pz-tgt" data-t="${j}">${tgtHTML(j)}<span class="pz-put"></span></button>`).join("")}</div></div>`));
    const srcs=[...body.querySelectorAll(".pz-src")], tgts=[...body.querySelectorAll(".pz-tgt")];
    srcs.forEach(b => b.onclick = () => { const i=+b.dataset.s; sel=i; srcs.forEach(x=>x.classList.toggle("sel", x===b)); playSrc(i, b); });
    tgts.forEach(b => b.onclick = () => {
      const j=+b.dataset.t; if(sel==null){ api.say("اختاري صوت أول، بعدين حطيه بمكانه."); return; }
      const prev = put.indexOf(sel); if(prev>=0){ put[prev]=null; tgts[prev].querySelector(".pz-put").innerHTML=""; }
      put[j]=sel; b.querySelector(".pz-put").innerHTML = `<i style="background:${o.colors[sel]}"></i>`; api.sfx("soft"); sel=null; srcs.forEach(x=>x.classList.remove("sel"));
      if(put.every(v=>v!=null)){
        const wrong = put.map((v,k)=>v!==o.answer[k]?k:-1).filter(k=>k>=0);
        if(!wrong.length){ setTimeout(()=>api.solve(), 500); return; }
        api.sfx("nope"); api.say(o.retry || "بعضها مو بمكانه. اسمعيها مرة ثانية.");
        wrong.forEach(k=>{ pulse(tgts[k],"pz-shake",500); setTimeout(()=>{ put[k]=null; tgts[k].querySelector(".pz-put").innerHTML=""; },520); });
      }
    });
    api.onHint(async () => { const k=put.findIndex((v,i)=>v!==o.answer[i]); if(k<0) return; const s=o.answer[k]; const b=srcs.find(x=>+x.dataset.s===s); b.classList.add("pz-glow"); tgts[k].classList.add("pz-glow"); playSrc(s,b); setTimeout(()=>{ b.classList.remove("pz-glow"); tgts[k].classList.remove("pz-glow"); },2600); });
    api.onSkip(() => { o.answer.forEach((s,k)=>{ tgts[k].querySelector(".pz-put").innerHTML=`<i style="background:${o.colors[s]}"></i>`; }); });
  }
  P.echoes = (body, o, api) => assign(body, o, api, {
    title: o.sub || "اضغطي على كل صدى وعدّي نبضاته، وبعدين حطيه بالشباك اللي بيه نفس عدد الأضواء.",
    srcHTML: i => `<span class="pz-orb" style="--c:${o.colors[i]}">${TART.echo(o.colors[i])}</span><span class="pz-dots">${"<b></b>".repeat(o.counts[i])}</span>`,
    tgtHTML: j => `<span class="pz-win">${"<b></b>".repeat(j+1)}</span>`,
    playSrc: async (i, b) => { const dots=[...b.querySelectorAll(".pz-dots b")]; for(let k=0;k<o.counts[i];k++){ api.note(i+3,.35); dots[k] && pulse(dots[k],"pz-flash",380); await wait(420); } }
  });
  P.rhythm = (body, o, api) => assign(body, o, api, {
    title: o.sub || "كل ضحكة إلها إيقاع. اسمعيها وحطيها بالصندوق اللي نقاطه تشبهها.",
    srcHTML: i => `<span class="pz-orb laugh" style="--c:${o.colors[i]}">${TART.symbol("note", o.colors[i])}</span><span class="pz-beat">${o.patterns[i].map(()=>"<b></b>").join("")}</span>`,
    tgtHTML: j => `<span class="pz-box">${TART.musicBox("#E8C066", o.patterns[o.answer[j]])}</span>`,
    playSrc: async (i, b) => { const bs=[...b.querySelectorAll(".pz-beat b")]; for(let k=0;k<o.patterns[i].length;k++){ if(o.patterns[i][k]){ api.sfx("laugh", i); pulse(bs[k],"pz-flash",300); } await wait(330); } }
  });

  /* 4) تركيب قطع التذكرة بالتدوير */
  P.ticket = (body, o, api) => {
    const parts=o.parts; let rot = parts.map((_,i)=>[90,180,270][i%3]);
    body.appendChild(H(`<div class="pz-ticket"><div class="pz-pieces">${parts.map((p,i)=>`<button class="pz-piece" data-i="${i}" aria-label="قطعة ${i+1}"><span>${p}</span></button>`).join("")}</div><p class="pz-sub">اضغطي على كل قطعة حتى تدور وتصير بمكانها الصحيح.</p></div>`));
    const els=[...body.querySelectorAll(".pz-piece")];
    const draw = () => els.forEach((e,i)=>{ e.style.transform=`rotate(${rot[i]}deg)`; e.classList.toggle("ok", rot[i]%360===0); });
    draw();
    els.forEach(e => e.onclick = () => { const i=+e.dataset.i; rot[i]=(rot[i]+90)%360; api.sfx("page"); draw(); if(rot.every(r=>r===0)){ body.querySelector(".pz-pieces").classList.add("joined"); setTimeout(()=>api.solve(), 900); } });
    api.onHint(() => { const i=rot.findIndex(r=>r!==0); if(i<0) return; els[i].classList.add("pz-glow"); setTimeout(()=>els[i].classList.remove("pz-glow"),2000); api.say("الكتابة لازم تصير مستقيمة، مو مقلوبة."); });
    api.onSkip(() => { rot = rot.map(()=>0); draw(); body.querySelector(".pz-pieces").classList.add("joined"); });
  };

  /* 5) لعبة توقيت لطيفة: التقاء العقارب */
  P.timing = (body, o, api) => {
    const need=o.need||3; let hits=0, a1=0, a2=200, raf=0, last=performance.now(), alive=true;
    const slow = (window.motionOK && !motionOK()) ? .5 : 1;
    body.appendChild(H(`<div class="pz-timing"><svg viewBox="0 0 120 120" class="pz-clock"><circle cx="60" cy="60" r="56" fill="#F6E3A1" stroke="#7A5A3A" stroke-width="5"/><g class="h1"><path d="M60 60V26" stroke="#5E3B28" stroke-width="7" stroke-linecap="round"/></g><g class="h2"><path d="M60 60V14" stroke="#C8705F" stroke-width="4" stroke-linecap="round"/></g><circle cx="60" cy="60" r="5" fill="#5E3B28"/></svg>
      <div class="pz-hits">${"<i></i>".repeat(need)}</div><button class="btn honey pz-now">هسه!</button></div>`));
    const h1=body.querySelector(".h1"), h2=body.querySelector(".h2"), clk=body.querySelector(".pz-clock");
    const diff = () => { let d=Math.abs(((a2-a1)%360+360)%360); return Math.min(d, 360-d); };
    const loop = now => { if(!alive) return; const dt=Math.min(.05,(now-last)/1000); last=now; a1=(a1+22*slow*dt)%360; a2=(a2+84*slow*dt)%360; h1.setAttribute("transform",`rotate(${a1} 60 60)`); h2.setAttribute("transform",`rotate(${a2} 60 60)`); clk.classList.toggle("near", diff()<26); raf=requestAnimationFrame(loop); };
    raf=requestAnimationFrame(loop);
    const press = () => { if(diff()<16){ hits++; api.sfx("pick"); body.querySelectorAll(".pz-hits i")[hits-1].classList.add("on"); a2=(a2+150)%360; if(hits>=need){ alive=false; cancelAnimationFrame(raf); setTimeout(()=>api.solve(),400); } } else { api.sfx("soft"); api.say(["قريبة! استني العقربين يتلاگون.","ماكو مشكلة، الساعة تنتظر.","شوية بعد… لما يصيرون فوگ بعض."][Math.floor(Math.random()*3)]); } };
    body.querySelector(".pz-now").onclick = press;
    const key = e => { if(e.code==="Space"||e.key==="Enter"){ e.preventDefault(); press(); } };
    window.addEventListener("keydown", key);
    api.onHint(() => api.say("لما الساعة تلمع ذهبي، العقارب قريبة من بعض. اضغطي بوقتها."));
    api.onCleanup(() => { alive=false; cancelAnimationFrame(raf); window.removeEventListener("keydown", key); });
  };

  /* 6) مطابقة ألوان (أكثر من حل صحيح) */
  P.colors = (body, o, api) => {
    let sel=0; const got = o.items.map(()=>null);
    body.appendChild(H(`<div class="pz-colors"><div class="pz-things">${o.items.map((it,i)=>`<button class="pz-thing" data-i="${i}"><span class="art">${it.art(null)}</span><small>${it.label}</small></button>`).join("")}</div>
      <div class="pz-pal">${o.palette.map((c,k)=>`<button class="pz-sw" data-k="${k}" style="background:${c}" aria-label="${o.names?o.names[k]:"لون"}"></button>`).join("")}</div></div>`));
    const things=[...body.querySelectorAll(".pz-thing")];
    const mark = () => things.forEach((t,i)=>t.classList.toggle("sel", i===sel));
    mark();
    things.forEach(t => t.onclick = () => { sel=+t.dataset.i; mark(); api.sfx("soft"); });
    body.querySelectorAll(".pz-sw").forEach(b => b.onclick = () => {
      const k=+b.dataset.k, it=o.items[sel], c=o.palette[k];
      things[sel].querySelector(".art").innerHTML = it.art(c);
      if(it.ok.includes(k)){ got[sel]=k; things[sel].classList.add("ok"); api.sfx("pick"); const nx=got.findIndex(v=>v==null); if(nx<0){ setTimeout(()=>api.solve(got.map(v=>o.palette[v])), 600); } else { sel=nx; mark(); } }
      else { got[sel]=null; things[sel].classList.remove("ok"); api.sfx("soft"); api.say(it.nope || "حلو… بس هذا الشي يحب لون ثاني. جربي غيره."); }
    });
    api.onHint(() => { const it=o.items[sel]; const k=it.ok[0]; const b=body.querySelector(`.pz-sw[data-k="${k}"]`); b.classList.add("pz-glow"); setTimeout(()=>b.classList.remove("pz-glow"),2200); api.say(it.hint || "اللون اللي يلمع يناسبه."); });
    api.onSkip(() => o.items.forEach((it,i)=>{ things[i].querySelector(".art").innerHTML = it.art(o.palette[it.ok[0]]); }));
  };

  /* 7) توجيه المجاري بالمفاتيح */
  P.route = (body, o, api) => {
    const src=o.sources, target=o.target; let sw=o.switches.map(()=>false);
    body.appendChild(H(`<div class="pz-route"><svg viewBox="0 0 300 260" class="pz-rsvg"></svg><div class="pz-switches">${o.switches.map((s,i)=>`<button class="pz-sw2" data-i="${i}">${TART.board(false)}<small>لوح ${i+1}</small></button>`).join("")}</div></div>`));
    const svg=body.querySelector(".pz-rsvg"), X=[60,150,240], L=o.switches.length, dy=160/(L+1);
    const draw = () => {
      let pos=[0,1,2]; let s=`<rect x="0" y="0" width="300" height="260" rx="14" fill="#2E2A55"/>`;
      src.forEach((c,i)=>{ s+=`<circle cx="${X[i]}" cy="26" r="16" fill="${c}"/>`; });
      let y=42;
      o.switches.forEach((pair,k)=>{
        const y2=y+dy; const np=pos.slice();
        if(sw[k]){ const [a,b]=pair; [np[a],np[b]]=[pos[b],pos[a]]; }
        for(let lane=0;lane<3;lane++){ const from=lane, to=np.indexOf(pos[lane]); s+=`<path d="M${X[from]} ${y}C${X[from]} ${y+dy/2} ${X[to]} ${y+dy/2} ${X[to]} ${y2}" stroke="${src[pos[lane]]}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".92"/>`; }
        s+=`<text x="8" y="${y+dy/2+5}" font-size="13" fill="#F6E3A1">${k+1}</text>`;
        pos=np; y=y2;
      });
      for(let lane=0;lane<3;lane++) s+=`<path d="M${X[lane]} ${y}V214" stroke="${src[pos[lane]]}" stroke-width="10"/>`;
      target.forEach((t,i)=>{ const ok=pos[i]===t; s+=`<rect x="${X[i]-34}" y="214" width="68" height="34" rx="8" fill="${src[t]}" opacity="${ok?1:.35}" stroke="#FBF6E8" stroke-width="${ok?3:1}"/><text x="${X[i]}" y="236" text-anchor="middle" font-size="12" font-family="Almarai,sans-serif" fill="#2E2A55">${o.streets[i]}</text>`; });
      svg.innerHTML=s;
      body.querySelectorAll(".pz-sw2").forEach((b,i)=>{ b.innerHTML = TART.board(sw[i]) + `<small>لوح ${i+1}</small>`; b.setAttribute("aria-pressed", sw[i]); });
      return pos.every((p,i)=>p===target[i]);
    };
    draw();
    body.querySelectorAll(".pz-sw2").forEach(b => b.onclick = () => { const i=+b.dataset.i; sw[i]=!sw[i]; api.sfx("splash"); if(draw()) setTimeout(()=>api.solve(), 700); });
    api.onHint(() => { const i=o.solution.findIndex((v,k)=>v!==sw[k]); if(i<0) return; const b=body.querySelectorAll(".pz-sw2")[i]; b.classList.add("pz-glow"); setTimeout(()=>b.classList.remove("pz-glow"),2200); api.say("جربي تحركين اللوح اللي يلمع."); });
    api.onSkip(() => { sw=o.solution.slice(); draw(); });
  };

  /* 8) لوحة المدينة: اختيار لونين وملصق */
  P.paint = (body, o, api) => {
    let picks=[], stk=null;
    body.appendChild(H(`<div class="pz-paint"><div class="pz-mural"></div>
      <p class="pz-sub">اختاري لونين:</p><div class="pz-pal">${o.palette.map((c,k)=>`<button class="pz-sw" data-k="${k}" style="background:${c}"></button>`).join("")}</div>
      <p class="pz-sub">وملصق واحد:</p><div class="pz-stks">${o.stickers.map((s,k)=>`<button class="pz-stk" data-s="${k}">${TART.symbol(s, "#E8C066")}</button>`).join("")}</div>
      <button class="btn honey pz-done" disabled>نرسمها سوا</button></div>`));
    const mural=body.querySelector(".pz-mural"), done=body.querySelector(".pz-done");
    const draw = () => { mural.innerHTML = TART.mural(o.palette[picks[0]]||"#ddd", o.palette[picks[1]]||"#ccc", stk!=null?TART.symbol(o.stickers[stk],"#E8C066"):""); body.querySelectorAll(".pz-sw").forEach(b=>b.classList.toggle("sel", picks.includes(+b.dataset.k))); body.querySelectorAll(".pz-stk").forEach(b=>b.classList.toggle("sel", +b.dataset.s===stk)); done.disabled = !(picks.length===2 && stk!=null); };
    draw();
    body.querySelectorAll(".pz-sw").forEach(b => b.onclick = () => { const k=+b.dataset.k; if(picks.includes(k)) picks=picks.filter(x=>x!==k); else { picks.push(k); if(picks.length>2) picks.shift(); } api.sfx("soft"); draw(); });
    body.querySelectorAll(".pz-stk").forEach(b => b.onclick = () => { stk=+b.dataset.s; api.sfx("pick"); draw(); });
    done.onclick = () => api.solve({c1:o.palette[picks[0]], c2:o.palette[picks[1]], stk:o.stickers[stk]});
    api.onHint(() => api.say("أي لونين تحبيهم ينفعون. ماكو جواب غلط هنا."));
    api.onSkip(() => { picks=[0,3]; stk=0; draw(); return {c1:o.palette[0], c2:o.palette[3], stk:o.stickers[0]}; });
  };

  /* 9) تدوير المرايا لتوجيه ضوء القمر */
  P.mirrors = (body, o, api) => {
    const C=o.cols, R=o.rows; let ms=o.mirrors.map(m=>({...m, d:m.start}));
    body.appendChild(H(`<div class="pz-mirrors"><svg viewBox="-60 -70 ${C*60+120} ${R*60+90}" class="pz-msvg"></svg><p class="pz-sub">اضغطي المرايا حتى توصل ضوء القمر للمنارة.</p></div>`));
    const svg=body.querySelector(".pz-msvg");
    const trace = () => {
      let x=-1, y=o.start.row, dx=1, dy=0; const pts=[[-30, y*60+30]]; let hit=false;
      for(let n=0;n<40;n++){
        x+=dx; y+=dy;
        if(y<0 && x===o.target.col){ pts.push([x*60+30, -40]); hit=true; break; }
        if(x<0||y<0||x>=C||y>=R){ pts.push([x*60+30, y*60+30]); break; }
        const m=ms.find(m=>m.col===x && m.row===y);
        if(m){ pts.push([x*60+30, y*60+30]); if(m.d==="\\"){ [dx,dy]=[dy,dx]; } else { [dx,dy]=[-dy,-dx]; } }
      }
      return {pts, hit};
    };
    const draw = () => {
      const {pts, hit} = trace();
      let s=`<rect x="0" y="0" width="${C*60}" height="${R*60}" rx="10" fill="#1F2347" stroke="#3C3F78"/>`;
      for(let i=1;i<C;i++) s+=`<path d="M${i*60} 0V${R*60}" stroke="#3C3F78"/>`; for(let j=1;j<R;j++) s+=`<path d="M0 ${j*60}H${C*60}" stroke="#3C3F78"/>`;
      s+=`<g transform="translate(-58 ${o.start.row*60+2}) scale(.56)">${TART.moon().replace(/<\/?svg[^>]*>/g,"")}</g>`;
      s+=`<g transform="translate(${o.target.col*60+12} -70) scale(.3)">${TART.lighthouse(hit).replace(/<\/?svg[^>]*>/g,"")}</g>`;
      s+=`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" stroke="#FFF3C4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
      ms.forEach((m,i)=>{ s+=`<g class="pz-mir" data-i="${i}" transform="translate(${m.col*60+2} ${m.row*60+2}) scale(.93)" style="cursor:pointer">${TART.mirror(m.d).replace(/<\/?svg[^>]*>/g,"")}<rect width="60" height="60" fill="transparent"/></g>`; });
      svg.innerHTML=s;
      svg.querySelectorAll(".pz-mir").forEach(g => g.addEventListener("click", () => { const m=ms[+g.dataset.i]; m.d = m.d==="/"?"\\":"/"; api.sfx("soft"); if(draw()) setTimeout(()=>api.solve(), 700); }));
      return hit;
    };
    draw();
    api.onHint(() => { const i=ms.findIndex((m,k)=>m.d!==o.mirrors[k].sol); if(i<0) return; api.say(`المراية رقم ${i+1} تحتاج تنقلب.`); const g=svg.querySelector(`.pz-mir[data-i="${i}"]`); g && g.classList.add("pz-glow"); });
    api.onSkip(() => { ms.forEach((m,k)=>m.d=o.mirrors[k].sol); draw(); });
  };

  /* 10) تذكّر مسار النجوم */
  P.starpath = (body, o, api) => {
    let pos=0, busy=true;
    body.appendChild(H(`<div class="pz-stars"><div class="pz-sky">${o.stars.map((s,i)=>`<button class="pz-star" data-i="${i}" style="left:${s[0]}%;top:${s[1]}%" aria-label="نجمة ${i+1}">${TART.symbol("star","#FFF0B8")}</button>`).join("")}<svg class="pz-trail" viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div><button class="pz-mini" data-replay>شوفي الطريق مرة ثانية</button></div>`));
    const stars=[...body.querySelectorAll(".pz-star")], trail=body.querySelector(".pz-trail");
    const drawTrail = n => { const p=o.seq.slice(0,n).map(i=>o.stars[i]); trail.innerHTML = p.length>1?`<polyline points="${p.map(q=>q.join(",")).join(" ")}" fill="none" stroke="#FFF0B8" stroke-width=".8" stroke-dasharray="2 2"/>`:""; };
    async function show(){ busy=true; pos=0; drawTrail(0); stars.forEach(s=>s.classList.remove("on")); await wait(500); for(const i of o.seq){ pulse(stars[i],"pz-flash",650); api.note(i,.5); await wait(800); } busy=false; }
    stars.forEach(s => s.onclick = () => { if(busy) return; const i=+s.dataset.i; api.note(i,.4);
      if(i===o.seq[pos]){ s.classList.add("on"); pos++; drawTrail(pos); if(pos===o.seq.length){ busy=true; setTimeout(()=>api.solve(),600); } }
      else { api.sfx("nope"); api.say("الطيور تلف شوية… نشوف الطريق مرة ثانية."); setTimeout(show, 600); } });
    body.querySelector("[data-replay]").onclick = () => { if(!busy) show(); };
    api.onHint(() => { const s=stars[o.seq[pos]]; s.classList.add("pz-glow"); setTimeout(()=>s.classList.remove("pz-glow"),2000); });
    api.onSkip(() => { o.seq.forEach(i=>stars[i].classList.add("on")); drawTrail(o.seq.length); });
    show();
  };

  /* 11) ترتيب الحروف */
  P.letters = (body, o, api) => {
    const L=[...o.letters]; let pos=0;
    body.appendChild(H(`<div class="pz-letters"><div class="pz-lslots">${L.map(()=>'<span></span>').join("")}</div><div class="pz-ltiles">${sh(L.map((c,i)=>({c,i}))).map(t=>`<button class="pz-ltile" data-c="${t.c}">${t.c}</button>`).join("")}</div><p class="pz-sub">${o.clue||""}</p></div>`));
    const slots=[...body.querySelectorAll(".pz-lslots span")];
    body.querySelectorAll(".pz-ltile").forEach(b => b.onclick = () => {
      if(b.disabled) return;
      if(b.dataset.c===L[pos]){ slots[pos].textContent=L[pos]; slots[pos].classList.add("on"); b.disabled=true; b.classList.add("used"); pos++; api.sfx("pick");
        if(pos===L.length){ body.querySelector(".pz-lslots").classList.add("joined"); body.querySelector(".pz-lslots").innerHTML=`<b>${o.word}</b>`; setTimeout(()=>api.solve(),900); } }
      else { api.sfx("soft"); pulse(b,"pz-shake",450); api.say("هالحرف يجي بعدين. شنو أول حرف بالكلمة؟"); }
    });
    api.onHint(() => { const b=[...body.querySelectorAll(".pz-ltile")].find(x=>!x.disabled && x.dataset.c===L[pos]); if(b){ b.classList.add("pz-glow"); setTimeout(()=>b.classList.remove("pz-glow"),2000); } });
    api.onSkip(() => { body.querySelector(".pz-lslots").innerHTML=`<b>${o.word}</b>`; });
  };

  /* 12) تفاصيل مخبّاة بمشاهد سابقة */
  P.hidden = (body, o, api) => {
    let found=0;
    body.appendChild(H(`<div class="pz-hidden">${o.panels.map((p,i)=>`<div class="pz-panel" style="background:${p.bg}"><span class="pz-ptitle">${p.title}</span>${p.deco}<button class="pz-hit" data-i="${i}" style="left:${p.x}%;top:${p.y}%" aria-label="${p.label}">${p.item}</button><span class="pz-q">${p.q}</span></div>`).join("")}</div>`));
    body.querySelectorAll(".pz-hit").forEach(b => b.onclick = () => { if(b.classList.contains("found")) return; b.classList.add("found"); b.closest(".pz-panel").classList.add("done"); found++; api.sfx("sparkle"); if(found===o.panels.length) setTimeout(()=>api.solve(),700); });
    body.querySelectorAll(".pz-panel").forEach(p => p.addEventListener("click", e => { if(!e.target.closest(".pz-hit")) api.sfx("soft"); }));
    api.onHint(() => { const b=[...body.querySelectorAll(".pz-hit")].find(x=>!x.classList.contains("found")); if(b){ b.classList.add("pz-glow"); setTimeout(()=>b.classList.remove("pz-glow"),2400); } });
    api.onSkip(() => body.querySelectorAll(".pz-hit").forEach(b=>b.classList.add("found")));
  };

  /* 13) سؤال بالحوار (جواب واحد صحيح، والغلط يعطي رد لطيف) */
  P.quiz = (body, o, api) => {
    body.appendChild(H(`<div class="pz-quiz"><p class="pz-qq">${o.q}</p><div class="pz-opts">${o.opts.map((t,i)=>`<button class="btn ghost" data-i="${i}">${t}</button>`).join("")}</div></div>`));
    body.querySelectorAll("[data-i]").forEach(b => b.onclick = () => { const i=+b.dataset.i; if(i===o.a){ b.classList.add("right"); api.sfx("pick"); setTimeout(()=>api.solve(),500); } else { b.disabled=true; api.sfx("soft"); api.say((o.why&&o.why[i]) || "مو هاي… بس فكرة حلوة!"); } });
    api.onHint(() => api.say(o.hint || "فكّري بشي شفناه بالطريق."));
  };

  /* 14) صفحة نكتبها سوا (حفظ محلي فقط) */
  P.write = (body, o, api) => {
    body.appendChild(H(`<div class="pz-write"><label>العنوان<input class="pz-in" maxlength="40" value="${api.fill(o.defTitle||"").replace(/"/g,"&quot;")}"></label>
      <label>النهاية<textarea class="pz-ta" rows="3" maxlength="240" placeholder="اكتبي جملة، أو اختاري وحدة جاهزة"></textarea></label>
      <div class="pz-ready">${o.ready.map((t,i)=>`<button class="pz-chip" data-i="${i}">${t}</button>`).join("")}</div>
      <p class="pz-note">تنحفظ على هذا الجهاز فقط، وما تنرسل لأي مكان.</p>
      <button class="btn honey pz-done">نحطها بالمكتبة</button></div>`));
    const ta=body.querySelector(".pz-ta"), ti=body.querySelector(".pz-in");
    body.querySelectorAll(".pz-chip").forEach(b => b.onclick = () => { ta.value = o.ready[+b.dataset.i]; api.sfx("soft"); });
    body.querySelector(".pz-done").onclick = () => { const text=ta.value.trim() || o.ready[0]; api.solve({title: ti.value.trim() || api.fill(o.defTitle||""), text}); };
    api.onHint(() => api.say("جملة وحدة تكفي. حتى «وعاشوا يضحكون» نهاية حلوة."));
    api.onSkip(() => ({title: ti.value.trim() || api.fill(o.defTitle||""), text: ta.value.trim() || o.ready[0]}));
  };

  /* 15) اختيار ذكرى للساعة (جاهزة أو مكتوبة) */
  P.memory = (body, o, api) => {
    body.appendChild(H(`<div class="pz-write"><div class="pz-ready">${o.ready.map((t,i)=>`<button class="pz-chip" data-i="${i}">${t}</button>`).join("")}</div><label>أو اكتبيها بنفسج<textarea class="pz-ta" rows="2" maxlength="160"></textarea></label><p class="pz-note">تنحفظ على هذا الجهاز فقط.</p><button class="btn honey pz-done">خلّي الساعة تحفظها</button></div>`));
    const ta=body.querySelector(".pz-ta"); let pick=null;
    body.querySelectorAll(".pz-chip").forEach(b => b.onclick = () => { pick=o.ready[+b.dataset.i]; ta.value=pick; body.querySelectorAll(".pz-chip").forEach(x=>x.classList.toggle("sel",x===b)); api.sfx("soft"); });
    body.querySelector(".pz-done").onclick = () => api.solve(ta.value.trim() || o.ready[0]);
    api.onSkip(() => ta.value.trim() || o.ready[0]);
  };

  return P;
})();
