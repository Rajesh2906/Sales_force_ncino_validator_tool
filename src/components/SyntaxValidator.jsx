import { useState } from 'react'
import { validateSyntax } from '../utils/ncynosyntaxValidator'
import ErrorList from './ErrorList'
import '../styles/SyntaxValidator.css'

export default function SyntaxValidator({ syntax, setSyntax, errors, setErrors }) {
  const [validating, setValidating] = useState(false)

  const handleChange = (e) => {
    const value = e.target.value
    setSyntax(value)
  }

  const handleValidate = () => {
    setValidating(true)
    setTimeout(() => {
      const validationErrors = validateSyntax(syntax)
      setErrors(validationErrors)
      setValidating(false)
    }, 300)
  }

  const handleClear = () => {
    setSyntax('')
    setErrors([])
  }

  const handleExample = () => {
    const exampleSyntax = `{{IF="(A) OR (B AND C) OR (B AND D) OR (B AND E) OR (B AND F) OR (B AND G) OR (A AND H)"}}
{{COND="A" FIELD="LLC_BI_Loanc.LLC_BIisRenewal_c" IS="false"}}
{{COND="B" FIELD="LLC_BI_Loanc.LLC_BIisRenewal_c" IS="true"}}
{{COND="C" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Approval / Loan Committee"}}
{{COND="D" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Post Closing Review"}}
{{COND="E" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Booked"}}
{{COND="F" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Final Review"}}
{{COND="G" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Underwriting"}}
{{COND="H" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Qualification"}}
{{SHOW_ROUTE}}
{{ENDIF}}`
    
    setSyntax(exampleSyntax)
    setErrors([])
  }

  return (
    <div className="syntax-validator">
      <div className="validator-header">
        <h2>nCino Syntax Editor</h2>
        <div className="header-actions">
          <button className="btn btn-example" onClick={handleExample} title="Load example syntax">
            <span className="icon">📋</span> Example
          </button>
          <button className="btn btn-validate" onClick={handleValidate} disabled={validating || !syntax.trim()}>
            <span className="icon">✓</span> {validating ? 'Validating...' : 'Validate'}
          </button>
          <button className="btn btn-clear" onClick={handleClear} disabled={!syntax.trim()}>
            <span className="icon">✕</span> Clear
          </button>
        </div>
      </div>

      <div className="editor-section">
        <textarea
          value={syntax}
          onChange={handleChange}
          placeholder="Paste your nCino Forms Gen syntax here..."
          className="syntax-editor"
          spellCheck="false"
        />
      </div>

      <div className="error-section">
        <div className="error-header">
          <h3>
            <span className="icon">⚠️</span>
            Validation Results
            {errors.length > 0 && (
              <span className="error-count">{errors.length} issue{errors.length !== 1 ? 's' : ''}</span>
            )}
          </h3>
        </div>
        <ErrorList errors={errors} syntax={syntax} />
      </div>
    </div>
  )
}
