import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  // base: "/FinalReactFront/",
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./certs/demo.key'),
      cert: fs.readFileSync('./certs/demo.cert'),
    },
  },
})
