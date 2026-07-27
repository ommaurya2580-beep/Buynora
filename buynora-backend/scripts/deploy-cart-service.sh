#!/bin/bash
# =========================================================
# AWS EC2 Deployment Script for Buynora Cart Service
# =========================================================

echo "🚀 Starting Cart Service Deployment on AWS EC2..."

# Change to the buynora-backend directory where the services are
cd "$(dirname "$0")/.."

# 1. Update system & install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo dnf update -y || sudo yum update -y
    sudo dnf install -y docker || sudo yum install -y docker
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
fi

# 2. Set environment variables for Redis
export REDIS_HOST=${REDIS_HOST:-"redis-17366.c10.us-east-1-2.ec2.redns.redis-cloud.com"}
export REDIS_PORT=${REDIS_PORT:-"17366"}
export REDIS_USERNAME=${REDIS_USERNAME:-"default"}
# Ensure REDIS_PASSWORD is provided
if [ -z "$REDIS_PASSWORD" ]; then
    export REDIS_PASSWORD="your_redis_password_here" # It should ideally be exported by the user before running
fi
export REDIS_SSL=${REDIS_SSL:-"false"}

# 3. Build & Run Docker Container for Cart Service
echo "🔨 Building Docker image for cart-service..."
docker build -t buynora-cart-service -f cart-service/Dockerfile .

echo "🔥 Stopping old container instance if running..."
docker stop cart-service || true
docker rm cart-service || true

echo "🌐 Ensuring 'buynora-network' exists..."
docker network inspect buynora-network >/dev/null 2>&1 || docker network create buynora-network

echo "🟢 Running Cart Service container on port 8089..."
docker run -d \
  --name cart-service \
  --network buynora-network \
  --dns 8.8.8.8 \
  --dns 1.1.1.1 \
  --restart always \
  -p 8089:8089 \
  -e REDIS_HOST="$REDIS_HOST" \
  -e REDIS_PORT="$REDIS_PORT" \
  -e REDIS_USERNAME="$REDIS_USERNAME" \
  -e REDIS_PASSWORD="$REDIS_PASSWORD" \
  -e REDIS_SSL="$REDIS_SSL" \
  buynora-cart-service

echo "✅ Cart Service deployed successfully!"
echo "📍 Access Healthcheck: http://3.95.240.195:8089/actuator/health"
