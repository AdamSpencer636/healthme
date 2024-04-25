import { createClient } from "@supabase/supabase-js";

export const getDoctors = async (id: string) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data: Doctors, error } = await supabase
		.from("Doctors")
		.select("*")
		.eq("userid", id);

	if (error) {
		return error;
	} else {
		return Doctors;
	}
};

// insert Doctors into DB
export const insertDoctor = async (doctorData: any) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data, error } = await supabase.from("Doctors").insert(doctorData);

	if (error) {
		console.log(error);
	}
};

// delete Doctor from DB
export const deleteDoctor = async (id: string) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data, error } = await supabase.from("Doctors").delete().eq("id", id);

	if (error) {
		console.log(error);
	}
};

// update Doctor in DB
export const updateDoctor = async (id: string, doctorData: any) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data, error } = await supabase.from("Doctors").update(doctorData).eq("id", id);

	if (error) {
		console.log(error);
	}
};