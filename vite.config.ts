
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // تعريف المفاتيح لضمان وصول التطبيق إليها في المتصفح
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || 'https://jbdztlzlvqmimqtotzmq.supabase.co'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZHp0bHpsdnFtaW1xdG90em1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzM0NjQsImV4cCI6MjA4NDg0OTQ2NH0.ErXSuzHq0ylCX1rxv1_iqH2LPNtdUhaZ3PCLSuZYeiM')
  }
});
