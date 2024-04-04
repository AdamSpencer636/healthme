"use client";
import ReactECharts from "echarts-for-react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

import { useEffect, useState } from "react";
import { getUserAfterLogin } from "../utils/supabase/getUserAfterLogin";

import options from "@/utils/data/weightData";

export default function Page() {
  const [User, setUser] = useState(null);
  const [Appointment, setAppointment] = useState(0);
  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleAppointmentClick = (i: number, e: Event) => {
    setAppointment(i)
    console.log(i)
    console.log(e)
    onOpen();
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

      console.log(user);
    };

    fetchData();
  }, []);

  return (
    <main className="h-screen">
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
              <div id="appointments">
                <div id="title">
                  <h2 className="text-2xl font-bold text-center mb-3">Appointments</h2>
                </div>
                {/*map over a 5 index array, listing out a date, apointment address, and random doctor name for each*/}
                <div className="flex flex-row">
                  <div className="w-1/3">Date</div>
                  <div className="w-1/3">Address</div>
                  <div className="w-1/3">Doctor</div>
                </div>
                {Array.from({ length: 5 }, (_, i) => (
                  <div className="flex flex-row border-y-1 my-3 p-2 bg-yellow-200 bg-opacity-70 rounded-lg hover:bg-opacity-40 cursor-pointer" key={i} onClick = {(e) => handleAppointmentClick(i, e)}>
                    <div className="w-1/3">12/3/2024</div>
                    <div className="w-1/3">123 Doctor Rd.</div>
                    <div className="w-1/3">Dr. John Smith</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col ml-2">
              <div id="Doctors">
                <div id="title">
                  <h2 className="text-2xl font-bold text-center mb-3">Doctors</h2>
                </div>
                {/*map over a 5 index array, listing out doctors and their phone numbers*/}
                <div className="flex flex-row">
                  <div className="w-1/2">Doctor</div>
                  <div className="w-1/2">Phone</div>
                </div>
                {Array.from({ length: 5 }, (_, i) => (
                  <div className="flex flex-row border-y-1 my-3 p-2  rounded-lg" key={i}>
                    <div className="w-1/2">Dr. John Smith</div>
                    <div className="w-1/2">123-456-7890</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="text-black">
                <div className="flex flex-row">
                  <div className="w-1/3">Date</div>
                  <div className="w-1/3">Address</div>
                  <div className="w-1/3">Doctor</div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
