# Quick Deployment Checklist

## Pre-Deployment (5 minutes)

- [ ] Have a GitHub account
- [ ] Have a Render account (free: https://render.com)
- [ ] Have MongoDB Atlas account (free: https://mongodb.com/cloud/atlas)

## MongoDB Setup (5 minutes)

- [ ] Create MongoDB Atlas cluster (free tier)
- [ ] Create database user with username & password
- [ ] Whitelist IP (use 0.0.0.0/0 for testing)
- [ ] Copy connection string from MongoDB Atlas

Example connection string:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/MEDICALDATABASE?retryWrites=true&w=majority
```

## GitHub Push (2 minutes)

```bash
cd /path/to/project
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Build React (2 minutes)

```bash
cd client
npm install
npm run build
cd ..
```

## Deploy on Render (5 minutes)

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repo with the project
5. Fill in service details:
   - **Name**: passenger-management-api
   - **Environment**: Node
   - **Region**: Choose closest to you (e.g., us-east-1)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Before creating**, click "Advanced" and add these environment variables:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | YOUR_MONGODB_CONNECTION_STRING |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |

7. Click "Create Web Service"
8. Wait 5-10 minutes for build & deployment

## Update Production URL (2 minutes)

After deployment is live:

1. Copy your Render app URL (e.g., `https://passenger-management-api-xyz.onrender.com`)
2. Update `.env.production` in client folder:
   ```
   REACT_APP_API_URL=https://your-app-name.onrender.com/api
   ```
3. Rebuild and push:
   ```bash
   cd client
   npm run build
   cd ..
   git add .
   git commit -m "Update production API URL"
   git push
   ```
4. Render will auto-redeploy

## Testing (5 minutes)

Visit your app: `https://your-app-name.onrender.com`

- [ ] Login page displays
- [ ] Login with `Rakib125` / `1234` works
- [ ] Passenger list loads
- [ ] Can add new passenger
- [ ] Can edit passenger
- [ ] Can delete passenger
- [ ] Date filter works
- [ ] Excel export works

## Troubleshooting

### Build failed
- Check `npm install` works locally
- Verify all dependencies in package.json
- Check Render logs: Dashboard → Service → Logs

### Login doesn't work
- Verify MongoDB connection string in Render environment
- Check MongoDB Atlas whitelist allows all IPs
- Check user exists in MongoDB

### Frontend doesn't load
- Check React build succeeded: `npm run build` locally
- Verify static file serving in server.js
- Check browser DevTools for API errors

### Slow loading
- Render free tier is slower, upgrade to Starter ($7/month)
- MongoDB Atlas free tier may need upgrades for production

## After Deployment

1. Monitor Render logs for errors
2. Test all features
3. Share app URL with users
4. Keep code pushed to main branch for auto-deployments

---

**Total time: ~20-30 minutes**

Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.
