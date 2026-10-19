/* =====================================================================
   دار إيلاف — الألعاب (15 لعبة) + ألغاز قاعة الأقمشة + غرفة الأسرار
   كل لعبة: شرح، بدء، إيقاف/إعادة، ثلاث مستويات، مكافأة تصميم،
   وفشل لطيف يبين الحل. التحكم بالضغط أو السحب (يشتغل بالموبايل والحاسبة).
   ===================================================================== */
const FGames = (() => {
  const A = FArt, G = FW.game;
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const mix = a => shuffle(a);
  const S2 = (inner, vb="0 0 40 40") => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  // أيقونات صغيرة للتلميحات
  const CL = {
    moon:S2(`<path d="M26 6a14 14 0 100 28A12 12 0 0126 6z" fill="#F6E08A" stroke="#B88F33" stroke-width="2"/>`),
    star:S2(`<path d="M20 4l4.6 10 10.4 1.4-7.6 7 2 10.6L20 28l-9.4 5 2-10.6-7.6-7L15.4 14z" fill="#F2D27A" stroke="#B88F33" stroke-width="2" stroke-linejoin="round"/>`),
    owl:S2(`<path d="M8 18c0-10 24-10 24 0v10c0 6-6 9-12 9S8 34 8 28z" fill="#B99472" stroke="#6B4A33" stroke-width="2"/><circle cx="15" cy="18" r="4.4" fill="#fff"/><circle cx="25" cy="18" r="4.4" fill="#fff"/><circle cx="15" cy="18" r="2" fill="#2E2A22"/><circle cx="25" cy="18" r="2" fill="#2E2A22"/><path d="M18 24l2 3 2-3z" fill="#E8A64A"/>`),
    flower:S2(`${[0,72,144,216,288].map(a=>`<ellipse cx="20" cy="20" rx="5" ry="9" transform="rotate(${a} 20 20) translate(0 -7)" fill="#F2A7B8" stroke="#B04E86" stroke-width="1.4"/>`).join("")}<circle cx="20" cy="20" r="4.4" fill="#F6E08A"/>`),
    leaf:S2(`<path d="M6 34C5 18 16 6 34 6c0 18-12 29-28 28z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><path d="M8 32L30 10" stroke="#4E6A46" stroke-width="1.6"/>`),
    sun:S2(`<circle cx="20" cy="20" r="8" fill="#F6E08A" stroke="#D9AE4E" stroke-width="2"/>${[0,45,90,135,180,225,270,315].map(a=>`<path d="M20 4v5" transform="rotate(${a} 20 20)" stroke="#D9AE4E" stroke-width="2.4" stroke-linecap="round"/>`).join("")}`),
    wave:S2(`<path d="M2 22q6-8 12 0t12 0 12 0M2 30q6-8 12 0t12 0 12 0" stroke="#5E9BC9" stroke-width="3" fill="none" stroke-linecap="round"/>`),
    shell:S2(`<path d="M20 32c-12 0-15-12-9-18 5-5 13-5 18 0 6 6 3 18-9 18z" fill="#F7D3C4" stroke="#B9806E" stroke-width="2"/><path d="M20 32l-6-15M20 32V13M20 32l6-15" stroke="#B9806E" stroke-width="1.4"/>`),
    fish:S2(`<path d="M6 20c6-9 18-9 24 0-6 9-18 9-24 0z" fill="#8EC3E8" stroke="#3F6E92" stroke-width="2"/><path d="M30 20l7-6v12z" fill="#8EC3E8" stroke="#3F6E92" stroke-width="2"/><circle cx="13" cy="19" r="1.8" fill="#2E2A22"/>`),
    cloud:S2(`<path d="M8 28a6 6 0 016-8 9 9 0 0117-2 6 6 0 015 10z" fill="#FBFBFF" stroke="#A8B8D8" stroke-width="2"/>`),
    bird:S2(`<path d="M6 22c0-8 10-12 18-9 6 2 9 8 7 13-3 6-12 7-18 5-4-1-7-5-7-9z" fill="#8EC3E8" stroke="#3F6E92" stroke-width="2"/><circle cx="25" cy="17" r="1.6" fill="#2E2A22"/><path d="M31 18l5 1-5 2z" fill="#F2C14E"/>`),
    acorn:S2(`<path d="M10 16h20c0 12-4 18-10 18S10 28 10 16z" fill="#C98E5E" stroke="#7A4E2E" stroke-width="2"/><path d="M8 16c0-6 24-6 24 0z" fill="#8C5E3E" stroke="#5A3A22" stroke-width="2"/><path d="M20 10V6" stroke="#5A3A22" stroke-width="2"/>`),
    mushroom:S2(`<path d="M6 20C6 10 34 10 34 20z" fill="#E05A6A" stroke="#8E2E3A" stroke-width="2"/><rect x="15" y="20" width="10" height="13" rx="3" fill="#FBF6E8" stroke="#8C7D66" stroke-width="2"/><circle cx="14" cy="15" r="2" fill="#fff"/><circle cx="24" cy="14" r="2.4" fill="#fff"/>`),
    candy:S2(`<circle cx="20" cy="20" r="8" fill="#E86CA8" stroke="#9E3A6E" stroke-width="2"/><path d="M12 20l-8-5v10zM28 20l8-5v10z" fill="#F6E08A" stroke="#B88F33" stroke-width="1.6"/><path d="M16 16q4 8 8 0" stroke="#fff" stroke-width="2" fill="none"/>`),
    balloon:S2(`<ellipse cx="20" cy="16" rx="10" ry="12" fill="#F2A7B8" stroke="#B04E86" stroke-width="2"/><path d="M20 28q-3 5 0 10" stroke="#8C7D66" stroke-width="1.6" fill="none"/><path d="M14 10a6 6 0 014-3" stroke="#fff" stroke-width="2" fill="none"/>`),
    gift:S2(`<rect x="7" y="16" width="26" height="18" rx="2" fill="#A9DCC4" stroke="#3E7E62" stroke-width="2"/><rect x="5" y="11" width="30" height="7" rx="2" fill="#C9EADB" stroke="#3E7E62" stroke-width="2"/><path d="M20 11v23" stroke="#E86CA8" stroke-width="4"/><path d="M20 11c-4-6-10-4-7 0zM20 11c4-6 10-4 7 0z" fill="#E86CA8"/>`),
    butterfly:S2(`<path d="M20 20C16 8 4 8 6 17c-2 8 8 10 14 3zM20 20C24 8 36 8 34 17c2 8-8 10-14 3z" fill="#C9B6E8" stroke="#6E5A9E" stroke-width="1.8"/><path d="M20 12v16" stroke="#4A3A44" stroke-width="2.2" stroke-linecap="round"/>`),
    snow:S2(`<g stroke="#8EC3E8" stroke-width="2.4" stroke-linecap="round">${[0,60,120].map(a=>`<path d="M20 5v30M15 9l5 4 5-4M15 31l5-4 5 4" transform="rotate(${a} 20 20)"/>`).join("")}</g>`),
    heart:S2(`<path d="M20 33S6 24 6 14a7 7 0 0114-3 7 7 0 0114 3c0 10-14 19-14 19z" fill="#F2A7B8" stroke="#B04E86" stroke-width="2"/>`),
    note:S2(`<path d="M15 30V10l15-4v20" stroke="#8E5A9E" stroke-width="2.6" fill="none"/><ellipse cx="12" cy="30" rx="4.4" ry="3.4" fill="#8E5A9E"/><ellipse cx="27" cy="26" rx="4.4" ry="3.4" fill="#8E5A9E"/>`),
    bow:S2(`<path d="M20 20C14 10 4 10 6 20 4 30 14 30 20 20zM20 20C26 10 36 10 34 20 36 30 26 30 20 20z" fill="#F2A7B8" stroke="#B04E86" stroke-width="2"/><circle cx="20" cy="20" r="3.4" fill="#E86CA8"/>`),
    crown:S2(`<path d="M6 30L8 12l7 8 5-12 5 12 7-8 2 18z" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="24" r="2.6" fill="#E86CA8"/>`),
    shoe:S2(`<path d="M6 28c0-6 2-12 6-12 3 0 4 4 8 6s14 2 14 8v2H6z" fill="#3E3A44" stroke="#1E1A24" stroke-width="2"/><path d="M14 18l6 4" stroke="#F2D27A" stroke-width="2"/>`),
    pearls:S2(`${Array.from({length:9},(_,i)=>{ const t=i/8; return `<circle cx="${6+28*t}" cy="${12+Math.sin(t*Math.PI)*16}" r="3.4" fill="#FBF7F0" stroke="#B9AFA0" stroke-width="1.2"/>`; }).join("")}`),
    dress:S2(`<path d="M15 6h10l2 10 7 18H6l7-18z" fill="#C9B6E8" stroke="#6E5A9E" stroke-width="2" stroke-linejoin="round"/><path d="M13 16h14" stroke="#F2A7B8" stroke-width="3"/>`),
    wings:S2(`<path d="M20 20C14 6 2 6 4 16c2 8 10 8 16 4zM20 20C26 6 38 6 36 16c-2 8-10 8-16 4z" fill="#A8D2EE" stroke="#3F6E92" stroke-width="1.8"/><path d="M20 22c-4 6-10 12-8 14s6-4 8-14zM20 22c4 6 10 12 8 14s-6-4-8-14z" fill="#C9E4F6" stroke="#3F6E92" stroke-width="1.6"/>`),
    spool:S2(`<rect x="10" y="5" width="20" height="5" rx="2" fill="#C98E6E"/><rect x="12" y="10" width="16" height="20" fill="#E86CA8"/><path d="M12 14h16M12 19h16M12 24h16" stroke="#fff" stroke-opacity=".5"/><rect x="10" y="30" width="20" height="5" rx="2" fill="#C98E6E"/>`),
    button:S2(`<circle cx="20" cy="20" r="13" fill="#F6E08A" stroke="#B88F33" stroke-width="2.4"/>${[[16,16],[24,16],[16,24],[24,24]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#B88F33"/>`).join("")}`),
    scissors:S2(`<circle cx="12" cy="30" r="5" fill="none" stroke="#8C7D9E" stroke-width="2.6"/><circle cx="28" cy="30" r="5" fill="none" stroke="#8C7D9E" stroke-width="2.6"/><path d="M14 26L28 6M26 26L12 6" stroke="#8C7D9E" stroke-width="2.6" stroke-linecap="round"/>`),
    needle:S2(`<path d="M8 34L32 6" stroke="#8C7D9E" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="30" cy="8" rx="1.6" ry="3" transform="rotate(40 30 8)" fill="#fff" stroke="#8C7D9E"/><path d="M30 8c6 6-10 14-4 22" stroke="#E86CA8" stroke-width="1.8" fill="none"/>`),
    tape:S2(`<circle cx="18" cy="18" r="12" fill="#F6E08A" stroke="#B88F33" stroke-width="2.4"/><circle cx="18" cy="18" r="4" fill="#FBF6E8" stroke="#B88F33" stroke-width="2"/><path d="M28 24h10v8H22" fill="#FBF0C8" stroke="#B88F33" stroke-width="2"/>`),
    iron:S2(`<path d="M6 30c0-10 8-16 20-16h8v16z" fill="#A8D2EE" stroke="#3F6E92" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 14c0-6 4-8 10-8h4" stroke="#3F6E92" stroke-width="2.4" fill="none"/>`),
    mirror:S2(`<ellipse cx="20" cy="17" rx="11" ry="14" fill="#DCEEF6" stroke="#9C6E82" stroke-width="2.4"/><path d="M15 10l5 12" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M20 31v6M14 37h12" stroke="#9C6E82" stroke-width="2.4"/>`),
    sketch:S2(`<rect x="7" y="6" width="24" height="28" rx="2" fill="#FBF6E8" stroke="#8C7D66" stroke-width="2"/><path d="M15 12c-3 6-4 12-5 16h12c-1-4-2-10-5-16z" fill="none" stroke="#8E5A9E" stroke-width="1.8"/>`),
    light:S2(`<path d="M14 6h12l4 14H10z" fill="#3E3A44" stroke="#1E1A24" stroke-width="2"/><path d="M10 20l-4 16h28l-4-16z" fill="#FFF3B0" opacity=".8"/>`),
    camera:S2(`<rect x="5" y="12" width="30" height="20" rx="4" fill="#A8D2EE" stroke="#3F6E92" stroke-width="2.4"/><circle cx="20" cy="22" r="6" fill="#3E4C7A" stroke="#FBF6E8" stroke-width="2"/><rect x="14" y="7" width="12" height="6" rx="2" fill="#7EB2D6"/>`),
    curtain:S2(`<path d="M4 4h32v4H4z" fill="#7A2236"/><path d="M4 8h14c-2 10 0 20 2 28H4zM36 8H22c2 10 0 20-2 28h16z" fill="#C8425A" stroke="#7A2236" stroke-width="1.6"/>`)
  };
  // بطاقة قماش صغيرة: لون + نقشة
  function fcard(c1, c2, pat, size=64){
    const u = A.uid(), base = A.col(c1);
    return `<svg viewBox="0 0 60 60" width="${size}" height="${size}" class="fgx-fc"><defs>${pat&&pat!=="none"?A.patternDef(u, pat, A.col(c2), .7):""}</defs><path d="M6 10q24-8 48 0v40q-24 8-48 0z" fill="${base}" stroke="${A.shade(base,-.35)}" stroke-width="2"/>${pat&&pat!=="none"?`<path d="M6 10q24-8 48 0v40q-24 8-48 0z" fill="url(#${u})"/>`:""}<path d="M6 10q24-8 48 0v40q-24 8-48 0z" fill="none" stroke="${A.shade(base,-.35)}" stroke-width="2"/><path d="M12 14q18-5 36 0" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/></svg>`;
  }
  const cname = k => A.COLORS[k][1], pname = k => A.PATTERNS[k];
  const solList = items => `<ol class="fgx-sol">${items.map(x=>`<li>${x}</li>`).join("")}</ol>`;
  const bump = el => { el.classList.remove("no"); void el.offsetWidth; el.classList.add("no"); };

  /* ======================================================
     1) لغز الإلهام — المشغل
     ====================================================== */
  const IDEAS = [
    {n:"ليلة النجوم", cl:["moon","star","owl"], c1:"navy", c2:"gold", pat:"stars"},
    {n:"حديقة الورد", cl:["flower","leaf","sun"], c1:"rose", c2:"sage", pat:"roses"},
    {n:"بحر الصدف", cl:["wave","shell","fish"], c1:"ocean", c2:"white", pat:"waves"},
    {n:"سما الغيوم", cl:["cloud","bird","sun"], c1:"sky", c2:"white", pat:"clouds"},
    {n:"غابة الخريف", cl:["leaf","acorn","mushroom"], c1:"mocha", c2:"honey", pat:"leaves"},
    {n:"حفلة الحلويات", cl:["candy","balloon","gift"], c1:"fuchsia", c2:"lemon", pat:"dots"},
    {n:"رقصة الفراشات", cl:["butterfly","flower","sun"], c1:"lilac", c2:"coral", pat:"butterflies"},
    {n:"شتاء الثلج", cl:["snow","moon","heart"], c1:"white", c2:"sky", pat:"stars"},
    {n:"أغنية حلوة", cl:["note","heart","bird"], c1:"lemon", c2:"plum", pat:"notes"}
  ];
  G("inspire", {title:"لغز الإلهام", art:()=>CL.sketch, rw:["c:ruby","p:hearts","c:gold"], bg:"linear-gradient(180deg,#FFF6EE,#F7E1EA)",
    how:"كل فكرة تبدأ من أشياء صغيرة. شوفي الأيقونات، وخمني الفكرة، واختاري القماش اللي يناسبها.",
    run(ctx){
      const lv=ctx.level, n=[3,4,5][lv], k=[3,4,4][lv], maxM=[3,2,2][lv];
      const rounds = mix(IDEAS).slice(0,n); let i=0, miss=0;
      const box = h(`<div class="fgx fgx-insp"></div>`); ctx.layer.appendChild(box);
      const draw = () => { const r=rounds[i];
        const others = mix(IDEAS.filter(x=>x!==r)).slice(0,k-1); const opts = mix([r, ...others]);
        box.innerHTML = `<div class="fgx-clues">${(lv===2?r.cl.slice(0,2):r.cl).map(c=>`<span>${CL[c]}</span>`).join("")}</div><p class="fgx-q">شنو الفكرة؟ اختاري القماش المناسب</p><div class="fgx-opts">${opts.map(o=>`<button data-n="${o.n}" aria-label="${cname(o.c1)} و${pname(o.pat)}">${fcard(o.c1,o.c2,o.pat,70)}<small>${lv===0?o.n:cname(o.c1)}</small></button>`).join("")}</div>`;
        ctx.stat(`الفكرة ${i+1} من ${n}`);
        $$("[data-n]",box).forEach(b=>b.onclick=()=>{ if(b.dataset.n===r.n){ ctx.sfx("pick"); b.classList.add("ok"); ctx.say("صح! "+r.n); i++; setTimeout(()=>{ if(!ctx.running) return; i>=n ? ctx.win("أفكارج حلوة!", miss===0?3:miss===1?2:1) : draw(); }, 650); }
          else { miss++; ctx.sfx("nope"); bump(b); b.disabled=true; ctx.say("قريبة… فكري بالأيقونات مرة ثانية"); if(miss>=maxM) ctx.fail("الأفكار تحتاج وقت، وهذا طبيعي", solList(rounds.map(x=>`${x.cl.map(c=>`<span class="fgx-ic">${CL[c]}</span>`).join("")} ← ${x.n}: ${cname(x.c1)} + ${pname(x.pat)}`))); } });
      };
      draw();
    }});

  /* ======================================================
     2) البحث عن القماش — قاعة الأقمشة
     ====================================================== */
  G("hunt", {title:"البحث عن القماش", art:()=>CL.spool, rw:["c:turquoise","p:clouds",null], bg:"linear-gradient(180deg,#FFF8EA,#F3E6D2)",
    how:"الفراشة الخيّاطة تحتاج أقمشة معينة. دوري عليها بالرفوف. بالتحدي الرفوف تتبدل كل شوية.",
    run(ctx){
      const lv=ctx.level, need=[3,5,6][lv], cells=[9,12,16][lv], maxM=[6,4,3][lv];
      const cols=["rose","sky","lemon","mint","lilac","coral","ocean","sage","honey","cream"], pats=["none","dots","stripes","daisies","stars","clouds","hearts","leaves"];
      let bolts=[], target=null, got=0, miss=0, sh=null;
      const box = h(`<div class="fgx fgx-hunt"><div class="fgx-want"></div><div class="fgx-shelf" style="--n:${Math.sqrt(cells)|0}"></div></div>`); ctx.layer.appendChild(box);
      const gen = () => { const set=new Set(); bolts=[]; while(bolts.length<cells){ const b={c:pick(cols), p:pick(pats)}; const key=b.c+b.p; if(!set.has(key)){ set.add(key); bolts.push(b); } } };
      const want = () => { target = pick(bolts); $(".fgx-want",box).innerHTML = `<span>دوري على:</span>${lv===0?fcard(target.c,"white",target.p,46):""}<b>${cname(target.c)}${target.p!=="none"?" بنقشة "+pname(target.p):" سادة"}</b>`; ctx.stat(`لگيتي ${got} من ${need}`); };
      const draw = () => { $(".fgx-shelf",box).innerHTML = bolts.map((b,i)=>`<button data-i="${i}" aria-label="${cname(b.c)} ${pname(b.p)}">${fcard(b.c,"white",b.p,52)}</button>`).join(""); };
      gen(); draw(); want();
      $(".fgx-shelf",box).onclick = e => { const b=e.target.closest("[data-i]"); if(!b) return; const x=bolts[+b.dataset.i];
        if(x.c===target.c && x.p===target.p){ got++; ctx.sfx("pick"); b.classList.add("ok"); ctx.say("هذا هو!"); if(got>=need){ clearInterval(sh); ctx.win("الفراشة فرحانة بالأقمشة!", miss===0?3:miss<3?2:1); return; } setTimeout(()=>{ if(!ctx.running) return; if(lv===2){ gen(); draw(); } want(); }, 450); }
        else { miss++; ctx.sfx("nope"); bump(b); ctx.say(`هذا ${cname(x.c)}${x.p!=="none"?" "+pname(x.p):""}… دوري مرة ثانية`); if(miss>=maxM){ clearInterval(sh); ctx.fail("الرفوف مليانة، والعين تتعب", `<p>كان المطلوب: <b>${cname(target.c)} ${target.p!=="none"?"بنقشة "+pname(target.p):"سادة"}</b></p>${fcard(target.c,"white",target.p,60)}<p>نصيحة: دوري باللون أول، وبعدين النقشة.</p>`); } } };
      if(lv===2) sh = setInterval(()=>{ if(ctx.paused||!ctx.running) return; const t=target; gen(); if(!bolts.some(b=>b.c===t.c&&b.p===t.p)) bolts[Math.floor(Math.random()*cells)]=t; draw(); ctx.say("الرفوف تبدلت!"); }, 7000);
      return () => clearInterval(sh);
    }});

  /* ======================================================
     3) رتّبي مراحل التصميم — المشغل
     ====================================================== */
  const STEPS = [["sketch","فكرة ورسمة بالدفتر"],["tape","أخذ القياس"],["scissors","قص القماش"],["needle","خياطة القطع"],["flower","التطريز والزينة"],["iron","الكوي"],["mirror","التجربة بالمراية"],["light","العرض على المسرح"]];
  G("steps", {title:"رتّبي مراحل التصميم", art:()=>CL.scissors, rw:["c:peach","p:checks",null], bg:"linear-gradient(180deg,#F8F1FF,#EFE6F7)",
    how:"كل فستان يمر بمراحل. اضغطي على البطاقات حسب الترتيب الصحيح من البداية للنهاية.",
    run(ctx){
      const lv=ctx.level, n=[4,6,8][lv], maxM=3;
      const idx = lv===0 ? [0,2,3,6] : lv===1 ? [0,1,2,3,5,6] : [0,1,2,3,4,5,6,7];
      const steps = idx.map(i=>STEPS[i]); let at=0, miss=0;
      const box = h(`<div class="fgx fgx-steps"><div class="fgx-line">${steps.map((_,i)=>`<span class="fgx-slot">${i+1}</span>`).join("")}</div><div class="fgx-cards">${mix(steps.map((s,i)=>({s,i}))).map(({s,i})=>`<button data-i="${i}"><span>${CL[s[0]]}</span><small>${s[1]}</small></button>`).join("")}</div></div>`);
      ctx.layer.appendChild(box); ctx.stat(`المرحلة 1 من ${n}`);
      $(".fgx-cards",box).onclick = e => { const b=e.target.closest("[data-i]"); if(!b || b.disabled) return;
        if(+b.dataset.i===at){ ctx.sfx("pick"); b.disabled=true; b.classList.add("ok"); const sl=$$(".fgx-slot",box)[at]; sl.innerHTML=CL[steps[at][0]]; sl.classList.add("on"); at++; ctx.stat(`المرحلة ${Math.min(at+1,n)} من ${n}`); ctx.say(steps[at-1][1]+" ✓"); if(at>=n) setTimeout(()=>ctx.win("الفستان جاهز للعرض!", miss===0?3:miss===1?2:1), 400); }
        else { miss++; ctx.sfx("nope"); bump(b); ctx.say("مو هسه… شنو يصير قبلها؟"); if(miss>=maxM) ctx.fail("الترتيب يحتاج تفكير", solList(steps.map(s=>`<span class="fgx-ic">${CL[s[0]]}</span> ${s[1]}`))); } };
    }});

  /* ======================================================
     4) طابقي النقشة — قاعة الأقمشة
     ====================================================== */
  G("patmatch", {title:"طابقي النقشة", art:()=>CL.button, rw:["p:stars","p:waves",null], bg:"linear-gradient(180deg,#F1F8F4,#DDEFE4)",
    how:"الشريط ماشي على نظام. شوفي شلون يتكرر، واختاري القطعة اللي تكمّله.",
    run(ctx){
      const lv=ctx.level, n=[4,5,6][lv], k=[3,4,4][lv], maxM=[3,3,2][lv];
      const cols=["rose","sky","lemon","mint","lilac","coral"], pats=["none","dots","stripes","daisies"];
      let r=0, miss=0, seq, ans;
      const box = h(`<div class="fgx fgx-pat"></div>`); ctx.layer.appendChild(box);
      const make = () => {
        const a=pick(cols), b=pick(cols.filter(x=>x!==a)), c=pick(cols.filter(x=>x!==a&&x!==b)), p1=pick(pats), p2=pick(pats.filter(x=>x!==p1)), p3=pick(pats);
        let rule;
        if(lv===0) rule = i => [{c:a,p:p1},{c:b,p:p2}][i%2];
        else if(lv===1) rule = pick([i=>[{c:a,p:p1},{c:b,p:p1},{c:c,p:p1}][i%3], i=>[{c:a,p:p1},{c:a,p:p1},{c:b,p:p2}][i%3], i=>[{c:a,p:p2},{c:b,p:p2},{c:b,p:p2}][i%3]]);
        else rule = i => ({c:[a,b][i%2], p:[p1,p2,p3][i%3]});
        const len = lv===2 ? 6 : 5; seq = Array.from({length:len},(_,i)=>rule(i)); ans = rule(len);
        const opts=[ans]; while(opts.length<k){ const o={c:pick([a,b,c]), p:pick([p1,p2,p3])}; if(!opts.some(x=>x.c===o.c&&x.p===o.p)) opts.push(o); }
        box.innerHTML = `<div class="fgx-strip">${seq.map(s=>fcard(s.c,"white",s.p,48)).join("")}<span class="fgx-q2">؟</span></div><div class="fgx-opts">${mix(opts).map(o=>`<button data-c="${o.c}" data-p="${o.p}">${fcard(o.c,"white",o.p,64)}</button>`).join("")}</div>`;
        ctx.stat(`الشريط ${r+1} من ${n}`);
      };
      make();
      box.onclick = e => { const b=e.target.closest("[data-c]"); if(!b) return;
        if(b.dataset.c===ans.c && b.dataset.p===ans.p){ ctx.sfx("pick"); b.classList.add("ok"); $(".fgx-q2",box).innerHTML=fcard(ans.c,"white",ans.p,48); r++; setTimeout(()=>{ if(!ctx.running) return; r>=n ? ctx.win("عينج حادة بالنقشات!", miss===0?3:miss===1?2:1) : make(); }, 650); }
        else { miss++; ctx.sfx("nope"); bump(b); ctx.say("اقري الشريط من أوله: شنو يتكرر؟"); if(miss>=maxM) ctx.fail("النقشات أحياناً تخدع", `<p>القطعة الصحيحة كانت:</p>${fcard(ans.c,"white",ans.p,60)}<p>${cname(ans.c)}${ans.p!=="none"?" بنقشة "+pname(ans.p):" سادة"} — لأن الشريط يرجع يعيد نفس الترتيب.</p>`); } };
    }});

  /* ======================================================
     5) سر الجناح — ورشة الأجنحة
     ====================================================== */
  G("wingsecret", {title:"سر الجناح", art:()=>CL.wings, rw:["p:constellation","c:pearl",null], bg:"linear-gradient(180deg,#EEF4FF,#E2DAF4)",
    how:"الجناحين لازم يكونون مثل المراية. اضغطي على مربعات الجناح اليمين حتى تصير نسخة معكوسة من اليسار، وبعدين «تحقّقي».",
    run(ctx){
      const lv=ctx.level, N=[3,4,5][lv], dots=[3,5,7][lv], rounds=[2,3,3][lv], maxM=3;
      let r=0, miss=0, L, R;
      const box = h(`<div class="fgx fgx-wing"><div class="fgx-wings"><div class="fgx-wl"></div><span class="fgx-body"></span><div class="fgx-wr"></div></div><button class="btn honey" data-check>تحقّقي</button></div>`); ctx.layer.appendChild(box);
      const make = () => { L = Array(N*N).fill(0); let c=0; while(c<dots){ const i=Math.floor(Math.random()*N*N); if(!L[i]){ L[i]=1; c++; } } R = Array(N*N).fill(0); draw(); ctx.stat(`الجناح ${r+1} من ${rounds}`); };
      const grid = (arr, cls, click) => `<div class="fgx-g ${cls}" style="--n:${N}">${arr.map((v,i)=>`<${click?"button":"span"} data-i="${i}" class="${v?"on":""}" ${click?`aria-label="مربع ${i+1}" aria-pressed="${!!v}"`:""}></${click?"button":"span"}>`).join("")}</div>`;
      const draw = () => { $(".fgx-wl",box).innerHTML = grid(L,"l",false); $(".fgx-wr",box).innerHTML = grid(R,"r",true); };
      const mirror = i => { const row=Math.floor(i/N), col=i%N; return row*N + (N-1-col); };
      make();
      $(".fgx-wr",box).onclick = e => { const b=e.target.closest("[data-i]"); if(!b) return; const i=+b.dataset.i; R[i]=R[i]?0:1; b.classList.toggle("on", !!R[i]); b.setAttribute("aria-pressed", !!R[i]); ctx.sfx("soft"); };
      $("[data-check]",box).onclick = () => {
        const ok = L.every((v,i)=>R[mirror(i)]===v);
        if(ok){ ctx.sfx("ok"); r++; ctx.say("الجناحين متطابقين!"); if(r>=rounds){ ctx.win("سر الجناح انكشف!", miss===0?3:miss===1?2:1); return; } setTimeout(()=>{ if(ctx.running) make(); }, 600); }
        else { miss++; ctx.sfx("nope"); $$(".fgx-wr [data-i]",box).forEach(b=>{ const i=+b.dataset.i; const want=L[mirror(i)]; if(!!R[i]!==!!want) bump(b); }); ctx.say("بعض المربعات مو بمكانها — المراية تقلب اليمين واليسار."); if(miss>=maxM){ const sol=Array(N*N).fill(0); L.forEach((v,i)=>{ if(v) sol[mirror(i)]=1; }); ctx.fail("المرايات تلخبط أحياناً", `<div class="fgx-wings sm"><div>${grid(L,"l",false)}</div><span class="fgx-body"></span><div>${grid(sol,"r",false)}</div></div><p>كل نقطة بالجناح اليسار تنعكس بنفس السطر، بس من الجهة الثانية.</p>`); } }
      };
    }});

  /* ======================================================
     6) تحدي الألوان (مزج الصبغة) — قاعة الأقمشة
     ====================================================== */
  const DYES = {red:["#E0566E","أحمر"], yellow:["#F6E08A","أصفر"], blue:["#5E9BC9","أزرق"], white:["#FFFFFF","أبيض"], green:["#7FC07F","أخضر"], dark:["#3E3A44","غامق"]};
  const mixHex = (a,b) => { const p=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)); const A_=p(a), B=p(b); return "#"+A_.map((v,i)=>Math.round((v+B[i])/2).toString(16).padStart(2,"0")).join(""); };
  G("dye", {title:"تحدي الألوان", art:()=>CL.balloon, rw:["c:plum","c:lavender","c:apricot"], bg:"linear-gradient(180deg,#FFF4F0,#F6E2DA)",
    how:"بالقِدر لون مطلوب. اختاري صبغتين، ونخلطهن سوا. إذا طلع نفس اللون، القماش ينصبغ!",
    run(ctx){
      const lv=ctx.level, keys=[["red","yellow","blue","white"],["red","yellow","blue","white","green"],["red","yellow","blue","white","green","dark"]][lv], n=[3,4,5][lv], maxM=[3,3,2][lv];
      let r=0, miss=0, sel=[], tgt;
      const box = h(`<div class="fgx fgx-dye"><div class="fgx-pots"><div class="fgx-pot"><small>المطلوب</small><i data-t></i></div><div class="fgx-pot"><small>خلطتج</small><i data-m></i></div></div><div class="fgx-dyes">${keys.map(k=>`<button data-k="${k}" style="--c:${DYES[k][0]}" aria-label="${DYES[k][1]}"><i></i><small>${DYES[k][1]}</small></button>`).join("")}</div></div>`); ctx.layer.appendChild(box);
      const make = () => { const a=pick(keys); let b=pick(keys.filter(x=>x!==a)); tgt={a,b,hex:mixHex(DYES[a][0],DYES[b][0])}; $("[data-t]",box).style.background=tgt.hex; $("[data-m]",box).style.background="transparent"; sel=[]; $$("[data-k]",box).forEach(x=>x.setAttribute("aria-pressed","false")); ctx.stat(`القِدر ${r+1} من ${n}`); };
      make();
      $(".fgx-dyes",box).onclick = e => { const b=e.target.closest("[data-k]"); if(!b || sel.includes(b.dataset.k)) return; sel.push(b.dataset.k); b.setAttribute("aria-pressed","true"); ctx.sfx("soft");
        if(sel.length===1){ $("[data-m]",box).style.background=DYES[sel[0]][0]; return; }
        const hx = mixHex(DYES[sel[0]][0], DYES[sel[1]][0]); $("[data-m]",box).style.background=hx;
        const ok = (sel[0]===tgt.a&&sel[1]===tgt.b)||(sel[0]===tgt.b&&sel[1]===tgt.a);
        if(ok){ ctx.sfx("ok"); ctx.say("نفس اللون بالضبط!"); r++; setTimeout(()=>{ if(!ctx.running) return; r>=n ? ctx.win("صرتي خبيرة صبغ!", miss===0?3:miss===1?2:1) : make(); }, 800); }
        else { miss++; ctx.sfx("nope"); ctx.say("قريب! شوفي الفرق: أفتح؟ أغمق؟ أحمر أكثر؟"); if(miss>=maxM){ ctx.fail("الألوان تحب التجربة", `<p>اللون المطلوب يطلع من: <b>${DYES[tgt.a][1]}</b> + <b>${DYES[tgt.b][1]}</b></p><div class="fgx-pots"><i style="background:${DYES[tgt.a][0]}"></i>+<i style="background:${DYES[tgt.b][0]}"></i>=<i style="background:${tgt.hex}"></i></div>`); return; } setTimeout(()=>{ if(!ctx.running) return; sel=[]; $$("[data-k]",box).forEach(x=>x.setAttribute("aria-pressed","false")); $("[data-m]",box).style.background="transparent"; }, 900); } };
    }});

  /* ======================================================
     7) جهّزي العرض (وقت لطيف) — الكواليس
     ====================================================== */
  const PREP_ITEMS = ["bow","shoe","crown","wings","pearls","flower"];
  const PREP_N = {bow:"فيونكة", shoe:"حذاء", crown:"تاج", wings:"جناح", pearls:"لؤلؤ", flower:"وردة"};
  G("prep", {title:"جهّزي العرض", art:()=>CL.curtain, rw:["c:navy","c:silver",null], bg:"linear-gradient(180deg,#3E2A4E,#5E4A7E)",
    how:"كل مراية تطلب قطعة. اضغطي القطعة من الصينية، وبعدين اضغطي المراية اللي تحتاجها. الوقت هادي، وإذا طلب تأخر يتبدل بس.",
    run(ctx){
      const lv=ctx.level, need=[6,9,12][lv], T=[100,80,65][lv], pat=[14,11,8][lv];
      let left=T, done=0, sel=null;
      const st = [0,1,2].map(i=>({want:null, p:0}));
      const box = h(`<div class="fgx fgx-prep"><div class="fgx-time"><i></i></div><div class="fgx-mirrors">${st.map((_,i)=>`<button class="fgx-mir" data-m="${i}"><span class="fgx-bub"></span><span class="fgx-form">${CL.dress}</span><i class="fgx-pt"></i></button>`).join("")}</div><div class="fgx-tray">${PREP_ITEMS.map(k=>`<button data-it="${k}" aria-label="${PREP_N[k]}">${CL[k]}</button>`).join("")}</div></div>`);
      ctx.layer.appendChild(box);
      const ask = i => { st[i].want = pick(PREP_ITEMS.filter(k=>!st.some(s=>s.want===k))); st[i].p = pat; $(`[data-m="${i}"] .fgx-bub`,box).innerHTML = CL[st[i].want]; };
      st.forEach((_,i)=>ask(i));
      $(".fgx-tray",box).onclick = e => { const b=e.target.closest("[data-it]"); if(!b) return; sel=b.dataset.it; $$("[data-it]",box).forEach(x=>x.setAttribute("aria-pressed", x===b)); ctx.sfx("soft"); };
      $(".fgx-mirrors",box).onclick = e => { const b=e.target.closest("[data-m]"); if(!b) return; const i=+b.dataset.m;
        if(!sel){ ctx.say("اختاري قطعة من الصينية أول"); return; }
        if(sel===st[i].want){ done++; ctx.sfx("pick"); b.classList.remove("got"); void b.offsetWidth; b.classList.add("got"); ctx.say(PREP_N[sel]+" وصلت!"); sel=null; $$("[data-it]",box).forEach(x=>x.setAttribute("aria-pressed","false")); if(done>=need){ ctx.win("الكل جاهز! الستارة تنفتح", left>T*.4?3:left>T*.2?2:1); return; } ask(i); }
        else { ctx.sfx("nope"); bump(b); ctx.say(`هاي المراية تريد ${PREP_N[st[i].want]}`); } };
      ctx.loop(dt => {
        left -= dt; $(".fgx-time i",box).style.width = Math.max(0,left/T*100)+"%";
        st.forEach((s,i)=>{ s.p -= dt; $(`[data-m="${i}"] .fgx-pt`,box).style.width = Math.max(0,s.p/pat*100)+"%"; if(s.p<=0){ ask(i); ctx.say("ولا يهمج، الطلب تبدل"); } });
        ctx.stat(`جاهز ${done} من ${need}`);
        if(left<=0) ctx.fail(`وصلتي ${done} من ${need} — قريب كلش!`, `<p>نصيحة: شوفي المراية اللي شريطها قرب يخلص، وابدي بيها. واختاري القطعة قبل لا تضغطين المراية.</p>`);
      });
    }});

  /* ======================================================
     8) رتّبي فقرات العرض — الكواليس
     ====================================================== */
  const SEGS = [["curtain","افتتاح الستارة"],["flower","فقرة الربيع"],["cloud","فقرة الغيوم"],["moon","فقرة الليل"],["wings","فقرة الأجنحة"],["star","الختام الكبير"]];
  G("segments", {title:"رتّبي فقرات العرض", art:()=>CL.note, rw:["c:mocha","p:leaves",null], bg:"linear-gradient(180deg,#FFF3E6,#F2DCC8)",
    how:"اقري ملاحظات الأرنب، ورتبي الفقرات بالأسهم. بعدين «تحقّقي».",
    run(ctx){
      const lv=ctx.level, n=[4,5,6][lv], maxM=3;
      const ids = lv===0 ? [0,1,2,5] : lv===1 ? [0,1,2,3,5] : [0,1,2,3,4,5];
      const rules = ["الافتتاح دايماً أول، والختام الكبير آخر شي","الربيع قبل الغيوم (الصبح قبل الظهر)"].concat(lv>=1?["الليل بعد الغيوم"]:[]).concat(lv>=2?["الأجنحة مباشرة بعد الليل"]:[]);
      let order = mix(ids); while(order.every((v,i)=>v===ids[i])) order = mix(ids);
      let miss=0;
      const box = h(`<div class="fgx fgx-seg"><ul class="fgx-rules">${rules.map(r=>`<li>${r}</li>`).join("")}</ul><ol class="fgx-list"></ol><button class="btn honey" data-check>تحقّقي</button></div>`); ctx.layer.appendChild(box);
      const draw = () => { $(".fgx-list",box).innerHTML = order.map((id,i)=>`<li data-i="${i}"><span class="fgx-ic">${CL[SEGS[id][0]]}</span><b>${SEGS[id][1]}</b><span class="fgx-ud"><button data-up="${i}" aria-label="لفوق" ${i===0?"disabled":""}>${IC.up}</button><button data-dn="${i}" aria-label="لجوّا" ${i===order.length-1?"disabled":""}>${IC.down}</button></span></li>`).join(""); };
      draw(); ctx.stat(`${n} فقرات`);
      $(".fgx-list",box).onclick = e => { const u=e.target.closest("[data-up]"), d=e.target.closest("[data-dn]"); if(u){ const i=+u.dataset.up; [order[i-1],order[i]]=[order[i],order[i-1]]; } else if(d){ const i=+d.dataset.dn; [order[i+1],order[i]]=[order[i],order[i+1]]; } else return; ctx.sfx("soft"); draw(); };
      $("[data-check]",box).onclick = () => { const ok = order.every((v,i)=>v===ids[i]);
        if(ok){ ctx.win("برنامج العرض مرتب!", miss===0?3:miss===1?2:1); }
        else { miss++; ctx.sfx("nope"); const wrong = order.findIndex((v,i)=>v!==ids[i]); bump($$(".fgx-list li",box)[wrong]); ctx.say(`الفقرة رقم ${wrong+1} مو بمكانها. ارجعي للملاحظات.`); if(miss>=maxM) ctx.fail("الترتيب صعب شوية", solList(ids.map(id=>`<span class="fgx-ic">${CL[SEGS[id][0]]}</span> ${SEGS[id][1]}`))); } };
    }});

  /* ======================================================
     9) ذاكرة الأزياء — المتحف
     ====================================================== */
  const MEM = ["bow","crown","flower","star","pearls","dress","wings","shoe","button","spool"];
  G("memory", {title:"ذاكرة الأزياء", art:()=>CL.crown, rw:["c:aqua","p:notes",null], bg:"linear-gradient(180deg,#F4EEFA,#E6DCF2)",
    how:"اقلبي بطاقتين كل مرة ولگي الأزواج المتشابهة. بالتحدي عدد المحاولات محدود.",
    run(ctx){
      const lv=ctx.level, pairs=[4,6,8][lv], lim=[0,0,24][lv];
      const cards = mix(mix(MEM).slice(0,pairs).flatMap(k=>[k,k]));
      let open=[], found=0, moves=0, lock=false;
      const box = h(`<div class="fgx fgx-mem" style="--c:${pairs>6?4:4}">${cards.map((k,i)=>`<button data-i="${i}" aria-label="بطاقة"><span class="b">${CL.spool}</span><span class="f">${CL[k]}</span></button>`).join("")}</div>`); ctx.layer.appendChild(box);
      const upd = () => ctx.stat(`أزواج ${found}/${pairs} · محاولات ${moves}${lim?" من "+lim:""}`); upd();
      box.onclick = e => { const b=e.target.closest("[data-i]"); if(!b || lock || b.classList.contains("up")) return; b.classList.add("up"); b.setAttribute("aria-label", "بطاقة مقلوبة"); open.push(b); ctx.sfx("soft");
        if(open.length===2){ moves++; const [x,y]=open; lock=true;
          if(cards[+x.dataset.i]===cards[+y.dataset.i]){ found++; x.classList.add("done"); y.classList.add("done"); open=[]; lock=false; ctx.sfx("pick"); upd(); if(found>=pairs) ctx.win("ذاكرتج مثل المتحف!", moves<=pairs+3?3:moves<=pairs*2?2:1); }
          else { upd(); setTimeout(()=>{ x.classList.remove("up"); y.classList.remove("up"); open=[]; lock=false; if(lim && moves>=lim && found<pairs) ctx.fail("المحاولات خلصت", `<p>نصيحة: اقلبي بطاقة جديدة أول، وإذا ما تذكرين زوجها، اقلبي وحدة شفتيها قبل.</p>`); }, 750); } } };
    }});

  /* ======================================================
     10) الفروقات — استوديو الصور
     ====================================================== */
  const ZONES = {head:{x:56,y:9,n:"إكسسوار الراس"}, neck:{x:49,y:40,n:"الرقبة"}, sleeve:{x:30,y:42,n:"الأكمام"}, waist:{x:48,y:52.5,n:"الحزام"}, skirt:{x:46,y:67,n:"نقشة التنورة"}, hem:{x:46,y:86,n:"الحافة"}, wings:{x:14,y:24,n:"الجناح"}};
  G("diff", {title:"الفروقات", art:()=>CL.camera, rw:["c:rosegold","p:chevron",null], bg:"linear-gradient(180deg,#EAF4FA,#D6E8F2)",
    how:"صورتين لنفس الإطلالة… بس أكو فروقات! اضغطي بالصورة اليمين على مكان الفرق.",
    run(ctx){
      const lv=ctx.level, n=[3,4,5][lv], maxM=[4,3,3][lv];
      const base = Object.assign(A.BLANK(), {c1:pick(["rose","sky","mint","lilac","lemon"]), c2:"cream", pat:"dots", head:"bow", neck:"pearls", belt:"ribbon", sleeve:"puff", hem:"scallop"});
      const bw = Object.assign(A.BLANK_WINGS(), {on:true, c1:"sky", c2:"lilac", size:.8});
      const other = JSON.parse(JSON.stringify(base)), ow = JSON.parse(JSON.stringify(bw));
      const zones = mix(Object.keys(ZONES)).slice(0,n);
      zones.forEach(z=>{ if(z==="head") other.head="tiara"; if(z==="neck") other.neck="none"; if(z==="sleeve") other.sleeve="cap"; if(z==="waist") other.belt="jewel"; if(z==="skirt") other.pat="stripes"; if(z==="hem") other.hem="zigzag"; if(z==="wings") ow.c1="coral"; });
      let found=[], miss=0;
      const box = h(`<div class="fgx fgx-diff"><div class="fgx-pic"><span>الأصلية</span><div class="fgx-dl">${A.dollHTML(base,bw,{anim:false})}</div></div><div class="fgx-pic"><span>دوري هنا</span><div class="fgx-dr">${A.dollHTML(other,ow,{anim:false})}${Object.entries(ZONES).map(([k,z])=>`<button class="fgx-z" data-z="${k}" style="left:${z.x}%;top:${z.y}%" aria-label="${z.n}"></button>`).join("")}</div></div></div>`);
      ctx.layer.appendChild(box); ctx.stat(`لگيتي 0 من ${n}`);
      $(".fgx-dr",box).onclick = e => { const b=e.target.closest("[data-z]"); if(!b || b.classList.contains("ok")) return; const z=b.dataset.z;
        if(zones.includes(z)){ found.push(z); b.classList.add("ok"); ctx.sfx("pick"); ctx.say("فرق: "+ZONES[z].n); ctx.stat(`لگيتي ${found.length} من ${n}`); if(found.length>=n) ctx.win("عين المصوّرة!", miss===0?3:miss<2?2:1); }
        else { miss++; ctx.sfx("nope"); bump(b); ctx.say("هنا نفس الشي بالصورتين"); if(miss>=maxM) ctx.fail("الفروقات صغيرة ومخبّاية", `<p>الفروقات كانت بـ:</p>${solList(zones.map(z=>ZONES[z].n))}`); } };
    }});

  /* ======================================================
     11) ركّبي الإطلالة (سحب) — غرفة القياس
     ====================================================== */
  G("dressup", {title:"ركّبي الإطلالة", art:()=>CL.dress, rw:["c:berry","p:roses",null], bg:"linear-gradient(180deg,#FFF0F4,#F4DCE6)",
    how:"شوفي بطاقة الإطلالة. اسحبي القطع الصحيحة على إيلاف (أو اضغطي القطعة وبعدين اضغطي على إيلاف).",
    run(ctx){
      const lv=ctx.level, slots=[["top","skirt","head"],["top","skirt","head","belt"],["top","skirt","head","belt","wings"]][lv], maxM=[5,4,3][lv];
      const cols=["rose","sky","lemon","mint","lilac","coral","ocean"], heads=["bow","flowers","tiara","star"], belts=["ribbon","sash","jewel","flower"], wsh=["butterfly","leaf","petal","cloud"];
      const T = {top:{c1:pick(cols), sleeve:pick(["puff","flutter","cap"])}, skirt:{c2:pick(cols), pat:pick(["none","dots","stripes","daisies"])}, head:{head:pick(heads)}, belt:{belt:pick(belts)}, wings:{shape:pick(wsh), c1:pick(cols)}};
      const tl = Object.assign(A.BLANK(), {type:"set", c1:T.top.c1, sleeve:T.top.sleeve, c2:T.skirt.c2, pat:T.skirt.pat, head:slots.includes("head")?T.head.head:"none", belt:slots.includes("belt")?T.belt.belt:"none"});
      const tw = Object.assign(A.BLANK_WINGS(), slots.includes("wings")?{on:true, shape:T.wings.shape, c1:T.wings.c1, c2:"white", size:.7}:{});
      let cur = Object.assign(A.BLANK(), {type:"set", c1:"white", c2:"white", sleeve:"cap", pat:"none", belt:"none"}), cw = A.BLANK_WINGS();
      // القطع: الصحيحة + بدائل
      const pieces = [];
      slots.forEach(s=>{ const right = T[s]; pieces.push({s, v:right, ok:true});
        const nAlt = lv===0?1:2; let tries=0;
        while(pieces.filter(p=>p.s===s).length < nAlt+1 && tries++<40){ let v;
          if(s==="top") v={c1:pick(cols), sleeve:pick(["puff","flutter","cap"])}; if(s==="skirt") v={c2:pick(cols), pat:pick(["none","dots","stripes","daisies"])};
          if(s==="head") v={head:pick(heads)}; if(s==="belt") v={belt:pick(belts)}; if(s==="wings") v={shape:pick(wsh), c1:pick(cols)};
          if(!pieces.some(p=>p.s===s && JSON.stringify(p.v)===JSON.stringify(v))) pieces.push({s, v, ok:false}); } });
      const tokArt = p => { const v=p.v;
        if(p.s==="top") return `<svg viewBox="0 0 40 40"><path d="M12 8h16l8 8-5 5-3-3v16H12V18l-3 3-5-5z" fill="${A.col(v.c1)}" stroke="${A.shade(A.col(v.c1),-.4)}" stroke-width="1.8" stroke-linejoin="round"/>${v.sleeve==="puff"?`<circle cx="8" cy="15" r="4" fill="${A.col(v.c1)}" stroke="${A.shade(A.col(v.c1),-.4)}"/><circle cx="32" cy="15" r="4" fill="${A.col(v.c1)}" stroke="${A.shade(A.col(v.c1),-.4)}"/>`:v.sleeve==="flutter"?`<path d="M4 16q4 6 8 2M36 16q-4 6-8 2" stroke="${A.shade(A.col(v.c1),-.4)}" fill="none"/>`:""}</svg>`;
        if(p.s==="skirt") return fcard(v.c2,"white",v.pat,40);
        if(p.s==="head") return CL[{bow:"bow",flowers:"flower",tiara:"crown",star:"star"}[v.head]];
        if(p.s==="belt") return `<svg viewBox="0 0 40 40"><rect x="2" y="16" width="36" height="8" rx="3" fill="${v.belt==="jewel"?"#D9AE4E":"#F2A7B8"}"/>${v.belt==="sash"?`<path d="M20 20C14 10 6 12 8 20 6 28 14 30 20 20z" fill="#F2A7B8"/>`:v.belt==="jewel"?`<path d="M20 13l5 7-5 7-5-7z" fill="#C9B6E8"/>`:v.belt==="flower"?CL.flower.replace("<svg",'<svg x="10" y="10" width="20" height="20"'):`<path d="M30 20c-4-6-8-4-6 0-2 4 2 6 6 0z" fill="#E86CA8"/>`}</svg>`;
        if(p.s==="wings") return `<svg viewBox="-10 -10 380 390">${A.wings(Object.assign(A.BLANK_WINGS(),{on:true, shape:v.shape, c1:v.c1, c2:"white", flap:"none", size:.62}),{anim:false})}</svg>`;
      };
      const box = h(`<div class="fgx fgx-dress"><div class="fgx-card"><small>المطلوب</small><div>${A.dollHTML(tl,tw,{anim:false})}</div></div><div class="fgx-model" aria-label="إيلاف — اسحبي القطع هنا"><div class="fgx-mdl">${A.dollHTML(cur,cw,{anim:false})}</div></div><div class="fgx-tray2">${mix(pieces).map((p,i)=>`<button class="fgx-tok" data-i="${pieces.indexOf(p)}" aria-label="قطعة">${tokArt(p)}</button>`).join("")}</div></div>`);
      ctx.layer.appendChild(box);
      const model = $(".fgx-model",box);
      let done=0, miss=0, selected=null;
      ctx.stat(`ركّبي ${slots.length} قطع`);
      const place = (tok) => { const p = pieces[+tok.dataset.i];
        if(p.ok){ tok.classList.add("used"); tok.disabled=true; done++; ctx.sfx("pick");
          if(p.s==="top") Object.assign(cur, {c1:p.v.c1, sleeve:p.v.sleeve}); if(p.s==="skirt") Object.assign(cur, {c2:p.v.c2, pat:p.v.pat}); if(p.s==="head") cur.head=p.v.head; if(p.s==="belt") cur.belt=p.v.belt; if(p.s==="wings") cw=Object.assign(A.BLANK_WINGS(),{on:true, shape:p.v.shape, c1:p.v.c1, c2:"white", size:.7});
          A.dollSet(model, cur, cw, {anim:false}); ctx.say("تمام!"); ctx.stat(`ركّبتي ${done} من ${slots.length}`);
          if(done>=slots.length) setTimeout(()=>ctx.win("الإطلالة نفس البطاقة!", miss===0?3:miss<3?2:1), 400); }
        else { miss++; ctx.sfx("nope"); bump(tok); ctx.say("هاي القطعة مو نفس البطاقة — قارني اللون والشكل"); if(miss>=maxM) ctx.fail("التركيب يحتاج دقة", `<p>البطاقة كانت:</p><div class="fgx-solmini">${A.dollHTML(tl,tw,{anim:false})}</div><p>قارني كل قطعة باللون والنقشة قبل لا تسحبين.</p>`); } };
      // سحب بالإصبع أو الماوس (بدون تعارض ويا التمرير)
      let drag=null;
      box.addEventListener("pointerdown", e => { const t=e.target.closest(".fgx-tok"); if(!t || t.disabled) return; e.preventDefault(); const r=t.getBoundingClientRect();
        drag={t, id:e.pointerId, sx:e.clientX, sy:e.clientY, ghost:null, moved:false, ox:e.clientX-r.left, oy:e.clientY-r.top}; try{ t.setPointerCapture(e.pointerId); }catch(_){} });
      box.addEventListener("pointermove", e => { if(!drag || e.pointerId!==drag.id) return; const dx=e.clientX-drag.sx, dy=e.clientY-drag.sy;
        if(!drag.moved && Math.hypot(dx,dy)>6){ drag.moved=true; const g=drag.t.cloneNode(true); g.classList.add("fgx-ghost"); g.style.width=drag.t.offsetWidth+"px"; document.body.appendChild(g); drag.ghost=g; drag.t.classList.add("lift"); }
        if(drag.ghost){ drag.ghost.style.left=(e.clientX-drag.ox)+"px"; drag.ghost.style.top=(e.clientY-drag.oy)+"px"; const r=model.getBoundingClientRect(); model.classList.toggle("over", e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom); } });
      const end = e => { if(!drag || e.pointerId!==drag.id) return; const d=drag; drag=null; model.classList.remove("over"); d.t.classList.remove("lift");
        if(d.ghost){ d.ghost.remove(); const r=model.getBoundingClientRect(); if(e.type==="pointerup" && e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom) place(d.t); }
        else if(e.type==="pointerup"){ selected = d.t; $$(".fgx-tok",box).forEach(x=>x.classList.toggle("sel", x===selected)); ctx.say("هسه اضغطي على إيلاف"); } };
      box.addEventListener("pointerup", end); box.addEventListener("pointercancel", end);
      model.addEventListener("click", () => { if(selected && !selected.disabled){ const s=selected; selected=null; s.classList.remove("sel"); place(s); } });
      return () => { $$(".fgx-ghost").forEach(g=>g.remove()); };
    }});

  /* ======================================================
     12) لمعة الكاميرا (رد فعل) — المسرح
     ====================================================== */
  G("reaction", {title:"لمعة الكاميرا", art:()=>CL.camera, rw:["c:night","c:lime",null], bg:"linear-gradient(180deg,#2E2F5E,#5E4A7E)",
    how:"إيلاف تتمشى على الممر. اضغطي «صوّري» لما توقف داخل الدائرة المضيئة.",
    run(ctx){
      const lv=ctx.level, need=[3,5,6][lv], sp=[16,22,28][lv], mw=[18,13,10][lv], maxM=[5,4,3][lv];
      const box = h(`<div class="fgx fgx-run"><div class="fgx-runway"><i class="fgx-mark"></i><div class="fgx-walker"></div></div><div class="fgx-flash"></div><button class="btn honey fgx-shoot" data-shoot>${FW.FI.camera} صوّري</button></div>`); ctx.layer.appendChild(box);
      const mark=$(".fgx-mark",box), wk=$(".fgx-walker",box);
      let x=10, dir=1, mx=0, got=0, miss=0;
      const setMark = () => { mx = 20 + Math.random()*60; mark.style.left=mx+"%"; mark.style.width=mw+"%"; };
      setMark();
      const dl = FW.doll(wk, FW.curLook(), FW.curWings(), {cls:"fgx-dw", tick:(dt,c)=>{}});
      ctx.loop(dt => { x += dir*sp*dt; if(x>92){ x=92; dir=-1; } if(x<8){ x=8; dir=1; } wk.style.left=x+"%"; dl.c.x += dir*sp*dt*1.4; dl.c.face=dir; wk.classList.toggle("fl", dir<0); ctx.stat(`صور ${got} من ${need}`); });
      $("[data-shoot]",box).onclick = () => { if(ctx.paused) return; const fl=$(".fgx-flash",box); fl.classList.remove("on"); void fl.offsetWidth; fl.classList.add("on");
        if(Math.abs(x-mx) <= mw/2){ got++; ctx.sfx("sparkle"); ctx.say("لقطة حلوة!"); dl.emo("happy",900); setMark(); if(got>=need) ctx.win("ألبوم كامل من اللقطات!", miss===0?3:miss<3?2:1); }
        else { miss++; ctx.sfx("soft"); ctx.say(x<mx?"بعدها شوية…":"فاتت شوية…"); if(miss>=maxM) ctx.fail("الكاميرا تحتاج صبر", `<p>نصيحة: لا تضغطين لما توصل للدائرة… اضغطي لما تصير بنصها بالضبط. راقبي اتجاه مشيها.</p>`); } };
      return () => dl.stop();
    }});

  /* ======================================================
     13) أنقذي العرض — الكواليس
     ====================================================== */
  const PROBS = [
    {q:"انفتق خيط بحافة الفستان!", a:["إبرة وخيط","مقص","شريط لاصق"], ok:0, why:"الإبرة والخيط يخيطون الحافة بهدوء."},
    {q:"الضوء طفى بالمسرح!", a:["نغني بالظلام","نشغل مفتاح الإضاءة الاحتياطي","نسكّر الستارة"], ok:1, why:"المسرح بيه مفتاح احتياطي لهيج مواقف."},
    {q:"الموسيقى وقفت فجأة!", a:["نشغل الأغنية الاحتياطية","نوقف العرض","نصفق بقوة"], ok:0, why:"دايماً نجهز أغنية ثانية احتياط."},
    {q:"الفيونكة ضاعت!", a:["نلغي الإطلالة","ندور بصندوق الإكسسوارات","نرسم فيونكة"], ok:1, why:"صندوق الإكسسوارات بيه كل الزينة."},
    {q:"العارضة متوترة شوية…", a:["نستعجلها","نگلها كلمة حلوة ونتنفس سوا","نخليها تنتظر"], ok:1, why:"الكلمة الحلوة والنفَس العميق يهدّون."},
    {q:"الجناح مايل!", a:["نعدل الحزام ورا","نشيل الجناح","نلزقه بالحايط"], ok:0, why:"الجناح مربوط بحزام صغير ورا، نعدله وخلص."},
    {q:"الستارة علگت!", a:["نسحبها بقوة","نخلي الأرنب يفك الحبل بهدوء","نقص الستارة"], ok:1, why:"الحبل يحتاج فك بهدوء، مو قوة."},
    {q:"بقعة صغيرة على الفستان!", a:["نخبّيها بوردة زينة","نلغي العرض","نلبس معطف شتوي"], ok:0, why:"وردة زينة تخلي البقعة جزء من التصميم!"}
  ];
  G("rescue", {title:"أنقذي العرض", art:()=>CL.needle, rw:["c:cherry","p:ribbons","p:shells"], bg:"linear-gradient(180deg,#FFF1EC,#F4D9D0)",
    how:"صارت مشاكل صغيرة قبل العرض! اختاري الحل الصحيح لكل مشكلة. بالمستوى المتوسط والتحدي أكو وقت لطيف.",
    run(ctx){
      const lv=ctx.level, n=[4,5,6][lv], T=[0,12,8][lv], maxM=[3,2,2][lv];
      const list = mix(PROBS).slice(0,n); let i=0, miss=0, t=T, wrong=[];
      const box = h(`<div class="fgx fgx-res"><div class="fgx-rab">${A.F.rabbit()}</div><div class="fgx-rq"></div>${T?`<div class="fgx-time"><i></i></div>`:""}<div class="fgx-ra"></div></div>`); ctx.layer.appendChild(box);
      const draw = () => { const p=list[i]; t=T; $(".fgx-rq",box).textContent=p.q; $(".fgx-ra",box).innerHTML = p.a.map((a,k)=>`<button data-k="${k}">${a}</button>`).join(""); ctx.stat(`مشكلة ${i+1} من ${n}`); };
      const next = () => { i++; if(i>=n){ ctx.win("العرض انقذ! أنتِ بطلة الكواليس", miss===0?3:miss===1?2:1); return; } draw(); };
      const wrongAns = (msg) => { miss++; wrong.push(list[i]); ctx.say(msg+" "+list[i].why); if(miss>=maxM){ ctx.fail("المشاكل كثيرة اليوم!", solList(list.map(p=>`${p.q} ← <b>${p.a[p.ok]}</b>`))); return true; } return false; };
      draw();
      $(".fgx-ra",box).onclick = e => { const b=e.target.closest("[data-k]"); if(!b) return; const p=list[i];
        if(+b.dataset.k===p.ok){ ctx.sfx("pick"); b.classList.add("ok"); ctx.say(p.why); setTimeout(()=>{ if(ctx.running) next(); }, 700); }
        else { ctx.sfx("nope"); bump(b); if(!wrongAns("مو هذا.")) setTimeout(()=>{ if(ctx.running) next(); }, 1200); } };
      if(T) ctx.loop(dt => { t -= dt; $(".fgx-time i",box).style.width=Math.max(0,t/T*100)+"%"; if(t<=0){ t=T; ctx.sfx("soft"); if(!wrongAns("الوقت خلص، ولا يهمج.")) next(); } });
    }});

  /* ======================================================
     مصمم صغير مشترك (تحدي الموضوع + ثلاث عناصر)
     ====================================================== */
  function miniDesigner(host, look, wings, groups, onChange){
    const el = h(`<div class="fgx-md"><div class="fgx-mprev">${A.dollHTML(look, wings, {anim:false})}</div><div class="fgx-mopts">${groups.map(g=>`<div class="fgx-mg"><h5>${g.t}</h5><div class="fgx-mc" data-g="${g.k}">${g.opts.map(([v,n,sw])=>`<button data-v="${v}" aria-pressed="${String(g.get())===String(v)}" ${sw?`style="--c:${sw}" class="sw"`:""} aria-label="${n}">${sw?"":n}</button>`).join("")}</div></div>`).join("")}</div></div>`);
    host.appendChild(el);
    el.addEventListener("click", e => { const b=e.target.closest("[data-v]"); if(!b) return; const g=groups.find(x=>x.k===b.closest("[data-g]").dataset.g); g.set(b.dataset.v); $$("button",b.parentNode).forEach(x=>x.setAttribute("aria-pressed", x===b)); A.dollSet($(".fgx-mprev",el), look, wings, {anim:false}); FW.sfx("soft"); onChange && onChange(); });
    return el;
  }
  const colorOpts = keys => keys.map(k=>[k, A.COLORS[k][1], A.COLORS[k][0]]);

  /* ======================================================
     14) تحدي الموضوع — ساحة المهرجان
     ====================================================== */
  const THEMES = [
    {n:"عرض الغيوم", req:[["لون أساسي فاتح", l=>A.lum(A.col(l.c1))>.78], ["نقشة غيوم أو نجوم", l=>["clouds","stars"].includes(l.pat)], ["جناح", (l,w)=>w.on], ["تنورة طويلة", l=>l.len==="long"]]},
    {n:"حفلة الحديقة", req:[["لون وردي أو أخضر", l=>["rose","blush","mint","sage","fuchsia"].includes(l.c1)], ["نقشة ورود أو أقحوان أو أوراق", l=>["roses","daisies","leaves"].includes(l.pat)], ["تاج ورد", l=>l.head==="flowers"], ["حزام", l=>l.belt!=="none"]]},
    {n:"سهرة النجوم", req:[["لون غامق", l=>A.lum(A.col(l.c1))<.4], ["نقشة نجوم أو كوكبات", l=>["stars","constellation"].includes(l.pat)], ["تاج صغير أو مشبك نجمة", l=>["tiara","star"].includes(l.head)], ["جناح", (l,w)=>w.on]]},
    {n:"يوم البحر", req:[["لون أزرق", l=>["sky","ocean","turquoise","navy","aqua"].includes(l.c1)], ["نقشة موج أو خطوط", l=>["waves","stripes"].includes(l.pat)], ["طول متوسط أو قصير", l=>l.len!=="long"], ["بدون جناح", (l,w)=>!w.on]]},
    {n:"عيد الألوان", req:[["لون دافي (أصفر، مرجاني، مشمشي)", l=>["lemon","honey","coral","peach","apricot","gold"].includes(l.c1)], ["نقشة نقاط أو قلوب", l=>["dots","hearts"].includes(l.pat)], ["فيونكة للراس", l=>l.head==="bow"], ["تنورة طويلة", l=>l.len==="long"]]}
  ];
  G("theme", {title:"تحدي الموضوع", art:()=>CL.star, rw:["c:seafoam","c:cocoa",null], bg:"linear-gradient(180deg,#FFF7E8,#F6E3C8)",
    how:"البومة تعطيج موضوع وشروط. صممي إطلالة تناسبها بالمصمم الصغير، وقدّميها للبومة.",
    run(ctx){
      const lv=ctx.level, k=[2,3,4][lv], maxM=3;
      const se = ctx.season && FShow.SEASONS[ctx.season];
      const th = se && se.challenge ? {n:se.n, req:se.challenge.slice(0,k)} : pick(THEMES);
      const req = th.req.slice(0,k);
      const look = Object.assign(A.BLANK(), {c1:"cream", c2:"white", pat:"none", head:"none", belt:"none", len:"midi"}), wings = Object.assign(A.BLANK_WINGS(), {on:false, size:.8});
      let tries=0;
      const box = h(`<div class="fgx fgx-theme fgx-scroll"><div class="fgx-brief"><span class="fgx-owl">${A.F.owl()}</span><div><b>${esc(th.n)}</b><ul>${req.map(r=>`<li>${r[0]}</li>`).join("")}</ul></div></div><div class="fgx-mdh"></div><button class="btn honey" data-sub>قدّمي للبومة</button> <button class="btn ghost small" data-keep>${IC.save} احفظي بالمتحف</button></div>`);
      ctx.layer.appendChild(box);
      miniDesigner($(".fgx-mdh",box), look, wings, [
        {t:"اللون الأساسي", k:"c1", opts:colorOpts(Object.keys(A.COLORS)), get:()=>look.c1, set:v=>look.c1=v},
        {t:"النقشة", k:"pat", opts:Object.keys(A.PATTERNS).filter(p=>p!=="scribble").map(p=>[p,A.PATTERNS[p]]), get:()=>look.pat, set:v=>look.pat=v},
        {t:"الطول", k:"len", opts:Object.entries(A.LENGTHS), get:()=>look.len, set:v=>look.len=v},
        {t:"للراس", k:"head", opts:Object.entries(A.HEAD_ACC), get:()=>look.head, set:v=>look.head=v},
        {t:"الحزام", k:"belt", opts:Object.entries(A.BELTS), get:()=>look.belt, set:v=>look.belt=v},
        {t:"الجناح", k:"w", opts:[["0","بدون"],["1","جناح"]], get:()=>wings.on?"1":"0", set:v=>wings.on=v==="1"}
      ]);
      $("[data-keep]",box).onclick = () => { const d=FW.saveDesign(look, wings, th.n); toast("انحفظت: "+d.name, "check"); };
      $("[data-sub]",box).onclick = () => { tries++; const res = req.map(r=>r[1](look, wings));
        $$(".fgx-brief li",box).forEach((li,i)=>li.className = res[i]?"ok":"no");
        if(res.every(Boolean)){ ctx.win(`البومة: «${th.n}» تمام التمام!`, tries===1?3:tries===2?2:1); }
        else { ctx.sfx("nope"); ctx.say(`هوو… ${res.filter(Boolean).length} من ${req.length}. شوفي الشروط اللي بدون علامة.`); if(tries>=maxM) ctx.fail("الموضوع يحتاج كم تجربة", solList(req.map(r=>r[0]))+`<p>كل شرط لازم يكون موجود بنفس الوقت.</p>`); } };
    }});

  /* ======================================================
     15) صممي من ثلاث عناصر — المشغل
     ====================================================== */
  G("three", {title:"صممي من ثلاث عناصر", art:()=>CL.flower, rw:["c:fuchsia","p:butterflies",null], bg:"linear-gradient(180deg,#F4FBF4,#E0F0E4)",
    how:"تطلع ثلاث عناصر عشوائية. صممي إطلالة بيها الثلاثة كلهم، والباقي على ذوقج! بالتحدي العناصر تختفي بعد ثواني.",
    run(ctx){
      const lv=ctx.level, maxM=3;
      const cs = mix(["rose","sky","lemon","mint","lilac","coral","ocean","honey","sage","cream"]).slice(0,7), ps = mix(["dots","stripes","daisies","stars","hearts","leaves","clouds"]).slice(0,5);
      const thirdKind = pick(["head","hem","sleeve"]);
      const tMap = {head:{t:"للراس", opts:Object.entries(A.HEAD_ACC).filter(([k])=>k!=="none")}, hem:{t:"الحافة", opts:Object.entries(A.HEMS)}, sleeve:{t:"الأكمام", opts:Object.entries(A.SLEEVES)}};
      const want = {c1:pick(cs), pat:pick(ps), [thirdKind]:pick(tMap[thirdKind].opts)[0]};
      const look = Object.assign(A.BLANK(), {c1:"cream", pat:"none", head:"none", hem:"straight", sleeve:"cap"}), wings = A.BLANK_WINGS();
      let tries=0;
      const label = k => k==="c1" ? A.COLORS[want.c1][1] : k==="pat" ? A.PATTERNS[want.pat] : (tMap[thirdKind].opts.find(o=>o[0]===want[thirdKind])||[])[1];
      const icon = k => k==="c1" ? `<i class="fgx-dot" style="background:${A.col(want.c1)}"></i>` : k==="pat" ? fcard("cream","ocean",want.pat,34) : "";
      const box = h(`<div class="fgx fgx-three fgx-scroll"><div class="fgx-els">${Object.keys(want).map(k=>`<span class="fgx-el">${lv===0?icon(k):""}<b>${label(k)}</b></span>`).join("")}</div><div class="fgx-mdh"></div><button class="btn honey" data-sub>خلصت!</button> <button class="btn ghost small" data-keep>${IC.save} احفظي بالمتحف</button></div>`);
      ctx.layer.appendChild(box);
      if(lv===2) ctx.after(4000, ()=>{ $(".fgx-els",box).classList.add("hide"); ctx.say("العناصر اختفت… تتذكرينها؟"); });
      miniDesigner($(".fgx-mdh",box), look, wings, [
        {t:"اللون", k:"c1", opts:colorOpts(cs), get:()=>look.c1, set:v=>look.c1=v},
        {t:"النقشة", k:"pat", opts:[["none","سادة"]].concat(ps.map(p=>[p,A.PATTERNS[p]])), get:()=>look.pat, set:v=>look.pat=v},
        {t:tMap[thirdKind].t, k:thirdKind, opts:tMap[thirdKind].opts, get:()=>look[thirdKind], set:v=>look[thirdKind]=v},
        {t:"نوع القطعة (على ذوقج)", k:"type", opts:Object.entries(A.TYPES), get:()=>look.type, set:v=>look.type=v},
        {t:"القصّة (على ذوقج)", k:"cut", opts:Object.entries(A.CUTS), get:()=>look.cut, set:v=>look.cut=v}
      ]);
      $("[data-keep]",box).onclick = () => { const d=FW.saveDesign(look, wings, "من ثلاث عناصر"); toast("انحفظت: "+d.name, "check"); };
      $("[data-sub]",box).onclick = () => { tries++; const miss = Object.keys(want).filter(k=>look[k]!==want[k]);
        if(!miss.length) ctx.win("ثلاث عناصر… وإطلالة وحدة حلوة!", tries===1?3:tries===2?2:1);
        else { ctx.sfx("nope"); $(".fgx-els",box).classList.remove("hide"); ctx.say("ناقص: "+miss.map(label).join("، ")); if(tries>=maxM) ctx.fail("العناصر كانت:", solList(Object.keys(want).map(label))); } };
    }});

  /* ======================================================
     ألغاز قاعة الأقمشة (كل مستوى يفتح قماش)
     ====================================================== */
  G("loom", {title:"لغز النول", art:()=>CL.spool, rw:["f:linen","f:knit","f:brocade"], bg:"linear-gradient(180deg,#FFF8EA,#F0E2C8)",
    how:"النول بيه خيوط بالطول وبالعرض. كل ضغطة على خيط تقلب لون السطر أو العمود كله. خلي النسيج مثل النموذج.",
    run(ctx){
      const lv=ctx.level, N=[3,4,5][lv], flips=[2,3,4][lv], lim=[8,12,16][lv];
      let tgt = Array(N*N).fill(0), cur = Array(N*N).fill(0), moves=0; const used=[];
      for(let k=0;k<flips;k++){ const isRow=Math.random()<.5, i=Math.floor(Math.random()*N); used.push([isRow,i]); for(let j=0;j<N;j++){ const idx=isRow?i*N+j:j*N+i; tgt[idx]^=1; } }
      if(tgt.every(v=>!v)){ for(let j=0;j<N;j++) tgt[j]^=1; used.push([true,0]); }
      const box = h(`<div class="fgx fgx-loom"><div class="fgx-tgt"><small>النموذج</small><div class="fgx-wv" style="--n:${N}">${tgt.map(v=>`<i class="${v?"on":""}"></i>`).join("")}</div></div><div class="fgx-loomw" style="--n:${N}"><span></span>${Array.from({length:N},(_,j)=>`<button data-c="${j}" aria-label="عمود ${j+1}">↓</button>`).join("")}${Array.from({length:N},(_,i)=>`<button data-r="${i}" aria-label="سطر ${i+1}">→</button>${Array.from({length:N},(_,j)=>`<i data-x="${i*N+j}"></i>`).join("")}`).join("")}</div></div>`);
      ctx.layer.appendChild(box);
      const draw = () => { $$("[data-x]",box).forEach(c=>c.classList.toggle("on", !!cur[+c.dataset.x])); ctx.stat(`حركات ${moves} من ${lim}`); };
      draw();
      $(".fgx-loomw",box).onclick = e => { const b=e.target.closest("[data-r],[data-c]"); if(!b) return; moves++; ctx.sfx("soft");
        if(b.dataset.r!=null){ const i=+b.dataset.r; for(let j=0;j<N;j++) cur[i*N+j]^=1; } else { const j=+b.dataset.c; for(let i=0;i<N;i++) cur[i*N+j]^=1; }
        draw();
        if(cur.every((v,i)=>v===tgt[i])) ctx.win("النسيج طلع مثل النموذج!", moves<=flips+1?3:moves<=lim*.7?2:1);
        else if(moves>=lim) ctx.fail("الخيوط تلخبطت", `<p>جربي تقلبين هالخيوط (مرة وحدة لكل واحد):</p>${solList(used.map(([r,i])=>r?`السطر ${i+1}`:`العمود ${i+1}`))}`); };
    }});
  const BEADS = {rose:"#F2A7B8", sky:"#A8D2EE", lemon:"#F6E08A", mint:"#A9DCC4", lilac:"#C9B6E8", gold:"#D9AE4E"};
  G("beads", {title:"لغز القلادة", art:()=>CL.pearls, rw:["f:satin","f:sequin","f:organza"], bg:"linear-gradient(180deg,#F6F0FF,#E8DDF6)",
    how:"نص القلادة جاهز. كمّلي النص الثاني بنفس الخرز بس بالعكس، مثل المراية. وبعدين «تحقّقي».",
    run(ctx){
      const lv=ctx.level, n=[3,4,6][lv], keys=Object.keys(BEADS).slice(0,[3,4,6][lv]), maxM=3;
      const half = Array.from({length:n},()=>pick(keys)); let mine=[], miss=0;
      const box = h(`<div class="fgx fgx-beads"><div class="fgx-neck"><span class="fgx-half">${half.map(k=>`<i style="background:${BEADS[k]}"></i>`).join("")}</span><span class="fgx-gem"></span><span class="fgx-mine"></span></div><div class="fgx-bpal">${keys.map(k=>`<button data-b="${k}" style="--c:${BEADS[k]}" aria-label="خرزة"></button>`).join("")}<button data-undo aria-label="شيلي آخر خرزة">${IC.undo}</button></div><button class="btn honey" data-check>تحقّقي</button></div>`);
      ctx.layer.appendChild(box); fillIcons(box);
      const draw = () => { $(".fgx-mine",box).innerHTML = Array.from({length:n},(_,i)=>`<i style="${mine[i]?`background:${BEADS[mine[i]]}`:""}" class="${mine[i]?"":"e"}"></i>`).join(""); ctx.stat(`${mine.length} من ${n}`); };
      draw();
      $(".fgx-bpal",box).onclick = e => { const b=e.target.closest("button"); if(!b) return; if(b.dataset.undo!=null){ mine.pop(); } else if(mine.length<n) mine.push(b.dataset.b); ctx.sfx("soft"); draw(); };
      $("[data-check]",box).onclick = () => { const want = half.slice().reverse(); if(mine.length===n && mine.every((v,i)=>v===want[i])) ctx.win("القلادة متناظرة!", miss===0?3:miss===1?2:1);
        else { miss++; ctx.sfx("nope"); ctx.say(mine.length<n?"القلادة ناقصة خرز":"الخرزة اللي يم الجوهرة لازم تشبه اللي يمها من الجهة الثانية"); if(miss>=maxM) ctx.fail("المراية تقلب الترتيب", `<p>النص الثاني لازم يكون:</p><div class="fgx-neck sm">${want.map(k=>`<i style="background:${BEADS[k]}"></i>`).join("")}</div>`); } };
    }});
  const RIDDLES = {
    c:[["sky","لون السما بنهار صافي"],["rose","لون الورد الناعم"],["lemon","لون الشمس الصغيرة"],["mint","لون ورق النعناع الفاتح"],["lilac","لون زهرة الخزامى الفاتحة"]],
    p:[["stars","شي يطلع بالليل ويلمع"],["daisies","زهرة بيضا وسطها أصفر"],["stripes","خطوط مرتبة مثل ممر المشاة"],["dots","نقط صغيرة مثل المطر"],["clouds","شي أبيض يطوف بالسما"]],
    f:[["silk","قماش ناعم يلمع بهدوء"],["tulle","طبقات شفافة خفيفة مثل الضباب"],["cotton","قماش ناعم وبسيط للعب كل يوم"]]
  };
  G("dials", {title:"لغز القفل", art:()=>CL.gift, rw:["f:velvet","f:lace","f:petal"], bg:"linear-gradient(180deg,#FFF1F4,#F2DAE2)",
    how:"صندوق الأقمشة مقفول بأقفال. اقري الأحجية فوق كل قفل، ودوّري القفل للجواب الصحيح.",
    run(ctx){
      const lv=ctx.level, kinds = lv===0 ? ["c","p"] : ["c","p","f"], nOpt=[3,4,5][lv], maxM=3;
      const dials = kinds.map(k=>{ const pool = RIDDLES[k].slice(0, Math.max(nOpt, k==="f"?3:nOpt)); const ans = pick(pool); return {k, ans, opts:mix(pool).slice(0, Math.min(nOpt,pool.length)).concat([]), i:0}; });
      dials.forEach(d=>{ if(!d.opts.includes(d.ans)) d.opts[0]=d.ans; d.opts=mix(d.opts); });
      let miss=0;
      const show = (d) => d.k==="c" ? `<i class="fgx-dot" style="background:${A.col(d.opts[d.i][0])}"></i>` : d.k==="p" ? fcard("cream","plum",d.opts[d.i][0],40) : FW.swatch("f", d.opts[d.i][0], 40);
      const box = h(`<div class="fgx fgx-dials">${dials.map((d,j)=>`<div class="fgx-dial"><p>${lv===2?"«"+d.ans[1]+"»":d.ans[1]}</p><div class="fgx-dw"><button data-p="${j}" aria-label="السابق">${IC.right}</button><span data-s="${j}"></span><button data-n="${j}" aria-label="التالي">${IC.left}</button></div></div>`).join("")}<button class="btn honey" data-open>افتحي القفل</button></div>`);
      ctx.layer.appendChild(box); fillIcons(box);
      const draw = () => dials.forEach((d,j)=>{ $(`[data-s="${j}"]`,box).innerHTML = show(d)+`<small>${d.k==="f"?A.FABRICS[d.opts[d.i][0]].n:d.k==="c"?A.COLORS[d.opts[d.i][0]][1]:A.PATTERNS[d.opts[d.i][0]]}</small>`; });
      draw(); ctx.stat(`${dials.length} أقفال`);
      box.onclick = e => { const p=e.target.closest("[data-p]"), n=e.target.closest("[data-n]"); if(p){ const d=dials[+p.dataset.p]; d.i=(d.i-1+d.opts.length)%d.opts.length; } else if(n){ const d=dials[+n.dataset.n]; d.i=(d.i+1)%d.opts.length; } else return; ctx.sfx("soft"); draw(); };
      $("[data-open]",box).onclick = () => { const ok = dials.every(d=>d.opts[d.i][0]===d.ans[0]); if(ok) ctx.win("القفل انفتح!", miss===0?3:miss===1?2:1);
        else { miss++; ctx.sfx("nope"); const w=dials.findIndex(d=>d.opts[d.i][0]!==d.ans[0]); bump($$(".fgx-dial",box)[w]); ctx.say("قفل واحد على الأقل مو صح — اقري أحجيته مرة ثانية"); if(miss>=maxM) ctx.fail("الأحاجي تحتاج خيال", solList(dials.map(d=>`${d.ans[1]} ← <b>${d.k==="f"?A.FABRICS[d.ans[0]].n:d.k==="c"?A.COLORS[d.ans[0]][1]:A.PATTERNS[d.ans[0]]}</b>`))); } };
    }});

  /* ======================================================
     قاعة الأقمشة والألوان
     ====================================================== */
  FW.region("fabrics", (body, {first}) => {
    let tab = "f";
    body.innerHTML = `<div class="fh"><div class="fh-hall" aria-hidden="true"><div class="fh-bolts">${["#F2A7B8","#A8D2EE","#F6E08A","#C9B6E8","#A9DCC4","#EE8A7A","#9DBF8E","#5E9BC9"].map((c,i)=>`<i style="--c:${c};--d:${-i*.7}s"></i>`).join("")}</div><div class="fh-fl">${["#F2A7B8","#F6E08A","#A9DCC4"].map((c,i)=>`<span style="--d:${-i*4}s;top:${20+i*22}%">${A.F.cbfly(c)}</span>`).join("")}</div></div>
      <div class="fh-friends"></div>
      <section class="fh-lib"><div class="seg fh-tabs" role="tablist"><button data-t="f" aria-pressed="true">الأقمشة</button><button data-t="c" aria-pressed="false">الألوان</button><button data-t="p" aria-pressed="false">النقشات</button></div><div class="fh-grid"></div></section>
      <section class="fh-puz"><h3>ألغاز الخامات</h3><p class="fc-note">كل مستوى من الألغاز يفتح قماش جديد للمشغل.</p></section></div>`;
    const grid = $(".fh-grid",body);
    const draw = () => { const ids = FW.list(tab), n = ids.filter(id=>FW.owned(tab,id)).length;
      grid.innerHTML = `<p class="fw-count">${n} من ${ids.length} مفتوحة</p><div class="fw-grid">${ids.map(id=>`<button class="fw-wi ${FW.owned(tab,id)?"":"lock"}" data-id="${id}">${FW.swatch(tab,id,52)}<small>${esc(FW.KIND[tab].name(id))}</small></button>`).join("")}</div>`; };
    draw();
    grid.onclick = e => { const b=e.target.closest("[data-id]"); if(!b) return; const id=b.dataset.id; const own=FW.owned(tab,id);
      if(!own){ FW.sfx("nope"); FW.say(seam, tab==="f" ? (A.FABRICS[id].rare?"هذا نادر… مكانه بغرفة الأسرار.": A.FABRICS[id].season?"هذا يجي ويا المواسم بساحة المهرجان.":"حلّي ألغاز الخامات حتى ينفتح!") : "العبي ألعاب الدار حتى ينفتح."); return; }
      FW.sfx("soft");
      if(tab==="f") FW.say(seam, `${A.FABRICS[id].n}: ${A.FABRICS[id].d}. تبين تجربينه؟`);
      const L = FW.curLook(); const k = tab==="f"?"fabric":tab==="c"?"c1":"pat"; const nl = Object.assign({}, L, {[k]:id}); FW.setCur(nl, FW.curWings());
      toast(`صار ${FW.KIND[tab].n} التصميم الحالي: ${FW.KIND[tab].name(id)}`, "check"); };
    $$("[data-t]",body).forEach(b=>b.onclick=()=>{ tab=b.dataset.t; $$("[data-t]",body).forEach(x=>x.setAttribute("aria-pressed",x===b)); draw(); FW.sfx("page"); });
    const seam = FW.friendEl("seam","fh-seam"); $(".fh-friends",body).appendChild(seam);
    const cb = FW.friendEl("cbfly","fh-cb"); $(".fh-friends",body).appendChild(cb);
    if(first) setTimeout(()=>FW.say(seam, "أهلاً بقاعتي! هنا كل الخامات. اضغطي أي وحدة مفتوحة حتى تنحط بتصميمج."), 500);
    let shelf = null;
    const puz = FW.gameShelf($(".fh-puz",body), ["loom","beads","dials"], "", {onOpen:o=>{ $(".fh-lib",body).hidden=o; $$(".fh-puz>h3,.fh-puz>p",body).forEach(x=>x.hidden=o); if(shelf) shelf.box.hidden=o; }});
    shelf = FW.gameShelf(body, ["hunt","patmatch","dye"], "ألعاب القاعة", {onOpen:o=>{ $(".fh-lib",body).hidden=o; $(".fh-puz",body).hidden=o; }});
    return () => { puz.destroy(); shelf.destroy(); };
  });

  /* ======================================================
     غرفة الأسرار
     ====================================================== */
  FW.region("secret", (body, {first}) => {
    const S = FW.S; S.secret = S.secret || {};
    const PEDS = [
      {id:"starlight", n:"ضي النجوم", q:"كم نجمة تلمع هنا؟", kind:"count"},
      {id:"aurora", n:"الشفق", q:"راقبي ترتيب الألوان، وعيديه.", kind:"simon"},
      {id:"moonsilk", n:"حرير القمر", q:"رتبي القمر من الهلال الصغير للبدر.", kind:"moon"}
    ];
    body.innerHTML = `<div class="fsr"><div class="fsr-glow" aria-hidden="true">${Array.from({length:18},(_,i)=>`<i style="left:${(i*41)%100}%;top:${(i*29)%90}%;--d:${(-i*.5).toFixed(1)}s"></i>`).join("")}</div>
      <p class="fsr-intro">غرفة صغيرة مخبّاية… الخيوط الذهبية الأربعة فتحت بابها. كل منصّة عليها قماش نادر، ويحرسه لغز صغير.</p>
      <div class="fsr-peds">${PEDS.map(p=>`<div class="fsr-ped ${FW.owned("f",p.id)?"done":""}" data-p="${p.id}">${FW.swatch("f",p.id,64)}<b>${p.n}</b><button class="btn ${FW.owned("f",p.id)?"ghost":"honey"} small" data-go="${p.id}">${FW.owned("f",p.id)?"✓ صار عندج":"حلّي اللغز"}</button></div>`).join("")}</div>
      <div class="fsr-chest"><span class="fsr-cart">${S.chest?CL.gift:CL.gift}</span><div><b>صندوق الأجنحة النادرة</b><p>${S.chest?"فتحتيه! جناح الشفق وجناح المجرّة صاروا عندج.":"ينفتح لما تجمعين الأقمشة النادرة الثلاثة."}</p></div><button class="btn honey small" data-chest ${S.chest?"disabled":""}>افتحي</button></div>
      <div class="fsr-play"></div></div>`;
    fillIcons(body);
    const play = $(".fsr-play",body);
    const owl = FW.friendEl("owl","fsr-owl", ()=>"الأسرار تنكشف بالصبر… وبالعين الحلوة."); $(".fsr",body).appendChild(owl);
    const refresh = () => { $$(".fsr-ped",body).forEach(el=>{ const id=el.dataset.p, own=FW.owned("f",id); el.classList.toggle("done",own); const b=$("[data-go]",el); b.textContent = own?"✓ صار عندج":"حلّي اللغز"; b.className = "btn "+(own?"ghost":"honey")+" small"; }); };
    const solve = p => {
      play.innerHTML = ""; const card = h(`<div class="fsr-puz"><h3>${p.n}</h3><p>${p.q}</p><div class="fsr-area"></div><p class="fsr-msg" aria-live="polite"></p></div>`); play.appendChild(card); card.scrollIntoView && card.scrollIntoView({block:"nearest"});
      const area=$(".fsr-area",card), msg=t=>$(".fsr-msg",card).textContent=t;
      const done = () => { FW.grant("f", p.id, "غرفة الأسرار"); refresh(); msg("انفتح! "+p.n+" صار بخزانتج."); setTimeout(()=>play.innerHTML="", 1800); };
      if(p.kind==="count"){ const n=5+Math.floor(Math.random()*5); area.innerHTML = `<div class="fsr-sky">${Array.from({length:n},(_,i)=>`<i style="left:${8+((i*37)%84)}%;top:${10+((i*53)%74)}%">${CL.star}</i>`).join("")}</div><div class="fsr-nums">${[n-1,n,n+1,n+2].sort(()=>Math.random()-.5).map(v=>`<button data-v="${v}">${v}</button>`).join("")}</div>`;
        $(".fsr-nums",area).onclick = e => { const b=e.target.closest("[data-v]"); if(!b) return; if(+b.dataset.v===n){ FW.sfx("ok"); done(); } else { FW.sfx("nope"); msg("عدّي على مهل، وحدة وحدة."); bump(b); } }; }
      if(p.kind==="simon"){ const cols=["#7FE3D2","#B9A6FF","#FF9FCB","#9FE3FF"]; const seq=Array.from({length:4},()=>Math.floor(Math.random()*4)); let inp=[], busy=true;
        area.innerHTML = `<div class="fsr-simon">${cols.map((c,i)=>`<button data-i="${i}" style="--c:${c}" aria-label="لون ${i+1}"></button>`).join("")}</div><button class="btn ghost small" data-again>شوفي مرة ثانية</button>`;
        const flash = i => { const b=$$("[data-i]",area)[i]; b.classList.add("on"); FW.sfx("soft"); setTimeout(()=>b.classList.remove("on"), 380); };
        const showSeq = () => { busy=true; inp=[]; msg("راقبي…"); seq.forEach((v,k)=>setTimeout(()=>flash(v), 600+k*650)); setTimeout(()=>{ busy=false; msg("هسه دورج"); }, 600+seq.length*650); };
        $(".fsr-simon",area).onclick = e => { const b=e.target.closest("[data-i]"); if(!b || busy) return; const i=+b.dataset.i; flash(i); inp.push(i); if(seq[inp.length-1]!==i){ msg("ولا يهمج، نعيد"); setTimeout(showSeq, 700); return; } if(inp.length===seq.length){ FW.sfx("ok"); done(); } };
        $("[data-again]",area).onclick = showSeq; showSeq(); }
      if(p.kind==="moon"){ const ph=[0,1,2,3]; let order=mix(ph); while(order.every((v,i)=>v===i)) order=mix(ph);
        const art = k => `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#2E2F5E"/><path d="${["M20 6a14 14 0 010 28 4 14 0 000-28z","M20 6a14 14 0 010 28 9 14 0 000-28z","M20 6a14 14 0 010 28A14 14 0 0120 6z","M20 6a14 14 0 110 28 14 14 0 010-28z"][k]}" fill="#F6E08A"/></svg>`;
        const dr = () => { area.innerHTML = `<div class="fsr-moons">${order.map((k,i)=>`<div><span>${art(k)}</span><button data-l="${i}" ${i===0?"disabled":""} aria-label="قدّام">${IC.right}</button></div>`).join("")}</div><button class="btn honey small" data-ok>تحقّقي</button>`; fillIcons(area);
          $$("[data-l]",area).forEach(b=>b.onclick=()=>{ const i=+b.dataset.l; [order[i-1],order[i]]=[order[i],order[i-1]]; FW.sfx("soft"); dr(); });
          $("[data-ok]",area).onclick=()=>{ if(order.every((v,i)=>v===i)){ FW.sfx("ok"); done(); } else { FW.sfx("nope"); msg("الهلال الصغير أول، والبدر الكامل آخر."); } }; };
        dr(); }
    };
    $$("[data-go]",body).forEach(b=>b.onclick=()=>{ const p=PEDS.find(x=>x.id===b.dataset.go); if(FW.owned("f",p.id)){ FW.say(owl, "هذا القماش صار عندج من قبل."); return; } solve(p); });
    $("[data-chest]",body).onclick = () => { if(S.chest) return; if(!PEDS.every(p=>FW.owned("f",p.id))){ FW.sfx("nope"); FW.say(owl, "الصندوق يريد الأقمشة الثلاثة أول."); return; }
      S.chest = true; FW.save(); FW.sfx("bell"); FW.grant("w","aurora","صندوق غرفة الأسرار"); setTimeout(()=>FW.grant("w","galaxy","صندوق غرفة الأسرار"), 1500); $("[data-chest]",body).disabled=true; $(".fsr-chest p",body).textContent="فتحتيه! جناح الشفق وجناح المجرّة صاروا عندج."; if(motionOK()) confetti(); };
    if(first) setTimeout(()=>FW.say(owl, "هوو… وصلتي للمكان السري. ما كل أحد يلگاه!"), 500);
    return () => {};
  });

  return { CL, fcard, IDEAS, THEMES, miniDesigner };
})();
