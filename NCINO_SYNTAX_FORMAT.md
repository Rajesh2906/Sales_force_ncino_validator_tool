# nCino Forms Gen Conditional Syntax Format

## Overview

The validator now supports the **official nCino Forms Gen conditional syntax** with `{{}}` block format.

## Format Structure

### Basic Template

```
{{IF="(LOGIC)"}}
{{COND="A" FIELD="Object.Field_c" IS="value"}}
{{COND="B" FIELD="Object.Field_c" IS="value"}}
{{SHOW_ROUTE}}
{{ENDIF}}
```

## Detailed Syntax

### 1. IF Block

Defines the conditional logic using boolean expressions.

**Format:**
```
{{IF="(A) OR (B AND C)"}}
```

**Rules:**
- Must start with `IF="`
- Must end with `"`
- Logic must be enclosed in quotes
- Use parentheses `()` for grouping
- Use `AND` and `OR` operators
- Reference conditions by letter: A, B, C, etc.

**Valid Examples:**
```
{{IF="(A)"}}
{{IF="(A) OR (B)"}}
{{IF="(A) AND (B)"}}
{{IF="(A) OR (B AND C)"}}
{{IF="(A) OR (B AND C) OR (B AND D) OR (B AND E)"}}
```

**Invalid Examples:**
```
{{IF="A"}}                              ❌ Missing parentheses
{{IF="(A) XOR (B)"}}                   ❌ Invalid operator (use AND/OR)
{{IF=(A)}}                              ❌ Missing quotes
{{IF="(A)}}                             ❌ Mismatched quotes
{{IF="(A) OR B"}}                       ❌ B not in parentheses
```

### 2. COND Block

Defines individual conditions that are referenced in IF logic.

**Format:**
```
{{COND="A" FIELD="Object.Field_c" IS="value"}}
```

**Components:**
- `COND="X"` - Single letter (A-Z) identifying the condition
- `FIELD="..."` - Salesforce field path (Object.Field_c)
- `IS="..."` - Value to compare against

**Rules:**
- Condition ID must be a single capital letter
- Field must follow `ObjectName.FieldName_c` pattern
- Field must end with `_c` (custom field indicator)
- IS value can be empty or contain any text
- All three components are required
- Exact spacing: one space between components

**Valid Examples:**
```
{{COND="A" FIELD="LLC_BI_Loanc.LLC_BIisRenewal_c" IS="false"}}
{{COND="B" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Approval / Loan Committee"}}
{{COND="C" FIELD="Account.Industry_c" IS="Banking"}}
{{COND="D" FIELD="Case.Priority_c" IS="High"}}
```

**Invalid Examples:**
```
{{COND=A FIELD="..." IS="..."}}        ❌ Condition ID missing quotes
{{COND="A" FIELD=LLC_BI_Loanc.LLC_BIisRenewal_c IS="false"}} ❌ Field missing quotes
{{COND="A" FIELD="LLC_BI_Loan" IS="false"}} ❌ Field doesn't end with _c
{{COND="A" FIELD="...Loan_c"}}         ❌ Missing IS clause
{{COND="AB" FIELD="..." IS="..."}}     ❌ Condition ID too long
{{COND="A"  FIELD="..." IS="..."}}     ❌ Extra space between COND and FIELD
```

### 3. SHOW_ROUTE Block

Specifies action to take when condition is true.

**Format:**
```
{{SHOW_ROUTE}}
```

**Rules:**
- No parameters required
- Must be inside an IF/ENDIF block
- Appears after all COND blocks

### 4. SHOW_FIELD / HIDE_FIELD Blocks (Optional)

Field-specific visibility controls.

**Format:**
```
{{SHOW_FIELD}}
{{HIDE_FIELD}}
```

### 5. ENDIF Block

Closes an IF block.

**Format:**
```
{{ENDIF}}
```

**Rules:**
- Must match each IF block
- No parameters allowed
- Must be exactly: `{{ENDIF}}`

---

## Complete Example

```
{{IF="(A) OR (B AND C) OR (B AND D) OR (B AND E) OR (B AND F) OR (B AND G) OR (A AND H)"}}
{{COND="A" FIELD="LLC_BI_Loanc.LLC_BIisRenewal_c" IS="false"}}
{{COND="B" FIELD="LLC_BI_Loanc.LLC_BIisRenewal_c" IS="true"}}
{{COND="C" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Approval / Loan Committee"}}
{{COND="D" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Post Closing Review"}}
{{COND="E" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Booked"}}
{{COND="F" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Final Review"}}
{{COND="G" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Underwriting"}}
{{COND="H" FIELD="LLC_BI_Loanc.LLC_BIStage_c" IS="Qualification"}}
{{SHOW_ROUTE}}
{{ENDIF}}
```

**What this means:**
- Show the route if:
  - (A) Is NOT renewal, OR
  - (B AND C) Is renewal AND at Approval stage, OR
  - (B AND D) Is renewal AND at Post Closing Review, OR
  - ... (continues for other stages)

---

## Validation Rules

The validator checks for:

### Syntax Errors (🔴 Critical)

1. **Missing braces** - `IF="..."` instead of `{{IF="..."}}`
2. **Missing quotes** - `IF=(A)` instead of `IF="(A)"`
3. **Unbalanced parentheses** - `{{IF="(A) OR (B"}}` 
4. **Invalid operators** - Using anything other than AND/OR
5. **Missing condition references** - `{{IF="()"}}` with no letters
6. **COND without IF** - Placing conditions outside IF block
7. **ENDIF without IF** - Closing block that was never opened
8. **Unclosed blocks** - Missing ENDIF
9. **Extra spaces** - `{{IF="(A)  OR  (B)"}}` (double spaces)
10. **Invalid field names** - Not matching `Object.Field_c` pattern
11. **Duplicate properties** - Multiple values for same parameter

### Format Errors (🟠 Warnings)

1. Unexpected parameters on simple blocks
2. Blocks outside proper nesting
3. Unrecognized block types

---

## Format Specification (Strict)

### Exact Format Requirements

| Component | Format | Example |
|-----------|--------|---------|
| IF Logic | `{{IF="(...)"}}` | `{{IF="(A) OR (B)"}}` |
| Condition | `{{COND="X" FIELD="..." IS="..."}}` | `{{COND="A" FIELD="Obj.Field_c" IS="val"}}` |
| Actions | `{{SHOW_ROUTE}}` or `{{SHOW_FIELD}}` | `{{SHOW_ROUTE}}` |
| Close | `{{ENDIF}}` | `{{ENDIF}}` |

### Spacing Rules

- **Between blocks:** One line (or no line)
- **Inside blocks:** Exactly one space between properties
- **Operators:** One space before and after: `A OR B` (not `AOR B`)
- **No extra spaces inside:** `{{IF="(A)"}}` (not `{{ IF = "(A)" }}`)

### Character Set

- **Condition IDs:** A-Z (capital letters only)
- **Operators:** AND, OR (capitals only)
- **Field syntax:** Alphanumeric + underscore + dots
- **Values:** Any characters (including spaces)

---

## Common Errors & Fixes

### Error 1: Missing Braces
```
❌ IF="(A) OR (B AND C)"
✅ {{IF="(A) OR (B AND C)"}}
```

### Error 2: Missing Quotes
```
❌ {{IF=(A) OR (B)}}
✅ {{IF="(A) OR (B)"}}
```

### Error 3: Unbalanced Parentheses
```
❌ {{IF="(A) OR (B"}}
✅ {{IF="(A) OR (B)"}}
```

### Error 4: Invalid Operator
```
❌ {{IF="(A) XOR (B)"}}
✅ {{IF="(A) OR (B)"}}
```

### Error 5: Invalid Field Format
```
❌ {{COND="A" FIELD="LLC_BILoan" IS="value"}}
✅ {{COND="A" FIELD="LLC_BI_Loanc.LLC_BIisRenewal_c" IS="value"}}
```

### Error 6: Extra Spaces
```
❌ {{IF="(A)  OR  (B)"}}        (double spaces)
✅ {{IF="(A) OR (B)"}}           (single spaces)
```

### Error 7: COND without IF
```
❌ {{COND="A" FIELD="..." IS="..."}}
   {{ENDIF}}
✅ {{IF="(A)"}}
   {{COND="A" FIELD="..." IS="..."}}
   {{ENDIF}}
```

---

## Testing Your Syntax

1. **Load Example:** Click the "Example" button in the validator
2. **Paste Your Syntax:** Into the left editor
3. **Click Validate:** Check for errors
4. **Review Results:**
   - ✅ Valid: No errors shown
   - 🔴 Errors: See line numbers and suggestions
   - 🟠 Warnings: Non-critical issues

---

## Tips for Writing Good nCino Syntax

### ✅ Do This

- Use clear condition IDs (A, B, C in order)
- Keep IF logic readable with proper grouping
- Document complex logic in comments
- Test with the validator before deployment
- Use consistent field naming conventions

### ❌ Don't Do This

- Mix extra spaces or formatting variations
- Use lowercase operators (AND/or is invalid)
- Create unbalanced parentheses
- Reference conditions that aren't defined
- Leave blocks unclosed

---

## Advanced Examples

### Example 1: Simple AND Logic
```
{{IF="(A) AND (B)"}}
{{COND="A" FIELD="Account.Active_c" IS="true"}}
{{COND="B" FIELD="Account.Type_c" IS="Customer"}}
{{SHOW_ROUTE}}
{{ENDIF}}
```

### Example 2: Complex OR with AND Groups
```
{{IF="(A) OR (B AND C) OR (B AND D)"}}
{{COND="A" FIELD="Opportunity.Stage_c" IS="Closed Won"}}
{{COND="B" FIELD="Opportunity.Probability_c" IS="75"}}
{{COND="C" FIELD="Opportunity.Type_c" IS="New Business"}}
{{COND="D" FIELD="Opportunity.Type_c" IS="Renewal"}}
{{SHOW_ROUTE}}
{{ENDIF}}
```

### Example 3: Multiple Conditions with Same Field
```
{{IF="(A) OR (B) OR (C)"}}
{{COND="A" FIELD="Case.Status_c" IS="New"}}
{{COND="B" FIELD="Case.Status_c" IS="In Progress"}}
{{COND="C" FIELD="Case.Status_c" IS="Pending Review"}}
{{SHOW_FIELD}}
{{ENDIF}}
```

---

## Quick Reference

### Allowed Operators
- `AND` (both must be true)
- `OR` (at least one must be true)

### Allowed Block Types
- `IF` - Start conditional block
- `COND` - Define condition
- `SHOW_ROUTE` - Show entire route/section
- `SHOW_FIELD` - Show specific field
- `HIDE_FIELD` - Hide specific field
- `ENDIF` - End conditional block

### Required Fields
- `IF` block: `logic` in quotes
- `COND` block: `id`, `FIELD`, and `IS` properties
- `ENDIF`: No properties

---

## Support

For syntax validation errors:
1. Check this document for the specific error
2. Review the error message in the validator
3. Compare your syntax with examples above
4. Ensure exact spacing and braces

**The validator will show you:**
- Exact line number of error
- What's wrong
- How to fix it
- Code context

---

*Last Updated: June 2026*
*For official nCino documentation, visit: https://www.ncino.com/*
