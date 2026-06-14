'use client';

import { useEffect } from 'react';

/**
 * PwaRegister Component.
 * Registers the native Service Worker (`/sw.js`) upon mounting on the client side.
 * Designed to be dropped into the root Next.js Layout.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production' // normally register in production only, or disable env check for testing
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('PWA Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('PWA Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
