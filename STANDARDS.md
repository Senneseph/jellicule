# j e l l i c u l e Technical Standards

This document outlines the technical standards and best practices for the j e l l i c u l e project.

## Code Standards

### JavaScript

- Use ES6+ syntax
- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Use const for variables that don't change
- Use let for variables that do change
- Avoid var
- Use arrow functions for anonymous functions
- Use template literals for string interpolation
- Use destructuring for objects and arrays
- Use spread operator for copying objects and arrays
- Use async/await for asynchronous code

### CSS

- Use kebab-case for class names
- Use CSS variables for theming
- Use relative units (rem, em, %) instead of absolute units (px)
- Use flexbox and grid for layout
- Use media queries for responsive design
- Avoid !important
- Use BEM naming convention for classes

### HTML

- Use semantic HTML elements
- Use lowercase for element names
- Use double quotes for attribute values
- Use self-closing tags for void elements
- Include alt text for images
- Use aria attributes for accessibility
- Use data attributes for JavaScript hooks

## URL Structure

- Avoid file extensions in URLs, especially `.html`
- Use directory-based URLs ending with a trailing slash: `/dashboard/` instead of `/dashboard.html`
- Place content in index files within directories: `/dashboard/index.html` served as `/dashboard/`
- Keep URLs lowercase and use hyphens for word separation: `/user-guide/` not `/UserGuide/`
- Use semantic, descriptive paths that reflect the content's purpose
- Maintain URL stability - once published, URLs should not change

## Web Components

### Component Structure

- Each component should be in its own file
- Component files should be organized in subdirectories by type
- Component names should be descriptive and follow PascalCase
- Component file names should follow kebab-case
- Components should be self-contained and reusable
- Components should be documented with JSDoc comments

### Component API

- Use attributes for configuration
- Use events for communication
- Use slots for content projection
- Use shadow DOM for encapsulation
- Use CSS variables for theming
- Use custom properties for component-specific styling

## Documentation

- Use Markdown for documentation
- Document all public APIs
- Include examples for common use cases
- Document component attributes, events, and slots
- Document CSS variables and custom properties
- Document browser compatibility
- Document accessibility features

## Testing

- Write unit tests for all components
- Write integration tests for component interactions
- Write end-to-end tests for user flows
- Test across multiple browsers
- Test for accessibility
- Test for performance
- Test for responsive design

## Performance

- Minimize bundle size
- Use lazy loading for components
- Use code splitting for large applications
- Optimize images and other assets
- Use caching strategies
- Minimize network requests
- Optimize rendering performance

## Accessibility

- Follow WCAG 2.1 AA standards
- Use semantic HTML
- Use ARIA attributes when necessary
- Ensure keyboard navigation
- Provide alternative text for images
- Ensure sufficient color contrast
- Test with screen readers

## Security

- Validate all user input
- Sanitize HTML content
- Use Content Security Policy
- Use HTTPS
- Avoid inline scripts
- Keep dependencies up to date
- Follow security best practices

## Version Control

- Use Git for version control
- Use feature branches for development
- Use pull requests for code review
- Write descriptive commit messages
- Follow conventional commits format
- Keep commits small and focused
- Squash commits before merging

## Continuous Integration

- Run tests on every pull request
- Run linting on every pull request
- Run accessibility checks on every pull request
- Run performance checks on every pull request
- Run security checks on every pull request
- Automate deployment process
- Use semantic versioning for releases
