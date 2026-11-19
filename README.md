[README.md](https://github.com/user-attachments/files/35091582/README.md)
# 红石榴图鉴 · Web / PWA 版

> 盲盒图鉴 · 民族团结文化行 —— 每日抽盒点亮一枚图鉴，读懂它背后的文化故事。

一个**纯前端、零依赖、可离线**的国潮风文化科普小应用。用九宫格图鉴墙收集 34 枚民族风物与城市文化图鉴，每天一次「浇水 / 答题」获取抽盒机会，开盒随机点亮新图鉴并解锁文化故事。

**在线体验**：<!-- 部署后把下面这行换成你的真实地址 -->
`https://yyqlgw.github.io/shiliutujian/`
（手机访问效果最佳，iPhone 用 Safari 可「添加到主屏幕」获得接近原生 App 的体验）

---

## 特性

### 玩法

- **九宫格图鉴墙**：背包式收集，已点亮为高饱和国潮色，未点亮为灰色剪影。支持按「民族风物 / 城市文化 / 石榴精神」分类筛选，并显示各分类收集进度。
- **每日盲盒**：每天一次机会。通过**浇水**（5 次点击，水珠下落动画）或**答题**（3 道文化题全对）获得，盲盒抖动后开盒，85% 概率优先抽到未收集的图鉴。
- **文化故事**：每枚图鉴配一段独立的科普文字，涵盖非物质文化遗产、世界遗产与传统民俗。
- **六维雷达图**：文化力 / 探索力 / 守护力 / 传承力 / 团结力 / 行动力，随收集进度实时变化（纯视觉展示）。
- **数据备份**：导出 / 导入 JSON，与同款 Android 版**完全互通**，换设备可迁移进度。

### 内容

| 分类 | 数量 | 示例 |
| --- | --- | --- |
| 民族风物 | 18 枚 | 苗族银饰、藏族唐卡、艾德莱斯绸、马头琴、侗族大歌、黎锦、东巴文、羌族碉楼 |
| 城市文化 | 12 枚 | 北京中轴线、敦煌飞天、泉州海丝、良渚玉琮、三星堆纵目面具、鼓浪屿、平遥古城 |
| 石榴精神 | 4 枚 | 石榴籽、石榴花、石榴果、同心圆 |

题库 **51 道**，答案位置随机打散（A13 / B10 / C13 / D15），每题附解析。

### 视觉与技术

- **零图片依赖**：34 种图鉴纹样全部是手写内联 SVG，图标由 Python 脚本（Pillow）代码绘制，仓库无任何第三方素材。
- **纯原生实现**：无框架、无构建步骤、无 npm 依赖，一个 `index.html` 加几个 JS 文件即可运行。
- **离线可用**：Service Worker 缓存全部资源，断网（飞行模式）也能打开。
- **拆包加速**：首屏 HTML 仅 3.3 KB，样式 / 数据 / 逻辑并行加载、独立缓存。

---
## 性能

| 指标 | 数值 |
| --- | --- |
| 首屏 HTML | 3.3 KB |
| 样式 + 脚本（gzip 前） | ~90 KB |
| 站点总计 | ~434 KB（其中 iOS 启动图 8 张占 300 KB） |
| 外部请求 | **0**（无 CDN、无字体、无统计脚本） |

拆包策略：`index.html` 只保留骨架与 meta，其余按职责切分，全部使用 `defer` 并行下载，互不阻塞。数据与逻辑分离，更新题库只需替换 `data.js`，其余文件走强缓存。

## 目录结构

```
.
├── index.html                 首屏骨架（3.3 KB）
├── manifest.webmanifest       PWA 应用信息
├── sw.js                      Service Worker（离线缓存）
├── css/
│   └── app.css                全部样式
├── js/
│   ├── data.js                图鉴 + 题库数据
│   ├── state.js               状态存储 / 日期 / 称号
│   ├── icons.js               34 种 SVG 纹样
│   ├── play.js                浇水 / 答题 / 音效
│   ├── backup.js              备份导入导出 + 关于页
│   ├── ui.js                  三页渲染 + 雷达图
│   └── app.js                 启动入口
├── assets/                    图标（含 maskable）与 iOS 启动图
├── tools/
│   └── make-icons.py          图标生成脚本（Pillow，可选）
├── .nojekyll                  关闭 GitHub Pages 的 Jekyll 构建
├── _config.yml
└── robots.txt
```

## 部署到 GitHub Pages

1. 新建一个 **Public** 仓库
2. 把本目录下**全部文件与三个文件夹**（`css/`、`js/`、`assets/`）上传到仓库**根目录**，保留目录结构
3. 仓库 → **Settings → Pages** → Source 选 `Deploy from a branch` → Branch 选 `main`、目录选 `/(root)` → Save
4. 等待 1~2 分钟，访问 `https://<你的GitHub用户名>.github.io/<仓库名>/`

> 已放置 `.nojekyll`，避免 Jekyll 处理导致下划线开头的文件被忽略。

### 本地预览

```bash
cd web
python -m http.server 8899
# 浏览器打开 http://127.0.0.1:8899
```

> 必须用 http(s) 访问，直接双击 `index.html`（`file://`）会导致 Service Worker 失效——功能仍可用，但没有离线能力。

## 苹果 PWA 适配

- `apple-mobile-web-app-capable` / `status-bar-style: black-translucent` / `apple-mobile-web-app-title`
- **8 张 `apple-touch-startup-image`** 按机型像素精确匹配（iPhone 15/14/13/SE 与 iPad），消除启动白屏
- `viewport-fit=cover` + `env(safe-area-inset-*)` 适配刘海屏与底部手势条
- 180px `apple-touch-icon` 主屏图标
- 横屏时显示「请竖屏使用」遮罩（iOS 无法锁定网页方向）

**iPhone 使用**：Safari 打开 → 分享 → 添加到主屏幕 → 从桌面图标进入即可全屏运行。

## 数据与隐私

- 所有数据保存在浏览器 `localStorage`，**不上传任何服务器，不做任何统计上报**
- 每次保存会额外写一份备份键，主数据损坏时自动回退
- 已申请 `navigator.storage.persist()` 持久化存储
- ⚠️ iOS Safari 有一条硬限制：约 7 天不访问站点，系统可能清理存储。建议定期「我的 → 导出备份」

**备份格式**（与 Android 版通用）：

```json
{
  "app": "shiliu",
  "version": 1,
  "exportedAt": "2026-11-19 14:00:00",
  "collected": ["miao_silver", "tibet_thangka"],
  "collectTimes": { "miao_silver": "2026-11-19" },
  "drawDate": "2026-11-19",
  "waterDate": "2026-11-19",
  "quizDate": "",
  "drawCount": 2,
  "waterCount": 3,
  "quizCount": 1,
  "drawDays": ["2026-11-19"]
}
```

## 兼容性

| 平台 | 说明 |
| --- | --- |
| iOS / iPadOS Safari | 支持添加到主屏、全屏运行、离线 |
| Android Chrome / Edge | 支持安装为 PWA |
| 桌面 Chrome / Edge / Firefox / Safari | 正常使用，可按 F12 切换手机视图 |

## 更新日志

**v1.2**
- 题库扩充至 51 题，答案位置随机打散，选项统一为 4 个
- 修复分类筛选不生效、进度条显示错误
- 新增备份导出 / 导入，与 Android 版互通
- 拆包重构，首屏体积降至 3.3 KB

**v1.1**
- 图鉴扩充至 34 枚，题库 30 题
- 新增 Web / PWA 版，支持离线与添加到主屏

**v1.0**
- 图鉴墙、盲盒抽取、图鉴故事、六维雷达图

## 说明

本项目为高校思政实践课程作业，仅用于学习交流与课程展示，不作商业用途。

应用中的文化知识、非遗信息与世界遗产资料整理自公开资料，已尽力核对，但可能存在滞后或疏漏，不作为权威依据。所有图标与纹样均由代码绘制，未使用第三方受版权保护的图片素材。

内容立场：坚持铸牢中华民族共同体意识，宣传各民族交往交流交融。
