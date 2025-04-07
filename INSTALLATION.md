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

### Using Node.js:
```
npm install -g http-server
http-server -p 7327
```

## Development Environment

For development with hot-reload capabilities, use the development environment:

**On Linux/macOS:**
```bash
./dev.sh
```

**On Windows:**
```
dev.bat
```

This will start a Docker container that serves the example directory and watches for changes to the components. Any changes you make to the components will automatically be reflected in the browser.

Open your browser to http://localhost:7327/ to see the example.

To stop the development environment:
```bash
docker-compose -f docker-compose.dev.yaml down
```

## Configuration
The Jellicule UI components don't require any special configuration. They are pure web components that can be used in any HTML file.

## Troubleshooting

### Port Conflicts
If port 7327 is already in use, you can change it in the docker-compose.yaml file:

```yaml
ports:
  - "7328:80"  # Change 7327 to any available port
```

### Component Not Rendering
If components are not rendering correctly, check the browser console for any JavaScript errors.
