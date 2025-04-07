/**
 * MCP (Master Control Program) Service for j e l l i c u l e
 * 
 * This service provides a machine-readable interface for the j e l l i c u l e library.
 */

import { serve } from 'bun';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { WebSocketServer } from 'ws';

// Configuration
const HTTP_PORT = process.env.MCP_HTTP_PORT || 7329;
const WS_PORT = process.env.MCP_WS_PORT || 7330;
const ROOT_DIR = process.env.ROOT_DIR || join(import.meta.dirname, '..');

// WebSocket server
const wss = new WebSocketServer({ port: WS_PORT });
const clients = [];

wss.on('connection', ws => {
  console.log('MCP WebSocket client connected');
  clients.push(ws);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to j e l l i c u l e MCP service'
  }));
  
  // Handle messages
  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      
      // Handle different message types
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            id: data.id
          }));
          break;
          
        case 'get_status':
          sendStatus(ws);
          break;
          
        case 'get_components':
          sendComponents(ws);
          break;
          
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${data.type}`
          }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Error processing message: ${error.message}`
      }));
    }
  });
  
  ws.on('close', () => {
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log('MCP WebSocket client disconnected');
  });
});

// Function to send status to a client
function sendStatus(ws) {
  try {
    const statusPath = join(ROOT_DIR, 'pwa-service', 'build-status', 'status.json');
    
    if (existsSync(statusPath)) {
      const status = JSON.parse(readFileSync(statusPath, 'utf8'));
      
      ws.send(JSON.stringify({
        type: 'status',
        data: status
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Build status not found'
      }));
    }
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: `Error getting status: ${error.message}`
    }));
  }
}

// Function to send components to a client
function sendComponents(ws) {
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
    
    ws.send(JSON.stringify({
      type: 'components',
      data: components
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: `Error getting components: ${error.message}`
    }));
  }
}

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

// HTTP server for MCP
const server = serve({
  port: HTTP_PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    
    // MCP protocol endpoint
    if (path === '/mcp') {
      try {
        // Parse request body
        const body = await req.json();
        
        // Handle different message types
        switch (body.type) {
          case 'ping':
            return new Response(JSON.stringify({
              type: 'pong',
              id: body.id
            }), {
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
              }
            });
            
          case 'get_status':
            const statusPath = join(ROOT_DIR, 'pwa-service', 'build-status', 'status.json');
            
            if (existsSync(statusPath)) {
              const status = JSON.parse(readFileSync(statusPath, 'utf8'));
              
              return new Response(JSON.stringify({
                type: 'status',
                data: status
              }), {
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
              });
            } else {
              return new Response(JSON.stringify({
                type: 'error',
                message: 'Build status not found'
              }), {
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
              });
            }
            
          default:
            return new Response(JSON.stringify({
              type: 'error',
              message: `Unknown message type: ${body.type}`
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
              }
            });
        }
      } catch (error) {
        return new Response(JSON.stringify({
          type: 'error',
          message: `Error processing request: ${error.message}`
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    }
    
    // MCP protocol documentation
    if (path === '/mcp/docs') {
      try {
        const docsPath = join(import.meta.dirname, 'mcp-protocol.md');
        
        if (existsSync(docsPath)) {
          const docs = readFileSync(docsPath, 'utf8');
          
          return new Response(docs, {
            headers: {
              'Content-Type': 'text/markdown',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        } else {
          return new Response('MCP protocol documentation not found', {
            status: 404,
            headers: {
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        }
      } catch (error) {
        return new Response(`Error getting MCP protocol documentation: ${error.message}`, {
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

console.log(`MCP HTTP server running at http://localhost:${HTTP_PORT}`);
console.log(`MCP WebSocket server running at ws://localhost:${WS_PORT}`);

// Export for potential programmatic use
export {
  server,
  wss,
  broadcast
};
