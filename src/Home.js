import Notes from "./Notes"
import NoteView from "./NoteView"
import { useState, useEffect } from "react"
import { useMediaQuery } from "react-responsive"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

const Home = () => {
    const tablet = useMediaQuery({ maxWidth: "900px" })

    const [notes, setNotes] = useState([])
    const [selectedNote, setSelectedNote] = useState({})
    const [showNotesBox, setShowNotesBox] = useState(false)

    useEffect(() => {
        async function fetchData() {
            let response = await fetch("http://localhost:5000/notes")
            let notes = await response.json()
            setNotes(notes)
        }
        fetchData()
    }, [notes])

    const onCreateNote = () => {
        createNote({ title: "", text: "" })
    }

    const onDeleteNote = async (id) => {
        await fetch("http://localhost:5000/delete_note", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
    }

    const createNote = async (note) => {
        console.log("Creating note")
        const response = await fetch(`http://localhost:5000/create_note`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: note.title,
                text: note.text,
            }),
        })
        const json = await response.json()
        const newNote = json.note
        setSelectedNote(newNote)
    }

    const updateNote = async (note) => {
        if (!note.id) {
            createNote(note)
        } else {
            console.log(selectedNote)
            const response = await fetch(
                `http://localhost:5000/update_note/${note.id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: note.title,
                        text: note.text,
                        pinned: note.pinned,
                    }),
                }
            )
            const json = await response.json()
            const updatedNote = json.note
            console.log("Now updating")

            setSelectedNote(updatedNote)
        }
    }

    const onTogglePin = async (note) => {
        console.log("toggling", note)
        const response = await fetch(
            `http://localhost:5000/update_note/${note.id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pinned: !note.pinned }),
            }
        )
    }
    const getNoteById = async (id) => {
        const response = await fetch(`http://localhost:5000/note/${id}`)
        const json = await response.json()
        return json.note
    }
    const onSelectNote = async (id) => {
        if (tablet) setShowNotesBox(false)
        const note = await getNoteById(id)
        setSelectedNote(note)
    }

    return (
        <div>
            <button
                className="toggleNotesBoxButton"
                onClick={() => {
                    if (tablet) {
                        setShowNotesBox(!showNotesBox)
                    }
                }}
            >
                <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
            </button>
            <NoteView note={selectedNote} updateNote={updateNote} />
            <Notes
                notes={notes}
                onSelectNote={onSelectNote}
                onCreateNote={onCreateNote}
                onDeleteNote={onDeleteNote}
                onTogglePin={onTogglePin}
                showNotesBox={showNotesBox}
                tablet={tablet}
            />
        </div>
    )
}

export default Home