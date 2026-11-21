// CardFlow Service Worker - Offline Caching & Instant Network-First Updates
const CACHE_NAME = 'cardflow-tracker-v23';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './js/palettes.js',
  './js/i18n.js',
  './js/data.js',
  './js/state.js',
  './js/logic.js',
  './js/ui-core.js',
  './js/drive.js',
  './js/view-loyalty.js',
  './js/view-advisor.js',
  './js/view-cards.js',
  './js/view-credits.js',
  './js/view-modals.js',
  './js/app-shell.js',
  './js/main.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Helper: Fetch with timeout for fast offline/weak network fallback
function fetchWithTimeout(request, timeoutMs = 2500) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Fetch timed out'));
    }, timeoutMs);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = event.request.mode === 'navigate';
  const isCoreAsset = isSameOrigin && ((url.pathname.includes('/js/') && url.pathname.endsWith('.js')) || url.pathname.endsWith('styles.css'));

  // Strategy 1: Network-First for Navigation (HTML), core ES modules (js/*.js) & prebuilt styles (styles.css)
  // Ensures updates appear immediately upon refreshing without requiring two reloads
  if (isNavigation || isCoreAsset) {
    event.respondWith(
      fetchWithTimeout(event.request, 2500)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline or timed out, fallback to local cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('./index.html').then((fallbackHtml) => {
              return fallbackHtml || caches.match('./');
            });
          });
        })
    );
    return;
  }

  // Strategy 2: Cache-First for static assets (icons, manifest, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok && isSameOrigin) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
