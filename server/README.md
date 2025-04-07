# Server Configuration

This directory contains the server-side configuration and scripts for the Jellicule UI component library.

## Files

- **build.js**: Script to build the library from the component files
- **websocket-server.js**: WebSocket server for hot-reload functionality
- **websocket-client.js**: Client script to communicate with the WebSocket server
- **rollup.config.js**: Configuration for Rollup.js (not currently used)
- **update-components.js**: Script to update component files (not currently used)
- **package.json**: Node.js package configuration

## How It Works

1. The WebSocket server (`websocket-server.js`) is started to handle real-time communication with browsers
2. The build script (`build.js`) compiles the component files into a single library file
3. The WebSocket client (`websocket-client.js`) sends build events to the WebSocket server
4. The browser receives build events and updates accordingly

These scripts are used by the Docker containers defined in the root `docker-compose.yaml` file.
