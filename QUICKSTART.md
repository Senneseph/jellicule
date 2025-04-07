# Jellicule UI Quick Start Guide

This guide is for experienced developers who need a quick refresher on how to use the Jellicule UI library.

## Start the Service

```bash
docker-compose up -d
```

## Access Points

- PWA: http://localhost:7327/
- Health Dashboard: http://localhost:7327/dashboard
- API Documentation: http://localhost:7327/meta/openapi.yaml
- MCP Service: http://localhost:7327/mcp-service

## Basic Component Usage

```html
<ActivityViewport>
  <ActivityBar>
    <Activity icon="home" selected>Home</Activity>
    <Activity icon="settings">Settings</Activity>
  </ActivityBar>
  <MainContent>
    <Content>
      <h1>Content Title</h1>
      <p>Content body</p>
    </Content>
  </MainContent>
</ActivityViewport>
```

## CSS Import

```html
<link rel="stylesheet" href="http://localhost:7327/styles/jellicule.css">
```

## JavaScript Import

```html
<script src="http://localhost:7327/dist/jellicule.min.js"></script>
```

## Stop the Service

```bash
docker-compose down
```

For more detailed information, see the [DOCUMENTATION.md](DOCUMENTATION.md) file.
