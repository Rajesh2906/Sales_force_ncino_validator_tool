// NCINO_VALIDATOR_EXAMPLES.md
// Example nCino Forms Gen Syntax for testing

## Example 1: Simple Customer Form (No Errors)

```
Section: CustomerInformation
  Field: FirstName | Type: Text | Required: true | MaxLength: 50
  Field: LastName | Type: Text | Required: true | MaxLength: 50
  Field: Email | Type: Email | Required: true | Format: valid_email
  Field: Phone | Type: Phone | Required: false

Section: AddressInformation
  Field: Street | Type: Text | Required: true | MaxLength: 100
  Field: City | Type: Text | Required: true | MaxLength: 50
  Field: State | Type: Dropdown | Required: true
  Field: ZipCode | Type: Text | Required: true | Pattern: ^\d{5}(-\d{4})?$
```

## Example 2: Form with Various Field Types

```
Section: PersonalDetails
  Field: FullName | Type: Text | Required: true | MaxLength: 100
  Field: DateOfBirth | Type: Date | Required: false
  Field: IsActive | Type: Boolean | Required: true | Default: true
  Field: Rating | Type: Number | Required: false | Pattern: ^[0-5]$

Section: ContactDetails
  Field: Email | Type: Email | Required: true | Format: valid_email
  Field: Website | Type: URL | Required: false
  Field: PhoneNumber | Type: Phone | Required: true
  Field: MobileNumber | Type: Phone | Required: false

Section: PreferencesSection
  Field: Newsletter | Type: Checkbox | Required: false | Default: false
  Field: CommunicationMethod | Type: Radio | Required: true
  Field: Interests | Type: MultiSelect | Required: false
  Field: Comments | Type: TextArea | Required: false | MaxLength: 1000

Section: FinancialInfo
  Field: Income | Type: Currency | Required: false
  Field: TaxRate | Type: Percent | Required: false | MaxLength: 3
```

## Example 3: Complex Form with Validation

```
Section: UserRegistration
  Field: Username | Type: Text | Required: true | MaxLength: 20 | MinLength: 3 | Pattern: ^[a-zA-Z0-9_]+$
  Field: Password | Type: Text | Required: true | MaxLength: 50 | MinLength: 8
  Field: Email | Type: Email | Required: true | Format: valid_email
  Field: ConfirmEmail | Type: Email | Required: true | Format: valid_email
  Field: BirthDate | Type: Date | Required: true
  Field: Country | Type: Dropdown | Required: true
  Field: AcceptTerms | Type: Checkbox | Required: true

Section: ProfileSetup
  Field: FirstName | Type: Text | Required: true | MaxLength: 50
  Field: LastName | Type: Text | Required: true | MaxLength: 50
  Field: Bio | Type: TextArea | Required: false | MaxLength: 500
  Field: Avatar | Type: Text | Required: false
  Field: Theme | Type: Radio | Required: false | Default: light

Section: NotificationPreferences
  Field: EmailNotifications | Type: Checkbox | Required: false | Default: true
  Field: SMSNotifications | Type: Checkbox | Required: false | Default: false
  Field: NotificationFrequency | Type: Dropdown | Required: true | Default: daily
  Field: PreferredContactTime | Type: Time | Required: false
```

## Example 4: Form with Errors (For Testing Validation)

```
Section: BrokenForm
  Field: InvalidFieldName-123 | Type: InvalidType | Required: maybe | MaxLength: abc
  Field: NoType | Description: This field has no type
  Section: NestedSection
    Field: InvalidIndentation | Type: Text

Section: DuplicateSection
  Field: TestField | Type: Text

Section: DuplicateSection
  Field: AnotherField | Type: Email | Format: invalid_format

Field: OrphanField | Type: Text
```

Expected Errors:
- Invalid field name (contains hyphen and numbers)
- Invalid field type
- Invalid Required value
- Invalid MaxLength value
- Missing Type property
- Invalid indentation
- Duplicate section name
- Orphan field without section

---

## How to Use These Examples

1. Copy one of the examples above
2. Paste it into the nCino Syntax Editor
3. Click the "Validate" button
4. Review the results:
   - Examples 1-3 should show "✓ Valid"
   - Example 4 should show multiple errors

---

## Testing Checklist

- [ ] Example 1 - Basic form validates without errors
- [ ] Example 2 - Complex form with all field types validates
- [ ] Example 3 - Form with pattern validation works
- [ ] Example 4 - Errors are correctly identified and reported
- [ ] Click "Example" button loads sample syntax
- [ ] Preview panel displays all sections and fields
- [ ] Error messages include line numbers and suggestions
- [ ] Clearing text removes all validation results
- [ ] Responsive layout works on different screen sizes
