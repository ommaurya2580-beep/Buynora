#!/bin/bash
# =========================================================
# AWS EC2 Deployment Script for Buynora Nginx Reverse Proxy
# =========================================================

echo "🚀 Starting Nginx Deployment on AWS EC2..."

# 1. Update system & install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo dnf update -y || sudo yum update -y
    sudo dnf install -y nginx || sudo yum install -y nginx
    sudo systemctl enable --now nginx
fi

# 2. Copy the Nginx configuration file
echo "⚙️ Configuring Nginx..."
sudo cp nginx/nginx.conf /etc/nginx/conf.d/buynora.conf

# 3. Test and Restart Nginx
echo "🔄 Restarting Nginx..."
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo "✅ Nginx deployed successfully and is now running!"
    echo "📍 Access API: http://3.95.240.195/api/auth/register"
else
    echo "❌ Nginx configuration test failed. Please check the config."
    exit 1
fi
