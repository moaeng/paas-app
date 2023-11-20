const express = require("express"),
  path = require("path")
const dotenv = require("dotenv"),
  { Client } = require("pg")
const bodyParser = require("body-parser")
dotenv.config()

const client = new Client({
  connectionString: process.env.PGURI,
})

client.connect()

const app = express(),
  port = process.env.PORT || 3000

app.use(bodyParser.json())

app.get("/api", async (_request, response) => {
  console.log("GET request received")
  const { rows } = await client.query("SELECT * FROM notes")
  response.send(rows)
})

app.post("/api/notes", async (request, response) => {
  console.log("POST request received")
  const { title, content } = request.body
  const insertQuery = "INSERT INTO notes (title, content) VALUES ($1, $2)"
  const values = [title, content]

  try {
    await client.query(insertQuery, values)
    response.status(201).send("Note added successfully")
  } catch (error) {
    response.status(500).send("Error adding the note")
  }
})

app.delete("/api/notes/:id", async (request, response) => {
  console.log("DELETE request received")
  const noteId = request.params.id
  const deleteQuery = "DELETE FROM notes WHERE id = $1"
  const values = [noteId]

  try {
    await client.query(deleteQuery, values)
    response.status(204).send()
  } catch (error) {
    console.error("Error deleting the note:", error)
    response.status(500).send("Error deleting the note: " + error.message)
  }
})

app.put("/api/notes/:id", async (request, response) => {
  console.log("PUT request received")
  const noteId = request.params.id
  const { title, content } = request.body
  const updateQuery = "UPDATE notes SET title = $1, content = $2 WHERE id = $3"
  const values = [title, content, noteId]

  try {
    await client.query(updateQuery, values)
    response.status(200).send("Note updated successfully")
  } catch (error) {
    console.error("Error updating the note:", error)
    response.status(500).send("Error updating the note: " + error.message)
  }
})

app.use(express.static(path.join(path.resolve(), "public")))

app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`)
})
