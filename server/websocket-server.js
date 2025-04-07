// Use ES modules with Bun
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { WebSocketServer } from 'ws';

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server started on port 8080');

// Store connected clients
const clients = new Set();

// Handle connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Add client to the set
  clients.add(ws);

  // Send current build status to the new client
  try {
    const statusPath = join(import.meta.dirname, '..', 'example', 'build-status', 'status.json');
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

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
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

// Export the broadcast function
export { broadcast };

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('WebSocket server running. Waiting for build events...');

  // Listen for build events from stdin
  process.stdin.on('data', (data) => {
    try {
      const messageStr = data.toString().trim();
      console.log('Received message from stdin:', messageStr);

      // Try to parse as JSON, but don't fail if it's not valid JSON
      try {
        const message = JSON.parse(messageStr);
        broadcast(message);
        console.log('Broadcasted message:', message.type);
      } catch (jsonErr) {
        // If not valid JSON, broadcast as raw message
        console.log('Message is not valid JSON, broadcasting as raw message');
        broadcast({ type: 'raw', data: messageStr });
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('WebSocket server shutting down...');
    wss.close();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('WebSocket server shutting down...');
    wss.close();
    process.exit(0);
  });
}
