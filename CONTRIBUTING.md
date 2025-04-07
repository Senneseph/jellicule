# Contributing to Jellicule

Thank you for considering contributing to Jellicule! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots or animated GIFs if possible
- Include details about your configuration and environment

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When you are creating an enhancement suggestion, please include as many details as possible:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful to most users
- List some other applications where this enhancement exists, if applicable
- Include screenshots or animated GIFs if possible

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots or animated GIFs in your pull request whenever possible
- Follow the style guide
- Document new code
- End all files with a newline
- Avoid platform-dependent code

## Development Process

### Setting Up the Development Environment

1. Clone the repository
2. Install Docker and Docker Compose
3. Run `docker-compose up -d` to start the development environment
4. Open your browser to http://localhost:7327/ to see the PWA

### Making Changes

1. Create a new branch for your changes
2. Make your changes
3. Test your changes
4. Submit a pull request

### Testing

Before submitting a pull request, make sure your changes pass all tests:

1. Run the development environment with `docker-compose up -d`
2. Check the health status at http://localhost:7327/dashboard
3. Test your changes in the PWA at http://localhost:7327/

## Style Guide

### JavaScript

- Use ES6 syntax
- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Use kebab-case for file names
- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons at the end of statements

### CSS

- Use kebab-case for class names
- Use 2 spaces for indentation
- Use CSS variables for theming
- Use BEM naming convention for classes

### HTML

- Use 2 spaces for indentation
- Use lowercase for element names
- Use double quotes for attribute values
- Use self-closing tags for void elements

## License

By contributing to Jellicule, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).