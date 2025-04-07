# Use the official Bun image
FROM oven/bun:latest

# Install system dependencies
RUN apt-get update && \
    apt-get install -y inotify-tools wget netcat-openbsd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY service/package.json .
RUN bun install

# Copy all files
COPY . .

# Create necessary directories
RUN mkdir -p /app/dist /app/pwa-service/dist /app/pwa-service/build-status /app/components /app/styles

# Expose ports
EXPOSE 7327 8080

# Set environment variables
ENV HTTP_PORT=7327
ENV WS_PORT=8080
ENV ROOT_DIR=/app

# Start the server
CMD ["bun", "run", "/app/service/server.js"]
