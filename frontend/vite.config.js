import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// When browser requests a page (Accept: text/html), serve the SPA index.html
// instead of proxying to the Spring Boot backend
const htmlBypass = (req) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return '/index.html'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: htmlBypass,
      },
      '/group': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: htmlBypass,
      },
      '/folder': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: htmlBypass,
      },
      '/media': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: htmlBypass,
      },
      '/chat': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: htmlBypass,
      },
      '/JoinRequest': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: htmlBypass,
      },
    },
  },
})
