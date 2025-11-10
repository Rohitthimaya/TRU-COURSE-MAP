import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.CLIENT_PORT || 5173),
    proxy: process.env.NODE_ENV === 'development'
      ? {
          '/api': {
            target: `http://localhost:3000`,
            changeOrigin: true
          }
        }
      : undefined
  }
})
