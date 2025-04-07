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
COPY package.json .
RUN bun install

# Copy server files
COPY . .

# Default command (can be overridden in docker-compose.yaml)
CMD ["bun", "run", "websocket-server.js"]
