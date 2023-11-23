// utils/translations.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
  );

export const getTranslation = async (lng, file) => {
  const { data, error } = await supabase
    .from('pages')
    .select(lng)
    .eq('element', file)

  if (error) throw error;
  return Array.isArray(data) ? data[0][lng] : data
};