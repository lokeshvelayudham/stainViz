# Deploying StainViz Backend to Azure

This guide explains how to deploy the StainViz backend to **Azure Web App for Containers** to handle the memory requirements of the CycleGAN models.

## Prerequisites
- Azure CLI installed (`az --version` should show version > 2.0).
- An active Azure Subscription.
- Docker running locally.

## 1. Login to Azure
```bash
az login
```

## 2. Create Requirements
We need a Resource Group and a Container Registry (ACR) to store our Docker image.

```bash
# Set variables
RESOURCE_GROUP="stainviz-rg"
LOCATION="eastus"
acrName="stainvizacr$RANDOM" # Must be unique

# Create Resource Group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Container Registry
az acr create --resource-group $RESOURCE_GROUP --name $acrName --sku Basic --admin-enabled true

# Login to ACR
az acr login --name $acrName
```

## 3. Build and Push Image
We will build the image and push it to your private Azure Registry.

```bash
# Get the login server name
acrServer=$(az acr show --name $acrName --query loginServer --output tsv)

# Build the image (tagging it with the ACR server)
# Make sure you are in the project root!
docker build -t $acrServer/stainviz-backend:latest -f backend/Dockerfile .

# Push to Azure
docker push $acrServer/stainviz-backend:latest
```

## 4. Create App Service
Now we create the Web App that runs the container. We use the **B1** plan (Basic) or higher to ensure enough memory (CycleGAN needs ~1-2GB RAM).

```bash
# Create App Service Plan (Linux)
az appservice plan create --name stainviz-plan --resource-group $RESOURCE_GROUP --sku B1 --is-linux

# Get ACR Credentials
acrPassword=$(az acr credential show --name $acrName --query "passwords[0].value" --output tsv)
acrUser=$(az acr credential show --name $acrName --query username --output tsv)

# Create the Web App
appName="stainviz-backend-$RANDOM"

az webapp create --resource-group $RESOURCE_GROUP --plan stainviz-plan --name $appName \
    --deployment-container-image-name $acrServer/stainviz-backend:latest \
    --docker-registry-server-url "https://$acrServer" \
    --docker-registry-server-user $acrUser \
    --docker-registry-server-password $acrPassword

# Configure Environment Variables
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $appName --settings MODEL_DIR="/app/model" WEBSITES_PORT=8000
```

## 5. Deployment Complete!
Your backend is now running.
Get the URL:
```bash
echo "Backend URL: https://$appName.azurewebsites.net"
```

## 6. Update Frontend
1.  Copy the URL above.
2.  Go to Vercel.
3.  Update the `NEXT_PUBLIC_API_URL` environment variable to your new Azure URL.
4.  Redeploy Vercel.
