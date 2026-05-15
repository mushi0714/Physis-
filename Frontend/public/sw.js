self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/sparkles.png', // Asegúrate de tener un icono en public
    badge: '/sparkles.png',
  };

  event.waitUntil(
    self.notificationReply(data.title, options)
  );
});

// Notificación simple local
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data.payload;
    self.registration.showNotification(title, {
      body,
      icon: '/sparkles.png',
    });
  }
});