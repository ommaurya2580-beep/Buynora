#!/bin/bash
echo "🚀 Building Product Service Docker Image..."
docker build -t buynora-product-service -f buynora-backend/product-service/Dockerfile buynora-backend

echo "🔥 Stopping old container instance if running..."
docker stop product-service || true
docker rm product-service || true

echo "🟢 Running Product Service container on port 8082..."
docker run -d \
  --name product-service \
  --network buynora-network \
  -p 8082:8082 \
  -e MONGO_URI="${MONGO_URI:-mongodb://mongodb:27017/product_db}" \
  -e CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME:-fhmijsfw}" \
  -e CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY:-923362838263281}" \
  -e CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET:-XPDeBaU9ovyPic5nbdR9sQasVIE}" \
  -e REDIS_HOST="${REDIS_HOST:-valkey-9b95262-ommaurya2580-d113.b.aivencloud.com}" \
  -e REDIS_PORT="${REDIS_PORT:-28761}" \
  -e REDIS_USERNAME="${REDIS_USERNAME:-default}" \
  -e REDIS_PASSWORD="${REDIS_PASSWORD:-AVNS_cExv5IHgRXQHKOlP4Ya}" \
  -e REDIS_SSL="${REDIS_SSL:-true}" \
  buynora-product-service

echo "✅ Product Service deployed successfully!"
