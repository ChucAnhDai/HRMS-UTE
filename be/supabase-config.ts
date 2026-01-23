// Backend configuration for Supabase
export const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
};