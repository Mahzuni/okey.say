import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/OkeySay/', // Base path for GitHub Pages (assumes repo name is OkeySay)
})
