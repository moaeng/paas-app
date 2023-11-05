import { useEffect, useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import "./NoteList.scss"

function Notelist() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/api")
        setNotes(response.data)
      } catch (error) {
        console.error("Error fetching notes:", error)
      }
    }

    fetchNotes()
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post("/api/notes", { title, content })
      const response = await axios.get("/api")
      setNotes(response.data)
      setTitle("")
      setContent("")
    } catch (error) {
      console.error("Error adding a note:", error)
    }
  }

  const handleDeleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    )
    if (!confirmDelete) {
      return // User canceled the delete operation
    }

    try {
      await axios.delete(`/api/notes/${id}`)
      const updatedNotes = notes.filter((note) => note.id !== id)
      setNotes(updatedNotes)
    } catch (error) {
      console.error("Error deleting the note:", error)
    }
  }

  return (
    <div className="NoteList">
      <form className="NoteForm" onSubmit={handleFormSubmit}>
        <input
          className="Title"
          placeholder="Add title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="Content"
          placeholder="Write something!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="ButtonContainer">
          <button className="Button" type="submit">
            Save
          </button>
        </div>
      </form>
      <div className="Notes">
        {notes.map((note) => (
          <div className="Note" key={note.id}>
            <div className="NoteHeader">
              <h1>{note.title}</h1>
              <div
                className="IconButton"
                onClick={() => handleDeleteNote(note.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notelist
