#!/bin/bash
# =========================================================
# AWS EC2 Deployment Script for Buynora Spring Cloud Gateway
# =========================================================

echo "🚀 Starting API Gateway Deployment on AWS EC2..."

# 1. Update system & install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo dnf update -y || sudo yum update -y
    sudo dnf install -y docker || sudo yum install -y docker
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
fi

echo "🌐 Ensuring 'buynora-network' exists..."
docker network inspect buynora-network >/dev/null 2>&1 || docker network create buynora-network

# 2. Build & Run Docker Container for API Gateway
echo "🔨 Building Docker image for gateway..."
docker build -t buynora-gateway -f gateway/Dockerfile .

echo "🔥 Stopping old container instance if running..."
docker stop api-gateway || true
docker rm api-gateway || true

echo "🟢 Running API Gateway container on port 8080..."
docker run -d \
  --name api-gateway \
  --network buynora-network \
  --dns 8.8.8.8 \
  --dns 1.1.1.1 \
  --restart always \
  -p 8080:8080 \
  buynora-gateway

echo "✅ API Gateway deployed successfully!"
echo "📍 Access Healthcheck: http://3.95.240.195:8080/actuator/health"
