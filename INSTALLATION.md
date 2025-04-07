# Installation Guide

## Prerequisites
- Docker and Docker Compose
- Git

## Installation Steps
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/jellicule.git
   cd jellicule
   ```

2. Start the Docker container:
   ```
   docker-compose up -d
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:7327
   ```

4. To download the built library, visit:
   ```
   http://localhost:7327/download.html
   ```

## Manual Installation (without Docker)

If you prefer not to use Docker, you can serve the files using any web server:

### Using Python's built-in HTTP server:
```
python -m http.server 7327
```

## Development Environment

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

Open your browser to http://localhost:7327/ to see the PWA.

To stop the development environment:
```bash
docker-compose down
```

## Configuration
The Jellicule UI components don't require any special configuration. They are pure web components that can be used in any HTML file.

## Troubleshooting

### Port Conflicts
If port 7327 is already in use, you can change it in the docker-compose.yaml file:

```yaml
ports:
  - "7328:7327"  # Change 7327 to any available port
```

### Component Not Rendering
If components are not rendering correctly, check the browser console for any JavaScript errors.
