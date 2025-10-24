#!/bin/bash

echo "🛑 Stopping Student Performance Prediction Services"
echo "=================================================="

# Function to check if docker-compose is available
if command -v docker-compose > /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose is not available"
    exit 1
fi

echo "🔄 Stopping and removing containers..."
$DOCKER_COMPOSE_CMD down

echo "🧹 Removing unused images (optional)..."
read -p "Do you want to remove unused Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker image prune -f
    echo "✅ Unused images removed"
fi

echo "🎉 All services stopped successfully!"
