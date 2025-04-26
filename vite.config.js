import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Explicitly define env variable prefixes
  envPrefix: 'VITE_',
  // Better source maps for debugging
  build: {
    sourcemap: true,
  },
  // Improve dev server configuration
  server: {
    hmr: {
      overlay: true,
    },
  },
})