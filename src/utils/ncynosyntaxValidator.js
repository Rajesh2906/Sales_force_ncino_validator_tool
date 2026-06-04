/**
 * nCino Forms Gen Syntax Validator
 * Validates single-line input with {{}} blocks
 * 
 * Format:
 * {{IF="condition"}}{{COND="A" FIELD="field" IS="value"}}{{SHOW_ROUTE}}{{ENDIF}}
 * 
 * Rules:
 * - Input is single line (no newlines)
 * - Check for leading/trailing spaces
 * - No spaces between }} and {{
 * - First block must be IF
 * - Following blocks must be COND (with FIELD and IS/NOT)
 * - Before last block must be SHOW_ROUTE or HIDE_ROUTE
 * - Last block must be ENDIF
 * - Values in "" should not have leading/trailing spaces
 */

// Valid route types
const VALID_ROUTES = ['SHOW_ROUTE', 'HIDE_ROUTE']

/**
 * Main validation function - validates single line input
 */
export function validateSyntax(input) {
  if (!input) {
    return []
  }

  const errors = []

  // Check for leading space
  if (input.length > 0 && input[0] === ' ') {
    errors.push({
      severity: 'error',
      message: 'Input has leading space',
      line: 1,
      context: input,
      suggestion: 'Remove space at the beginning'
    })
  }

  // Check for trailing space
  if (input.length > 0 && input[input.length - 1] === ' ') {
    errors.push({
      severity: 'error',
      message: 'Input has trailing space',
      line: 1,
      context: input,
      suggestion: 'Remove space at the end'
    })
  }

  if (input.trim().length === 0) {
    return errors
  }

  // Extract all {{}} blocks
  const blockRegex = /\{\{[^}]*\}\}/g
  const blocks = input.match(blockRegex) || []

  if (blocks.length === 0) {
    errors.push({
      severity: 'error',
      message: 'No {{}} blocks found in input',
      line: 1,
      context: input,
      suggestion: 'Add at least IF and ENDIF blocks'
    })
    return errors
  }

  // Check for spaces between }} and {{
  const spaceBetweenBlocks = /\}\}\s+\{\{/g
  if (spaceBetweenBlocks.test(input)) {
    errors.push({
      severity: 'error',
      message: 'Space found between }} and {{',
      line: 1,
      context: input,
      suggestion: 'Use }}{{ without space'
    })
  }

  // Validate number of blocks
  if (blocks.length < 3) {
    errors.push({
      severity: 'error',
      message: `Need at least 3 blocks (IF, COND, SHOW_ROUTE/HIDE_ROUTE, ENDIF). Found ${blocks.length}`,
      line: 1,
      context: input,
      suggestion: 'Format: {{IF="..."}}{{COND="..."...}}{{SHOW_ROUTE or HIDE_ROUTE}}{{ENDIF}}'
    })
  }

  // Validate first block is IF
  if (blocks.length > 0) {
    const firstBlockContent = blocks[0].slice(2, -2).trim()
    if (!firstBlockContent.startsWith('IF=')) {
      errors.push({
        severity: 'error',
        message: 'First block must be IF',
        line: 1,
        blockIndex: 1,
        context: blocks[0],
        suggestion: 'Start with {{IF="..."}}'
      })
    }
  }

  // Validate last block is ENDIF
  if (blocks.length > 0) {
    const lastBlockContent = blocks[blocks.length - 1].slice(2, -2).trim()
    if (lastBlockContent !== 'ENDIF') {
      errors.push({
        severity: 'error',
        message: 'Last block must be ENDIF',
        line: 1,
        blockIndex: blocks.length,
        context: blocks[blocks.length - 1],
        suggestion: 'End with {{ENDIF}}'
      })
    }
  }

  // Validate second-to-last block is SHOW_ROUTE or HIDE_ROUTE
  if (blocks.length > 1) {
    const secondLastBlockContent = blocks[blocks.length - 2].slice(2, -2).trim()
    if (!VALID_ROUTES.includes(secondLastBlockContent)) {
      errors.push({
        severity: 'error',
        message: 'Second to last block must be SHOW_ROUTE or HIDE_ROUTE',
        line: 1,
        blockIndex: blocks.length - 1,
        context: blocks[blocks.length - 2],
        suggestion: 'Use {{SHOW_ROUTE}} or {{HIDE_ROUTE}}'
      })
    }
  }

  // Validate each block
  blocks.forEach((block, blockIndex) => {
    const blockErrors = validateBlock(block, blockIndex + 1, input)
    errors.push(...blockErrors)
  })

  // Validate COND blocks structure
  const condErrors = validateCondBlocksStructure(blocks)
  errors.push(...condErrors)

  return errors
}

/**
 * Validate a single block (content inside {{...}})
 */
function validateBlock(block, blockIndex, fullInput) {
  const errors = []
  const blockContent = block.slice(2, -2)

  // Check block format - must start with uppercase letters
  if (!/^\w+/.test(blockContent.trim())) {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: Invalid format`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Use format: {{KEYWORD="value"}}' 
    })
    return errors
  }

  const firstWord = blockContent.trim().split(/[\s=]/)[0]
  
  // Validate IF block
  if (firstWord === 'IF') {
    const ifErrors = validateIFBlock(blockContent, blockIndex, block)
    errors.push(...ifErrors)
  }
  // Validate COND block
  else if (firstWord === 'COND') {
    const condErrors = validateCONDBlock(blockContent, blockIndex, block)
    errors.push(...condErrors)
  }
  // Validate SHOW_ROUTE or HIDE_ROUTE
  else if (firstWord === 'SHOW_ROUTE' || firstWord === 'HIDE_ROUTE') {
    if (blockContent.trim() !== firstWord) {
      errors.push({
        severity: 'error',
        message: `Block ${blockIndex}: ${firstWord} should not have parameters`,
        line: 1,
        blockIndex: blockIndex,
        context: block,
        suggestion: `Use exactly: {{${firstWord}}}`
      })
    }
  }
  // Validate ENDIF
  else if (firstWord === 'ENDIF') {
    if (blockContent.trim() !== 'ENDIF') {
      errors.push({
        severity: 'error',
        message: `Block ${blockIndex}: ENDIF should not have parameters`,
        line: 1,
        blockIndex: blockIndex,
        context: block,
        suggestion: 'Use exactly: {{ENDIF}}'
      })
    }
  }
  // Unknown keyword
  else {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: Unknown keyword "${firstWord}"`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Valid keywords: IF, COND, SHOW_ROUTE, HIDE_ROUTE, ENDIF'
    })
  }

  return errors
}

/**
 * Validate IF block format
 */
function validateIFBlock(blockContent, blockIndex, block) {
  const errors = []

  // IF must have format: IF="value"
  const ifMatch = blockContent.match(/^IF\s*=\s*"([^"]*)"$/)
  if (!ifMatch) {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: Invalid IF format`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Format: {{IF="condition"}}'
    })
    return errors
  }

  const value = ifMatch[1]
  
  // Check for space before or after value in quotes
  if (value !== value.trim()) {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: IF value has leading or trailing space`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Remove spaces inside quotes'
    })
  }

  return errors
}

/**
 * Validate COND block format
 */
function validateCONDBlock(blockContent, blockIndex, block) {
  const errors = []

  // COND format: COND="value" FIELD="value" (IS="value" OR NOT="value")
  // Must have FIELD and either IS or NOT
  
  // Extract COND value
  const condMatch = blockContent.match(/^COND\s*=\s*"([^"]*)"\s*FIELD\s*=\s*"([^"]*)"\s*(IS|NOT)\s*=\s*"([^"]*)"$/)
  
  if (!condMatch) {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: Invalid COND format`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Format: {{COND="value" FIELD="value" IS="value"}} or {{COND="value" FIELD="value" NOT="value"}}'
    })
    return errors
  }

  const [, condValue, fieldValue, operator, operatorValue] = condMatch

  // Check COND value for spaces
  if (condValue !== condValue.trim()) {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: COND value has leading or trailing space`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Remove spaces inside quotes'
    })
  }

  // Check FIELD value for spaces
  if (fieldValue !== fieldValue.trim()) {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: FIELD value has leading or trailing space`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Remove spaces inside quotes'
    })
  }

  // Check operator value for spaces
  if (operatorValue !== operatorValue.trim()) {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: ${operator} value has leading or trailing space`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Remove spaces inside quotes'
    })
  }

  // Validate operator is IS or NOT
  if (operator !== 'IS' && operator !== 'NOT') {
    errors.push({
      severity: 'error',
      message: `Block ${blockIndex}: Invalid operator "${operator}"`,
      line: 1,
      blockIndex: blockIndex,
      context: block,
      suggestion: 'Use IS or NOT'
    })
  }

  return errors
}

/**
 * Validate that COND blocks follow IF and come before SHOW_ROUTE/HIDE_ROUTE
 */
function validateCondBlocksStructure(blocks) {
  const errors = []

  let hasIF = false
  let hasCondAfterIF = false
  let hasRouteBlock = false
  let hasEndif = false

  for (let i = 0; i < blocks.length; i++) {
    const blockContent = blocks[i].slice(2, -2).trim()
    const firstWord = blockContent.split(/[\s=]/)[0]

    if (firstWord === 'IF') {
      hasIF = true
      hasCondAfterIF = false
    } else if (firstWord === 'COND') {
      if (!hasIF) {
        errors.push({
          severity: 'error',
          message: `Block ${i + 1}: COND block must come after IF block`,
          line: 1,
          blockIndex: i + 1,
          context: blocks[i],
          suggestion: 'Place all COND blocks after IF'
        })
      }
      hasCondAfterIF = true
    } else if (firstWord === 'SHOW_ROUTE' || firstWord === 'HIDE_ROUTE') {
      if (!hasCondAfterIF) {
        errors.push({
          severity: 'error',
          message: `Block ${i + 1}: At least one COND block must exist before ${firstWord}`,
          line: 1,
          blockIndex: i + 1,
          context: blocks[i],
          suggestion: 'Add COND block(s) between IF and SHOW_ROUTE/HIDE_ROUTE'
        })
      }
      hasRouteBlock = true
    } else if (firstWord === 'ENDIF') {
      if (!hasRouteBlock) {
        errors.push({
          severity: 'error',
          message: `Block ${i + 1}: SHOW_ROUTE or HIDE_ROUTE must exist before ENDIF`,
          line: 1,
          blockIndex: i + 1,
          context: blocks[i],
          suggestion: 'Add SHOW_ROUTE or HIDE_ROUTE before ENDIF'
        })
      }
      hasEndif = true
    }
  }

  return errors
}

/**
 * Parse syntax into structured data for display
 */
export function parseSyntax(input) {
  if (!input || input.trim().length === 0) {
    return { type: 'empty', blocks: [], lineCount: 0 }
  }

  // Extract blocks
  const blockRegex = /\{\{[^}]*\}\}/g
  const blocks = input.match(blockRegex) || []

  if (blocks.length === 0) {
    return { type: 'empty', blocks: [], lineCount: 0 }
  }

  // Parse blocks
  const parsedBlocks = blocks.map((block, index) => {
    const content = block.slice(2, -2)
    const firstWord = content.trim().split(/[\s=]/)[0]
    
    return {
      index: index + 1,
      type: firstWord,
      rawContent: content,
      displayBlock: block
    }
  })

  return {
    type: 'single-line',
    blocks: parsedBlocks,
    lineCount: blocks.length,
    rawInput: input
  }
}
