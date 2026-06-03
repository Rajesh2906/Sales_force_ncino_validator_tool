/**
 * nCino Forms Gen Syntax Validator
 * Validates and parses nCino Forms Gen conditional syntax with {{}} blocks
 * 
 * Format:
 * {{IF="(A) OR (B AND C)"}}
 * {{COND="A" FIELD="Object.Field_c" IS="value"}}
 * {{SHOW_ROUTE}}
 * {{ENDIF}}
 */

// Valid field types in nCino
const VALID_FIELD_TYPES = [
  'Text', 'Email', 'Phone', 'Number', 'Date', 'DateTime', 'Time',
  'Boolean', 'Checkbox', 'Radio', 'Dropdown', 'MultiSelect',
  'TextArea', 'Rich Text', 'Currency', 'Percent', 'URL'
]

// Valid block types
const VALID_BLOCK_TYPES = ['IF', 'COND', 'SHOW_ROUTE', 'ENDIF', 'SHOW_FIELD', 'HIDE_FIELD']

// Valid operators for conditions
const VALID_OPERATORS = ['IS', 'IS_NOT', 'CONTAINS', 'NOT_CONTAINS', 'GREATER_THAN', 'LESS_THAN']

// Valid properties for fields
const VALID_PROPERTIES = [
  'type', 'required', 'readonly', 'hidden', 'maxlength', 'minlength',
  'pattern', 'format', 'default', 'placeholder', 'description',
  'helptext', 'validation', 'options', 'depends', 'conditional'
]

/**
 * Main validation function for nCino Forms Gen syntax
 */
export function validateSyntax(input) {
  if (!input || input.trim().length === 0) {
    return []
  }

  const errors = []
  const lines = input.split('\n')
  let blockStack = [] // Track nested blocks
  let conditionMap = new Map() // Track condition definitions
  let ifLogic = null // Current IF block logic

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()

    // Skip empty lines and comments
    if (trimmed.length === 0 || trimmed.startsWith('//')) {
      return
    }

    // Check for block syntax {{...}}
    if (trimmed.startsWith('{{') && trimmed.endsWith('}}')) {
      const blockContent = trimmed.slice(2, -2).trim()
      const blockErrors = validateBlock(blockContent, lineIndex + 1, line, conditionMap, blockStack)
      errors.push(...blockErrors)

      // Track block types for nesting validation
      if (blockContent.startsWith('IF=')) {
        blockStack.push({ type: 'IF', line: lineIndex + 1 })
        ifLogic = blockContent
      } else if (blockContent.startsWith('COND=')) {
        if (blockStack.length === 0 || blockStack[blockStack.length - 1].type !== 'IF') {
          errors.push({
            severity: 'error',
            message: 'COND block must be inside an IF block',
            line: lineIndex + 1,
            context: line,
            suggestion: 'Place COND blocks after {{IF="..."}} and before {{ENDIF}}'
          })
        }
      } else if (blockContent === 'ENDIF') {
        if (blockStack.length === 0) {
          errors.push({
            severity: 'error',
            message: 'ENDIF without matching IF block',
            line: lineIndex + 1,
            context: line,
            suggestion: 'Ensure each ENDIF has a matching IF'
          })
        } else {
          blockStack.pop()
        }
      } else if (blockContent === 'SHOW_ROUTE' || blockContent === 'SHOW_FIELD' || blockContent === 'HIDE_FIELD') {
        if (blockStack.length === 0) {
          errors.push({
            severity: 'warning',
            message: `${blockContent} block should be inside an IF block`,
            line: lineIndex + 1,
            context: line,
            suggestion: `Place ${blockContent} after conditions and before ENDIF`
          })
        }
      }
    } else if (trimmed.length > 0) {
      // Non-block lines should be plain text or field definitions
      if (!trimmed.startsWith('//') && !trimmed.match(/^[A-Za-z_][\w\s]+$/)) {
        errors.push({
          severity: 'warning',
          message: 'Line does not follow nCino syntax format',
          line: lineIndex + 1,
          context: line,
          suggestion: 'Use {{BLOCK_TYPE="value"}} format or plain text descriptions'
        })
      }
    }
  })

  // Check for unclosed blocks
  if (blockStack.length > 0) {
    errors.push({
      severity: 'error',
      message: `${blockStack.length} unclosed block(s) - missing ENDIF`,
      line: lines.length,
      suggestion: 'Add {{ENDIF}} to close all IF blocks'
    })
  }

  return errors
}

/**
 * Validate a single block (content inside {{...}})
 */
function validateBlock(blockContent, lineNumber, originalLine, conditionMap, blockStack) {
  const errors = []

  // Check for proper spacing and braces
  if (!/^[A-Z_]+=/.test(blockContent)) {
    errors.push({
      severity: 'error',
      message: 'Invalid block format - must start with BLOCK_TYPE=',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Use format: {{BLOCK_TYPE="value" PROPERTY="value"}}'
    })
    return errors
  }

  // Parse block type and content
  const blockMatch = blockContent.match(/^([A-Z_]+)(.*)$/)
  if (!blockMatch) {
    errors.push({
      severity: 'error',
      message: 'Could not parse block type',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Ensure block starts with a valid block type'
    })
    return errors
  }

  const blockType = blockMatch[1]
  const blockParams = blockMatch[2]

  // Validate IF blocks
  if (blockType === 'IF') {
    const ifErrors = validateIFBlock(blockParams, lineNumber, originalLine)
    errors.push(...ifErrors)
  }
  // Validate COND blocks
  else if (blockType === 'COND') {
    const condErrors = validateCONDBlock(blockParams, lineNumber, originalLine, conditionMap)
    errors.push(...condErrors)
  }
  // Validate SHOW_ROUTE, SHOW_FIELD, HIDE_FIELD
  else if (['SHOW_ROUTE', 'SHOW_FIELD', 'HIDE_FIELD'].includes(blockType)) {
    // These blocks are typically standalone or with optional parameters
    if (blockParams.trim().length > 0 && !blockParams.trim().startsWith('=')) {
      errors.push({
        severity: 'warning',
        message: `${blockType} block has unexpected parameters`,
        line: lineNumber,
        context: originalLine,
        suggestion: `${blockType} is typically used without parameters or as {{${blockType}}}}`
      })
    }
  }
  // Validate ENDIF
  else if (blockType === 'ENDIF') {
    if (blockParams.trim().length > 0) {
      errors.push({
        severity: 'error',
        message: 'ENDIF should not have any parameters',
        line: lineNumber,
        context: originalLine,
        suggestion: 'Use exactly: {{ENDIF}}'
      })
    }
  }
  // Unknown block type
  else {
    errors.push({
      severity: 'error',
      message: `Unknown block type: ${blockType}`,
      line: lineNumber,
      context: originalLine,
      suggestion: `Valid types: ${VALID_BLOCK_TYPES.join(', ')}`
    })
  }

  return errors
}

/**
 * Validate IF block logic
 */
function validateIFBlock(params, lineNumber, originalLine) {
  const errors = []

  // Should have format: ="(A) OR (B AND C)"
  const ifMatch = params.match(/^=\s*"(.+)"$/)
  if (!ifMatch) {
    errors.push({
      severity: 'error',
      message: 'Invalid IF block format - must be: IF="(logic)"',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Example: {{IF="(A) OR (B AND C)"}}'
    })
    return errors
  }

  const logic = ifMatch[1]

  // Check for balanced parentheses
  if (!isBalancedParentheses(logic)) {
    errors.push({
      severity: 'error',
      message: 'Unbalanced parentheses in IF logic',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Ensure all opening ( have matching closing )'
    })
  }

  // Check for valid operators (OR, AND)
  const operators = logic.match(/\b(OR|AND)\b/g) || []
  const validOperators = operators.every(op => ['OR', 'AND'].includes(op))
  if (!validOperators) {
    errors.push({
      severity: 'error',
      message: 'Invalid operator in IF logic - only OR and AND are allowed',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Use only: (A) OR (B) AND (C) NOT (A OR B)'
    })
  }

  // Check for valid condition references (A, B, C, etc.)
  const conditions = logic.match(/[A-Z]/g) || []
  if (conditions.length === 0) {
    errors.push({
      severity: 'error',
      message: 'IF logic must reference conditions (A, B, C, etc.)',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Example: {{IF="(A) OR (B AND C)"}}'
    })
  }

  // Check for extra spaces (strict format)
  if (logic !== logic.replace(/\s+/g, ' ').trim()) {
    const hasExtraSpaces = /\s{2,}/.test(logic)
    const hasMissingSpaces = /\)\s*\(/.test(logic) // )( without space
    
    if (hasExtraSpaces) {
      errors.push({
        severity: 'error',
        message: 'Extra spaces detected in IF logic',
        line: lineNumber,
        context: originalLine,
        suggestion: 'Remove extra spaces. Example: {{IF="(A) OR (B)"}}'
      })
    }
  }

  return errors
}

/**
 * Validate COND block
 */
function validateCONDBlock(params, lineNumber, originalLine, conditionMap) {
  const errors = []

  // Parse COND parameters: COND="A" FIELD="..." IS="..."
  const condMatch = params.match(/^=\s*"([A-Z])"\s+FIELD=\s*"([^"]+)"\s+IS=\s*"([^"]*)"$/)
  
  if (!condMatch) {
    errors.push({
      severity: 'error',
      message: 'Invalid COND block format',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Format: {{COND="A" FIELD="Object.Field_c" IS="value"}}'
    })
    return errors
  }

  const [, condId, fieldName, value] = condMatch

  // Validate condition ID is a single letter
  if (!/^[A-Z]$/.test(condId)) {
    errors.push({
      severity: 'error',
      message: `Invalid condition ID: "${condId}" - must be a single letter (A-Z)`,
      line: lineNumber,
      context: originalLine,
      suggestion: 'Use single letters: A, B, C, etc.'
    })
  }

  // Validate field name format (Object.Field_c)
  if (!fieldName.match(/^[a-zA-Z_]\w+\.[a-zA-Z_]\w+_c$/)) {
    errors.push({
      severity: 'error',
      message: `Invalid field name: "${fieldName}"`,
      line: lineNumber,
      context: originalLine,
      suggestion: 'Format: ObjectName.FieldName_c (e.g., LLC_BI_Loanc.LLC_BIisRenewal_c)'
    })
  }

  // Validate that IS has a value
  if (value.length === 0) {
    errors.push({
      severity: 'error',
      message: 'IS clause cannot be empty',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Provide a value: IS="true" or IS="some value"'
    })
  }

  // Track condition for use in IF logic
  conditionMap.set(condId, { field: fieldName, value: value, line: lineNumber })

  return errors
}

/**
 * Check if parentheses are balanced
 */
function isBalancedParentheses(str) {
  let count = 0
  for (const char of str) {
    if (char === '(') count++
    else if (char === ')') count--
    if (count < 0) return false
  }
  return count === 0
}

/**
 * Validate a single field line (legacy format support)
 */
function validateFieldLine(fieldLine, lineNumber, originalLine) {
  const errors = []
  const fieldContent = fieldLine.replace('Field:', '').trim()

  if (!fieldContent) {
    errors.push({
      severity: 'error',
      message: 'Field definition is empty',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Use format: Field: FieldName | Type: TypeName | ...'
    })
    return errors
  }

  const parts = fieldContent.split('|').map(p => p.trim())
  const fieldName = parts[0]

  if (!fieldName) {
    errors.push({
      severity: 'error',
      message: 'Field name is missing',
      line: lineNumber,
      context: originalLine,
      suggestion: 'First part should be the field name'
    })
    return errors
  }

  // Validate field name format
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
    errors.push({
      severity: 'error',
      message: `Invalid field name: "${fieldName}"`,
      line: lineNumber,
      context: originalLine,
      suggestion: 'Field names must start with a letter or underscore, contain only alphanumeric characters and underscores'
    })
  }

  // Parse properties
  const properties = {}
  const usedProperties = new Set()

  for (let i = 1; i < parts.length; i++) {
    const prop = parts[i]
    const [propName, propValue] = prop.split(':').map(p => p.trim())

    if (!propName || !propValue) {
      errors.push({
        severity: 'warning',
        message: `Malformed property: "${prop}"`,
        line: lineNumber,
        context: originalLine,
        suggestion: 'Use format: PropertyName: Value'
      })
      continue
    }

    const propNameLower = propName.toLowerCase()

    // Check for duplicate properties
    if (usedProperties.has(propNameLower)) {
      errors.push({
        severity: 'warning',
        message: `Duplicate property: "${propName}"`,
        line: lineNumber,
        context: originalLine
      })
    }
    usedProperties.add(propNameLower)

    // Validate Type property
    if (propNameLower === 'type') {
      if (!VALID_FIELD_TYPES.includes(propValue)) {
        errors.push({
          severity: 'error',
          message: `Invalid field type: "${propValue}"`,
          line: lineNumber,
          context: originalLine,
          suggestion: `Valid types: ${VALID_FIELD_TYPES.slice(0, 5).join(', ')}, ...`
        })
      }
      properties.type = propValue
    }

    // Validate Required property
    else if (propNameLower === 'required') {
      if (!['true', 'false'].includes(propValue.toLowerCase())) {
        errors.push({
          severity: 'error',
          message: `Invalid Required value: "${propValue}"`,
          line: lineNumber,
          context: originalLine,
          suggestion: 'Required must be "true" or "false"'
        })
      }
    }

    // Validate MaxLength property
    else if (propNameLower === 'maxlength') {
      if (isNaN(propValue)) {
        errors.push({
          severity: 'error',
          message: `Invalid MaxLength value: "${propValue}"`,
          line: lineNumber,
          context: originalLine,
          suggestion: 'MaxLength must be a number'
        })
      }
    }

    // Validate Pattern property
    else if (propNameLower === 'pattern') {
      try {
        new RegExp(propValue)
      } catch (e) {
        errors.push({
          severity: 'error',
          message: `Invalid regex pattern: "${propValue}"`,
          line: lineNumber,
          context: originalLine,
          suggestion: 'Ensure the pattern is a valid regular expression'
        })
      }
    }
  }

  // Check if Type is defined
  if (!properties.type) {
    errors.push({
      severity: 'warning',
      message: 'Field Type is not specified',
      line: lineNumber,
      context: originalLine,
      suggestion: 'Add "Type: FieldType" property'
    })
  }

  return errors
}

/**
 * Parse syntax into structured data
 */
export function parseSyntax(input) {
  if (!input || input.trim().length === 0) {
    return { type: 'empty', sections: [], conditions: [], ifBlocks: [] }
  }

  // Detect if this is new format (with {{}}) or legacy format
  const isNewFormat = /\{\{/.test(input)

  if (isNewFormat) {
    return parseConditionalSyntax(input)
  } else {
    return parseLegacySyntax(input)
  }
}

/**
 * Parse new conditional format with {{}} blocks
 */
function parseConditionalSyntax(input) {
  const lines = input.split('\n')
  const ifBlocks = []
  const conditions = new Map()
  let currentIfBlock = null

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    if (trimmed.startsWith('{{') && trimmed.endsWith('}}')) {
      const blockContent = trimmed.slice(2, -2).trim()

      // Parse IF block
      if (blockContent.startsWith('IF=')) {
        const match = blockContent.match(/^IF=\s*"(.+)"$/)
        if (match) {
          currentIfBlock = {
            logic: match[1],
            conditions: [],
            actions: [],
            lineNumber: index + 1
          }
          ifBlocks.push(currentIfBlock)
        }
      }

      // Parse COND block
      else if (blockContent.startsWith('COND=')) {
        const match = blockContent.match(/^COND=\s*"([A-Z])"\s+FIELD=\s*"([^"]+)"\s+IS=\s*"([^"]*)"$/)
        if (match && currentIfBlock) {
          const [, condId, fieldName, value] = match
          const condition = {
            id: condId,
            field: fieldName,
            value: value,
            lineNumber: index + 1
          }
          currentIfBlock.conditions.push(condition)
          conditions.set(condId, condition)
        }
      }

      // Parse action blocks
      else if (['SHOW_ROUTE', 'SHOW_FIELD', 'HIDE_FIELD'].includes(blockContent)) {
        if (currentIfBlock) {
          currentIfBlock.actions.push({
            type: blockContent,
            lineNumber: index + 1
          })
        }
      }

      // ENDIF
      else if (blockContent === 'ENDIF') {
        currentIfBlock = null
      }
    }
  })

  return {
    type: 'conditional',
    ifBlocks: ifBlocks,
    conditions: Array.from(conditions.values())
  }
}

/**
 * Parse legacy format (Section: Field:)
 */
function parseLegacySyntax(input) {
  const sections = []
  const lines = input.split('\n')
  let currentSection = null

  lines.forEach(line => {
    const trimmed = line.trim()

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//')) {
      return
    }

    // Parse Section
    if (trimmed.startsWith('Section:')) {
      const sectionName = trimmed.replace('Section:', '').trim()
      currentSection = {
        name: sectionName,
        fields: []
      }
      sections.push(currentSection)
    }

    // Parse Field
    else if (trimmed.startsWith('Field:') && currentSection) {
      const fieldContent = trimmed.replace('Field:', '').trim()
      const parts = fieldContent.split('|').map(p => p.trim())
      
      const fieldName = parts[0]
      const field = {
        name: fieldName,
        required: false,
        readonly: false,
        hidden: false
      }

      // Parse properties
      for (let i = 1; i < parts.length; i++) {
        const [propName, propValue] = parts[i].split(':').map(p => p.trim())
        const propNameLower = propName.toLowerCase()

        switch (propNameLower) {
          case 'type':
            field.type = propValue
            break
          case 'required':
            field.required = propValue.toLowerCase() === 'true'
            break
          case 'readonly':
            field.readonly = propValue.toLowerCase() === 'true'
            break
          case 'hidden':
            field.hidden = propValue.toLowerCase() === 'true'
            break
          case 'maxlength':
            field.maxLength = propValue
            break
          case 'minlength':
            field.minLength = propValue
            break
          case 'pattern':
            field.pattern = propValue
            break
          case 'format':
            field.format = propValue
            break
          case 'default':
            field.default = propValue
            break
          case 'placeholder':
            field.placeholder = propValue
            break
          case 'description':
            field.description = propValue
            break
          case 'helptext':
            field.helpText = propValue
            break
          default:
            break
        }
      }

      currentSection.fields.push(field)
    }
  })

  return {
    type: 'legacy',
    sections: sections
  }
}
