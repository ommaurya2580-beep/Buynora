#!/bin/bash
# =========================================================
# AWS EC2 Deployment Script for Buynora Authentication Service
# =========================================================

echo "🚀 Starting Authentication Service Deployment on AWS EC2..."

# Change to the buynora-backend directory where the services are
cd "$(dirname "$0")/.."

# 1. Ensure SPRING_DATASOURCE_PASSWORD is set
if [ -z "$SPRING_DATASOURCE_PASSWORD" ]; then
    echo "❌ Error: SPRING_DATASOURCE_PASSWORD environment variable is not set."
    echo "Usage: export SPRING_DATASOURCE_PASSWORD='your_password' && ./scripts/deploy-auth-service.sh"
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
export JWT_SECRET=${JWT_SECRET:-"c3VwZXJzZWNyZXRqd3RzZWNyZXRrZXlmb3JidXlub3JhYXV0aGVudGljYXRpb25zZXJ2aWNlMjAyNg=="}

# 4. Build & Run Docker Container for Auth Service
echo "🔨 Building Docker image for authentication-service..."
docker build -t buynora-auth-service -f authentication-service/Dockerfile .

echo "🔥 Stopping old container instance if running..."
docker stop auth-service || true
docker rm auth-service || true

echo "🌐 Ensuring 'buynora-network' exists..."
docker network inspect buynora-network >/dev/null 2>&1 || docker network create buynora-network

echo "🟢 Running Authentication Service container on port 8081..."
docker run -d \
  --name auth-service \
  --network buynora-network \
  --dns 8.8.8.8 \
  --dns 1.1.1.1 \
  --restart always \
  -p 8081:8081 \
  -e SPRING_DATASOURCE_URL="$SPRING_DATASOURCE_URL" \
  -e SPRING_DATASOURCE_USERNAME="$SPRING_DATASOURCE_USERNAME" \
  -e SPRING_DATASOURCE_PASSWORD="$SPRING_DATASOURCE_PASSWORD" \
  -e JWT_SECRET="$JWT_SECRET" \
  buynora-auth-service

echo "✅ Authentication Service deployed successfully!"
echo "📍 Access Healthcheck: http://3.95.240.195:8081/actuator/health"
echo "📍 API Documentation: http://3.95.240.195:8081/swagger-ui.html"
