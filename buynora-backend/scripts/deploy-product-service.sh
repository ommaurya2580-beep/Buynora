#!/bin/bash
echo "🚀 Building Product Service Docker Image..."
docker build -t buynora-product-service -f buynora-backend/product-service/Dockerfile .

echo "🔥 Stopping old container instance if running..."
docker stop product-service || true
docker rm product-service || true

echo "🟢 Running Product Service container on port 8082..."
docker run -d \
  --name product-service \
  --network buynora-network \
  -p 8082:8082 \
  -e MONGO_URI="${MONGO_URI}" \
  -e CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME}" \
  -e CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY}" \
  -e CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET}" \
  buynora-product-service

echo "✅ Product Service deployed successfully!"
