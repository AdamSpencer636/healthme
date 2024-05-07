// CreateNotePage.jsx

"use client";

import React, { useState, useEffect } from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Textarea,
	Button,
	Link,
	Spinner
} from "@nextui-org/react";
import { insertNote } from "../../utils/supabase/Notes";
import { DatePicker } from "@nextui-org/date-picker";
import {
	DateValue,
	parseDate,
	getLocalTimeZone,
} from "@internationalized/date";
import { getUserAfterLogin } from "../../utils/supabase/getUserAfterLogin";
import { useDateFormatter } from "@react-aria/i18n";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateNotePage = () => {
	const [noteText, setNoteText] = useState("");
  const [user, setUser] = useState([]);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [date, setDate] = React.useState(parseDate(todayString));

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

			//if user in null, reroute to login
			if (user.message) {
				window.location.href = "/login";
			}
		};
		fetchData();
	}, []);

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

	const handleNoteChange = (e) => {
		setNoteText(e.target.value);
	};

	const submitNote = async () => {
		if (noteText === "") {
			sendWarningToast("Please enter a note before submitting");
			return;
    }
    
    const submitdate = formatter.format(date.toDate(getLocalTimeZone()))

    console.log(submitdate)
    
		const noteData = {
			Note: noteText,
			date_created: submitdate,
			userid: user[0].id,
		};
		const submitStatus = await insertNote(noteData);
		if (submitStatus !== true) {
			sendErrorToast(submitStatus);
			return;
		}
		sendSuccessToast("Note submitted successfully");
		setNoteText("");
  };
  
  let formatter = useDateFormatter({ dateStyle: "short" });

	return (
		<>
			{user[0] ? <>
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
			<div className="h-screen flex flex-col justify-center items-center space-y-4">
				<h1 className="text-4xl font-bold">Create Note</h1>
				<div className="flex flex-col w-full justify-center items-center space-y-3">
					<Textarea
						value={noteText}
						onChange={handleNoteChange}
						placeholder="Enter your note here"
						className="w-1/3"
					/>
					<DatePicker
						className="max-w-[284px]"
						label="Date of Note"
						value={date}
						onChange={setDate}
					/>
				</div>
				<div className="space-x-3">
					<Button
						color="success"
						variant="ghost"
						onClick={submitNote}
					>
						Submit Note
					</Button>
					<Link href="/display-notes">
						<Button color="primary" variant="flat">
							View Notes
						</Button>
					</Link>
				</div>
			</div>
			<ToastContainer /> </> : <div className="w-screen h-screen flex justify-center items-center"><Spinner size="lg"/></div>}
		</>
	);
};

export default CreateNotePage;
