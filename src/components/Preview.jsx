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
          <h2>Human-Readable Format</h2>
        </div>
        <div className="preview-empty">
          <p className="empty-icon">📄</p>
          <p>Your syntax will be visualized here</p>
        </div>
      </div>
    )
  }

  if (!parsedData) {
    return (
      <div className="preview">
        <div className="preview-header">
          <h2>Human-Readable Format</h2>
        </div>
        <div className="preview-error">
          <p>Unable to parse syntax. Please check your input.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="preview">
      <div className="preview-header">
        <h2>Human-Readable Format</h2>
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
        {parsedData.type === 'conditional' && (
          <ConditionalPreview data={parsedData} />
        )}
        {parsedData.type === 'legacy' && (
          <LegacyPreview data={parsedData} />
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

function ConditionalPreview({ data }) {
  return (
    <div className="conditional-preview">
      <div className="info-banner">
        <span className="icon">⚙️</span>
        <span>Conditional Logic Format</span>
      </div>

      {data.ifBlocks && data.ifBlocks.length > 0 ? (
        <div className="if-blocks-list">
          {data.ifBlocks.map((block, idx) => (
            <div key={idx} className="if-block-card">
              <div className="if-logic">
                <h4>IF Logic (Line {block.lineNumber})</h4>
                <code className="logic-code">{block.logic}</code>
              </div>

              {block.conditions && block.conditions.length > 0 && (
                <div className="conditions-section">
                  <h4>Conditions</h4>
                  <div className="conditions-list">
                    {block.conditions.map((cond, condIdx) => (
                      <div key={condIdx} className="condition-item">
                        <div className="cond-id">
                          <span className="id-badge">{cond.id}</span>
                        </div>
                        <div className="cond-details">
                          <div className="detail-row">
                            <span className="label">Field:</span>
                            <code>{cond.field}</code>
                          </div>
                          <div className="detail-row">
                            <span className="label">Value:</span>
                            <code>{cond.value}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {block.actions && block.actions.length > 0 && (
                <div className="actions-section">
                  <h4>Actions</h4>
                  <div className="actions-list">
                    {block.actions.map((action, actIdx) => (
                      <div key={actIdx} className="action-item">
                        <span className="action-badge">{action.type}</span>
                        <span className="action-desc">Line {action.lineNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="preview-error">
          <p>No IF blocks found in the syntax</p>
        </div>
      )}
    </div>
  )
}

function LegacyPreview({ data }) {
  return (
    <div className="sections-list">
      {data.sections && data.sections.length > 0 ? (
        data.sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="section-card">
            <div className="section-title">
              <h3>{section.name}</h3>
              <span className="field-count">{section.fields?.length || 0} fields</span>
            </div>
            
            {section.fields && section.fields.length > 0 && (
              <div className="fields-list">
                {section.fields.map((field, fieldIdx) => (
                  <div key={fieldIdx} className="field-item">
                    <div className="field-name">
                      <strong>{field.name}</strong>
                      {field.required && <span className="required-badge">Required</span>}
                    </div>
                    
                    <div className="field-properties">
                      {field.type && (
                        <div className="property">
                          <span className="prop-label">Type:</span>
                          <span className="prop-value type-badge">{field.type}</span>
                        </div>
                      )}
                      
                      {field.format && (
                        <div className="property">
                          <span className="prop-label">Format:</span>
                          <span className="prop-value">{field.format}</span>
                        </div>
                      )}
                      
                      {field.maxLength && (
                        <div className="property">
                          <span className="prop-label">Max Length:</span>
                          <span className="prop-value">{field.maxLength}</span>
                        </div>
                      )}
                      
                      {field.pattern && (
                        <div className="property">
                          <span className="prop-label">Pattern:</span>
                          <span className="prop-value regex-badge">{field.pattern}</span>
                        </div>
                      )}
                      
                      {field.description && (
                        <div className="property">
                          <span className="prop-label">Description:</span>
                          <span className="prop-value">{field.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!section.fields || section.fields.length === 0 && (
              <div className="no-fields">
                <p>No fields defined in this section</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="preview-error">
          <p>No valid sections found in the syntax</p>
        </div>
      )}
    </div>
  )
}
