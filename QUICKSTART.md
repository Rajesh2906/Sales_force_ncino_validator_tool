# 🚀 Quick Start Guide

## Installation & Running in 2 Minutes

### Step 1: Prerequisites
```bash
# Check your Node.js version (must be 22.12+ or 20.19+)
node -v

# If version is lower, download from https://nodejs.org
```

### Step 2: Install & Run
```bash
# Navigate to project
cd c:\VSCodeWorkSpace\SF_NCINO_Tool\salesforce-validator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 3: Open in Browser
```
http://localhost:5173/
```

## What You'll See

### Left Side - Syntax Editor
- Input area for nCino syntax
- Action buttons: Example, Validate, Clear
- Real-time validation results

### Right Side - Preview
- Human-readable form structure
- Visual representation of sections and fields
- Validation status indicator

## Quick Test

1. Click **"Example"** button
2. Click **"Validate"** button
3. See results on both sides

## Documentation Files

- **README.md** - Full project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **UI_GUIDE.md** - UI component details
- **VALIDATION_RULES.md** - All validation rules
- **EXAMPLES.md** - Test syntax examples

## Troubleshooting

### Issue: "Vite requires Node.js version 20.19+"
**Solution:** Upgrade Node.js to 22.12 or later

### Issue: Module not found errors
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Port 5173 in use
**Solution:** Vite will auto-select next available port

## Key Features ✨

✅ Live validation with error detection
✅ Split-pane editor + preview layout
✅ Detailed error messages with suggestions
✅ Professional UI with gradients
✅ Responsive design
✅ Syntax examples included

## Next Steps

1. Try the example syntax
2. Experiment with your own nCino forms
3. Review VALIDATION_RULES.md for all rules
4. Check EXAMPLES.md for more test cases

---

**You're all set! Happy validating! 🎉**
