# UI Components Guide

## Application Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 🎨 Header (Purple Gradient)                                  │
│ nCino Forms Gen Syntax Validator                             │
│ Validate and visualize nCino Forms Gen syntax                │
└─────────────────────────────────────────────────────────────┘
┌──────────────────────────────┬──────────────────────────────┐
│                              │                              │
│  LEFT PANEL                  │  RIGHT PANEL                 │
│  (Syntax Editor)             │  (Preview)                   │
│                              │                              │
│  ┌─ SyntaxValidator ────────┐│ ┌─ Preview ────────────────┐ │
│  │                          ││ │                          │ │
│  │  [Example] [Validate]   ││ │  Human-Readable Format   │ │
│  │  [Clear]                ││ │                          │ │
│  │                          ││ │ ┌─ Section ────────────┐ │ │
│  │  ┌─────────────────────┐││ │ │ CustomerInfo [3]     │ │ │
│  │  │                     │││ │ │ ┌─ Field ─────────┐  │ │ │
│  │  │  Paste syntax here  │││ │ │ │ FirstName       │  │ │ │
│  │  │  Section: Customer..│││ │ │ │ Type: Text      │  │ │ │
│  │  │  Field: FirstName...│││ │ │ │ Required: true  │  │ │ │
│  │  │                     │││ │ │ └─────────────────┘  │ │ │
│  │  │                     │││ │ │ ┌─ Field ─────────┐  │ │ │
│  │  │                     │││ │ │ │ Email           │  │ │ │
│  │  └─────────────────────┘││ │ │ └─────────────────┘  │ │ │
│  │                          ││ │ └──────────────────────┘ │ │
│  └──────────────────────────┘│ │                          │ │
│                              │ │  ✓ Valid                 │ │
│  ┌─ ErrorList ──────────────┐│ └──────────────────────────┘ │
│  │                          ││                              │
│  │  ⚠️ Validation Results   ││                              │
│  │                          ││                              │
│  │  ✓ No errors found      ││                              │
│  │                          ││                              │
│  └──────────────────────────┘│                              │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

## Component Architecture

```
App.jsx
│
├─ Header
│  └─ Title & Description
│
└─ Container (Flex Row)
   │
   ├─ SyntaxValidator (Left)
   │  ├─ ValidatorHeader
   │  │  ├─ Title
   │  │  └─ HeaderActions (Buttons)
   │  │
   ├─ EditorSection
   │  └─ Textarea
   │
   └─ ErrorSection
      ├─ ErrorHeader
      └─ ErrorList
         └─ ErrorItems[]
            ├─ ErrorHeader
            ├─ ErrorDetails
            ├─ ErrorSuggestion
            └─ ErrorContext
   
   └─ Preview (Right)
      ├─ PreviewHeader
      │  ├─ Title
      │  └─ StatusBadge
      │
      └─ PreviewContent
         └─ SectionsList[]
            ├─ SectionTitle
            │  └─ FieldCount
            │
            └─ FieldsList[]
               ├─ FieldName
               ├─ RequiredBadge
               │
               └─ FieldProperties[]
                  ├─ Type
                  ├─ Format
                  ├─ MaxLength
                  ├─ Pattern
                  └─ Description
```

## Styling Breakdown

### Colors

```javascript
// Primary Gradient
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

// Status Colors
Success:  #dcfce7 (light green)
Error:    #fee2e2 (light red)
Warning:  #fffbeb (light orange)
Info:     #eff6ff (light blue)

// Text Colors
Primary:   #1f2937 (dark gray)
Secondary: #6b7280 (medium gray)
Tertiary:  #9ca3af (light gray)

// Accent Colors
Purple:    #667eea
Accent:    #764ba2
```

### Responsive Breakpoints

```css
/* Desktop (> 1024px) */
- Side-by-side layout
- 50% width each panel
- Full height split

/* Tablet (≤ 1024px) */
- Stacked vertical layout
- Full width, 50% height each
- SyntaxValidator on top
- Preview on bottom

/* Mobile (≤ 768px) */
- Adjusted padding
- Smaller text sizes
- Optimized touch targets
```

## Button States

### Normal
- Background: white
- Border: #d1d5db (light gray)
- Color: #374151 (dark gray)

### Hover
- Background: #f3f4f6 (lighter)
- Border: #9ca3af (darker)

### Disabled
- Opacity: 0.5
- Cursor: not-allowed

### Active (Validate)
- Background: Gradient (#667eea → #764ba2)
- Color: white
- No border

## Error Display Levels

### 🔴 Error
- Left Border: 4px solid red
- Background: #fef2f2
- Badge: Red background

### 🟠 Warning
- Left Border: 4px solid orange
- Background: #fffbeb
- Badge: Orange background

### 🔵 Info
- Left Border: 4px solid blue
- Background: #eff6ff
- Badge: Blue background

## Interactive Elements

### Textarea
- Font: Monaco monospace
- Focus: Purple border + glow effect
- Placeholder: Light gray text
- Custom scrollbar styling

### Field Cards
- Hover: Box shadow + border change
- Smooth transitions (200ms)
- Left accent border: Purple → Pink on hover

### Error Items
- Hover: Subtle shadow
- Click context: Fully visible
- Expandable details

## Accessibility Features

- ✓ Semantic HTML structure
- ✓ Clear focus indicators
- ✓ Color contrast compliance
- ✓ Descriptive labels
- ✓ Keyboard navigation support
- ✓ Screen reader friendly
- ✓ Proper ARIA attributes

## Animation & Transitions

```css
Transition Speed: 200ms ease
Scale on Click: 98%
Shadow Hover: 0 4px 12px rgba(0,0,0,0.08)
Gradient Smooth: Auto-transition
Focus Glow: 3px offset
```

---

**Design Philosophy**: Clean, professional, modern with smooth interactions and clear visual hierarchy.
