/* =====================================================================
   عالمنا — غابة الاستكشاف
   تشتغل على محرّك الحكايات (حركة بالأزرار فقط، قفز، إيلاف وعدول بأجزاء متحركة)
   ثمان أماكن متصلة بلافتات. كل شي آمن ومريح، والتلميحات لطيفة.
   ===================================================================== */
const WForest = (() => {
  const NOTES = {
    trail:{from:"إيلاف", text:"إذا لگيتي هالورقة، يعني الفراشة دلّتج. الغابة تحب اللي يدوّر بهدوء."},
    cave:{from:"عدول", text:"خبيت هنا رمز للبوابة. الكهف مو مخيف، بس يضوي شوية زيادة عن اللزوم."},
    cottage:{from:"إيلاف وعدول", text:"وصلتي للكوخ السري! هذا مكاننا الهادي. تعالي وقت ما تريدين."},
    night:{from:"عدول", text:"الفوانيس تضوي لما نمشي سوا. آخر فانوس… سميناه باسمج."}
  };
  const T = HIKAYAT.themes;
  const rnd = (i,k=1) => { const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
  const R = (n,f) => Array.from({length:n}, (_,i)=>f(i));
  // بيئات خاصة بالغابة
  T.wTall = (sc, VW) => ({ far:[{a:"hills", args:["#7FA37A","#9DBF8E",400], x:-60, y:100, w:sc.len*.25+VW+120, tl:true, h:40, cls:"tl-y60"}],
    mid:R(Math.ceil((sc.len*.55+VW)/14)+2, i=>({a:"treeSil", args:[["#3F6E58","#4E7A5E","#2F5A47"][i%3]], x:i*14+rnd(i)*6, y:92, w:10+rnd(i,2)*6})),
    fore:R(Math.ceil((sc.len*1.25+VW)/40), i=>({a:()=>ART.leaf("#2F5A47"), x:i*40+rnd(i,3)*20, y:12, w:8, cls:"fore-leaf top", o:.9})) });
  T.wGlow = (sc, VW) => ({ far:R(Math.ceil((sc.len*.25+VW)/30)+1, i=>({a:"treeSil", args:["#23324A"], x:i*30, y:92, w:24, o:.9})),
    mid:R(Math.ceil((sc.len*.55+VW)/22)+1, i=>({a:()=>WART.item.mushroom(), x:i*22+rnd(i)*8, y:88, w:5+rnd(i,2)*4, cls:"glowm"})) });
  T.wCave = (sc, VW) => ({ far:[{a:()=>`<svg viewBox="0 0 100 60" preserveAspectRatio="none"><rect width="100" height="60" fill="#2C2550"/>${R(14,i=>`<path d="M${i*8} 0l4 ${10+rnd(i)*14} 4-${10+rnd(i)*14}z" fill="#3D3466"/>`).join("")}</svg>`, x:-20, y:0, w:sc.len*.25+VW+60, h:100, tl:true}],
    mid:R(Math.ceil((sc.len*.55+VW)/18)+1, i=>({a:()=>`<svg viewBox="0 0 30 50"><path d="M15 2l12 30-12 18L3 32z" fill="${["#9FD4C8","#B9A6DD","#F6C86A"][i%3]}" opacity=".85"/></svg>`, x:i*18+rnd(i)*8, y:88, w:4+rnd(i,2)*3, cls:"glowm"})) });
  T.wRiver = (sc, VW) => ({ far:[{a:"hills", args:["#9DBF8E","#B7CF8F",400], x:-60, y:100, w:sc.len*.25+VW+120, tl:true, h:44, cls:"tl-y56"}],
    mid:R(Math.ceil((sc.len*.55+VW)/30)+1, i=>({a:"treeSil", args:["#5E9277"], x:i*30+rnd(i)*10, y:80, w:14})) });
  T.wOrchard = (sc, VW) => ({ far:[{a:"hills", args:["#B7CF8F","#C9D9A8",400], x:-60, y:100, w:sc.len*.25+VW+120, tl:true, h:40, cls:"tl-y60"}],
    mid:R(Math.ceil((sc.len*.55+VW)/26)+1, i=>({a:"apricotTree", x:i*26+rnd(i)*8, y:90, w:18, args:[]})).map(d=>({...d, a:()=>ART.apricotTree()})) });
  T.wOld = (sc, VW) => ({ far:R(Math.ceil((sc.len*.25+VW)/30)+1, i=>({a:"treeSil", args:["#3F5A48"], x:i*30, y:90, w:26})),
    mid:R(Math.ceil((sc.len*.55+VW)/40)+1, i=>({a:()=>WART.oldTree(), x:i*40+rnd(i)*10, y:92, w:26})) });
  T.wNight = (sc, VW) => ({ far:[{a:"moon", x:VW*.3, y:24, w:14}, ...R(Math.ceil((sc.len*.25+VW)/30)+1, i=>({a:"treeSil", args:["#1E1A3C"], x:i*30, y:92, w:22}))] });

  const LIGHT = i => ({id:"lamp"+i, x:30+i*30, w:5, a:()=>WART.lanternPost(false), label:"ضوّي الفانوس", ph:16, run:[{obj:"lamp"+i, a:()=>WART.lanternPost(true)}, {sfx:"sparkle"}, {run:(ctx)=>{ ctx.flags.lamps=(ctx.flags.lamps||0)+1; if(ctx.flags.lamps===5){ World.give("star",2); ctx.flags.lit=1; } }}]});
  // نسوّي نص الرسالة مباشرة (بدون دوال داخل النص)
  const noteBeat = k => [{run:()=>{ World.S.flags["note_"+k]=1; World.save(); World.event("letter"); }}, {say:"narr", t:`«${NOTES[k].text}» — ${NOTES[k].from}`}, {obj:"note_"+k, hidden:true}, {toast:"انحفظت الرسالة بصندوق الرسائل بالمتحف"}];
  const note = (k,x,y) => ({id:"note_"+k, x, y, w:4.4, a:()=>WART.note(), cls:"soft", label:"رسالة صغيرة", when:()=>!World.S.flags["note_"+k], run:noteBeat(k)});
  const sign = (id, x, to, at, txt) => ({id, x, w:9, a:()=>WART.sign(txt), label:"روحي إلى "+txt, ph:12, once:false, run:[{goto:to, at}]});

  const chap = {
    id:"wforest", title:"غابة الاستكشاف",
    scenes:{
      trail:{theme:"wTall", len:220, gk:"grass", amb:"leaves", sky:"linear-gradient(180deg,#BFE0F0,#E8F4E0)",
        items:[{x:40,y:76,k:"leaf"},{x:70,y:76,k:"leaf"},{x:120,y:76,k:"leaf"},{x:160,y:60,k:"seed",once:"t_seed1"}],
        plats:[{x:150,y:70,w:16,k:"branch"}],
        objs:[sign("s_glow",30,"glow",12,"الفطر المضيء"), sign("s_bridge",100,"bridge",12,"الجسر"), sign("s_old",200,"old",12,"الأشجار القديمة"),
          note("trail",168,62), {id:"bfly", x:165, y:52, w:6, a:()=>WART.butterfly(), cls:"soft wfx-fly", label:"فراشة الأسرار", once:false, run:[{run:()=>World.meet("butterfly")}, {say:"elaf", t:"الفراشة تحوم فوگ الغصن… أكيد أكو شي هناك."}]}]},
      glow:{theme:"wGlow", len:200, gk:"earth", amb:"fireflies", sky:"linear-gradient(180deg,#1E2A3A,#2E4A5C)",
        items:[{x:50,y:78,k:"mushroom"},{x:90,y:78,k:"mushroom"},{x:130,y:78,k:"leaf"}],
        objs:[sign("g_back",12,"trail",34,"الممر"), {id:"cave", x:80, w:16, a:()=>`<svg viewBox="0 0 100 80"><path d="M0 80C0 20 30 0 50 0s50 20 50 80z" fill="#3D3466"/><path d="M20 80C20 40 36 22 50 22s30 18 30 58z" fill="#FFE7AE" opacity=".55"/></svg>`, label:"ادخلي الكهف", ph:14, once:false, run:[{goto:"cave", at:10}]},
          {id:"bunny", x:120, w:5, a:()=>WART.babyBunny(), label:"أرنب صغير ضايع", when:()=>!World.S.flags.bunny_home && !World.S.flags.bunny_carry, run:[{say:"adool", t:"أرنب صغير! شكله ضايع عن أمه."}, {say:"elaf", t:"نشيله ويانا للبستان؟ يمكن أمه هناك."}, {run:()=>{ World.S.flags.bunny_carry=1; World.save(); }}, {obj:"bunny", hidden:true}, {toast:"الأرنب الصغير صار ويّاكم. دوري على أمه بالبستان."}]},
          {id:"guard", x:170, w:8, a:()=>WART.mushGuard(), name:"حارس الفطر", label:"حارس الفطر", once:false, need:()=>World.has("leaf",8), deny:[{say:"guard", t:"ممر الفوانيس يحتاج ثمان أوراق بالحقيبة. الأوراق تتطاير بالممر والجسر."}], run:[{run:()=>World.meet("guard")}, {say:"guard", t:"ثمان أوراق! تفضلي، ممر الفوانيس مفتوح."}, {goto:"night", at:10}]}]},
      cave:{theme:"wCave", len:150, gk:"stone", amb:"sparks", sky:"#2C2550",
        items:[{x:70,y:76,k:"mushroom"},{x:118,y:56,k:"rune",once:"rune_cave"}],
        plats:[{x:100,y:72,w:12,k:"stone"},{x:114,y:64,w:12,k:"stone"}],
        objs:[sign("c_back",12,"glow",84,"برّا"), note("cave",50,80)]},
      bridge:{theme:"wRiver", len:230, gk:"grass", water:90, holes:[[70,150]], amb:"bubbles", sky:"linear-gradient(180deg,#CFE8EE,#EAF3DA)",
        plats:[{x:74,y:80,w:14,k:"wood"},{x:94,y:76,w:14,k:"wood",move:{dy:3,t:4}},{x:114,y:80,w:14,k:"wood"},{x:132,y:76,w:16,k:"wood"}],
        items:[{x:30,y:76,k:"leaf"},{x:100,y:60,k:"leaf"},{x:120,y:66,k:"drop"},{x:180,y:76,k:"leaf"}],
        objs:[sign("b_back",12,"trail",104,"الممر"), sign("b_orch",214,"orchard",12,"البستان"), {id:"turtle", x:170, w:9, a:()=>WART.turtle(), label:"السلحفاة شيلة", once:false, run:[{run:()=>{ World.meet("turtle"); const k="tf_"+World.today(); if(!World.S.flags[k]){ World.S.flags[k]=1; World.save(); World.give("seed",1); } }}, {say:"elaf", t:"السلحفاة عطتنا شي صغير!"}]}],
        hints:[]},
      orchard:{theme:"wOrchard", len:220, gk:"grass", amb:"leaves", sky:"linear-gradient(180deg,#F7E7C6,#E8F4E0)",
        objs:[sign("o_back",12,"bridge",210,"الجسر"),
          ...[50,80,110].map((x,i)=>({id:"bush"+i, x, w:12, a:()=>WART.bush(true), label:"اقطفي توت", run:[{obj:"bush"+i, a:()=>WART.bush(false)}, {run:()=>World.give("berry",2)}]})),
          {id:"hive", x:140, y:60, w:6, a:()=>WART.item.honey(), label:"خلية العسل", run:[{say:"adool", t:"النحل كريم اليوم. خذي شوية عسل بس."}, {run:()=>World.give("honey",1)}, {obj:"hive", hidden:true}]},
          {id:"mom", x:170, w:7, a:()=>WART.rabbit(), name:"أم الأرنب", label:"أم الأرنب", once:false, run:[{run:(ctx,api)=>{ const S=World.S; if(S.flags.bunny_carry && !S.flags.bunny_home){ S.flags.bunny_home=1; S.flags.bunny_carry=0; World.save(); World.give("star",2); World.give("seed",2,true); World.meet("rabbit"); api.toastIn("رجّعتي الأرنب الصغير لأمه! عطتكم نجوم وبذور."); } else api.toastIn(S.flags.bunny_home?"الأرنب الصغير يلعب ويا أمه. شكراً إلج!":"أم الأرنب حزينة… ضاع صغيرها بمنطقة الفطر."); }}]},
          ...R(6,i=>({id:"fp"+i, x:182+i*5, y:86, w:3, a:()=>WART.footprint(), cls:"soft"})),
          {id:"secret", x:212, w:8, a:()=>WART.bush(false), label:"دوري بالشجيرة", run:[{say:"elaf", t:"الآثار وصلت هنا… أكو شي يلمع!"}, {run:()=>{ if(!World.S.taken.rune_orchard){ World.S.taken.rune_orchard=1; World.give("rune",1); } }}, {toast:"لگيتي رمز البوابة!"}]}],
        items:[{x:30,y:76,k:"leaf"}]},
      old:{theme:"wOld", len:200, gk:"earth", amb:"leaves", sky:"linear-gradient(180deg,#DCE8D0,#EEF3DA)",
        plats:[{x:60,y:72,w:14,k:"branch"},{x:78,y:64,w:14,k:"branch"}],
        items:[{x:84,y:54,k:"rune",once:"rune_old"},{x:120,y:76,k:"leaf"}],
        objs:[sign("ol_back",12,"trail",194,"الممر"),
          {id:"owl", x:40, y:64, w:7, a:()=>WART.owl(), name:"بومة الدليل", label:"البومة", once:false, run:[{run:(ctx,api)=>{ World.meet("owl"); const S=World.S; if(!S.taken.owl_feather){ S.taken.owl_feather=1; World.give("feather",1); api.toastIn("البومة عطتج ريشة! هسه تگدرين تطيرين لشاطئ الغيوم."); } else api.toastIn(World.friendLine("owl")); }}]},
          {id:"gate", x:170, w:16, a:()=>WART.gate(false, Math.min(3, World.S.inv.rune||0)), label:"بوابة الرموز", ph:18, once:false, need:()=>(World.S.inv.rune||0)>=3 || World.S.flags.gate_open, deny:[{say:"adool", t:"البوابة تحتاج ثلاث رموز. واحد بالكهف، واحد هنا فوگ الأغصان، وواحد بآخر البستان."}],
            run:[{if:()=>!World.S.flags.gate_open, puzzle:"symbols", title:"لغز البوابة", intro:"اسمعي النغمات وشوفي الرموز تلمع، وعيدي الترتيب.", syms:["leaf","drop","moon"], labels:["ورقة","قطرة","هلال"], order:[0,2,1], win:"البوابة انفتحت!"},
              {run:()=>{ if(!World.S.flags.gate_open){ World.S.flags.gate_open=1; World.save(); World.event("puzzle"); } }}, {goto:"cottage", at:10}]}]},
      cottage:{theme:"wTall", len:130, gk:"grass", amb:"fireflies", sky:"linear-gradient(180deg,#F6B48A,#F7DCA8)",
        objs:[sign("co_back",12,"old",160,"الساحة"), {id:"hut", x:80, w:26, a:()=>WART.cottage(), label:"الكوخ المخفي", ph:24, run:[{say:"elaf", t:"هذا الكوخ اللي حچينا عليه! مكاننا السري."}, {say:"adool", t:"وجوّا… هدية."}, {run:()=>{ if(!World.S.taken.cottage_gift){ World.S.taken.cottage_gift=1; World.give("star",3); World.gift("cottage","هدية الكوخ السري",{decor:"starLamp"}); } }}]}, note("cottage",110,80)]},
      night:{theme:"wNight", len:200, gk:"earth", amb:"fireflies", sky:"linear-gradient(180deg,#14112B,#2E2A5C)",
        objs:[sign("n_back",12,"glow",160,"الفطر"), ...R(5,LIGHT), note("night",190,80)]}
    },
    beats:[
      {scene:"trail", cast:{elaf:[22], adool:[14]}, player:"elaf", follow:["adool"]},
      {say:"elaf", t:"الغابة كبيرة اليوم! اللافتات تودينا لكل مكان.", e:"wave"},
      {say:"adool", t:"نمشي بالأزرار، ونقفز بزر القفزة. ونجمع الأوراق اللي نلگاها.", e:"happy"},
      {explore:{until:"__never", hints:[{after:12, who:"adool", t:"اضغطي «تفاعل» يم اللافتة حتى نروح لمكان ثاني."},{after:30, who:"elaf", t:"الفراشة تدل على الأسرار. شوفي وين تطير."}]}}
    ]
  };
  const story = {id:"wforest", title:"غابة الاستكشاف", sky:"linear-gradient(180deg,#BFE0F0,#E8F4E0)", theme:{root:62, scale:[0,2,4,7,9], tempo:88, chords:[0,3,4,2], motif:[0,null,2,4,null,4,2,null, 5,null,4,null,2,null,null,null]}, chapters:[chap]};
  return { NOTES, chap, story };
})();

World.region("forest", (body, {shell}) => {
  // المحرك له واجهته الخاصة: نخفي رأس العالم ونرجع للخريطة من زر الرجوع
  shell.v.querySelector(".wd-head").hidden = true;
  body.classList.add("wfo");
  const S = World.S;
  const clean = TalesEngine.playExt(body, {
    story:WForest.story, chap:WForest.chap, cast:["elaf","adool"],
    exit:()=>World.leaveTo("world"),
    taken:k=>!!S.taken[k], take:k=>{ S.taken[k]=1; World.save(); },
    onPickup:it=>World.give(it.k, 1),
    itemArt:k=>(WART.item[k]||WART.item.star)(),
    invHTML:()=>["leaf","rune","berry","mushroom"].filter(k=>S.inv[k]).map(k=>`<span class="tp-ipill">${WART.item[k]()}<b>${S.inv[k]}</b></span>`).join(""),
    onScene:(id)=>{ if(!S.flags["fv_"+id]){ S.flags["fv_"+id]=1; World.save(); World.checkAch(); } }
  });
  S.flags.fv_trail=1; World.save();
  return clean;
});
