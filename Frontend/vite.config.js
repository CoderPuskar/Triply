import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()],
  server: {
    proxy: {
      "/users": "http://127.0.0.1:4000",
      "/captains": "http://127.0.0.1:4000",
      "/maps": "http://127.0.0.1:4000",
      "/rides": "http://127.0.0.1:4000",
      "/socket.io": {
        target: "http://127.0.0.1:4000",
        ws: true,
      },
    },
  },
})
