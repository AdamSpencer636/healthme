import { createClient } from '@supabase/supabase-js'

export const getUserAfterLogin = async (id: string) => { 

    
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        // @ts-ignore
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: User, error } = await supabase
            .from("Profile")
            .select("*")
            .eq("id", id)
    
    if (error) {
        return error
    } else {
        return User
    }
}