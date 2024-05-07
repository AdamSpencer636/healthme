'use client'

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DateRangePicker,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { getNotes, updateNote, deleteNote } from "../../utils/supabase/Notes";
import { getUserAfterLogin } from "../../utils/supabase/getUserAfterLogin";
import { parseDate, getLocalTimeZone } from "@internationalized/date";

const DisplayNotesPage = ({ user }) => {

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];


  const [date, setDate] = React.useState({
    start: parseDate(todayString),
    end: parseDate(todayString),
  });

  const [notes, setNotes] = useState([]);
  const [User, setUser] = React.useState(null);
  const [updated, setUpdated] = React.useState(false);
  const [noteId, setNoteId] = React.useState(null);
  const [editNoteText, setEditNoteText] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const retrieveNotes = async () => {
    const notes = await getNotes(date.start, date.end, User[0].id);
    setNotes(notes);
    setUpdated(!updated);
    console.log(notes);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const deleteNoteFromList = async () => {
     console.log(noteId);
     deleteNote(noteId);
     await retrieveNotes();
  };
  
  const editNote = async (noteId, note) => {
    const noteData = {
      Note: note,
      id: noteId,
    };
    await updateNote(noteData);
    await retrieveNotes();
    setUpdated(!updated);
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
  }, [updated]);

  return (
    <div className="w-full h-screen">
      <Navbar className="bg-inherit">
        <NavbarBrand>
          <Link href="/" className="font-bold">
            HealthMe
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color="primary" href="#" variant="flat">
              Log out
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex justify-center items-center p-5">
        <h1 className="text-4xl font-bold">Notes Page</h1>
      </div>
      <div className="flex justify-center items-center pb-2">
        <DateRangePicker
          className=" min-w-10 w-1/4"
          label="Select Date Range for Notes"
          value={date}
          onChange={handleDateChange}
        />
      </div>
      <div className="flex justify-center items-center">
        <Button color="primary" onClick={() => {}}>
          Get Notes
        </Button>
      </div>
      <div className="flex flex-col w-full justify-center items-center p-5">
        <ul className="w-1/4 max-h-1/3 overflow-y-scroll">
          {notes?.map((note) => (
            <li key={note.id} className="p-2">
              <Card>
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md">{note.date_created}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>{note.Note}</p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Button color="success" variant="flat" onClick={() => {}}>
                    Edit
                  </Button>
                  <Button color="error" variant="flat" onClick={() => {}}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DisplayNotesPage;
