
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // هذا الجزء يحل مشكلة ReferenceError: process is not defined
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
