/**
 * OpenAPI Service for j e l l i c u l e
 * 
 * This service provides an OpenAPI interface for the j e l l i c u l e library.
 */

import { serve } from 'bun';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Configuration
const PORT = process.env.OPENAPI_PORT || 7331;
const ROOT_DIR = process.env.ROOT_DIR || join(import.meta.dirname, '..');

// HTTP server for OpenAPI
const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    
    // OpenAPI specification
    if (path === '/openapi.yaml' || path === '/openapi.json') {
      try {
        const format = path.endsWith('.json') ? 'json' : 'yaml';
        const specPath = join(import.meta.dirname, `openapi.${format}`);
        
        if (existsSync(specPath)) {
          const spec = readFileSync(specPath, 'utf8');
          
          return new Response(spec, {
            headers: {
              'Content-Type': format === 'json' ? 'application/json' : 'text/yaml',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        } else {
          return new Response(`OpenAPI specification not found in ${format} format`, {
            status: 404,
            headers: {
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        }
      } catch (error) {
        return new Response(`Error getting OpenAPI specification: ${error.message}`, {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    }
    
    // Swagger UI
    if (path === '/' || path === '/index.html') {
      try {
        const htmlPath = join(import.meta.dirname, 'swagger-ui.html');
        
        if (existsSync(htmlPath)) {
          const html = readFileSync(htmlPath, 'utf8');
          
          return new Response(html, {
            headers: {
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        } else {
          return new Response('Swagger UI not found', {
            status: 404,
            headers: {
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        }
      } catch (error) {
        return new Response(`Error getting Swagger UI: ${error.message}`, {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    }
    
    // Not found
    return new Response('Not Found', { status: 404 });
  }
});

console.log(`OpenAPI server running at http://localhost:${PORT}`);

// Export for potential programmatic use
export default server;
