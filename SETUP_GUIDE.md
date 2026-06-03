# nCino Forms Gen Syntax Validator - Setup Guide

## 🎯 Project Overview

This is a professional React + Vite application designed for validating and visualizing nCino Forms Gen syntax.

### Key Features

- **Live Validation**: Real-time error detection as you type
- **Split-Pane Interface**: Editor on left, human-readable preview on right
- **Detailed Error Messages**: Line numbers, suggestions, and code context
- **Professional UI**: Modern gradient design with smooth interactions
- **Responsive Layout**: Works on desktop, tablet, and large screens

## 📁 Project Structure

```
salesforce-validator/
├── src/
│   ├── components/
│   │   ├── SyntaxValidator.jsx      # Main validation editor
│   │   ├── Preview.jsx              # Human-readable format display
│   │   └── ErrorList.jsx            # Error display component
│   ├── utils/
│   │   ├── ncynosyntaxValidator.js  # Core validation logic
│   │   └── syntaxHighlighter.js     # Syntax highlighting utilities
│   ├── styles/
│   │   ├── SyntaxValidator.css      # Editor styles
│   │   ├── Preview.css              # Preview styles
│   │   └── ErrorList.css            # Error display styles
│   ├── App.jsx                       # Main app component
│   ├── App.css                       # App-wide styles
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Global styles
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
└── README.md                         # Documentation
```

## 🚀 How to Run

### Prerequisites
- Node.js 22.12+ or 20.19+ (important!)
- npm or yarn

### Installation Steps

```bash
# 1. Navigate to project directory
cd c:\VSCodeWorkSpace\SF_NCINO_Tool\salesforce-validator

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173/
```

## 💡 Using the Application

### Syntax Format

The nCino Forms Gen syntax follows this structure:

```
Section: CustomerInformation
  Field: FirstName | Type: Text | Required: true | MaxLength: 50
  Field: Email | Type: Email | Required: true | Format: valid_email

Section: AddressBlock
  Field: Street | Type: Text | Required: true
  Field: ZipCode | Type: Text | Pattern: ^\d{5}(-\d{4})?$
```

### Valid Field Types

- **Text Fields**: Text, Email, Phone, URL
- **Numeric**: Number, Currency, Percent
- **Date/Time**: Date, DateTime, Time
- **Boolean**: Boolean, Checkbox, Radio
- **Selection**: Dropdown, MultiSelect
- **Rich**: TextArea, Rich Text

### Field Properties

| Property | Value | Example |
|----------|-------|---------|
| type | Field type (required) | Type: Email |
| required | true/false | Required: true |
| readonly | true/false | Readonly: false |
| maxlength | Number | MaxLength: 100 |
| pattern | Regex | Pattern: ^[A-Z]+ |
| format | validation format | Format: valid_email |
| default | Default value | Default: N/A |
| placeholder | Placeholder text | Placeholder: Enter name |
| description | Field description | Description: User's email |

### Features You Can Use

1. **Load Example** - Click "📋 Example" button to load sample syntax
2. **Validate** - Click "✓ Validate" to check for errors
3. **Clear** - Reset editor with "✕ Clear" button
4. **Real-time Preview** - See structured format on the right side
5. **Error Details** - View line numbers, suggestions, and context

## 🛠️ Available Commands

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## 🎨 UI Layout

### Left Panel (Editor)
- nCino syntax textarea input
- Action buttons (Example, Validate, Clear)
- Validation results with error list

### Right Panel (Preview)
- Human-readable format display
- Structured sections and fields
- Property details for each field
- Visual status indicator

### Responsive Design
- Desktop: Side-by-side layout
- Tablet: Stacked layout (editor top, preview bottom)

## 🐛 Error Types

### Error (🔴 Red)
- Critical syntax issues that prevent parsing
- Missing required properties
- Invalid field types

### Warning (🟠 Orange)
- Non-critical issues
- Duplicate properties
- Unrecognized lines

### Info (🔵 Blue)
- General information
- Suggestions for improvement

## 📋 Example Syntax

Paste this to test the validator:

```
Section: PersonalInfo
  Field: FirstName | Type: Text | Required: true | MaxLength: 50
  Field: LastName | Type: Text | Required: true | MaxLength: 50
  Field: Email | Type: Email | Required: true | Format: valid_email
  Field: Phone | Type: Phone | Required: false | Pattern: ^\+?[\d\-\s()]+$

Section: AddressInfo
  Field: Street | Type: Text | Required: true | MaxLength: 100
  Field: City | Type: Text | Required: true | MaxLength: 50
  Field: State | Type: Dropdown | Required: true
  Field: ZipCode | Type: Text | Pattern: ^\d{5}(-\d{4})?$

Section: Preferences
  Field: Newsletter | Type: Checkbox | Required: false
  Field: Comments | Type: TextArea | MaxLength: 500
```

## 🔍 Validation Rules

The validator checks for:
- ✓ Valid section names
- ✓ Valid field names (alphanumeric + underscore)
- ✓ Valid field types
- ✓ Required properties presence
- ✓ Duplicate sections/properties
- ✓ Regular expression patterns
- ✓ Property format consistency

## 📝 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will auto-select the next available port

### Syntax Validation Not Working
1. Ensure syntax follows the format: `Section: Name` or `Field: Name | Property: Value`
2. Use consistent spacing and pipe (`|`) separators
3. Click "Validate" button to trigger validation

### Preview Not Updating
1. Reload the page (Ctrl+R)
2. Check browser console for errors (F12)
3. Ensure your nCino syntax is valid

## 📚 Technologies Used

- **React 19** - UI framework
- **Vite 8** - Build tool
- **CSS3** - Styling with gradients and modern features
- **JavaScript ES6+** - Core logic

## 🤝 Contributing

To enhance the validator:

1. Edit validation rules in `src/utils/ncynosyntaxValidator.js`
2. Add new components in `src/components/`
3. Create new styles in `src/styles/`
4. Test thoroughly before committing

## 📄 License

This project is part of the Salesforce nCino integration tools.

---

**Happy Validating! 🚀**

For issues or suggestions, please check the project documentation or contact the development team.
