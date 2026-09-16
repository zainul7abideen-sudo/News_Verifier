import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tpqhmxcftvclgqexbxro.supabase.co'
const supabaseKey = 'sb_publishable_wBY8HZAlrb2_giotXKjzLQ_3GwiM19J'

export const supabase = createClient(supabaseUrl, supabaseKey)
