import '../styles/ErrorList.css'

export default function ErrorList({ errors, syntax }) {
  if (errors.length === 0) {
    if (!syntax.trim()) {
      return (
        <div className="error-list empty">
          <p>No syntax to validate yet</p>
        </div>
      )
    }
    return (
      <div className="error-list success">
        <div className="success-message">
          <span className="icon">✓</span>
          <p>Great! No syntax errors found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="error-list">
      {errors.map((error, index) => (
        <div key={index} className={`error-item error-${error.severity}`}>
          <div className="error-header">
            <span className={`error-badge error-${error.severity}`}>
              {error.severity.toUpperCase()}
            </span>
            <span className="error-message">{error.message}</span>
          </div>
          
          {error.line !== undefined && (
            <div className="error-details">
              <span className="detail">Line {error.line}</span>
              {error.column !== undefined && <span className="detail">Col {error.column}</span>}
            </div>
          )}

          {error.suggestion && (
            <div className="error-suggestion">
              <strong>Suggestion:</strong> {error.suggestion}
            </div>
          )}

          {error.context && (
            <div className="error-context">
              <code>{error.context}</code>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
