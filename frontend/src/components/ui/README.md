# UI Component Library

This directory contains reusable UI components that follow the design system for the Music Genre Classifier application. These components are designed to be consistent, accessible, and easy to use throughout the application.

## Available Components

### Button

A versatile button component with multiple variants and sizes.

```jsx
import Button from './ui/Button';

// Usage examples
<Button>Default Button</Button>
<Button variant="secondary" size="lg">Large Secondary Button</Button>
<Button variant="outline" size="sm">Small Outline Button</Button>
<Button variant="text">Text Button</Button>
<Button fullWidth>Full Width Button</Button>
```

**Props:**
- `variant`: 'primary' (default), 'secondary', 'outline', 'text'
- `size`: 'sm', 'md' (default), 'lg'
- `fullWidth`: boolean (default: false)
- All standard button attributes (onClick, type, disabled, etc.)

### Card

A container component with consistent styling.

```jsx
import Card from './ui/Card';

// Usage examples
<Card>Basic card content</Card>
<Card className="p-8">Card with custom padding</Card>
```

**Props:**
- `className`: Additional CSS classes
- All standard div attributes (onClick, id, etc.)

## Adding New Components

When adding new components to this library, follow these guidelines:

1. Create a new file in the `ui` directory with the component name (PascalCase)
2. Include JSDoc comments to document props and usage
3. Ensure the component is accessible (keyboard navigation, ARIA attributes)
4. Use the design system colors and spacing
5. Support dark mode with appropriate color variations
6. Export the component as the default export
7. Update this README with documentation for the new component

## Design System Integration

These components use the design system defined in `tailwind.config.js`, which includes:

- Custom color palette (primary, secondary, accent, genre-specific colors)
- Typography scale and font families
- Spacing scale
- Animation definitions

Refer to the `UI_UX_DESIGN_GUIDE.md` in the frontend directory for comprehensive design guidelines.

## Accessibility

All components should:

- Be keyboard navigable
- Have appropriate ARIA attributes
- Maintain sufficient color contrast
- Support screen readers
- Handle focus management appropriately

## Future Components

Planned components to add to this library:

- **Input** - Text input with consistent styling
- **Select** - Dropdown select component
- **Modal** - Dialog/modal component
- **Alert** - Notification/alert component
- **Badge** - Small status indicator
- **Tabs** - Tab navigation component
- **Toggle** - Toggle switch component
- **Tooltip** - Informational tooltip
