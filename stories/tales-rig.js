/* =====================================================================
   حكاياتنا — تحريك الشخصيات بأجزاء (rig)
   ما نرسم أي شي جديد: كل جزء (راس، شعر، جذع، يد، رجل، فستان) هو
   نفس صورة الشخصية الأصلية مقصوصة بـ clip-path، ويتحرك حول مفصله.
   الإحداثيات كلها نسبة مئوية من أبعاد الصورة الأصلية.
   ===================================================================== */
const TRig = (() => {
  const ADOOL = "assets/ADOOL_OFFICIAL_CHARACTER.png";
  const poly = pts => `polygon(${pts.map(([x,y])=>`${x}% ${y}%`).join(",")})`;

  // ترتيب الرسم من الخلف للأمام
  const RIGS = {
    elaf: {
      src: () => GIRL, ar: 360/500,
      parts: {
        // الجزء الظاهر تحت حافة الفستان (محسوب من ألوان الصورة) يبقى ثابت ويا الوركين
        thigh:{z:1, o:[45,76], c:[[29,79],[31,78],[32,76.9],[33,75.3],[34,73.1],[35,70.9],[36,69.3],[38,69.9],[42,70.1],[43.5,71.5],[46,73.5],[48,74.6],[52,75.3],[55,75.9],[57,76.6],[59,78.6],[61,80]].concat([[61,86],[26,86]])},
        // الساق تذوب بنعومة فوق الفخذ عند الركبة، فما يبين خط قص وهي تتحرك
        legL: {z:1.6, o:[34,82], c:[[24,79.5],[43.89,79.5],[43.89,100],[10,100],[14,90]], mask:"linear-gradient(180deg,transparent 0,transparent 80%,#000 85%)"},
        legR: {z:1.6, o:[49,82], c:[[43.89,79.5],[58,79.5],[60,88],[68,88],[68,100],[43.89,100]], mask:"linear-gradient(180deg,transparent 0,transparent 80%,#000 85%)"},
        skirt:{z:2, o:[45,52.5], c:[[0,60],[24,56],[31,52],[57,52],[62,55],[72,58],[85,62],[92,70],[92,82],[62,81],[59,81.6],[57,79.6],[55,78.9],[52,78.3],[48,77.6],[46,76.5],[43.5,74.5],[42,73.1],[38,72.9],[36,72.3],[35,73.9],[34,76.1],[33,78.3],[32,79.9],[31,81],[24,80],[10,78],[0,76]]},
        core: {z:3, o:[50,52], c:[[24,33],[80,33],[74,38],[73.5,44.5],[71,46.5],[66,47.5],[64,49.5],[64,51],[70,53],[74,53],[74,58.8],[66,58.8],[60,55],[57,52.6],[31,52.6],[31,52.5],[35,49],[32,47.5],[29.5,45.5],[29,38]]},
        armL: {z:4, o:[33,47.5], c:[[0,45],[29.5,45.5],[32,47.5],[35,49],[31,52.5],[14,55.5],[0,56]]},
        armR: {z:4, o:[68,48], c:[[64,49.5],[66,47.5],[71,46.5],[73.5,44.5],[78,47.5],[92,53],[100,52],[100,64],[92,65],[80,58],[70,53],[64,51]]},
        head: {z:5, o:[50,35], c:[[12,0],[100,0],[100,33],[68,33],[62,36.5],[40,36.5],[34,33],[12,33]]},
        hair: {z:6, o:[56,19], c:[[12,0],[100,0],[100,22],[12,22]], mask:"linear-gradient(180deg,#000 0,#000 15%,transparent 21%)"}
      }
    },
    adool: {
      src: () => ADOOL, ar: 1024/1536,
      parts: {
        legL: {z:1, o:[41,77.5], c:[[22,77.5],[51.37,77.5],[51.66,78],[51.76,79],[51.76,91],[51.95,92],[52.15,93],[52.15,100],[20,100]]},
        legR: {z:1, o:[61,77.5], c:[[51.37,77.5],[80,77.5],[80,100],[52.15,100],[52.15,93],[51.95,92],[51.76,91],[51.76,79],[51.66,78]]},
        core: {z:3, o:[50,50], c:[[36,29],[66.5,29],[72,29],[78,36],[80,42],[79,47.5],[72,48],[66.8,47.6],[70.4,48.5],[70.9,59],[71,66],[72,69.5],[75.5,69.5],[76,78.2],[25,78.2],[28,47.5],[30,47],[33,46.2],[31.6,44],[31.8,36],[33,34],[36,30],[37,21],[14,21]]},
        // اليد اليمنى (يسار الصورة) بوضع مرتاح: نسخة معكوسة من اليد النازلة نفسها
        armL: {z:4, o:[68,33], mirror:{dx:-33, dy:2.5, sx:.8}, c:[[66.5,30.5],[72,29.5],[80,39],[81.5,47],[80.5,58],[84,63],[83.5,70],[72,69.5],[71,66],[70.9,59],[70.4,48.5],[66.8,47.6],[64.6,44],[64.3,40],[66,36],[67.5,33]]},
        armR: {z:4, o:[68,33], c:[[66.5,30.5],[72,29.5],[80,39],[81.5,47],[80.5,58],[84,63],[83.5,70],[72,69.5],[71,66],[70.9,59],[70.4,48.5],[66.8,47.6],[64.6,44],[64.3,40],[66,36],[67.5,33]]},
        // اليد المرفوعة الأصلية: تظهر بس وقت التلويح
        wave: {z:4, o:[33,45], hidden:true, c:[[8,21],[34,21],[35,27],[36,30],[33,34],[31.8,36],[31.6,44],[33,46.2],[30,48],[8,48]]},
        head: {z:5, o:[50,29], c:[[14,0],[86,0],[86,29.5],[72,29.5],[64,31.5],[38,31.5],[36,30],[35,27],[34,21],[14,21]]}
      }
    }
  };

  const has = who => !!RIGS[who];
  function html(who){
    const R = RIGS[who]; const src = R.src();
    const parts = Object.entries(R.parts).sort((a,b)=>a[1].z-b[1].z).map(([k,p]) =>
      `<img class="rp rp-${k}" data-p="${k}" src="${src}" alt="" draggable="false" decoding="async" style="clip-path:${poly(p.c)};-webkit-clip-path:${poly(p.c)};transform-origin:${p.o[0]}% ${p.o[1]}%;${p.mask?`-webkit-mask-image:${p.mask};mask-image:${p.mask};`:""}${p.hidden?"opacity:0;":""}${p.mirror?`transform:translate(${p.mirror.dx}%,${p.mirror.dy}%) scale(${-p.mirror.sx},1);`:""}">`).join("");
    return `<div class="rig rig-${who}" style="aspect-ratio:${R.ar}">${parts}</div>`;
  }

  /* ---------- الحالة لكل شخصية ---------- */
  function attach(c, el){
    const R = RIGS[c.who]; if(!R) return;
    const rig = el.querySelector(".rig"); if(!rig) return;
    const P = {}; rig.querySelectorAll(".rp").forEach(img => P[img.dataset.p] = img);
    c.rig = { R, rig, P, ph:0, g:0, air:false, land:0, crouch:0, wave:0, greet:0, t:Math.random()*10,
      sk:0, skv:0, hr:0, hrv:0, hd:0, hdv:0, px:c.x, py:c.y, vx:0, vy:0, flare:0 };
  }
  const spring = (s, key, vkey, target, k, d, dt) => { const a = (target - s[key])*k - s[vkey]*d; s[vkey] += a*dt; s[key] += s[vkey]*dt; };
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

  function tr(img, o){
    if(!img) return;
    let t = "";
    if(o.tx || o.ty) t += `translate(${(o.tx||0).toFixed(2)}%,${(o.ty||0).toFixed(2)}%) `;
    if(o.sx!=null || o.sy!=null) t += `scale(${(o.sx??1).toFixed(3)},${(o.sy??1).toFixed(3)}) `;
    if(o.r) t += `rotate(${o.r.toFixed(2)}deg) `;
    if(o.k) t += `skewX(${o.k.toFixed(2)}deg)`;
    img.style.transform = t || "none";
  }

  // يتنادى كل فريم. c: {x,y,face,anim,...}
  function update(c, dt, calm){
    const s = c.rig; if(!s || !dt) return;
    s.t += dt;
    const amp = calm ? .35 : 1;
    // سرعة من تغيّر المكان (تشتغل للاعب والمتابعين والحركات المبرمجة)
    const ivx = (c.x - s.px)/dt, ivy = (c.y - s.py)/dt; s.px=c.x; s.py=c.y;
    s.vx += (clamp(ivx,-60,60) - s.vx)*Math.min(1, dt*12);
    s.vy += (clamp(ivy,-120,120) - s.vy)*Math.min(1, dt*14);
    const air = c.anim==="jump" || (c.anim==="fly");
    const fly = c.anim==="fly", row = c.anim==="row", sit = c.anim==="sit";
    if(s.air && !air && !fly){ s.land = .3; s.flare = 1; }
    s.air = air;
    const spd = Math.abs(s.vx);
    const moving = !air && !row && spd > 1.5;
    s.g += ((moving ? clamp(spd/19, .35, 1.35) : 0) - s.g) * Math.min(1, dt*8);
    if(moving) s.ph += dt * (2.2 + spd*.2);
    else s.ph += dt * s.g * 3;
    const ph = s.ph, g = s.g*amp;
    const sw = Math.sin(ph), bob = Math.abs(Math.sin(ph));
    const breathe = Math.sin(s.t*1.9);
    const lv = s.vx * (c.face||1); // سرعة للأمام بإحداثيات الشخصية
    s.land = Math.max(0, s.land - dt); s.crouch = Math.max(0, s.crouch - dt);
    s.wave = Math.max(0, s.wave - dt); s.greet = Math.max(0, s.greet - dt);
    const landK = s.land>0 ? Math.sin((1 - s.land/.3)*Math.PI) : 0; // 0 → 1 → 0
    const crK = s.crouch>0 ? 1 : 0;
    const P = s.P, who = c.who;

    // جسم كامل: هزّة خطوة، ميلان للأمام، هبوط، تنفّس
    const lean = clamp(lv*.11, -4, 5)*amp + (fly ? 6*amp : 0);
    const bodyY = -bob*1.6*g + landK*2.4*amp + crK*2.2 + breathe*.25*amp + (sit?4:0);
    s.rig.style.transform = `translateY(${bodyY.toFixed(2)}%) rotate(${lean.toFixed(2)}deg)`;

    // رجلين
    let lL, lR;
    if(air && !fly){ const up = s.vy<0; lL = (up?-12:-6)*amp; lR = (up?10:6)*amp; }
    else if(fly){ lL = (-8 + Math.sin(s.t*3)*4)*amp; lR = (10 + Math.sin(s.t*3+1)*4)*amp; }
    else if(sit){ lL = -18; lR = -14; }
    else { const A = who==="elaf" ? 5 : 10; lL = sw*A*g - crK*3 - landK*3*amp; lR = -sw*A*g + crK*3 + landK*3*amp; }
    // رفعة خفيفة للرجل اللي تتقدم بدل دوران كبير
    const lift = 0;
    tr(P.legL, {r:lL, ty:-Math.max(0, sw)*lift}); tr(P.legR, {r:lR, ty:-Math.max(0,-sw)*lift});

    // ثوابت الذراع حسب الشخصية
    if(who==="elaf"){
      const up = air ? -6*amp : fly ? -12*amp : 0;
      const aL = sw*6*g + breathe*1.4*amp + up - landK*5*amp + crK*4;
      const aR = -sw*6*g - breathe*1.4*amp - up + landK*5*amp - crK*4 + (s.wave>0 ? -14 + Math.sin(s.wave*16)*10 : 0);
      tr(P.armL, {r:aL}); tr(P.armR, {r:aR});
      // فستان: يتأخر عن الحركة ويرفرف بالقفز والهبوط
      spring(s, "sk", "skv", clamp(-lv*.16,-4.5,4)*amp + Math.sin(ph*2)*1.6*g + (air? clamp(s.vy*.04,-3,3):0), 60, 9, dt);
      s.flare = Math.max(0, s.flare - dt*3);
      const fl = (air && s.vy>0 ? .03 : 0) + s.flare*.035*amp;
      tr(P.skirt, {sx:1+fl, sy:1-fl*.8, k:s.sk});
      // راس وشعر
      spring(s, "hd", "hdv", clamp(lv*.05,-1.5,2)*amp + breathe*.6*amp - landK*1.5*amp, 40, 8, dt);
      spring(s, "hr", "hrv", clamp(lv*.18,-5,6)*amp + (air ? clamp(s.vy*.05,-4,4) : 0) - landK*3*amp + Math.sin(ph*2+.6)*1.2*g, 55, 6.5, dt);
      tr(P.head, {r:s.hd}); tr(P.hair, {r:s.hd, k:s.hr});
    } else if(who==="adool"){
      const out = air ? 22*amp : fly ? 30*amp : 0;
      const bal = landK*16*amp;
      // اليسار (المعكوسة) والدوران معكوس الإشارة بسبب المراية
      const swing = sw*15*g;
      const aR = -swing + breathe*1.2*amp - out*.6 - bal - crK*8 + (s.greet>0 ? -Math.sin((1-s.greet/.9)*Math.PI)*22 : 0);
      const aL = -swing + breathe*1.2*amp + out + bal + crK*8;
      const m = s.R.parts.armL.mirror;
      const waving = s.wave>0;
      if(P.armL){ P.armL.style.opacity = waving ? 0 : 1; P.armL.style.transform = `translate(${m.dx}%,${m.dy}%) scale(${-m.sx},1) rotate(${(-aL).toFixed(2)}deg)`; }
      tr(P.armR, {r:aR});
      if(P.wave){ P.wave.style.opacity = waving ? 1 : 0; tr(P.wave, {r: waving ? Math.sin(s.wave*14)*9 : 0}); }
      spring(s, "hd", "hdv", clamp(lv*.05,-1.5,2)*amp + breathe*.5*amp - landK*1.4*amp + (s.greet>0 ? Math.sin((1-s.greet/.9)*Math.PI)*-4 : 0), 40, 8, dt);
      tr(P.head, {r:s.hd});
    }
  }
  // قفزة: تحضير قصير قبل ما ترتفع
  const crouch = (c, t=.1) => { if(c.rig) c.rig.crouch = t; };
  const wave = (c, t=1.4) => { if(c.rig) c.rig.wave = t; };
  const greet = c => { if(c.rig && c.rig.greet<=0) c.rig.greet = .9; };

  return { has, html, attach, update, crouch, wave, greet };
})();
