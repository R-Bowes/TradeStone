// Dynamic import of the Supabase client so that the app works both in
// Node.js (for scripts or tests) and directly in the browser without a
// bundler.  The previous implementation relied on a bare import
// (`@supabase/supabase-js`) which browsers cannot resolve on their own,
// causing login pages that use this helper to fail to load.
let createClient;
if (typeof window === 'undefined') {
  // Node/SSR environment – use the installed package.
  ({ createClient } = await import('@supabase/supabase-js'));
} else {
  // Browser environment – load the ESM build from a CDN.
  ({ createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'));
}

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
