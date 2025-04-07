# Jellicule UI Usage Guide

This guide provides instructions for using the Jellicule UI component library in your web applications.

## Installation

You can install the Jellicule UI library by downloading the JavaScript and CSS files:

```html
<link rel="stylesheet" href="https://your-server.com/styles/jellicule.css">
<script src="https://your-server.com/dist/jellicule.min.js"></script>
```

Or you can use the library directly from your local server:

```html
<link rel="stylesheet" href="http://localhost:7327/styles/jellicule.css">
<script src="http://localhost:7327/dist/jellicule.min.js"></script>
```

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

## Example

Here's a complete example of using the Jellicule UI components:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jellicule UI Example</title>
  <link rel="stylesheet" href="http://localhost:7327/styles/jellicule.css">
  <script src="http://localhost:7327/dist/jellicule.min.js"></script>
</head>
<body>
  <ActivityViewport>
    <ActivityBar>
      <Activity icon="home" selected>Home</Activity>
      <Activity icon="settings">Settings</Activity>
      <Activity icon="help">Help</Activity>
    </ActivityBar>
    <MainContent>
      <Content>
        <h1>Welcome to Jellicule UI</h1>
        <p>This is an example of using the Jellicule UI components.</p>
      </Content>
    </MainContent>
  </ActivityViewport>
</body>
</html>
```
