// Service Worker for j e l l i c u l e PWA

const CACHE_NAME = 'jcule-ui-v1';
const DYNAMIC_CACHE_NAME = 'jcule-dynamic-v1';

// Assets that must be cached for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/reset.css',
  '/styles/jellicule.css',
  '/dist/jellicule.min.js',
  '/js/main.js',
  '/manifest.json',
  '/icons/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/offline.html',
  '/components/layout/ActivityViewport/activity-viewport.js',
  '/components/layout/ActivityBar/activity-bar.js',
  '/components/layout/Activity/activity.js',
  '/components/layout/ActivityResizeButton/activity-resize-button.js',
  '/components/layout/MainContent/main-content.js',
  '/components/layout/Content/content.js'
];

// Create a fallback offline page
const OFFLINE_URL = '/offline.html';

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network, then offline page
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip WebSocket connections
  if (event.request.url.includes('ws://') || event.request.url.includes('wss://')) {
    return;
  }

  // Skip build status and other API requests that shouldn't be cached
  if (event.request.url.includes('/build-status/') ||
      event.request.url.includes('/health/') ||
      event.request.url.includes('/api/')) {
    // For API requests, try network but don't attempt to reconnect if it fails
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return a minimal JSON response for API requests
          if (event.request.url.includes('/build-status/')) {
            return new Response(JSON.stringify({
              status: 'offline',
              time: new Date().toISOString(),
              version: 'local',
              message: 'Running in offline mode'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // For HTML requests - network first, then cache, then offline page
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If cache fails too, return offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For all other requests - cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Store in both caches for future offline use
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache.clone());
            });

            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // For images and other resources, return a placeholder if possible
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/icons/icon-512x512.png');
            }
            // For other resources, just return a basic response
            return new Response('Offline content unavailable', { status: 503 });
          });
      })
  );
});
