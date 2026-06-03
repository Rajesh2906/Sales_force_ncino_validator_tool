// VALIDATION_RULES.md
# nCino Forms Gen Syntax Validation Rules

## Overview

The nCino Syntax Validator enforces strict rules to ensure your forms syntax is correct and can be properly processed.

## File Structure Rules

### 1. Section Declaration
```
✓ Valid:
Section: CustomerInfo
Section: AddressBlock

✗ Invalid:
Section:
Section:   
section: lowercase
SECTION: UPPERCASE
Section : spaces
```

**Rules:**
- Must start with `Section:` (case-sensitive)
- Must have a non-empty section name
- Section names must be unique (warning if duplicate)
- Section names should be meaningful

### 2. Field Declaration
```
✓ Valid:
  Field: FirstName | Type: Text | Required: true
  Field: Email | Type: Email

✗ Invalid:
Field: FirstName (no indentation)
  field: lowercase (case-sensitive)
  Field: | Type: Text (missing field name)
    Field: Nested (wrong indentation)
```

**Rules:**
- Must be indented (2+ spaces)
- Must start with `Field:` (case-sensitive)
- Must follow a `Section:` declaration
- Field name must be alphanumeric + underscore only
- Field name must start with letter or underscore

## Field Name Validation

```
✓ Valid Names:
FirstName
first_name
firstName
first123
_privateField
field_2023_v2

✗ Invalid Names:
first-name (contains hyphen)
first name (contains space)
123field (starts with number)
field$ (contains special character)
field type (contains space)
```

**Pattern:** `^[a-zA-Z_][a-zA-Z0-9_]*$`

## Field Type Validation

### Valid Types
```
Text Fields:
- Text
- Email
- Phone
- URL

Numeric:
- Number
- Currency
- Percent

Date/Time:
- Date
- DateTime
- Time

Boolean:
- Boolean
- Checkbox
- Radio

Selection:
- Dropdown
- MultiSelect

Rich Content:
- TextArea
- Rich Text
```

### Examples
```
✓ Field: Email | Type: Email
✓ Field: Amount | Type: Currency
✗ Field: Name | Type: String (String not allowed)
✗ Field: Date | Type: date (case-sensitive)
```

## Property Validation

### Type Property
- **Required:** Yes (warnings if missing)
- **Format:** `Type: [ValidType]`
- **Case:** Case-sensitive
- **Example:** `Type: Email`

### Required Property
- **Format:** `Required: true` or `Required: false`
- **Case-insensitive for values:** true/false/True/False
- **Example:** `Required: true`
- **Invalid:** `Required: yes`, `Required: 1`

### Readonly Property
- **Format:** `Readonly: true` or `Readonly: false`
- **Example:** `Readonly: true`
- **Valid for:** All field types

### Hidden Property
- **Format:** `Hidden: true` or `Hidden: false`
- **Example:** `Hidden: false`
- **Valid for:** All field types

### MaxLength Property
- **Format:** `MaxLength: [Number]`
- **Must be:** Positive integer
- **Example:** `MaxLength: 100`
- **Invalid:** `MaxLength: abc`, `MaxLength: -50`

### MinLength Property
- **Format:** `MinLength: [Number]`
- **Must be:** Positive integer
- **Example:** `MinLength: 3`
- **Can be combined with MaxLength**

### Pattern Property (Regular Expression)
```
✓ Valid:
Pattern: ^\d{5}(-\d{4})?$
Pattern: ^[A-Z]+$
Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

✗ Invalid:
Pattern: [invalid(regex
Pattern: ^(?P<invalid>name)$
```

**Rules:**
- Must be valid JavaScript regex
- Must be enclosed in quotes if contains special chars
- Tested against PCRE standard

### Format Property
```
Valid Formats:
- valid_email
- phone_format
- url_format
- date_format
- iso_8601

Examples:
Format: valid_email
Format: phone_format
```

### Default Property
- **Format:** `Default: [Value]`
- **Example:** `Default: N/A`
- **Example:** `Default: true`
- **Example:** `Default: 100`

### Description Property
- **Format:** `Description: [Text]`
- **Example:** `Description: User's email address`
- **Can contain spaces**

### Placeholder Property
- **Format:** `Placeholder: [Text]`
- **Example:** `Placeholder: Enter your email`

### HelpText Property
- **Format:** `HelpText: [Text]`
- **Example:** `HelpText: Use format: firstName.lastName`

## Property Rules

### No Duplicate Properties
```
✗ Invalid (duplicate Type):
Field: Name | Type: Text | Type: Email

✗ Invalid (duplicate Required):
Field: Age | Type: Number | Required: true | Required: false
```

### Property Order
- No specific order required
- All properties separated by pipe `|`
- Properties are case-insensitive (Property names)

```
✓ All valid:
Field: Email | Type: Email | Required: true | MaxLength: 100
Field: Email | Required: true | Type: Email | MaxLength: 100
Field: Email | MaxLength: 100 | Required: true | Type: Email
```

### Malformed Properties
```
✗ Invalid Formats:
Field: Name | Type  Email (missing colon)
Field: Name | Type: (missing value)
Field: Name | :Email (missing property name)
Field: Name || Type: Email (double pipe)
```

## Spacing and Formatting Rules

### Line Spacing
- Empty lines are ignored
- Comments starting with `//` are ignored

```
✓ Valid:
Section: FirstSection
  Field: Name | Type: Text

  // This is a comment

Section: SecondSection
  Field: Email | Type: Email
```

### Indentation
- Field declarations must be indented
- Sections must have no indentation
- Consistent spacing recommended (2-4 spaces)

```
✓ Valid:
Section: Name
  Field: FirstField | Type: Text
  Field: SecondField | Type: Email

✗ Invalid:
Section: Name
Field: FirstField (not indented)
```

## Error Severity Levels

### 🔴 Error (Prevents Processing)
- Missing section name
- Invalid field name format
- Missing Type property
- Invalid Type value
- Duplicate sections
- Orphan fields (no parent section)

### 🟠 Warning (May Cause Issues)
- Missing Required specification
- Duplicate property names
- Unrecognized line format
- Duplicate section names

### 🔵 Info (Suggestions)
- Field type not specified
- Recommended property missing
- Best practice suggestions

## Validation Order

1. **Structure Check**
   - File has at least one section
   - Sections have proper format

2. **Section Check**
   - Section names are valid
   - No duplicate sections

3. **Field Check**
   - Fields belong to sections
   - Field names are valid

4. **Property Check**
   - Type property is valid
   - All properties are recognized
   - No duplicate properties
   - Property values are valid

## Examples

### ✓ Correct Syntax
```
Section: CustomerInfo
  Field: FirstName | Type: Text | Required: true | MaxLength: 50
  Field: Email | Type: Email | Required: true
  Field: Phone | Type: Phone | Required: false | Pattern: ^\+?[\d\-\s()]+$

Section: Preferences
  Field: Newsletter | Type: Checkbox | Required: false | Default: false
```

### ✗ Incorrect Syntax (with errors)
```
Section: 
  Field: Name | Type: InvalidType | Required: maybe

Section: CustomerInfo
Field: NoIndent | Type: Text

  Field: BadName-123 | Type: Text | Required: true | Required: false
```

---

## Quick Reference

| Aspect | Rule |
|--------|------|
| Section name | Non-empty, unique |
| Field name | `^[a-zA-Z_][a-zA-Z0-9_]*$` |
| Field type | Must be from valid list |
| Required value | `true` or `false` |
| MaxLength | Positive integer |
| Pattern | Valid regex |
| Indentation | Fields: 2+ spaces, Sections: no space |
| Duplicates | Not allowed (warning for sections) |
| Properties | Pipe-separated, no duplicates |
| Case | Case-sensitive for keywords |

---

## Debugging Tips

1. **Check indentation** - Most common issue
2. **Verify field type** - Must be exact case
3. **Use valid regex** - Test patterns in regex tester
4. **No duplicate props** - Each property once per field
5. **Property format** - Always `Name: Value`
6. **Section placement** - Fields must follow section

