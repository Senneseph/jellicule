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
        const statusPath = join(import.meta.dirname, '..', 'example', 'build-status', 'status.json');
        
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
          message: `Error checking health: ${error.message}`
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    }
    
    // Root endpoint with links
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Jellicule Health Check</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            h1 {
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .links {
              margin: 20px 0;
            }
            .links a {
              display: inline-block;
              margin-right: 10px;
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 4px;
              text-decoration: none;
              color: #333;
            }
            .links a:hover {
              background-color: #e0e0e0;
            }
          </style>
        </head>
        <body>
          <h1>Jellicule Health Check</h1>
          <p>This service provides health check information for the Jellicule UI component library.</p>
          
          <div class="links">
            <a href="/health">Health Check</a>
          </div>
          
          <h2>API Endpoints</h2>
          <ul>
            <li><strong>GET /health</strong> - Returns the current build status</li>
          </ul>
          
          <h2>Docker Health Check</h2>
          <p>This service is used by Docker to monitor the health of the Jellicule services.</p>
          <p>The health check will return:</p>
          <ul>
            <li><strong>200 OK</strong> - If the build was successful or status is unknown</li>
            <li><strong>503 Service Unavailable</strong> - If the build failed</li>
          </ul>
        </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
    
    // Not found
    return new Response('Not Found', { status: 404 });
  }
});

console.log(`Health check server running at http://localhost:${PORT}`);

// Export the server for potential programmatic use
export default server;
