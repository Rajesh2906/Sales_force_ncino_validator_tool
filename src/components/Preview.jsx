import { useMemo } from 'react'
import { parseSyntax } from '../utils/ncynosyntaxValidator'
import '../styles/Preview.css'

export default function Preview({ syntax, errors }) {
  const parsedData = useMemo(() => {
    try {
      return parseSyntax(syntax)
    } catch (e) {
      return null
    }
  }, [syntax])

  if (!syntax.trim()) {
    return (
      <div className="preview">
        <div className="preview-header">
          <h2>Preview</h2>
        </div>
        <div className="preview-content">
          <p>Your syntax will be displayed here</p>
        </div>
      </div>
    )
  }

  if (!parsedData) {
    return (
      <div className="preview">
        <div className="preview-header">
          <h2>Preview</h2>
        </div>
        <div className="preview-content">
          <p>Unable to parse syntax</p>
        </div>
      </div>
    )
  }

  return (
    <div className="preview">
      <div className="preview-header">
        <h2>Preview</h2>
        <div className="preview-status">
          {errors.length === 0 && syntax.trim() && (
            <span className="status-badge status-success">✓ Valid</span>
          )}
          {errors.length > 0 && (
            <span className="status-badge status-error">✗ {errors.length} Error{errors.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="preview-content">
        {parsedData.type === 'single-line' && (
          <SingleLinePreview data={parsedData} />
        )}
        {parsedData.type === 'empty' && (
          <div className="preview-error">
            <p>No content to display</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SingleLinePreview({ data }) {
  return (
    <div className="single-line-preview">
      {data.blocks && data.blocks.map((block, idx) => (
        <div key={idx}>
          {block.displayBlock}
        </div>
      ))}
    </div>
  )
}
