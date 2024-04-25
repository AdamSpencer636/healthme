"use client";
import React from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
	DateRangePicker,
	Textarea,
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
import { getUserAfterLogin } from "../../utils/supabase/getUserAfterLogin";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import {
	getNotes,
	insertNote,
	updateNote,
	deleteNote,
} from "../../utils/supabase/Notes";

export default function NotesPage() {
	// put today's date as a string in YYY-MM-DD in a variable
	const today = new Date();
	const todayString = today.toISOString().split("T")[0];

	const [User, setUser] = React.useState(null);
	const [date, setDate] = React.useState({
		start: parseDate(todayString),
		end: parseDate(todayString),
	});
	const [updated, setUpdated] = React.useState(false);
	const [notes, setNotes] = React.useState([]);
	const [noteId, setNoteId] = React.useState(null);
	const [editNoteText, setEditNoteText] = React.useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();

	

	const retrieveNotes = async () => {
		const notes = await getNotes(date.start, date.end, User[0].id);
		setNotes(notes);
		setUpdated(!updated);
		console.log(notes);
	};

	const handleLogOut = () => {
		localStorage.removeItem("userid");
		setUser(null);
		window.location.href = "/login";
	};

	const submitNote = () => {
		const note = document.getElementById("note").value;
		const date = new Date();
		const noteData = {
			Note: note,
			date_created: date,
			userid: User[0].id,
		};
        insertNote(noteData);
        //clear the note textarea
        document.getElementById("note").value = "";
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
    
    React.useEffect(() => {
		const getUser = async () => {
			const User = localStorage.getItem("userid");
			const user = await getUserAfterLogin(User);
            setUser(user);
		};
		getUser();
	}, [updated]);

	return (
		<div className="w-full h-screen">
			<Navbar className="bg-inherit">
				<NavbarBrand>
					<p className="font-bold text-inherit">HealthMe</p>
				</NavbarBrand>
				{!User ? (
					<NavbarContent justify="end">
						<NavbarItem className="hidden lg:flex">
							<Link href="#">Login</Link>
						</NavbarItem>
						<NavbarItem>
							<Button
								as={Link}
								color="primary"
								href="#"
								variant="flat"
							>
								Sign Up
							</Button>
						</NavbarItem>
					</NavbarContent>
				) : (
					<NavbarContent justify="end">
						<NavbarItem className="hidden lg:flex text-white">
							<Link href="#">
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
			<div className="flex justify-center items-center p-5">
				<h1 className="text-4xl font-bold">Notes Page</h1>
			</div>
			<div className="flex justify-center items-center py-4 flex-col">
				<Textarea
					id="note"
					placeholder="Enter your note here"
					className="w-1/4 pb-2"
					size="lg"
					variant="bordered"
				/>
				<div>
					<Button color="success" onClick={() => submitNote()}>
						Submit Note
					</Button>
				</div>
			</div>
			<div className="flex justify-center items-center pb-2">
				<DateRangePicker
					className=" min-w-10 w-1/4"
					label="Select Date Range for Notes"
					value={date}
					onChange={setDate}
				/>
			</div>
			<div className="flex justify-center items-center">
				<Button color="primary" onClick={() => retrieveNotes()}>
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
								<CardFooter>
									<Button
										color="success"
										variant="flat"
										onClick={() => {
											setNoteId(note.id);
											onOpen();
										}}
									>
										Edit
									</Button>
									<Button
										color="error"
										variant="flat"
										onClick={() => {
											setNoteId(note.id);
											deleteNoteFromList(noteId);
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
			<Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalBody className="text-black">
								<div>
									<h2 className="text-2xl font-bold text-center mb-3">
										Edit Note
									</h2>
								</div>
								<div>
									<Textarea
										id="editNote"
										placeholder="Enter your note here"
										className="w-full"
										size="lg"
										variant="bordered"
										value={editNoteText}
										onValueChange={setEditNoteText}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										setEditNoteText("");
										onClose();
									}}
								>
									Close
								</Button>
								<Button
									color="primary"
									variant="flat"
									onPress={(e) => {
										editNote(noteId, editNoteText);
										setEditNoteText("");
										onClose();
									}}
								>
									Submit
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
