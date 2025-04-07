# j e l l i c u l e MCP Protocol

The MCP (Master Control Program) protocol is a machine-readable interface for the j e l l i c u l e library. It provides a way for programs to interact with the j e l l i c u l e library programmatically.

## Protocol Overview

The MCP protocol uses JSON messages over HTTP or WebSocket. Each message has a `type` field that indicates the type of message.

## HTTP Endpoint

The MCP protocol is available over HTTP at:

```
http://localhost:7329/mcp
```

## WebSocket Endpoint

The MCP protocol is also available over WebSocket at:

```
ws://localhost:7330
```

## Message Types

### Ping

The `ping` message is used to check if the MCP service is available.

**Request:**

```json
{
  "type": "ping",
  "id": "1234"
}
```

**Response:**

```json
{
  "type": "pong",
  "id": "1234"
}
```

### Get Status

The `get_status` message is used to get the current build status.

**Request:**

```json
{
  "type": "get_status"
}
```

**Response:**

```json
{
  "type": "status",
  "data": {
    "status": "success",
    "time": "2025-04-07T00:00:00.000Z",
    "version": "0.1.0"
  }
}
```

### Get Components

The `get_components` message is used to get a list of all components.

**Request:**

```json
{
  "type": "get_components"
}
```

**Response:**

```json
{
  "type": "components",
  "data": [
    {
      "name": "activity-viewport",
      "path": "layout/ActivityViewport/activity-viewport.js",
      "size": 1234,
      "modified": "2025-04-07T00:00:00.000Z"
    },
    ...
  ]
}
```

### Error

The `error` message is sent when an error occurs.

**Response:**

```json
{
  "type": "error",
  "message": "Error message"
}
```

## WebSocket-Specific Messages

### Welcome

The `welcome` message is sent when a client connects to the WebSocket endpoint.

**Response:**

```json
{
  "type": "welcome",
  "message": "Connected to j e l l i c u l e MCP service"
}
```

## Examples

### HTTP Example

```bash
curl -X POST -H "Content-Type: application/json" -d '{"type":"ping","id":"1234"}' http://localhost:7329/mcp
```

### WebSocket Example

```javascript
const ws = new WebSocket('ws://localhost:7330');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'ping',
    id: '1234'
  }));
};

ws.onmessage = event => {
  const message = JSON.parse(event.data);
  console.log(message);
};
```
