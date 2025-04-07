# Other Information

This file contains additional information that was removed from the main README.md during cleanup.

## Health Checks

The j e l l i c u l e service includes a health check endpoint that can be accessed at:

```
http://localhost:7327/health
```

This endpoint returns a JSON object with the following properties:

- `status`: The current status of the service (`success`, `failed`, or `unknown`)
- `time`: The time of the last build
- `version`: The current version of the library
- `message`: Additional information about the status

You can also access a visual dashboard of the health status at:

```
http://localhost:7327/dashboard
```

## Accessing Documentation

The project includes documentation in the `/meta` directory, which is served at:

```
http://localhost:7327/meta/
```

This includes:
- OpenAPI specification
- Usage documentation
- Technical specifications

## Checking Health Status

The j e l l i c u l e service includes a health check endpoint that can be accessed at:

```
http://localhost:7327/health
```

This endpoint returns a JSON object with the following properties:

- `status`: The current status of the service (`success`, `failed`, or `unknown`)
- `time`: The time of the last build
- `version`: The current version of the library
- `message`: Additional information about the status

You can also access a visual dashboard of the health status at:

```
http://localhost:7327/dashboard
```

## Diagnostics

For information on diagnosing problems with the j e l l i c u l e library, see the [DIAGNOSTICS.md](DIAGNOSTICS.md) file.

## Troubleshooting

For common issues and their solutions, see the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file.

## Testing

For information on testing the j e l l i c u l e library, see the [TESTING.md](TESTING.md) file.
