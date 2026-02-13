#!/bin/bash

# Exit on error
set -e

echo "🚀 Updating StainViz App (Code or Models)..."

# Configuration (Must match your existing deployment)
# We try to auto-detect the running app and registry
RESOURCE_GROUP="stainviz-rg"
APP_NAME=$(az webapp list --resource-group $RESOURCE_GROUP --query "[0].name" --output tsv)
ACR_SERVER=$(az webapp config container show --name $APP_NAME --resource-group $RESOURCE_GROUP --query registryUrl --output tsv)
# Extract ACR name from server url (remove .azurecr.io)
ACR_NAME=${ACR_SERVER%%.*} 
IMAGE_TAG="$ACR_SERVER/stainviz-backend:latest"

echo "--------------------------------"
echo "Target:"
echo "App Name: $APP_NAME"
echo "Registry: $ACR_SERVER"
echo "--------------------------------"

# 1. Login to ACR
echo "🔑 Logging into Registry..."
az acr login --name $ACR_NAME

# 2. Rebuild & Push
echo "🐳 Rebuilding Docker Image..."
# CRITICAL: Keep using linux/amd64 for Azure
docker build --platform linux/amd64 -t $IMAGE_TAG -f backend/Dockerfile .

echo "⬆️ Pushing new image..."
docker push $IMAGE_TAG

# 3. Restart App
echo "🔄 Restarting Web App to pull new image..."
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP

echo "✅ Update Complete!"
echo "Give it 5-10 minutes to pull the new image and load models."
