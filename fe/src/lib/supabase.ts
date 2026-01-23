import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../../../be/supabase-config'

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)