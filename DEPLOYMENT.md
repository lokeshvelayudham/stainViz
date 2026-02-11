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

## 2. Deploy Backend (Render)
1.  Go to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `stainviz-backend`
    *   **Runtime**: **Docker**
    *   **Region**: Pick one close you.
    *   **Branch**: `main`
    *   **Root Directory**: Leave blank (default `.`)
    *   **Dockerfile Path**: `backend/Dockerfile` (CRITICAL: Set this or build will fail)
5.  **Environment Variables**:
    *   Add `MODEL_DIR` = `/app/model` (This ensures the code looks in the right place, assuming you committed the `model/` folder).
6.  Click **Create Web Service**.
7.  Wait for the build to finish. Once live, copy your backend URL (e.g., `https://stainviz-backend.onrender.com`).

---

## 3. Deploy Frontend (Vercel)
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Framework Preset**: Next.js (should detect automatically).
    *   **Root Directory**: `frontend` (Important! The Next.js app is in this subfolder).
5.  **Environment Variables**:
    *   Add `NEXT_PUBLIC_API_URL` = `https://stainviz-backend.onrender.com` (The URL from step 2).
6.  Click **Deploy**.

## 4. Final Verification
1.  Open your Vercel deployment URL.
2.  Upload an image and test generation.
3.  If successful, you now have a live AI web app!
