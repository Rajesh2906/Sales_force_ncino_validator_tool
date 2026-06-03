# ✅ ENHANCED VALIDATOR - NCINO CONDITIONAL FORMAT SUPPORT

## 🎯 What Changed

Your nCino Forms Gen Syntax Validator has been **significantly enhanced** to support the official nCino conditional syntax format with `{{}}` blocks!

---

## 📋 New Features Added

### 1. **Official nCino Syntax Support** ✨
- Full support for `{{IF="..."}}` blocks
- `{{COND="..."}}` condition definitions
- `{{SHOW_ROUTE}}`, `{{SHOW_FIELD}}`, `{{HIDE_FIELD}}` actions
- `{{ENDIF}}` block closure

### 2. **Advanced Validation** 🔍
- Strict format checking (braces, quotes, spacing)
- Balanced parentheses validation
- Boolean logic validation (AND/OR operators)
- Field name format checking (Object.Field_c)
- Block nesting validation
- Unmatched block detection

### 3. **Dual Format Support** 🔀
- **New Format:** Conditional blocks with `{{}}`
- **Legacy Format:** Section/Field format (still supported)
- **Auto-Detection:** Automatically detects which format you're using

### 4. **Enhanced Preview** 👁️
- Displays IF logic with proper formatting
- Shows all conditions with their field names
- Highlights condition IDs (A, B, C, etc.)
- Shows action blocks and what they do
- Color-coded components

### 5. **Better Error Messages** 🎯
- Specific error for missing braces
- Explanation for unbalanced parentheses
- Suggestions for invalid operators
- Field format requirements
- Exact position and context

---

## 📁 Files Modified

```
✏️ src/utils/ncynosyntaxValidator.js
   • Updated validateSyntax() - New block validation
   • Added validateBlock() - Block format checking
   • Added validateIFBlock() - IF logic validation
   • Added validateCONDBlock() - Condition validation
   • Added isBalancedParentheses() - Parenthesis checking
   • Updated parseSyntax() - Dual format support
   • Added parseConditionalSyntax() - Conditional format parser
   • Added parseLegacySyntax() - Legacy format parser

✏️ src/components/Preview.jsx
   • Added ConditionalPreview() - New conditional display
   • Added LegacyPreview() - Legacy format display
   • Updated parsedData handling - Format detection
   • Added IF block visualization
   • Added condition display with IDs

✏️ src/components/SyntaxValidator.jsx
   • Updated handleExample() - New example syntax

✏️ src/styles/Preview.css
   • Added .conditional-preview styles
   • Added .if-blocks-list styling
   • Added .condition-item styling
   • Added .actions-list styling
   • Added .info-banner for format indicator

📄 NCINO_SYNTAX_FORMAT.md
   • Complete documentation of nCino syntax
   • Format specifications and rules
   • Common errors and fixes
   • Advanced examples
   • Quick reference guide
```

---

## 🎯 Example: New Format

### Input
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

### Output (Preview)
```
⚙️ Conditional Logic Format

IF Logic (Line 1)
(A) OR (B AND C) OR (B AND D) OR (B AND E) OR (B AND F) OR (B AND G) OR (A AND H)

Conditions
[A] Field: LLC_BI_Loanc.LLC_BIisRenewal_c
    Value: false

[B] Field: LLC_BI_Loanc.LLC_BIisRenewal_c
    Value: true

[C] Field: LLC_BI_Loanc.LLC_BIStage_c
    Value: Approval / Loan Committee

... (continues for D, E, F, G, H)

Actions
✓ SHOW_ROUTE (Line 10)
```

---

## ✅ Validation Features

### Errors Detected (🔴 Critical)

| Error | Example | Fix |
|-------|---------|-----|
| Missing braces | `IF="(A)"` | `{{IF="(A)"}}` |
| Missing quotes | `{{IF=(A)}}` | `{{IF="(A)"}}` |
| Unbalanced parens | `{{IF="(A"}}` | `{{IF="(A)"}}` |
| Invalid operator | `{{IF="(A) XOR (B)"}}` | `{{IF="(A) OR (B)"}}` |
| COND without IF | `{{COND="A" ...}}` | Wrap in IF/ENDIF |
| ENDIF without IF | `{{ENDIF}}` (alone) | Add matching IF |
| Wrong field format | `IS="LLC_BIisRenewal"` | Use `Object.Field_c` |
| Extra spaces | `(A)  OR  (B)` | Single space: `(A) OR (B)` |

### Format Requirements

```
✅ CORRECT FORMAT:
{{IF="(A) OR (B AND C)"}}
{{COND="A" FIELD="Object.Field_c" IS="value"}}
{{SHOW_ROUTE}}
{{ENDIF}}

❌ INCORRECT FORMAT:
{{IF="(A) OR (B AND C)"}}  <- Missing quotes
{{ IF="(A) OR (B AND C)" }} <- Extra spaces
{{COND=A FIELD="..." IS=""}} <- Missing quotes on ID
{{COND="A"  FIELD="..."}}   <- Double space
{{COND="A" FIELD="Field_c"}} <- Missing Object prefix
```

---

## 🔄 How the Validator Works Now

```
Input: nCino Syntax (with or without {{}})
   ↓
Format Detection: Is it conditional or legacy?
   ↓
If Conditional Format:
   ├─ Validate braces {{ }}
   ├─ Validate quotes "..."
   ├─ Validate IF logic (AND/OR/parens)
   ├─ Validate each COND block
   ├─ Validate nesting (IF...ENDIF)
   └─ Return errors list
   ↓
If Legacy Format:
   ├─ Validate sections
   ├─ Validate fields
   └─ Return errors list
   ↓
Parse: Convert to structured data
   ↓
Preview: Display human-readable format
   ↓
Output: Show validation results + visual preview
```

---

## 📚 Documentation

### New Documentation File
📖 **NCINO_SYNTAX_FORMAT.md** - Complete guide to the nCino format including:
- Format structure and rules
- Detailed syntax for each block type
- Complete examples
- Common errors and fixes
- Validation specifications
- Advanced use cases

### Existing Documentation
All existing documentation still applies:
- QUICKSTART.md - Quick start guide
- SETUP_GUIDE.md - Installation & usage
- VALIDATION_RULES.md - General validation rules
- UI_GUIDE.md - UI/design documentation

---

## 🚀 Quick Start with New Format

1. **Open the app:** `npm run dev`
2. **Click "Example" button** - Loads new conditional format example
3. **See the preview** - Shows IF logic, conditions, and actions
4. **Try your own** - Paste any nCino conditional syntax
5. **Click Validate** - Get detailed error messages if needed

---

## 🎨 Visual Improvements

### Conditional Format Display
- **Color-coded condition IDs** - Each condition shown with letter badge
- **Field information** - Shows object and field names clearly
- **Value display** - Shows what value each condition checks for
- **Action blocks** - Shows what happens when condition is true
- **Info banner** - Identifies format type (Conditional vs Legacy)

### Error Highlighting
- **Line numbers** - Exact location of error
- **Error type** - What went wrong
- **Suggestion** - How to fix it
- **Context** - The problematic line shown

---

## 💡 Key Improvements

### 1. Strict Format Validation
- Every brace must be present
- Every quote must be matched
- Spacing must be exact
- No exceptions

### 2. Logic Validation
- Parentheses must be balanced
- Only AND/OR operators allowed
- All referenced conditions must exist
- No undefined variables

### 3. Field Validation
- Must follow `Object.Field_c` pattern
- Must end with `_c` (custom field)
- Must contain valid characters

### 4. Block Structure Validation
- IF must have matching ENDIF
- COND must be inside IF
- Blocks must be properly nested
- No orphaned blocks

---

## ✨ What You Can Do Now

### ✅ Validate Complex Logic
```
{{IF="(A) OR (B AND C) OR (D AND E AND F)"}}
```

### ✅ Check Many Conditions
```
{{COND="A" ... }}
{{COND="B" ... }}
{{COND="C" ... }}
... up to Z
```

### ✅ Visualize Structure
- See logic in human-readable format
- View all conditions with their fields
- Understand the flow

### ✅ Get Specific Errors
- Know exactly what's wrong
- Get suggestions to fix it
- See line numbers

---

## 🔍 Testing the New Format

### Test Case 1: Valid Syntax
Copy the example from the "Example" button - should show ✓ Valid

### Test Case 2: Missing Braces
```
IF="(A) OR (B)"    ← Remove {{ }}
Should show: "Invalid block format"
```

### Test Case 3: Unbalanced Parens
```
{{IF="(A) OR (B"}}    ← Missing )
Should show: "Unbalanced parentheses"
```

### Test Case 4: Extra Spaces
```
{{IF="(A)  OR  (B)"}}    ← Double spaces
Should show: "Extra spaces detected"
```

### Test Case 5: Invalid Field
```
{{COND="A" FIELD="Field_c" IS="value"}}    ← Missing Object
Should show: "Invalid field name"
```

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| Validation Rules Added | 20+ |
| Error Checks | 15+ |
| Supported Block Types | 6 |
| Operator Support | 2 (AND, OR) |
| Condition IDs | 26 (A-Z) |
| Files Modified | 4 |
| New Documentation | 1 |

---

## 🎯 Next Steps

1. **Test with examples:**
   - Click "Example" button
   - Click "Validate"
   - See the conditional preview

2. **Try your own syntax:**
   - Paste nCino conditional code
   - Click "Validate"
   - Review errors and suggestions

3. **Read documentation:**
   - Open NCINO_SYNTAX_FORMAT.md
   - Review format specifications
   - Study examples

4. **Validate your forms:**
   - Use for real nCino development
   - Catch errors before deployment
   - Understand your logic

---

## 🏆 Summary

Your validator now supports:
- ✅ Official nCino conditional format
- ✅ Strict validation with detailed errors
- ✅ Beautiful visual preview
- ✅ Auto-detection of format type
- ✅ Comprehensive documentation
- ✅ Advanced error reporting

**Ready to validate nCino forms at a professional level!** 🚀

---

**Last Updated:** June 3, 2026
**Version:** 2.0 (Conditional Format Support)
