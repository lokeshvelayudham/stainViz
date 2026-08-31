import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const serviceWorkerPath = new URL('../public/sw.js', import.meta.url);

function loadServiceWorker({
  cacheMatch = async () => undefined,
  cachePut = async () => undefined,
  fetchImpl = async () => ({ ok: true, clone() { return this; } }),
} = {}) {
  assert.equal(existsSync(serviceWorkerPath), true, 'the offline service worker must exist');

  const listeners = new Map();
  const addedAssets = [];
  const openedCache = {
    addAll: async (assets) => addedAssets.push(...assets),
    put: cachePut,
  };
  const context = {
    URL,
    caches: {
      keys: async () => [],
      match: cacheMatch,
      open: async () => openedCache,
      delete: async () => true,
    },
    fetch: fetchImpl,
    self: {
      location: { origin: 'https://stainviz.test' },
      clients: { claim: async () => undefined },
      skipWaiting: async () => undefined,
      addEventListener(type, listener) {
        listeners.set(type, listener);
      },
    },
  };

  vm.runInNewContext(readFileSync(serviceWorkerPath, 'utf8'), context);
  return { addedAssets, listeners };
}

test('installing the PWA stores the complete comparison experience', async () => {
  const { addedAssets, listeners } = loadServiceWorker();
  let installation;

  listeners.get('install')({ waitUntil(promise) { installation = promise; } });
  await installation;

  assert.deepEqual(Array.from(addedAssets), [
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
  ]);
});

test('a failed offline navigation falls back to the cached compare page', async () => {
  const fallback = { source: 'cached compare page' };
  const { listeners } = loadServiceWorker({
    cacheMatch: async (request) => request === '/compare' ? fallback : undefined,
    fetchImpl: async () => { throw new Error('offline'); },
  });
  let response;

  listeners.get('fetch')({
    request: { method: 'GET', mode: 'navigate', url: 'https://stainviz.test/compare' },
    respondWith(promise) { response = promise; },
  });

  assert.equal(await response, fallback);
});

test('cached Next.js assets are returned without a network connection', async () => {
  const cachedAsset = { source: 'runtime cache' };
  const { listeners } = loadServiceWorker({
    cacheMatch: async (request) => request.url.includes('/_next/static/') ? cachedAsset : undefined,
    fetchImpl: async () => { throw new Error('offline'); },
  });
  let response;

  listeners.get('fetch')({
    request: { method: 'GET', mode: 'no-cors', url: 'https://stainviz.test/_next/static/chunks/app.js' },
    respondWith(promise) { response = promise; },
  });

  assert.equal(await response, cachedAsset);
});

test('dynamic API requests bypass the offline cache', () => {
  const { listeners } = loadServiceWorker();
  let response;

  listeners.get('fetch')({
    request: { method: 'GET', mode: 'cors', url: 'https://stainviz.test/api/logs' },
    respondWith(promise) { response = promise; },
  });

  assert.equal(response, undefined);
});

test('a cache quota failure does not break a successful network response', async () => {
  const networkResponse = { ok: true, clone() { return this; }, source: 'network' };
  const { listeners } = loadServiceWorker({
    cachePut: async () => { throw new Error('QuotaExceededError'); },
    fetchImpl: async () => networkResponse,
  });
  let response;

  listeners.get('fetch')({
    request: { method: 'GET', mode: 'no-cors', url: 'https://stainviz.test/_next/static/chunks/app.js' },
    respondWith(promise) { response = promise; },
  });

  assert.equal(await response, networkResponse);
});
