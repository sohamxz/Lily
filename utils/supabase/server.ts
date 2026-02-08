import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createMockSupabase } from './mock'

export async function createClient() {
  // FORCE MOCK for robust testing in sandbox
  console.warn("⚠️ Using Mock Client (Forced).");
  return createMockSupabase();
}
