import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

export async function connectSupabase() {
    try {
        const { data, error } = await supabase.from('users').select('id')
        if(error) throw error;
        console.log("Supabase connected 🥰")
    } catch (error) {
        console.error("Supabase connection error 💔", error)
        throw error;
    }
}