/* =====================================================================
   عالمنا — شاطئ الغيوم (عالم فاتح وهادي فوق الغيم)
   ===================================================================== */
World.region("beach", (body) => {
  const S = World.S; S.flags.sunset = S.flags.sunset || "peach";
  const {spr, put, rand} = WRiver;
  const SUN = {peach:["#FFD3A8","#FBE3EF","#E4D8F4","خوخي"], rose:["#F3A9B8","#FBE3EF","#D9D2EA","وردي"], gold:["#F6C86A","#FBF0D0","#F3D9D2","ذهبي"], lilac:["#C9B6E8","#E4D8F4","#CFE3EA","ليلكي"]};
  const sun = () => SUN[S.flags.sunset]||SUN.peach;
  const cloudSVG = (c="#FFFFFF") => `<svg viewBox="0 0 120 60"><path d="M20 52C6 52 4 36 18 34 16 18 38 12 46 24 52 8 82 8 86 28 102 24 114 40 102 52Z" fill="${c}" stroke="#E3C6DD" stroke-width="2.4"/></svg>`;
  const v = h(`<div class="wbe" style="--b1:${sun()[0]};--b2:${sun()[1]};--b3:${sun()[2]}">
    <div class="wbe-sky"><div class="wbe-sun"></div>${Array.from({length:5},(_,i)=>`<i class="wbe-cl" style="top:${10+i*15}%;--d:${-i*9}s;--s:${.6+(i%3)*.25}">${cloudSVG()}</i>`).join("")}<div class="wbe-cast"></div></div>
    <div class="wtabs">${[["draw","رسم على الغيوم"],["stars","نجوم نازلة"],["castle","قلعة الغيوم"],["shape","ترتيب الغيوم"],["boat","المركب الورقي"],["letters","رسائل بالهوا"],["sunset","الغروب"]].map(([k,n],i)=>`<button data-t="${k}" aria-pressed="${i===0}">${n}</button>`).join("")}</div>
    <div class="wbe-body"></div></div>`);
  body.appendChild(v);
  const out=$(".wbe-body",v); let game=null, pad=null, cleanups=[];
  const cs = World.cast($(".wbe-cast",v), {h:30, x:[30,70], range:[10,90]});
  const clear = () => { game&&game.destroy(); pad&&pad.destroy(); game=pad=null; cleanups.forEach(f=>f()); cleanups=[]; out.innerHTML=""; };
  $$("[data-t]",v).forEach(b=>b.onclick=()=>{ $$("[data-t]",v).forEach(x=>x.setAttribute("aria-pressed",x===b)); World.sfx("soft"); clear(); T[b.dataset.t](); });

  const T = {
    /* رسم بالإصبع، والخطوط تذوب مثل الغيم */
    draw(){ out.innerHTML=`<div class="wcard"><p class="wnote">ارسمي بإصبعج على الغيمة. الرسمة تذوب بهدوء بعد شوية.</p><div class="wbe-canvas"><canvas></canvas></div><div class="row"><button class="btn ghost small" data-c>امسحي</button></div></div>`;
      const cv=$("canvas",out), x=cv.getContext("2d"); const size=()=>{ const r=cv.getBoundingClientRect(), d=Math.min(2,devicePixelRatio||1); cv.width=r.width*d; cv.height=r.height*d; x.setTransform(d,0,0,d,0,0); }; size();
      let strokes=[], cur=null, raf=0; const pos=e=>{ const r=cv.getBoundingClientRect(); return [e.clientX-r.left, e.clientY-r.top]; };
      cv.addEventListener("pointerdown",e=>{ e.preventDefault(); cv.setPointerCapture(e.pointerId); cur={p:[pos(e)], t:performance.now()}; strokes.push(cur); });
      cv.addEventListener("pointermove",e=>{ if(cur) cur.p.push(pos(e)); });
      const end=()=>{ if(cur){ cur.t=performance.now(); cur=null; } }; cv.addEventListener("pointerup",end); cv.addEventListener("pointercancel",end);
      const loop=now=>{ raf=requestAnimationFrame(loop); const w=cv.clientWidth, hh=cv.clientHeight; x.clearRect(0,0,w,hh); strokes=strokes.filter(s=>s===cur || now-s.t<7000);
        strokes.forEach(s=>{ const a = s===cur ? 1 : Math.max(0, 1-(now-s.t)/7000); x.globalAlpha=a; x.strokeStyle="#FFFFFF"; x.shadowColor="rgba(200,180,230,.9)"; x.shadowBlur=12; x.lineWidth=14; x.lineCap="round"; x.lineJoin="round"; x.beginPath(); s.p.forEach(([px,py],i)=>i?x.lineTo(px,py):x.moveTo(px,py)); x.stroke(); }); x.globalAlpha=1; };
      raf=requestAnimationFrame(loop); $("[data-c]",out).onclick=()=>strokes=[]; cleanups.push(()=>cancelAnimationFrame(raf)); },
    /* نجوم نازلة بسلة غيمة */
    stars(){ game=World.gameUI(out, {id:"bstars", title:"نجوم نازلة", bg:`linear-gradient(180deg,${sun()[2]},${sun()[1]})`, art:()=>WART.item.star(), how:"حرّكي غيمة السلة بالأزرار، والقطي النجوم النازلة من السما.", levels:["هادي","أسرع"],
      run(ctx){ const L=ctx.layer; let x=ctx.W()/2-50, got=0, t=0, list=[], time=0, DUR=25; const BW=100, BH=50; const bk=spr(L, cloudSVG(), BW, BH);
        ctx.loop(dt=>{ const W=ctx.W(), H=ctx.H(); time+=dt; ctx.stat(`نجوم: ${got} — الوقت ${Math.max(0,Math.ceil(DUR-time))}`); const d=(ctx.pad.held.has("right")?1:0)-(ctx.pad.held.has("left")?1:0); x+=d*260*dt; [x]=ctx.fit(x,0,BW,BH); put(bk,x,H-BH-8);
          t-=dt; if(time<DUR && t<=0){ t=rand(.5,.9); const s=32; list.push({s,x:rand(0,W-s),y:0,vy:rand(80,120)+ctx.level*40,el:spr(L, WART.item.star(), s, s)}); }
          list.forEach(o=>{ o.y+=o.vy*dt; const [ox,oy]=ctx.fit(o.x,o.y,o.s,o.s); put(o.el,ox,oy,`rotate(${o.y}deg)`); if(o.y+o.s>=H-BH && ox+o.s>x+10 && ox<x+BW-10){ o.gone=true; got++; ctx.sfx("pick"); o.el.remove(); } else if(o.y>=H-o.s){ o.gone=true; o.el.classList.add("fade"); setTimeout(()=>o.el.remove(),300); } });
          list=list.filter(o=>!o.gone); if(time>=DUR && !list.length) ctx.win(`القطتي ${got} نجمة!`, {star:Math.max(1,Math.round(got/5)), cloud:1}, got>=15?3:got>=8?2:1); }); }});
      pad=World.pad(game.el); game.ctx.pad=pad; },
    /* قلعة غيوم: نزّلي القطع فوق بعض */
    castle(){ game=World.gameUI(out, {id:"castle", title:"قلعة الغيوم", bg:`linear-gradient(180deg,${sun()[1]},${sun()[2]})`, art:()=>cloudSVG(), how:"القطعة تتحرك فوق. اضغطي «نزّلي» حتى تنزل على القلعة. ابني سبع طوابق. إذا مالت شوية، القلعة بعدها واقفة.", levels:["هادي","أسرع"],
      run(ctx){ const L=ctx.layer; const PH=34; let floor=0, x=0, dir=1, stack=[], busy=false, perfect=0; const BW=()=>Math.min(160, ctx.W()*.4);
        const cur=spr(L, cloudSVG("#FFF6FB"), BW(), PH);
        const btn=h(`<button class="btn honey wr-throw">نزّلي</button>`); ctx.frame.parentNode.appendChild(btn);
        btn.onclick=()=>{ if(busy||ctx.paused) return; busy=true; const W=ctx.W(), H=ctx.H(), bw=BW(); const base=stack.length?stack[stack.length-1]:W/2-bw/2; const off=x-base; if(Math.abs(off)<10) perfect++;
          const nx = stack.length ? base + Math.max(-bw*.35, Math.min(bw*.35, off)) : x; const el=spr(L, cloudSVG(["#FFFFFF","#FDF0F7","#F4ECFF"][floor%3]), bw, PH); const [fx]=ctx.fit(nx,0,bw,PH); put(el, fx, H-PH*(floor+1)-4); stack.push(fx); floor++; ctx.sfx("pop"); ctx.stat(`الطوابق: ${floor} من 7`);
          if(Math.abs(off)>bw*.35) ctx.say("مالت شوية… بس صامدة!");
          if(floor>=7){ cur.remove(); L.insertAdjacentHTML("beforeend", `<div class="wbe-flag" style="left:${stack[6]+bw/2}px;bottom:${PH*7+4}px">${WART.decor.garland()}</div>`); ctx.win("قلعة بالسما!", {cloud:2, star:1}, perfect>=4?3:perfect>=2?2:1); } setTimeout(()=>busy=false, 250); };
        ctx.stat("الطوابق: 0 من 7");
        ctx.loop(dt=>{ const W=ctx.W(), H=ctx.H(), bw=BW(); x+=dir*(150+ctx.level*80+floor*10)*dt; if(x<=0){x=0;dir=1;} if(x>=W-bw){x=W-bw;dir=-1;} const top=Math.max(0, H-PH*(floor+1)-4-PH*2.2); put(cur,x,Math.min(top, 10)); });
        return ()=>btn.remove(); }}); },
    /* ترتيب الغيوم على شكل */
    shape(){ const SH={heart:{n:"قلب", p:[[30,30],[52,30],[20,52],[62,52],[41,72]]}, boat:{n:"قارب", p:[[20,60],[42,60],[64,60],[42,36],[42,14]]}, star:{n:"نجمة", p:[[42,10],[18,40],[66,40],[28,72],[58,72]]}};
      const keys=Object.keys(SH), k=keys[Math.floor(Math.random()*keys.length)], P=SH[k].p;
      out.innerHTML=`<div class="wcard"><p class="wnote">اسحبي الغيوم الخمسة للنقاط حتى يتكوّن شكل ${SH[k].n}.</p><div class="wbe-shape">${P.map(([x,y],i)=>`<i class="sl" style="left:${x}%;top:${y}%"></i>`).join("")}${P.map((_,i)=>`<button class="wbe-dc" data-i="${i}" style="left:${8+i*18}%;top:86%">${cloudSVG()}</button>`).join("")}</div></div>`;
      const box=$(".wbe-shape",out); let done=0, used=new Set();
      $$(".wbe-dc",out).forEach(el=>{ let st=null; el.addEventListener("pointerdown",e=>{ e.preventDefault(); el.setPointerCapture(e.pointerId); const r=box.getBoundingClientRect(); st={r}; el.classList.add("drag"); });
        el.addEventListener("pointermove",e=>{ if(!st) return; const x=(e.clientX-st.r.left)/st.r.width*100, y=(e.clientY-st.r.top)/st.r.height*100; el.style.left=Math.min(92,Math.max(0,x-8))+"%"; el.style.top=Math.min(92,Math.max(0,y-6))+"%"; });
        el.addEventListener("pointerup",e=>{ if(!st) return; el.classList.remove("drag"); const x=(e.clientX-st.r.left)/st.r.width*100, y=(e.clientY-st.r.top)/st.r.height*100; st=null; const j=P.findIndex((p,i)=>!used.has(i) && Math.hypot(p[0]-x+0, p[1]-y)<12); if(j>=0){ used.add(j); el.style.left=(P[j][0]-8)+"%"; el.style.top=(P[j][1]-6)+"%"; el.classList.add("set"); el.disabled=true; done++; World.sfx("pop"); if(done===P.length){ World.sfx("ok"); World.give("cloud",1); World.event("puzzle"); toast(`صار ${SH[k].n} من الغيوم!`,"star"); setTimeout(()=>T.shape(), 1800); } } }); }); },
    /* المركب الورقي: رحلة هادئة وجمع رسائل */
    boat(){ game=World.gameUI(out, {id:"pboat", title:"المركب الورقي", bg:`linear-gradient(180deg,${sun()[1]},${sun()[2]})`, art:()=>WART.land.beach(), how:"رحلة هادية فوق الغيوم. حرّكي المركب فوق وجوّا بالأزرار، واجمعي الأصداف والرسائل الطايفة.", levels:["رحلة قصيرة","رحلة طويلة"],
      run(ctx){ const L=ctx.layer, DUR=[25,40][ctx.level]; let y=ctx.H()/2, time=0, got=0, t=0, list=[]; const BW=80, BH=50; const bt=spr(L, `<svg viewBox="0 0 100 70"><path d="M4 30h92L80 66H20z" fill="#FBF6E8" stroke="#B8A57A" stroke-width="3"/><path d="M50 2L30 30h40z" fill="#FBF6E8" stroke="#B8A57A" stroke-width="3"/></svg>`, BW, BH);
        ctx.loop(dt=>{ const W=ctx.W(), H=ctx.H(); time+=dt; ctx.stat(`جمعتي ${got} — ${Math.max(0,Math.ceil(DUR-time))} ثانية`); const d=(ctx.pad.held.has("down")?1:0)-(ctx.pad.held.has("up")?1:0); y+=d*180*dt; const [,by]=ctx.fit(0,y,BW,BH); y=by; put(bt, W*.12, y+(motionOK()?Math.sin(time*2)*4:0));
          t-=dt; if(time<DUR && t<=0){ t=rand(.8,1.4); const k=Math.random()<.4?"note":"shell", s=38; list.push({k,s,x:W,y:rand(0,H-s),el:spr(L, k==="note"?WART.note():WART.item.shell(), s, k==="note"?s*.8:s)}); }
          list.forEach(o=>{ o.x-=90*dt; const [ox,oy]=ctx.fit(o.x,o.y,o.s,o.s); put(o.el,ox,oy); if(Math.abs(ox-W*.12-20)<40 && Math.abs(oy-y)<40){ o.gone=true; got++; ctx.sfx("pick"); o.el.remove(); if(o.k==="note") ctx.say(["رسالة: «الغيوم تحبكم».","رسالة: «لا تنسون تشربون ماي».","رسالة: «إيلاف، عدول يسلّم»."][got%3]); } else if(o.x<=0){ o.gone=true; o.el.classList.add("fade"); setTimeout(()=>o.el.remove(),300); } });
          list=list.filter(o=>!o.gone); if(time>=DUR && !list.length) ctx.win("رحلة حلوة!", {shell:Math.max(1,Math.round(got/2))}, got>=10?3:got>=5?2:1); }); }});
      pad=World.pad(game.el, ["up","down"]); game.ctx.pad=pad; },
    /* رسائل تطفو بالهوا */
    letters(){ const M=["من إيلاف: «الغيوم هنا ناعمة مثل المخدة»","من عدول: «بنيت قلعة… ووگعت. نبنيها سوا؟»","من البومة: «الغروب اليوم ذهبي»","من الأرنب: «عندي رسالة ثانية بمحطة البريد»","من السلحفاة: «وصلت للشاطئ… بعد أسبوع»","من الغيمة الصغيرة: «اشتقتلكم»"]; S.flags.bletters=S.flags.bletters||0;
      out.innerHTML=`<div class="wcard"><p class="wnote">اضغطي على الرسائل اللي تطير حتى تقرينها. قريتي ${S.flags.bletters}.</p><div class="wbe-air"></div><p class="wbe-read"></p></div>`; const air=$(".wbe-air",out);
      const t=setInterval(()=>{ if(!document.body.contains(air)){ clearInterval(t); return; } const b=h(`<button class="wbe-lt" style="top:${10+Math.random()*70}%;--d:${6+Math.random()*3}s" aria-label="رسالة">${WART.note()}</button>`); air.appendChild(b); b.onclick=()=>{ $(".wbe-read",out).textContent=M[S.flags.bletters%M.length]; S.flags.bletters++; World.save(); World.event("letter"); World.sfx("sparkle"); b.remove(); if(S.flags.bletters%3===0) World.give("feather",1); }; setTimeout(()=>b.remove(), 9000); }, 1400);
      cleanups.push(()=>clearInterval(t)); },
    /* غروب يختاره المستخدم */
    sunset(){ out.innerHTML=`<div class="wcard"><p class="wnote">اختاري لون الغروب. الشمس تنزل بهدوء والسما تتلوّن.</p><div class="wchips">${Object.entries(SUN).map(([k,c])=>`<button data-s="${k}" aria-pressed="${S.flags.sunset===k}" style="background:linear-gradient(135deg,${c[0]},${c[2]})">${c[3]}</button>`).join("")}</div></div>`;
      $$("[data-s]",out).forEach(b=>b.onclick=()=>{ S.flags.sunset=b.dataset.s; World.save(); const c=sun(); v.style.setProperty("--b1",c[0]); v.style.setProperty("--b2",c[1]); v.style.setProperty("--b3",c[2]); v.classList.remove("setting"); void v.offsetWidth; v.classList.add("setting"); T.sunset(); }); }
  };
  T.draw();
  return () => { clear(); cs.stop(); };
});
