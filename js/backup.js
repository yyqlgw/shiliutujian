/* 备份导出与恢复（与安卓版 JSON 互通） */
function exportBackup(){
  var data = {
    app: 'shiliu',
    version: 1,
    exportedAt: new Date().toLocaleString('zh-CN'),
    collected: Object.keys(S.collected),
    collectTimes: S.collected,
    drawDate: S.drawDate,
    waterDate: S.waterDate,
    quizDate: S.quizDate,
    drawCount: S.drawCount,
    waterCount: S.waterCount,
    quizCount: S.quizCount,
    drawDays: Object.keys(S.drawDays)
  };
  var text = JSON.stringify(data, null, 2);
  var name = '红石榴图鉴-备份-' + today() + '.json';

  // 移动端优先走系统分享面板（iOS 可存到「文件」App / iCloud）
  if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    try {
      var file = new File([text], name, {type:'application/json'});
      if (navigator.canShare && navigator.canShare({files:[file]})) {
        navigator.share({files:[file], title:'红石榴图鉴备份'}).catch(function(){
          downloadText(text, name);
        });
        return;
      }
    } catch(e){}
  }
  downloadText(text, name);
}

function downloadText(text, name){
  var blob = new Blob([text], {type:'application/json;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 1200);
  toast('备份已导出');
}

function importBackup(){
  var inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json,application/json';
  inp.onchange = function(){
    var f = inp.files && inp.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function(){
      try {
        var d = JSON.parse(r.result);
        if (d.data) d = d.data;

        var col = d.collected;
        if (Array.isArray(col)) {
          var m = {};
          col.forEach(function(it){
            if (typeof it === 'string') m[it] = (d.collectTimes && d.collectTimes[it]) || today();
            else if (it && it.id) m[it.id] = it.time || today();
          });
          S.collected = m;
        } else if (col && typeof col === 'object') {
          S.collected = col;
        }

        if (d.drawDate !== undefined) S.drawDate = d.drawDate || '';
        if (d.waterDate !== undefined) S.waterDate = d.waterDate || '';
        if (d.quizDate !== undefined) S.quizDate = d.quizDate || '';
        if (d.drawCount !== undefined) S.drawCount = +d.drawCount || 0;
        if (d.waterCount !== undefined) S.waterCount = +d.waterCount || 0;
        if (d.quizCount !== undefined) S.quizCount = +d.quizCount || 0;
        if (Array.isArray(d.drawDays)) {
          var dd = {};
          d.drawDays.forEach(function(x){ dd[x] = 1; });
          S.drawDays = dd;
        }
        save();
        toast('已恢复 ' + Object.keys(S.collected).length + ' 枚图鉴');
        render();
      } catch(e) {
        toast('导入失败：文件格式不正确');
      }
    };
    r.readAsText(f);
  };
  inp.click();
}

/* ---------- 关于弹窗 ---------- */
function openAbout(){
  var html = '<div class="modal" style="max-height:82vh;overflow-y:auto;display:block">'
    + '<div style="text-align:center;margin-bottom:14px">'
    + '<div style="font-size:1.2em;font-weight:900">红石榴图鉴</div>'
    + '<div style="font-size:.7em;color:#FFD9C8;margin-top:6px">盲盒图鉴 · 民族团结文化行</div></div>'

    + '<div style="font-size:.78em;font-weight:800;color:#FFD27A;margin:14px 0 8px">作者信息</div>'
    + '<div style="font-size:.74em;line-height:1.95;color:#FFE8DC">'
    + '单位：长治学院 · 物理系 · 光电 2602 班<br><br>'
    + '<b>素材收集</b><br>张浩楠 26435742　吕想 26435721<br>'
    + '<b>页面排版与交互逻辑</b><br>董知恒 26435705　赵永锐 26435745<br>'
    + '<b>UI 设计与素材加工</b><br>曹宇杰 26435701　常满朔 26435702<br>'
    + '<b>内容设计与漏洞测试</b><br>陈磊 26435703　李世权 26435714<br>'
    + '<b>特别感谢 · 技术支持</b><br>高乐文 26435707</div>'

    + '<div style="font-size:.78em;font-weight:800;color:#FFD27A;margin:16px 0 8px">更新日志</div>'
    + '<div style="font-size:.72em;line-height:1.9;color:#FFE8DC">'
    + '<b>v1.2</b>（当前）<br>· 图鉴 '+CATALOG.length+' 枚，题库 '+QUIZ.length+' 题<br>'
    + '· 题目答案位置随机打散，选项统一为 4 个<br>'
    + '· 修复分类筛选不生效、进度条显示错误<br>'
    + '· 安卓与网页双端支持备份导出与恢复，JSON 互通<br>'
    + '· Web 版拆包，首屏体积降至 4 KB<br><br>'
    + '<b>v1.1</b><br>· 图鉴扩充至 34 枚，题库 30 题<br>'
    + '· 新增 Web / PWA 版，可添加到主屏幕离线使用<br><br>'
    + '<b>v1.0</b><br>· 图鉴墙、盲盒抽取、图鉴故事、六维雷达图</div>'

    + '<div style="font-size:.78em;font-weight:800;color:#FFD27A;margin:16px 0 8px">免责声明</div>'
    + '<div style="font-size:.72em;line-height:1.9;color:#FFE8DC">'
    + '1. 本应用为高校思政实践课程作业作品，仅用于学习交流与课程展示，不作商业用途。<br><br>'
    + '2. 文化知识、非遗信息、世界遗产资料整理自公开资料，编者已尽力核对，但可能存在滞后或疏漏，不作为权威依据。<br><br>'
    + '3. 应用内的民族名称、服饰、乐器、建筑、纹样等元素，仅用于文化科普与民族团结教育，不存在贬损或不尊重之意。<br><br>'
    + '4. 图标均由代码绘制（Android 用 Canvas，Web 用 SVG），未使用第三方受版权保护的图片素材。<br><br>'
    + '5. 纯本地离线运行，不收集、不上传任何个人信息，收集进度保存在本机浏览器。<br><br>'
    + '6. 坚持铸牢中华民族共同体意识，宣传各民族交往交流交融，反对任何形式的民族歧视与分裂言论。</div>'

    + '<div style="text-align:center;font-size:.66em;color:#E0A796;margin:18px 0 14px">'
    + '长治学院 · 物理系 · 光电2602班<br>思政实践课程作业 · 2026</div>'
    + '<div class="mrow"><button class="pri" onclick="closeMask()">知道了</button></div></div>';
  showMask(html);
}
