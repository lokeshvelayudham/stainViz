#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting StainViz Azure Deployment..."

# 1. Login Check
echo "Checking Azure login status..."
az account show > /dev/null 2>&1 || { echo "❌ Not logged in. Opening browser to login..."; az login; }

# 2. Configuration
RANDOM_ID=$((1000 + RANDOM % 9999))
RESOURCE_GROUP="stainviz-rg"
LOCATION="eastus"
ACR_NAME="stainvizacr$RANDOM_ID"
APP_PLAN="stainviz-plan"
APP_NAME="stainviz-app-$RANDOM_ID"

echo "--------------------------------"
echo "Configuration:"
echo "Resource Group: $RESOURCE_GROUP"
echo "Location:       $LOCATION"
echo "ACR Name:       $ACR_NAME"
echo "App Name:       $APP_NAME"
echo "--------------------------------"

# 3. Create Resource Group
# 3. Create Resource Group
echo "🧹 Cleaning up old resources..."
echo "NOTE: Deleting a Resource Group takes time (5-10 mins). Please be patient."

# Check if group exists
if az group exists --name $RESOURCE_GROUP --output tsv | grep -q true; then
    echo "Group exists. Deleting..."
    # We remove --no-wait so it blocks until finished.
    az group delete --name $RESOURCE_GROUP --yes
    echo "Deletion complete."
else
    echo "Group not found, skipping delete."
fi

echo "📦 Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# 4. Create Container Registry (ACR)
echo "ship Creating Container Registry (ACR)..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# 5. Build & Push Docker Image
echo "🐳 Building and Pushing Docker Image (This may take a while as it includes models)..."
az acr login --name $ACR_NAME
ACR_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
IMAGE_TAG="$ACR_SERVER/stainviz-backend:latest"

# Buildx is often better for multi-platform, but standard build is fine here
# Ensure we are in the project root
# CRITICAL: Azure runs on AMD64, so we must force the platform if building on Mac (M1/M2/M3)
docker build --platform linux/amd64 -t $IMAGE_TAG -f backend/Dockerfile .
docker push $IMAGE_TAG

# 6. Create App Service Plan
echo "🏗️ Creating App Service Plan (B1 - Basic Linux)..."
az appservice plan create --name $APP_PLAN --resource-group $RESOURCE_GROUP --sku B1 --is-linux

# 7. Create Web App
echo "🌐 Creating Web App for Containers..."
# Get ACR credentials
ACR_USER=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASS=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" --output tsv)

# Create the Web App (without credentials first)
az webapp create --resource-group $RESOURCE_GROUP --plan $APP_PLAN --name $APP_NAME \
    --deployment-container-image-name $IMAGE_TAG

# Configure Registry Credentials for the Web App
echo "🔐 Configuring Container Registry Credentials..."
az webapp config container set --name $APP_NAME --resource-group $RESOURCE_GROUP \
    --docker-custom-image-name $IMAGE_TAG \
    --docker-registry-server-url "https://$ACR_SERVER" \
    --docker-registry-server-user $ACR_USER \
    --docker-registry-server-password $ACR_PASS

# 8. Configure Environment Variables
echo "⚙️ Configuring Environment Variables..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings \
    MODEL_DIR="/app/model" \
    WEBSITES_PORT=8000 \
    SCM_DO_BUILD_DURING_DEPLOYMENT=false \
    WEBSITES_CONTAINER_START_TIME_LIMIT=1800

echo "🔓 Enabling CORS..."
az webapp cors add --resource-group $RESOURCE_GROUP --name $APP_NAME --allowed-origins "*"

echo "✅ Deployment Complete!"
echo "--------------------------------"
echo "Backend URL: https://$APP_NAME.azurewebsites.net"
echo "--------------------------------"
echo "Next Steps:"
echo "1. Copy the URL above."
echo "2. Update NEXT_PUBLIC_API_URL in your Vercel project."
echo "3. Redeploy Frontend."
