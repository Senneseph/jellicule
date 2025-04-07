/**
 * Combined server for Jellicule UI
 *
 * This server combines the functionality of:
 * - Web server (static file serving)
 * - WebSocket server (for hot-reload)
 * - Builder (for building the component library)
 * - Health check (for monitoring the service)
 */

import { serve } from 'bun';
import { existsSync, readFileSync, writeFileSync, mkdirSync, watch, readdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';
import { WebSocketServer } from 'ws';
import { spawnSync } from 'child_process';

// Configuration
const HTTP_PORT = process.env.HTTP_PORT || 7327;
const WS_PORT = process.env.WS_PORT || 8080;
const ROOT_DIR = process.env.ROOT_DIR || join(import.meta.dirname, '..');
const PWA_DIR = join(ROOT_DIR, 'pwa-service');
const COMPONENTS_DIR = join(ROOT_DIR, 'components');
const DIST_DIR = join(ROOT_DIR, 'dist');
const META_DIR = join(ROOT_DIR, 'meta');
const BUILD_STATUS_DIR = join(PWA_DIR, 'build-status');

// Ensure directories exist
[DIST_DIR, BUILD_STATUS_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Create initial build status
if (!existsSync(join(BUILD_STATUS_DIR, 'status.json'))) {
  const initialStatus = {
    status: 'unknown',
    time: new Date().toISOString(),
    version: '0.1.0',
    message: 'Initial status - no build has been performed yet'
  };
  writeFileSync(join(BUILD_STATUS_DIR, 'status.json'), JSON.stringify(initialStatus, null, 2));
}

// WebSocket server for hot-reload
const wss = new WebSocketServer({ port: WS_PORT });
const clients = [];

wss.on('connection', ws => {
  console.log('WebSocket client connected');
  clients.push(ws);

  // Send current build status
  try {
    const statusPath = join(BUILD_STATUS_DIR, 'status.json');
    if (existsSync(statusPath)) {
      const status = JSON.parse(readFileSync(statusPath, 'utf8'));
      ws.send(JSON.stringify({
        type: 'build-status',
        data: status
      }));
    }
  } catch (err) {
    console.error('Error sending initial status:', err);
  }

  ws.on('close', () => {
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log('WebSocket client disconnected');
  });
});

// Function to broadcast a message to all connected clients
function broadcast(message) {
  console.log('Broadcasting message:', typeof message === 'string' ? message : JSON.stringify(message));

  // If message is a string, try to parse it as JSON
  let messageObj = message;
  if (typeof message === 'string') {
    try {
      messageObj = JSON.parse(message);
    } catch (err) {
      console.error('Error parsing message as JSON:', err);
      // If parsing fails, wrap the string in a message object
      messageObj = { type: 'raw', data: message };
    }
  }

  // Send the message to all connected clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(typeof messageObj === 'string' ? messageObj : JSON.stringify(messageObj));
      } catch (err) {
        console.error('Error sending message to client:', err);
      }
    }
  });
}

// Function to build the component library
async function buildComponents() {
  console.log('Building components...');

  try {
    // Get all component files
    const components = [];

    // Function to recursively find component files
    function findComponents(dir) {
      const files = readdirSync(dir);
      for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
          findComponents(filePath);
        } else if (file.endsWith('.js')) {
          components.push(filePath);
        }
      }
    }

    // Find all component files
    findComponents(COMPONENTS_DIR);

    // Verify all component files exist
    components.forEach(componentPath => {
      if (!existsSync(componentPath)) {
        throw new Error(`Component file not found: ${componentPath}`);
      }
    });

    // Get version from version.txt or create it
    let version = '0.1.0';
    try {
      if (existsSync(join(COMPONENTS_DIR, 'version.txt'))) {
        version = readFileSync(join(COMPONENTS_DIR, 'version.txt'), 'utf8').trim();
      } else {
        writeFileSync(join(COMPONENTS_DIR, 'version.txt'), version);
      }
    } catch (err) {
      console.warn('Warning: Could not read or write version.txt', err);
    }

    // Create the combined code
    let combinedCode = `/**
 * Jellicule UI Components Library
 * Version: ${version}
 * Built: ${new Date().toISOString()}
 */

(function(global) {
  'use strict';

  // Define the global jellicule object
  global.jellicule = {
    version: '${version}',
    components: {}
  };

`;

    // Add each component's code
    components.forEach(componentPath => {
      try {
        const code = readFileSync(componentPath, 'utf8');

        // Remove export keyword and standalone customElements.define
        const processedCode = code
          .replace(/export\s+class/, 'const')
          .replace(/\/\/\s*For standalone use.*$/, '')
          .trim();

        combinedCode += processedCode + '\\n\\n';
      } catch (err) {
        throw new Error(`Error processing component ${componentPath}: ${err.message}`);
      }
    });

    // Add the customElements.define calls
    combinedCode += `
  // Register all components
  customElements.define('ActivityViewport', ActivityViewportElement);
  customElements.define('ActivityBar', ActivityBarElement);
  customElements.define('Activity', ActivityElement);
  customElements.define('ActivityResizeButton', ActivityResizebuttonElement);
  customElements.define('MainContent', MainContentElement);
  customElements.define('Content', ContentElement);

  // Add components to the jellicule object
  global.jellicule.components = {
    ActivityViewport: ActivityViewportElement,
    ActivityBar: ActivityBarElement,
    Activity: ActivityElement,
    ActivityResizeButton: ActivityResizebuttonElement,
    MainContent: MainContentElement,
    Content: ContentElement
  };

})(typeof window !== 'undefined' ? window : this);
`;

    // Write the combined code to the dist directory
    writeFileSync(join(DIST_DIR, 'jellicule.js'), combinedCode);

    // Create a minified version (not really minified, just a copy for now)
    writeFileSync(join(DIST_DIR, 'jellicule.min.js'), combinedCode);

    // Create a JSON file with build information
    const buildInfo = {
      version: version,
      buildTime: new Date().toISOString(),
      components: components.map(c => basename(c))
    };
    writeFileSync(join(DIST_DIR, 'build-info.json'), JSON.stringify(buildInfo, null, 2));

    // Create build status for the WebSocket server
    const buildStatus = {
      status: 'success',
      time: new Date().toISOString(),
      version: version
    };

    // Write the status file
    writeFileSync(join(BUILD_STATUS_DIR, 'status.json'), JSON.stringify(buildStatus, null, 2));

    // Notify the WebSocket server
    broadcast({
      type: 'build-status',
      data: buildStatus
    });

    // Copy the built files to the pwa-service/dist directory
    if (!existsSync(join(PWA_DIR, 'dist'))) {
      mkdirSync(join(PWA_DIR, 'dist'), { recursive: true });
    }

    writeFileSync(join(PWA_DIR, 'dist', 'jellicule.js'), combinedCode);
    writeFileSync(join(PWA_DIR, 'dist', 'jellicule.min.js'), combinedCode);
    writeFileSync(join(PWA_DIR, 'dist', 'build-info.json'), JSON.stringify(buildInfo, null, 2));

    console.log('Build successful!');
    return true;
  } catch (error) {
    console.error('Build failed:', error);

    // Create error files for debugging
    try {
      if (!existsSync(DIST_DIR)) {
        mkdirSync(DIST_DIR, { recursive: true });
      }

      writeFileSync(join(DIST_DIR, 'build-error.txt'), `Build failed at ${new Date().toISOString()}\\n\\nError: ${error.message}\\n\\nStack: ${error.stack}`);

      // Create a minimal working library with error information
      const errorLibrary = `/**
 * Jellicule UI Components Library - ERROR BUILD
 * Build failed at: ${new Date().toISOString()}
 * Error: ${error.message.replace(/\\n/g, ' ').replace(/'/g, "\\'")}
 */

(function(global) {
  'use strict';

  console.error('Jellicule library build failed:', ${JSON.stringify(error.message)});

  global.jellicule = {
    version: 'error',
    buildError: ${JSON.stringify(error.message)}
  };
})(typeof window !== 'undefined' ? window : this);
`;

      writeFileSync(join(DIST_DIR, 'jellicule.js'), errorLibrary);
      writeFileSync(join(DIST_DIR, 'jellicule.min.js'), errorLibrary);

      // Create build status for the WebSocket server
      const buildStatus = {
        status: 'failed',
        time: new Date().toISOString(),
        version: 'error',
        error: error.message
      };

      // Write the status file
      writeFileSync(join(BUILD_STATUS_DIR, 'status.json'), JSON.stringify(buildStatus, null, 2));

      // Notify the WebSocket server
      broadcast({
        type: 'build-status',
        data: buildStatus
      });

      // Copy the error files to the pwa-service/dist directory
      if (!existsSync(join(PWA_DIR, 'dist'))) {
        mkdirSync(join(PWA_DIR, 'dist'), { recursive: true });
      }

      writeFileSync(join(PWA_DIR, 'dist', 'jellicule.js'), errorLibrary);
      writeFileSync(join(PWA_DIR, 'dist', 'jellicule.min.js'), errorLibrary);
    } catch (writeError) {
      console.error('Failed to write error files:', writeError);
    }

    return false;
  }
}

// Watch for changes in the components directory
function watchComponents() {
  console.log('Watching for changes in components directory...');

  watch(COMPONENTS_DIR, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
      console.log(`Changes detected in ${filename}, rebuilding...`);

      // Update version
      const version = Date.now().toString();
      writeFileSync(join(COMPONENTS_DIR, 'version.txt'), version);

      // Rebuild components
      await buildComponents();
    }
  });
}

// HTTP server for static files and health check
const server = serve({
  port: HTTP_PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Health check endpoint
    if (path === '/health') {
      try {
        // Get build status
        const statusPath = join(BUILD_STATUS_DIR, 'status.json');

        if (existsSync(statusPath)) {
          const status = JSON.parse(readFileSync(statusPath, 'utf8'));

          // Return 200 OK if build was successful, 503 Service Unavailable if failed
          const statusCode = status.status === 'success' ? 200 : 503;

          return new Response(JSON.stringify({
            status: status.status,
            time: status.time,
            version: status.version,
            message: status.status === 'success'
              ? 'Build successful'
              : `Build failed: ${status.error || 'Unknown error'}`
          }), {
            status: statusCode,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        } else {
          // No status file found
          return new Response(JSON.stringify({
            status: 'unknown',
            message: 'No build status available'
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        }
      } catch (error) {
        // Error reading status
        return new Response(JSON.stringify({
          status: 'error',
          message: 'Error checking health: ' + error.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    }

    // Dashboard endpoint
    if (path === '/dashboard') {
      try {
        // Read the dashboard HTML file
        const dashboardPath = join(import.meta.dirname, 'health-dashboard.html');
        const dashboardHtml = readFileSync(dashboardPath, 'utf8');

        return new Response(dashboardHtml, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      } catch (error) {
        console.error('Error serving dashboard:', error);
        return new Response('Error loading dashboard: ' + error.message, { status: 500 });
      }
    }

    // Serve static files from the pwa-service directory
    try {
      let filePath;

      // Handle root path
      if (path === '/' || path === '') {
        filePath = join(PWA_DIR, 'index.html');
      }
      // Handle meta directory
      else if (path.startsWith('/meta/')) {
        filePath = join(ROOT_DIR, path);
      }
      // Handle all other paths
      else {
        filePath = join(PWA_DIR, path);
      }

      // Check if file exists
      if (existsSync(filePath) && !filePath.endsWith('/')) {
        const content = readFileSync(filePath);
        const contentType = getContentType(filePath);

        return new Response(content, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': path.includes('/dist/') || path.includes('/styles/')
              ? 'public, max-age=3600' // Cache for 1 hour
              : 'no-cache, no-store, must-revalidate'
          }
        });
      }

      // Check if it's a directory with index.html
      if (existsSync(filePath) && filePath.endsWith('/')) {
        const indexPath = join(filePath, 'index.html');
        if (existsSync(indexPath)) {
          const content = readFileSync(indexPath);

          return new Response(content, {
            headers: {
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        }
      }

      // File not found
      return new Response('File not found', { status: 404 });
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Error serving file: ' + error.message, { status: 500 });
    }
  }
});

// Helper function to get content type based on file extension
function getContentType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const contentTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'txt': 'text/plain',
    'md': 'text/markdown',
    'yaml': 'application/yaml',
    'yml': 'application/yaml'
  };

  return contentTypes[ext] || 'application/octet-stream';
}

// Start the server
console.log(`HTTP server running at http://localhost:${HTTP_PORT}`);
console.log(`WebSocket server running at ws://localhost:${WS_PORT}`);

// Perform initial build
await buildComponents();

// Start watching for changes
watchComponents();

// Export for potential programmatic use
export {
  server,
  wss,
  buildComponents,
  watchComponents,
  broadcast
};
