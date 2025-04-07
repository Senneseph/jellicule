# j e l l i c u l e OpenAPI Service

This service provides an OpenAPI interface for the j e l l i c u l e library.

## OpenAPI Specification

The OpenAPI specification describes the API endpoints provided by the j e l l i c u l e services. It is available in both YAML and JSON formats:

- YAML: http://localhost:7331/openapi.yaml
- JSON: http://localhost:7331/openapi.json

## Swagger UI

The OpenAPI service includes a Swagger UI interface for exploring the API:

```
http://localhost:7331/
```

## Configuration

The OpenAPI service can be configured using the following environment variables:

- `OPENAPI_PORT`: The port to listen on (default: 7331)
- `ROOT_DIR`: The root directory of the j e l l i c u l e project (default: parent directory of the OpenAPI service)

## Running the Service

The OpenAPI service is included in the Docker Compose configuration and will be started automatically when running `docker-compose up -d`.

You can also run the service manually:

```bash
cd openapi-service
bun run server.js
```

## API Documentation

The OpenAPI specification documents the following APIs:

- API Service: http://localhost:7328
- MCP Service: http://localhost:7329
- Main Service: http://localhost:7327

For more information about the APIs, see the Swagger UI interface.
