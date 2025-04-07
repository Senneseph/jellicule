# j e l l i c u l e Branding Guidelines

This document outlines the branding guidelines for the j e l l i c u l e project.

## Name Variations

| Context | Format | Example |
|---------|--------|---------|
| Official presentation | `j e l l i c u l e` | j e l l i c u l e |
| Icon shorthand | `jcule` | jcule |
| File names | `jellicule` | jellicule.css |
| Code references | `jellicule` | jellicule.components |
| Variable names | `jellicule` | jelliculeVersion |

## Capitalization

- Always use lowercase for "jellicule" in files, programming, and general references
- Avoid using "Jellicule" with a capital "J" whenever possible
- For CSS classes, use kebab-case: `jellicule-component`
- For JavaScript variables, use camelCase: `jelliculeComponent`
- For JavaScript classes, use PascalCase for the class name but keep "jellicule" lowercase: `jelliculeComponent`

## Logo and Icons

- Icons should use the "jcule" shorthand
- The primary icon is a stylized lowercase "j" on a blue background
- The primary color is `#2196F3` (Material Blue 500)
- The secondary color is `#FFFFFF` (White)

## Typography

- Use monospace font for the official `j e l l i c u l e` presentation
- Use system fonts for all other text:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  ```

## Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | `#2196F3` | `rgb(33, 150, 243)` | Primary brand color, buttons, links |
| Secondary | `#FF9800` | `rgb(255, 152, 0)` | Accents, highlights |
| Success | `#4CAF50` | `rgb(76, 175, 80)` | Success messages, positive actions |
| Error | `#F44336` | `rgb(244, 67, 54)` | Error messages, destructive actions |
| Warning | `#FFEB3B` | `rgb(255, 235, 59)` | Warning messages, cautionary actions |
| Info | `#2196F3` | `rgb(33, 150, 243)` | Informational messages |
| Background | `#FFFFFF` | `rgb(255, 255, 255)` | Page background |
| Surface | `#F5F5F5` | `rgb(245, 245, 245)` | Card background |
| Text Primary | `#212121` | `rgb(33, 33, 33)` | Primary text |
| Text Secondary | `#757575` | `rgb(117, 117, 117)` | Secondary text |
| Text Disabled | `#9E9E9E` | `rgb(158, 158, 158)` | Disabled text |

## Voice and Tone

- **Simple**: Use clear, concise language
- **Technical**: Use technical terms when appropriate
- **Friendly**: Maintain a friendly, approachable tone
- **Helpful**: Focus on helping the user accomplish their goals

## File Naming Conventions

- Use kebab-case for file names: `activity-bar.js`
- Use camelCase for component names: `ActivityBar`
- Organize component files in subdirectories: `/components/layout/ActivityBar/`

## URL Structure

- Avoid file extensions in URLs, especially `.html`
- Use directory-based URLs ending with a trailing slash: `/dashboard/` instead of `/dashboard.html`
- Place content in index files within directories: `/dashboard/index.html` served as `/dashboard/`
- Keep URLs lowercase and use hyphens for word separation: `/user-guide/` not `/UserGuide/`
- Use semantic, descriptive paths that reflect the content's purpose
- Maintain URL stability - once published, URLs should not change

## Documentation Style

- Use Markdown for documentation
- Use sentence case for headings
- Use code blocks for code examples
- Use tables for structured data
- Use lists for sequential steps or related items

## Examples

### Correct Usage

- "j e l l i c u l e is a modern UI component library"
- "The jcule icon represents our brand"
- "Import the jellicule.css file"
- "The jelliculeVersion variable contains the current version"

### Incorrect Usage

- "Jellicule is a modern UI component library" (avoid capitalization)
- "The Jellicule icon represents our brand" (use "jcule" for icons)
- "Import the Jellicule.css file" (use lowercase for files)
- "The JelliculeVersion variable contains the current version" (use camelCase with lowercase "j")

## Exceptions

In some cases, it may be necessary to use capitalization for technical reasons:

- Class names in JavaScript: `class jelliculeComponent`
- Package names in package.json: `"name": "jellicule"`
- Repository names: `github.com/jellicule/jellicule`

In these cases, use lowercase "jellicule" whenever possible, but follow the technical requirements of the platform or language.
