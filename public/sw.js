// Service Worker for Push Notifications
const CACHE_NAME = "chatapp-v1";

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(clients.claim());
});

// Push event - hiển thị notification khi nhận push
self.addEventListener("push", (event) => {
  console.log("Push received:", event);

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: "Tin nhắn mới",
      body: event.data?.text() || "Bạn có tin nhắn mới",
    };
  }

  const options = {
    body: data.body || "Bạn có tin nhắn mới",
    icon: data.icon || "/icon.svg",
    badge: "/icon.svg",
    image: data.image,
    data: {
      url: data.url || "/chat",
      conversationId: data.conversationId,
    },
    actions: [
      { action: "open", title: "Mở", icon: "/icon.svg" },
      { action: "close", title: "Đóng" },
    ],
    tag: data.tag || "chat-notification",
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "ChatApp", options)
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/chat";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window/tab open
        for (let client of windowClients) {
          if (client.url.includes("/chat") && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync (optional - for offline support)
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event.tag);
  if (event.tag === "sync-messages") {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  // Implement message sync logic here
  console.log("Syncing messages...");
}
