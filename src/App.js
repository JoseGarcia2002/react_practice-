import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'

// const Display = ({counter}) => <div>{counter}</div>

// const Button = (props) => {
//   return (
//     <button onClick={props.onClick}>{props.text}</button>
//   )
// }

// const App = () => {
//   const [counter, setCounter] = useState(0)

//   const incrementCounter = () => {
//     setCounter(counter + 1)
//     console.log(counter)
//   }

//   const zeroCounter = () => {
//     setCounter(0)
//     console.log(counter)
//   }

//   const decrementCounter = () => {
//     setCounter(counter - 1)
//     console.log(counter)
//   }

//   return (
//     <div>
//       <Display counter={counter}/>
//       <Button onClick={incrementCounter} text="plus"/>
//       <Button onClick={decrementCounter} text="minus"/>
//       <Button onClick={zeroCounter} text="zero"/>
//     </div>
//   )
// }

// const History = (props) => {
//   if (props.allClicks.length === 0) {
//     return (
//       <div>the app is used by pressing the buttons</div>
//     )
//   }
//   return (
//     <div>button press history: {props.allClicks.join(" ")}</div>
//   )
// }

// const App = () => {
//   const [left, setLeft] = useState(0)
//   const [right, setRight] = useState(0)
//   const [allClicks, setAll] = useState([])

//   const handleLeftClick = () => {
//     setAll(allClicks.concat("L"))
//     setLeft(left + 1)
//   }

//   const handleRightClick = () => {
//     setAll(allClicks.concat("R"))
//     setRight(right + 1)
//   }

//   return (
//     <div>
//       {left}
//       <Button onClick={handleLeftClick} text="left"/>
//       <Button onClick={handleRightClick} text="right"/>
//       {right}
//       <History allClicks={allClicks}/>
//     </div>
//   )
// }

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note")
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log("effect")
    noteService
      .getAll()
      .then(initialNotes => {
        console.log("promise fulfilled")
        setNotes(initialNotes)
      })
  }, [])
  console.log("render", notes.length, "notes")

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange}/>
          <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App;
