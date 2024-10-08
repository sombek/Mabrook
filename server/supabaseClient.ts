// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { Bindings } from './bindings';

export function createSupabaseClient(env: Bindings, token: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: token } },
  });
}
