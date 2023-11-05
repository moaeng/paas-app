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
  const { rows } = await client.query("SELECT * FROM notes")
  response.send(rows)
})

app.post("/api/notes", async (request, response) => {
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

app.use(express.static(path.join(path.resolve(), "public")))

app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`)
})
