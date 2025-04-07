# Jellicule UI Usage Guide

This document provides a brief guide on how to use the Jellicule UI library.

## Quick Start

1. Start the service:
   ```bash
   docker-compose up -d
   ```

2. Access the PWA:
   ```
   http://localhost:7327/
   ```

3. Access the health dashboard:
   ```
   http://localhost:7327/dashboard
   ```

4. Access the API documentation:
   ```
   http://localhost:7327/meta/openapi.yaml
   ```

## Using the Components

### Basic Usage

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

### Component Reference

For a complete reference of all available components and their attributes, see the [DOCUMENTATION.md](DOCUMENTATION.md) file.

## API Usage

The Jellicule UI library also provides an API for programmatic access. See the [API documentation](http://localhost:7327/meta/openapi.yaml) for details.

## MCP Service

The MCP (Master Control Program) service provides a machine-readable interface for the Jellicule UI library. See the [MCP documentation](http://localhost:7327/meta/mcp.yaml) for details.

## Stopping the Service

To stop the service:

```bash
docker-compose down
```

For more detailed information, see the [DOCUMENTATION.md](DOCUMENTATION.md) file.
