// js/supabaseClient.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://YOUR-PROJECT.ref.supabase.co';
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY'; // public key, OK in browser

export const supabase = createClient(supabaseUrl, supabaseKey);
