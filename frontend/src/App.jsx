import "./App.scss"
import NoteList from "./components/NoteList"

function App() {
  return (
    <div className="App">
      <div className="Header">
        <h1 className="Heading">NotePad</h1>
      </div>
      <main>
        <NoteList />
      </main>
    </div>
  )
}

export default App
