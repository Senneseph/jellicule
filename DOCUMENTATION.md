# Jellicule Documentation

## Table of Contents
- [Introduction](#introduction)
- [Architecture](#architecture)
- [Components](#components)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Development](#development)

## Introduction

Jellicule is a modern UI design language, inspired by LCARS and targeted at desktop through mobile formats. It is built from web components and JavaScript, with the goal of creating a design language that humans can immediately recognize as an AI-defined resource and navigate it accordingly. This also allows AI agents to natively traverse the UI and interact with it.

The name "jellicule" comes from the concept of a "jelly molecule" that features rounded components that take on lozenge-like forms with square elements or text. The UI is designed to be data-driven, with generic components for representing the most common data types and representation styles.

## Architecture

Jellicule is built using Web Components, a set of standardized browser APIs that allow for the creation of custom, reusable HTML elements. The library is designed to be framework-agnostic and can be used with any JavaScript framework or vanilla JavaScript.

The project is structured as follows:

- `/components`: Contains the web component definitions
- `/dist`: Contains the built library files
- `/files`: Contains the source files for components and styles
- `/meta`: Contains documentation and specifications
- `/pwa-service`: Contains a Progressive Web App that showcases the components
- `/service`: Contains server configuration and scripts
- `/styles`: Contains CSS styles

## Components

### ActivityViewport

The `ActivityViewport` component provides a container for activities and content.

```html
<ActivityViewport>
  <ActivityBar>
    <Activity icon="home" selected>Home</Activity>
    <Activity icon="settings">Settings</Activity>
  </ActivityBar>
  <MainContent>
    <Content>
      <!-- Your content here -->
    </Content>
  </MainContent>
</ActivityViewport>
```

### ActivityBar

The `ActivityBar` component provides a sidebar for navigation.

```html
<ActivityBar>
  <Activity icon="home" selected>Home</Activity>
  <Activity icon="settings">Settings</Activity>
</ActivityBar>
```

### Activity

The `Activity` component represents a navigation item.

```html
<Activity icon="home" selected>Home</Activity>
```

Attributes:
- `icon`: The icon to display (optional)
- `selected`: Whether the activity is selected (optional)

### MainContent

The `MainContent` component provides a container for the main content.

```html
<MainContent>
  <Content>
    <!-- Your content here -->
  </Content>
</MainContent>
```

### Content

The `Content` component provides a container for content.

```html
<Content>
  <!-- Your content here -->
</Content>
```

## API Reference

Detailed documentation of the API and available functions can be found in the `/meta` directory, which is served at:

```
http://localhost:7327/meta/
```

This includes:
- OpenAPI specification
- Usage documentation
- Technical specifications

## Examples

A complete example of using the Jellicule UI components can be found in the Progressive Web App at:

```
http://localhost:7327/
```

This example showcases all components with minimal external JavaScript.

## Development

The project includes a WebSocket-based hot-reload development environment that automatically updates the browser when you make changes to the components.

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

You can check the health status of the build at:

```
http://localhost:7327/dashboard
```

Or get the raw health data in JSON format:

```
http://localhost:7327/health
```
