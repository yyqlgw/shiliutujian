/* 启动入口：初始化状态、绑定导航、注册 SW */
function boot(){
  S = loadState();

  // 支持 ?tab=1 直接打开指定页（方便分享/调试）
  var m = /[?&]tab=(\d)/.exec(location.search);
  if (m) {
    var t = +m[1];
    if (t >= 0 && t <= 2) curTab = t;
  }

  document.querySelectorAll('#nav div').forEach(function(el){
    el.addEventListener('click', function(){ switchTab(+el.dataset.tab); });
  });

  updateDate();
  render();

  S.lastOpen = today();
  save();

  // 注册 Service Worker（离线可用）
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').catch(function(){});
    });
  }

  // 申请持久化存储，降低被系统清理的概率
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(function(){});
  }

  // 尺寸变化时重画雷达图
  window.addEventListener('resize', function(){
    if (curTab === 2) drawRadar();
  });

  // 防止 iOS 双击缩放
  document.addEventListener('gesturestart', function(e){ e.preventDefault(); });
}

function updateDate(){
  var d = new Date();
  var wk = ['日','一','二','三','四','五','六'];
  var el = $('dateStr');
  if (el) el.textContent = (d.getMonth()+1)+'月'+d.getDate()+'日 · 周'+wk[d.getDay()];
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
