import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:8080',  // Your backend server URL
        ws: true,  // Enable WebSocket proxying
        changeOrigin: true,
      },
    },
  },plugins: [react()],
})
