import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ml-api': {
        target: 'https://api.mercadolibre.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ml-api/, ''),
        // --- NOVA CONFIGURAÇÃO: Adicionando headers para parecer um navegador real ---
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json');
          });
        },
      },
    },
  },
})