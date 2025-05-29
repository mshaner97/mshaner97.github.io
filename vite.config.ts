import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // If you want your main portfolio at '/'
        main: 'index.html',
        // Your Giffy App
        gifapp: 'gifapp.html',
        // Your Solitaire Game
        solitaire: 'src/projects/solitairegame/solitaire.html',
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
  }
})