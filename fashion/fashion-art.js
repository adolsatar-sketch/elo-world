/* =====================================================================
   دار إيلاف — الرسوم: الكتالوج (ألوان، نقشات، أقمشة، أجنحة، إكسسوارات)
   ورسم الملابس والأجنحة كـ SVG أصلية فوق أجزاء صورة إيلاف نفسها.
   الإحداثيات بنسبة مئوية من صورة إيلاف (360×500)، وداخل الـ SVG
   كل نقطة تتحول لبكسل حتى النقشات ما تتمطّط.
   ===================================================================== */
const FArt = (() => {
  /* ---------------- الكتالوج ---------------- */
  const COLORS = {
    rose:["#F2A7B8","وردي ناعم"], blush:["#F7CFC8","خوخي"], coral:["#EE8A7A","مرجاني"], lemon:["#F6E08A","ليموني"],
    honey:["#E8C066","عسلي"], mint:["#A9DCC4","نعناعي"], sage:["#9DBF8E","أخضر هادئ"], sky:["#A8D2EE","سماوي"],
    ocean:["#5E9BC9","أزرق بحري"], lilac:["#C9B6E8","ليلكي"], cream:["#FBF3DF","كريمي"], white:["#FFFFFF","أبيض"],
    ruby:["#C8425A","ياقوتي"], plum:["#8E5A9E","بنفسجي"], pearl:["#EDE7F2","لؤلؤي"], navy:["#3E4C7A","كحلي"],
    mocha:["#B98E6E","بني فاتح"], peach:["#F9C49A","مشمشي"], turquoise:["#66C6C2","فيروزي"], berry:["#B04E86","توتي"],
    gold:["#D9AE4E","ذهبي"], silver:["#C7CBD6","فضي"], night:["#2E2F5E","ليلي"], fuchsia:["#E86CA8","فوشي"],
    lavender:["#B9A6DD","خزامي"], apricot:["#F7B98A","مشمشي فاتح"], lime:["#C8E07A","أخضر ليموني"], aqua:["#9FE3E8","مائي"],
    rosegold:["#E4A99A","وردي ذهبي"], cocoa:["#8C5E48","كاكاو"], cherry:["#E0566E","كرزي"], seafoam:["#7FD6B4","زبد البحر"]
  };
  const START_COLORS = ["rose","blush","coral","lemon","honey","mint","sage","sky","ocean","lilac","cream","white"];
  const PATTERNS = {
    none:"سادة", dots:"نقاط", stripes:"خطوط", daisies:"أقحوان", roses:"ورود", stars:"نجوم", leaves:"أوراق", clouds:"غيوم",
    hearts:"قلوب", checks:"مربعات", constellation:"كوكبات", waves:"موج", butterflies:"فراشات",
    ribbons:"شرايط", shells:"صدف", notes:"نوتات", chevron:"متعرّج", scribble:"شخابيط"
  };
  const START_PATTERNS = ["none","dots","stripes","daisies"];
  const FABRICS = {
    cotton:{n:"قطن", d:"ناعم وخفيف"}, silk:{n:"حرير", d:"يلمع بهدوء"}, tulle:{n:"تول", d:"طبقات شفافة"},
    linen:{n:"كتان", d:"خيوط واضحة"}, satin:{n:"ساتان", d:"لمعة قوية"}, velvet:{n:"مخمل", d:"عميق وناعم"},
    lace:{n:"دانتيل", d:"زخرفة مخرّمة"}, sequin:{n:"ترتر", d:"حبات لامعة"}, petal:{n:"بتلات", d:"طبقات ورد"},
    knit:{n:"تريكو", d:"غرز دافية"}, organza:{n:"أورجانزا", d:"شفاف لامع"}, brocade:{n:"بروكار", d:"نقش ذهبي"},
    starlight:{n:"ضي النجوم", d:"نادر — يلمع بالليل", rare:1}, aurora:{n:"الشفق", d:"نادر — ألوان تتبدل", rare:1}, moonsilk:{n:"حرير القمر", d:"نادر — لؤلؤي", rare:1},
    blossom:{n:"زهر الربيع", d:"من موسم الربيع", season:1}, cloud:{n:"قماش الغيم", d:"من عرض الغيوم", season:1}, rainbow:{n:"قوس قزح", d:"من مهرجان الأقمشة الغريبة", season:1},
    leafweave:{n:"نسيج الورق", d:"من أسبوع الطبيعة", season:1}, nightsky:{n:"سما الليل", d:"من سهرة النجوم", season:1}, ombre:{n:"تدرّج", d:"من تحدي اللون الواحد", season:1}
  };
  const START_FABRICS = ["cotton","silk","tulle"];
  const WINGS = {
    butterfly:"فراشة", leaf:"ورقة", petal:"بتلات", cloud:"غيمة", star:"نجمة", crystal:"بلّور", geo:"هندسي",
    aurora:"الشفق", glow:"المضيئة", monarch:"الملكية", patchwork:"رقع ملوّنة"
  };
  const START_WINGS = ["butterfly","leaf"];
  const HEAD_ACC = {none:"بدون", bow:"فيونكة", flowers:"تاج ورد", tiara:"تاج صغير", star:"مشبك نجمة", butterfly:"مشبك فراشة"};
  const NECK_ACC = {none:"بدون", pearls:"لؤلؤ", locket:"قلادة قلب", flower:"وردة"};
  const START_ACC = ["none","bow","flowers","pearls"];
  const TYPES = {dress:"فستان", coat:"معطف خيالي", set:"طقم", cape:"عباءة عرض", festive:"فستان مناسبة", special:"زي خاص"};
  const CUTS = {soft:"ناعم", wide:"واسع", straight:"مستقيم", layers:"طبقات", bubble:"منفوخ"};
  const LENGTHS = {short:"تحت الركبة", midi:"متوسط", long:"طويل"};
  const SLEEVES = {puff:"منفوخ", cap:"قصير", flutter:"كشكش", bell:"جرس", long:"طويل"};
  const COLLARS = {round:"دائري", peter:"ياقة مدوّرة", square:"مربع", bow:"فيونكة رقبة", ruffle:"كشكش"};
  const HEMS = {straight:"عادي", scallop:"مقوّس", ruffle:"كشكش", petal:"بتلات", zigzag:"مسنّن"};
  const BELTS = {none:"بدون", ribbon:"شريطة", sash:"وشاح بفيونكة", jewel:"حزام جوهرة", flower:"حزام وردة"};
  const TRIMS = {buttons:"أزرار", ribbon:"شريط بالحافة", embroidery:"تطريز", bows:"فيونكات صغيرة"};

  const BLANK = () => ({ type:"dress", cut:"soft", len:"midi", size:"M", sleeve:"puff", sleeveW:1, collar:"round", hem:"straight",
    c1:"rose", c2:"cream", pat:"none", patScale:1, fabric:"cotton", trims:{}, belt:"ribbon", head:"none", neck:"none", accSize:1,
    sparkle:false, flow:true });
  const BLANK_WINGS = () => ({ on:false, shape:"butterfly", top:"butterfly", bot:"butterfly", size:1, spread:12, layers:1, c1:"lilac", c2:"sky", grad:true,
    pat:"none", shine:.5, alpha:.85, flap:"soft", speed:1, trail:false });

  /* ---------------- أدوات ---------------- */
  const col = k => k && k[0]==="#" ? k : (COLORS[k]||COLORS.rose)[0];
  const P = (x,y) => `${(x*3.6).toFixed(1)} ${(y*5).toFixed(1)}`;
  const X = x => +(x*3.6).toFixed(1), Y = y => +(y*5).toFixed(1);
  let uidN = 0; const uid = () => "fz"+(++uidN).toString(36);
  function shade(hex, f){ // f<0 أغمق، f>0 أفتح
    const n = parseInt(hex.slice(1),16); let r=n>>16, g=n>>8&255, b=n&255;
    const t = f<0 ? 0 : 255, p = Math.abs(f);
    r=Math.round((t-r)*p+r); g=Math.round((t-g)*p+g); b=Math.round((t-b)*p+b);
    return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
  }
  const lum = hex => { const n=parseInt(hex.slice(1),16); return ((n>>16)*.299+(n>>8&255)*.587+(n&255)*.114)/255; };
  const ink = hex => lum(hex) > .55 ? shade(hex,-.45) : shade(hex,.55);
  const svg = (inner, cls="") => `<svg class="${cls}" viewBox="0 0 360 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" overflow="visible">${inner}</svg>`;

  /* ---------------- النقشات ---------------- */
  function patternDef(id, pat, c, s=1){
    const k = Math.max(.6, Math.min(1.6, s));
    const z = (w) => (w*k).toFixed(1);
    const P2 = (w, hgt, inner, rot=0) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${z(w)}" height="${z(hgt)}"${rot?` patternTransform="rotate(${rot})"`:""}><g transform="scale(${k})">${inner}</g></pattern>`;
    const flower = (x,y,r,f,cc) => `<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse rx="${r*.5}" ry="${r}" transform="rotate(${a}) translate(0 ${-r*.9})" fill="${f}"/>`).join("")}<circle r="${r*.55}" fill="${cc}"/></g>`;
    switch(pat){
      case "dots": return P2(18,18, `<circle cx="5" cy="5" r="2.6" fill="${c}"/><circle cx="14" cy="14" r="2.6" fill="${c}"/>`);
      case "stripes": return P2(16,16, `<rect width="6" height="16" fill="${c}"/>`, 0);
      case "daisies": return P2(34,34, flower(9,10,3.4,"#fff","#F2C14E")+flower(26,27,2.8,c,"#F2C14E")+`<path d="M9 14v6M26 30v4" stroke="#7FA37A" stroke-width="1.4"/>`);
      case "roses": return P2(36,36, `<g transform="translate(10 11)"><circle r="6" fill="${c}"/><path d="M-3-1a3 3 0 015 0 3 3 0 01-4 3" fill="none" stroke="${shade(c,-.35)}" stroke-width="1.2"/><path d="M4 4l5 4" stroke="#6E9E6A" stroke-width="1.6"/><ellipse cx="8" cy="7" rx="3" ry="1.6" fill="#86B47F" transform="rotate(35 8 7)"/></g><circle cx="28" cy="28" r="3.6" fill="${c}" opacity=".8"/>`);
      case "stars": return P2(28,28, `<path d="M8 3l1.6 3.6 3.9.4-2.9 2.6.8 3.9L8 11.5 4.6 13.5l.8-3.9L2.5 7l3.9-.4z" fill="${c}"/><circle cx="21" cy="20" r="1.5" fill="${c}"/>`);
      case "leaves": return P2(30,30, `<path d="M6 22C5 13 11 6 20 5c0 9-6 16-14 17z" fill="${c}"/><path d="M7 21L18 8" stroke="${shade(c,-.3)}" stroke-width="1"/>`, 20);
      case "clouds": return P2(40,30, `<path d="M8 18a5 5 0 015-6 7 7 0 0113-1 5 5 0 014 7z" fill="${c}"/>`);
      case "hearts": return P2(24,24, `<path d="M12 18s-7-4.4-7-9a3.6 3.6 0 017-1.4A3.6 3.6 0 0119 9c0 4.6-7 9-7 9z" fill="${c}"/>`);
      case "checks": return P2(20,20, `<rect width="10" height="10" fill="${c}" opacity=".7"/><rect x="10" y="10" width="10" height="10" fill="${c}" opacity=".7"/>`);
      case "constellation": return P2(46,46, `<path d="M6 10L18 6 28 16 40 12M18 6l4 22 14 8" stroke="${c}" stroke-width=".9" fill="none" opacity=".8"/>${[[6,10],[18,6],[28,16],[40,12],[22,28],[36,36]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.7" fill="${c}"/>`).join("")}`);
      case "waves": return P2(30,14, `<path d="M0 8q7.5-7 15 0t15 0" stroke="${c}" stroke-width="2.4" fill="none"/>`);
      case "butterflies": return P2(36,36, `<g transform="translate(12 12)"><path d="M0 0C-5-8-12-6-10 0-12 6-5 7 0 0zM0 0C5-8 12-6 10 0 12 6 5 7 0 0z" fill="${c}"/><path d="M0-4v8" stroke="${shade(c,-.4)}" stroke-width="1.2"/></g>`);
      case "ribbons": return P2(34,30, `<path d="M4 20c6-8 12 8 18 0s10-6 10-6" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M22 8c-3-3-7-2-6 1s5 1 6-1zm0 0c3-3 7-2 6 1s-5 1-6-1z" fill="${c}"/>`);
      case "shells": return P2(30,28, `<path d="M15 20c-8 0-10-8-6-12 3-3 9-3 12 0 4 4 2 12-6 12z" fill="${c}"/><path d="M15 20l-4-10M15 20V8M15 20l4-10" stroke="${shade(c,-.35)}" stroke-width="1"/>`);
      case "notes": return P2(32,32, `<path d="M10 22V8l10-3v14" stroke="${c}" stroke-width="2" fill="none"/><ellipse cx="8" cy="22" rx="3.2" ry="2.4" fill="${c}"/><ellipse cx="18" cy="19" rx="3.2" ry="2.4" fill="${c}"/>`);
      case "chevron": return P2(20,14, `<path d="M0 10l5-5 5 5 5-5 5 5" stroke="${c}" stroke-width="2.6" fill="none"/>`);
      case "scribble": return P2(40,40, `<path d="M4 10c6-6 10 6 16 0s10 6 16 0M6 30c4 4 8-4 12 0M26 24l6 8M32 24l-6 8" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="30" cy="8" r="2.2" fill="none" stroke="${c}" stroke-width="1.5"/>`);
    }
    return "";
  }

  /* ---------------- الأقمشة: طبقة فوق اللون ---------------- */
  function fabricDefs(id, fab, c1){
    const hi = "#fff", lo = shade(c1,-.5);
    const L = (x1,y1,x2,y2,stops) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`;
    const PT = (w,hh,inner) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${hh}">${inner}</pattern>`;
    switch(fab){
      case "silk": return L(0,0,1,1,[[0,hi,0],[.38,hi,.0],[.48,hi,.32],[.58,hi,0],[1,lo,.18]]);
      case "satin": return L(0,0,1,0,[[0,lo,.25],[.2,hi,.45],[.32,hi,0],[.6,lo,.12],[.75,hi,.4],[.85,hi,0],[1,lo,.25]]);
      case "moonsilk": return L(0,0,1,1,[[0,"#F4E8FF",.45],[.35,"#E2F4FF",.25],[.55,"#FFE8F2",.45],[.8,"#EAFFF4",.3],[1,"#F4E8FF",.45]]);
      case "velvet": return `<radialGradient id="${id}" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="${hi}" stop-opacity=".18"/><stop offset=".55" stop-color="${lo}" stop-opacity="0"/><stop offset="1" stop-color="${lo}" stop-opacity=".5"/></radialGradient>`;
      case "aurora": return L(0,0,1,.3,[[0,"#7FE3D2",.45],[.33,"#B9A6FF",.4],[.66,"#FF9FCB",.4],[1,"#9FE3FF",.45]]);
      case "ombre": return L(0,0,0,1,[[0,hi,.5],[1,lo,.45]]);
      case "rainbow": return L(0,0,1,0,[[0,"#FF8FA3",.45],[.2,"#FFC872",.45],[.4,"#FFF08A",.45],[.6,"#8FE3A8",.45],[.8,"#8FC8FF",.45],[1,"#C8A8FF",.45]]);
      case "linen": return PT(6,6,`<path d="M0 1h6M0 4h6" stroke="${lo}" stroke-opacity=".14" stroke-width=".8"/><path d="M2 0v6M5 0v6" stroke="${hi}" stroke-opacity=".16" stroke-width=".7"/>`);
      case "cotton": return PT(8,8,`<path d="M0 4h8M4 0v8" stroke="${lo}" stroke-opacity=".06" stroke-width=".8"/>`);
      case "knit": return PT(10,8,`<path d="M0 0l5 6 5-6" stroke="${lo}" stroke-opacity=".22" stroke-width="1.6" fill="none"/>`);
      case "lace": return PT(16,16,`<circle cx="8" cy="8" r="4.2" fill="none" stroke="${hi}" stroke-opacity=".75" stroke-width="1.1"/><circle cx="8" cy="8" r="1.4" fill="${hi}" fill-opacity=".7"/><circle cx="0" cy="0" r="2" fill="${hi}" fill-opacity=".5"/><circle cx="16" cy="16" r="2" fill="${hi}" fill-opacity=".5"/><circle cx="0" cy="16" r="2" fill="${hi}" fill-opacity=".5"/><circle cx="16" cy="0" r="2" fill="${hi}" fill-opacity=".5"/>`);
      case "sequin": return PT(9,9,`<circle cx="4.5" cy="4.5" r="3.4" fill="${hi}" fill-opacity=".22" stroke="${lo}" stroke-opacity=".2" stroke-width=".6"/><circle cx="3.4" cy="3.4" r="1" fill="${hi}" fill-opacity=".8"/>`);
      case "petal": return PT(22,16,`<path d="M0 16C0 6 11 6 11 16M11 16c0-10 11-10 11 0" fill="${hi}" fill-opacity=".14" stroke="${lo}" stroke-opacity=".2" stroke-width=".8"/><path d="M-5 8C-5-2 6-2 6 8M6 8c0-10 11-10 11 0M17 8c0-10 11-10 11 0" fill="none" stroke="${lo}" stroke-opacity=".14" stroke-width=".8"/>`);
      case "organza": return PT(12,12,`<path d="M0 12L12 0" stroke="${hi}" stroke-opacity=".35" stroke-width="1.2"/>`);
      case "brocade": return PT(26,26,`<path d="M13 3c4 4 4 8 0 10-4-2-4-6 0-10zM13 13c4 2 8 2 10 0-2-4-6-4-10 0zM13 13c-4 2-8 2-10 0 2-4 6-4 10 0zM13 13c4 4 4 8 0 10-4-2-4-6 0-10z" fill="none" stroke="#D9AE4E" stroke-opacity=".75" stroke-width="1"/>`);
      case "tulle": return PT(5,5,`<circle cx="2.5" cy="2.5" r=".7" fill="${hi}" fill-opacity=".55"/>`);
      case "starlight": case "nightsky": return PT(30,30,`<circle cx="6" cy="8" r="1.1" fill="#FFF7D6"/><circle cx="22" cy="20" r=".8" fill="#FFF7D6"/><path d="M18 5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="#FFF7D6"/>`);
      case "blossom": return PT(30,30,`<g fill="#fff" fill-opacity=".55">${[0,72,144,216,288].map(a=>`<ellipse cx="9" cy="9" rx="1.6" ry="3.2" transform="rotate(${a} 9 9) translate(0 -2.6)"/>`).join("")}</g><circle cx="9" cy="9" r="1.4" fill="#F7D67A"/><circle cx="23" cy="23" r="2" fill="#fff" fill-opacity=".5"/>`);
      case "cloud": return PT(26,20,`<path d="M3 14a4 4 0 014-5 6 6 0 0111-1 4 4 0 013 6z" fill="#fff" fill-opacity=".45"/>`);
      case "leafweave": return PT(14,14,`<path d="M2 12C2 6 6 2 12 2c0 6-4 10-10 10z" fill="none" stroke="#5E8A57" stroke-opacity=".35" stroke-width="1"/>`);
    }
    return "";
  }
  const fabricIsGrad = f => ["silk","satin","moonsilk","velvet","aurora","ombre","rainbow"].includes(f);
  // تعبئة طبقة القماش فوق شكل معين (clip-path) + لمعات الترتر/النجوم
  function fabricLayer(look, clipId, box){
    const id = uid(), f = look.fabric, c1 = col(look.c1);
    const d = fabricDefs(id, f, c1); if(!d) return "";
    const [x,y,w,hh] = box;
    let s = `<defs>${d}</defs><rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="url(#${id})" clip-path="url(#${clipId})"${f==="nightsky"?` style="mix-blend-mode:normal"`:""}/>`;
    if(f==="nightsky"||f==="starlight") s = `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#1E2050" fill-opacity="${f==="nightsky"?.45:.18}" clip-path="url(#${clipId})"/>` + s;
    if(f==="tulle"||f==="organza") s += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#fff" fill-opacity=".14" clip-path="url(#${clipId})"/>`;
    return s;
  }

  /* ---------------- الهندسة ---------------- */
  const LEN = {short:83.5, midi:88.5, long:93.5};
  const MINHW = {short:17.5, midi:21, long:28};
  const EXTRA = {straight:1.5, soft:8, wide:15, layers:10, bubble:7};
  const SIZE = {S:.65, M:1, L:1.3};
  const cx0 = 48.3, ww = 13.6, y0 = 50.8, cxH = 46.5;
  function skirtGeom(look){
    const L = LEN[look.len]||LEN.midi;
    const hw = MINHW[look.len] + (EXTRA[look.cut]??8)*(SIZE[look.size]||1);
    return {L, hw, xl:cxH-hw, xr:cxH+hw};
  }
  // نقاط الحافة السفلى (من اليسار لليمين) حسب نوع الحافة
  function hemPath(xl, xr, L, kind, sag=2.2, amp=1){
    const n = Math.max(6, Math.round((xr-xl)/5.5));
    const yAt = t => L - 1.6 + Math.sin(t*Math.PI)*sag; // منحنى بيضاوي خفيف
    let d = "";
    for(let i=0;i<n;i++){
      const t0=i/n, t1=(i+1)/n, xa=xl+(xr-xl)*t0, xb=xl+(xr-xl)*t1, ya=yAt(t0), yb=yAt(t1), xm=(xa+xb)/2, ym=(ya+yb)/2;
      if(kind==="scallop") d += ` Q${P(xm, ym+2.6*amp)} ${P(xb,yb)}`;
      else if(kind==="zigzag") d += ` L${P(xm, ym+2.4*amp)} L${P(xb,yb)}`;
      else if(kind==="petal") d += ` C${P(xa+(xb-xa)*.1, ym+3.6*amp)} ${P(xb-(xb-xa)*.1, ym+3.6*amp)} ${P(xb,yb)}`;
      else if(kind==="ruffle") d += ` Q${P(xa+(xb-xa)*.25, ym+1.5*amp)} ${P(xm, ym)} T${P(xb,yb)}`;
      else d += ` Q${P(xm, ym + (Math.sin(t1*Math.PI)-Math.sin(t0*Math.PI))*0 )} ${P(xb,yb)}`;
    }
    return d;
  }
  // جانب التنورة: من الخصر للحافة
  function sidePath(fromX, fromY, toX, toY, cut, left){
    const dx = toX - fromX, dy = toY - fromY;
    if(cut==="wide") return ` C${P(fromX + dx*.55, fromY + dy*.12)} ${P(toX - dx*.05, toY - dy*.45)} ${P(toX,toY)}`;
    if(cut==="bubble") return ` C${P(fromX + dx*1.25, fromY + dy*.3)} ${P(toX + dx*.35, toY - dy*.1)} ${P(toX,toY)}`;
    if(cut==="straight") return ` C${P(fromX + dx*.35, fromY + dy*.3)} ${P(toX, toY - dy*.4)} ${P(toX,toY)}`;
    return ` C${P(fromX + dx*.3, fromY + dy*.25)} ${P(toX - dx*.15, toY - dy*.35)} ${P(toX,toY)}`;
  }
  function skirtOutline(look, g, hemKind){
    const {L, xl, xr} = g;
    const wl = cx0-ww, wr = cx0+ww;
    let d = `M${P(wl,y0)}` + sidePath(wl,y0, xl, L-1.6, look.cut, true);
    d += hemPath(xl, xr, L, hemKind, look.cut==="bubble"?1.4:2.2);
    // رجوع من اليمين للخصر
    const dx = wr - xr, dy = y0 - (L-1.6);
    if(look.cut==="wide") d += ` C${P(xr+dx*.05, L-1.6+dy*.45)} ${P(wr - dx*.55, y0 - dy*.12)} ${P(wr,y0)}`;
    else if(look.cut==="bubble") d += ` C${P(xr - dx*.35, L-1.6+dy*.1)} ${P(wr - dx*1.25, y0 - dy*.3)} ${P(wr,y0)}`;
    else if(look.cut==="straight") d += ` C${P(xr, L-1.6+dy*.4)} ${P(wr - dx*.35, y0 - dy*.3)} ${P(wr,y0)}`;
    else d += ` C${P(xr+dx*.15, L-1.6+dy*.35)} ${P(wr-dx*.3, y0-dy*.25)} ${P(wr,y0)}`;
    return d + " Z";
  }

  /* ---------------- التنورة ---------------- */
  function skirt(look){
    const c1 = col(look.c1), c2 = col(look.c2), g = skirtGeom(look);
    const id = uid(), clip = id+"c", pat = id+"p", sh = id+"s";
    const box = [X(g.xl-6), Y(y0-1), X(g.xr-g.xl+12), Y(g.L-y0+8)];
    const outline = skirtOutline(look, g, look.hem==="ruffle" ? "straight" : look.hem);
    let s = `<defs><clipPath id="${clip}"><path d="${outline}"/></clipPath>${look.pat!=="none"?patternDef(pat, look.pat, look.pat==="daisies"?shade(c2,0):c2, look.patScale):""}
      <linearGradient id="${sh}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs>`;
    // البطانة تبين شوية تحت الحافة (عمق)
    const lin = {xl:g.xl+1.5, xr:g.xr-1.5, L:g.L+1};
    s += `<path d="M${P(lin.xl, lin.L-3)}${hemPath(lin.xl, lin.xr, lin.L, "straight", 2)} L${P(lin.xr, lin.L-4)} Z" fill="${shade(c2,-.12)}"/>`;
    // معطف: ذيل خلفي يطلع من الجوانب
    if(look.type==="coat") s += `<path d="M${P(cx0-ww-1, y0+1)} C${P(g.xl-5, y0+16)} ${P(g.xl-7, g.L-6)} ${P(g.xl-5, g.L+1.5)} L${P(g.xr+5, g.L+1.5)} C${P(g.xr+7, g.L-6)} ${P(g.xr+5, y0+16)} ${P(cx0+ww+1, y0+1)} Z" fill="${shade(c2,-.18)}"/>`;
    const base = look.type==="set" ? c2 : c1;
    s += `<path d="${outline}" fill="${base}"/>`;
    if(look.pat!=="none" && look.type!=="set") s += `<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="url(#${pat})" clip-path="url(#${clip})"/>`;
    // طيّات القماش
    const n = look.cut==="straight" ? 4 : look.cut==="wide" ? 9 : 7;
    let folds = "";
    for(let i=1;i<n;i++){
      const t=i/n, xw=cx0-ww+2*ww*t, xh=g.xl+(g.xr-g.xl)*t, yh=g.L-1.6+Math.sin(t*Math.PI)*2.2;
      const w=(g.xr-g.xl)/n*.36;
      folds += `<path d="M${P(xw-.2, y0+1)} L${P(xh-w, yh+1)} L${P(xh+w*.2, yh+1)} Z" fill="#000" fill-opacity="${look.fabric==="velvet"?.1:.06}"/><path d="M${P(xw+.3, y0+1)} L${P(xh+w*.4, yh+1)} L${P(xh+w, yh+1)} Z" fill="#fff" fill-opacity=".1"/>`;
    }
    s += `<g clip-path="url(#${clip})">${folds}<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="url(#${sh})"/></g>`;
    s += fabricLayer(look, clip, box);
    // طبقات
    if(look.cut==="layers"){
      [.36,.68].forEach((t,i)=>{ const yy=y0+(g.L-y0)*t, xl=cx0-ww+(g.xl-(cx0-ww))*t*1.05, xr=cx0+ww+(g.xr-(cx0+ww))*t*1.05;
        s += `<path d="M${P(xl,yy-1.6)}${hemPath(xl,xr,yy+.8,"ruffle",1.6,.8)}" fill="none" stroke="${shade(base,-.22)}" stroke-width="2.2" clip-path="url(#${clip})"/><path d="M${P(xl,yy-1.2)}${hemPath(xl,xr,yy+1.2,"ruffle",1.6,.8)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" clip-path="url(#${clip})"/>`; });
    }
    // تول فوق التنورة (فستان مناسبة/زي خاص)
    if(look.type==="festive" || look.fabric==="tulle"){
      const o = skirtOutline({...look, cut: look.cut==="straight"?"soft":look.cut}, {L:g.L+.6, xl:g.xl-1.4, xr:g.xr+1.4}, "scallop");
      s += `<path d="${o}" fill="${look.type==="festive"?c2:"#fff"}" fill-opacity="${look.type==="festive"?.38:.22}" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`;
    }
    if(look.type==="special"){ // بتلات كبيرة فوق التنورة
      const k=5; for(let i=0;i<k;i++){ const t=(i+.5)/k, xh=g.xl+(g.xr-g.xl)*t, xw=cx0-ww+2*ww*t;
        s += `<path d="M${P(xw, y0+1)} C${P(xh-5, y0+12)} ${P(xh-7, g.L-6)} ${P(xh, g.L-2+Math.sin(t*Math.PI)*2)} C${P(xh+7, g.L-6)} ${P(xh+5, y0+12)} ${P(xw, y0+1)} Z" fill="${c2}" fill-opacity=".42" stroke="${shade(c2,-.2)}" stroke-opacity=".5" stroke-width="1"/>`; }
    }
    // كشكش الحافة
    if(look.hem==="ruffle"){
      const xl=g.xl-.8, xr=g.xr+.8, L=g.L;
      s += `<path d="M${P(xl, L-4.4)}${hemPath(xl,xr,L-2.8,"straight")} L${P(xr,L-1.2)}${hemPath(xr,xl,L+1,"ruffle",2.2)} Z" fill="${c2}" stroke="${shade(c2,-.2)}" stroke-width="1"/>`;
    }
    // شريط على الحافة
    if(look.trims && look.trims.ribbon){ const xl=g.xl+1.2, xr=g.xr-1.2; s += `<path d="M${P(xl,g.L-4.6)}${hemPath(xl,xr,g.L-3,"straight",2.2)}" fill="none" stroke="${c2}" stroke-width="5" clip-path="url(#${clip})"/><path d="M${P(xl,g.L-4.6)}${hemPath(xl,xr,g.L-3,"straight",2.2)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1" stroke-dasharray="3 3" clip-path="url(#${clip})"/>`; }
    if(look.trims && look.trims.embroidery){ for(let i=0;i<7;i++){ const t=(i+.5)/7, x=g.xl+2+(g.xr-g.xl-4)*t, y=g.L-6+Math.sin(t*Math.PI)*2.2; s += embroideryFlower(x,y,c2); } }
    if(look.trims && look.trims.bows){ [.22,.5,.78].forEach(t=>{ const x=g.xl+(g.xr-g.xl)*t, y=y0+(g.L-y0)*.55+Math.sin(t*Math.PI)*1.5; s += bowAt(x,y,1.1,c2); }); }
    // معطف: لوحتين أماميتين مفتوحتين
    if(look.type==="coat"){
      const cc = shade(c2,-.05);
      s += `<path d="M${P(cx0-ww-.6, y0-.4)} C${P(g.xl-1, y0+14)} ${P(g.xl-3.5, g.L-8)} ${P(g.xl-3, g.L+.8)} L${P(g.xl+8, g.L+1.6)} C${P(cx0-7, g.L-12)} ${P(cx0-5, y0+12)} ${P(cx0-3, y0-.4)} Z" fill="${cc}" stroke="${shade(cc,-.25)}" stroke-width="1.2"/>`;
      s += `<path d="M${P(cx0+ww+.6, y0-.4)} C${P(g.xr+1, y0+14)} ${P(g.xr+3.5, g.L-8)} ${P(g.xr+3, g.L+.8)} L${P(g.xr-8, g.L+1.6)} C${P(cx0+7, g.L-12)} ${P(cx0+5, y0+12)} ${P(cx0+3, y0-.4)} Z" fill="${cc}" stroke="${shade(cc,-.25)}" stroke-width="1.2"/>`;
      s += `<path d="M${P(g.xl-3, g.L+.8)} L${P(g.xl+8, g.L+1.6)}M${P(g.xr+3, g.L+.8)} L${P(g.xr-8, g.L+1.6)}" stroke="${c1}" stroke-width="3"/>`;
    }
    s += `<path d="${outline}" fill="none" stroke="${shade(base,-.35)}" stroke-width="1.3" stroke-linejoin="round"/>`;
    if(look.sparkle) s += sparkles(g.xl+2, y0+4, g.xr-2, g.L-2, 7);
    return svg(s, "fz-skirt");
  }
  const embroideryFlower = (x,y,c) => `<g transform="translate(${X(x)} ${Y(y)})">${[0,60,120,180,240,300].map(a=>`<ellipse rx="1.4" ry="3" transform="rotate(${a}) translate(0 -2.6)" fill="none" stroke="${c}" stroke-width="1"/>`).join("")}<circle r="1.2" fill="${c}"/></g>`;
  const bowAt = (x,y,k,c) => `<g transform="translate(${X(x)} ${Y(y)}) scale(${k})"><path d="M0 0C-4-6-11-6-10 0-11 6-4 6 0 0zM0 0C4-6 11-6 10 0 11 6 4 6 0 0z" fill="${c}" stroke="${shade(c,-.3)}" stroke-width="1"/><path d="M-1 1l-4 9M1 1l4 9" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle r="2.2" fill="${shade(c,-.15)}"/></g>`;
  function sparkles(x0,y0_,x1,y1,n){
    let s = `<g class="fz-spk">`;
    for(let i=0;i<n;i++){ const x=x0+(x1-x0)*((i*37%n)/n+.5/n), y=y0_+(y1-y0_)*((i*53%n)/n+.3/n), r=2.4+(i%3);
      s += `<path d="M${X(x)} ${Y(y)-r}l${r*.3} ${r*.7} ${r*.7} ${r*.3}-${r*.7} ${r*.3}-${r*.3} ${r*.7}-${r*.3}-${r*.7}-${r*.7}-${r*.3} ${r*.7}-${r*.3}z" fill="#FFF8E0" style="animation-delay:${(-i*.37).toFixed(2)}s"/>`; }
    return s + `</g>`;
  }

  /* ---------------- الصدر (البودي) ---------------- */
  const NECK = `M${P(43.6,36.6)} Q${P(48.9,41.9)} ${P(56.1,36.4)}`;
  function bodice(look){
    const c1 = col(look.c1), c2 = col(look.c2), id=uid(), clip=id+"c", pat=id+"p";
    const set = look.type==="set";
    const bottom = set ? 60.5 : 53.2;
    let outline = `${NECK} L${P(58.4,36)} C${P(61,36.4)} ${P(62.8,37.6)} ${P(63,40)} L${P(62.2,46)} C${P(61.6,48)} ${P(61.4,50)} ${P(61.6,52.8)}`;
    if(set) outline += ` C${P(64,55)} ${P(66,58)} ${P(66.5,60.6)} Q${P(49,62.8)} ${P(31,60.8)} C${P(31.6,58)} ${P(33.4,55)} ${P(35.2,52.8)}`;
    else outline += ` Q${P(48.6,54.4)} ${P(35.2,52.9)}`;
    outline += ` C${P(35.6,50)} ${P(35.8,48)} ${P(35.4,46)} L${P(35.6,40)} C${P(36,37.6)} ${P(38.6,36.2)} ${P(41,36)} Z`;
    const box=[X(28),Y(34),X(42),Y(30)];
    let s = `<defs><clipPath id="${clip}"><path d="${outline}"/></clipPath>${look.pat!=="none"?patternDef(pat, look.pat, c2, look.patScale):""}</defs>`;
    // عباءة: الحافتين الأماميتين على الكتوف
    s += `<path d="${outline}" fill="${c1}"/>`;
    if(look.pat!=="none") s += `<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="url(#${pat})" clip-path="url(#${clip})"/>`;
    // ظل جانبي + كسرات الخياطة
    s += `<g clip-path="url(#${clip})"><path d="M${P(35,36)}h${X(4)}v${Y(30)}h-${X(4)}z" fill="#000" fill-opacity=".07"/><path d="M${P(60,36)}h${X(4)}v${Y(30)}h-${X(4)}z" fill="#000" fill-opacity=".09"/>
      <path d="M${P(41.5,41)} Q${P(42.5,47)} ${P(42,53)}M${P(56,41)} Q${P(55,47)} ${P(55.6,53)}" stroke="${shade(c1,-.3)}" stroke-opacity=".35" stroke-width="1" fill="none"/>
      ${set?`<path d="M${P(31,58)} Q${P(49,60.4)} ${P(66.5,58.2)}" stroke="${shade(c1,-.3)}" stroke-opacity=".35" stroke-width="1" fill="none"/>`:""}</g>`;
    s += fabricLayer(look, clip, box);
    // معطف: طيّة صدر
    if(look.type==="coat"){ const cc=shade(c2,-.05);
      s += `<path d="M${P(44,37)} L${P(41.5,43)} L${P(44.6,44)} L${P(46.4,53.3)} L${P(35.2,52.9)} C${P(35.8,48)} ${P(35.4,46)} ${P(35.6,40)} C${P(36,37.6)} ${P(38.6,36.2)} ${P(41,36)} Z" fill="${cc}" stroke="${shade(cc,-.25)}" stroke-width="1.1"/>
        <path d="M${P(55.8,36.8)} L${P(58.2,43)} L${P(55,44)} L${P(51,53.6)} L${P(61.6,52.8)} C${P(61.4,50)} ${P(61.6,48)} ${P(62.2,46)} L${P(63,40)} C${P(62.8,37.6)} ${P(61,36.4)} ${P(58.4,36)} Z" fill="${cc}" stroke="${shade(cc,-.25)}" stroke-width="1.1"/>
        ${[0,1].map(i=>`<circle cx="${X(43.4)}" cy="${Y(47+i*3)}" r="3" fill="${col("gold")}" stroke="${shade(col("gold"),-.3)}"/>`).join("")}`; }
    // ياقات
    s += collar(look, c1, c2);
    if(look.trims && look.trims.buttons) [42,45,48].forEach(y=>{ s += `<circle cx="${X(48.9)}" cy="${Y(y)}" r="3.3" fill="${c2}" stroke="${shade(c2,-.35)}" stroke-width="1"/><circle cx="${X(48.9)-.9}" cy="${Y(y)-.9}" r="1" fill="#fff" fill-opacity=".8"/>`; });
    if(look.trims && look.trims.embroidery) s += embroideryFlower(53.5,44,c2) + embroideryFlower(44.5,47.5,c2);
    // حزام
    if(!set) s += belt(look, c1, c2);
    else if(look.belt!=="none") s += belt({...look}, c1, c2, 57.6);
    if(look.type==="cape") s += `<path d="M${P(38.5,36.6)} Q${P(36.6,40)} ${P(36.2,45)}M${P(60,36.4)} Q${P(62.2,40)} ${P(62.4,45)}" stroke="${shade(c2,-.15)}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    s += neckAcc(look);
    s += `<path d="${outline}" fill="none" stroke="${shade(c1,-.4)}" stroke-width="1.2" stroke-linejoin="round"/>`;
    if(look.sparkle) s += sparkles(38, 39, 60, 51, 3);
    return svg(s, "fz-bodice");
  }
  function collar(look, c1, c2){
    const k = look.collar, cc = look.type==="coat" ? c1 : c2, e = shade(cc,-.3);
    if(k==="peter") return `<path d="M${P(43.6,36.6)} C${P(41.2,38.4)} ${P(42.4,41.6)} ${P(46,41.2)} Q${P(48.2,40.6)} ${P(48.9,39.4)} Q${P(46,38.8)} ${P(43.6,36.6)} Z" fill="${cc}" stroke="${e}" stroke-width="1"/><path d="M${P(56.1,36.4)} C${P(58.5,38.2)} ${P(57.4,41.6)} ${P(53.6,41.2)} Q${P(50.4,40.6)} ${P(48.9,39.4)} Q${P(52.6,38.6)} ${P(56.1,36.4)} Z" fill="${cc}" stroke="${e}" stroke-width="1"/>`;
    if(k==="square") return `<path d="M${P(43.6,36.6)} L${P(44.2,40.6)} L${P(55.4,40.6)} L${P(56.1,36.4)}" fill="none" stroke="${cc}" stroke-width="4"/>`;
    if(k==="bow") return `<path d="${NECK}" fill="none" stroke="${cc}" stroke-width="3.2"/>` + bowAt(48.9,40.2,.95,cc);
    if(k==="ruffle"){ let d=""; for(let i=0;i<9;i++){ const t=i/8, x=43.6+(56.1-43.6)*t, y=36.6+Math.sin(t*Math.PI)*2.75 - (t>.5?(t-.5)*.4:0); d+=`<circle cx="${X(x)}" cy="${Y(y+.5)}" r="3.6" fill="${cc}" stroke="${e}" stroke-width=".8"/>`; } return d; }
    return `<path d="${NECK}" fill="none" stroke="${cc}" stroke-width="3.4" stroke-linecap="round"/>`;
  }
  function belt(look, c1, c2, y=51.6){
    const b = look.belt; if(b==="none") return `<path d="M${P(35.2,y)} Q${P(48.6,y+1.5)} ${P(61.6,y-.2)}" stroke="${shade(c1,-.15)}" stroke-width="3" fill="none"/>`;
    const cc = b==="jewel" ? col("gold") : c2, band = `<path d="M${P(35.1,y-.2)} Q${P(48.6,y+1.3)} ${P(61.7,y-.4)}" stroke="${cc}" stroke-width="${b==="sash"?9:6}" fill="none"/><path d="M${P(35.1,y-.2)} Q${P(48.6,y+1.3)} ${P(61.7,y-.4)}" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" fill="none" transform="translate(0 -2)"/>`;
    if(b==="ribbon") return band + bowAt(60.6, y, .9, cc);
    if(b==="sash") return band + bowAt(61.2, y+.2, 1.5, cc);
    if(b==="jewel") return band + `<path d="M${X(48.8)} ${Y(y+.2)-6}l5 6-5 6-5-6z" fill="${col(look.c2)}" stroke="${shade(cc,-.4)}" stroke-width="1.2"/><circle cx="${X(48.8)-1.5}" cy="${Y(y+.2)-2}" r="1.2" fill="#fff"/>`;
    if(b==="flower") return band + `<g transform="translate(${X(39.5)} ${Y(y+.4)})">${[0,72,144,216,288].map(a=>`<ellipse rx="3.4" ry="5.4" transform="rotate(${a}) translate(0 -4.6)" fill="${shade(cc,.35)}" stroke="${shade(cc,-.25)}" stroke-width=".8"/>`).join("")}<circle r="3" fill="${col("honey")}"/></g>`;
    return band;
  }
  function neckAcc(look){
    const k = look.neck, s = look.accSize||1; if(!k || k==="none") return "";
    if(k==="pearls"){ let d=""; for(let i=0;i<11;i++){ const t=i/10, x=44.2+(55.6-44.2)*t, y=37.4+Math.sin(t*Math.PI)*2.9; d+=`<circle cx="${X(x)}" cy="${Y(y)}" r="${(1.9*s).toFixed(1)}" fill="#FBF7F0" stroke="#CBBFAE" stroke-width=".6"/>`; } return d; }
    if(k==="locket") return `<path d="M${P(44.4,37.2)} Q${P(48.9,41.6)} ${P(55.4,37)}" stroke="${col("gold")}" stroke-width="1.2" fill="none"/><path transform="translate(${X(48.9)} ${Y(40.6)}) scale(${s})" d="M0 9s-7-4.4-7-9a3.6 3.6 0 017-1.4A3.6 3.6 0 017 0c0 4.6-7 9-7 9z" fill="${col("gold")}" stroke="${shade(col("gold"),-.3)}" stroke-width="1"/>`;
    if(k==="flower") return `<path d="M${P(44.4,37.2)} Q${P(48.9,41.6)} ${P(55.4,37)}" stroke="${col(look.c2)}" stroke-width="1.6" fill="none"/><g transform="translate(${X(48.9)} ${Y(40.4)}) scale(${s})">${[0,72,144,216,288].map(a=>`<ellipse rx="2.4" ry="4" transform="rotate(${a}) translate(0 -3.4)" fill="#fff" stroke="${shade(col(look.c2),-.2)}" stroke-width=".7"/>`).join("")}<circle r="2.2" fill="${col("honey")}"/></g>`;
    return "";
  }

  /* ---------------- الأكمام ---------------- */
  // كل كم يتحرك ويا ذراعه. side: "L" (يسار الصورة) أو "R"
  function sleeve(look, side){
    const c1 = col(look.c1), c2 = col(look.c2), w = look.sleeveW ?? 1, k = look.sleeve;
    const L = side==="L";
    const m = (x) => L ? x : 97.4 - x; // مرآة تقريبية حول الجسم
    const yo = L ? 0 : 1.2;               // اليمين أوطى شوية بالصورة
    const pt = (x,y) => P(m(x), y + yo*((44-x)>0?Math.min(1,(44-x)/10):0));
    const base = look.type==="coat" ? c2 : c1, e = shade(base,-.38);
    const id = uid(), pat = id+"p", clip=id+"c";
    let d, cuff="", extra="";
    const o = (v) => 34 - (34 - v)*(.75 + w*.25); // عرض الكم
    if(k==="long" || k==="bell"){
      // كم يمشي ويا الذراع لحد الرسغ
      const wr = L ? [[13,48.8],[13.4,54.6]] : [[86.6,54.2],[86,59.6]];
      const bell = k==="bell" ? 2.2*w : 0;
      if(L) d = `M${P(41.6,36.4)} C${P(36,35.6)} ${P(o(31.6),37.6)} ${P(o(31.2),42.4)} L${P(21,47.2)} L${P(wr[0][0],wr[0][1]-bell)} L${P(wr[1][0]-bell*.3,wr[1][1]+bell)} L${P(23,52.6)} L${P(37.4,49.2)} C${P(37.8,45)} ${P(37.4,40)} ${P(41.6,36.4)} Z`;
      else d = `M${P(57,36.3)} C${P(63,35.8)} ${P(66+(1-o(31.6)/31.6)*30,38)} ${P(70.6,42)} L${P(79.6,49.6)} L${P(wr[0][0],wr[0][1]-bell)} L${P(wr[1][0]+bell*.3,wr[1][1]+bell)} L${P(78,56.6)} L${P(66.2,51.4)} L${P(61.6,47.6)} C${P(61.2,43)} ${P(60.8,39)} ${P(57,36.3)} Z`;
      cuff = L ? `<path d="M${P(wr[0][0]+1.6,wr[0][1]-bell)} L${P(wr[1][0]+1.6-bell*.3,wr[1][1]+bell)}" stroke="${c2}" stroke-width="4.5"/>` : `<path d="M${P(wr[0][0]-1.6,wr[0][1]-bell)} L${P(wr[1][0]-1.6+bell*.3,wr[1][1]+bell)}" stroke="${c2}" stroke-width="4.5"/>`;
    } else {
      const puff = k==="puff" ? 1.4 : k==="flutter" ? 1.1 : .55;
      const ox = 31.6 - (puff-1)*3*w, oy = 41.8;
      const ry = k==="puff" ? 0 : k==="cap" ? 1 : .4;
      if(L) d = `M${P(41.8,36.3)} C${P(37.4,35.2)} ${P(ox-1*w,37)} ${P(ox,oy)} C${P(ox-.4*w,44)} ${P(29.6,45.6)} ${P(30,46.6)} Q${P(33.4,49.2)} ${P(37.6,48.4)} C${P(37.8,45)} ${P(37.4,40)} ${P(41.8,36.3)} Z`;
      else { const rx = 72.8 + (puff-1)*2.6*w; d = `M${P(56.8,36.2)} C${P(62,35+ry)} ${P(rx-1,37.4+ry)} ${P(rx,42.6)} C${P(rx+.8,45)} ${P(74.4,47.4)} ${P(73.8,48.8)} Q${P(68.4,51)} ${P(63.4,49.8)} Q${P(62,48.4)} ${P(61.6,47)} C${P(61.2,43)} ${P(60.8,39)} ${P(56.8,36.2)} Z`; }
      if(k==="puff") cuff = L ? `<path d="M${P(30.2,46.4)} Q${P(33.4,49)} ${P(37.4,48.2)}" stroke="${c2}" stroke-width="4" fill="none" stroke-linecap="round"/>` : `<path d="M${P(73.6,48.6)} Q${P(68.4,50.8)} ${P(63.6,49.6)}" stroke="${c2}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      if(k==="flutter"){ // كشكش بطبقتين
        const fy = L ? [[28.6,45.6],[33.2,50.2],[38,49]] : [[75.4,48],[68.6,52.2],[63,50.4]];
        extra = `<path d="M${P(fy[0][0],fy[0][1]-2)} Q${P(fy[0][0]-1.4,fy[0][1]+2)} ${P((fy[0][0]+fy[1][0])/2,fy[1][1]+.8)} Q${P(fy[1][0],fy[1][1]+2.4)} ${P(fy[2][0],fy[2][1])} L${P(fy[2][0],fy[2][1]-3)} Z" fill="${c2}" fill-opacity=".85" stroke="${shade(c2,-.3)}" stroke-width="1"/>`;
      }
    }
    let s = `<defs><clipPath id="${clip}"><path d="${d}"/></clipPath>${look.pat!=="none"&&look.type!=="set"?patternDef(pat, look.pat, c2, look.patScale):""}</defs>`;
    s += `<path d="${d}" fill="${base}"/>`;
    const box=[0,Y(32),360,Y(30)];
    if(look.pat!=="none" && look.type!=="set" && look.type!=="coat") s += `<rect x="0" y="${box[1]}" width="360" height="${box[3]}" fill="url(#${pat})" clip-path="url(#${clip})"/>`;
    s += `<path d="${d}" fill="#000" fill-opacity="0"/>` + fabricLayer(look, clip, box);
    if(k==="puff"||k==="cap") s += `<path d="${L?`M${P(36,37.6)} Q${P(33.6,40)} ${P(33.6,44.6)}`:`M${P(61.4,37.6)} Q${P(65.4,40)} ${P(66.6,45.8)}`}" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`;
    s += extra + cuff + `<path d="${d}" fill="none" stroke="${e}" stroke-width="1.2" stroke-linejoin="round"/>`;
    return svg(s, "fz-sleeve");
  }

  /* ---------------- إكسسوار الراس ---------------- */
  function headAcc(look){
    const k = look.head, s = look.accSize||1, c2 = col(look.c2), c1 = col(look.c1);
    if(!k || k==="none") return "";
    let g = "";
    if(k==="bow") g = `<g transform="translate(${X(67)} ${Y(12)}) rotate(18) scale(${1.9*s})">${bowAt(0,0,1,c2).replace(/translate\([^)]*\)/,"translate(0 0)")}</g>`;
    if(k==="tiara") g = `<g transform="translate(${X(53)} ${Y(5.2)}) rotate(-4) scale(${s})"><path d="M-34 8C-20 2 20 2 34 8L30 -2 18 4 10 -10 0 2 -10 -10 -18 4 -30 -2z" fill="${col("gold")}" stroke="#9C7A2E" stroke-width="1.6" stroke-linejoin="round"/><circle cy="-3" r="3.6" fill="${c1}" stroke="#9C7A2E"/><circle cx="-10" cy="-8" r="2.2" fill="#fff"/><circle cx="10" cy="-8" r="2.2" fill="#fff"/></g>`;
    if(k==="flowers"){ const pts=[[33,15],[39,9.4],[46,6.4],[53,5.4],[60,6],[66.4,8.4],[71.6,12.4]]; g = `<path d="M${pts.map(p=>P(p[0],p[1])).join(" L")}" stroke="#7FA37A" stroke-width="${3*s}" fill="none" stroke-linecap="round"/>` + pts.map(([x,y],i)=>`<g transform="translate(${X(x)} ${Y(y)}) scale(${s*(i%2?.8:1)})">${[0,72,144,216,288].map(a=>`<ellipse rx="3.2" ry="5.2" transform="rotate(${a}) translate(0 -4.4)" fill="${i%2?c2:c1}" stroke="${shade(i%2?c2:c1,-.3)}" stroke-width=".8"/>`).join("")}<circle r="2.8" fill="${col("honey")}"/></g>`).join(""); }
    if(k==="star") g = `<g transform="translate(${X(35.4)} ${Y(16)}) rotate(-12) scale(${1.25*s})"><path d="M0-12l3.6 7.6 8.4 1.2-6 5.8 1.4 8.4L0 7 -7.4 11l1.4-8.4-6-5.8 8.4-1.2z" fill="${col("gold")}" stroke="#9C7A2E" stroke-width="1.4" stroke-linejoin="round"/><circle cx="-2" cy="-3" r="1.6" fill="#fff"/></g>`;
    if(k==="butterfly") g = `<g transform="translate(${X(66)} ${Y(11)}) rotate(14) scale(${1.4*s})"><path d="M0 0C-6-12-18-10-15 0-18 10-7 11 0 0zM0 0C6-12 18-10 15 0 18 10 7 11 0 0z" fill="${c2}" stroke="${shade(c2,-.35)}" stroke-width="1.2"/><circle cx="-8" cy="-3" r="2.2" fill="${c1}"/><circle cx="8" cy="-3" r="2.2" fill="${c1}"/><path d="M0-6v12" stroke="${shade(c2,-.5)}" stroke-width="2.2" stroke-linecap="round"/></g>`;
    return svg(g, "fz-acc");
  }

  /* ---------------- الجناح والعباءة (الطبقة الخلفية) ---------------- */
  const WSH = {
    butterfly:{t:"M0 0C20-60 70-130 115-120C140-112 128-60 100-35C70-12 30-4 0 0Z", b:"M0 0C30 8 75 20 88 45C98 68 70 90 48 78C25 64 10 30 0 0Z", v:"M0 0L95-95M0 0L105-55M0 0L70 55"},
    leaf:{t:"M0 0C30-40 90-110 132-120C124-70 84-18 0 0Z", b:"M0 0C30 15 70 50 82 88C46 82 14 46 0 0Z", v:"M0 0Q70-55 130-118M40-28l8-26M80-70l2-22M40-28l22 2M80-70l22-4M0 0Q45 40 80 86"},
    petal:{t:"M0 0C8-70 58-132 100-112C126-96 100-40 0 0ZM0 0C48-40 120-62 136-30C142-4 80 6 0 0Z", b:"M0 0C50 10 96 40 86 72C70 92 30 56 0 0Z", v:""},
    cloud:{t:"M0 0C0-30 25-55 50-50C55-82 96-92 112-66C136-72 152-40 132-20C142 2 112 16 92 6C62 16 20 10 0 0Z", b:"M0 0C20 10 50 8 62 24C86 30 86 62 60 62C50 82 18 72 20 50C4 40 0 20 0 0Z", v:""},
    star:{t:"M0 0L38-58L58-128L80-70L138-60L82-26Z", b:"M0 0L62 14L98 56L46 46L22 84Z", v:"M0 0L58-128M0 0L138-60M0 0L98 56"},
    crystal:{t:"M0 0L28-92L80-128L122-82L96-24Z", b:"M0 0L72 10L92 52L56 82L16 42Z", v:"M0 0L80-128M28-92L96-24M0 0L122-82M0 0L56 82M72 10L16 42"},
    geo:{t:"M0 0L0-70L60-110L120-76L120-20L60 10Z", b:"M0 0L60 10L82 62L30 82Z", v:"M60-110L60 10M0-70L120-20M120-76L0 0"},
    aurora:{t:"M0 0C30-30 60-110 40-150C90-120 150-90 160-40C120-30 60-10 0 0Z", b:"M0 0C40 10 110 30 140 80C90 90 40 60 0 0Z", v:"M0 0Q60-60 40-150M0 0Q90-40 160-40M0 0Q80 30 140 80"},
    glow:{t:"M0 0C10-50 50-110 100-110C140-110 140-50 110-30C80-10 40-4 0 0Z", b:"M0 0C40 6 90 20 96 52C100 80 60 86 40 70C20 54 6 30 0 0Z", v:"", eye:1},
    monarch:{t:"M0 0C16-56 64-124 118-122C146-118 132-62 104-36C72-12 30-4 0 0Z", b:"M0 0C30 8 78 18 92 46C102 72 72 94 48 80C24 66 10 30 0 0Z", v:"M0 0L104-112M0 0L122-80M0 0L110-46M0 0L88 54M0 0L60 78", mon:1},
    patchwork:{t:"M0 0L20-80L70-120L120-90L110-30Z", b:"M0 0L70 12L90 60L40 80Z", v:"M20-80L110-30M70-120L60-10M0 0L120-90M70 12L40 80", patch:1}
  };
  function wingShape(w, part){ const base = w.shape==="custom" ? (part==="t" ? WSH[w.top]||WSH.butterfly : WSH[w.bot]||WSH.butterfly) : (WSH[w.shape]||WSH.butterfly); return {d: base[part], v: base.v, eye: base.eye, mon: base.mon, patch: base.patch}; }
  function wings(w, opts={}){
    if(!w || !w.on) return "";
    const id = uid(), c1 = col(w.c1), c2 = col(w.c2);
    const ax = X(48.6), ay = Y(43);
    const sz = w.size||1, spread = w.spread||0, alpha = w.alpha??.85, anim = opts.anim!==false;
    const dur = (1.6 / (w.speed||1)).toFixed(2);
    const flapV = w.flap==="flutter" ? ".55 1;1 1;.55 1" : w.flap==="soft" ? ".82 1;1 1;.82 1" : null;
    const defs = `<radialGradient id="${id}g" cx="0" cy="0" r="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${w.grad?c2:c1}"/><stop offset=".85" stop-color="${c1}"/></radialGradient>
      <linearGradient id="${id}s" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity="${(w.shine*.7).toFixed(2)}"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>
      ${w.pat && w.pat!=="none" ? patternDef(id+"p", w.pat, shade(c2,-.15), .9) : ""}`;
    const one = (k) => {
      const T = wingShape(w,"t"), B = wingShape(w,"b");
      let g = "";
      for(let l=w.layers||1; l>=1; l--){
        const sc = (1 - (l-1)*.2)*k, fill = l===1 ? `url(#${id}g)` : shade(l===2?c2:c1, .25);
        g += `<g transform="scale(${sc})"><path d="${B.d}" fill="${fill}" fill-opacity="${alpha}" stroke="${shade(c1,-.35)}" stroke-width="${2/sc}" stroke-linejoin="round"/><path d="${T.d}" fill="${fill}" fill-opacity="${alpha}" stroke="${shade(c1,-.35)}" stroke-width="${2/sc}" stroke-linejoin="round"/>`;
        if(l===1){
          if(w.pat && w.pat!=="none") g += `<clipPath id="${id}c"><path d="${T.d}"/><path d="${B.d}"/></clipPath><rect x="-10" y="-170" width="190" height="270" fill="url(#${id}p)" clip-path="url(#${id}c)" opacity=".85"/>`;
          if(T.v) g += `<path d="${T.v}" stroke="${T.mon?"#3A2A22":shade(c1,-.3)}" stroke-width="${T.mon?3:1.4}" stroke-opacity="${T.mon?.8:.5}" fill="none"/>`;
          if(T.eye) g += `<circle cx="72" cy="-62" r="15" fill="${c2}" stroke="#fff" stroke-width="3"/><circle cx="58" cy="44" r="9" fill="${c2}" stroke="#fff" stroke-width="2"/>`;
          if(T.mon) g += `<path d="${T.d}" fill="none" stroke="#3A2A22" stroke-width="5"/>${[[110,-112],[124,-80],[96,70],[70,82]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="#fff"/>`).join("")}`;
          if(T.patch) g += `<path d="M20-80L110-30L120-90Z" fill="${c2}" fill-opacity=".7"/><path d="M70 12L90 60L40 80Z" fill="${c2}" fill-opacity=".7"/><path d="${T.d}${B.d}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>`;
          if(w.shine>0) g += `<path d="${T.d}" fill="url(#${id}s)"/>`;
        }
        g += `</g>`;
      }
      return g;
    };
    const flap = (dir) => anim && flapV && motionOKSafe() ? `<animateTransform attributeName="transform" type="scale" values="${flapV.split(";").map(v=>v.split(" ").map((n,i)=>i?n:(dir*n)).join(" ")).join(";")}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>` : "";
    let trail = "";
    if(w.trail && anim && motionOKSafe()) for(let i=0;i<6;i++){ const side=i%2?1:-1, x=ax+side*(60+i*9)*sz, y=ay-40+i*14;
      trail += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${2+i%3}" fill="#FFF7D6"><animate attributeName="cy" values="${y};${y+70}" dur="${(2.2+i*.3).toFixed(1)}s" repeatCount="indefinite" begin="${(-i*.4).toFixed(1)}s"/><animate attributeName="opacity" values="1;0" dur="${(2.2+i*.3).toFixed(1)}s" repeatCount="indefinite" begin="${(-i*.4).toFixed(1)}s"/></circle>`; }
    const R = `<g transform="translate(${ax} ${ay}) rotate(${-spread})"><g>${flap(1)}${one(sz*1.55)}</g></g>`;
    const Lw = `<g transform="translate(${ax} ${ay}) scale(-1 1) rotate(${-spread})"><g>${flap(1)}${one(sz*1.55)}</g></g>`;
    return `<defs>${defs}</defs><g class="fz-wings"${w.flap==="none"?"":""}>${Lw}${R}</g>${trail}`;
  }
  const motionOKSafe = () => typeof motionOK==="function" ? motionOK() : true;
  function cape(look){
    if(look.type!=="cape") return "";
    const c1 = col(look.c1), c2 = col(look.c2), g = skirtGeom(look), L = Math.min(97, g.L+3.5);
    return `<path d="M${P(39,37)} C${P(28,48)} ${P(14,70)} ${P(8,L)} Q${P(47,L+3.5)} ${P(88,L)} C${P(80,70)} ${P(68,48)} ${P(58,37)} Z" fill="${c2}" stroke="${shade(c2,-.3)}" stroke-width="1.4"/><path d="M${P(39,37)} C${P(32,50)} ${P(24,70)} ${P(19,L-1)} L${P(14,L)} C${P(20,70)} ${P(30,48)} ${P(39,37)} Z" fill="${shade(c1,-.1)}" fill-opacity=".8"/>`;
  }
  function back(look, w, opts){ return svg(wings(w, opts) + cape(look), "fz-backsvg"); }

  /* ---------------- الدمية: إيلاف بأجزاء صورتها الأصلية + ملابس ---------------- */
  // نفس مقصوصات حكاياتنا، مع تعديلات صغيرة حتى الملابس الجديدة تغطي الفستان الأصلي تماماً
  const poly = pts => `polygon(${pts.map(([x,y])=>`${x}% ${y}%`).join(",")})`;
  const DCLIP = {
    legL:{o:[34,82], c:[[22,81],[43.89,81],[43.89,100],[10,100],[14,90]]},
    legR:{o:[49,82], c:[[43.89,81.2],[61,81.2],[64.6,84],[68,86],[68,100],[43.89,100]]},
    armL:{o:[33,47.5], c:[[0,44],[30,44],[33.4,45.4],[37,46.6],[36,49.4],[31,52.5],[14,55.5],[0,56]]},
    armR:{o:[68,48], c:[[62.5,45.2],[73.5,43.5],[78,47.5],[92,53],[100,52],[100,64],[92,65],[80,58],[72,53.4],[68.2,50.6],[66.4,48.9],[63.6,47.8]]},
    head:{o:[50,35], c:[[12,0],[100,0],[100,33],[76,33],[72,35.2],[62,35.6],[58.4,35.6],[57.2,35.8],[56,37],[52.6,39.4],[48.8,40],[45.8,39.2],[43.6,37.2],[41.6,35],[39,33],[12,33]]},
    hair:{o:[56,19], c:[[12,0],[100,0],[100,22],[12,22]], mask:"linear-gradient(180deg,#000 0,#000 15%,transparent 21%)"}
  };
  const imgPart = (k) => { const p=DCLIP[k]; return `<img class="rp rp-${k}" data-p="${k}" src="${GIRL}" alt="" draggable="false" decoding="async" style="clip-path:${poly(p.c)};-webkit-clip-path:${poly(p.c)};transform-origin:${p.o[0]}% ${p.o[1]}%;${p.mask?`-webkit-mask-image:${p.mask};mask-image:${p.mask};`:""}">`; };
  function dollHTML(look, w, opts={}){
    look = Object.assign(BLANK(), look||{}); w = Object.assign(BLANK_WINGS(), w||{});
    return `<div class="rig rig-elaf fdoll${look.flow?"":" still"}" style="aspect-ratio:${360/500}" role="img" aria-label="${opts.label?esc(opts.label):"إيلاف بالإطلالة"}">
      <div class="fz fz-back">${back(look, w, opts)}</div>
      ${imgPart("legL")}${imgPart("legR")}
      <div class="rp fz" data-p="skirt" style="transform-origin:45% 52.5%">${skirt(look)}</div>
      ${imgPart("armL")}${imgPart("armR")}${imgPart("head")}
      <div class="fz fz-core">${bodice(look)}</div>
      <div class="fz fz-sl" data-sl="armL" style="transform-origin:33% 47.5%">${sleeve(look,"L")}</div>
      <div class="fz fz-sl" data-sl="armR" style="transform-origin:68% 48%">${sleeve(look,"R")}</div>
      ${imgPart("hair")}
      <div class="fz fz-acc" style="transform-origin:50% 35%">${headAcc(look)}</div>
    </div>`;
  }
  // تحديث الملابس بدون ما نعيد بناء الصورة
  function dollSet(root, look, w, opts={}){
    const d = root.classList && root.classList.contains("fdoll") ? root : root.querySelector(".fdoll"); if(!d) return;
    look = Object.assign(BLANK(), look||{}); w = Object.assign(BLANK_WINGS(), w||{});
    d.querySelector(".fz-back").innerHTML = back(look, w, opts);
    d.querySelector('[data-p="skirt"]').innerHTML = skirt(look);
    d.querySelector(".fz-core").innerHTML = bodice(look);
    d.querySelector('[data-sl="armL"]').innerHTML = sleeve(look,"L");
    d.querySelector('[data-sl="armR"]').innerHTML = sleeve(look,"R");
    d.querySelector(".fz-acc").innerHTML = headAcc(look);
    d.classList.toggle("still", !look.flow);
  }
  // بعد TRig.update: الأكمام تتبع الذراع، والإكسسوار يتبع الراس
  function dollSync(d){
    if(!d) return;
    const a = d.querySelector('[data-p="armL"]'), b = d.querySelector('[data-p="armR"]'), hd = d.querySelector('[data-p="head"]');
    const sl = d.querySelectorAll(".fz-sl");
    if(sl[0] && a) sl[0].style.transform = a.style.transform;
    if(sl[1] && b) sl[1].style.transform = b.style.transform;
    const acc = d.querySelector(".fz-acc"); if(acc && hd) acc.style.transform = hd.style.transform;
  }

  /* ---------------- أصدقاء الدار ---------------- */
  const S = (vb, inner) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const F = {};
  F.seam = () => S("0 0 100 90", `<path d="M50 44C38 18 10 16 12 38c2 18 22 18 38 6zM50 44C62 18 90 16 88 38c-2 18-22 18-38 6z" fill="#F3A9C8" stroke="#A04E78" stroke-width="2.4"/><path d="M50 46C40 60 26 74 30 80c4 6 16-8 20-30zM50 46c10 14 24 28 20 34-4 6-16-8-20-30z" fill="#B9A6DD" stroke="#6E5A9E" stroke-width="2.2"/><ellipse cx="50" cy="48" rx="4.6" ry="16" fill="#6B4A63"/><circle cx="50" cy="30" r="7" fill="#7A5872"/><circle cx="47.6" cy="29" r="1.4" fill="#fff"/><circle cx="52.4" cy="29" r="1.4" fill="#fff"/><path d="M46 24q-6-12-12-10M54 24q6-12 12-10" stroke="#6B4A63" stroke-width="2" fill="none"/><path d="M14 64c12 8 30 8 72-2" stroke="#F2D27A" stroke-width="4" fill="none" stroke-dasharray="5 3"/>`);
  F.bird = () => S("0 0 100 80", `<path d="M20 46C20 26 40 16 58 22c14 4 22 16 20 30-2 14-18 20-34 18C30 68 20 58 20 46z" fill="#8EC3E8" stroke="#3F6E92" stroke-width="2.6"/><path d="M40 40c10-12 26-14 34-6-8 2-16 8-20 16z" fill="#C9E4F6" stroke="#3F6E92" stroke-width="2"/><circle cx="66" cy="32" r="3" fill="#2E2A22"/><path d="M76 34l12 2-12 5z" fill="#F2C14E" stroke="#B88F33" stroke-width="1.6"/><path d="M22 48L6 42l4 12z" fill="#6FA8D6" stroke="#3F6E92" stroke-width="2"/><rect x="34" y="54" width="30" height="20" rx="2" fill="#FBF6E8" stroke="#B9A07A" stroke-width="2" transform="rotate(-8 49 64)"/><path d="M35 56l14 9 14-11" stroke="#B9A07A" stroke-width="2" fill="none" transform="rotate(-8 49 64)"/><circle cx="49" cy="64" r="3" fill="#E05A7A"/>`);
  F.mouse = () => S("0 0 100 100", `<path d="M78 82c10 2 16-6 12-14" stroke="#B98E8E" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="54" cy="70" rx="24" ry="20" fill="#C9C2D2" stroke="#6E6478" stroke-width="2.6"/><circle cx="32" cy="22" r="14" fill="#C9C2D2" stroke="#6E6478" stroke-width="2.6"/><circle cx="32" cy="22" r="8" fill="#F3B8C8"/><circle cx="66" cy="22" r="14" fill="#C9C2D2" stroke="#6E6478" stroke-width="2.6"/><circle cx="66" cy="22" r="8" fill="#F3B8C8"/><ellipse cx="49" cy="44" rx="22" ry="19" fill="#D8D2E0" stroke="#6E6478" stroke-width="2.6"/><circle cx="41" cy="42" r="3" fill="#2E2A22"/><circle cx="57" cy="42" r="3" fill="#2E2A22"/><circle cx="49" cy="51" r="3.4" fill="#E58FA8"/><path d="M30 50l-10-2M30 54l-10 2M68 50l10-2M68 54l10 2" stroke="#6E6478" stroke-width="1.4"/><path d="M38 76h22l-3 14h-16z" fill="#D9AE4E" stroke="#9C7A2E" stroke-width="2"/><path d="M40 80h18M41 84h16" stroke="#9C7A2E" stroke-width="1.2"/>`);
  F.rabbit = () => S("0 0 100 110", `<ellipse cx="38" cy="22" rx="8" ry="20" fill="#F4EEE2" stroke="#8C7D66" stroke-width="2.4" transform="rotate(-10 38 22)"/><ellipse cx="62" cy="22" rx="8" ry="20" fill="#F4EEE2" stroke="#8C7D66" stroke-width="2.4" transform="rotate(10 62 22)"/><ellipse cx="50" cy="84" rx="26" ry="22" fill="#F4EEE2" stroke="#8C7D66" stroke-width="2.4"/><circle cx="50" cy="52" r="20" fill="#FBF7EE" stroke="#8C7D66" stroke-width="2.4"/><circle cx="43" cy="50" r="2.8" fill="#2E2A22"/><circle cx="57" cy="50" r="2.8" fill="#2E2A22"/><path d="M47 58q3 3 6 0" stroke="#8C7D66" stroke-width="2" fill="none"/><path d="M30 46q-2-18 20-20 22 2 20 20" stroke="#3E3A44" stroke-width="3.4" fill="none"/><rect x="25" y="44" width="8" height="12" rx="3" fill="#3E3A44"/><path d="M33 54q8 10 14 8" stroke="#3E3A44" stroke-width="2" fill="none"/><circle cx="47" cy="62" r="2.4" fill="#3E3A44"/><rect x="40" y="76" width="20" height="14" rx="2" fill="#E8C066" stroke="#9C7A2E" stroke-width="1.6"/><path d="M43 80h14M43 84h10" stroke="#9C7A2E" stroke-width="1.2"/>`);
  F.owl = () => S("0 0 100 100", `<path d="M22 40C22 18 78 18 78 40v34c0 14-12 20-28 20S22 88 22 74z" fill="#B99472" stroke="#6B4A33" stroke-width="2.6"/><path d="M34 60c4 10 28 10 32 0v18c-4 8-28 8-32 0z" fill="#E9D8BE"/><circle cx="38" cy="42" r="11" fill="#FBF6E8" stroke="#6B4A33" stroke-width="2"/><circle cx="62" cy="42" r="11" fill="#FBF6E8" stroke="#6B4A33" stroke-width="2"/><circle cx="38" cy="43" r="4.6" fill="#2E2A22"/><circle cx="62" cy="43" r="4.6" fill="#2E2A22"/><circle cx="38" cy="42" r="12.5" fill="none" stroke="#D9AE4E" stroke-width="2.4"/><circle cx="62" cy="42" r="12.5" fill="none" stroke="#D9AE4E" stroke-width="2.4"/><path d="M50.5 42h-1" stroke="#D9AE4E" stroke-width="2.4"/><path d="M46 52l4 6 4-6z" fill="#E8A64A"/><path d="M24 24l10 10M76 24L66 34" stroke="#6B4A33" stroke-width="3" stroke-linecap="round"/><path d="M60 80c8 0 14 6 14 6" stroke="#E86CA8" stroke-width="3" fill="none"/><circle cx="76" cy="88" r="3.6" fill="#E86CA8"/>`);
  F.cbfly = (c="#F3A9B8") => S("0 0 40 30", `<path d="M20 15C16 4 4 4 6 13c-2 8 8 10 14 2zM20 15C24 4 36 4 34 13c2 8-8 10-14 2z" fill="${c}" stroke="${shade(c,-.35)}" stroke-width="1.4"/><path d="M20 9v12" stroke="#4A3A44" stroke-width="2" stroke-linecap="round"/>`);

  /* ---------------- معالم خريطة الدار ---------------- */
  const LM = {};
  LM.atelier = () => S("0 0 160 140", `<ellipse cx="80" cy="128" rx="66" ry="10" fill="#000" opacity=".12"/><path d="M28 60h104v64H28z" fill="#FBEFE6" stroke="#9C6E5E" stroke-width="3"/><path d="M20 62L80 18l60 44z" fill="#E59AAE" stroke="#9C4E62" stroke-width="3" stroke-linejoin="round"/><path d="M20 62h120" stroke="#9C4E62" stroke-width="3"/><path d="M28 62q13 12 26 0 13 12 26 0 13 12 26 0 13 12 26 0" fill="#F7CFDA" stroke="#9C4E62" stroke-width="2"/><rect x="104" y="14" width="16" height="30" rx="3" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2.4"/><path d="M104 22h16M104 36h16" stroke="#9C7A2E" stroke-width="2"/><rect x="40" y="80" width="30" height="28" rx="4" fill="#BFE0F0" stroke="#6E8EA6" stroke-width="2.4"/><path d="M55 80v28M40 94h30" stroke="#6E8EA6" stroke-width="2"/><path d="M90 124V86q12-14 24 0v38z" fill="#C98E6E" stroke="#7A4E3E" stroke-width="2.4"/><circle cx="108" cy="106" r="2.4" fill="#F2D27A"/><path d="M48 70l-6 12M48 70l6 12" stroke="#7A5872" stroke-width="2"/>`);
  LM.wings = () => S("0 0 160 140", `<ellipse cx="80" cy="128" rx="60" ry="9" fill="#000" opacity=".12"/><path d="M80 50C60 10 16 8 20 40c4 22 34 24 60 10zM80 50c20-40 64-42 60-10-4 22-34 24-60 10z" fill="#E4D8F4" stroke="#7E6AAE" stroke-width="3"/><path d="M80 52C64 70 40 84 46 92s26-12 34-38zM80 52c16 18 40 32 34 40s-26-12-34-38z" fill="#CFE6F4" stroke="#5E8EAE" stroke-width="2.6"/><path d="M42 74h76v52H42z" fill="#FBF6EE" stroke="#8C7D9E" stroke-width="3"/><path d="M36 76l44-22 44 22z" fill="#B9A6DD" stroke="#6E5A9E" stroke-width="3" stroke-linejoin="round"/><path d="M70 126V98q10-10 20 0v28z" fill="#9E86C8" stroke="#5E4A8E" stroke-width="2.4"/><circle cx="56" cy="96" r="7" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2"/><circle cx="104" cy="96" r="7" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2"/>`);
  LM.fabrics = () => S("0 0 160 140", `<ellipse cx="80" cy="128" rx="66" ry="10" fill="#000" opacity=".12"/><path d="M24 50h112v76H24z" fill="#FFF6E4" stroke="#A88A5E" stroke-width="3"/><path d="M18 52h124l-8-20H26z" fill="#9DBF8E" stroke="#5E8257" stroke-width="3" stroke-linejoin="round"/>${["#F2A7B8","#A8D2EE","#F6E08A","#C9B6E8","#A9DCC4"].map((c,i)=>`<path d="M${30+i*21} 52v${26+(i%2)*10}q8 6 16 0v-${26+(i%2)*10}" fill="${c}" stroke="${shade(c,-.35)}" stroke-width="2"/>`).join("")}<rect x="40" y="96" width="80" height="30" fill="#E9D6B8" stroke="#A88A5E" stroke-width="2.4"/>${["#E59AAE","#5E9BC9","#E8C066","#8E5A9E"].map((c,i)=>`<ellipse cx="${52+i*19}" cy="108" rx="8" ry="9" fill="${c}" stroke="${shade(c,-.35)}" stroke-width="2"/><circle cx="${52+i*19}" cy="108" r="2.6" fill="#FBF6E8"/>`).join("")}`);
  LM.fitting = () => S("0 0 160 140", `<ellipse cx="80" cy="128" rx="54" ry="9" fill="#000" opacity=".12"/><path d="M44 126V40q36-34 72 0v86z" fill="#F7E6EE" stroke="#9C6E82" stroke-width="3"/><path d="M58 118V48q22-22 44 0v70z" fill="#DCEEF6" stroke="#9C6E82" stroke-width="2.6"/><path d="M66 54l12 30M84 50l10 22" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/><circle cx="80" cy="20" r="7" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2"/><path d="M28 126V84h16v42M116 126V84h16v42" fill="#F2A7B8" stroke="#9C4E62" stroke-width="2.4"/>`);
  LM.backstage = () => S("0 0 160 140", `<ellipse cx="80" cy="128" rx="66" ry="10" fill="#000" opacity=".12"/><path d="M20 126V54L80 20l60 34v72z" fill="#5E4A7E" stroke="#3A2A5A" stroke-width="3" stroke-linejoin="round"/><path d="M30 126V60q24 30 50 0v66zM130 126V60q-24 30-50 0v66z" fill="#C8425A" stroke="#7A2236" stroke-width="2.4"/><path d="M80 20v-10" stroke="#3A2A5A" stroke-width="3"/><path d="M80 10l16 6-16 6z" fill="#F2D27A"/><path d="M46 100h68" stroke="#F2D27A" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/><rect x="62" y="100" width="36" height="26" fill="#2E2A3E"/>`);
  LM.stage = () => S("0 0 180 150", `<ellipse cx="90" cy="138" rx="80" ry="10" fill="#000" opacity=".12"/><path d="M14 132V44h152v88z" fill="#FBEFE0" stroke="#9C6E4E" stroke-width="3"/><path d="M8 46L90 8l82 38z" fill="#D9AE4E" stroke="#8C6A2E" stroke-width="3" stroke-linejoin="round"/><rect x="40" y="52" width="100" height="24" rx="6" fill="#3E2A4E" stroke="#8C6A2E" stroke-width="2"/>${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${48+i*12}" cy="64" r="3.2" fill="#FFF0B0"/>`).join("")}<path d="M30 132V84q16 26 30 0v48zM150 132V84q-16 26-30 0v48z" fill="#C8425A" stroke="#7A2236" stroke-width="2.4"/><path d="M60 132l10-46h40l10 46z" fill="#F2E3F0" stroke="#9C6E82" stroke-width="2"/>`);
  LM.museum = () => S("0 0 160 140", `<ellipse cx="80" cy="128" rx="66" ry="10" fill="#000" opacity=".12"/><path d="M18 46L80 16l62 30z" fill="#E9E1F2" stroke="#7E6AAE" stroke-width="3" stroke-linejoin="round"/><path d="M22 46h116v10H22z" fill="#DCD2EC" stroke="#7E6AAE" stroke-width="2.4"/>${[0,1,2,3].map(i=>`<path d="M${32+i*28} 56v58" stroke="#F7F2FB" stroke-width="12"/><path d="M${32+i*28} 56v58" stroke="#7E6AAE" stroke-width="12" stroke-opacity=".25"/>`).join("")}<path d="M16 114h128v12H16z" fill="#DCD2EC" stroke="#7E6AAE" stroke-width="2.4"/><path d="M80 62c-6 0-8 6-6 10l-10 30h32l-10-30c2-4 0-10-6-10z" fill="#F2A7B8" stroke="#9C4E62" stroke-width="2"/>`);
  LM.photo = () => S("0 0 160 140", `<ellipse cx="80" cy="128" rx="60" ry="9" fill="#000" opacity=".12"/><rect x="24" y="44" width="112" height="82" rx="14" fill="#A8D2EE" stroke="#4E7E9E" stroke-width="3"/><rect x="58" y="30" width="44" height="18" rx="6" fill="#7EB2D6" stroke="#4E7E9E" stroke-width="3"/><circle cx="80" cy="84" r="26" fill="#FBF6E8" stroke="#4E7E9E" stroke-width="3"/><circle cx="80" cy="84" r="16" fill="#3E4C7A"/><circle cx="74" cy="78" r="5" fill="#fff" opacity=".8"/><circle cx="118" cy="58" r="5" fill="#F2D27A" stroke="#9C7A2E" stroke-width="2"/>`);
  LM.secret = (open) => S("0 0 140 130", `<ellipse cx="70" cy="120" rx="56" ry="8" fill="#000" opacity=".12"/><path d="M14 118C10 60 30 30 70 30s60 30 56 88z" fill="#6E9E6A" stroke="#3E6A3E" stroke-width="3"/>${[[30,60],[54,44],[86,44],[108,62],[36,90],[104,92]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#86B47F" stroke="#3E6A3E" stroke-width="2"/>`).join("")}<path d="M50 118V80q20-22 40 0v38z" fill="${open?"#F2D27A":"#4E3A5E"}" stroke="#2E2238" stroke-width="3"/>${open?`<path d="M70 66l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1z" fill="#fff"/>`:`<circle cx="70" cy="96" r="5" fill="#F2D27A"/><path d="M68 100h4l1 8h-6z" fill="#F2D27A"/>`}`);
  LM.festival = () => S("0 0 170 140", `<ellipse cx="85" cy="128" rx="70" ry="10" fill="#000" opacity=".12"/><path d="M30 124V70h110v54z" fill="#FBF0E0" stroke="#9C6E4E" stroke-width="3"/><path d="M20 72L85 22l65 50z" fill="#F2A7B8" stroke="#9C4E62" stroke-width="3" stroke-linejoin="round"/><path d="M85 22L52 72M85 22l33 50" stroke="#FBF6E8" stroke-width="10" opacity=".7"/><path d="M85 22v-12" stroke="#9C4E62" stroke-width="3"/><path d="M85 10l14 5-14 5z" fill="#A9DCC4"/><path d="M14 52q36 22 72 0 36 22 72 0" fill="none" stroke="#9C6E4E" stroke-width="1.6"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${22+i*18} ${54+Math.sin(i/7*Math.PI)*10}l6 12 6-12z" fill="${["#F2A7B8","#A8D2EE","#F6E08A","#A9DCC4"][i%4]}"/>`).join("")}<path d="M70 124V96q15-14 30 0v28z" fill="#C8425A" stroke="#7A2236" stroke-width="2.4"/>`);

  return { COLORS, START_COLORS, PATTERNS, START_PATTERNS, FABRICS, START_FABRICS, WINGS, START_WINGS, HEAD_ACC, NECK_ACC, START_ACC,
    TYPES, CUTS, LENGTHS, SLEEVES, COLLARS, HEMS, BELTS, TRIMS, BLANK, BLANK_WINGS, col, shade, ink, lum,
    patternDef, fabricDefs, skirt, bodice, sleeve, headAcc, wings, back, cape, dollHTML, dollSet, dollSync, DCLIP, poly, F, LM, svg, bowAt, uid };
})();
