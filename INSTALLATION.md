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
   http://localhost:8080
   ```

## Manual Installation (without Docker)

If you prefer not to use Docker, you can serve the files using any web server:

### Using Python's built-in HTTP server:
```
python -m http.server 8080
```

### Using Node.js:
```
npm install -g http-server
http-server -p 8080
```

## Configuration
The Jellicule UI components don't require any special configuration. They are pure web components that can be used in any HTML file.

## Troubleshooting

### Port Conflicts
If port 8080 is already in use, you can change it in the docker-compose.yaml file:

```yaml
ports:
  - "8081:80"  # Change 8080 to any available port
```

### Component Not Rendering
If components are not rendering correctly, check the browser console for any JavaScript errors.
