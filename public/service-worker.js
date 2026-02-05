/**
 * NexusBiz Service Worker
 * =======================
 * 
 * WHAT THIS DOES:
 * - Caches the app so it works OFFLINE
 * - Handles auth pages specially (login, signup)
 * - Shows offline fallback when no network
 * - Syncs data when back online
 * 
 * WHY USERS NEED THIS:
 * - App works even without internet
 * - Login session persists offline (JWT in localStorage)
 * - Cached ideas are viewable offline
 */

const CACHE_NAME = 'nexusbiz-v5';
const STATIC_CACHE = 'nexusbiz-static-v5';
const DYNAMIC_CACHE = 'nexusbiz-dynamic-v5';

// Core files to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/login',
    '/signup',
    '/generator',
    '/results',
    '/pricing',
    '/about'
];

// API endpoints that should work offline (return cached data)
const CACHEABLE_API_ROUTES = [
    '/api/industries'
];

// ==========================================
// INSTALL - Cache static assets
// ==========================================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing NexusBiz Service Worker v5');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                // Cache what we can, don't fail if some are missing
                return Promise.allSettled(
                    STATIC_ASSETS.map(url =>
                        cache.add(url).catch(err =>
                            console.log(`[SW] Could not cache: ${url}`, err)
                        )
                    )
                );
            })
    );

    // Activate immediately
    self.skipWaiting();
});

// ==========================================
// ACTIVATE - Clean up old caches
// ==========================================
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating NexusBiz Service Worker v5');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter(name =>
                        name.startsWith('nexusbiz-') &&
                        name !== STATIC_CACHE &&
                        name !== DYNAMIC_CACHE
                    )
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );

    // Take control of all pages immediately
    self.clients.claim();
});

// ==========================================
// FETCH - Handle requests with smart caching
// ==========================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and chrome-extension requests
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }

    // Strategy 1: Auth API - Network only (never cache sensitive data)
    if (url.pathname.startsWith('/api/auth/')) {
        event.respondWith(
            fetch(request).catch(() => {
                // Return offline-friendly error for auth
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: 'You are offline. Please check your connection.',
                        offline: true
                    }),
                    {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            })
        );
        return;
    }

    // Strategy 2: Other API calls - Network first, cache fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache successful GET responses for cacheable routes
                    if (response.ok && CACHEABLE_API_ROUTES.some(r => url.pathname.includes(r))) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Try to return cached data
                    return caches.match(request).then(cached => {
                        if (cached) {
                            return cached;
                        }
                        // Return offline error
                        return new Response(
                            JSON.stringify({
                                success: false,
                                error: 'You are offline. Some features are unavailable.',
                                offline: true
                            }),
                            {
                                status: 503,
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
                })
        );
        return;
    }

    // Strategy 3: Navigation requests - Network first, cache fallback to index.html
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache the page
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Return cached page or index.html (for SPA routing)
                    return caches.match(request)
                        .then(cached => cached || caches.match('/index.html'));
                })
        );
        return;
    }

    // Strategy 4: Static assets - Cache first, network fallback
    event.respondWith(
        caches.match(request)
            .then(cached => {
                if (cached) {
                    // Return cached, but also update cache in background
                    fetch(request).then(response => {
                        if (response.ok) {
                            caches.open(DYNAMIC_CACHE).then(cache => {
                                cache.put(request, response);
                            });
                        }
                    }).catch(() => { });
                    return cached;
                }

                // Not in cache - fetch and cache
                return fetch(request).then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
            })
    );
});

// ==========================================
// MESSAGE - Handle messages from app
// ==========================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    // Clear auth cache on logout
    if (event.data && event.data.type === 'LOGOUT') {
        caches.open(DYNAMIC_CACHE).then(cache => {
            cache.keys().then(keys => {
                keys.forEach(key => {
                    if (key.url.includes('/api/auth/')) {
                        cache.delete(key);
                    }
                });
            });
        });
    }
});

console.log('[SW] NexusBiz Service Worker loaded');
