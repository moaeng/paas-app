import { useEffect, useState } from "react"
import axios from "axios"
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

  return (
    <div className="NoteList">
      <form className="NoteForm" onSubmit={handleFormSubmit}>
        <section>
          <input
            className="Title"
            placeholder="Add title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </section>
        <section>
          <textarea
            className="Content"
            placeholder="Write something!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </section>
        <div className="ButtonContainer">
          <button className="Button" type="submit">
            Save
          </button>
        </div>
      </form>
      <div className="Notes">
        {notes.map((note) => (
          <div className="Note" key={note.id}>
            <h1>{note.title}</h1>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notelist
