// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8081',
//         changeOrigin: true,
//         secure: false,
//       },
//       '/api/login': 'http://localhost:8081',
//       '/api/register': 'http://localhost:8081',
//       '/api/slide': 'http://localhost:8081',
//       '/api/product': 'http://localhost:8081',
//       '/api/add-to-cart': 'http://localhost:8081',
//       '/api/my-cart': 'http://localhost:8081',
//       '/api/remove-cart': 'http://localhost:8081',
//       '/api/update-cart': 'http://localhost:8081',
//       '/api/checkout': 'http://localhost:8081',
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: resolve(__dirname, 'index.html'),      // Trang người dùng
  //       admin: resolve(__dirname, 'admin.html'),     // Trang quản trị
  //     },
  //   },
  // },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
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

