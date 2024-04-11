"use client";
import ReactECharts from "echarts-for-react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Textarea,
	modal,
	Input,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownSection,
	DropdownItem,
} from "@nextui-org/react";

import { useEffect, useState } from "react";
import { getUserAfterLogin } from "../utils/supabase/getUserAfterLogin";
import {
	getAppointments,
	insertAppointment,
} from "../utils/supabase/Appointments";
import { getDoctors, insertDoctor } from "../utils/supabase/Doctors";

import options from "@/utils/data/weightData";

export default function Page() {
  const [changed, setChanged] = useState(false);
  const [User, setUser] = useState(null);
  const [id, setId] = useState(0);
	const [note, setNote] = useState("");
	const [appointments, setAppointments] = useState([]);
	const [appointment, setAppointment] = useState(0);
	const [doctors, setDoctors] = useState([]);
	const [doctor, setDoctor] = useState(0);
	const [doctorName, setDoctorName] = useState("");
	const [doctorPhone, setDoctorPhone] = useState("");
	const [doctorSpecialty, setDoctorSpecialty] = useState("");
	const [appointmentAddress, setAppointmentAddress] = useState("");
	const [appointmentDate, setAppointmentDate] = useState("");
	const [appointmentDoctor, setAppointmentDoctor] = useState("Select Doctor");
	const [modalMode, setModalMode] = useState("appointment"); // [appointment, addAppointment, addDoctor]
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleAppointmentClick = (i: number, e: MouseEvent) => {
		setAppointment(appointments[i]);
		console.log(i);
		console.log(e);
		onOpen();
	};

	const handleAppointmentSubmit = (i: number, e: any) => {
		console.log(i);
		console.log(e);
		console.log(note);
		onClose();
	};

	const handleAddAppointment = () => {
		const appointmentData = {
			"DoctorFname": appointmentDoctor,
			"Patient": id,
			"Date": appointmentDate,
			"address": appointmentAddress,
		};
    insertAppointment(appointmentData);
    setChanged(!changed);
	};

	const handleAddDoctor = () => {
		const doctorData = {
			"Name": doctorName,
			"Phone": doctorPhone,
			"Specialty": doctorSpecialty,
			"userid": id,
		};
    insertDoctor(doctorData);
    setChanged(!changed);
  };
  
  const handleChangeDoctorName = (key) => {
    doctors.forEach((doctor) => {
      if (doctor.id == key) {
			setAppointmentDoctor(doctor.Name);
		}
    });
  }

	useEffect(() => {
		const fetchData = async () => {
			// Wait for SSR to finish
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Get user info from getUserAfterLogin()
			const userId = localStorage.getItem("userid");
			console.log(userId);
			const user = await getUserAfterLogin(userId);

			// Set the user state
      setUser(user);
      
      // Set the id state
      setId(userId);

			// Log the user data
			console.log(user);

			//get the user's appointments
			const appointments = await getAppointments(userId);
			setAppointments(appointments);

			//get the user's doctors
			const doctors = await getDoctors(userId);
			setDoctors(doctors);

			// Log the appointments
			console.log(appointments);

			// Log the doctors
			console.log(doctors);
		};

		fetchData();
  }, [changed]);
  

	return (
		<main className="h-screen">
			{User ? (
				<div className="h-full p-5">
					<div className="w-full flex justify-center">
						<h1 className="text-3xl font-bold">
							Welcome, {User[0].Fname}
						</h1>
					</div>
					<div id="graph" className="border-b pb-4">
						<ReactECharts option={options} />
					</div>
					<div className="grid grid-cols-2">
						<div className="flex flex-col mr-2">
							<div id="appointments">
								<div id="title">
									<h2 className="text-2xl font-bold text-center mb-3">
										Appointments
									</h2>
								</div>
								{/*map over a 5 index array, listing out a date, apointment address, and random doctor name for each*/}
								<div className="flex flex-row">
									<div className="w-1/3">Date</div>
									<div className="w-1/3">Address</div>
									<div className="w-1/3">Doctor</div>
								</div>
								{appointments.map((appointment, i) => (
									<div
										className="flex flex-row border-y-1 my-3 p-2 bg-yellow-200 bg-opacity-70 rounded-lg hover:bg-opacity-40 cursor-pointer"
										key={i}
										onClick={(e) => {
											setModalMode("appointment");
											handleAppointmentClick(i, e);
										}}
									>
										<div className="w-1/3">
											{appointment.Date}
										</div>
										<div className="w-1/3">
											{appointment.address}
										</div>
										<div className="w-1/3">
											{appointment.DoctorFname}
										</div>
									</div>
								))}
								<div className="w-full flex justify-center items-center">
									<div
										className="flex flex-row border-y-1 my-3 px-4 py-1 bg-blue-200 bg-opacity-70 rounded-lg hover:bg-opacity-40 cursor-pointer w-max"
										onClick={(e) => {
											setModalMode("addAppointment");
											onOpen();
										}}
									>
										+
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col ml-2">
							<div id="Doctors">
								<div id="title">
									<h2 className="text-2xl font-bold text-center mb-3">
										Doctors
									</h2>
								</div>
								{/*map over a 5 index array, listing out doctors and their phone numbers*/}
								<div className="flex flex-row">
									<div className="w-1/3">Doctor</div>
									<div className="w-1/3">Phone</div>
									<div className="w-1/3">Specialty</div>
								</div>
								{doctors.map((doctor, i) => (
									<div
										className="flex flex-row border-y-1 my-3 p-2  rounded-lg"
										key={i}
									>
										<div className="w-1/3">
											{doctor.Name}
										</div>
										<div className="w-1/3">
											{doctor.Phone}
										</div>
										<div className="w-1/3">
											{doctor.Specialty}
										</div>
									</div>
								))}
								{/* An add button centered and shaped like the other boxes*/}
								<div className="w-full flex justify-center items-center">
									<div
										className="flex flex-row border-y-1 my-3 px-4 py-1 bg-blue-200 bg-opacity-70 rounded-lg hover:bg-opacity-40 cursor-pointer w-max"
										onClick={(e) => {
											setModalMode("addDoctor");
											onOpen();
										}}
									>
										+
									</div>
								</div>
							</div>
						</div>
					</div>
					<Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
						{modalMode === "appointment" ? (
							<ModalContent>
								{(onClose) => (
									<>
										<ModalBody className="text-black">
											<div className="flex flex-row">
												<div className="w-1/3">
													Date
												</div>
												<div className="w-1/3">
													Address
												</div>
												<div className="w-1/3">
													Doctor
												</div>
											</div>

											<div className="flex flex-row ">
												<div className="w-1/3">
													{appointment.Date}
												</div>
												<div className="w-1/3">
													{appointment.address}
												</div>
												<div className="w-1/3">
													{appointment.DoctorFname}
												</div>
											</div>

											<div className="w-full flex flex-col gap-2">
												<Textarea
													label="Notes"
													labelPlacement="outside"
													placeholder="Enter notes here..."
													value={note}
													onValueChange={setNote}
												/>
											</div>
										</ModalBody>
										<ModalFooter>
											<Button
												color="danger"
												variant="light"
												onPress={onClose}
											>
												Close
											</Button>
											<Button
												color="primary"
												variant="flat"
												onPress={(e) =>
													handleAppointmentSubmit(
														appointment,
														e
													)
												}
											>
												Submit
											</Button>
										</ModalFooter>
									</>
								)}
							</ModalContent>
						) : null}
						{modalMode === "addAppointment" ? (
							<ModalContent>
								{(onClose) => (
									<>
										<ModalBody className="text-black">
											<div>
												<h2 className="text-2xl font-bold text-center mb-3">
													Add Appointment
												</h2>
												<label>Date</label>
												<Input
													type="date"
													value={appointmentDate}
													onValueChange={
														setAppointmentDate
													}
												/>
												<label>Address</label>
												<Input
													type="text"
													value={appointmentAddress}
													onValueChange={
														setAppointmentAddress
													}
												/>
												<Dropdown>
													<DropdownTrigger>
														<Button className="mt-5 w-full text-black">
															{appointmentDoctor}
														</Button>
													</DropdownTrigger>
													<DropdownMenu
														items={doctors}
                            onAction={(key) => {
                              console.log(key);
                              handleChangeDoctorName(key);
															}
														}
														aria-label="Doctors"
													>
														{(item) => (
															<DropdownItem
																key={item.id}
																className="text-black"
															>
																{item.Name}
															</DropdownItem>
														)}
													</DropdownMenu>
												</Dropdown>
											</div>
										</ModalBody>
										<ModalFooter>
											<Button
												color="danger"
												variant="light"
												onPress={() => {
													setAppointmentDate("");
													setAppointmentDoctor("");
													setAppointmentAddress("");
													onClose();
												}}
											>
												Close
											</Button>
											<Button
												color="primary"
												variant="flat"
												onPress={(e) => {
													handleAddAppointment();
													setAppointmentDate("");
													setAppointmentDoctor("");
													setAppointmentAddress("");
													onClose();
												}}
											>
												Submit
											</Button>
										</ModalFooter>
									</>
								)}
							</ModalContent>
						) : null}
						{modalMode === "addDoctor" ? (
							<ModalContent>
								{(onClose) => (
									<>
										<ModalBody className="text-black">
											<ModalBody className="text-black">
												<div>
													<h2 className="text-2xl font-bold text-center mb-3">
														Add Doctor
													</h2>
													<label>Doctor</label>
													<Input
														type="text"
														value={doctorName}
														onValueChange={
															setDoctorName
														}
													/>
													<label>Phone</label>
													<Input
														type="tel"
														value={doctorPhone}
														onValueChange={
															setDoctorPhone
														}
													/>
													<label>Specialty</label>
													<Input
														type="text"
														value={doctorSpecialty}
														onValueChange={
															setDoctorSpecialty
														}
													/>
												</div>
											</ModalBody>
										</ModalBody>
										<ModalFooter>
											<Button
												color="danger"
												variant="light"
                        onPress={() => {
                          setDoctorName("");
													setDoctorPhone("");
                          setDoctorSpecialty("");
                          onClose();
                        }
                        }
											>
												Close
											</Button>
											<Button
												color="primary"
												variant="flat"
												onPress={(e) => {
													handleAddDoctor();
													setDoctorName("");
													setDoctorPhone("");
													setDoctorSpecialty("");
													onClose();
												}}
											>
												Submit
											</Button>
										</ModalFooter>
									</>
								)}
							</ModalContent>
						) : null}
					</Modal>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</main>
	);
}

{
	/*{appointments.map((appointment, i) => (
									<div
										className="flex flex-row border-y-1 my-3 p-2 bg-yellow-200 bg-opacity-70 rounded-lg hover:bg-opacity-40 cursor-pointer"
										key={i}
										onClick={(e) => {
											setAppointment(appointments[i]);
											handleAppointmentClick(i, e);
										}}
									>
										<div className="w-1/3">
											{appointment.date}
										</div>
										<div className="w-1/3">
											{appointment.address}
										</div>
										<div className="w-1/3">
											{appointment.DoctorFname}
										</div>
									</div>
								))} 

                Similar logic for Doctors

                */
}
