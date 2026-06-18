import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'serwist';

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Cache API responses with NetworkFirst strategy (fresh data, fallback to cache)
      matcher: /^https:\/\/apiweb\.immsolo\.or\.id\/api\/.*/i,
      handler: new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
          {
            cachedResponseWillBeUsed: async ({ cachedResponse }) => {
              if (!cachedResponse) return null;
              const date = cachedResponse.headers.get('date');
              if (date) {
                const age = (Date.now() - new Date(date).getTime()) / 1000;
                if (age > 3600) return null; // 1 hour max age
              }
              return cachedResponse;
            },
          },
        ],
        networkTimeoutSeconds: 10,
      }),
    },
    {
      // Cache Google Fonts for 1 year (they never change)
      matcher: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: 'google-fonts',
        plugins: [
          {
            cachedResponseWillBeUsed: async ({ cachedResponse }) => {
              if (!cachedResponse) return null;
              const date = cachedResponse.headers.get('date');
              if (date) {
                const age = (Date.now() - new Date(date).getTime()) / 1000;
                if (age > 365 * 24 * 3600) return null; // 1 year max
              }
              return cachedResponse;
            },
          },
        ],
      }),
    },
    {
      // Cache images with StaleWhileRevalidate
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'static-images',
      }),
    },
    {
      // Cache JS/CSS assets
      matcher: /\.(?:js|css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'static-resources',
      }),
    },
  ],
});

serwist.addEventListeners();
