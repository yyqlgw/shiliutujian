/* 红石榴图鉴 Service Worker
   策略：
   - 页面导航：网络优先，失败回退缓存（保证拿到最新版，同时离线可用）
   - 静态资源（css/js/图标）：缓存优先，后台静默更新
   - 版本号变化时清掉旧缓存 */

const VERSION = 'shiliu-v1.1.0';
const CACHE = VERSION;

const CORE = [
  './',
  './index.html',
  './css/app.css',
  './js/data.js',
  './js/state.js',
  './js/icons.js',
  './js/play.js',
  './js/backup.js',
  './js/ui.js',
  './js/app.js',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// 安装：预缓存核心资源
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE).catch(() => {
        // 某个资源 404 不应导致整个安装失败，逐个补
        return Promise.all(CORE.map(u => c.add(u).catch(() => {})));
      }))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧版本缓存
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 只处理本站资源
  if (url.origin !== self.location.origin) return;

  // 页面导航：网络优先
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
        return resp;
      }).catch(() =>
        caches.match('./index.html').then(hit => hit || caches.match('./'))
      )
    );
    return;
  }

  // 静态资源：缓存优先 + 后台更新
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) {
        // 后台静默刷新，下次打开即最新
        fetch(req).then(resp => {
          if (resp && resp.status === 200) {
            caches.open(CACHE).then(c => c.put(req, resp.clone())).catch(() => {});
          }
        }).catch(() => {});
        return hit;
      }
      return fetch(req).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// 允许页面主动触发更新
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
