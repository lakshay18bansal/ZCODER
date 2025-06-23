# 🚀 ZCODER Render Deployment Guide

## 📋 Prerequisites
- [Render Account](https://render.com) (free tier available)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier available)
- [GitHub Account](https://github.com) for code repository

## 🔧 Pre-Deployment Setup

### 1. **Database Setup (MongoDB Atlas)**
1. Create a MongoDB Atlas account
2. Create a new cluster (free tier: M0 Sandbox)
3. Create a database user with read/write permissions
4. Whitelist IP addresses (0.0.0.0/0 for global access)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### 2. **Environment Variables Setup**
Create these environment variables in Render dashboard:

#### Backend Environment Variables:
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/zcoder
JWT_SECRET=your_super_secure_jwt_secret_here_minimum_32_characters
FRONTEND_URL=https://your-frontend-app-name.onrender.com
```

#### Frontend Environment Variables:
```
NODE_ENV=production
REACT_APP_API_URL=https://your-backend-app-name.onrender.com
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

## 🚀 Deployment Steps

### Step 1: **Deploy Backend Service**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `zcoder-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Add Environment Variables (see above)
6. Click **"Create Web Service"**
7. Wait for deployment to complete (~5-10 minutes)
8. Note your backend URL: `https://zcoder-backend.onrender.com`

### Step 2: **Deploy Frontend Service**
1. Click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the service:
   - **Name**: `zcoder-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables (see above)
   - **Important**: Update `REACT_APP_API_URL` with your actual backend URL
5. Click **"Create Static Site"**
6. Wait for deployment to complete (~5-10 minutes)

### Step 3: **Update CORS Configuration**
1. After frontend deployment, note your frontend URL
2. Update backend environment variables:
   - Set `FRONTEND_URL` to your actual frontend URL
3. Backend will automatically redeploy and update CORS settings

## 🔗 Final URLs
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`
- **Health Check**: `https://your-backend-name.onrender.com/api/health`

## ✅ Post-Deployment Checklist

### Backend Verification:
- [ ] Visit health endpoint: `/api/health`
- [ ] Check MongoDB connection in logs
- [ ] Test API endpoints with Postman/curl

### Frontend Verification:
- [ ] Site loads without errors
- [ ] Login/Signup functionality works
- [ ] API calls are successful (check browser console)
- [ ] All features work as expected

### Performance Optimization:
- [ ] Enable compression in backend
- [ ] Set up CDN for static assets (optional)
- [ ] Monitor performance with Render metrics

## 🐛 Troubleshooting

### Common Issues:

**1. Express Path-to-Regexp Error:**
If you see errors related to `path-to-regexp` or Express routes:
```bash
# Run the fix script
./fix-backend.bat   # Windows
./fix-backend.sh    # Linux/Mac

# Or manually:
cd backend
rm -rf node_modules package-lock.json
npm install
```
This fixes Express version compatibility issues.

**2. CORS Errors:**
- Ensure `FRONTEND_URL` environment variable is correctly set
- Check that both apps are deployed and URLs are correct

**3. Database Connection Errors:**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

**4. Build Failures:**
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

**5. Environment Variables Not Working:**
- Frontend env vars must start with `REACT_APP_`
- Restart services after adding new environment variables
- Check for typos in variable names

### Free Tier Limitations:
- Services may sleep after 15 minutes of inactivity
- First request after sleep may be slow (cold start)
- 750 hours/month limit per service

## 🔄 Updates and Maintenance

### Automatic Deployments:
- Push to main branch triggers automatic redeployment
- Monitor deployment status in Render dashboard

### Manual Deployments:
- Use "Manual Deploy" button in Render dashboard
- Useful for deploying specific commits

### Monitoring:
- Check application logs in Render dashboard
- Set up health check monitoring
- Monitor resource usage

## 💡 Production Tips

1. **Security:**
   - Use strong JWT secrets (32+ characters)
   - Keep environment variables secure
   - Regular security updates

2. **Performance:**
   - Monitor MongoDB performance
   - Optimize API responses
   - Use appropriate caching strategies

3. **Backup:**
   - Regular MongoDB backups
   - Version control for all code changes
   - Document environment configurations

## 🆘 Support Resources
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---

**🎉 Congratulations! Your ZCODER application is now live on the internet!**
