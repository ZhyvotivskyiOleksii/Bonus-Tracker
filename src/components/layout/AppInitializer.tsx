
'use client';

import { useEffect } from 'react';

export function AppInitializer() {
  useEffect(() => {
    // Clean Facebook OAuth fragment (#_=_), if present
    try {
      if (typeof window !== 'undefined' && window.location.hash === '#_=_') {
        const url = window.location.href.replace(/#_=_$/, '');
        window.history.replaceState(null, '', url);
      }
    } catch {}

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('Service Worker registration successful, scope is:', registration.scope);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
