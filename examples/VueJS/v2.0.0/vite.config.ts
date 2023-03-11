import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { UserConfigExport } from 'vite'
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: "es2022"
  },
  server: {
    port: 3007
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ]
  }
})
