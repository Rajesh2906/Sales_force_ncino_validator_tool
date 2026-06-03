# 🎨 Application Visual Architecture

## Full Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    NCINO SYNTAX VALIDATOR                       │
│                                                                 │
│              [React App - Runs in Browser]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ APP.JSX (Root Component)                                        │
│                                                                 │
│ State:                                                          │
│  - syntax: [user input]                                        │
│  - errors: [validation results]                                │
└────────────────────────────────────────────────────────────────┘
           │
           ├─────────────┬─────────────┐
           │             │             │
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ HEADER   │  │ CONTAINER│  │ STYLES   │
    │  Title   │  │ (Grid)   │  │ CSS      │
    │  Logo    │  │          │  │          │
    └──────────┘  └──────────┘  └──────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
           ▼                         ▼
    ┌────────────────────┐   ┌────────────────────┐
    │ LEFT PANEL (50%)   │   │ RIGHT PANEL (50%)  │
    │                    │   │                    │
    └────────────────────┘   └────────────────────┘
           │                         │
           ▼                         ▼
    ┌────────────────────┐   ┌────────────────────┐
    │ SyntaxValidator    │   │ Preview            │
    │ .jsx/.css          │   │ .jsx/.css          │
    │                    │   │                    │
    │ • Header           │   │ • Header w/ Status │
    │ • Editor Textarea  │   │ • Section Cards    │
    │ • Action Buttons   │   │ • Field Details    │
    │ • Error List       │   │ • Property Display │
    └────────────────────┘   └────────────────────┘
           │                         │
           ▼                         ▼
    [Textarea Input]        [Structured Data]
    [Button: Example]       [Sections Display]
    [Button: Validate]      [Fields Display]
    [Button: Clear]         [Status Badge]
           │                         │
           └────────────┬────────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │  UTILITY MODULES     │
            │                      │
            │ validateSyntax()     │
            │ parseSyntax()        │
            │ highlightSyntax()    │
            └──────────────────────┘
```

---

## Component Hierarchy

```
App (Main)
│
├─ Header
│  └─ Title & Description
│
└─ Container (Flex Row)
   │
   ├─ SyntaxValidator (Flex: 1)
   │  │
   │  ├─ ValidatorHeader
   │  │  │
   │  │  ├─ Title
   │  │  │
   │  │  └─ HeaderActions
   │  │     ├─ Button[Example]
   │  │     ├─ Button[Validate]
   │  │     └─ Button[Clear]
   │  │
   │  ├─ EditorSection
   │  │  │
   │  │  └─ Textarea[SyntaxEditor]
   │  │     └─ onChange: updateSyntax()
   │  │
   │  └─ ErrorSection
   │     │
   │     ├─ ErrorHeader
   │     │  ├─ Title
   │     │  └─ ErrorCount Badge
   │     │
   │     └─ ErrorList
   │        └─ ErrorItem[] (map)
   │           ├─ ErrorBadge[severity]
   │           ├─ ErrorMessage
   │           ├─ ErrorDetails
   │           ├─ ErrorSuggestion
   │           └─ ErrorContext
   │
   └─ Preview (Flex: 1)
      │
      ├─ PreviewHeader
      │  ├─ Title
      │  └─ StatusBadge
      │
      └─ PreviewContent
         │
         └─ SectionsList[] (map)
            └─ SectionCard
               ├─ SectionTitle
               │  ├─ SectionName
               │  └─ FieldCount
               │
               └─ FieldsList[] (map)
                  └─ FieldItem
                     ├─ FieldName
                     ├─ RequiredBadge
                     │
                     └─ FieldProperties[] (map)
                        ├─ Type
                        ├─ Format
                        ├─ MaxLength
                        ├─ Pattern
                        └─ Description
```

---

## Data Flow Diagram

```
USER ACTION
    │
    ├─ Types Text → [TextArea onChange]
    │              ↓
    │         setSyntax(value)
    │              ↓
    │      State updates: syntax
    │              ↓
    │      Component re-renders
    │              ↓
    │      Preview updates in real-time
    │
    └─ Clicks "Validate" → [Button onClick]
                           ↓
                    handleValidate()
                           ↓
                    validateSyntax(syntax)
                           ↓
                  VALIDATION ENGINE
                    • Check structure
                    • Check sections
                    • Check fields
                    • Check properties
                           ↓
                    Returns: errors[]
                           ↓
                    setErrors(errors)
                           ↓
               State updates: errors
                           ↓
             Component re-renders
                           ↓
          ErrorList displays errors
```

---

## Validation Engine Flow

```
INPUT: Raw Syntax String
    │
    ▼
┌─────────────────────────────┐
│ SPLIT INTO LINES            │
│ Remove empty + comments     │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ STRUCTURE VALIDATION        │
│ • Check sections exist      │
│ • Check proper format       │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ SECTION VALIDATION          │
│ • Section name format       │
│ • Duplicate sections        │
│ • Non-empty names           │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ FIELD VALIDATION            │
│ • Field name format         │
│ • Indentation check         │
│ • Required Type property    │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ PROPERTY VALIDATION         │
│ • Type checking             │
│ • Value format checking     │
│ • Regex validation          │
│ • Duplicate properties      │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ COMPILE ERRORS              │
│ • Assign severity           │
│ • Add line numbers          │
│ • Generate suggestions      │
└─────────────────────────────┘
    │
    ▼
OUTPUT: errors[] Array
```

---

## State Management

```
App Component State:

┌─────────────────────────────────┐
│ const [syntax, setSyntax]       │
│   Type: string                  │
│   Usage: Textarea value         │
│   Updates: onChange             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ const [errors, setErrors]       │
│   Type: array of objects        │
│   Usage: ErrorList display      │
│   Updates: onValidate           │
└─────────────────────────────────┘

Passed to:
  • SyntaxValidator: syntax, setSyntax, errors, setErrors
  • Preview: syntax, errors
```

---

## File Dependencies

```
App.jsx (Main)
│
├─ SyntaxValidator.jsx
│  ├─ ErrorList.jsx
│  ├─ SyntaxValidator.css
│  └─ utils/ncynosyntaxValidator.js ← validateSyntax()
│
├─ Preview.jsx
│  ├─ Preview.css
│  └─ utils/ncynosyntaxValidator.js ← parseSyntax()
│
├─ App.css
└─ utils/ncynosyntaxValidator.js

ErrorList.jsx
├─ ErrorList.css
└─ (receives error objects from parent)

Utils:
└─ ncynosyntaxValidator.js
   ├─ validateSyntax(input)
   ├─ validateFieldLine(line)
   └─ parseSyntax(input)
```

---

## UI Layout Breakdown

```
DESKTOP (> 1024px):
┌────────────────────────────────────────┐
│ HEADER (Purple Gradient) - 60px        │
├────────────┬────────────────────────────┤
│            │                            │
│  LEFT 50%  │        RIGHT 50%           │
│            │                            │
│ • Editor   │    • Preview               │
│ • Buttons  │    • Status                │
│ • Errors   │    • Sections              │
│            │    • Fields                │
└────────────┴────────────────────────────┘


TABLET (≤ 1024px):
┌────────────────────────────────────────┐
│ HEADER (Purple Gradient) - 60px        │
├────────────────────────────────────────┤
│                                        │
│  TOP 50%                               │
│  • Editor                              │
│  • Buttons                             │
│  • Errors                              │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  BOTTOM 50%                            │
│  • Preview                             │
│  • Status                              │
│  • Sections                            │
│                                        │
└────────────────────────────────────────┘


MOBILE (≤ 768px):
┌────────────────────────────────────────┐
│ HEADER - Compact                       │
├────────────────────────────────────────┤
│ Editor (Full Width)                    │
│ with scrolling                         │
├────────────────────────────────────────┤
│ Errors (Full Width)                    │
│ with scrolling                         │
├────────────────────────────────────────┤
│ Preview (Full Width)                   │
│ with scrolling                         │
└────────────────────────────────────────┘
```

---

## Color & Style System

```
PRIMARY THEME:
├─ Header Background: Linear Gradient
│  └─ #667eea → #764ba2 (Purple)
│
├─ Button States:
│  ├─ Normal: White + Gray border
│  ├─ Hover: Light Gray background
│  ├─ Active (Validate): Gradient purple
│  └─ Disabled: 50% opacity
│
└─ Component Backgrounds:
   ├─ Cards: #f9fafb (Very light gray)
   ├─ Editor: #fafbfc (Light blue-gray)
   └─ Preview: White (#fff)

ERROR SEVERITY COLORS:
├─ Error (Red): #fee2e2 background, #dc2626 border
├─ Warning (Orange): #fffbeb background, #d97706 border
└─ Info (Blue): #eff6ff background, #2563eb border

TEXT HIERARCHY:
├─ Primary: #1f2937 (Dark Gray)
├─ Secondary: #6b7280 (Medium Gray)
└─ Tertiary: #9ca3af (Light Gray)
```

---

## Event Handling

```
User Interactions:

TEXTAREA:
├─ onChange → handleChange()
└─ setSyntax(value)

BUTTONS:
├─ Example → handleExample()
│           └─ setSyntax(exampleCode)
├─ Validate → handleValidate()
│            └─ validateSyntax()
└─ Clear → handleClear()
           └─ setSyntax(''), setErrors([])

COMPONENTS:
├─ ErrorItem → (display only, no interaction)
└─ PreviewCard → (display only, no interaction)
```

---

## Performance Characteristics

```
Syntax Validation:
• Time: < 100ms for typical input
• Method: Client-side validation
• No external API calls
• Real-time capable

Preview Rendering:
• Time: < 50ms for parsing
• Method: useMemo optimization
• Re-renders on syntax change
• Efficient filtering

File Size:
• Main App: ~5KB (JSX)
• Styles: ~20KB (CSS)
• Utilities: ~10KB (JS)
• Total: ~35KB + React

Memory Usage:
• Typical: ~5-10MB
• No data persistence
• No external connections
• Lightweight browser app
```

---

## Error Message Structure

```
Error Object:
{
  severity: 'error' | 'warning' | 'info',
  message: "Clear description of the issue",
  line: 5,                        // Optional
  column: 12,                     // Optional
  context: "Line of code here",   // Optional
  suggestion: "How to fix it"     // Optional
}

Displayed as:
┌─────────────────────────────────┐
│ [ERROR] Message text here       │
│ Line 5, Col 12                  │
│ Context code shown here         │
│ Suggestion: Do this to fix      │
└─────────────────────────────────┘
```

---

## Asset Management

```
Images (in src/assets/):
├─ react.svg (React logo)
├─ vite.svg (Vite logo)
└─ hero.png (Hero image)

Not used in current UI but available for:
• Future branding
• Documentation
• Marketing

CSS Resets:
├─ * { margin: 0, padding: 0 }
├─ Box-sizing: border-box
└─ Font smoothing enabled
```

---

**This architecture ensures:**
✓ Clean component separation
✓ Efficient state management
✓ Responsive design
✓ Maintainable code
✓ Fast performance
✓ Professional UI
