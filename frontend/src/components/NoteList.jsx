import { useEffect, useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faSave, faEdit } from "@fortawesome/free-solid-svg-icons"
import "./NoteList.scss"

function Notelist() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")

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

  const handleEditClick = (noteId, title, content) => {
    setEditingNoteId(noteId)
    setEditedTitle(title)
    setEditedContent(content)
  }

  const handleSaveClick = async (noteId) => {
    try {
      await axios.put(`/api/notes/${noteId}`, {
        title: editedTitle,
        content: editedContent,
      })

      const updatedNotes = notes.map((note) => {
        if (note.id === noteId) {
          return { ...note, title: editedTitle, content: editedContent }
        }
        return note
      })

      setNotes(updatedNotes)
      setEditingNoteId(null)
    } catch (error) {
      console.error("Error updating the note:", error)
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
              <div
                className="IconButton"
                onClick={() => handleDeleteNote(note.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
              {editingNoteId === note.id ? (
                <div
                  className="IconButton"
                  onClick={() => handleSaveClick(note.id)}
                >
                  <FontAwesomeIcon icon={faSave} /> {/* Use the save icon */}
                </div>
              ) : (
                <div
                  className="IconButton"
                  onClick={() =>
                    handleEditClick(note.id, note.title, note.content)
                  }
                >
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              )}
            </div>
            {editingNoteId === note.id ? (
              <div className="Edit">
                <input
                  className="EditTitle"
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                  className="EditContent"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>
            ) : (
              <div className="NoteContent">
                <h1>{note.title}</h1>
                <p>{note.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notelist
