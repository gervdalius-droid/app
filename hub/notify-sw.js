/* Dėdės Baldai — notifications service worker (scope /hub/).
   Only shows pushed notices and opens the right app when one is tapped.
   It does not cache or intercept any page. ShopFlow has the same handlers
   in its own service worker. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: "Dėdės Baldai", body: e.data ? e.data.text() : "" }; }
  var title = d.title || "Dėdės Baldai";
  var opts = {
    body: d.body || "",
    icon: "/hub/shared/touch-180.png",
    badge: "/hub/shared/badge-96.png",
    tag: d.id ? "n-" + d.id : undefined,
    renotify: !!d.id,
    requireInteraction: !!d.important,
    timestamp: Date.now(),
    data: { url: d.url || "/hub/shopfloor/", id: d.id || null }
  };
  e.waitUntil(Promise.all([
    self.registration.showNotification(title, opts),
    // tell open pages so they refresh their bell right away
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      list.forEach(function (c) { try { c.postMessage({ type: "notice-push", id: d.id || null }); } catch (err) {} });
    })
  ]));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/hub/shopfloor/";
  var target = new URL(url, self.location.origin);
  if (e.notification.data && e.notification.data.id) target.searchParams.set("notice", e.notification.data.id);
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    var base = target.origin + target.pathname;
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(base) === 0 && "focus" in c) {
        try { c.postMessage({ type: "notice-open", id: e.notification.data && e.notification.data.id }); } catch (err) {}
        return c.focus().then(function (w) { return target.hash && w && w.navigate ? w.navigate(target.href) : w; }).catch(function () {});
      }
    }
    return self.clients.openWindow(target.href);
  }));
});
