import { useState, useEffect } from "react"
import { ref, push, set, onValue } from "firebase/database"
import { db } from "./firebase"
import "./App.css"

export default function App() {
  const [text, setText] = useState("")
  const [data, setData] = useState([])

  const sendData = () => {
    if (!text.trim()) return
    const newRef = push(ref(db, "messages"))
    set(newRef, { value: text, timestamp: Date.now() })
    setText("")
  }

  useEffect(() => {
    const messagesRef = ref(db, "messages")
    onValue(messagesRef, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        const entries = Object.values(val).sort((a, b) => b.timestamp - a.timestamp)
        setData(entries)
      } else setData([])
    })
  }, [])

  return (
    <div className="container">
      <header className="header">
        <h1>My Firebase App</h1>
        <p>Basic realtime database demo</p>
      </header>
      <main>
        <div className="input-group">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter data..."
          />
          <button onClick={sendData}>Send</button>
        </div>
        <div className="data">
          {data.map((d, i) => (
            <div key={i} className="item">
              {new Date(d.timestamp).toLocaleTimeString()}: {d.value}
            </div>
          ))}
        </div>
      </main>
      <footer>
        <p>© {new Date().getFullYear()} Firebase React Skeleton</p>
      </footer>
    </div>
  )
}
