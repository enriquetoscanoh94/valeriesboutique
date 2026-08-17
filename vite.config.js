import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // El sitio se sirve desde la raiz del dominio (Vercel).
  base: '/',
  plugins: [react(), tailwindcss()],
})
