const CACHE_PREFIX = 'stainviz-pwa';
const CACHE_NAME = `${CACHE_PREFIX}-v1`;
const PRECACHE_ASSETS = [
  '/compare',
  '/manifest.webmanifest',
  '/stainViz.png',
  '/pwa/icon-192.png',
  '/pwa/icon-512.png',
  '/bf.png',
  '/1.png',
  '/2.png',
  '/bf-cd56/bf.png',
  '/bf-cd56/cd56.png',
  '/fbi-dapi/input.png',
  '/fbi-dapi/%20ai1.png',
  '/fbi-dapi/gt1.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  );
});

async function cacheResponse(request, response) {
  if (response?.ok) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    } catch {
      // Storage can be unavailable or full. A successful network response
      // should still reach the page when offline caching cannot be updated.
    }
  }

  return response;
}

async function handleNavigation(request) {
  try {
    return await cacheResponse(request, await fetch(request));
  } catch {
    return (await caches.match(request)) || caches.match('/compare');
  }
}

async function handleAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  return cacheResponse(request, await fetch(request));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

  const isCompareNavigation = request.mode === 'navigate'
    && (requestUrl.pathname === '/compare' || requestUrl.pathname === '/compare/');
  const isNextStaticAsset = requestUrl.pathname.startsWith('/_next/static/');
  const isPrecachedAsset = PRECACHE_ASSETS.includes(requestUrl.pathname);

  if (!isCompareNavigation && !isNextStaticAsset && !isPrecachedAsset) return;

  event.respondWith(
    isCompareNavigation
      ? handleNavigation(request)
      : handleAsset(request),
  );
});
