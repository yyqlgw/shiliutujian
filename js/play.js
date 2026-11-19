/* 玩法逻辑：浇水、答题、音效 */
var waterN = 0;
var quizSet = [], quizIdx = 0, quizRight = 0, answered = false;

/* ---------- 浇水 ---------- */
function openWater(){
  if (S.waterDate === today()) { toast('今天已经浇过水了'); return; }
  waterN = 0;
  var html = '<div class="modal">'
    + '<div style="text-align:center;font-size:1em;font-weight:800">给石榴树浇水</div>'
    + '<div class="plant"><svg viewBox="0 0 200 190" style="width:190px;height:180px">'
    + '<path d="M62 120 L74 176 L126 176 L138 120 Z" fill="#C97B5A"/>'
    + '<ellipse cx="100" cy="120" rx="38" ry="7" fill="#A85F45"/>'
    + '<ellipse cx="100" cy="118" rx="32" ry="5" fill="#6B4A33"/>'
    + '<path d="M100 118 V58" stroke="#3E8E41" stroke-width="5" stroke-linecap="round"/>'
    + '<ellipse cx="76" cy="66" rx="17" ry="9" fill="#3E8E41"/>'
    + '<ellipse cx="124" cy="70" rx="17" ry="9" fill="#3E8E41"/>'
    + '<circle cx="100" cy="48" r="10" fill="#E8402F"/>'
    + '<circle id="drop" cx="100" cy="10" r="6" fill="#7FD4FF" opacity="0"/>'
    + '</svg></div>'
    + '<div style="text-align:center;font-size:.82em" id="wTxt">浇水进度 0 / 5</div>'
    + '<div class="wbar"><i id="wBar" style="width:0%"></i></div>'
    + '<button class="opt" id="pour" onclick="pour()">💧 浇水</button>'
    + '<div class="mrow"><button onclick="closeMask();render()">取消</button></div></div>';
  showMask(html);
}

function pour(){
  if (waterN >= 5) return;
  waterN++;
  var d = $('drop');
  if (d) {
    d.setAttribute('opacity','1');
    var y = 10;
    var iv = setInterval(function(){
      y += 22;
      if (y > 108) { clearInterval(iv); d.setAttribute('opacity','0'); }
      d.setAttribute('cy', y);
    }, 24);
  }
  beep(660, 0.05);
  var t = $('wTxt'), bar = $('wBar');
  if (t) t.textContent = '浇水进度 ' + waterN + ' / 5';
  if (bar) bar.style.width = (waterN*20)+'%';
  if (waterN >= 5) {
    S.waterDate = today(); S.waterCount++; save();
    toast('浇水完成，获得今日开盒机会！');
    beep(990, 0.12);
    var btn = $('pour');
    if (btn) { btn.textContent = '✓ 已完成'; btn.disabled = true; }
    setTimeout(function(){ closeMask(); render(); }, 700);
  }
}

/* ---------- 答题 ---------- */
function openQuiz(){
  if (S.quizDate === today()) { toast('今天已经答过题了'); return; }
  quizSet = QUIZ.slice().sort(function(){ return Math.random()-0.5; }).slice(0,3);
  quizIdx = 0; quizRight = 0; answered = false;
  if (!quizSet.length) { toast('题库为空'); return; }
  showQuiz();
}

function showQuiz(){
  var q = quizSet[quizIdx];
  var h = '<div class="modal">'
    + '<div class="mhead"><span>第 '+(quizIdx+1)+' / '+quizSet.length+' 题</span>'
    + '<span>已答对 '+quizRight+' 题</span></div>'
    + '<div class="mt">'+esc(q.q)+'</div>';
  q.options.forEach(function(o, i){
    h += '<button class="opt" id="opt'+i+'" onclick="answer('+i+')">'+esc(o)+'</button>';
  });
  h += '<div class="exp" id="exp"></div>'
    + '<div class="mrow"><button onclick="cancelQuiz()">取消</button>'
    + '<button class="pri" id="nextBtn" disabled onclick="nextQuiz()">下一题</button></div></div>';
  showMask(h);
}

function answer(i){
  if (answered) return;
  answered = true;
  var q = quizSet[quizIdx];
  var ans = q.answer;
  var right = i === ans;
  if (right) { quizRight++; beep(880, 0.09); }
  else { beep(300, 0.14); vibrate(); }

  q.options.forEach(function(o, j){
    var b = $('opt'+j);
    if (!b) return;
    if (j === ans) b.classList.add('right');
    else if (j === i) b.classList.add('wrong');
    else b.classList.add('dim');
    b.disabled = true;
  });

  var ex = $('exp');
  if (ex) {
    ex.textContent = (right ? '答对了！' : '答错了。') + (q.explain || '');
    ex.classList.add('on');
  }
  var mh = document.querySelector('.mhead span:last-child');
  if (mh) mh.textContent = '已答对 ' + quizRight + ' 题';
  var nb = $('nextBtn');
  if (nb) nb.disabled = false;
}

function nextQuiz(){
  answered = false;
  quizIdx++;
  if (quizIdx >= quizSet.length) { finishQuiz(); return; }
  showQuiz();
}

function finishQuiz(){
  if (quizRight === quizSet.length) {
    S.quizDate = today(); S.quizCount++; save();
    toast('答题全对，获得今日开盒机会！');
    beep(990, 0.12);
  } else {
    toast('答错一题，再试一次吧');
  }
  closeMask();
  render();
}

function cancelQuiz(){
  answered = false;
  closeMask();
  render();
  toast('已取消答题');
}

/* 供 closeMask 调用：清掉答题状态 */
function resetQuiz(){
  answered = false;
}

/* ---------- 音效与震动 ---------- */
var actx = null;
function beep(freq, dur){
  try {
    if (!actx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      actx = new AC();
    }
    if (actx.state === 'suspended') actx.resume();
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.10, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur);
  } catch(e){}
}
function vibrate(){
  if (navigator.vibrate) navigator.vibrate(30);
}
