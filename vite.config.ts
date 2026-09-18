import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const directRoutes = {
  '/privacidad/': '/privacidad/index.html',
  '/terminos/': '/terminos/index.html',
  '/reclamos/': '/reclamos/index.html',
  '/en/': '/en/index.html',
  '/en/privacy/': '/en/privacy/index.html',
  '/en/terms/': '/en/terms/index.html',
  '/en/complaints/': '/en/complaints/index.html',
} as const;

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'direct-route-rewrites',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const request = req as unknown as { url?: string };
          if (request.url && request.url in directRoutes) {
            request.url = directRoutes[request.url as keyof typeof directRoutes];
          }
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        en: new URL('./en/index.html', import.meta.url).pathname,
      },
    },
  },
  server: {
    allowedHosts: ['meanwhile-chat-competent-preventing.trycloudflare.com'],
  },
});
