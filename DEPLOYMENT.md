# Deployment Guide - Render

## Prerequisites
1. GitHub account (push your code)
2. Render account (https://render.com - sign up free)
3. MongoDB Atlas account (https://www.mongodb.com/cloud/atlas - free tier available)

---

## Step 1: Prepare MongoDB Atlas

1. Go to MongoDB Atlas and create a free cluster
2. Create a database user with credentials
3. Whitelist your IP (or 0.0.0.0 for all IPs)
4. Copy your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/MEDICALDATABASE?retryWrites=true&w=majority
   ```

---

## Step 2: Update Server for Production

The server is already configured to serve the built React frontend. No changes needed!

Key things already in place:
- ✅ MongoDB connection via environment variables
- ✅ CORS enabled
- ✅ Express middleware configured
- ✅ API routes ready

---

## Step 3: Build React Frontend

Build the frontend locally first:

```bash
cd client
npm install
npm run build
```

This creates an optimized `build/` folder.

---

## Step 4: Update Server to Serve Frontend Build

Update `server/server.js` to serve the built React app:

```javascript
// Add this AFTER all API routes but BEFORE error handling

// Serve static files from React build
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve React app for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
```

---

## Step 5: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: passenger-management-api
    env: node
    plan: free
    branch: main
    root_dir: server
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

2. Push to GitHub:
```bash
git add .
git commit -m "Add deployment config"
git push
```

3. Go to Render Dashboard → New → Web Service
4. Connect your GitHub repo
5. Select the repo with render.yaml
6. Render will auto-configure
7. Add environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: production

### Option B: Manual Setup on Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Fill in details:
   - **Name**: passenger-management-api
   - **Environment**: Node
   - **Build Command**: cd server && npm install
   - **Start Command**: cd server && npm start
   - **Region**: Choose closest to you
   - **Plan**: Free (or Starter)

5. Add Environment Variables:
   - `MONGODB_URI`: mongodb+srv://username:password@cluster.mongodb.net/MEDICALDATABASE?retryWrites=true&w=majority
   - `PORT`: 5000
   - `NODE_ENV`: production

6. Click "Create Web Service"
7. Wait for build to complete (5-10 minutes)

---

## Step 6: Update Frontend API Calls

After deployment, update the API base URL in frontend services.

Edit `client/src/services/authService.js`:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';
```

Edit `client/src/services/passengerService.js`:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

Add `.env` file in `client/`:
```
REACT_APP_API_URL=https://your-app-name.onrender.com/api
```

Rebuild and push:
```bash
cd client
npm run build
git add .
git commit -m "Update API endpoint for production"
git push
```

---

## Step 7: Update MongoDB URI

Go to Render Dashboard:
1. Your Web Service → Environment
2. Update `MONGODB_URI` to your MongoDB Atlas URL from Step 1

---

## Step 8: Redeploy

Render will auto-redeploy when you push to GitHub. Or manually trigger:
1. Render Dashboard → Your Service → Manual Deploy

---

## Alternative Platforms

### Vercel (Frontend only) + Render (Backend)
- Deploy React to Vercel
- Deploy Node.js API to Render
- Set API_URL in Vercel env vars

### Heroku (if still available)
- Similar to Render setup
- Use `Procfile`:
```
web: node server/server.js
```

### Railway.app
- Similar to Render
- Simple GitHub connection
- Free tier available

### AWS / Google Cloud
- More complex but full control

---

## Testing Deployment

After deployment is live:

1. Visit: `https://your-app-name.onrender.com`
2. Login with: `Rakib125` / `1234`
3. Test passenger CRUD operations
4. Test date filters
5. Test Excel export

---

## Troubleshooting

### Build fails
- Check `npm install` works locally
- Verify Node version compatibility
- Check for missing environment variables

### Login fails
- Ensure MongoDB Atlas connection string is correct
- Check firewall rules allow all IPs (0.0.0.0)
- Verify login collection has test user

### Frontend doesn't load
- Check React build completed successfully
- Verify static file serving in server.js
- Check browser console for API errors

### MongoDB connection timeout
- Whitelist Render IP in MongoDB Atlas
- Or use 0.0.0.0/0 (all IPs) for testing

---

## Summary

1. ✅ Set up MongoDB Atlas (free tier)
2. ✅ Build React frontend (`npm run build`)
3. ✅ Update server.js to serve static files
4. ✅ Push to GitHub
5. ✅ Deploy to Render
6. ✅ Add environment variables
7. ✅ Update frontend API endpoints
8. ✅ Test and enjoy!

**Estimated deployment time**: 15-30 minutes

Questions? Check Render logs for errors:
- Render Dashboard → Your Service → Logs
