# UI/UX Design Guide for Music Genre Classifier

This document outlines the UI/UX design principles and guidelines for the Music Genre Classifier web application. It serves as a reference for frontend developers to ensure a consistent, accessible, and engaging user experience.

## Table of Contents

1. [Design System](#design-system)
2. [Visual Design](#visual-design)
3. [Interaction Design](#interaction-design)
4. [Information Architecture](#information-architecture)
5. [Accessibility](#accessibility)
6. [Responsive Design](#responsive-design)
7. [Component Guidelines](#component-guidelines)

## Design System

### Color Palette

The application uses a cohesive color palette with primary, secondary, and accent colors, as well as genre-specific colors for visual identification:

```jsx
// Primary colors - Blue shades
primary: {
  50: '#f0f9ff',  // Lightest blue - backgrounds
  100: '#e0f2fe', // Light blue - hover states
  500: '#3b82f6', // Medium blue - buttons, accents
  600: '#2563eb', // Medium-dark blue - button hover
  700: '#1d4ed8', // Dark blue - active states
  900: '#1e3a8a', // Darkest blue - text on light backgrounds
}

// Secondary colors - Purple shades
secondary: {
  50: '#f5f3ff',  // Lightest purple
  100: '#ede9fe', // Light purple
  500: '#8b5cf6', // Medium purple
  700: '#6d28d9', // Dark purple
  900: '#4c1d95', // Darkest purple
}

// Accent colors - Orange shades
accent: {
  50: '#fff7ed',  // Lightest orange
  100: '#ffedd5', // Light orange
  500: '#f97316', // Medium orange
  700: '#c2410c', // Dark orange
  900: '#7c2d12', // Darkest orange
}

// Genre-specific colors
genre: {
  blues: '#1e40af',     // Deep blue
  classical: '#0ea5e9',  // Light blue
  country: '#92400e',    // Brown
  disco: '#db2777',      // Pink
  hiphop: '#f97316',     // Orange
  jazz: '#8b5cf6',       // Purple
  metal: '#334155',      // Dark slate
  pop: '#ec4899',        // Pink
  reggae: '#65a30d',     // Green
  rock: '#e11d48',       // Red
}
```

### Typography

The application uses a clear typographic hierarchy:

- **Primary Font**: 'Inter' - Used for body text and general UI elements
- **Display Font**: 'Montserrat' - Used for headings and emphasis
- **Font Sizes**:
  - xs: 0.75rem (12px) - Small labels, footnotes
  - sm: 0.875rem (14px) - Secondary text, captions
  - base: 1rem (16px) - Body text
  - lg: 1.125rem (18px) - Emphasized body text
  - xl: 1.25rem (20px) - Subheadings
  - 2xl: 1.5rem (24px) - Section headings
  - 3xl: 1.875rem (30px) - Page headings
  - 4xl: 2.25rem (36px) - Main headings
  - 5xl: 3rem (48px) - Hero headings

### Spacing

Consistent spacing using Tailwind's default scale:

- 0: 0px
- px: 1px
- 0.5: 0.125rem (2px)
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)

### Animations

Custom animations for enhanced user experience:

- `fade-in`: Smooth fade-in animation for elements appearing on the page
- `pulse-slow`: Slow pulsing animation for drawing attention to elements

## Visual Design

### Cards and Containers

- Use the `Card` component for consistent styling of content containers
- Cards have rounded corners (lg = 0.5rem), white background, and subtle shadow
- Dark mode cards use dark gray background (#1f2937)
- Maintain consistent padding within cards (p-6)

### Buttons and Interactive Elements

- Use the `Button` component for all button-like interactions
- Button variants: primary, secondary, outline, text
- Button sizes: sm, md, lg
- Ensure hover and focus states are visually distinct
- Use appropriate colors for different actions (primary for main actions, outline for secondary actions)

### Icons and Visual Elements

- Use consistent icon style throughout the application
- Icons should be properly sized and aligned with text
- Use visual elements sparingly to avoid cluttering the interface
- Ensure sufficient contrast between icons and backgrounds

## Interaction Design

### Audio Upload Experience

- Provide clear visual feedback during drag-and-drop interactions
- Show file details after selection (name, size, type)
- Display upload progress with a progress bar
- Provide clear success/error states
- Allow users to remove or replace selected files

### Results Visualization

- Use animated transitions when displaying results
- Make charts interactive - clicking on a genre bar should show more information
- Use genre-specific colors consistently across visualizations
- Provide clear visual hierarchy for results (predicted genre most prominent)
- Include helpful descriptions of technical elements (e.g., what a spectrogram shows)

### Audio Player

- Provide intuitive playback controls (play/pause, skip forward/back)
- Show waveform visualization that responds to audio
- Include volume control and playback speed options
- Support keyboard shortcuts for common actions
- Display current time and duration clearly

## Information Architecture

### Navigation

- Desktop: Use a two-column layout for upload and results
- Mobile: Use tab-based navigation (Upload, Results, Playlists)
- Ensure clear visual indication of current section
- Provide empty states with helpful guidance

### Content Organization

- Group related information together
- Use clear headings and subheadings
- Maintain consistent information hierarchy across screens
- Provide contextual information where needed

### Playlist Organization

- Group songs by genre
- Show track count for each playlist
- Allow selection of playlists to view contents
- Provide clear empty states when no playlists exist

## Accessibility

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use proper focus management
- Provide keyboard shortcuts for common actions
- Ensure focus states are clearly visible

### Screen Reader Support

- Use semantic HTML elements
- Provide appropriate ARIA attributes
- Include descriptive alt text for images and visualizations
- Use proper heading hierarchy

### Color and Contrast

- Maintain WCAG AA contrast ratio (4.5:1) for text
- Don't rely solely on color to convey information
- Ensure dark mode has appropriate contrast ratios
- Test with color blindness simulators

## Responsive Design

### Mobile-First Approach

- Design for mobile screens first, then enhance for larger screens
- Use appropriate touch targets (minimum 44x44px)
- Simplify complex layouts for small screens
- Use tab-based navigation on mobile

### Breakpoints

- sm: 640px - Small devices
- md: 768px - Medium devices (tablets)
- lg: 1024px - Large devices (laptops)
- xl: 1280px - Extra large devices (desktops)

### Fluid Typography and Spacing

- Use relative units (rem, em) for typography and spacing
- Adjust spacing and sizing based on viewport size
- Ensure text remains readable at all screen sizes

## Component Guidelines

### AudioUpload Component

- Show different states: empty, drag active, file selected, uploading, error
- Provide clear feedback during drag and upload operations
- Allow file removal and replacement
- Show file details after selection

### ResultsDisplay Component

- Show predicted genre prominently with confidence score
- Use genre-specific colors for visual identification
- Make confidence score chart interactive
- Include helpful descriptions of genres and spectrograms
- Ensure visualizations are responsive

### AudioPlayer Component

- Provide intuitive playback controls
- Show waveform visualization when possible
- Include volume and playback speed controls
- Support keyboard shortcuts
- Ensure controls are touch-friendly

### Playlist Component

- Show genre list with track counts
- Allow selection of genres to view tracks
- Provide playback functionality for tracks
- Show empty state when no playlists exist

---

This guide should be used in conjunction with the implemented components to ensure a consistent, accessible, and engaging user experience throughout the application.
