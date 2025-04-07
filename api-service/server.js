/**
 * API Service for j e l l i c u l e
 * 
 * This service provides a RESTful API for the j e l l i c u l e library.
 */

import { serve } from 'bun';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Configuration
const PORT = process.env.API_PORT || 7328;
const ROOT_DIR = process.env.ROOT_DIR || join(import.meta.dirname, '..');

// API endpoints
const endpoints = {
  // Get component information
  'GET /api/components': (req) => {
    try {
      const componentsDir = join(ROOT_DIR, 'components');
      const components = [];
      
      // Function to recursively find component files
      function findComponents(dir, basePath = '') {
        const files = readdirSync(dir);
        for (const file of files) {
          const filePath = join(dir, file);
          const stat = statSync(filePath);
          if (stat.isDirectory()) {
            findComponents(filePath, join(basePath, file));
          } else if (file.endsWith('.js')) {
            components.push({
              name: file.replace('.js', ''),
              path: join(basePath, file),
              size: stat.size,
              modified: stat.mtime
            });
          }
        }
      }
      
      // Find all component files
      findComponents(componentsDir);
      
      return new Response(JSON.stringify({
        status: 'success',
        components
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Error getting components: ' + error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  },
  
  // Get component code
  'GET /api/components/:name': (req, params) => {
    try {
      const name = params.name;
      const componentsDir = join(ROOT_DIR, 'components');
      
      // Function to recursively find component file
      function findComponent(dir, name) {
        const files = readdirSync(dir);
        for (const file of files) {
          const filePath = join(dir, file);
          const stat = statSync(filePath);
          if (stat.isDirectory()) {
            const result = findComponent(filePath, name);
            if (result) {
              return result;
            }
          } else if (file === `${name}.js` || file.replace('.js', '') === name) {
            return filePath;
          }
        }
        return null;
      }
      
      // Find component file
      const componentPath = findComponent(componentsDir, name);
      
      if (!componentPath) {
        return new Response(JSON.stringify({
          status: 'error',
          message: `Component '${name}' not found`
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
      
      // Read component code
      const code = readFileSync(componentPath, 'utf8');
      
      return new Response(JSON.stringify({
        status: 'success',
        name,
        code
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Error getting component: ' + error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  },
  
  // Get build status
  'GET /api/status': (req) => {
    try {
      const statusPath = join(ROOT_DIR, 'pwa-service', 'build-status', 'status.json');
      
      if (existsSync(statusPath)) {
        const status = JSON.parse(readFileSync(statusPath, 'utf8'));
        
        return new Response(JSON.stringify({
          status: 'success',
          buildStatus: status
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      } else {
        return new Response(JSON.stringify({
          status: 'error',
          message: 'Build status not found'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Error getting build status: ' + error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  }
};

// HTTP server for API
const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
    
    // Handle OPTIONS request (CORS preflight)
    if (method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    // Find matching endpoint
    for (const [pattern, handler] of Object.entries(endpoints)) {
      const [endpointMethod, endpointPath] = pattern.split(' ');
      
      if (endpointMethod !== method) {
        continue;
      }
      
      // Check if path matches pattern
      const patternParts = endpointPath.split('/');
      const pathParts = path.split('/');
      
      if (patternParts.length !== pathParts.length) {
        continue;
      }
      
      const params = {};
      let match = true;
      
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          // Parameter
          const paramName = patternParts[i].substring(1);
          params[paramName] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
          // Not a match
          match = false;
          break;
        }
      }
      
      if (match) {
        // Call handler
        const response = await handler(req, params);
        
        // Add CORS headers
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
        
        return response;
      }
    }
    
    // Not found
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Endpoint not found'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        ...headers
      }
    });
  }
});

console.log(`API server running at http://localhost:${PORT}`);

// Export for potential programmatic use
export default server;
