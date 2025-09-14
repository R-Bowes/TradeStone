// js/supabaseClient.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://tnvxfzmdjpsswjszwbvf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRudnhmem1kanBzc3dqc3p3YnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzI3NjYsImV4cCI6MjA3MzQ0ODc2Nn0.rzTUVRPxybLJZ9asE04lOg-5pjFp6FZXWT3JzvshI8A'; // public key, OK in browser

export const supabase = createClient(supabaseUrl, supabaseKey);
