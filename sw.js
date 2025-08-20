const CACHE_NAME = 'rolitas-pal-hector-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  // MP3 files will be cached when first accessed
  './Grupo Frontera - ME GUSTAS (Audio).mp3',
  './Juan Gabriel- Así fue -  - 2025-08-20 00-11-08.mp3',
  './Julión Álvarez Y Su Norteño Banda - Terrenal (Audio).mp3',
  './Te Hubieras Ido Antes.mp3'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app resources');
        return cache.addAll(urlsToCache.filter(url => !url.endsWith('.mp3')));
      })
      .then(() => {
        // Cache MP3 files individually to handle potential failures
        return caches.open(CACHE_NAME)
          .then(cache => {
            urlsToCache.filter(url => url.endsWith('.mp3')).forEach(mp3Url => {
              cache.add(mp3Url).catch(err => {
                console.log('Could not cache MP3:', mp3Url, err);
              });
            });
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // If both cache and network fail, return offline page or basic response
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Here you could sync any offline actions when connection is restored
  }
});

// Message handling for communication with the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification click handling (if notifications are implemented later)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});