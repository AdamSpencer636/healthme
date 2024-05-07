//function to retrieve all notes from the database

import { createClient } from "@supabase/supabase-js";

export const getNotes = async (start, end, userid) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
        .from("Notes")
        .select("*")
        .eq("userid", userid)
        .gte("date_created", start)
        .lte("date_created", end)
        .order("date_created", { ascending: false });
        
	if (error) {
		console.error(error);
		return [];
    }
	return data;
}

//function to insert a note into the database
export const insertNote = async (noteData) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // @ts-ignore
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.from("Notes").insert(noteData);
    if (error) {
        console.error(error);
        return "Failed to insert note. Please try again. if the problem persists, please try logging in.";
    }
    return true
}

//function to update a note in the database
export const updateNote = async (noteData) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // @ts-ignore
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.from("Notes").update(noteData).eq("id", noteData.id);
    if (error) {
        console.error(error);
    }
}

//function to delete a note from the database
export const deleteNote = async (id) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // @ts-ignore
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.from("Notes").delete().eq("id", id);
    if (error) {
        console.error(error);
        return "Failed to delete note. Please try again.";
    }
    return true;
}