# Jellicule Documentation

## Table of Contents
- [Introduction](#introduction)
- [Architecture](#architecture)
- [Components](#components)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Theming](#theming)
- [Events](#events)
- [Offline Support](#offline-support)
- [Development](#development)

## Introduction

Jellicule is a modern UI design language, inspired by LCARS and targeted at desktop through mobile formats. It is built from web components and JavaScript, with the goal of creating a design language that humans can immediately recognize as an AI-defined resource and navigate it accordingly. This also allows AI agents to natively traverse the UI and interact with it.

The name "jellicule" comes from the concept of a "jelly molecule" that features rounded components that take on lozenge-like forms with square elements or text. The UI is designed to be data-driven, with generic components for representing the most common data types and representation styles.

## Architecture

Jellicule is built using Web Components, a set of standardized browser APIs that allow for the creation of custom, reusable HTML elements. The library is designed to be framework-agnostic and can be used with any JavaScript framework or vanilla JavaScript.

The project is structured as follows:

- `/dist`: Contains the built library files
- `/files`: Contains the source files for components and styles
  - `/components`: Contains the web component definitions
    - `/forms`: Form-related components
    - `/interface`: UI components
    - `/layout`: Layout components
    - `/text`: Text-related components
- `/pwa-service`: Contains a Progressive Web App that showcases the components
  - `/assets`: Static assets
    - `/icons`: Icon files
    - `/js`: JavaScript files
    - `/styles`: CSS files
- `/server`: Contains server configuration and scripts

## Components

### ActivityViewport

The `ActivityViewport` component provides a container for activities and content.

```html
<jc-activity-viewport>
  <jc-activity-bar orientation="top">
    <jc-activity-resize-button></jc-activity-resize-button>
    <jc-activity icon="🏠" label="Home" selected></jc-activity>
    <jc-activity icon="⚙️" label="Settings"></jc-activity>
  </jc-activity-bar>
  <jc-main-content>
    <jc-content width="default">
      <!-- Your content here -->
    </jc-content>
  </jc-main-content>
</jc-activity-viewport>
```

**Attributes:**
- `theme`: Sets the theme ('light' or 'dark')

### ActivityBar

The `ActivityBar` component provides a navigation bar that can be positioned on any side of the viewport.

```html
<jc-activity-bar orientation="left">
  <jc-activity-resize-button></jc-activity-resize-button>
  <jc-activity icon="🏠" label="Home" selected></jc-activity>
  <jc-activity icon="⚙️" label="Settings"></jc-activity>
</jc-activity-bar>
```

**Attributes:**
- `orientation`: Position of the bar ('top', 'right', 'bottom', 'left')
- `theme`: Sets the theme ('light' or 'dark')
- `data-expanded`: Whether the bar is expanded ('true' or 'false')

### Activity

The `Activity` component represents a navigation item.

```html
<jc-activity icon="🏠" label="Home" selected></jc-activity>
```

**Attributes:**
- `icon`: The icon to display
- `label`: Text label
- `selected`: Whether the activity is selected
- `active`: Whether the activity is active
- `theme`: Sets the theme ('light' or 'dark')

### ActivityResizeButton

The `ActivityResizeButton` component allows resizing of an ActivityBar.

```html
<jc-activity-resize-button></jc-activity-resize-button>
```

**Attributes:**
- `theme`: Sets the theme ('light' or 'dark')

### MainContent

The `MainContent` component provides a container for the main content.

```html
<jc-main-content context="Current context">
  <jc-content>
    <!-- Your content here -->
  </jc-content>
</jc-main-content>
```

**Attributes:**
- `context`: Current context information
- `theme`: Sets the theme ('light' or 'dark')

### Content

The `Content` component provides a container for content with various width options.

```html
<jc-content width="default">
  <!-- Your content here -->
</jc-content>
```

**Attributes:**
- `width`: Content width ('narrow', 'default', 'wide', 'full')
- `theme`: Sets the theme ('light' or 'dark')

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

## Theming

j e l l i c u l e supports light and dark themes out of the box. You can set the theme by adding the `data-theme` attribute to the HTML element:

```html
<html data-theme="dark">
```

Or toggle it via JavaScript:

```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

### CSS Variables

You can customize the appearance by overriding these CSS variables:

```css
:root {
  --jc-primary: #f5d76e;
  --jc-secondary: #4a235a;
  --jc-bg-light: #f8f9fa;
  --jc-bg-dark: #121212;
  --jc-text-light: #212529;
  --jc-text-dark: #f8f9fa;
  --jc-grid: #20c20e;
  --jc-chrome: linear-gradient(135deg, #c0c0c0, #f0f0f0, #c0c0c0);
}
```

## Events

Components emit various events that you can listen for:

- `activity-selected`: Fired when an activity is selected
- `activity-bar-resized`: Fired when an activity bar is resized

Example:

```javascript
document.addEventListener('activity-selected', (event) => {
  console.log('Selected activity:', event.detail.activity);
});
```

## Offline Support

j e l l i c u l e is designed to work offline, allowing users to continue using the application even without an internet connection:

- **Offline Mode**: The PWA automatically detects when the user is offline and switches to offline mode
- **Cached Resources**: All essential resources are cached for offline use
- **Local Storage**: Important data is stored locally for offline access
- **No Server Dependency**: The PWA service can run locally without attempting to reconnect to a server
- **Graceful Degradation**: Features that require server connectivity are gracefully disabled when offline
- **Offline Notifications**: Users are informed when the application is running in offline mode
- **Automatic Reconnection**: The application automatically reconnects when the internet connection is restored

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
http://localhost:7327/dashboard/
```

Or get the raw health data in JSON format:

```
http://localhost:7327/health/
```
