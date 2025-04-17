import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      // '/api/admin': 'http://localhost:8081',
      // '/api/login': 'http://localhost:8081',
      // '/api/register': 'http://localhost:8081',
      // '/api/slide': 'http://localhost:8081',
      // '/api/product': 'http://localhost:8081',
      // '/api/add-to-cart': 'http://localhost:8081',
      // '/api/my-cart': 'http://localhost:8081',
      // '/api/remove-cart': 'http://localhost:8081',
      // '/api/update-cart': 'http://localhost:8081',
      // '/api/checkout': 'http://localhost:8081',
    }
  }
})
