// This is the "Offline copy of pages" service worker
const VERSION = '0';
const CACHE = "pwabuilder-offline";
const PRECACHE_ASSETS = [
    '/assets/helvetiker_regular.typeface.json',
    '/dist/'
]
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

workbox.routing.registerRoute(
    new RegExp('/dist/*'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);

workbox.routing.registerRoute(
    new RegExp('/assets/.*\\.png'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);
workbox.routing.registerRoute(
    new RegExp('/assets/.*\\.jpeg'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);
workbox.routing.registerRoute(
    new RegExp('/assets/.*\\.jpg'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);
workbox.routing.registerRoute(
    new RegExp('/assets/.*\\.glb'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);

workbox.routing.registerRoute(
    new RegExp('/login'),
    new workbox.strategies.NetworkFirst()
)