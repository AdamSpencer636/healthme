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
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Link,
	Spinner,
	DatePicker,
} from "@nextui-org/react";


import { useEffect, useState } from "react";
import { getUserAfterLogin } from "../utils/supabase/getUserAfterLogin";
import {
	getAppointments,
	insertAppointment,
	deleteAppointment,
	updateAppointment,
} from "../utils/supabase/Appointments";
import {
	getDoctors,
	insertDoctor,
	updateDoctor,
	deleteDoctor,
} from "../utils/supabase/Doctors";

import options from "@/utils/data/weightData";
import classNames from "classnames";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
	const [changed, setChanged] = useState(false);
	const [User, setUser] = useState(null);
	const [id, setId] = useState(0);
	const [note, setNote] = useState("");
	const [appointments, setAppointments] = useState([]);
	const [appointment, setAppointment] = useState();
	const [doctors, setDoctors] = useState([]);
	const [doctor, setDoctor] = useState();
	const [doctorName, setDoctorName] = useState("");
	const [doctorPhone, setDoctorPhone] = useState("");
	const [doctorSpecialty, setDoctorSpecialty] = useState("");
	const [appointmentAddress, setAppointmentAddress] = useState("");
	const [appointmentDate, setAppointmentDate] = useState("");
	const [appointmentDoctor, setAppointmentDoctor] = useState("Select Doctor");
	const [modalMode, setModalMode] = useState("appointment");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteType, setDeleteType] = useState("")

	const currentData = new Date().toISOString().slice(0, 10);

	
  const sendErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const sendWarningToast = (message: string) => {
    toast.warn(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const sendSuccessToast = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

	const handleAppointmentClick = (i: number, e: MouseEvent) => {
		setAppointment(appointments[i]);
		onOpen();
	};

	const handleAddAppointment = () => {
		const appointmentData = {
			DoctorFname: appointmentDoctor,
			Patient: id,
			Date: appointmentDate,
			address: appointmentAddress,
		};
    insertAppointment(appointmentData);
    sendSuccessToast("Added Successfully!")
		setChanged(!changed);
	};

	const handleUpdateAppointment = (formData: FormData) => {
		if (appointmentDoctor == "") {
			
		}
		const appointmentData = {
			DoctorFname: appointmentDoctor,
			Patient: id,
			Date: formData.get("date"),
			address: formData.get("address"),
			Notes: note,
		};
		updateAppointment(appointment.id, appointmentData);
		setAppointmentDoctor("");
    setChanged(!changed);
    sendSuccessToast("Updated Successfully!")
		onClose();
	};

	const handleDeleteAppointment = (id: number) => {
    deleteAppointment(id);
    sendSuccessToast("Deleted Successfully!")
		setChanged(!changed);
	};

	const handleAddDoctor = () => {
		const doctorData = {
			Name: doctorName,
			Phone: doctorPhone,
			Specialty: doctorSpecialty,
			userid: id,
		};
    insertDoctor(doctorData);
    sendSuccessToast("Added Successfully!")
		setChanged(!changed);
	};

	const handleUpdateDoctor = (formdata: FormData) => {
		const doctorData = {
			Name: formdata.get("name"),
			Phone: formdata.get("phone"),
			Specialty: formdata.get("specialty"),
			userid: id,
		};
    updateDoctor(doctor.id, doctorData);
    sendSuccessToast("Updated Successfully!")
		setChanged(!changed);
	};

	const handleDeleteDoctor = (id) => {
    deleteDoctor(id);
    sendSuccessToast("Deleted Successfully!")
    setChanged(!changed);
	};

	const handleChangeDoctorName = (key) => {
		doctors.forEach((doctor) => {
			if (doctor.id == key) {
				setAppointmentDoctor(doctor.Name);
			}
    });
  };
  
  const handleDelete = () => {
    if (deleteType === "Appointment") {
      handleDeleteAppointment(appointment.id);
    } else if (deleteType === "Doctor") {
      handleDeleteDoctor(doctor.id);
    }
    setDeleteType("")
    onClose();
  };

	const handleLogOut = () => {
		localStorage.removeItem("userid");
		setUser(null);
		//send user to login page
    window.location.href = "/login";
	};

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

			//if user in null, reroute to login
			if (user.message) {
				window.location.href = "/login";
			}

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
    <main className="flex flex-col h-screen max-h-screen">
      <Navbar className="bg-inherit">
        <NavbarBrand>
          <Link href="/" className="font-bold">
            HealthMe
          </Link>
        </NavbarBrand>
        {!User ? (
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="#" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex text-white">
              <Link href="/display-notes">
                Welcome {User[0].Fname} {User[0].Lname}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={() => handleLogOut()}
              >
                Log out
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
      </Navbar>
      {User ? (
        <div className="h-full p-5">
          <div className="w-full flex justify-center">
            <h1 className="text-3xl font-bold">Welcome, {User[0].Fname}</h1>
          </div>
          <div id="graph" className="border-b pb-4">
            <ReactECharts option={options} />
          </div>
          <div className="grid grid-cols-2">
            <div className="flex flex-col mr-2">
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
                    className="flex flex-row border-y-1 my-3 p-2  bg-opacity-70 rounded-lg hover:bg-slate-600 cursor-pointer"
                    onClick={(e) => {
                      setModalMode("doctor");
                      console.log(doctor);
                      setDoctor(doctor);
                      onOpen();
                    }}
                    key={i}
                  >
                    <div className="w-1/3 flex items-center">{doctor.Name}</div>
                    <div className="w-1/3 flex items-center">
                      {doctor.Phone}
                    </div>
                    <div className="w-1/4 flex items-center">
                      {doctor.Specialty}
                    </div>
                    <div>
                      <Button
                        color="danger"
                        variant="light"
                        onClick={(e) => {
                          setModalMode("confirmDelete");
                          setDoctor(doctor);
                          setDeleteType("Doctor");
                          onOpen();
                        }}
                      >
                        Delete
                      </Button>
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
            <div className="flex flex-col ml-2">
              <div id="appointments">
                <div id="title">
                  <h2 className="text-2xl font-bold text-center mb-3">
                    Appointments
                  </h2>
                </div>
                <div className="flex flex-row">
                  <div className="w-1/3">Date</div>
                  <div className="w-1/3">Address</div>
                  <div className="w-1/3">Doctor</div>
                </div>
                {appointments.map((appointment, i) => (
                  <div
                    className={classNames(
                      "flex flex-row border-y-1 my-3 p-2 bg-opacity-70 rounded-lg hover:bg-opacity-40 cursor-pointer",
                      {
                        "bg-red-500":
                          new Date(appointment.Date) < new Date(currentData),
                        "bg-green-500":
                          new Date(appointment.Date) > new Date(currentData),
                        "bg-yellow-500":
                          new Date(appointment.Date) == new Date(currentData),
                      }
                    )}
                    key={i}
                    onClick={(e) => {
                      setModalMode("appointment");
                      console.log(appointment);
                      handleAppointmentClick(i, e);
                    }}
                  >
                    <div className="w-1/3 flex items-center">
                      {appointment.Date}
                    </div>
                    <div className="w-1/3 flex items-center">
                      {appointment.address}
                    </div>
                    <div className="w-1/3 flex items-center">
                      {appointment.DoctorFname}
                    </div>
                    <div>
                      <Button
                        color="danger"
                        variant="solid"
                        onClick={(e) => {
                          setModalMode("confirmDelete");
                          setAppointment(appointment);
                          setDeleteType("Appointment");
                          onOpen();
                        }}
                      >
                        Delete
                      </Button>
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
          </div>
          <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
            {modalMode === "appointment" ? (
              <ModalContent>
                {(onClose) => (
                  <form action={handleUpdateAppointment}>
                    <ModalBody className="text-black">
                      <div className="flex flex-row">
                        <div className="w-1/3">Date</div>
                        <div className="w-1/3">Address</div>
                        <div className="w-1/3">Doctor</div>
                      </div>

                      <div className="flex flex-row space-x-2">
                        <DatePicker
                          isRequired
                          name="date"
                          className="w-1/3"
                          label="Date"
                        />
                        <Input
                          className="w-1/3"
                          isRequired
                          name="address"
                          placeholder={appointment.address}
                        />
                        <Dropdown>
                          <DropdownTrigger>
                            <Button className="w-1/3">
                              {appointmentDoctor}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            items={doctors}
                            onAction={(key) => {
                              console.log(key);
                              handleChangeDoctorName(key);
                            }}
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
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" variant="flat" type="submit">
                        Submit
                      </Button>
                    </ModalFooter>
                  </form>
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
                          onValueChange={setAppointmentDate}
                        />
                        <label>Address</label>
                        <Input
                          type="text"
                          value={appointmentAddress}
                          onValueChange={setAppointmentAddress}
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
                            }}
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
                            onValueChange={setDoctorName}
                          />
                          <label>Phone</label>
                          <Input
                            type="tel"
                            value={doctorPhone}
                            onValueChange={setDoctorPhone}
                          />
                          <label>Specialty</label>
                          <Input
                            type="text"
                            value={doctorSpecialty}
                            onValueChange={setDoctorSpecialty}
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
                        }}
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
            {modalMode === "doctor" ? (
              <ModalContent>
                {(onClose) => (
                  <form action={handleUpdateDoctor}>
                    <ModalBody className="text-black">
                      <div className="flex flex-row">
                        <div className="w-1/3">Doctor</div>
                        <div className="w-1/3">Phone</div>
                        <div className="w-1/3">Specialty</div>
                      </div>

                      <div className="flex flex-row space-x-2">
                        <Input
                          className="w-1/3"
                          isRequired
                          name="name"
                          placeholder={doctor.Name}
                        />
                        <Input
                          className="w-1/3"
                          isRequired
                          name="phone"
                          placeholder={doctor.Phone}
                        />
                        <Input
                          className="w-1/3"
                          isRequired
                          name="specialty"
                          placeholder={doctor.Specialty}
                        />
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" variant="flat" type="submit">
                        Submit
                      </Button>
                    </ModalFooter>
                  </form>
                )}
              </ModalContent>
            ) : null}
            {modalMode === "confirmDelete" ? (
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalBody className="text-black">
                      <h2 className="text-2xl font-bold text-center mb-3">
                        Are you sure you want to delete?
                      </h2>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={handleDelete}
                      >
                        Delete
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            ) : null}
          </Modal>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      )}
      <ToastContainer />
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
