"use client";

import React, { useState, useEffect, Fragment } from "react";
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
	Spinner,
} from "@nextui-org/react";
import { FileDown } from "lucide-react";
import { getNotes, updateNote, deleteNote } from "../../utils/supabase/Notes";
import { getUserAfterLogin } from "../../utils/supabase/getUserAfterLogin";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Invoice from "../../utils/data/report";



const DisplayNotesPage = () => {
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

	const retrieveNotes = async (ignore: boolean) => {
		const notes = await getNotes(date.start, date.end, User[0].id);
		notes.sort(
			(a, b) =>
				new Date(a.date_created).getTime() -
				new Date(b.date_created).getTime()
		);
		setNotes(notes);
		setUpdated(!updated);
		if (ignore) return;
		if (notes.length === 0) {
			sendWarningToast("No notes found for the selected date range");
		} else {
			sendSuccessToast("Notes retrieved successfully");
		}
		console.log(notes);
	};

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


	const handleDateChange = (newDate) => {
		setDate(newDate);
	};

	const deleteNoteFromList = async () => {
		const notesLength = notes.length;
		const status = await deleteNote(noteId);
		if (status !== true) {
			sendErrorToast(status);
			return;
		}
		sendSuccessToast("Note deleted successfully");
	};

	const editNote = async (noteId, note) => {
		const noteData = {
			Note: note,
			id: noteId,
		};
		await updateNote(noteData);
		await retrieveNotes(true);
		setUpdated(!updated);
	};

	useEffect(() => {
		const fetchData = async () => {
			// Wait for SSR to finish
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Get user info from getUserAfterLogin()
			const userId = localStorage.getItem("userid");
			const user = await getUserAfterLogin(userId);
			// Set the user state
			setUser(user);
			console.log(user);
		};
		fetchData();
	}, [updated]);

	return (
		<>
			{User ? (
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
					<div className="flex justify-center items-center space-x-3">
						<Button
							color="primary"
							onClick={() => {
								retrieveNotes(false);
							}}
						>
							Get Notes
						</Button>
						<Link href="/create-notes">
							<Button color="success">Create Note</Button>
						</Link>
						<PDFDownloadLink
							document={
								<Invoice
									notes={notes}
									dateStart={date.start.toString().split("T")[0]}
									dateEnd={date.end.toString().split("T")[0]}
									user={User}
								/>
							}
							fileName="report.pdf"
						>
							<Button color="primary" variant="flat">
								<FileDown color="white" />
							</Button>
						</PDFDownloadLink>
					</div>
					<div className="flex flex-col w-full justify-center items-center p-5">
						<ul className="w-1/4 max-h-1/3 overflow-y-scroll">
							{notes?.map((note) => (
								<li key={note.id} className="p-2">
									<Card>
										<CardHeader className="flex gap-3">
											<div className="flex flex-col">
												<p className="text-md">
													{note.date_created}
												</p>
											</div>
										</CardHeader>
										<Divider />
										<CardBody>
											<p>{note.Note}</p>
										</CardBody>
										<Divider />
										<CardFooter className="space-x-3">
											<Button
												color="success"
												variant="flat"
												onClick={() => {}}
											>
												Edit
											</Button>
											<Button
												color="danger"
												variant="flat"
												onClick={() => {
													setNoteId(note.id);
													deleteNoteFromList();
												}}
											>
												Delete
											</Button>
										</CardFooter>
									</Card>
								</li>
							))}
						</ul>
					</div>
				</div>
			) : (
				<div className="flex justify-center items-center h-screen">
					{" "}
					<h1 className="text-4xl font-bold">
						<Spinner size="lg" />
					</h1>{" "}
				</div>
			)}
			<ToastContainer />
		</>
	);
};

export default DisplayNotesPage;


