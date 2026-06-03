# nCino Forms Gen Syntax Validator

A professional React + Vite application for validating and visualizing nCino Forms Gen syntax.

## Features

✨ **Live Syntax Validation** - Real-time error detection and reporting
📋 **Human-Readable Preview** - Visual representation of your nCino forms structure
🎨 **Professional UI** - Beautiful, responsive design with intuitive layout
⚙️ **Detailed Error Messages** - Line numbers, suggestions, and context
📱 **Responsive Design** - Works seamlessly on desktop and tablet devices

## Getting Started

### Prerequisites

- Node.js version 22.12+ or 20.19+
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Usage

1. **Paste your nCino syntax** in the left editor panel
2. **Click "Validate"** to check for syntax errors
3. **View results** - Errors appear in the validation panel below the editor
4. **Check preview** - The right panel shows the human-readable format of your syntax

### Syntax Format

The nCino Forms Gen syntax uses the following structure:

```
Section: SectionName
  Field: FieldName | Type: TypeName | Property: Value

Section: AnotherSection
  Field: AnotherField | Type: Email | Required: true | Format: valid_email
```

#### Supported Field Types

- Text, Email, Phone, Number
- Date, DateTime, Time
- Boolean, Checkbox, Radio
- Dropdown, MultiSelect
- TextArea, Rich Text
- Currency, Percent, URL

#### Field Properties

- `type` - Field data type (required)
- `required` - Whether field is mandatory
- `readonly` - Read-only field
- `hidden` - Hidden field
- `maxlength` - Maximum character length
- `pattern` - Regular expression validation
- `format` - Built-in format validation
- `default` - Default field value
- `placeholder` - Placeholder text
- `description` - Field description

### Building for Production

```bash
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
