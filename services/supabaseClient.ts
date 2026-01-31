
import { createClient } from '@supabase/supabase-js';

// القيم الافتراضية للمشروع (يفضل دائماً وضعها في بيئة العمل)
const supabaseUrl = process.env.SUPABASE_URL || 'https://jbdztlzlvqmimqtotzmq.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZHp0bHpsdnFtaW1xdG90em1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzM0NjQsImV4cCI6MjA4NDg0OTQ2NH0.ErXSuzHq0ylCX1rxv1_iqH2LPNtdUhaZ3PCLSuZYeiM';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }) 
  : null;
