import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestSupabase() {
  useEffect(() => {
    supabase.from('users').select('*').then(({ data, error }) => {
      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Supabase data:', data);
      }
    });
  }, []);
  return <div>Test Supabase</div>;
} 