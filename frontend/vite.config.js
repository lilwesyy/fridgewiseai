import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), basicSsl()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true,
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http: https:; connect-src 'self' http: https: ws: wss:;"
    },
    proxy: {
      '/api': {
        target: 'http://192.168.1.38:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
