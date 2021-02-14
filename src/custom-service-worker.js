importScripts('./ngsw-worker.js');

(function () {
  'use strict';
  self.addEventListener('notificationclick', (event) => {
    if (clients.openWindow) {
      switch (event.action) {
        case 'explore':
          clients.openWindow(event.notification.data.url);
          break;
        default:
          clients.openWindow('/#/home');
          break;
      }
    }
  });
})();
