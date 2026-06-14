const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;

// Core assets to pre-cache immediately upon PWA installation
const PRECACHE_ASSETS = [
  '/live',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 1. Install Event: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Pre-caching application shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up stale caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intercept network requests and apply caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for non-GET requests (e.g. POST for login, form submissions)
  if (request.method !== 'GET') {
    return;
  }

  // Skip caching for Firebase Auth and admin endpoints
  if (url.pathname.startsWith('/api/auth/') || url.hostname.includes('identitytoolkit') || url.hostname.includes('securetoken')) {
    event.respondWith(fetch(request));
    return;
  }

  // A. Stale-While-Revalidate Strategy: For dynamic itinerary data, layouts, and page documents.
  // Serves cached data instantly for speed/offline capability, updates cache in background.
  if (
    url.pathname === '/live' || 
    url.pathname.startsWith('/essentials') || 
    url.pathname.startsWith('/discovery') || 
    url.pathname.startsWith('/memories') ||
    url.pathname.endsWith('.json') // dynamic JSON itinerary files
  ) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Return cached response if offline fetch fails
              if (cachedResponse) return cachedResponse;
              throw new Error('Offline and asset not in cache');
            });

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // B. Cache-First Strategy: For static assets (JS bundles, CSS files, system images, fonts)
  // These change rarely (hashes in URLs) and are safe to load from cache indefinitely.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        // Cache valid static responses
        if (
          networkResponse.status === 200 &&
          (url.pathname.startsWith('/_next/static/') || 
           url.pathname.includes('/fonts/') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.hostname.includes('res.cloudinary.com')) // Cache responsive Cloudinary images
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
