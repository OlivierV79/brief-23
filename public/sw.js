// public/sw.js
const CACHE = 'ft-cache-v3';
const STATIC = [
    '/', '/index.html', '/manifest.json',
    '/pwa-192x192.png', '/pwa-512x512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(STATIC))
    );
    self.skipWaiting(); // active plus vite
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;

    // 1) Navigations (SPA fallback)
    if (req.mode === 'navigate') {
        e.respondWith(
            caches.match('/index.html').then((r) => r || fetch(req))
        );
        return;
    }

    // 2) Assets (script/style/image/font) => cache-first
    const dest = req.destination;
    if (['script', 'style', 'image', 'font'].includes(dest)) {
        e.respondWith(
            caches.open(CACHE).then(async (cache) => {
                const cached = await cache.match(req);
                if (cached) return cached;
                const res = await fetch(req);
                if (res.ok) cache.put(req, res.clone());
                return res;
            })
        );
        return;
    }

    // 3) Le reste => réseau
});
