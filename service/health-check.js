// Health check server for Jellicule
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { serve } from 'bun';

// Default port for health check
const PORT = process.env.HEALTH_CHECK_PORT || 8081;

// Create a simple HTTP server
const server = serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      try {
        // Get build status
        const statusPath = join(import.meta.dirname, '..', 'pwa-service', 'build-status', 'status.json');

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

    // Root endpoint with dashboard
    if (url.pathname === '/' || url.pathname === '') {
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

    // Not found
    return new Response('Not Found', { status: 404 });
  }
});

console.log('Health check server running at http://localhost:' + PORT);

// Export the server for potential programmatic use
export default server;
