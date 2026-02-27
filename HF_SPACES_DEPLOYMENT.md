# Deploying StainViz Backend to Hugging Face Spaces (Free)

This guide explains how to deploy the StainViz backend to **Hugging Face Spaces** using their Free Tier. 

The StainViz ML models require about 1-2GB of RAM, which exceeds the limits of most free hosting providers (like Render or Fly.io). **Hugging Face Spaces provides a free "Docker Space" with 16GB RAM and 2 vCPUs**, making it the perfect free solution.

## Prerequisites
- A [Hugging Face](https://huggingface.co/) Account.
- Your project pushed to GitHub (including the `model/` directory with the `.pth` files).

## 1. Create a Hugging Face Space
1. Log in to [Hugging Face](https://huggingface.co/).
2. Click on your profile picture in the top right and select **New Space** (or go to [https://huggingface.co/new-space](https://huggingface.co/new-space)).
3. Fill out the form:
   - **Space name**: `stainviz-backend` (or whatever you prefer)
   - **License**: Choose your license (e.g., `mit` or leave blank)
   - **Select the Space SDK**: Choose **Docker**
   - **Docker template**: Choose **Blank**
   - **Space Hardware**: **CPU basic - 2 vCPU · 16 GB · Free**
4. Click **Create Space**.

## 2. Deploy Your Code
Hugging Face Spaces are essentially Git repositories. You have two options to get your code into the Space:

### Option A: Connect via GitHub (Recommended if code is already on GitHub)
If your code is in a public GitHub repository, you can pull it directly into the Space.
Go to the Space's **Settings** tab. Down the page, find **Pull requests & discussions**, but the easiest way is checking out via Git locally and adding the HF remote:

```bash
# Ensure you are in your project root locally
# Add Hugging face as a remote
git remote add hf https://huggingface.co/spaces/YOUR_HF_USERNAME/stainviz-backend

# Push your code
git push hf main
```
*Note: Hugging Face uses Git LFS for large files by default. If your `.pth` files fail to push due to size, you may need to initialize git lfs: `git lfs install` and `git lfs track "*.pth"`.*

### Option B: Upload Files Manually via UI
1. Go to the **Files** tab of your new Space.
2. Click **Add file** -> **Upload files**.
3. Upload your `Dockerfile`, `backend/` directory, and `model/` directory perfectly mirroring your local structure.

## 3. Wait for the Build
Once the code is pushed or uploaded, Hugging Face will automatically start building the Docker container based on your `Dockerfile`.
It will install the dependencies and start the Uvicorn server on port `7860`.

You can click the **Logs** button in the Hugging Face Space UI to watch the build and startup process. 

Once it says **Running**, your backend is live!

## 4. Get the Backend URL
In the top right corner of your Space, click the **three dots** icon (`...`) and select **Embed this Space**. 
Look for the **Direct URL** which will look something like:
`https://YOUR_HF_USERNAME-stainviz-backend.hf.space`

This is your new API URL.

## 5. Update Frontend
1. Go to your Vercel Dashboard for the StainViz frontend.
2. Navigate to **Settings** -> **Environment Variables**.
3. Update the value of `NEXT_PUBLIC_API_URL` to the Direct URL you copied above.
4. Go to **Deployments** and click **Redeploy**.

Your frontend is now talking to your free, 16GB RAM backend on Hugging Face Spaces!
