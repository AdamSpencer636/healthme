// CreateNotePage.jsx

'use client'

import React, { useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
import { insertNote } from "../../utils/supabase/Notes";

const CreateNotePage = ({ user }) => {
  const [noteText, setNoteText] = useState("");

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const submitNote = () => {
    const noteData = {
      Note: noteText,
      date_created: new Date(),
      userid: user.id,
    };
    insertNote(noteData);
    setNoteText("");
  };

    return (
      <>
        <div className="h-screen flex flex-col justify-center items-center space-y-4">
          <Textarea
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Enter your note here"
            className="w-1/3"
          />
          <Button color="success" variant="ghost" onClick={submitNote}>
            Submit Note
          </Button>
        </div>
      </>
    );
};

export default CreateNotePage;
