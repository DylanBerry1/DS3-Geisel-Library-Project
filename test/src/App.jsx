// import { useState, useEffect } from "react"
// import { ref, push, set, onValue } from "firebase/database"
// import { db } from "./firebase"
import "./App.css"
export function NavBar() {
  return (
    <nav>
      <li>Home</li>
      <li>Visualisations</li>
    </nav>
  )
}
export default function Test() {
  return (
    <div className="container">
      <nav className="navbar">
        <li className="navElement">Home</li>
        <li className="navElement">Visualisations</li>
      </nav>
      <h1 className="header">Geisel People Counter</h1>
      <p className="item"> There are currently (NUMBER HERE) people in Geisel.</p>
      <p className="item"> There have been (NUMBER HERE) people in Geisel over the past hour.</p>
      <p className="item"> There have been (NUMBER HERE) people in Geisel today.</p>
    </div>
  )
}

// export default function App() {
  // const [text, setText] = useState("")
  // const [data, setData] = useState([])

  // const sendData = () => {
  //   if (!text.trim()) return
  //   const newRef = push(ref(db, "messages"))
  //   set(newRef, { value: text, timestamp: Date.now() })
  //   setText("")
  // }

  // useEffect(() => {
  //   const messagesRef = ref(db, "messages")
  //   onValue(messagesRef, (snapshot) => {
  //     const val = snapshot.val()
  //     if (val) {
  //       const entries = Object.values(val).sort((a, b) => b.timestamp - a.timestamp)
  //       setData(entries)
  //     } else setData([])
  //   })
  // }, [])
  
  // return (
  //   <h1 className="header">YOOOO</h1>
  // )
  
  // return (
  //   <div className="container">
  //     <header className="header">
  //       <h1>My Firebase App</h1>
  //       <p>Basic realtime database demo</p>
  //     </header>
  //     {/* <main>
  //       <div className="input-group">
  //         <input
  //           value={text}
  //           onChange={(e) => setText(e.target.value)}
  //           placeholder="Enter data..."
  //         />
  //         <button onClick={sendData}>Send</button>
  //       </div>
  //       <div className="data">
  //         {data.map((d, i) => (
  //           <div key={i} className="item">
  //             {new Date(d.timestamp).toLocaleTimeString()}: {d.value}
  //           </div>
  //         ))}
  //       </div>
  //     </main>
  //     <footer>
  //       <p>© {new Date().getFullYear()} Firebase React Skeleton</p>
  //     </footer> */}
  //   </div>
//   )
// }
