#!/bin/bash
# =========================================================
# AWS EC2 Deployment Script for Buynora User Service
# =========================================================

echo "🚀 Starting User Service Deployment on AWS EC2..."

# Change to the buynora-backend directory where the services are
cd "$(dirname "$0")/.."

# 1. Ensure SPRING_DATASOURCE_PASSWORD is set
if [ -z "$SPRING_DATASOURCE_PASSWORD" ]; then
    echo "❌ Error: SPRING_DATASOURCE_PASSWORD environment variable is not set."
    echo "Usage: export SPRING_DATASOURCE_PASSWORD='your_password' && ./scripts/deploy-user-service.sh"
    exit 1
fi

# 2. Update system & install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo dnf update -y || sudo yum update -y
    sudo dnf install -y docker || sudo yum install -y docker
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
fi

# 3. Set environment variables for Aiven MySQL
export SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL:-"jdbc:mysql://mysql-ddd8872-ommaurya2580-d113.e.aivencloud.com:28760/defaultdb?sslMode=REQUIRED"}
export SPRING_DATASOURCE_USERNAME=${SPRING_DATASOURCE_USERNAME:-"avnadmin"}

# 4. Build & Run Docker Container for User Service
echo "🔨 Building Docker image for user-service..."
docker build -t buynora-user-service -f user-service/Dockerfile .

echo "🔥 Stopping old container instance if running..."
docker stop user-service || true
docker rm user-service || true

echo "🌐 Ensuring 'buynora-network' exists..."
docker network inspect buynora-network >/dev/null 2>&1 || docker network create buynora-network

echo "🟢 Running User Service container on port 8083..."
docker run -d \
  --name user-service \
  --network buynora-network \
  --dns 8.8.8.8 \
  --dns 1.1.1.1 \
  --restart always \
  -p 8083:8083 \
  -e SPRING_DATASOURCE_URL="$SPRING_DATASOURCE_URL" \
  -e SPRING_DATASOURCE_USERNAME="$SPRING_DATASOURCE_USERNAME" \
  -e SPRING_DATASOURCE_PASSWORD="$SPRING_DATASOURCE_PASSWORD" \
  buynora-user-service

echo "✅ User Service deployed successfully!"
echo "📍 Access Healthcheck: http://<EC2_IP>:8083/actuator/health"
