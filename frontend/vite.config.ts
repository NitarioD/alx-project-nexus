import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is important for deployment/PWA if you need to serve from a subpath
  base: '/',
  // Configure development server proxy if needed, though we will rely on CORS headers from Django
  server: {
    port: 5173,
    host: true, // Needed for Docker environments
  },
  build: {
    outDir: 'dist',
  }
})
