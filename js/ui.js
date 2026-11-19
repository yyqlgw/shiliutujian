/* 页面渲染：图鉴墙 / 抽盒 / 我的 + 弹窗 + 导航 */
var curTab = 0;
var filter = '全部';

/* ---------- 页面 1：图鉴墙 ---------- */
function pageCollection(){
  var got = collectedCount(), total = CATALOG.length;
  var pct = total ? Math.round(got*100/total) : 0;
  var h = '';

  h += '<div class="card">'
     + '<div class="prog"><span class="t">图鉴墙</span>'
     + '<span class="n">已点亮 '+got+' / '+total+'</span></div>'
     + '<div class="pbar"><i style="width:'+pct+'%"></i></div></div>';

  h += '<div class="chips">';
  ['全部'].concat(CAT_NAMES).forEach(function(f){
    h += '<div class="chip'+(f===filter?' on':'')+'" onclick="setFilter(\''+f+'\')">'+f+'</div>';
  });
  h += '</div>';

  h += '<div class="grid">';
  CATALOG.forEach(function(e, i){
    var ok = isCollected(e.id);
    if (filter !== '全部' && CAT_NAMES[e.cat] !== filter) return;
    var col = CAT_COLORS[e.cat] || CAT_COLORS[0];
    var bg = ok ? 'background:linear-gradient(135deg,'+col[0]+','+col[1]+')' : '';
    var icon = ok ? iconSvg(e.icon, '#fff') : iconSvg(e.icon, '#C9BCAE');
    h += '<div class="cell'+(ok?'':' lock')+'" onclick="openCell('+i+')">'
       + '<div class="ic" style="'+bg+'">'+icon+'</div>'
       + '<div class="nm">'+(ok?esc(e.name):'未点亮')+'</div></div>';
  });
  h += '</div>';

  h += '<div style="font-size:.66em;color:var(--sub);line-height:1.8;padding:16px 4px 4px">'
     + '点亮一枚图鉴，就能读到它背后的文化故事。每天一次抽盒机会，浇水或答题获得。</div>';
  return h;
}
function setFilter(f){ filter = f; render(); }

function openCell(i){
  var e = CATALOG[i];
  if (!isCollected(e.id)) { toast('先去「抽盒」页获得它吧'); return; }
  var col = CAT_COLORS[e.cat] || CAT_COLORS[0];
  var html = '<div class="modal rwrap">'
    + '<div class="ric" style="background:linear-gradient(135deg,'+col[0]+','+col[1]+')">'
    + iconSvg(e.icon,'#fff')+'</div>'
    + '<div class="rname">'+esc(e.name)+'</div>'
    + '<div class="rtag">'+(CAT_NAMES[e.cat]||'')+'</div>'
    + '<div style="text-align:left;font-size:.82em;line-height:1.9;color:#FFE8DC;margin:14px 0 4px">'
    + esc(e.story)+'</div>'
    + '<div style="font-size:.68em;color:#E0A796;margin-bottom:16px">点亮时间：'
    + (S.collected[e.id]||'—')+'</div>'
    + '<div class="mrow"><button class="pri" onclick="closeMask();switchTab(1)">再去抽一枚</button>'
    + '<button onclick="closeMask()">关闭</button></div></div>';
  showMask(html);
}

/* ---------- 页面 2：抽盒 ---------- */
var shaking = false;

function pageDraw(){
  var ready = hasChance();
  var h = '';

  h += '<div class="card"><div style="font-size:.84em;font-weight:800;margin-bottom:8px">今日抽盒机会</div>'
     + '<div style="font-size:.78em;color:var(--sub)">'
     + (!canDraw() ? '今日已开盒，明天再来'
        : (ready ? '机会已就绪，点击盲盒开盒！' : '尚未获得开盒机会 · 先浇水或答题'))
     + '</div></div>';

  h += '<div class="boxWrap"><div class="boxGlow"></div>'
     + '<div class="burst" id="burst"></div>'
     + '<div class="box'+(shaking?' shake':'')+'" id="box" onclick="tapBox()">'
     + '<div class="hl"></div><div class="q">?</div></div></div>';

  h += '<div style="text-align:center;font-size:.74em;color:var(--sub);margin-bottom:14px">'
     + (ready ? (shaking ? '再点一下，揭晓图鉴！' : '轻触盲盒，抽取今日图鉴')
              : '完成浇水或答题，获得开盒机会')
     + '</div>';

  h += '<div class="row" style="margin-bottom:14px">'
     + '<button class="btn ghost" onclick="openWater()">浇水</button>'
     + '<button class="btn ghost" onclick="openQuiz()">答题</button>'
     + '<button class="btn" '+(ready?'':'disabled')+' onclick="tapBox()">开 盒</button></div>';

  h += '<div style="text-align:center;font-size:.72em;color:var(--sub)">累计抽盒 '
     + S.drawCount+' 次 · 已点亮 '+collectedCount()+' / '+CATALOG.length+'</div>';
  return h;
}

function tapBox(){
  if (!hasChance()) { toast('先完成浇水或答题，获得开盒机会'); return; }
  if (!shaking) {
    shaking = true;
    render();
    return;
  }
  doOpen();
}

function doOpen(){
  shaking = false;
  var b = $('box');
  if (b) { b.classList.remove('shake'); b.classList.add('opening'); }
  var bu = $('burst');
  if (bu) {
    var rays = '';
    for (var i=0;i<8;i++) rays += '<i style="transform:rotate('+(i*45)+'deg) translateY(-84px)"></i>';
    bu.innerHTML = rays;
    bu.classList.add('go');
  }
  beep(880, 0.10);
  setTimeout(function(){
    var idx = pickEntry();
    var e = CATALOG[idx];
    var newly = !isCollected(e.id);
    if (newly) S.collected[e.id] = today();
    S.drawDate = today();
    S.drawDays[today()] = 1;
    S.drawCount++;
    save();
    if (newly) beep(1180, 0.10);
    reveal(idx, newly);
  }, 620);
}

function pickEntry(){
  var un = [];
  CATALOG.forEach(function(e,i){ if (!isCollected(e.id)) un.push(i); });
  if (!un.length) return Math.floor(Math.random()*CATALOG.length);
  if (Math.random() < 0.85) return un[Math.floor(Math.random()*un.length)];
  return Math.floor(Math.random()*CATALOG.length);
}

function reveal(idx, newly){
  var e = CATALOG[idx];
  var col = CAT_COLORS[e.cat] || CAT_COLORS[0];
  var html = '<div class="modal rwrap">'
    + '<div class="ric" style="background:linear-gradient(135deg,'+col[0]+','+col[1]+')">'
    + iconSvg(e.icon,'#fff')+'</div>'
    + '<div class="rname">'+esc(e.name)+'</div>'
    + '<div class="rtag">'+(CAT_NAMES[e.cat]||'')+'</div>'
    + '<div class="rst" style="color:'+(newly?'#FFD27A':'#FFD9C8')+'">'
    + (newly ? '🎉 新图鉴点亮！' : '重复获得 · 收藏值 +1')+'</div>'
    + '<div class="mrow" style="margin-bottom:10px">'
    + '<button class="pri" onclick="closeMask();openCell('+idx+')">查看故事</button></div>'
    + '<div class="mrow"><button onclick="closeMask();render()">收下</button></div></div>';
  showMask(html);
}

/* ---------- 我的页 ---------- */
function pageProfile(){
  var got = collectedCount(), total = CATALOG.length;
  var pct = total ? Math.round(got*100/total) : 0;
  var h = '';

  h += '<div class="card"><div style="display:flex;align-items:center;justify-content:space-between">'
     + '<span class="titleBig">'+titleName()+'</span>'
     + '<span style="font-size:.72em;color:var(--sub)">已点亮 '+got+' / '+total+'</span></div>'
     + '<div class="pbar" style="margin-top:12px"><i style="width:'+pct+'%"></i></div></div>';

  h += '<div class="sec">收集足迹</div>';
  h += '<div class="stat">'
     + '<div class="c"><b>'+S.drawCount+'</b><span>抽盒次数</span></div>'
     + '<div class="c"><b>'+S.waterCount+'</b><span>浇水次数</span></div>'
     + '<div class="c"><b>'+S.quizCount+'</b><span>答题次数</span></div>'
     + '<div class="c"><b>'+streakDays()+' 天</b><span>连续天数</span></div>'
     + '<div class="c"><b>'+got+' 枚</b><span>已点亮</span></div>'
     + '<div class="c"><b>'+total+' 枚</b><span>图鉴总数</span></div>'
     + '</div>';

  h += '<div class="sec">我的民族团结力</div>';
  h += '<div class="card" style="padding:10px 6px 6px">'
     + '<canvas id="radar"></canvas>'
     + '<div style="text-align:center;font-size:.66em;color:var(--sub);padding:2px 0 6px">'
     + '六维能力随收集进度变化 · 纯视觉展示</div></div>';

  h += '<div class="sec">数据备份</div>';
  h += '<div class="row" style="margin-bottom:10px">'
     + '<button class="btn ghost" onclick="exportBackup()">导出备份</button>'
     + '<button class="btn ghost" onclick="importBackup()">导入恢复</button></div>';
  h += '<div style="font-size:.66em;color:var(--sub);line-height:1.8;padding:0 4px 4px">'
     + '导出的 JSON 与安卓版通用，可两端互相导入。数据只存在本机，不上传服务器。</div>';

  h += '<div class="sec">关于</div>';
  h += '<button class="btn ghost" style="margin-bottom:10px" onclick="openAbout()">'
     + '作者信息 / 更新日志 / 免责声明</button>';

  h += '<div style="text-align:center;font-size:.68em;color:var(--sub);line-height:1.9;padding:18px 10px 6px">'
     + '像石榴籽一样紧紧抱在一起，<br>收集的每一枚图鉴，都是一次文化相遇。</div>';
  return h;
}

/* 雷达图 */
function drawRadar(){
  var cv = $('radar');
  if (!cv) return;
  var dpr = window.devicePixelRatio || 1;
  var rect = cv.getBoundingClientRect();
  var w = rect.width, hh = rect.height || 290;
  if (!w) return;
  cv.width = w * dpr; cv.height = hh * dpr;
  var g = cv.getContext('2d');
  g.scale(dpr, dpr);

  var n = collectedCount(), dc = S.drawCount, wc = S.waterCount, qc = S.quizCount, st = streakDays();
  var vals = [
    Math.min(100, n*6), Math.min(100, dc*9), Math.min(100, wc*12),
    Math.min(100, qc*12), Math.min(100, st*12), Math.min(100, n*5 + dc*3)
  ];
  var labels = ['文化力','探索力','守护力','传承力','团结力','行动力'];

  var cx = w/2, cy = hh/2 + 2;
  var R = Math.min(w/2 - 46, hh/2 - 30);
  if (R <= 0) return;

  function pt(i, r){
    var a = -Math.PI/2 + i*Math.PI*2/6;
    return [cx + Math.cos(a)*r, cy + Math.sin(a)*r];
  }

  g.strokeStyle = '#F0E2D8'; g.lineWidth = 1;
  for (var ring=1; ring<=4; ring++){
    g.beginPath();
    for (var i=0;i<6;i++){
      var p = pt(i, R*ring/4);
      if (i===0) g.moveTo(p[0],p[1]); else g.lineTo(p[0],p[1]);
    }
    g.closePath(); g.stroke();
  }
  g.strokeStyle = '#E8D9CE';
  for (var i=0;i<6;i++){
    var p = pt(i, R);
    g.beginPath(); g.moveTo(cx,cy); g.lineTo(p[0],p[1]); g.stroke();
  }
  g.beginPath();
  for (var i=0;i<6;i++){
    var r = R * Math.max(0, Math.min(1, vals[i]/100));
    var p = pt(i, r);
    if (i===0) g.moveTo(p[0],p[1]); else g.lineTo(p[0],p[1]);
  }
  g.closePath();
  g.fillStyle = 'rgba(232,64,47,.34)'; g.fill();
  g.strokeStyle = '#E8402F'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#E8402F';
  for (var i=0;i<6;i++){
    var r = R * Math.max(0, Math.min(1, vals[i]/100));
    var p = pt(i, r);
    g.beginPath(); g.arc(p[0],p[1],3.4,0,Math.PI*2); g.fill();
  }
  g.fillStyle = '#8A7268';
  g.font = '600 12px -apple-system,"PingFang SC",sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (var i=0;i<6;i++){
    var p = pt(i, R + 18);
    g.fillText(labels[i], Math.max(16, Math.min(w-16, p[0])), Math.max(10, Math.min(hh-6, p[1])));
  }
}

/* ---------- 弹窗 ---------- */
function showMask(html){
  var m = $('mask');
  m.innerHTML = html;
  m.classList.add('on');
}
function closeMask(){
  var m = $('mask');
  if (!m) return;
  m.classList.remove('on');
  m.innerHTML = '';
  if (typeof resetQuiz === 'function') resetQuiz();
  shaking = false;
}

/* ---------- 渲染与导航 ---------- */
function render(){
  var main = $('main');
  if (curTab === 0) main.innerHTML = pageCollection();
  else if (curTab === 1) main.innerHTML = pageDraw();
  else main.innerHTML = pageProfile();

  var items = document.querySelectorAll('#nav div');
  for (var i=0;i<items.length;i++){
    items[i].classList.toggle('on', +items[i].dataset.tab === curTab);
  }
  if (curTab === 2) setTimeout(drawRadar, 30);
  main.scrollTop = 0;
}
function switchTab(i){
  if (curTab === i) return;
  curTab = i;
  closeMask();
  render();
}
