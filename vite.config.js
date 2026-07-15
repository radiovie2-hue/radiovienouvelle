import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/radiovienouvelle/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
