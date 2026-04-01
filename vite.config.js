import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- ALTERAÇÃO: Proxy removido pois usaremos Serverless Functions (Backend) na Vercel ---
})