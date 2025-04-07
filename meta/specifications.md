# Jellicule UI Technical Specifications

This document provides technical specifications for the Jellicule UI component library.

## Architecture

Jellicule UI is built using Web Components, a set of standardized browser APIs that allow for the creation of custom, reusable HTML elements. The library is designed to be framework-agnostic and can be used with any JavaScript framework or vanilla JavaScript.

## Components

### ActivityViewport

**Description**: A container component that provides the overall layout for the application.

**Attributes**: None

**Events**: None

**Slots**:
- Default slot for child components

**CSS Variables**:
- `--activity-viewport-background`: Background color of the viewport
- `--activity-viewport-color`: Text color of the viewport

### ActivityBar

**Description**: A sidebar component that contains navigation items.

**Attributes**:
- `width`: The width of the activity bar (default: `250px`)

**Events**: None

**Slots**:
- Default slot for `Activity` components

**CSS Variables**:
- `--activity-bar-background`: Background color of the activity bar
- `--activity-bar-color`: Text color of the activity bar
- `--activity-bar-width`: Width of the activity bar

### Activity

**Description**: A navigation item component.

**Attributes**:
- `icon`: The icon to display (optional)
- `selected`: Whether the activity is selected (optional)
- `active`: Whether the activity is active (optional)

**Events**:
- `click`: Fired when the activity is clicked

**Slots**:
- Default slot for the activity label

**CSS Variables**:
- `--activity-background`: Background color of the activity
- `--activity-color`: Text color of the activity
- `--activity-selected-background`: Background color of the selected activity
- `--activity-selected-color`: Text color of the selected activity
- `--activity-hover-background`: Background color of the activity on hover
- `--activity-hover-color`: Text color of the activity on hover

### ActivityResizeButton

**Description**: A button component that allows resizing the activity bar.

**Attributes**: None

**Events**:
- `resize`: Fired when the activity bar is resized

**Slots**: None

**CSS Variables**:
- `--activity-resize-button-background`: Background color of the resize button
- `--activity-resize-button-color`: Text color of the resize button
- `--activity-resize-button-hover-background`: Background color of the resize button on hover
- `--activity-resize-button-hover-color`: Text color of the resize button on hover

### MainContent

**Description**: A container component for the main content.

**Attributes**:
- `context`: The current context of the main content (optional)

**Events**: None

**Slots**:
- Default slot for `Content` components

**CSS Variables**:
- `--main-content-background`: Background color of the main content
- `--main-content-color`: Text color of the main content

### Content

**Description**: A container component for content.

**Attributes**: None

**Events**: None

**Slots**:
- Default slot for content

**CSS Variables**:
- `--content-background`: Background color of the content
- `--content-color`: Text color of the content
- `--content-padding`: Padding of the content

## Browser Support

Jellicule UI supports all modern browsers that implement the Web Components standard:

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Performance

Jellicule UI is designed to be lightweight and performant. The minified JavaScript file is less than 10KB, and the CSS file is less than 5KB.

## Accessibility

Jellicule UI components are designed to be accessible and follow the WAI-ARIA guidelines. All components have appropriate ARIA attributes and keyboard navigation support.
