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