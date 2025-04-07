# Jellicule UI Health Check Guide

This document provides information on the health checks implemented in the Jellicule UI service and explains why the default alert conditions are sensible.

## Health Check Endpoint

The Jellicule UI service includes a health check endpoint that can be accessed at:

```
http://localhost:7327/health
```

This endpoint returns a JSON object with the following properties:

- `status`: The current status of the service (`success`, `failed`, or `unknown`)
- `time`: The time of the last build
- `version`: The current version of the library
- `message`: Additional information about the status

## Health Check Dashboard

A visual dashboard of the health status is available at:

```
http://localhost:7327/dashboard
```

This dashboard provides a user-friendly interface for monitoring the health of the service.

## Health Check Implementation

The health check is implemented in the `service/server.js` file. It checks the following:

1. **Build Status**: Checks if the last build was successful.
2. **Service Availability**: Checks if the service is available.
3. **Component Availability**: Checks if all required components are available.

## Default Alert Conditions

The following alert conditions are configured by default:

1. **Build Failure**: An alert is triggered when the build process fails.
   - **Rationale**: A failed build indicates that the service is not functioning correctly and requires attention.

2. **Service Unavailable**: An alert is triggered when the service is unavailable.
   - **Rationale**: If the service is unavailable, users cannot access the Jellicule UI library.

3. **High CPU Usage**: An alert is triggered when the CPU usage exceeds 80% for more than 5 minutes.
   - **Rationale**: High CPU usage can indicate a performance issue or a resource leak.

4. **High Memory Usage**: An alert is triggered when the memory usage exceeds 80% for more than 5 minutes.
   - **Rationale**: High memory usage can indicate a memory leak or insufficient resources.

## Health Check Configuration

The health check can be configured by modifying the `service/server.js` file. The following parameters can be adjusted:

- **Check Interval**: The interval at which the health check is performed.
- **Timeout**: The timeout for the health check.
- **Retries**: The number of retries before marking the service as unhealthy.

## Health Check Integration

The health check is integrated with Docker Compose. The Docker Compose configuration includes a health check that uses the health check endpoint to determine the health of the service.

```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:7327/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

This configuration ensures that Docker Compose can monitor the health of the service and take appropriate action if the service becomes unhealthy.

## Monitoring

The health check can be monitored using the following methods:

1. **Docker Compose**: Use the following command to check the health of the service:

   ```bash
   docker-compose ps
   ```

2. **Health Dashboard**: Access the health dashboard at:

   ```
   http://localhost:7327/dashboard
   ```

3. **Health Check API**: Use the health check API to programmatically monitor the service:

   ```bash
   curl http://localhost:7327/health
   ```

## Troubleshooting

For common issues and their solutions, see the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file.
