import { useState } from 'react'
import './App.css'
import SyntaxValidator from './components/SyntaxValidator'
import Preview from './components/Preview'
import ncinoLogo from './assets/ncino.png'

function App() {
  const [syntax, setSyntax] = useState('')
  const [errors, setErrors] = useState([])

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={ncinoLogo} alt="nCino Logo" className="header-logo" style={{ height: '50px' }} />
          <h3 style={{ margin: 0, fontSize: '18px' }}> Forms Gen Syntax Validator</h3>
          {/* <p>Validate and visualize nCino Forms Gen syntax</p> */}
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
