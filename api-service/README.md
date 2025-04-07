# j e l l i c u l e API Service

This service provides a RESTful API for the j e l l i c u l e library.

## Endpoints

### GET /api/components

Returns a list of all components.

**Response:**

```json
{
  "status": "success",
  "components": [
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

### GET /api/components/:name

Returns the code for a specific component.

**Response:**

```json
{
  "status": "success",
  "name": "activity-viewport",
  "code": "// Component code here"
}
```

### GET /api/status

Returns the current build status.

**Response:**

```json
{
  "status": "success",
  "buildStatus": {
    "status": "success",
    "time": "2025-04-07T00:00:00.000Z",
    "version": "0.1.0"
  }
}
```

## Configuration

The API service can be configured using the following environment variables:

- `API_PORT`: The port to listen on (default: 7328)
- `ROOT_DIR`: The root directory of the j e l l i c u l e project (default: parent directory of the API service)

## Running the Service

The API service is included in the Docker Compose configuration and will be started automatically when running `docker-compose up -d`.

You can also run the service manually:

```bash
cd api-service
bun run server.js
```

## API Documentation

The API is documented using the OpenAPI specification. You can view the documentation at:

```
http://localhost:7327/meta/openapi.yaml
```
