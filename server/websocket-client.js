/**
 * WebSocket client for sending build events
 *
 * This script reads from stdin and sends the data to the WebSocket server.
 * It's used by the build process to notify the WebSocket server of build events.
 */

// Use ES modules with Bun
import { WebSocket } from 'ws';

// Buffer to store messages while not connected
let messageBuffer = [];
let connected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds

// Create a WebSocket client with reconnection logic
let client;

function connectWebSocket() {
  console.log('Connecting to WebSocket server...');
  client = new WebSocket('ws://websocket:8080');

  // Set up event handlers
  setupEventHandlers();
}

function setupEventHandlers() {
  client.on('open', () => {
    console.log('Connected to WebSocket server');
    connected = true;
    reconnectAttempts = 0;

    // Send any buffered messages
    while (messageBuffer.length > 0) {
      const message = messageBuffer.shift();
      try {
        client.send(message);
        console.log('Sent buffered message to WebSocket server');
      } catch (err) {
        console.error('Error sending buffered message:', err);
      }
    }
  });

  client.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  client.on('close', () => {
    console.log('Disconnected from WebSocket server');
    connected = false;

    // Try to reconnect if we haven't exceeded the maximum attempts
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Reconnecting (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(connectWebSocket, RECONNECT_DELAY);
    } else {
      console.log('Maximum reconnection attempts reached. Exiting.');
      // Exit after stdin is done
      process.stdin.on('end', () => {
        process.exit(0);
      });
    }
  });
}

// Function to send a message
function sendMessage(message) {
  if (connected && client.readyState === WebSocket.OPEN) {
    try {
      client.send(message);
      console.log('Sent message to WebSocket server');
      return true;
    } catch (err) {
      console.error('Error sending message to WebSocket server:', err);
      return false;
    }
  } else {
    // Buffer the message for later
    console.log('Not connected. Buffering message for later.');
    messageBuffer.push(message);
    return false;
  }
}

// Read from stdin and send to WebSocket server
process.stdin.on('data', (data) => {
  const message = data.toString().trim();
  if (message) {
    sendMessage(message);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  if (client && client.readyState === WebSocket.OPEN) {
    client.close();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (client && client.readyState === WebSocket.OPEN) {
    client.close();
  }
  process.exit(0);
});

// Start the connection
connectWebSocket();
