import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifjapjnxgkgtyjqlrriu.supabase.co';

function getSupabaseKey() {
  if (typeof process !== 'undefined' && process.env?.SUPABASE_KEY) {
    return process.env.SUPABASE_KEY;
  }
  if (typeof window !== 'undefined' && window.supabaseConfig?.anonKey) {
    return window.supabaseConfig.anonKey;
  }
  throw new Error('Missing Supabase key. Set SUPABASE_KEY or provide supabaseConfig.anonKey');
}

let client;
export function initSupabase() {
  if (!client) {
    const key = getSupabaseKey();
    client = createClient(supabaseUrl, key);
  }
  return client;
}
