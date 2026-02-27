# Deployment Guide: StainViz

This guide explains how to deploy the StainViz application with a **Python Backend on Render** and a **Next.js Frontend on Vercel**.

## Prerequisites
- GitHub Account
- [Render Account](https://render.com)
- [Vercel Account](https://vercel.com)
- Git installed locally

## 1. Push to GitHub
Ensure your code is pushed to a GitHub repository.
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stainViz.git
git push -u origin main
```
**CRITICAL:** We have un-ignored the `model/` directory. When you run `git add .`, it *will* include the `.pth` files (about 90MB total). This is intentional so Render can access them.

---

## 2. Deploy Backend (Hugging Face Spaces - FREE & 16GB RAM)
Because the ML models require 1-2GB of RAM, traditional free tiers (like Render) will crash with Out Of Memory errors. **Hugging Face Spaces** provides 16GB RAM perfectly suited for our Docker container.

Please refer to the detailed guide: **[HF_SPACES_DEPLOYMENT.md](./HF_SPACES_DEPLOYMENT.md)** for step-by-step instructions on deploying the backend container to Hugging Face.

Once deployed on Hugging Face, copy your Space's Direct URL for the next step.

---

## 3. Deploy Frontend (Vercel)
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Framework Preset**: Next.js (should detect automatically).
    *   **Root Directory**: `frontend` (Important! The Next.js app is in this subfolder).
5.  **Environment Variables**:
    *   Add `NEXT_PUBLIC_API_URL` = `https://low-keyy-stainviz-backend.hf.space` (The URL from step 2).
6.  Click **Deploy**.

## 4. Final Verification
1.  Open your Vercel deployment URL.
2.  Upload an image and test generation.
3.  If successful, you now have a live AI web app!
