/* 状态管理与工具函数 —— 红石榴图鉴 Web 版 */
var KEY = 'shiliu_web_v1';
var KEY_BAK = 'shiliu_web_v1_bak';
var S = null;

/* data.js 里是原始 JSON 对象，这里取出数组供全站使用 */
var CATALOG = (window.CATALOG_DATA && window.CATALOG_DATA.catalog) || [];
var QUIZ = (window.QUIZ_DATA && window.QUIZ_DATA.quiz) || [];

function loadState(){
  var raw = null;
  try { raw = localStorage.getItem(KEY); } catch(e){}
  var s = null;
  if (raw) { try { s = JSON.parse(raw); } catch(e){ s = null; } }
  if (!s) {
    try {
      var bak = localStorage.getItem(KEY_BAK);
      if (bak) s = JSON.parse(bak);
    } catch(e){ s = null; }
  }
  if (!s || typeof s !== 'object') s = {};
  return {
    collected: s.collected || {},
    drawDate: s.drawDate || '',
    waterDate: s.waterDate || '',
    quizDate: s.quizDate || '',
    drawCount: s.drawCount || 0,
    waterCount: s.waterCount || 0,
    quizCount: s.quizCount || 0,
    drawDays: s.drawDays || {},
    lastOpen: s.lastOpen || ''
  };
}

function save(){
  S.lastOpen = today();
  try {
    var raw = JSON.stringify(S);
    localStorage.setItem(KEY, raw);
    localStorage.setItem(KEY_BAK, raw);
  } catch(e){
    toast('存储空间不足，请导出备份');
  }
}

function today(){
  var d = new Date();
  return fmt(d);
}
function fmt(d){
  var m = ('0'+(d.getMonth()+1)).slice(-2), dd = ('0'+d.getDate()).slice(-2);
  return d.getFullYear()+'-'+m+'-'+dd;
}
function $(id){ return document.getElementById(id); }
function esc(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

var toastTimer = null;
function toast(msg){
  var t = $('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('on'); }, 1900);
}

function isCollected(id){ return !!S.collected[id]; }
function collectedCount(){ return Object.keys(S.collected).length; }
function canDraw(){ return S.drawDate !== today(); }
function hasChance(){
  return canDraw() && (S.waterDate === today() || S.quizDate === today());
}
function streakDays(){
  var n = 0, d = new Date();
  if (!S.drawDays[fmt(d)]) d.setDate(d.getDate()-1);
  while (S.drawDays[fmt(d)]) { n++; d.setDate(d.getDate()-1); }
  return n;
}
function titleName(){
  var n = collectedCount();
  if (n >= 24) return '石榴使者';
  if (n >= 14) return '图鉴达人';
  if (n >= 6) return '寻宝客';
  return '石榴新芽';
}
