
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure process.env.API_KEY is available for Gemini SDK
    // In vite.config.ts, use process.env.VITE_API_KEY if reading from .env files
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.VITE_API_KEY),
    // For Supabase client running in browser with Vite - these are accessed via import.meta.env
    // 'process.env.VITE_SUPABASE_URL': JSON.stringify(import.meta.env.VITE_SUPABASE_URL),
    // 'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(import.meta.env.VITE_SUPABASE_ANON_KEY),
  },
  // If deploying to a subfolder like /your-project-name/, uncomment and set:
  // base: '/your-project-name/',
});