# j e l l i c u l e MCP Service

This service provides a machine-readable interface for the j e l l i c u l e library.

## Protocol

The MCP (Master Control Program) protocol is a machine-readable interface for the j e l l i c u l e library. It provides a way for programs to interact with the j e l l i c u l e library programmatically.

For detailed information about the protocol, see the [MCP Protocol Documentation](mcp-protocol.md).

## Endpoints

### HTTP Endpoint

The MCP protocol is available over HTTP at:

```
http://localhost:7329/mcp
```

### WebSocket Endpoint

The MCP protocol is also available over WebSocket at:

```
ws://localhost:7330
```

## Configuration

The MCP service can be configured using the following environment variables:

- `MCP_HTTP_PORT`: The HTTP port to listen on (default: 7329)
- `MCP_WS_PORT`: The WebSocket port to listen on (default: 7330)
- `ROOT_DIR`: The root directory of the j e l l i c u l e project (default: parent directory of the MCP service)

## Running the Service

The MCP service is included in the Docker Compose configuration and will be started automatically when running `docker-compose up -d`.

You can also run the service manually:

```bash
cd mcp-service
bun run server.js
```

## Documentation

The MCP protocol is documented in the [MCP Protocol Documentation](mcp-protocol.md). You can also access the documentation at:

```
http://localhost:7329/mcp/docs
```
