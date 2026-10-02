import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? (process.env.VITE_BASE ?? './') : '/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
}))
