import { createClient } from "@supabase/supabase-js";

export const getAppointments = async (id: string) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data: Appointments, error } = await supabase
		.from("Appointments")
		.select("*")
		.eq("Patient", id);

	if (error) {
		return error;
	} else {
		return Appointments;
	}
};
//insert appointment into DB
 
// insert appointment into DB
export const insertAppointment = async (appointmentData: any) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.from("Appointments").insert(appointmentData);

    if (error) {
        console.log(error);
    
};
}

// delete appointment from DB
export const deleteAppointment = async (id: number) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { error } = await supabase.from("Appointments").delete().eq('id', id);

	if (error) {
		console.log(error);
	} else {
		console.log("Deleted appointment with id: ", id);
	}
};

// update appointment in DB
export const updateAppointment = async (id: string, appointmentData: any) => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// @ts-ignore
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data, error } = await supabase.from("Appointments").update(appointmentData).eq("id", id);

	if (error) {
		console.log(error);
	}
};