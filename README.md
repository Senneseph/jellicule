# Jellicule

## Project Overview
This project is called "jellicule".  Its goal is to create a consistent, high-level, modern, and abstract standardized user-interface system for the current age of AI-created software. The goal is to standardize API libraries with UI libraries using generic Web Components. It takes inspirations from Star Trek's LCARS and Sony's XcrossMediaBar design languages and attempts to provide a free, open standard for providing software services to user's in an age of automation.  All we are focusing on here is replicating efforts like Angular Material, Bootstrap, React's MUI, etc. To provide a library that anyone can use an customize.  Please help me get started with the first steps of initializing the repo and creating some initial files.

## Theory
Let the UI be data-driven. Assign generic components for representing the most common data types and representation styles. This library provides a rich, abstract suite of components and presentation patterns for a UML system to use. The "default" UI of 21st century human-ai-machine interface design.

## Features
- Pure web components with no external dependencies
- Customizable activity bars on all four sides of the viewport
- Resizable panels
- Context-aware main content area
- Clean, modern design language

## Project Structure

```
/
├── api-service/      # API service for backend functionality
├── components/       # Web components
├── dist/            # Built library files
├── files/           # Source files for components and styles
├── mcp-service/     # Master Control Program service
├── meta/            # Documentation and specifications
├── openapi-service/ # OpenAPI service for API documentation
├── pwa-service/     # Progressive Web App
├── service/         # Server configuration and scripts
└── styles/          # CSS styles
```

## Progressive Web App
The project includes a Progressive Web App (PWA) at `/pwa-service/index.html` that showcases all components with minimal external JavaScript.

## Progressive Web App Features

The Jellicule UI is available as a Progressive Web App (PWA) with the following features:

- **Installable**: Can be installed on desktop and mobile devices
- **Offline Support**: Works offline using service worker caching
- **Responsive Design**: Adapts to different screen sizes
- **Fast Loading**: Optimized for performance

## Download
You can download the built library directly from the running server at `/download.html`. The library is also available via curl:

```bash
curl -O http://localhost:7327/dist/jellicule.min.js
curl -O http://localhost:7327/styles/jellicule.css
```

## Getting Started
For installation instructions, please see [INSTALLATION.md](INSTALLATION.md).

### Development Environment
The project includes a WebSocket-based hot-reload development environment that automatically updates the browser when you make changes to the components.

#### Requirements
- Docker and Docker Compose

#### Starting the Development Environment

```bash
docker-compose up -d
```

This will start a single Docker container that:
1. Serves the Progressive Web App (PWA)
2. Runs a WebSocket server for real-time updates
3. Watches for changes to the components and automatically rebuilds
4. Provides a health check endpoint to monitor build status
5. Serves metadata and documentation

Any changes you make to the components will automatically trigger a rebuild and update all connected browsers in real-time.

Open your browser to http://localhost:7327/ to see the PWA.

## Versioning and Releases

This project follows [Semantic Versioning](https://semver.org/) (SemVer) for version numbering.

### Release Process

The project includes scripts for managing releases, versioning, and dependency management in the `scripts` directory:

#### Preparing for a 1.0.0 Release

```powershell
# Dry run (shows what would happen without making changes)
.\scripts\prepare-release.ps1

# Execute the release preparation
.\scripts\prepare-release.ps1 -Execute
```

This script:
1. Checks and pins all dependencies
2. Creates a comprehensive CHANGELOG.md from all commit messages
3. Squashes all commits into a single 'Initial release 1.0.0' commit
4. Sets up version 1.0.0 and creates a git tag

#### Updating Versions

For subsequent releases, use the auto-version script:

```powershell
# Increment patch version (1.0.0 -> 1.0.1)
.\scripts\auto-version.ps1 -VersionType patch

# Increment minor version (1.0.0 -> 1.1.0)
.\scripts\auto-version.ps1 -VersionType minor

# Increment major version (1.0.0 -> 2.0.0)
.\scripts\auto-version.ps1 -VersionType major
```

#### Dependency Management

To ensure all dependencies are properly pinned to specific versions:

```powershell
# Check for unpinned dependencies
.\scripts\pin-dependencies.ps1

# Fix unpinned dependencies
.\scripts\pin-dependencies.ps1 -Fix
```

See the [scripts/README.md](scripts/README.md) file for more details on the release process.

#### Checking Health Status
The project includes a health check endpoint that monitors the build status. You can access the health check dashboard in your browser:

```
http://localhost:7327/dashboard
```

Or get the raw health data in JSON format:

```
http://localhost:7327/health
```

The health check dashboard shows:
- Current build status (success/failed)
- Last build time and version
- Status of all services

#### Accessing Documentation
The project includes documentation in the `/meta` directory, which is served at:

```
http://localhost:7327/meta/
```

This includes:
- OpenAPI specification
- Usage documentation
- Technical specifications

#### Stopping the Development Environment
```bash
docker-compose down
```

## Documentation
For detailed documentation, please see [DOCUMENTATION.md](DOCUMENTATION.md).

## Changelog
For a list of changes and version history, please see [CHANGELOG.md](CHANGELOG.md).

## License
MIT License
