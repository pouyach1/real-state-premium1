(function(){
  var mark = document.getElementById('lmark');
  'درخشان'.split('').forEach(function(ch,i){
    var s = document.createElement('span'); s.textContent = ch;
    s.style.animationDelay = (i*0.05)+'s'; mark.appendChild(s);
  });
  var pct = document.getElementById('pct'), p = 0;
  var digits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  function toFa(n){ return String(n).split('').map(function(d){return digits[+d]||d;}).join(''); }
  var iv = setInterval(function(){
    p += Math.random()*18;
    if(p>=100){ p=100; clearInterval(iv); finish(); }
    pct.textContent = toFa(Math.round(p))+'٪';
  }, 160);

  function finish(){
    setTimeout(function(){
      document.getElementById('curtain').classList.add('go');
      setTimeout(function(){
        document.getElementById('loader').style.display='none';
        document.body.classList.remove('locked');
        reveal();
      }, 550);
    }, 260);
  }

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(){
    document.querySelectorAll('[data-split] i').forEach(function(el,i){
      setTimeout(function(){ el.parentElement.classList.add('in'); }, i*90);
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('in'); });
    }, {threshold:.2});
    document.querySelectorAll('[data-r]').forEach(function(el){ io.observe(el); });

    var counted = new WeakSet();
    var ioNum = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !counted.has(e.target)){
          counted.add(e.target); countUp(e.target);
        }
      });
    }, {threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(el){ ioNum.observe(el); });
  }

  function countUp(el){
    var target = +el.dataset.count, suf = el.dataset.suffix||'';
    var t0 = performance.now(), dur = 1400;
    function step(t){
      var k = Math.min(1, (t-t0)/dur);
      var v = Math.round(target * (1 - Math.pow(1-k,3)));
      el.textContent = toFa(v)+suf;
      if(k<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var qslides = document.querySelectorAll('.qslide'), qdots = document.querySelectorAll('.qdots i'), qi=0;
  function showQ(i){
    qslides.forEach(function(s,k){ s.classList.toggle('on', k===i); });
    qdots.forEach(function(d,k){ d.classList.toggle('on', k===i); });
    qi = i;
  }
  qdots.forEach(function(d,i){ d.addEventListener('click', function(){ showQ(i); }); });
  setInterval(function(){ showQ((qi+1)%qslides.length); }, 6000);

  var prog = document.getElementById('progress'), hdr = document.getElementById('hdr');
  function onScroll(){
    var h = document.documentElement;
    var s = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    prog.style.transform = 'scaleX(' + s + ')';
    hdr.classList.toggle('stuck', h.scrollTop > 40);
    horizontal();
    flightTick();
  }

  var pin = document.getElementById('pin'), track = document.getElementById('trackH');
  function horizontal(){
    if(!pin || RM) return;
    var outer = document.getElementById('pinOuter');
    var r = outer.getBoundingClientRect();
    var total = outer.offsetHeight - window.innerHeight;
    var k = Math.min(1, Math.max(0, -r.top / Math.max(1,total)));
    var dist = Math.max(0, track.scrollWidth - window.innerWidth + 80);
    track.style.transform = 'translateX(' + (k*dist) + 'px)';
    var lbScale = Math.min(1, k*6, (1-k)*6);
    document.querySelectorAll('.pin .lb').forEach(function(lb){ lb.style.height = (10 - Math.min(6,lbScale*6)) + '%'; });
  }

  var flightSec = document.getElementById('flight');
  var shots = document.querySelectorAll('.shot');
  var caps = document.querySelectorAll('.cap');
  var lbTop = document.getElementById('lbTop'), lbBottom = document.getElementById('lbBottom');
  var gateGlow = document.getElementById('gateGlow');
  var flightNum = document.getElementById('flightNum');
  var faDigits = digits;
  function faNum(n){ return toFa(n); }

  function flightTick(){
    if(RM || !flightSec) return;
    var r = flightSec.getBoundingClientRect();
    var total = flightSec.offsetHeight - window.innerHeight;
    var raw = -r.top / Math.max(1,total);
    var k = Math.min(1, Math.max(0, raw));

    var bars = 0;
    if(k < 0.04) bars = (0.04-k)/0.04;
    else if(k > 0.96) bars = (k-0.96)/0.04;
    lbTop.style.height = (bars*11)+'vh';
    lbBottom.style.height = (bars*11)+'vh';

    var n = 5, seg = 1/n;
    var idx = Math.min(n-1, Math.floor(k/seg));
    var local = (k - idx*seg)/seg;

    shots.forEach(function(s,i){
      var d = +s.dataset.shot;
      var op = 0, tf = '';
      if(d === idx){ op = 1; }
      else if(d === idx-1 && local < 0.22){ op = 1 - local/0.22; }
      if(d === idx || (d===idx-1 && op>0)){
        var prog2 = (d===idx) ? local : 1;
        if(d===0) tf = 'scale(' + (1+prog2*0.18) + ') translateY(' + (-prog2*4) + '%)';
        if(d===1) tf = 'scale(' + (1.05+prog2*0.22) + ') translateY(' + (prog2*3) + '%)';
        if(d===2) tf = 'scale(' + (1+prog2*0.26) + ')';
        if(d===3) tf = 'scale(' + (1+prog2*0.1) + ')';
        if(d===4) tf = 'scale(' + (1.06-prog2*0.06) + ')';
      }
      s.style.opacity = op;
      s.style.transform = tf;
    });

    if(idx === 3){
      var leaves = document.querySelectorAll('.shot-gate .leaf');
      var ang = Math.min(76, local*90);
      leaves[0].style.transform = 'perspective(900px) rotateY(' + ang + 'deg)';
      leaves[1].style.transform = 'perspective(900px) rotateY(-' + ang + 'deg)';
      gateGlow.style.opacity = Math.min(1, local*1.4);
    } else if(idx > 3){
      var leaves2 = document.querySelectorAll('.shot-gate .leaf');
      leaves2[0].style.transform = 'perspective(900px) rotateY(76deg)';
      leaves2[1].style.transform = 'perspective(900px) rotateY(-76deg)';
    }

    caps.forEach(function(c){
      var ci = +c.dataset.cap;
      c.classList.toggle('on', ci===idx);
    });
    flightNum.textContent = faNum(idx+1) + ' / ' + faNum(5);
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();

  var burger = document.getElementById('burger'), drawer = document.getElementById('drawer');
  if(burger){
    burger.setAttribute('aria-expanded','false');
    burger.addEventListener('click', function(){
      var open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('locked', open);
    });
    drawer.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        drawer.classList.remove('open');
        burger.setAttribute('aria-expanded','false');
        document.body.classList.remove('locked');
      });
    });
  }

  if(RM) return;

  var cur = document.getElementById('cur'), curd = document.getElementById('curd');
  var mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
  document.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    curd.style.transform = 'translate3d('+mx+'px,'+my+'px,0)';
  });
  (function loop(){
    cx += (mx-cx)*0.16; cy += (my-cy)*0.16;
    cur.style.transform = 'translate3d('+cx+'px,'+cy+'px,0)';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.card,.slab').forEach(function(el){
    el.addEventListener('mouseenter', function(){ cur.classList.add('big'); });
    el.addEventListener('mouseleave', function(){ cur.classList.remove('big'); });
  });

  document.querySelectorAll('[data-magnet]').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width/2, y = e.clientY - r.top - r.height/2;
      el.style.transform = 'translate('+(x*0.28)+'px,'+(y*0.38)+'px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  });

  document.querySelectorAll('[data-tilt]').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
      el.style.transform = 'perspective(1000px) rotateY('+((px-.5)*11)+'deg) rotateX('+((.5-py)*11)+'deg) translateY(-8px)';
      var g = el.querySelector('.glare');
      if(g){ g.style.setProperty('--mx', (px*100)+'%'); g.style.setProperty('--my', (py*100)+'%'); }
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  });

  var stage = document.getElementById('stage');
  if(stage){
    var hx = 0, hy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function(e){
      tx = (e.clientX/innerWidth - .5); ty = (e.clientY/innerHeight - .5);
    });
    (function pl(){
      hx += (tx-hx)*0.06; hy += (ty-hy)*0.06;
      stage.querySelectorAll('[data-depth]').forEach(function(el){
        var d = +el.dataset.depth;
        el.style.translate = (-hx*d)+'px ' + (-hy*d)+'px';
        el.style.rotate = 'y ' + (hx*d*0.12) + 'deg';
      });
      requestAnimationFrame(pl);
    })();
  }

  var cv = document.getElementById('shards'), ctx = cv.getContext('2d');
  var W, H, parts = [];
  function size(){
    W = cv.width = innerWidth * Math.min(2, devicePixelRatio||1);
    H = cv.height = innerHeight * Math.min(2, devicePixelRatio||1);
    cv.style.width = innerWidth+'px'; cv.style.height = innerHeight+'px';
    var n = Math.round(Math.min(90, innerWidth/16));
    parts = [];
    for(var i=0;i<n;i++){
      parts.push({
        x: Math.random()*W, y: Math.random()*H,
        r: (Math.random()*2.4+0.7) * (devicePixelRatio||1),
        vx: (Math.random()-.5)*0.28, vy: (Math.random()*-0.42-0.06),
        a: Math.random()*Math.PI*2, s: Math.random()*0.012+0.003,
        o: Math.random()*0.5+0.18
      });
    }
  }
  size(); window.addEventListener('resize', size);
  var pointer = {x:-9999,y:-9999};
  window.addEventListener('mousemove', function(e){
    var k = Math.min(2, devicePixelRatio||1);
    pointer.x = e.clientX*k; pointer.y = e.clientY*k;
  });
  (function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<parts.length;i++){
      var p2 = parts[i];
      p2.x += p2.vx; p2.y += p2.vy; p2.a += p2.s;
      if(p2.y < -20) { p2.y = H+20; p2.x = Math.random()*W; }
      if(p2.x < -20) p2.x = W+20; if(p2.x > W+20) p2.x = -20;

      var dx = p2.x-pointer.x, dy = p2.y-pointer.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      var boost = dist < 220 ? (1 - dist/220) : 0;
      if(boost > 0){ p2.x += dx/dist*boost*1.6; p2.y += dy/dist*boost*1.6; }

      ctx.save();
      ctx.translate(p2.x,p2.y); ctx.rotate(p2.a);
      ctx.beginPath();
      ctx.moveTo(0,-p2.r*2.1); ctx.lineTo(p2.r,0); ctx.lineTo(0,p2.r*2.1); ctx.lineTo(-p2.r,0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,163,255,' + (p2.o + boost*0.5).toFixed(3) + ')';
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  })();

  document.getElementById('themeBtn').addEventListener('click', function(){
    var curT = document.documentElement.getAttribute('data-theme');
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next = curT ? (curT === 'dark' ? 'light' : 'dark') : (dark ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('drk-theme', next); }catch(e){}
  });
  try{
    var saved = localStorage.getItem('drk-theme');
    if(saved) document.documentElement.setAttribute('data-theme', saved);
  }catch(e){}

})();
