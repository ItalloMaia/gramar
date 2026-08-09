// GRAMAR MEDIÇÕES — Service Worker
// Coloque este arquivo na RAIZ do repositório, ao lado do index.html, com o nome sw.js

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data.json(); } catch(e){ data = { title:'Gramar Medições', body: (event.data && event.data.text()) || 'Nova notificacao' }; }
  var title = data.title || 'Gramar Medições';
  var options = {
    body: data.body || '',
    tag: data.tag || 'gramar-pendencia',
    data: { url: data.url || './' },
    vibrate: [100,50,100]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
      for (var i=0;i<list.length;i++){
        if ('focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
