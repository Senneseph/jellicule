# Jellicule UI Diagnostics Guide

This document provides information on how to diagnose problems with the Jellicule UI library.

## Logs

Logs are automatically generated and can be accessed using the following command:

```bash
docker-compose logs
```

To follow the logs in real-time:

```bash
docker-compose logs -f
```

## Health Checks

The Jellicule UI service includes a health check endpoint that can be accessed at:

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

## Alert Conditions

The following alert conditions are configured by default:

1. **Build Failure**: An alert is triggered when the build process fails.
2. **Service Unavailable**: An alert is triggered when the service is unavailable.
3. **High CPU Usage**: An alert is triggered when the CPU usage exceeds 80% for more than 5 minutes.
4. **High Memory Usage**: An alert is triggered when the memory usage exceeds 80% for more than 5 minutes.

## Monitoring

The service can be monitored using the following methods:

1. **Docker Stats**: Use the following command to monitor the resource usage of the Docker containers:

   ```bash
   docker stats
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

## Health Check Configuration

For information on how to configure the health checks, see the [HEALTH-CHECK.md](HEALTH-CHECK.md) file.
