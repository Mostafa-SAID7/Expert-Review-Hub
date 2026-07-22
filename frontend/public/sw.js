const CACHE = "tayyibat-v1";
const ASSETS = ["/", "/manifest.json", "/favicon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Only handle GET requests
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // ⚠️ Skip non-http/https schemes (chrome-extension://, data:, blob:, etc.)
  // The Cache API only supports http and https — attempting to cache other
  // schemes throws "Request scheme '...' is unsupported".
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Network-first for API calls — always fetch fresh, fall back to cache
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for static assets & HTML navigation
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          // Only cache valid 200 responses for same-origin http/https requests
          if (res && res.status === 200 && res.type === "basic") {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch((err) => {
          // If network fetch fails and we have no cached asset, return cached root or fallback
          if (cached) return cached;
          if (e.request.mode === "navigate") {
            return caches.match("/");
          }
          throw err;
        });
      return cached || network;
    })
  );
});
