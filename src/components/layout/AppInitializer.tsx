
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

    // Lightweight GTM helpers: CTA clicks + auth events via cookie
    try {
      // Avoid errors if GTM not present (e.g., dev)
      (window as any).dataLayer = (window as any).dataLayer || [];

      // Track clicks on elements with class "cta-sweeps" (Get Bonuses)
      const onClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        const el = target?.closest?.('a.cta-sweeps, button.cta-sweeps');
        if (el) {
          const href = (el as HTMLAnchorElement).href || (el as HTMLElement).getAttribute('data-href') || '';
          (window as any).dataLayer.push({ event: 'cta_get_bonuses_click', href });
        }
      };
      document.addEventListener('click', onClick, true);

      // Read a short-lived cookie set by the auth callback to signal login/signup
      const cookieVal = document.cookie
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('gtm_evt='));
      if (cookieVal) {
        const val = decodeURIComponent(cookieVal.split('=')[1] || '');
        if (val === 'signup' || val === 'login') {
          (window as any).dataLayer.push({ event: val === 'signup' ? 'auth_signup_success' : 'auth_login_success' });
        }
        // Clear the cookie
        document.cookie = 'gtm_evt=; Max-Age=0; path=/';
      }

      return () => {
        document.removeEventListener('click', onClick, true);
      };
    } catch {}
  }, []);

  return null;
}
