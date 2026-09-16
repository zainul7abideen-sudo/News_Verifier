import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tpqhmxcftvclgqexbxro.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wBY8HZAlrb2_giotXKjzLQ_3GwiM19J'

export const supabase = createClient(supabaseUrl, supabaseKey)
