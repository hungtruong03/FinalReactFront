import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: "/FinalReactFront/",
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://final-nest-back.vercel.app/', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})
