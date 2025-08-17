# DevMeet Step-by-Step Deployment Guide

## Prerequisites ✅
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)

## STEP 1: Prepare Your Code for Deployment

### 1.1 Open Terminal in VS Code
Press `Ctrl + Shift + ` (backtick) to open integrated terminal in VS Code

### 1.2 Check Current Directory Structure
```bash
# Check if you're in the right directory
ls
# You should see both DevMeet-Frontend and DevMeet-Backend folders
```

### 1.3 Install Git (if not already installed)
```bash
git --version
# If not installed, download from: https://git-scm.com/
```

## STEP 2: Create GitHub Repositories

### 2.1 Initialize Git for Backend
In VS Code terminal, run:
```bash
# Navigate to backend folder
cd "DevMeet-Backend"

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - DevMeet Backend"
```

### 2.2 Initialize Git for Frontend
```bash
# Navigate to frontend folder (from current directory)
cd "../DevMeet-Frontend"

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - DevMeet Frontend"
```

### 2.3 Create GitHub Repositories
1. Open browser and go to https://github.com
2. Click "New Repository" (green button)
3. Create first repository:
   - Repository name: `DevMeet-Backend`
   - Set to Public
   - Don't initialize with README
   - Click "Create repository"

4. Create second repository:
   - Repository name: `DevMeet-Frontend`
   - Set to Public
   - Don't initialize with README
   - Click "Create repository"

### 2.4 Push Backend to GitHub
In VS Code terminal:
```bash
# Make sure you're in DevMeet-Backend folder
cd "DevMeet-Backend"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/DevMeet-Backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.5 Push Frontend to GitHub
```bash
# Navigate to frontend folder
cd "../DevMeet-Frontend"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/DevMeet-Frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## STEP 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Open new browser tab: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your repositories

### 3.2 Create Web Service
1. Click "New +" button in dashboard
2. Select "Web Service"
3. Click "Build and deploy from a Git repository"
4. Click "Connect" next to your `DevMeet-Backend` repository

### 3.3 Configure Render Settings
Fill in these exact settings:
- **Name**: `devmeet-backend`
- **Region**: US East (or closest to you)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 3.4 Add Environment Variables in Render
Click "Advanced" section and add these environment variables one by one:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://balramprajapati3263:GSfhxWLajAUiT4Q0@nodeg.x9gffle.mongodb.net/
JWT_SECRET=ramlal@123
JWT_EXPIRES_IN=4d
CLOUDINARY_CLOUD_NAME=dlcnv2mkm
CLOUDINARY_API_KEY=815279987495468
CLOUDINARY_API_SECRET=qfv9n8G6ycSOfrUAvGqwEUWvzNQ
CORS_ORIGIN=https://localhost:3000
CLIENT_URL=https://localhost:3000
```

### 3.5 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. **IMPORTANT**: Copy your backend URL (looks like: `https://devmeet-backend-xxx.onrender.com`)
4. Save this URL - you'll need it for frontend deployment

## STEP 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Open new browser tab: https://vercel.com
2. Click "Start Deploying"
3. Sign up with GitHub
4. Authorize Vercel

### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Find and click "Import" next to your `DevMeet-Frontend` repository
3. Click "Import" button

### 4.3 Configure Vercel Settings
The settings should auto-detect, but verify:
- **Framework Preset**: Vite
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4.4 Add Environment Variables in Vercel
**IMPORTANT**: Before clicking Deploy:
1. Click "Environment Variables" section
2. Add these variables:

**Variable 1:**
- Name: `VITE_API_BASE_URL`
- Value: `https://your-render-backend-url.onrender.com` (use your actual URL from Step 3.5)

**Variable 2:**
- Name: `VITE_CLOUDINARY_CLOUD_NAME`
- Value: `dlcnv2mkm`

### 4.5 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. **IMPORTANT**: Copy your frontend URL (looks like: `https://devmeet-frontend-xxx.vercel.app`)

## STEP 5: Update CORS Settings

### 5.1 Update Backend CORS
1. Go back to Render dashboard
2. Click on your `devmeet-backend` service
3. Go to "Environment" tab
4. Find and edit these variables:

**Update CORS_ORIGIN:**
- Change from: `https://localhost:3000`
- Change to: `https://your-vercel-frontend-url.vercel.app` (your actual Vercel URL)

**Update CLIENT_URL:**
- Change from: `https://localhost:3000`
- Change to: `https://your-vercel-frontend-url.vercel.app` (your actual Vercel URL)

### 5.2 Redeploy Backend
1. In Render, go to "Deployments" tab
2. Click "Redeploy"
3. Wait for redeployment (3-5 minutes)

## STEP 6: Test Your Deployment

### 6.1 Test Frontend
1. Open your Vercel URL in browser
2. Try to register a new account
3. Test login functionality

### 6.2 Test All Features
- ✅ User registration and login
- ✅ Profile editing and photo upload
- ✅ Browse feed and send connection requests
- ✅ Accept/reject requests
- ✅ Real-time chat functionality

## STEP 7: Troubleshooting Common Issues

### Issue: Frontend shows "Network Error"
**Solution:** Check if VITE_API_BASE_URL is correct
```bash
# In VS Code, open DevMeet-Frontend/.env
# Verify VITE_API_BASE_URL matches your Render URL exactly
```

### Issue: Backend deployment fails
**Solution:** Check Render logs
1. Go to Render Dashboard → Your Service → Logs
2. Look for error messages
3. Most common: Missing environment variables

### Issue: "CORS Error"
**Solution:** 
1. Verify CORS_ORIGIN in Render matches your Vercel URL exactly
2. Redeploy backend after updating CORS
3. Check for typos in URLs

### Issue: Login/Authentication not working
**Solution:**
1. Check if cookies are being set
2. Verify JWT_SECRET is set in Render
3. Check browser developer tools for errors

## STEP 8: Future Updates

### To update Frontend:
```bash
# In VS Code terminal
cd "DevMeet-Frontend"
# Make your changes
git add .
git commit -m "Update frontend"
git push origin main
# Vercel will auto-deploy
```

### To update Backend:
```bash
# In VS Code terminal
cd "DevMeet-Backend"
# Make your changes
git add .
git commit -m "Update backend"
git push origin main
# Render will auto-deploy
```

## Final URLs

After successful deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

🎉 **Your DevMeet application is now live and accessible worldwide!**

## Need Help?
- Check deployment logs in Render/Vercel dashboards
- Verify all environment variables are exactly correct
- Test API endpoints manually if needed
- Check browser developer tools for errors
