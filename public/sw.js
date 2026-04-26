// Odregistruje se a smaže všechny cache — SW pro tuto aplikaci nepotřebujeme,
// prohlížeč cachuje /_next/static/ sám přes Cache-Control: immutable.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
