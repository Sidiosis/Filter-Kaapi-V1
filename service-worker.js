// Service Worker for Filter Kaapi (improved)
// Cache name/version
const CACHE_NAME = 'kaapi-cache-v1';
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
  // Add other local assets (css/js) here if you split them out
];

// Install - cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - cache-first for same-origin navigation & assets, network-first for others
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // For navigation requests, try cache first then network (makes app load offline)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => {
        return cached || fetch(request).then(resp => {
          // Optionally cache the response for next time
          return caches.open(CACHE_NAME).then(cache => {
            try { cache.put(request, resp.clone()); } catch (e) { /* ignore */ }
            return resp;
          });
        }).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  // For same-origin requests, try cache first
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(resp => {
        // Cache fetched assets for offline
        return caches.open(CACHE_NAME).then(cache => {
          try { cache.put(request, resp.clone()); } catch (e) { /* ignore non-cacheable */ }
          return resp;
        });
      }).catch(() => cached))
    );
  } else {
    // For cross-origin, try network then fallback to cache
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});
