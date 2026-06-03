import { useState } from 'react'
import './App.css'
import SyntaxValidator from './components/SyntaxValidator'
import Preview from './components/Preview'

function App() {
  const [syntax, setSyntax] = useState('')
  const [errors, setErrors] = useState([])

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>nCino Forms Gen Syntax Validator</h1>
          <p>Validate and visualize nCino Forms Gen syntax</p>
        </div>
      </header>
      
      <div className="container">
        <SyntaxValidator 
          syntax={syntax}
          setSyntax={setSyntax}
          errors={errors}
          setErrors={setErrors}
        />
        <Preview syntax={syntax} errors={errors} />
      </div>
    </div>
  )
}

export default App
