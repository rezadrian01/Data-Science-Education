#!/bin/bash

echo "🐳 Student Performance Prediction - Docker Setup"
echo "================================================"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to check if docker-compose is available
check_docker_compose() {
    if command -v docker-compose > /dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker-compose"
    elif docker compose version > /dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
    else
        echo "❌ Docker Compose is not available"
        exit 1
    fi
    echo "✅ Docker Compose is available: $DOCKER_COMPOSE_CMD"
}

# Check prerequisites
check_docker
check_docker_compose

echo ""
echo "🔧 Building and starting services..."
echo "This may take a few minutes on first run..."

# Build and start services
$DOCKER_COMPOSE_CMD up --build -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo ""
echo "📊 Service Status:"
$DOCKER_COMPOSE_CMD ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000"
echo ""
echo "📝 Useful commands:"
echo "  View logs: $DOCKER_COMPOSE_CMD logs -f"
echo "  Stop services: $DOCKER_COMPOSE_CMD down"
echo "  Restart services: $DOCKER_COMPOSE_CMD restart"
echo "  View status: $DOCKER_COMPOSE_CMD ps"
