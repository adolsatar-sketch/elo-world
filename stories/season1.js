/* =====================================================================
   حكاياتنا — الموسم الأول (بيانات الحكايات)
   ---------------------------------------------------------------------
   شلون تعدّلين نص؟  ابحثي عن الجملة هنا وغيّريها. الأسماء تنكتب كرموز:
     {E} = اسم البطلة (من إعدادات الموقع)   {A} = عَدول
     {J} = جعموص   {S} = سومو   {SR} = لقب سومو (رفيق الغابة)

   شلون تضيفين فصل؟  أضيفي عنصر جديد لمصفوفة chapters بأي حكاية:
     { id:"s1c4", title:"…", teaser:"…", cliff:"…",
       scenes:{ اسم:{ theme, len, ... } },
       beats:[ ...خطوات... ] }
     الفصل ينفتح تلقائياً بعد الفصل اللي قبله.

   أنواع الخطوات (beats) — كل خطوة كائن فيه مفتاح واحد أساسي:
     {scene:"اسم", cast:{elaf:[x], adool:[x], jm:[x], sumo:[x]}, player:"elaf"}
     {cine:true, narr:"نص الراوي", btn:"زر", pan:[من,إلى], during:[حركات]}
     {say:"elaf|adool|jm|sumo|narr|معرّف شخصية بالمشهد", t:"النص", e:"wave|happy|surprise|trip|sit|spin"}
     {act:[[who,"to",x,{run:true}], [who,"hop",x,y], ["cam",x,ms], ["guide",[[x,y]...],ms], ["obj",id,{...}], ["wait",ms]]}
     {explore:{until:"علم", hints:[{after:ثواني, who, t}], need:{نوع:عدد}}}
     {puzzle:"symbols|fans|echoes|ticket|rhythm|timing|colors|route|paint|mirrors|starpath|letters|hidden|quiz|write|memory", ...}
     {choice:"مفتاح", q:"السؤال", opts:[{v:"قيمة", label:"…"}]}
     {calm:true, t:"…", lines:[{say,t}], sit:["elaf","adool"]}
     {fx:"اسم مؤثر"}  {give:"مفتاح_دائم", giveText:"…"}  {toast:"…"}  {follow:[...]}
     أي خطوة تقبل if:(ctx)=>شرط ، و ctx.get("مفتاح") يرجّع اختيار محفوظ.
   ===================================================================== */
const HIKAYAT = (() => {
  const R = (n, f) => Array.from({length:n}, (_, i) => f(i));
  const rnd = (i, k=1) => { const x = Math.sin(i*9301+49297*k)*233280; return x-Math.floor(x); };

  /* ---------------- البيئات (طبقات الخلفية) ---------------- */
  const themes = {
    treeExt: (sc, VW) => ({
      far:[...R(Math.ceil((sc.len*.25+VW)/40)+2, i=>({a:"treeSil", args:["#5B4C8E"], x:i*40+rnd(i)*14-10, y:84, w:22+rnd(i,2)*10, o:.8})), {a:"hills", args:["#6E5FA0","#8676B8",400], x:-80, y:100, w:Math.max(260, sc.len*.25+VW+120), tl:true, h:44, cls:"tl-y56"}],
      mid:[{a:"giantTree", args:[true], x:sc.treeX||80, y:92, w:60, id:"tree", cls:"tree-sway"}],
      fore:[...R(8, i=>({a:"leaf", x:i*30+rnd(i)*20, y:100, w:6, cls:"fore-leaf"}))].map(d=>({...d, a:()=>ART.leaf(["#3F6E58","#5E9277","#2F5A47"][d.x%3|0])}))
    }),
    treeIn: (sc, VW) => ({
      main:[{a:"roomWall", args:[Math.max(sc.len,VW)+60], x:-30, y:6, w:Math.max(sc.len,VW)+60, h:80, tl:true, cls:"wall", z:0},
        ...(sc.beams||[]).map(x=>({a:()=>`<svg viewBox="0 0 10 100" preserveAspectRatio="none"><rect width="10" height="100" fill="#5E3B28"/></svg>`, x, y:6, w:2.4, h:80, tl:true, z:0}))]
    }),
    branches: (sc, VW) => ({
      far:[{a:"moon", x:VW*.25+20, y:30, w:16}, ...R(Math.ceil((sc.len*.25+VW)/34)+2, i=>({a:"treeSil", args:["#3B3266"], x:i*34+rnd(i)*10, y:90, w:24+rnd(i)*10, o:.9}))],
      mid:[...R(Math.ceil((sc.len*.55+VW)/46)+1, i=>({a:"cloud", args:["#5E4C96", .55], x:i*46+rnd(i,3)*20, y:30+rnd(i,4)*20, w:24})), ...R(Math.ceil((sc.len*.55+VW)/60)+1, i=>({a:"lantern", args:["#F6C86A"], x:i*60+20, y:40+rnd(i,5)*10, w:3, cls:"swing"}))],
      fore:R(Math.ceil((sc.len*1.25+VW)/38), i=>({a:()=>ART.leaf(["#2F5A47","#3F6E58"][i%2]), x:i*38+rnd(i,6)*16, y:12+rnd(i,7)*6, w:7+rnd(i)*4, cls:"fore-leaf top", o:.92}))
    }),
    cloudBridge: (sc, VW) => ({
      far:[{a:"moon", x:VW*.7, y:32, w:20}, ...R(Math.ceil((sc.len*.25+VW)/50)+1, i=>({a:"cloud", args:["#EADFFF", .35], x:i*50+rnd(i)*20, y:70+rnd(i,2)*20, w:40}))],
      mid:[...R(Math.ceil((sc.len*.55+VW)/40)+1, i=>({a:"floatRock", args:["#7E70AE"], x:i*40+rnd(i,3)*14, y:40+rnd(i,4)*30, w:10+rnd(i)*6, cls:"bob"}))],
      main:(sc.rocks||[]).map(([x,w])=>({a:"floatRock", args:["#8C80B8"], x:x+w/2, y:sc.ground+6, w:w+4, z:1})),
      fore:R(Math.ceil((sc.len*1.25+VW)/70), i=>({a:"cloud", args:["#F4ECFF", .5], x:i*70+rnd(i,9)*30, y:104, w:30, cls:"drift"}))
    }),
    mirrorLake: (sc, VW) => ({
      far:[{a:"moon", x:VW*.3, y:28, w:18}, {a:"hills", args:["#2E2A5C","#3B3870",400], x:-10, y:100, w:Math.max(200, sc.len*.25+VW+20), tl:true, h:30, cls:"tl-y60"}],
      mid:R(Math.ceil((sc.len*.55+VW)/30)+1, i=>({a:"treeSil", args:["#2A2552"], x:i*30+rnd(i)*10, y:89, w:18+rnd(i)*8, o:.9}))
    }),
    trainIn: (sc, VW) => ({
      main:[{a:"trainWall", args:[Math.max(sc.len,VW)+60], x:-30, y:16, w:Math.max(sc.len,VW)+60, h:70, tl:true, z:0},
        ...R(Math.ceil(sc.len/34), i=>({a:"trainWindow", x:16+i*34, y:58, w:20, z:0, cls:"twin"})),
        ...(sc.doors||[]).map(x=>({a:()=>`<svg viewBox="0 0 40 100" preserveAspectRatio="none"><rect width="40" height="100" rx="6" fill="#4E2420"/><rect x="8" y="10" width="24" height="34" rx="4" fill="#2C2550"/><circle cx="32" cy="60" r="3" fill="#D9A653"/></svg>`, x:x-4, y:30, w:8, h:56, tl:true, z:0}))]
    }),
    gears: (sc, VW) => ({
      far:R(Math.ceil((sc.len*.25+VW)/30)+1, i=>({a:"gear", args:[["#7A6236","#8C7444","#6B5530"][i%3], 12], x:i*30+rnd(i)*10, y:30+rnd(i,2)*60, w:20+rnd(i,3)*24, cls:i%2?"spin":"spin rev", o:.7})),
      mid:R(Math.ceil((sc.len*.55+VW)/40)+1, i=>({a:"tunnelClock", args:["#F6E3A1"], x:i*40+rnd(i,5)*14, y:30+rnd(i,6)*30, w:10}))
    }),
    cityGray: (sc, VW) => ({
      far:[{a:"hills", args:["#9B8FB8","#B3A8CC",400], x:-10, y:100, w:Math.max(200, sc.len*.25+VW+20), tl:true, h:40, cls:"tl-y60"}, ...R(Math.ceil((sc.len*.25+VW)/22)+1, i=>({a:"house", args:[["#C9B6D8","#D8C7A8","#B8CBD8"][i%3], "#7E6C9C"], x:i*22, y:78, w:16, o:.75}))],
      mid:R(Math.ceil((sc.len*.55+VW)/26)+1, i=>({a:"house", args:[["#E9A79E","#8EC3CF","#E8C066","#B9A6DD","#9DBF8E"][i%5], ["#9C4F3A","#5B6FB0","#7FA37A"][i%3]], x:i*26+rnd(i)*6, y:86, w:20})),
      fore:R(Math.ceil((sc.len*1.25+VW)/90), i=>({a:"cloud", args:["#C9C1E0", .5], x:i*90+30, y:18, w:26, cls:"drift"}))
    }),
    inkRiver: (sc, VW) => ({
      far:[{a:"hills", args:["#7E6FA8","#9A8CC0",400], x:-10, y:100, w:Math.max(200, sc.len*.25+VW+20), tl:true, h:40, cls:"tl-y62"}],
      mid:R(Math.ceil((sc.len*.55+VW)/24)+1, i=>({a:"house", args:[["#E9A79E","#8EC3CF","#E8C066","#B9A6DD"][i%4], "#7E6C9C"], x:i*24+rnd(i)*6, y:80, w:16}))
    }),
    canvasSquare: (sc, VW) => ({
      far:R(Math.ceil((sc.len*.25+VW)/24)+1, i=>({a:"house", args:[["#E9A79E","#8EC3CF","#E8C066","#B9A6DD","#9DBF8E"][i%5], "#9C4F3A"], x:i*24, y:80, w:18, o:.85})),
      mid:R(Math.ceil((sc.len*.55+VW)/50)+1, i=>({a:"lantern", args:[["#E9A79E","#E8C066","#8EC3CF"][i%3]], x:i*50+20, y:34, w:3.4, cls:"swing"}))
    }),
    seaNight: (sc, VW) => ({
      far:[{a:"moon", x:VW*.6, y:26, w:20}, {a:"lighthouse", args:[false], x:sc.len*.25+VW*.6, y:84, w:8, o:.6}],
      mid:R(Math.ceil((sc.len*.55+VW)/40)+1, i=>({a:"nightBird", x:i*40+rnd(i)*20, y:28+rnd(i,2)*20, w:5, cls:"bird-fly"}))
    }),
    clouds: (sc, VW) => ({
      far:[{a:"moon", x:VW*.2, y:24, w:16}, ...R(Math.ceil((sc.len*.25+VW)/36)+1, i=>({a:"cloud", args:["#C8BEEA", .5], x:i*36+rnd(i)*12, y:50+rnd(i,2)*40, w:30}))],
      mid:R(Math.ceil((sc.len*.55+VW)/44)+1, i=>({a:"cloud", args:["#E4E1F4", .7], x:i*44+rnd(i,3)*18, y:96, w:36, cls:"bob"}))
    }),
    skyFly: (sc, VW) => ({
      far:[{a:"moon", x:VW*.5, y:22, w:16}, {a:"lighthouse", args:[true], x:sc.len*.25+VW*.75, y:96, w:9, o:.8}],
      mid:R(Math.ceil((sc.len*.55+VW)/28)+1, i=>({a:"nightBird", x:i*28+rnd(i)*10, y:20+rnd(i,2)*50, w:5+rnd(i,3)*3, cls:"bird-fly"}))
    }),
    paperCave: (sc, VW) => ({
      far:R(Math.ceil((sc.len*.25+VW)/22)+1, i=>({a:"bookshelf", x:i*22, y:96, w:20, o:.55})),
      mid:R(Math.ceil((sc.len*.55+VW)/30)+1, i=>({a:"page", args:[i%2===0], x:i*30+rnd(i)*12, y:20+rnd(i,2)*40, w:8, cls:"float-page"}))
    }),
    libraryHall: (sc, VW) => ({
      far:R(Math.ceil((sc.len*.25+VW)/22)+1, i=>({a:"bookshelf", x:i*22, y:96, w:22, o:.7})),
      mid:R(Math.ceil((sc.len*.55+VW)/28)+1, i=>({a:"bookshelf", x:i*28, y:88, w:22}))
    })
  };

  /* ---------------- مؤثرات المشاهد ---------------- */
  const q = (api, id) => api.stage.querySelector(`[data-id="${id}"]`);
  const fx = {
    blink3: api => { const t=q(api,"tree"); t && t.classList.add("blink3"); },
    knock: async api => { api.TAudio.sfx("knock"); const w=api.getObj("window"); if(w){ w.el.classList.add("knock"); await api.wait(900); w.el.classList.remove("knock"); } },
    mapReveal: async api => {
      const el = h(`<div class="tp-bigmap"><svg viewBox="0 0 300 200"><path d="M20 30l70-18 70 18 70-18 50 12v160l-50-12-70 18-70-18-70 18z" fill="#FBF0D0" stroke="#C9A55A" stroke-width="3"/><path class="route" d="M40 160C80 120 110 150 140 110S200 70 250 50" fill="none" stroke="#C8705F" stroke-width="5" stroke-dasharray="10 8"/><g transform="translate(232 22) scale(.7)"><path d="M6 30C0 30 0 20 8 20 10 12 30 12 32 18 44 14 52 24 46 30Z" fill="#E4E1F4" stroke="#9C94C4" stroke-width="2"/></g><text x="150" y="190" text-anchor="middle" font-size="14" fill="#7A5A3A" font-family="Baloo Bhaijaan 2,sans-serif">جسر الغيم</text></svg></div>`);
      api.v.appendChild(el); api.TAudio.sfx("page");
      await new Promise(r => { el.onclick = r; setTimeout(r, 3600); });
      el.classList.add("out"); setTimeout(()=>el.remove(), 500);
    },
    skyOpen: api => { const b=q(api,"cbridge"); b && b.classList.add("show"); api.TAudio.sfx("sparkle"); },
    bridgeSteady: api => { api.plats.forEach(p=>{ p.move=null; p.cx=p.x; p.cy=p.y; }); api.sc.wind=null; api.v.classList.remove("gusting","gust-warn"); api.TAudio.sfx("ok"); },
    lanternsOn: api => { api.stage.classList.add("lit"); api.TAudio.sfx("sparkle"); },
    bellRing: async api => { api.TAudio.sfx("bell"); api.stage.classList.add("bell-ring"); await api.wait(1600); api.stage.classList.remove("bell-ring"); },
    trainShake: async api => { api.TAudio.sfx("whistle"); api.stage.classList.add("rumble"); await api.wait(1400); api.stage.classList.remove("rumble"); },
    trainGo: api => { api.stage.classList.add("moving"); api.TAudio.sfx("whistle"); },
    clockTick: async api => { for(let m=8;m<=12;m++){ api.updObj("tclock",{args:[12,m]}); api.TAudio.sfx("soft"); await api.wait(380); } },
    sat45: api => api.setSat(.45), sat75: api => api.setSat(.75), sat100: api => { api.setSat(1); api.TAudio.sfx("sparkle"); },
    cityFinal: api => { const c=api.SV.city; if(!c) return; api.stage.style.setProperty("--sky", `linear-gradient(180deg, ${c.c2} 0%, #F7E7C6 55%, ${c.c1} 100%)`); },
    lighthouseOn: api => { api.updObj("lh",{args:[true]}); api.TAudio.sfx("bell"); },
    thunder: async api => { api.stage.classList.add("flash"); api.TAudio.sfx("thunder"); await api.wait(700); api.stage.classList.remove("flash"); },
    cameo: async api => {
      const arts = [ART.bird(), TART.minute(), TART.painter(), TART.littleCloud("happy")];
      const els = arts.map((a,i)=>api.deco({a:()=>a, x:api.camX + api.VW*(.2+i*.2), y:60, w:i===3?10:7, cls:"cameo"}, "main"));
      api.TAudio.sfx("sparkle"); await api.wait(3200); els.forEach(e=>e.classList.add("bye")); await api.wait(600); els.forEach(e=>e.remove());
    },
    booksGather: async api => { const el=h(`<div class="tp-books">${["s1","s2","s3","s4","s5","blank"].map((id,i)=>`<span style="--i:${i}"><svg viewBox="0 0 120 130">${TART.cover(id)}</svg></span>`).join("")}</div>`); api.v.appendChild(el); api.TAudio.sfx("page"); await api.wait(3400); el.classList.add("out"); setTimeout(()=>el.remove(),600); },
    pageShow: api => { const p=api.SV.pages[api.SV.pages.length-1]; if(!p) return; api.deco({a:()=>`<div class="tp-pagecard"><b>${esc(p.title)}</b><p>${esc(p.text)}</p></div>`, x:api.camX+api.VW*.5, y:52, w:30, cls:"htmlcard"}, "main"); }
  };

  /* ---------------- عناصر الجمع ---------------- */
  const itemArt = {echo:"wave", ticket:"page", can:"drop", drop:"drop", bottle:"drop", sound:"note", star:"star"};
  const itemColor = {echo:"#B6E3F0", ticket:"#F6E3A1", can:"#E9A79E", drop:"#8EC3CF", bottle:"#FFE7AE", sound:"#B9A6DD", star:"#FFF0B8"};

  /* ---------------- النصوص العامة ---------------- */
  const barks = {
    elaf:["هلا!","نمشي سوا؟","شوف هناك!"],
    adool:["آني وياج.","يلا!","شفتي شلون مشيت؟ مثل البطل."],
    jm:["الحشوة بخير!","آني جاهز… تقريباً.","منو دگني؟"],
    sumo:["هدوء… الطريق يحچي.","أشم ريحة مغامرة… لو كيك.","{SR} بالخدمة."]
  };
  const respawnLines = ["ولا يهمج، رجعنا لآخر مكان ثابت.","الغيمة دغدغتنا شوية. نحاول مرة ثانية.","ماكو خسارة، بس نزلة صغيرة."];
  const swirlBarks = ["دوامة! نلف حولها.","الحبر يدوّخ… خلّي نغيّر المسار.","هاي الدوامة تحب تلعب."];
  const winLines = ["أحسنتِ!","هاي هي!","يا سلام عليج!"];

  /* =====================================================================
     الحكايات
     ===================================================================== */
  const stories = [

  /* =================== الحكاية 1 =================== */
  {
    id:"s1", title:"البيت اللي فوق الشجرة", cover:["#3F6E58","#C98F5B"],
    blurb:"بيت خشبي فوق شجرة هائلة، شبابيكه مدوّرة ومضوية، ومصعده سلّة معلّگة بحبل. ومن هنا تبدي كل المغامرات.",
    vignette:"linear-gradient(180deg,#5A4C9A,#E8A774)", sky:"linear-gradient(180deg,#3A2F6E 0%,#7A5AA8 45%,#E8A774 85%,#F6C86A 100%)",
    theme:{root:62, scale:[0,2,4,7,9], tempo:92, chords:[0,3,1,4], motif:[0,null,2,null,4,null,2,3, 4,null,null,null,5,4,2,null, 0,null,2,null,4,null,5,null, 4,2,1,null,0,null,null,null]},
    resetItems:["feather","bell","goldkey"],
    chapters:[
    {
      id:"s1c1", title:"الرسالة اللي دگّت بالشباك", teaser:"ورقة مضيئة تطير للداخل… وتطلع خريطة.",
      cliff:"الخريطة تأشر على جسر من الغيم… وضوء بعيد يناديهم.",
      scenes:{
        ext:{theme:"treeExt", len:200, ground:92, groundSegs:[[-200,400]], gk:"grass", amb:"fireflies", treeX:100, guide:{a:"paperMap", w:5, x:10, y:30}},
        in:{theme:"treeIn", len:172, gk:"wood", amb:"dust", beams:[62,112], guide:{a:"paperMap", w:5, x:-20, y:40},
          deco:[{a:"bed", x:12, y:86, w:20, z:2},{a:"lamp", x:48, y:86, w:4.4, z:2},{a:"rug", x:84, y:88, w:28, z:1},{a:"shelf", x:100, y:62, w:14, z:2},{a:"ladder", x:5, y:86, w:5, z:1},{a:"lamp", x:146, y:86, w:4.4, z:2}],
          objs:[
            {id:"window", x:30, y:64, w:15, a:"roundWindow", args:[false], label:"افتحي الشباك", flag:"window", ph:15, run:[
              {obj:"window", a:"roundWindow", args:[false,true]}, {sfx:"door"},
              {act:[["obj","window",{args:[true]}],["guide",[[30,54],[44,40],[62,48],[48,58],[34,44]],2600]]},
              {say:"elaf", t:"ورقة! دخلت وحدها وصارت تدور بالغرفة!", e:"surprise"}]},
            {id:"chest", x:128, w:12, a:"chest", args:[false], label:"افتحي صندوق الخشب", flag:"chest", run:[
              {obj:"chest", a:"chest", args:[true]}, {sfx:"door"},
              {toast:"لگيتي عدسة {S} القديمة"},
              {act:[["sumo","to",122],["guide",[[118,52],[124,48]],900]]},
              {say:"sumo", t:"خلّي أشوفها بالعدسة… أوه! هاي مو ورقة. هاي خريطة! وخطوطها دا تتحرك!", e:"surprise"},
              {say:"elaf", t:"هاي الخريطة كل شويّة تغيّر طريقها!", e:"surprise"},
              {say:"adool", t:"يمكن ما تريد أحد يقرأها… يمكن تريد أحد يلحقها!", e:"happy"},
              {act:[["guide",[[150,44],[164,56],[180,46]],1300]]},
              {say:"jm", t:"طارت من الباب! يلا وراها!", e:"happy"}]},
            {id:"exit", x:164, w:10, a:"door", args:[false], label:"اطلعي ورا الورقة", flag:"out", run:[{sfx:"door"},{obj:"exit", a:"door", args:[true]}]}
          ]},
        br:{theme:"branches", len:214, gk:"branch", amb:"fireflies", holes:[[70,132]],
          plats:[{x:75,y:80,w:12,k:"paper"},{x:93,y:74,w:12,k:"paper"},{x:112,y:79,w:12,k:"paper"}],
          hints:[[80,72],[99,66],[118,71],[140,78]],
          guide:{a:"paperMap", w:5, x:30, y:48, path:[[60,50],[82,62],[100,56],[118,62],[150,52],[192,40]], lead:20},
          deco:[{a:"cloud", args:["#EADFFF", .0], x:150, y:30, w:40, id:"cbridge", cls:"cbridge", layer:"far"}],
          zones:[{x0:58, x1:70, bark:["jm","آني أقفز أول… لا، إنتِ أول. آني أراقب."]}],
          objs:[{id:"door", x:198, w:12, a:"door", args:[false,["branch","drop","moon"]], label:"باب السطح", flag:"door", ph:18, run:[]}]}
      },
      beats:[
        {scene:"ext", cast:{}, cam:VW=>100-VW/2},
        {cine:true, music:"intro", narr:"بليلة هادئة، وصلت ورقة ما عليها اسم… بس كانت تعرف طريقها.", btn:"ابدئي الحكاية", during:[["fx","blink3"],["guide",[[50,26],[80,34],[104,42]],6000]]},
        {scene:"in", cast:{elaf:[18], jm:[80], sumo:[118,null,-1], adool:[6,104]}, player:"elaf", follow:["jm","sumo"]},
        {act:[["adool","hide"]]},
        {fx:"knock"},
        {say:"narr", t:"ثلاث دگّات خفيفة على الشباك…"},
        {say:"elaf", t:"منو يدگ بهالوقت؟ … الصوت جاي من الشباك!", e:"surprise"},
        {toast:"امشي للشباك وافتحيه. الحركة بالأسهم أو الأزرار، والتفاعل بـ E أو زر «تفاعل».", ms:4200},
        {explore:{until:"window", hints:[{after:9, who:"elaf", t:"الشباك المدوّر… يمّ السرير."}]}},
        {act:[["adool","show"],["adool","place",6,100],["adool","hop",16,86,620]]},
        {act:[["adool","trip",1200]]},
        {say:"adool", t:"سمعت الدگّات من جوّا! لا تگولين بديتي المغامرة بدوني!", e:"wave"},
        {say:"elaf", t:"الورقة دخلت وحدها، شوف شلون تدور!", e:"happy"},
        {act:[["guide",[[60,46],[80,54],[94,48]],1500],["jm","to",92,{run:true}]]},
        {act:[["jm","trip",1400],["sfx","bump"]]},
        {say:"jm", t:"مسكتها! … لا، مسكت السجادة. السجادة حلوة بس."},
        {say:"sumo", t:"خلّوني أشوفها بالعدسة القديمة. هي بصندوق الخشب، بس الغطا ثقيل عليّ.", e:"think"},
        {follow:["adool","jm"]},
        {explore:{until:"chest", hints:[{after:10, who:"sumo", t:"الصندوق جنبي، بالغرفة الأخيرة."}]}},
        {follow:["adool","jm","sumo"]},
        {explore:{until:"out", hints:[{after:8, who:"adool", t:"الباب بآخر البيت!"}]}},
        {scene:"br", cast:{elaf:[16], adool:[10], jm:[5], sumo:[2]}, player:"elaf"},
        {say:"adool", t:"الورقة تنتظرنا بين الأغصان. شوفي الأضواء الصغيرة… هي الطريق.", e:"wave"},
        {explore:{until:"door", skipTo:192, hints:[{after:8, who:"adool", t:"اقفزي على الأوراق الطايرة: Space أو زر القفزة."},{after:22, who:"sumo", t:"إذا وگعتي، الغصن يرجعج. ماكو خسارة."}]}},
        {say:"sumo", t:"باب السطح عليه ثلاث رموز: غصن، قطرة، وهلال. والباب… يغني؟", e:"surprise"},
        {puzzle:"symbols", title:"لغز باب السطح", intro:"اسمعي النغمات وشوفي الومضات، وبعدين رتّبي الرموز بنفس الترتيب.", syms:["branch","drop","moon"], labels:["غصن","قطرة","هلال"], order:[1,0,2], win:"الباب تنفّس… وانفتح!"},
        {act:[["obj","door",{a:"door",args:[true]}],["sfx","door"]]},
        {fx:"mapReveal"},
        {fx:"skyOpen"},
        {say:"sumo", t:"الطريق مو واضح… بس شكله ينتظرنا.", e:"happy"},
        {say:"elaf", t:"إذا نمشي سوا، نعرف وين يودينا.", e:"wave"},
        {say:"adool", t:"وإذا ضعنا، نضيع سوا… ومعانا خريطة تتحرك. منو عنده هيچ حظ؟", e:"happy"}
      ]
    },
    {
      id:"s1c2", title:"الجسر اللي يتنفس", teaser:"جسر غيم يتحرك ويا الهوا، وعصفور يحتاج مساعدة.",
      cliff:"الجرس ما يرن… وصوته ينتظرهم ببحيرة المرايا.",
      scenes:{
        bridge:{theme:"cloudBridge", len:262, gk:"cloud", amb:"stars", groundSegs:[[0,24],[236,262]], rocks:[[66,16],[170,16]],
          plats:[{x:27,y:84,w:14,k:"cloud",move:{dy:2,t:4}},{x:46,y:80,w:14,k:"cloud",move:{dy:3,t:5,ph:1}},{x:66,y:82,w:16,k:"stone"},
            {x:88,y:78,w:14,k:"cloud",move:{dy:3,t:4.5}},{x:106,y:82,w:14,k:"cloud",move:{dy:2,t:5,ph:2}},{x:124,y:84,w:26,k:"cloud"},
            {x:154,y:80,w:13,k:"cloud",move:{dy:3,t:4}},{x:170,y:82,w:16,k:"stone"},{x:192,y:78,w:14,k:"cloud",move:{dy:3,t:5}},{x:212,y:82,w:16,k:"cloud",move:{dy:2,t:4,ph:1}}],
          wind:{every:7.5, dur:2.2, push:22, shelters:[[66,82],[170,186]]},
          zones:[{x0:126, x1:150, flag:"bigCloud"}],
          objs:[
            {id:"jmhelp", x:122, y:84, w:5, a:"symbol", args:["heart","#FFE7AE"], cls:"soft", label:"مدّي إيدج لـ{J}", flag:"jmHelped", hidden:true, run:[{act:[["jm","hop",128,84,700]]},{say:"jm", t:"شكراً! رجليني قصار بس قلبي طويل.", e:"happy"}]},
            {id:"bird", x:142, y:76, w:8, a:()=>ART.bird(), cls:"stuck", label:"فكّي العصفور", flag:"birdFree", hidden:true, run:[{sfx:"bird"},{obj:"bird", hidden:true},{give:"feather", giveText:"العصفور تركلج ريشة"},{say:"elaf", t:"طير! بس انتبه من الريح.", e:"wave"}]},
            {id:"fans", x:248, w:10, a:"fan", args:["#B9A6DD"], label:"المراوح الثلاث", flag:"fans", run:[]},
            {id:"bell", x:256, w:5, a:"bell", args:[false], label:"شنو هذا؟", flag:"bell", hidden:true, run:[{give:"bell", giveText:"جرس صغير… بلا صوت"}]}
          ]}
      },
      beats:[
        {scene:"bridge", cast:{elaf:[14], adool:[9], jm:[4], sumo:[1]}, player:"elaf", music:"explore"},
        {say:"narr", t:"طلعوا من السطح لجسر غيم يتنفس: يصعد وينزل ويا الهوا."},
        {say:"sumo", t:"لما الفوانيس تتمايل، الريح جاية. نتخبّى ورا الصخور الطايرة.", e:"think"},
        {say:"adool", t:"يعني نركض بين نفس ونفس. مثل لما أركض للثلاجة قبل لا ينتبهون.", e:"happy"},
        {explore:{until:"bigCloud", skipTo:130, hints:[{after:10, who:"sumo", t:"وگفي ورا الصخرة لما تجي الريح."}]}},
        {follow:["adool","sumo"]},
        {act:[["jm","place",112]]},
        {say:"jm", t:"آآه… الفجوة كبيرة على رجليني القصار!", e:"surprise"},
        {obj:"jmhelp", hidden:false},
        {explore:{until:"jmHelped", hints:[{after:6, who:"elaf", t:"أرجع لحافة الغيمة وأمدله إيدي."}]}},
        {follow:["adool","jm","sumo"]},
        {act:[["obj","bird",{hidden:false}],["sfx","bird"]]},
        {say:"elaf", t:"اسمعوا… عصفور عالق بالعشب الطاير!", e:"surprise"},
        {choice:"bird", q:"العصفور عالق، والريح جاية. شنو تسوين؟", opts:[{v:"help", label:"نساعد العصفور أول", sub:"ياخذ دقيقة"},{v:"hurry", label:"نكمّل بسرعة قبل الريح", sub:"نرجعله بعدين"}]},
        {if:c=>c.get("bird")==="help", explore:{until:"birdFree", hints:[{after:6, who:"adool", t:"العشب فوق الغيمة الكبيرة."}]}},
        {if:c=>c.get("bird")==="hurry", act:[["obj","bird",{hidden:true}]]},
        {if:c=>c.get("bird")==="hurry", say:"adool", t:"نرجعله بالطريق. العصافير تعرف تنتظر… أظن."},
        {explore:{until:"fans", skipTo:244, hints:[{after:10, who:"sumo", t:"آخر الجسر بيه ثلاث مراوح."}]}},
        {puzzle:"fans", title:"المراوح الثلاث", intro:"حرّكي المراوح حتى كل وحدة تصير بلون الفانوس اللي فوقها، وبعدها الريح تهدى والجسر يثبت.", colors:["#E8C066","#B9A6DD","#8EC3CF"], target:[1,0,2], win:"الريح صارت نسمة، والجسر ثبت."},
        {fx:"bridgeSteady"},
        {if:c=>c.get("bird")==="help", act:[["sfx","bird"],["fx","lanternsOn"]]},
        {if:c=>c.get("bird")==="help", say:"narr", t:"العصفور اللي ساعدوه رجع يغني فوق الجسر، وكل غيمة يمر عليها تضوي."},
        {if:c=>c.get("bird")==="help", say:"adool", t:"شفتي؟ ريشة وحدة وصار عدنا ضوّاية.", e:"happy"},
        {if:c=>c.get("bird")==="hurry", say:"elaf", t:"وصلنا بسرعة… بس العصفور بعده يباوع علينا من بعيد.", e:"think"},
        {obj:"bell", hidden:false},
        {explore:{until:"bell", hints:[{after:5, who:"jm", t:"شي يلمع جنب المراوح!"}]}},
        {say:"elaf", t:"جرس… بس ما يرن.", e:"surprise"},
        {say:"sumo", t:"الجرس يتذكر وين وگع صوته: ببحيرة المرايا. هناك الانعكاسات تتأخر وتسوي حركات.", e:"think"},
        {say:"jm", t:"انعكاسي إذا تأخر، أكيد يكون نايم."}
      ]
    },
    {
      id:"s1c3", title:"الجرس اللي تذكّر صوته", teaser:"بحيرة تعكس صوراً مضحكة، وثلاث أصداء ضايعة.",
      cliff:"المفتاح الذهبي يلمع… وكتاب ثاني على الرف صار يتنفس.",
      scenes:{
        lake:{theme:"mirrorLake", len:244, gk:"sand", amb:"fireflies", water:89, reflect:86, groundSegs:[[0,30],[200,244]],
          plats:[{x:33,y:86,w:10,k:"stone",move:{dy:1,t:3}},{x:49,y:84,w:10,k:"stone"},{x:65,y:86,w:10,k:"stone",move:{dy:1.5,t:4}},{x:81,y:83,w:10,k:"stone"},
            {x:97,y:86,w:10,k:"stone",move:{dy:1.2,t:3.5}},{x:113,y:84,w:10,k:"stone"},{x:129,y:86,w:10,k:"stone",move:{dy:1.5,t:4}},{x:145,y:83,w:10,k:"stone"},
            {x:161,y:86,w:10,k:"stone",move:{dy:1,t:3}},{x:177,y:84,w:10,k:"stone"}],
          items:[{x:86,y:70,k:"echo"},{x:134,y:72,k:"echo"},{x:182,y:70,k:"echo"}],
          zones:[{x0:200, x1:206, need:c=>(c.inv.echo||0)>=3, block:true, deny:[{say:"sumo", t:"ناقصنا أصداء. تلمع فوق الحجارة."}]}],
          objs:[{id:"refl", x:118, y:80, w:4, a:"symbol", args:["moon","#B6E3F0"], cls:"soft", label:"المسي الانعكاس", once:false, run:[{say:"adool", t:"انعكاسي لوّح قبلي… ونسى يرجع إيده.", e:"wave"}]},
            {id:"win", x:224, w:30, a:"houseWindows", args:[[0,0,0]], label:"شبابيك البيت الثلاثة", flag:"atWin", ph:20, run:[]}]}
      },
      beats:[
        {scene:"lake", cast:{elaf:[16], adool:[10], jm:[5], sumo:[1]}, player:"elaf", music:"explore"},
        {say:"narr", t:"بحيرة المرايا: كل حجارة بيها تطفو، وكل انعكاس يتأخر نص خطوة."},
        {say:"jm", t:"شوفوا! انعكاسي سوّى حركة وآني ما سويتها!", e:"surprise"},
        {say:"elaf", t:"يمكن انعكاسك أشطر منك.", e:"happy"},
        {say:"sumo", t:"الأصداء الثلاث تلمع فوق الحجارة. نجمعها ونرجّعها لشبابيك البيت.", e:"think"},
        {explore:{until:"atWin", skipTo:218, need:{echo:3}, hints:[{after:12, who:"adool", t:"الحجارة تتحرك شوية. نقفز وهي فوگ."}]}},
        {puzzle:"echoes", title:"أصداء الشبابيك", counts:[2,3,1], colors:["#B6E3F0","#F6C3D9","#F6E3A1"], answer:[2,0,1], srcLabels:["صدى الماي","صدى الحجر","صدى الريح"], win:"الأصداء رجعت لبيتها."},
        {act:[["obj","win",{args:[[1,1,1]]}]]},
        {fx:"bellRing"},
        {say:"narr", t:"رجع صوت الجرس، وضوت شبابيك البيت الثلاثة."},
        {if:c=>c.SV.items.feather, say:"narr", t:"والعصفور اللي ساعدوه بالجسر جاب ريشته وحطها جنب الجرس، كأنه يگول: آني هم ساعدت."},
        {if:c=>!c.SV.items.feather, say:"elaf", t:"وأول شي نسويه بكرة، نرجع للعصفور.", e:"think"},
        {calm:true, t:"فوق السطح انفتحت غرفة صغيرة تطل على كل عوالم الحكايات.", sit:["elaf","adool"], lines:[
          {say:"adool", t:"من هنا تبين كل الطرق. بس ولا وحدة مكتوب عليها «سهلة»."},
          {say:"elaf", t:"عادي. الطرق السهلة ما تصير حكايات."},
          {say:"jm", t:"آني أحب الطرق اللي بيها مخدّة."}]},
        {give:"goldkey", giveText:"المفتاح الذهبي — يفتح كتاب الحكاية الثانية"}
      ]
    }]
  },

  /* =================== الحكاية 2 =================== */
  {
    id:"s2", title:"قطار الساعة اللي نسى الوقت", cover:["#7C3B33","#D9A653"],
    blurb:"قطار عجيب يمر بأنفاق من الساعات والذكريات، ومحطاته ما تبين إلا إذا تحركت العقارب.",
    vignette:"linear-gradient(180deg,#2C2550,#7C3B33)", sky:"linear-gradient(180deg,#1E1A3C 0%,#3B2A55 60%,#7C3B33 100%)",
    theme:{root:57, scale:[0,2,3,5,7,9,10], tempo:104, chords:[0,3,4,0], motif:[4,null,4,5,4,null,2,null, 0,null,2,3,4,null,null,null, 7,null,6,4,5,null,4,null, 2,null,3,2,0,null,null,null]},
    chapters:[
    {
      id:"s2c1", title:"محطة 12:07", teaser:"صفارة قطار تطلع من ساعة قديمة.",
      cliff:"ظهرت محطة «قبل ما يختفي الصوت»، والعقارب تحركت وحدها.",
      scenes:{
        home:{theme:"treeIn", len:120, gk:"wood", amb:"dust", beams:[40,90], objs:[{id:"clock", x:70, w:16, a:"bigClock", args:[12,7], y:70, label:"اقتربي من الساعة", flag:"clock", ph:16, run:[{fx:"trainShake"},{say:"adool", t:"الساعة… فتحت باب صغير! ويطلع منه بخار!", e:"surprise"}]}],
          deco:[{a:"shelf", x:24, y:66, w:14},{a:"rug", x:60, y:88, w:26}]},
        train:{theme:"trainIn", len:300, gk:"train", amb:"dust", doors:[100,200],
          plats:[{x:30,y:78,w:12,k:"seat"},{x:54,y:72,w:10,k:"seat"},{x:120,y:78,w:12,k:"seat"},{x:140,y:70,w:10,k:"seat"},{x:160,y:76,w:12,k:"seat"},{x:228,y:78,w:12,k:"seat"},{x:250,y:70,w:12,k:"seat"}],
          items:[{x:59,y:62,k:"ticket"},{x:145,y:60,k:"ticket"},{x:256,y:60,k:"ticket"}],
          deco:[{a:"bigClock", args:[12,7], x:150, y:30, w:12, z:1}],
          objs:[{id:"w1", x:84, y:62, w:4, a:"symbol", args:["sun","#F6E3A1"], cls:"soft", label:"افتحي الشباك", once:true, run:[{say:"elaf", t:"برّا… ساعات تطير مثل الفراشات!", e:"surprise"}]},
            {id:"w2", x:186, y:62, w:4, a:"symbol", args:["sun","#F6E3A1"], cls:"soft", label:"افتحي الشباك", once:true, run:[{say:"jm", t:"شفت ساعة لابسة نظارات. لا تسألوني."}]},
            {id:"tclock", x:288, y:52, w:12, a:"bigClock", args:[12,7], label:"ساعة القطار", flag:"atEnd", ph:12, run:[]}],
          zones:[{x0:276, x1:282, need:c=>(c.inv.ticket||0)>=3, block:true, deny:[{say:"sumo", t:"ناقصتنا قطع تذاكر. وحدة فوق كل مقعد عالي."}]}]}
      },
      beats:[
        {scene:"home", cast:{elaf:[20], adool:[30], jm:[44], sumo:[52]}, player:"elaf", music:"intro"},
        {fx:"trainShake"},
        {say:"narr", t:"بنص الليل، طلعت صفارة قطار… من داخل الساعة القديمة."},
        {say:"jm", t:"منو حط قطار بالساعة؟ وين يركب الركاب؟ وين أركب آني؟"},
        {explore:{until:"clock", hints:[{after:8, who:"adool", t:"الساعة الكبيرة بالحايط."}]}},
        {say:"sumo", t:"الساعة واقفة على 12:07. يمكن القطار هم واقف ويريد أحد يركب.", e:"think"},
        {scene:"train", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"explore"},
        {say:"narr", t:"صعدوا لقطار عربياته حمر، وشبابيكه تطل على أنفاق من الساعات."},
        {say:"adool", t:"تذاكرنا ممزقة! كل قطعة طارت لمكان.", e:"surprise"},
        {explore:{until:"atEnd", skipTo:284, need:{ticket:3}, hints:[{after:10, who:"sumo", t:"اقفزي فوق المقاعد العالية."},{after:24, who:"adool", t:"تقدرين تفتحين الشبابيك وتشوفين برّا."}]}},
        {puzzle:"ticket", title:"التذكرة الممزقة", parts:["قبل ما","يختفي","الصوت"], win:"انكتب اسم المحطة: «قبل ما يختفي الصوت»."},
        {fx:"clockTick"},
        {say:"elaf", t:"العقارب تحركت وحدها!", e:"surprise"},
        {say:"adool", t:"يعني إذا نعرف وين رايحين، الوقت يرجع يمشي. فلسفة قطارات.", e:"happy"}
      ]
    },
    {
      id:"s2c2", title:"العربة اللي تحفظ الضحكات", teaser:"كل عربة تحفظ ذكرى مضحكة، بس الأصوات تخربطت.",
      cliff:"القطار دخل نفق الساعات… وصوت تك-تك صغير يبچي بمكان ما.",
      scenes:{
        laughs:{theme:"trainIn", len:240, gk:"train", amb:"dust", doors:[120],
          plats:[{x:40,y:78,w:12,k:"seat"},{x:60,y:72,w:10,k:"seat"},{x:150,y:78,w:12,k:"seat"},{x:172,y:72,w:10,k:"seat"}],
          objs:[{id:"c1", x:52, y:60, w:12, a:"curtain", args:[false], label:"اسحبي الستارة", flag:"c1", ph:14, run:[{obj:"c1", a:"curtain", args:[true]},{sfx:"laugh"},{say:"jm", t:"هاي ضحكة {A} لما وگع الكيك بوجهه!"}]},
            {id:"c2", x:110, y:60, w:12, a:"curtain", args:[false], label:"اسحبي الستارة", flag:"c2", ph:14, run:[{obj:"c2", a:"curtain", args:[true]},{sfx:"laugh",arg:1},{say:"adool", t:"وهاي ضحكة {E} لما {J} لبس قبعة سومو.", e:"happy"}]},
            {id:"c3", x:182, y:60, w:12, a:"curtain", args:[false], label:"اسحبي الستارة", flag:"c3", ph:14, run:[{obj:"c3", a:"curtain", args:[true]},{sfx:"laugh"},{say:"sumo", t:"وهاي… ضحكتي آني. ليش مسجلة بصوت عالي هيچ؟"}]},
            {id:"boxes", x:224, w:12, a:"musicBox", args:["#E8C066"], label:"صناديق الموسيقى", flag:"boxes", run:[]}],
          zones:[{x0:214, x1:220, need:c=>c.flags.c1&&c.flags.c2&&c.flags.c3, block:true, deny:[{say:"adool", t:"بعد ستاير ما سحبناها. كل وحدة وراها ضحكة."}]}]}
      },
      beats:[
        {scene:"laughs", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"explore"},
        {say:"narr", t:"العربة الثانية مليانة ستاير وصناديق موسيقى، وكل صندوق نسى ضحكته."},
        {explore:{until:"boxes", skipTo:222, hints:[{after:10, who:"jm", t:"اسحبي الستاير! وراها ضحكات."}]}},
        {puzzle:"rhythm", title:"صناديق الضحكات", patterns:[[1,0,1,0],[1,1,1,0],[1,0,0,1]], colors:["#E9A79E","#8EC3CF","#E8C066"], answer:[1,2,0], srcLabels:["ضحكة صغيرة","ضحكة طويلة","ضحكة مفاجئة"], win:"كل ضحكة رجعت لصندوقها."},
        {say:"sumo", t:"الصناديق امتلت. يمكن نحتفظ بوحدة منها… أو نترك مكان فاضي لضحكة جديدة.", e:"think"},
        {choice:"keep", q:"شنو نسوي بالصندوق الأخير؟", opts:[{v:"keep", label:"نحتفظ بالذكرى المضحكة", sub:"نسمعها كل ما نحتاجها"},{v:"space", label:"نترك مكان لذكرى جديدة", sub:"يمكن تجي أحلى"}]},
        {if:c=>c.get("keep")==="keep", say:"adool", t:"خلّيها وياي. إذا يوم صار ثقيل، أفتح الصندوق وأتذكر شلون ضحكنا.", e:"happy"},
        {if:c=>c.get("keep")==="space", say:"elaf", t:"نخليه فاضي. الضحكات الجديدة تحتاج مكان تگعد بيه.", e:"happy"},
        {fx:"trainShake"},
        {say:"jm", t:"سمعتوا؟ تك… تك… شي صغير يبچي."}
      ]
    },
    {
      id:"s2c3", title:"الدقيقة الضايعة", teaser:"دقيقة صغيرة خايفة يخلص يومها.",
      cliff:"القطار رجع يمشي، وبالبيت ساعة صغيرة تحفظ ذكرى اخترتيها.",
      scenes:{
        gears:{theme:"gears", len:230, gk:"stone", amb:"sparks",
          plats:[{x:40,y:80,w:12,k:"gear",move:{dx:5,t:4}},{x:70,y:74,w:12,k:"gear",move:{dy:4,t:5}},{x:120,y:80,w:12,k:"gear",move:{dx:6,t:5}},{x:150,y:72,w:12,k:"gear"}],
          objs:[{id:"s1", x:64, w:8, a:"gear", args:["#C9A35A",8], label:"دوّري بين التروس", flag:"sp1", run:[{say:"jm", t:"لگيت برغي يضحك… مو هي."}]},
            {id:"s2", x:132, w:8, a:"gear", args:["#B88F33",8], label:"دوّري بين التروس", flag:"sp2", run:[{say:"adool", t:"لگيت ثانية نايمة. خليناها تكمل نومها."}]},
            {id:"s3", x:196, w:8, a:"gear", args:["#D9A653",8], label:"دوّري بين التروس", flag:"found", run:[{obj:"minute", hidden:false},{sfx:"sparkle"}]},
            {id:"minute", x:206, w:6, a:"minute", name:"الدقيقة", color:"#F6E3A1", hidden:true, label:"الدقيقة", once:false, run:[]}]}
      },
      beats:[
        {scene:"gears", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"explore"},
        {say:"narr", t:"داخل الساعة الكبيرة، تروس تدور ومسارات تتحرك."},
        {say:"sumo", t:"التك-تك جاي من وره التروس. ندوّر بهدوء.", e:"think"},
        {explore:{until:"found", skipTo:192, hints:[{after:10, who:"adool", t:"نفتش ورا كل ترس ذهبي."}]}},
        {say:"minute", t:"لا تخافون… آني بس دقيقة. خايفة يخلص يومي بسرعة وما أحد يتذكرني."},
        {say:"elaf", t:"بعض الدقايق تصير أطول من ساعات… إذا نتذكرها سوا.", e:"think"},
        {say:"adool", t:"مثل الدقيقة اللي {J} مسك بيها السجادة. لهسه أتذكرها وأضحك.", e:"happy"},
        {say:"jm", t:"آني ما أتذكرها. ولا أريد."},
        {say:"minute", t:"إذا ساعدتوني أرجع لمكاني بين العقارب، أوعدكم أصير دقيقة تنحفظ."},
        {puzzle:"timing", title:"لما تلتقي العقارب", intro:"اضغطي «هسه!» لما العقربين يصيرون فوق بعض. ثلاث مرات، وماكو عقوبة على الغلط.", need:3, win:"الدقيقة رجعت لمكانها."},
        {fx:"trainGo"},
        {say:"narr", t:"رجع القطار يمشي، والدقيقة تلوّح من بين العقارب."},
        {if:c=>c.choices["s2c2.keep"]==="keep", say:"sumo", t:"والضحكة اللي احتفظتوا بيها صارت أول صفحة بألبوم القطار."},
        {if:c=>c.choices["s2c2.keep"]!=="keep", say:"sumo", t:"والصندوق الفاضي اللي تركتوه… هسه يتملّى بذكرى جديدة."},
        {puzzle:"memory", title:"ذكرى للساعة الصغيرة", intro:"الساعة اللي بالبيت تحفظ ذكرى وحدة. اختاري وحدة، أو اكتبيها بنفسج.", ready:["أول مرة ضحكنا لحد ما دمعت عيوننا","طلعة المسا والهوا بارد","لما تشاركنا آخر قطعة كيك","سولفة طويلة ما ردنا تخلص"], key:"memory"},
        {run:(c, api)=>{ api.SV.memory = c.choices["s2c3.memory"] || ""; api.save(); }},
        {toast:"الساعة الصغيرة بالمكتبة صارت تحفظ ذكراكم.", ms:3000}
      ]
    }]
  },

  /* =================== الحكاية 3 =================== */
  {
    id:"s3", title:"مدينة الألوان اللي نامت", cover:["#5B6FB0","#E9A79E"],
    blurb:"مدينة مرسومة بالألوان المائية، بيوتها وأشجارها فقدت ألوانها بعد مطر بنفسجي.",
    vignette:"linear-gradient(180deg,#B9A6DD,#F7E7C6)", sky:"linear-gradient(180deg,#9C8FD0 0%,#E8D9F2 60%,#F7E7C6 100%)",
    theme:{root:65, scale:[0,2,4,6,7,9,11], tempo:96, chords:[0,4,5,3], motif:[0,2,4,null,6,null,4,null, 5,4,2,null,4,null,null,null, 0,2,4,null,7,null,6,null, 4,null,2,null,1,null,0,null]},
    chapters:[
    {
      id:"s3c1", title:"أول لون اختفى", teaser:"مدينة باهتة، ورسّامة صغيرة تحتاج مساعدة.",
      cliff:"رجع أول لون… بس النهر بعده يخبّص الألوان.",
      scenes:{
        city:{theme:"cityGray", len:250, gk:"street", amb:"paper", sat:.12,
          plats:[{x:80,y:72,w:16,k:"wood"},{x:150,y:70,w:16,k:"wood"},{x:196,y:74,w:14,k:"wood"}],
          items:[{x:88,y:62,k:"can"},{x:158,y:60,k:"can"},{x:202,y:64,k:"can"}],
          objs:[{id:"painter", x:46, w:9, a:"painter", name:"الرسّامة الصغيرة", color:"#E9A79E", label:"احچي ويا الرسّامة", flag:"metPainter", run:[
              {say:"painter", t:"الألوان هربت بعد المطر البنفسجي. علب الصبغ صارت فارغة وطارت فوق السطوح."},
              {say:"sumo", t:"يمكن هربت لأن ما سمعت أحد يضحك من زمان.", e:"think"}]},
            {id:"easel", x:232, w:14, a:"easel", label:"لوحة الرسّامة", flag:"atEasel", ph:16, run:[]}],
          zones:[{x0:220, x1:226, need:c=>(c.inv.can||0)>=3, block:true, deny:[{say:"adool", t:"نحتاج العلب الثلاث. فوق المظلات الخشبية."}]}]}
      },
      beats:[
        {scene:"city", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"intro"},
        {say:"narr", t:"وصلوا لمدينة كأنها رسمة نسى أحد يلوّنها."},
        {say:"elaf", t:"كل شي رمادي… حتى الغيم زعلان.", e:"surprise"},
        {music:"explore"},
        {explore:{until:"metPainter", hints:[{after:6, who:"adool", t:"أكو بنية ويا فرشاة هناك."}]}},
        {puzzle:"quiz", title:"سؤال الرسّامة", q:"الرسّامة تسأل: «شلون نرجّع الألوان؟»", opts:["إذا صرخنا عليها","إذا ضحكنا وشاركنا","إذا نمنا لحد ما ترجع"], a:1, why:["الألوان تخاف من الصراخ.","",  "{J} جرّبها قبل… ما نفعت."], win:"«بالضحك والمشاركة» — الرسّامة ابتسمت."},
        {explore:{until:"atEasel", skipTo:228, need:{can:3}, hints:[{after:12, who:"sumo", t:"العلب فوق المظلات. اقفزي."}]}},
        {puzzle:"colors", title:"أول ألوان المدينة", intro:"اختاري لون لكل شي. أكثر من جواب صح.", palette:["#E9A79E","#8EC3CF","#E8C066","#9DBF8E","#B9A6DD","#C8705F"], names:["وردي","سمائي","عسلي","أخضر","ليلكي","طابوقي"],
          items:[
            {label:"الشمس", ok:[2,0], nope:"شمس بهذا اللون؟ تخجل تطلع.", art:c=>TART.symbol("sun", c||"#ccc")},
            {label:"الباب", ok:[0,1,4,5], nope:"هالباب يريد لون يرحّب بالناس.", art:c=>`<svg viewBox="0 0 64 64"><rect x="16" y="6" width="32" height="54" rx="14" fill="${c||"#ccc"}" stroke="#7A5A3A" stroke-width="3"/><circle cx="40" cy="36" r="3" fill="#7A5A3A"/></svg>`},
            {label:"الشجرة", ok:[3,0,2], nope:"الشجرة تحب الأخضر… أو وردي لو مزهرة، أو عسلي بالخريف.", art:c=>TART.symbol("leaf", c||"#ccc")}]},
        {fx:"sat45"},
        {say:"painter", t:"رجع أول لون! شكراً… بس النهر اللي يوزّع الألوان مخبوص."},
        {say:"jm", t:"آني أحب الألوان المخبوصة. شكلها مثل غرفتي."}
      ]
    },
    {
      id:"s3c2", title:"نهر الحبر", teaser:"قوارب ورقية، ودوامات حبر مرحة.",
      cliff:"الألوان وصلت للشوارع… والمدينة كلها تنتظر لوحة كبيرة.",
      scenes:{
        river:{theme:"inkRiver", len:300, mode:"boat", noGround:true, water:84, waterCls:"ink", lanes:[86,91,96], sat:.45, amb:"bubbles",
          swirls:[{x:50,lane:1},{x:80,lane:0},{x:110,lane:2},{x:140,lane:1},{x:175,lane:0},{x:205,lane:2},{x:235,lane:1}],
          items:[{x:66,y:84,k:"drop"},{x:156,y:79,k:"drop"},{x:222,y:89,k:"drop"}],
          zones:[{x0:120, x1:126, run:[{act:[["jm","spin",1200],["sfx","splash"]]},{say:"jm", t:"فتحت مجرى صغير! الحبر صار يمشي بطريقه بدل ما يخبّص.", e:"happy"}]},
            {x0:280, x1:300, flag:"riverEnd", need:c=>(c.inv.drop||0)>=3, deny:[{say:"sumo", t:"ناقصتنا قطرات لون. تطفو على المسارات."}]}]}
      },
      beats:[
        {scene:"river", cast:{elaf:[14,91], adool:[8,91], jm:[4,91], sumo:[1,91]}, player:"elaf", music:"explore"},
        {say:"narr", t:"نهر الحبر يجر خطوط الرسم من مكان لمكان. ركبوا قوارب ورقية."},
        {say:"sumo", t:"فوق وجوّا حتى تغيّرين المسار. الدوامات ما تأذي، بس ترجّعنا شوية.", e:"think"},
        {explore:{until:"riverEnd", skipTo:286, need:{drop:3}, hints:[{after:10, who:"adool", t:"غيّري المسار بالأسهم أو الأزرار فوق وجوّا."}]}},
        {puzzle:"route", title:"ألواح المجرى", intro:"حرّكي الألواح الخشبية حتى كل لون يوصل لشارعه.", sources:["#E9A79E","#8EC3CF","#E8C066"], switches:[[0,1],[1,2],[0,1]], solution:[true,true,false], target:[1,2,0], streets:["شارع الورق","حي الأجراس","درب الطين"], win:"كل لون وصل لشارعه."},
        {fx:"sat75"},
        {say:"elaf", t:"شوفوا الشوارع! صار بيها لون.", e:"happy"},
        {say:"adool", t:"والنهر هدى. حتى الدوامات صارت ترقص بدل ما تدوّخ.", e:"happy"}
      ]
    },
    {
      id:"s3c3", title:"لوحة المدينة الكبيرة", teaser:"كل واحد يضيف شي صغير.",
      cliff:"المدينة رجعت تلوّن نفسها، لأن كل واحد ساهم بشي صغير.",
      scenes:{
        square:{theme:"canvasSquare", len:200, gk:"street", amb:"paper", sat:.75,
          objs:[{id:"painter", x:70, w:9, a:"painter", name:"الرسّامة الصغيرة", color:"#E9A79E", label:"احچي ويا الرسّامة", once:false, run:[{say:"painter", t:"اللوحة الكبيرة تنتظر لونين وملصق. اختيارج يصير سما المدينة."}]},
            {id:"mural", x:150, w:46, a:"mural", args:["#ddd","#ccc",""], label:"اللوحة الكبيرة", flag:"atMural", ph:24, run:[]}]}
      },
      beats:[
        {scene:"square", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"explore"},
        {say:"narr", t:"بالساحة، أهل المدينة مجتمعين حول لوحة بيضاء ضخمة."},
        {explore:{until:"atMural", skipTo:140, hints:[{after:8, who:"adool", t:"اللوحة الكبيرة بآخر الساحة."}]}},
        {puzzle:"paint", title:"لوحة المدينة", intro:"اختاري لونين وملصق، ويصيرون سما المشهد الأخير.", palette:["#E9A79E","#8EC3CF","#E8C066","#9DBF8E","#B9A6DD","#C8705F","#5B6FB0","#F2C9A6"], stickers:["star","heart","leaf","sun","moon","note"], key:"mural", win:"رسمتوها سوا."},
        {run:(c, api)=>{ const m=c.choices["s3c3.mural"]; if(m){ api.SV.city=m; api.save(); api.updObj("mural",{args:[m.c1,m.c2,TART.symbol(m.stk,"#E8C066")]}); } }},
        {fx:"sat100"},
        {fx:"cityFinal"},
        {calm:true, t:"المدينة رجعت تلوّن نفسها، والكل گعد يباوع على السما الجديدة.", sit:["elaf","adool"], lines:[
          {say:"painter", t:"كل واحد حط شي صغير… وصارت اللوحة كبيرة."},
          {say:"adool", t:"اللونين اللي اختاريتيهم حلوين. صاروا سما كاملة.", e:"happy"},
          {say:"elaf", t:"وانت حطيت أول نقطة. محد شافها بس آني شفتها.", e:"happy"}]}
      ]
    }]
  },

  /* =================== الحكاية 4 =================== */
  {
    id:"s4", title:"منارة آخر غيمة", cover:["#2C2550","#8EC3CF"],
    blurb:"جزيرة معلّگة فوق بحر هادئ، ومنارة صغيرة ترشد طيور الليل.",
    vignette:"linear-gradient(180deg,#1E1A3C,#4E8E9C)", sky:"linear-gradient(180deg,#141530 0%,#2C2F66 55%,#4E6E9C 100%)",
    theme:{root:64, scale:[0,3,5,7,10], tempo:76, chords:[0,2,3,1], motif:[0,null,null,2,3,null,2,null, 4,null,3,null,2,null,null,null, 0,null,null,2,3,null,5,null, 4,null,null,3,2,null,null,null]},
    chapters:[
    {
      id:"s4c1", title:"الضوء اللي ما وصل", teaser:"شعلة المنارة اختفت، والطيور تلف بدوائر.",
      cliff:"الضوء وصل للمنارة… بس غيمة صغيرة گعدت قدّامه وما تريد تتحرك.",
      scenes:{
        sea:{theme:"seaNight", len:240, mode:"boat", noGround:true, water:84, lanes:[86,91,96], amb:"stars",
          swirls:[{x:70,lane:0},{x:120,lane:2},{x:170,lane:1}],
          items:[{x:56,y:79,k:"bottle"},{x:110,y:89,k:"bottle"},{x:190,y:84,k:"bottle"}],
          zones:[{x0:222, x1:240, flag:"seaEnd", need:c=>(c.inv.bottle||0)>=3, deny:[{say:"sumo", t:"ناقصتنا زجاجات ضوء. تلمع على المسارات."}]}]},
        isles:{theme:"seaNight", len:190, noGround:true, water:90, groundSegs:[[0,20],[150,190]], gk:"sand", amb:"stars",
          plats:[{x:26,y:84,w:16,k:"island"},{x:50,y:80,w:14,k:"island",move:{dy:1.5,t:4}},{x:74,y:84,w:16,k:"island"},{x:98,y:79,w:14,k:"island",move:{dy:2,t:5}},{x:122,y:83,w:16,k:"island"}],
          objs:[{id:"lh", x:172, w:14, a:"lighthouse", args:[false], label:"المنارة", flag:"atLH", ph:40, run:[]}]}
      },
      beats:[
        {scene:"sea", cast:{elaf:[14,91], adool:[8,91], jm:[4,91], sumo:[1,91]}, player:"elaf", music:"intro"},
        {say:"narr", t:"شعلة المنارة اختفت، وطيور الليل صارت تلف بدوائر فوق البحر."},
        {say:"adool", t:"نجمع زجاجات الضوء اللي طايفة، ونرجّعها للمنارة.", e:"wave"},
        {explore:{until:"seaEnd", skipTo:228, need:{bottle:3}, music:"explore", hints:[{after:10, who:"sumo", t:"فوق وجوّا حتى نوصل للزجاجات."}]}},
        {scene:"isles", cast:{elaf:[12], adool:[8], jm:[4], sumo:[1]}, player:"elaf"},
        {say:"jm", t:"جزر صغيرة! مثل الكعك. لا تاكلوها."},
        {explore:{until:"atLH", skipTo:168, hints:[{after:10, who:"adool", t:"نقفز من جزيرة لجزيرة."}]}},
        {puzzle:"mirrors", title:"مرايا ضوء القمر", cols:5, rows:4, start:{row:0}, target:{col:3}, mirrors:[{col:1,row:0,start:"/",sol:"\\"},{col:1,row:2,start:"/",sol:"\\"},{col:3,row:2,start:"\\",sol:"/"}], win:"ضوء القمر وصل للمنارة!"},
        {fx:"lighthouseOn"},
        {say:"elaf", t:"ضوّت!", e:"happy"},
        {act:[["fx","thunder"]]},
        {say:"sumo", t:"لحظة… الضوء انحجب. أكو غيمة صغيرة گاعدة قدّامه.", e:"surprise"}
      ]
    },
    {
      id:"s4c2", title:"الغيمة كثيرة الخوف", teaser:"غيمة صغيرة تخاف من الرعد وتحتاج طمأنة.",
      cliff:"الغيمة ابتسمت لأول مرة… والطيور شافت الضوء.",
      scenes:{
        sky:{theme:"clouds", len:220, noGround:true, gk:"cloud", groundSegs:[[0,30],[190,220]], amb:"stars",
          plats:[{x:34,y:84,w:16,k:"cloud",move:{dy:1.5,t:5}},{x:56,y:80,w:16,k:"cloud"},{x:80,y:84,w:16,k:"cloud",move:{dy:2,t:4}},{x:104,y:80,w:16,k:"cloud"},{x:128,y:84,w:16,k:"cloud",move:{dy:1.5,t:5}},{x:152,y:80,w:16,k:"cloud"},{x:172,y:84,w:16,k:"cloud"}],
          items:[{x:64,y:68,k:"sound",say:"صوت مطر خفيف."},{x:112,y:68,k:"sound",say:"صرصور يغني بهدوء."},{x:160,y:68,k:"sound",say:"صوت موجة بعيدة."}],
          objs:[{id:"cloud", x:22, y:70, w:14, a:"littleCloud", args:["scared"], name:"الغيمة الصغيرة", color:"#E4E1F4", label:"اقتربي من الغيمة", once:false, run:[]}],
          zones:[{x0:190, x1:200, flag:"skyEnd", need:c=>(c.inv.sound||0)>=3, deny:[{say:"elaf", t:"ناقصنا أصوات حلوة نسمّعها للغيمة."}]}]}
      },
      beats:[
        {scene:"sky", cast:{elaf:[12], adool:[7], jm:[3], sumo:[1]}, player:"elaf", music:"emotion"},
        {say:"cloud", t:"لا تقربون… إذا رعدت، أخاف وأتخبّى قدّام الضوء."},
        {say:"elaf", t:"ما جينا نزعّلج. جينا نگعد وياج شوية.", e:"think"},
        {choice:"comfort", q:"شلون تطمّنين الغيمة؟", opts:[{v:"sing", label:"نغنيلها لحن هادي"},{v:"joke", label:"نحچيلها نكتة عبيطة"},{v:"sit", label:"نگعد وياها بهدوء"}]},
        {if:c=>c.get("comfort")==="sing", say:"adool", t:"لا لا لا… الغيمة تطير، والقمر يدير، وجعموص يصير مخدّة كبير.", e:"happy"},
        {if:c=>c.get("comfort")==="joke", say:"jm", t:"شنو گال الرعد للغيمة؟ … «سامحيني، صوتي عالي بس قلبي ناعم.»"},
        {if:c=>c.get("comfort")==="sit", calm:true, t:"گعدوا جنبها بدون حچي. أحياناً هذا يكفي.", sit:["elaf","adool"], lines:[]},
        {act:[["obj","cloud",{args:["happy"]}]]},
        {say:"cloud", t:"…خوفي صار أصغر. ممكن ترافقوني بين الغيوم؟ وإذا لگيتوا أصوات حلوة، سمّعوني إياها."},
        {explore:{until:"skyEnd", skipTo:192, need:{sound:3}, music:"explore", hints:[{after:10, who:"sumo", t:"الأصوات تلمع فوق الغيوم."}]}},
        {act:[["fx","thunder"]]},
        {say:"cloud", t:"رعد! … بس هالمرة ما خفت. سمعت المطر والصرصور والموجة بداخلي."},
        {say:"adool", t:"شفتي؟ الصوت العالي يعدّي، والأصوات الحلوة تبقى.", e:"happy"},
        {say:"narr", t:"الغيمة تحركت من قدّام المنارة، والضوء رجع يمشي على البحر."}
      ]
    },
    {
      id:"s4c3", title:"طريق الطيور", teaser:"الطيور تساعدهم يطيرون فوق البحر.",
      cliff:"على باب المنارة رسالة امتنان… والغيمة الصغيرة صارت تزورهم بالمكتبة.",
      scenes:{
        fly:{theme:"skyFly", len:260, mode:"fly", noGround:true, water:92, amb:"stars", flyMin:24, flyMax:80,
          items:[{x:60,y:40,k:"star"},{x:120,y:64,k:"star"},{x:180,y:34,k:"star"}],
          zones:[{x0:240, x1:260, flag:"flyEnd"}]},
        door:{theme:"seaNight", len:140, gk:"sand", water:92, amb:"stars", groundSegs:[[0,140]],
          objs:[{id:"lh", x:100, w:16, a:"lighthouse", args:[true], label:"باب المنارة", flag:"atDoor", ph:40, run:[]}]}
      },
      beats:[
        {scene:"fly", cast:{elaf:[16,60], adool:[10,64], jm:[6,66], sumo:[2,66]}, player:"elaf", music:"emotion"},
        {say:"narr", t:"الطيور اللي رجعت تشوف الضوء، رفعتهم بجناحاتها فوق البحر."},
        {say:"adool", t:"آني طاير! {E}، شوفيني! … لا تشوفيني هسه، دا أدوخ.", e:"happy"},
        {explore:{until:"flyEnd", skipTo:244, hints:[{after:8, who:"sumo", t:"فوق وجوّا بالأسهم أو الأزرار."}]}},
        {puzzle:"starpath", title:"طريق النجوم", intro:"الطيور تأشر على طريق آمن. شوفي النجوم اللي تضوي بالترتيب، وعيديها.", stars:[[14,30],[34,64],[50,24],[66,58],[82,30],[90,70]], seq:[1,3,2,4], win:"لگيتوا الطريق الآمن."},
        {scene:"door", cast:{elaf:[60], adool:[52], jm:[46], sumo:[42]}, player:"elaf", music:"emotion"},
        {explore:{until:"atDoor", hints:[{after:6, who:"adool", t:"باب المنارة قدّامنا."}]}},
        {choice:"letter", q:"شنو نكتب على باب المنارة؟", opts:[{v:"thanks", label:"«شكراً لأنك ضوّيتي الطريق»"},{v:"back", label:"«راح نرجع نزورج»"},{v:"cloud", label:"«للغيمة الصغيرة: إنتِ شجاعة»"}]},
        {run:(c, api)=>{ api.SV.letter = c.choices["s4c3.letter"]; api.save(); }},
        {say:"elaf", t:"كتبناها سوا، بخطين: واحد مايل، وواحد أكثر ميلان.", e:"happy"},
        {say:"adool", t:"الخط المايل أكثر… هذا خطي. بس المعنى مستقيم.", e:"happy"},
        {calm:true, t:"گعدوا على العتبة، والضوء يلف على البحر، والغيمة الصغيرة تلوّح من بعيد.", sit:["elaf","adool"], lines:[{say:"sumo", t:"الغيمة تگول راح تزوركم بالمكتبة. يمكن تجيب مطر خفيف."}]}
      ]
    }]
  },

  /* =================== الحكاية 5 =================== */
  {
    id:"s5", title:"مكتبة الحكايات الناقصة", cover:["#3B3466","#F6E3A1"],
    blurb:"مكتبة ضخمة داخل كهف من الورق، كتبها بلا نهايات، والصفحات الفارغة تصير ممرات.",
    vignette:"linear-gradient(180deg,#3B3466,#C9B98E)", sky:"linear-gradient(180deg,#221C3A 0%,#3B3466 55%,#6E5A8E 100%)",
    theme:{root:60, scale:[0,2,4,5,7,9,11], tempo:84, chords:[0,5,3,4], motif:[4,null,2,null,0,null,2,4, 5,null,4,null,2,null,null,null, 4,null,5,null,7,null,5,4, 2,null,1,null,0,null,null,null]},
    chapters:[
    {
      id:"s5c1", title:"كتاب بلا نهاية", teaser:"كتاب يحچي مغامرتهم… وآخره فارغ.",
      cliff:"اخترتوا شكل النهاية… بس منو كتب الكتاب من الأساس؟",
      scenes:{
        cave:{theme:"paperCave", len:240, gk:"paper", amb:"paper", holes:[[60,110],[140,180]],
          plats:[{x:64,y:80,w:12,k:"page",move:{dx:4,t:4}},{x:84,y:74,w:12,k:"page",move:{dy:3,t:5}},{x:144,y:80,w:12,k:"page",move:{dy:3,t:4}},{x:162,y:76,w:12,k:"page",move:{dx:3,t:5}}],
          hazards:[{x:40},{x:125},{x:200}],
          objs:[{id:"book", x:226, w:16, a:"bigBook", label:"الكتاب المفتوح", flag:"atBook", ph:14, run:[]}]}
      },
      beats:[
        {scene:"cave", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"intro"},
        {say:"narr", t:"كهف من ورق، رفوفه توصل للسما، وصفحاته الفارغة صارت ممرات."},
        {say:"jm", t:"بقع الحبر تضحك علينا!"},
        {say:"sumo", t:"ما تأذي. بس تدفعنا لورا إذا لمسناها. نقفز فوقها.", e:"think"},
        {explore:{until:"atBook", skipTo:220, music:"explore", hints:[{after:10, who:"adool", t:"اقفزي فوق الحبر، والصفحات الطايرة تشيلنا."}]}},
        {say:"elaf", t:"هذا الكتاب… يحچي عنّا! البيت، القطار، المدينة، المنارة…", e:"surprise"},
        {say:"adool", t:"وآخر صفحاته فارغة. وحروفها طايرة.", e:"surprise"},
        {puzzle:"letters", title:"الحروف الطايرة", word:"حكايتنا", letters:["ح","ك","ا","ي","ت","ن","ا"], clue:"رتّبي الحروف من اليمين لليسار حتى ترجع الكلمة.", win:"رجعت الكلمة: «حكايتنا»."},
        {choice:"ending", q:"منو يكتب أول سطر بالنهاية؟", opts:[{v:"funny", label:"{A} يكتب نهاية مضحكة"},{v:"calm", label:"{E} تكتب نهاية هادئة"}]},
        {if:c=>c.get("ending")==="funny", say:"adool", t:"«وبالأخير، {J} صار ملك المكتبة… لأن محد گدر يشيل الكرسي من تحته.»", e:"happy"},
        {if:c=>c.get("ending")==="calm", say:"elaf", t:"«وبالأخير، گعدوا تحت ضوء خفيف، ومحد استعجل يخلص اليوم.»", e:"think"},
        {say:"sumo", t:"بس… منو كتب هالكتاب من الأساس؟", e:"think"}
      ]
    },
    {
      id:"s5c2", title:"حارس الرفوف", teaser:"مخلوق ورقي يحرس المكتبة.",
      cliff:"الحارس فتح دفتر كبير… صفحة فاضية تنتظر إيدين اثنين.",
      scenes:{
        hall:{theme:"libraryHall", len:200, gk:"paper", amb:"dust",
          objs:[{id:"guard", x:120, w:12, a:"guardian", name:"حارس الرفوف", color:"#F2E6C4", label:"احچي ويا الحارس", flag:"metGuard", run:[]}]}
      },
      beats:[
        {scene:"hall", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"explore"},
        {explore:{until:"metGuard", skipTo:110, hints:[{after:8, who:"adool", t:"أكو أحد ورقي يباوع علينا."}]}},
        {say:"guard", t:"أهلاً بالمسافرين. آني أحرس الحكايات اللي محد كمّلها."},
        {say:"guard", t:"الحكايات تنتهي بس لما محد يضيف إلها شي. وإنتو… ضفتوا هواية."},
        {fx:"cameo"},
        {say:"elaf", t:"العصفور! والدقيقة! والرسّامة… والغيمة!", e:"happy"},
        {say:"guard", t:"قبل ما أفتح الدفتر، لگولي ثلاث تفاصيل مخبّاة من حكاياتكم."},
        {puzzle:"hidden", title:"تفاصيل مخبّاة", panels:[
          {title:"البيت اللي فوق الشجرة", bg:"linear-gradient(180deg,#3A2F6E,#E8A774)", deco:`<svg class="pz-pdeco" viewBox="0 0 120 130">${TART.cover("s1")}</svg>`, item:TART.symbol("key","#F6C86A"), x:78, y:62, label:"المفتاح الذهبي", q:"وين المفتاح الذهبي؟"},
          {title:"قطار الساعة", bg:"linear-gradient(180deg,#2C2550,#7C3B33)", deco:`<svg class="pz-pdeco" viewBox="0 0 120 130">${TART.cover("s2")}</svg>`, item:TART.symbol("page","#F6E3A1"), x:14, y:30, label:"التذكرة", q:"لگي قطعة التذكرة"},
          {title:"منارة آخر غيمة", bg:"linear-gradient(180deg,#141530,#4E6E9C)", deco:`<svg class="pz-pdeco" viewBox="0 0 120 130">${TART.cover("s4")}</svg>`, item:TART.symbol("drop","#FFE7AE"), x:70, y:20, label:"زجاجة الضوء", q:"وين زجاجة الضوء؟"}], win:"لگيتوا كل التفاصيل."},
        {say:"guard", t:"عيونكم حلوة. الحكاية تحب اللي ينتبهون للتفاصيل الصغيرة."},
        {say:"adool", t:"آني أنتبه للتفاصيل. مثلاً، {E} تضحك قبل ما تخلص النكتة.", e:"happy"},
        {say:"elaf", t:"لأن نكتك تبين من أولها.", e:"happy"}
      ]
    },
    {
      id:"s5c3", title:"الصفحة اللي نكتبها سوا", teaser:"دفتر يفتح، ونهاية تنكتب بإيدكم.",
      cliff:"الكتب تجمعت على رف واحد، وكتاب جديد فارغ ينتظر حكايات جاية.",
      scenes:{
        desk:{theme:"libraryHall", len:160, gk:"paper", amb:"dust",
          objs:[{id:"desk", x:110, w:22, a:"desk", label:"دفتر الكتابة", flag:"atDesk", run:[]}]}
      },
      beats:[
        {scene:"desk", cast:{elaf:[14], adool:[8], jm:[4], sumo:[1]}, player:"elaf", music:"emotion"},
        {say:"narr", t:"بنص المكتبة، طاولة صغيرة عليها دفتر مفتوح وقلم حبر."},
        {explore:{until:"atDesk", skipTo:100, hints:[{after:6, who:"adool", t:"الطاولة قدّامنا."}]}},
        {puzzle:"write", title:"الصفحة اللي نكتبها سوا", defTitle:"صفحة {A} و{E}", intro:"اختاري عنوان واكتبي جملة، أو خذي وحدة جاهزة.", key:"page",
          ready:["وعاشوا يضحكون على نكت ما تضحك، لأنها نكتهم.","ورجعوا للبيت اللي فوق الشجرة، وتركوا الشباك مفتوح لأي ورقة جاية.","وكل ما خافوا من طريق، تذكروا إنهم يمشون سوا."]},
        {run:(c, api)=>{ const p=c.choices["s5c3.page"]; if(p){ const d=new Date(); api.SV.pages.push({title:p.title||("صفحة {A} و{E}"), text:p.text, date:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}); api.save(); } }},
        {fx:"pageShow"},
        {if:c=>c.choices["s5c1.ending"]==="funny", say:"adool", t:"وتحتها بخط صغير: «{J} بعده ما گام من الكرسي».", e:"happy"},
        {if:c=>c.choices["s5c1.ending"]!=="funny", say:"elaf", t:"وتحتها سطر هادي: «ومحد استعجل».", e:"think"},
        {fx:"booksGather"},
        {say:"guard", t:"هسه كل الكتب على رف واحد. وأكو كتاب جديد فارغ… عنوانه إنتو تختارونه."},
        {say:"adool", t:"نسميه بعدين. هسه خلّينا نگعد شوية.", e:"happy"},
        {calm:true, t:"الكتب على الرف، والصفحة الجديدة تلمع، والليل هادي.", sit:["elaf","adool"], lines:[{say:"elaf", t:"الموسم خلص؟"},{say:"adool", t:"الموسم خلص. الحكايات لا."}]}
      ]
    }]
  }
  ];

  return {
    // اسم عدول يُقرأ من إعدادات الموقع (CONFIG.loverName)؛ غيّريه هنا إذا تريدين اسماً خاصاً بالحكايات
    names:{ get adool(){ return (typeof CONFIG!=="undefined" && CONFIG.loverName) || "عدول"; }, sumoRole:"رفيق الغابة" },
    themes, fx, itemArt, itemColor, barks, respawnLines, swirlBarks, winLines,
    audio:{ /* مثال: s1:{intro:"assets/audio/s1-intro.mp3"} — ملفات تملكون حقها */ },
    stories
  };
})();
