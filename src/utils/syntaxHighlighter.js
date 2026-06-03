/**
 * Syntax Highlighter for nCino Forms Gen
 * Provides color-coded display of syntax elements
 */

export const SYNTAX_COLORS = {
  section: '#667eea',
  field: '#764ba2',
  property: '#059669',
  value: '#0c4a6e',
  error: '#dc2626',
  warning: '#d97706'
}

export function highlightSyntax(code) {
  if (!code) return ''

  let highlighted = code
    // Highlight Section declarations
    .replace(/^(Section:)/gm, `<span class="syntax-section">$1</span>`)
    // Highlight Field declarations
    .replace(/^(  Field:)/gm, `<span class="syntax-field">$1</span>`)
    // Highlight property names
    .replace(/\|\s*([A-Za-z]+):/g, `| <span class="syntax-property">$1</span>:`)

  return highlighted
}

export function getSyntaxRules() {
  return [
    {
      pattern: /^Section:\s*\w+$/m,
      type: 'section',
      description: 'Section declaration'
    },
    {
      pattern: /^\s*Field:\s*\w+/m,
      type: 'field',
      description: 'Field definition'
    },
    {
      pattern: /\w+:\s*[\w\.\-@]+/g,
      type: 'property',
      description: 'Property definition'
    },
    {
      pattern: /Type:\s*(Text|Email|Phone|Number|Date|DateTime|Time|Boolean|Checkbox|Radio|Dropdown|MultiSelect|TextArea|Rich Text|Currency|Percent|URL)/,
      type: 'type',
      description: 'Field type'
    }
  ]
}

export function analyzeComplexity(input) {
  const lines = input.split('\n')
  const sections = lines.filter(l => l.trim().startsWith('Section:')).length
  const fields = lines.filter(l => l.trim().startsWith('Field:')).length
  const properties = lines.filter(l => l.includes(':')).length

  return {
    sections,
    fields,
    properties,
    totalLines: lines.length,
    complexity: sections + fields + properties
  }
}

export function getValidationStats(errors) {
  return {
    total: errors.length,
    errors: errors.filter(e => e.severity === 'error').length,
    warnings: errors.filter(e => e.severity === 'warning').length,
    info: errors.filter(e => e.severity === 'info').length,
    valid: errors.length === 0
  }
}
