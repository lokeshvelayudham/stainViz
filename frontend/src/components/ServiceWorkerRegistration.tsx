'use client';

import { useEffect } from 'react';

const FIRST_INSTALL_RELOAD_KEY = 'stainviz-pwa-initialized';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    let cancelled = false;
    const wasAlreadyControlled = Boolean(navigator.serviceWorker.controller);

    async function registerServiceWorker() {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;

        if (
          !cancelled
          && !wasAlreadyControlled
          && sessionStorage.getItem(FIRST_INSTALL_RELOAD_KEY) !== 'true'
        ) {
          sessionStorage.setItem(FIRST_INSTALL_RELOAD_KEY, 'true');
          window.location.reload();
        }
      } catch (error) {
        console.error('StainViz offline mode could not be initialized.', error);
      }
    }

    void registerServiceWorker();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
