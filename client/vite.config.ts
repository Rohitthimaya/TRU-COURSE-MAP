import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiPort = process.env.API_PORT || process.env.PORT || '3000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.CLIENT_PORT || 5173),
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true
      }
    }
  }
})

