/* =====================================================================
   عالمنا — نهر الألعاب المائية
   كل لعبة داخل إطارها، وكل شي يتحرك يتحسب بحجمه حتى ما يطلع برّا.
   الحركة بالأزرار فقط، والخسارة لطيفة بدون عقوبة.
   ===================================================================== */
const WRiver = (() => {
  const rand = (a,b) => a + Math.random()*(b-a);
  const spr = (layer, html, w, hh, cls="") => { const el=h(`<div class="w-sprite ${cls}" style="width:${w}px;height:${hh}px">${html}</div>`); layer.appendChild(el); return el; };
  const put = (el, x, y, extra="") => { el.style.transform = `translate(${x}px,${y}px) ${extra}`; };

  const GAMES = {
    bubbles:{title:"فقاعات النهر", art:()=>`<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="#E6F4FA" stroke="#8EC3CF" stroke-width="3"/><circle cx="22" cy="22" r="6" fill="#fff"/></svg>`, how:"اضغطي الفقاعات قبل لا توصل لسطح الماي. الفقاعات تبقى داخل الإطار.", levels:["هادي","متوسط","سريع"], bg:"linear-gradient(180deg,#CFE8EE,#8EC3CF)",
      run(ctx){ const L=ctx.layer, N=[14,18,22][ctx.level]; let spawned=0, got=0, list=[], t=0;
        ctx.stat(`فقعتي 0 من ${N}`);
        ctx.loop((dt)=>{ t-=dt; const W=ctx.W(), H=ctx.H();
          if(spawned<N && t<=0){ t=rand(.6,1.1)-ctx.level*.15; const s=rand(48,74); const b={s, x:rand(0,W-s), y:H-s, vy:rand(40,64)+ctx.level*18, ph:rand(0,6), el:null}; b.el=spr(L, `<button class="wr-bub" aria-label="فقاعة">${Math.random()<.3?WART.item.berry():""}</button>`, s, s); b.el.firstChild.onpointerdown=e=>{ e.preventDefault(); if(b.dead) return; b.dead=true; got++; ctx.sfx("pop"); ctx.stat(`فقعتي ${got} من ${N}`); b.el.classList.add("pop"); setTimeout(()=>b.el.remove(),250); }; list.push(b); spawned++; }
          list.forEach(b=>{ if(b.dead) return; b.y-=b.vy*dt; const sx=motionOK()?Math.sin(performance.now()/600+b.ph)*12:0; const [x,y]=ctx.fit(b.x+sx, b.y, b.s, b.s); put(b.el,x,y); if(b.y<=0){ b.dead=true; b.el.classList.add("fade"); setTimeout(()=>b.el.remove(),300); } });
          list=list.filter(b=>!b.dead);
          if(spawned>=N && !list.length) ctx.win(got>=N*.7?"فقعتي أغلب الفقاعات!":"لعبة حلوة!", {drop:2, star:got>=N*.7?1:0}, got>=N*.85?3:got>=N*.5?2:1);
        }); } },
    leaves:{title:"التقاط الأوراق", art:()=>WART.item.leaf(), how:"حرّكي السلة يمين ويسار بالأزرار، والقطي الأوراق قبل لا توصل للماي.", levels:["هادي","متوسط","سريع"], bg:"linear-gradient(180deg,#E6F2DA,#9EC6D8)", pad:true,
      run(ctx){ const L=ctx.layer, N=[16,20,24][ctx.level]; let x=ctx.W()/2-45, sp=0, got=0, list=[], t=0; const BW=90, BH=46;
        const bk=spr(L, `<svg viewBox="0 0 120 60"><path d="M20 22C20 6 100 6 100 22" stroke="#7A5A3A" stroke-width="5" fill="none"/><path d="M6 22h108l-12 34H18z" fill="#D9B88A" stroke="#7A5A3A" stroke-width="3"/></svg>`, BW, BH);
        ctx.stat(`القطتي 0 من ${N}`);
        ctx.loop(dt=>{ const W=ctx.W(), H=ctx.H(); const d=(ctx.pad.held.has("right")?1:0)-(ctx.pad.held.has("left")?1:0); x+=d*(260+ctx.level*60)*dt; [x]=ctx.fit(x,0,BW,BH); put(bk,x,H-BH-6);
          t-=dt; if(sp<N && t<=0){ t=rand(.7,1.2)-ctx.level*.12; const s=34; const lf={x:rand(0,W-s), y:0, s, vy:rand(70,100)+ctx.level*30, rot:rand(0,360), el:spr(L, WART.item[Math.random()<.15?"star":"leaf"](), s, s)}; lf.star=lf.el.innerHTML.includes("F2D27A"); list.push(lf); sp++; }
          list.forEach(l=>{ l.y+=l.vy*dt; l.rot+=60*dt; l.x+=Math.sin(l.y/40)*.6; const [lx,ly]=ctx.fit(l.x,l.y,l.s,l.s); put(l.el,lx,ly,`rotate(${l.rot}deg)`);
            if(l.y+l.s>=H-BH-6 && l.y<H-BH+10 && lx+l.s>x+8 && lx<x+BW-8){ l.done=true; got++; ctx.sfx("pick"); ctx.stat(`القطتي ${got} من ${N}`); l.el.remove(); }
            else if(l.y>=H-l.s){ l.done=true; l.el.classList.add("fade"); setTimeout(()=>l.el.remove(),300); } });
          list=list.filter(l=>!l.done);
          if(sp>=N && !list.length) ctx.win("السلة امتلت أوراق!", {leaf:Math.max(1,Math.round(got/4)), star:got>=N*.7?1:0}, got>=N*.85?3:got>=N*.5?2:1);
        }); } },
    boat:{title:"قارب بين الصخور", art:()=>`<svg viewBox="0 0 100 50"><path d="M4 20h92L80 46H20z" fill="#FBF6E8" stroke="#B8A57A" stroke-width="2.5"/><path d="M50 2L30 20h40z" fill="#FBF6E8" stroke="#B8A57A" stroke-width="2.5"/></svg>`, how:"وجّهي القارب الورقي يمين ويسار بين الصخور، واجمعي القطرات. الصخرة بس تدفعج شوية.", levels:["هادي","متوسط","سريع"], bg:"linear-gradient(180deg,#9EC6D8,#6FAAB8)", pad:true,
      run(ctx){ const L=ctx.layer, DUR=[30,30,30][ctx.level]; let x=ctx.W()/2-28, time=0, got=0, list=[], t=0, bump=0; const BW=56, BH=40;
        const boat=spr(L, `<svg viewBox="0 0 100 70"><path d="M4 30h92L80 66H20z" fill="#FBF6E8" stroke="#B8A57A" stroke-width="3"/><path d="M50 2L30 30h40z" fill="#FBF6E8" stroke="#B8A57A" stroke-width="3"/></svg>`, BW, BH);
        ctx.loop(dt=>{ const W=ctx.W(), H=ctx.H(); time+=dt; ctx.stat(`القطرات: ${got} — الوقت ${Math.max(0,Math.ceil(DUR-time))}`);
          const d=(ctx.pad.held.has("right")?1:0)-(ctx.pad.held.has("left")?1:0); x+=d*240*dt + bump*dt; bump*=.9; [x]=ctx.fit(x,0,BW,BH); const by=H-BH-20; put(boat,x,by,`rotate(${d*8}deg)`);
          t-=dt; if(time<DUR && t<=0){ t=rand(.5,.9)-ctx.level*.1; const rock=Math.random()<.55, s=rock?rand(36,56):30; list.push({rock, s, x:rand(0,W-s), y:0, vy:120+ctx.level*50, el:spr(L, rock?`<svg viewBox="0 0 60 40"><ellipse cx="30" cy="24" rx="28" ry="15" fill="#8C8A9E" stroke="#5E5A70" stroke-width="2.4"/></svg>`:WART.item.drop(), s, rock?s*.66:s)}); }
          list.forEach(o=>{ o.y+=o.vy*dt; const oh=o.rock?o.s*.66:o.s; const [ox,oy]=ctx.fit(o.x,o.y,o.s,oh); put(o.el,ox,oy);
            if(!o.hit && o.y+oh>by+6 && o.y<by+BH-6 && ox+o.s>x+6 && ox<x+BW-6){ o.hit=true; if(o.rock){ bump=(x+BW/2<ox+o.s/2?-1:1)*260; ctx.sfx("bump"); ctx.say("طق! الصخرة دفعتنا."); } else { got++; ctx.sfx("pick"); o.el.remove(); o.gone=true; } }
            if(!o.gone && o.y>=H-oh){ o.gone=true; o.el.classList.add("fade"); setTimeout(()=>o.el.remove(),300); } });
          list=list.filter(o=>!o.gone);
          if(time>=DUR && !list.length) ctx.win("وصلنا آخر النهر!", {drop:Math.max(1,Math.round(got/3)), star:got>=8?1:0}, got>=12?3:got>=6?2:1);
        }); } },
    berries:{title:"توت عائم", art:()=>WART.item.berry(), how:"التوت يطفو مع التيار. اضغطي على التوت وبس، وخلي الأوراق تمشي.", levels:["هادي","متوسط","سريع"], bg:"linear-gradient(180deg,#B8DCE4,#7FB6C4)",
      run(ctx){ const L=ctx.layer, N=[12,15,18][ctx.level]; let got=0, list=[], t=0;
        const plan = Array.from({length:N},()=>true).concat(Array.from({length:Math.round(N/2)},()=>false)).sort(()=>Math.random()-.5);
        ctx.stat(`التوت: 0 من ${N}`);
        ctx.loop(dt=>{ const W=ctx.W(), H=ctx.H(); t-=dt;
          if(plan.length && t<=0){ t=rand(.55,.95)-ctx.level*.1; const isB=plan.shift(), s=isB?50:42; const o={b:isB, s, x:0, y:rand(10,Math.max(12,H-s-10)), vx:rand(70,110)+ctx.level*30, ph:rand(0,6)};
            o.el=spr(L, `<button class="wr-fl" aria-label="${isB?"توت":"ورقة"}">${isB?WART.item.berry():WART.item.leaf()}</button>`, s, s);
            o.el.firstChild.onpointerdown=e=>{ e.preventDefault(); if(o.gone) return; if(o.b){ o.gone=true; got++; ctx.sfx("pick"); ctx.stat(`التوت: ${got} من ${N}`); o.el.remove(); } else { ctx.sfx("soft"); ctx.say("هاي ورقة، خليها تمشي."); } };
            list.push(o); }
          list.forEach(o=>{ o.x+=o.vx*dt; const yy=o.y+(motionOK()?Math.sin(performance.now()/500+o.ph)*8:0); const [fx,fy]=ctx.fit(o.x,yy,o.s,o.s); put(o.el,fx,fy); if(o.x>=W-o.s){ o.gone=true; o.el.classList.add("fade"); setTimeout(()=>o.el.remove(),300); } });
          list=list.filter(o=>!o.gone);
          if(!plan.length && !list.length) ctx.win("سلة توت كاملة!", {berry:Math.max(1,Math.round(got/3))}, got>=N*.8?3:got>=N*.5?2:1);
        }); } },
    pipes:{title:"مجرى الماي للحديقة", art:()=>WART.item.drop(), how:"دوّري قطع المجرى حتى يوصل الماي من النبع (فوق يسار) للحديقة (جوّا يمين).", levels:["4×4","5×5"],
      run(ctx){ const N=[4,5][ctx.level]; const L=ctx.layer;
        // نبني مسار مضمون ونعطيه قطع، وباقي المربعات عشوائية، وبعدين نلخبط الاتجاهات
        const path=[[0,0]]; let [r,c]=[0,0]; while(r<N-1||c<N-1){ if(r<N-1 && (c===N-1 || Math.random()<.5)) r++; else c++; path.push([r,c]); }
        const cell=Array.from({length:N},()=>Array(N).fill(null)); const D={u:[-1,0],d:[1,0],l:[0,-1],r:[0,1]};
        const dirOf=(a,b)=>b[0]<a[0]?"u":b[0]>a[0]?"d":b[1]<a[1]?"l":"r"; const opp={u:"d",d:"u",l:"r",r:"l"};
        path.forEach((p,i)=>{ const ins = i===0 ? "u" : opp[dirOf(path[i-1],p)], out = i===path.length-1 ? "d" : dirOf(p,path[i+1]); cell[p[0]][p[1]] = {s: (ins==="u"&&out==="d")||(ins==="d"&&out==="u")||(ins==="l"&&out==="r")||(ins==="r"&&out==="l") ? "I" : "L", conn:[ins,out]}; });
        const ROT={u:"r",r:"d",d:"l",l:"u"}; const rot=(set,n)=>set.map(d=>{ for(let k=0;k<n;k++) d=ROT[d]; return d; });
        const base={I:["u","d"], L:["u","r"]};
        for(let i=0;i<N;i++) for(let j=0;j<N;j++){ if(!cell[i][j]) cell[i][j]={s:Math.random()<.5?"I":"L"}; const t=cell[i][j]; t.r=0; if(t.conn){ for(let k=0;k<4;k++){ const s=rot(base[t.s],k); if(t.conn.every(d=>s.includes(d))){ t.goal=k; break; } } } t.r=Math.floor(Math.random()*4); if(t.conn && t.r===t.goal) t.r=(t.r+1)%4; }
        const g=h(`<div class="wr-grid" style="--n:${N}">${cell.flat().map((t,i)=>`<button class="wr-pipe" data-i="${i}"></button>`).join("")}</div>`); L.appendChild(g);
        L.insertAdjacentHTML("beforeend", `<span class="wr-src">${WART.item.drop()}</span><span class="wr-dst">${WART.item.flower()}</span>`);
        const svg=(t,wet)=>{ const s=rot(base[t.s],t.r); const C={u:"50,0",d:"50,100",l:"0,50",r:"100,50"}; return `<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="10" fill="#C9B48A"/>${s.map(d=>`<line x1="50" y1="50" x2="${C[d].split(",")[0]}" y2="${C[d].split(",")[1]}" stroke="${wet?"#4E9EC0":"#8C6C48"}" stroke-width="26" stroke-linecap="round"/>`).join("")}<circle cx="50" cy="50" r="13" fill="${wet?"#4E9EC0":"#8C6C48"}"/></svg>`; };
        const flow=()=>{ const wet=new Set(); let cur=[0,0], from="u", ok=false; for(let k=0;k<N*N+2;k++){ const t=cell[cur[0]]&&cell[cur[0]][cur[1]]; if(!t) break; const s=rot(base[t.s],t.r); if(!s.includes(from)) break; wet.add(cur.join()); const out=s.find(d=>d!==from); if(cur[0]===N-1&&cur[1]===N-1&&out==="d"){ ok=true; break; } const nx=[cur[0]+D[out][0], cur[1]+D[out][1]]; from=opp[out]; cur=nx; } return {wet, ok}; };
        let moves=0; const draw=()=>{ const {wet,ok}=flow(); $$(".wr-pipe",g).forEach((b,i)=>{ const t=cell[Math.floor(i/N)][i%N]; b.innerHTML=svg(t, wet.has(`${Math.floor(i/N)},${i%N}`)); }); ctx.stat(`دورات: ${moves}`); return ok; };
        draw(); $$(".wr-pipe",g).forEach((b,i)=>b.onclick=()=>{ const t=cell[Math.floor(i/N)][i%N]; t.r=(t.r+1)%4; moves++; ctx.sfx("soft"); if(draw()){ ctx.sfx("splash"); setTimeout(()=>ctx.win("الماي وصل للحديقة!", {drop:3, seed:1}, moves<=N*N*1.2?3:2), 500); } }); } },
    mirror:{title:"انعكاس بالماي", art:()=>WART.item.shell(), how:"شوفي الشي اللي فوق الماي، واختاري انعكاسه الصحيح من الثلاثة.", levels:["5 أسئلة","8 أسئلة"],
      run(ctx){ const Q=[5,8][ctx.level], keys=["leaf","star","berry","flower","feather","shell","mushroom","honey","moon","cloud"]; let q=0, right=0;
        const ask=()=>{ if(q>=Q){ ctx.win(`عرفتي ${right} من ${Q}`, {shell:1, star:right>=Q-1?1:0}, right===Q?3:right>=Q*.6?2:1); return; }
          const k=keys[Math.floor(Math.random()*keys.length)], others=keys.filter(x=>x!==k).sort(()=>Math.random()-.5).slice(0,2), opts=[k,...others].sort(()=>Math.random()-.5);
          ctx.layer.innerHTML = `<div class="wr-mir"><div class="wr-obj">${WART.item[k]()}</div><div class="wr-water"></div><div class="wr-opts">${opts.map(o=>`<button data-o="${o}"><span class="wr-refl">${WART.item[o]()}</span></button>`).join("")}</div></div>`; ctx.stat(`السؤال ${q+1} من ${Q}`);
          $$("[data-o]",ctx.layer).forEach(b=>b.onclick=()=>{ if(b.dataset.o===k){ right++; ctx.sfx("pick"); b.classList.add("ok"); } else { ctx.sfx("soft"); b.classList.add("no"); $(`[data-o="${k}"]`,ctx.layer).classList.add("ok"); ctx.say("قريبة! الانعكاس الصح يلمع."); } q++; setTimeout(ask, 900); }); };
        ask(); } },
    rescue:{title:"إنقاذ اللعبة الطافية", art:()=>WART.cat(), how:"دمية جعموص الصغيرة طايفة بالنهر. اضغطي «ارمي الحبل» لما الحلقة تكون فوگها. ثلاث محاولات ناجحة تكفي.", levels:["هادي","أسرع"], bg:"linear-gradient(180deg,#B8DCE4,#6FAAB8)",
      run(ctx){ const L=ctx.layer; let tx=0, dir=1, saved=0, tries=0, busy=false; const TW=60, RW=70;
        const toy=spr(L, `<img src="${JM_SRC}" alt="" style="width:100%;height:100%;object-fit:contain">`, TW, TW*1.1);
        const ring=spr(L, `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="22" fill="none" stroke="#E87A6A" stroke-width="8"/><circle cx="30" cy="30" r="22" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="10 12"/></svg>`, RW, RW, "wr-ring");
        let rx=0, rdir=1;
        const btn=h(`<button class="btn honey wr-throw">ارمي الحبل</button>`); ctx.frame.parentNode.appendChild(btn);
        btn.onclick=()=>{ if(busy||ctx.paused) return; busy=true; tries++; ring.classList.add("drop"); const ok = Math.abs((rx+RW/2)-(tx+TW/2)) < 34; ctx.sfx("splash");
          setTimeout(()=>{ ring.classList.remove("drop"); busy=false; if(ok){ saved++; ctx.sfx("ok"); ctx.say(["مسكناه!","جعموص يگول شكراً!","آخر وحدة!"][Math.min(2,saved-1)]); toy.classList.add("saved"); setTimeout(()=>toy.classList.remove("saved"),600); } else ctx.say("قريبة! انتظري الحلقة تكون فوگه بالضبط.");
            ctx.stat(`أنقذتي ${saved} من 3`); if(saved>=3) ctx.win("جعموص رجع للبيت سالم!", {star:1, drop:1}, tries<=4?3:tries<=7?2:1); }, 500); };
        ctx.stat("أنقذتي 0 من 3");
        ctx.loop(dt=>{ const W=ctx.W(), H=ctx.H(); tx+=dir*(60+ctx.level*40)*dt; if(tx<=0||tx>=W-TW){ dir*=-1; } [tx]=ctx.fit(tx,0,TW,TW); put(toy, tx, H*.62+(motionOK()?Math.sin(performance.now()/400)*6:0));
          if(!busy){ rx+=rdir*(150+ctx.level*60)*dt; if(rx<=0||rx>=W-RW) rdir*=-1; [rx]=ctx.fit(rx,0,RW,RW); } put(ring, rx, H*.62-RW*.1); });
        return ()=>btn.remove(); } }
  };
  return { GAMES, spr, put, rand };
})();

World.region("river", (body) => {
  const v = h(`<div class="wr wrv"><div class="wrv-scene"><svg viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0 30C80 10 140 50 220 30S340 10 400 30v50H0z" fill="#8EC3CF"/><path class="wm-flow" d="M0 50C80 34 140 66 220 50S340 34 400 48" stroke="#E6F4FA" stroke-width="4" fill="none" stroke-dasharray="16 14"/></svg><div class="wrv-tt"></div></div><div class="wrv-list wgrid"></div><div class="wrv-game"></div></div>`);
  body.appendChild(v);
  $(".wrv-tt",v).appendChild(World.friendEl("turtle"));
  const list=$(".wrv-list",v), gbox=$(".wrv-game",v); let game=null, pad=null;
  function menu(){ game&&game.destroy(); pad&&pad.destroy(); game=pad=null; gbox.innerHTML=""; list.hidden=false;
    list.innerHTML = Object.entries(WRiver.GAMES).map(([k,g])=>`<button class="wtile" data-g="${k}"><span class="art">${g.art()}</span><b>${g.title}</b><small>${g.how.split(".")[0]}</small></button>`).join(""); $$("[data-g]",list).forEach(b=>b.onclick=()=>open(b.dataset.g)); }
  function open(k){ const g=WRiver.GAMES[k]; list.hidden=true; game=World.gameUI(gbox, Object.assign({id:k}, g), {back:menu});
    if(g.pad){ pad=World.pad(game.el); game.ctx.pad=pad; } }
  menu();
  return () => { game&&game.destroy(); pad&&pad.destroy(); };
});
