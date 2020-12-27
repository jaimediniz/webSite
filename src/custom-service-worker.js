importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  self.addEventListener('notificationclick', (event) => {
    // Write the code to open
    if (clients.openWindow) {
      if (event.notification.data.url) {
        event.waitUntil(clients.openWindow(event.notification.data.url));
      } else {
        event.waitUntil(clients.openWindow('/schedule'));
      }
    }
  });
})();
