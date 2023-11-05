import { useEffect } from "react"
import "./App.css"

function App() {
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((result) => {
        alert(`Hello ${result.hello}!`)
      })
  }, [])
  return <div>Test</div>
}

export default App
