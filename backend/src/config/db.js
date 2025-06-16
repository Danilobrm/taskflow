import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_CLIENT_URL;
const supabaseKey = process.env.SUPABASE_PUBLIC_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
