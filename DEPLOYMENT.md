# 🚀 Deployment Guide

This guide covers deploying your Lead CRM to production.

## Option 1: Deploy to Render (Recommended - Free Tier Available)

### Backend Deployment

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** lead-crm-api
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Environment Variables:**
       ```
       NODE_ENV=production
       MONGODB_URI=<your-mongodb-atlas-uri>
       JWT_SECRET=<generate-random-secret>
       CLIENT_URL=<your-frontend-url>
       ```

3. **Get Backend URL**
   - Copy the deployed URL (e.g., `https://lead-crm-api.onrender.com`)

### Frontend Deployment

1. **Update API URL**
   - In `client/.env`, update:
     ```
     REACT_APP_API_URL=https://lead-crm-api.onrender.com/api
     ```

2. **Deploy Frontend**
   - Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
   - Connect GitHub repository
   - Set base directory to `client`
   - Deploy!

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster

2. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

3. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (allow all - for Render/Vercel)

---

## Option 2: Deploy to Railway

### Full Stack Deployment

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

3. **Add MongoDB**
   - Click "New" → "Database" → "MongoDB"
   - Copy the connection string

4. **Configure Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=<railway-mongodb-uri>
   JWT_SECRET=<generate-secure-secret>
   CLIENT_URL=<your-frontend-url>
   ```

5. **Deploy Frontend Separately**
   - Use Vercel or Netlify for frontend
   - Point to Railway API URL

---

## Option 3: Deploy to Heroku

### Backend

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create lead-crm-api

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-frontend.com

# Deploy
git push heroku main
```

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client
cd client

# Deploy
vercel --prod
```

---

## Environment Variables Checklist

### Backend (.env)
```env
PORT=5000                                    # Railway/Render assigns automatically
NODE_ENV=production
MONGODB_URI=mongodb+srv://...                # From MongoDB Atlas
JWT_SECRET=super_secure_random_string_here   # Generate with: openssl rand -base64 32
CLIENT_URL=https://your-app.vercel.app       # Your frontend URL
```

### Frontend (client/.env)
```env
REACT_APP_API_URL=https://your-api.onrender.com/api
```

---

## Pre-Deployment Checklist

- [ ] Update all environment variables
- [ ] Test authentication flows
- [ ] Test all CRUD operations
- [ ] Verify MongoDB connection
- [ ] Update CORS settings for production domains
- [ ] Remove console.logs from production code
- [ ] Test on mobile devices
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Configure custom domain (optional)

---

## Post-Deployment Testing

Test these endpoints after deployment:

1. **Health Check**
   ```
   GET https://your-api.com/api/health
   ```

2. **Register User**
   ```bash
   curl -X POST https://your-api.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

3. **Login**
   ```bash
   curl -X POST https://your-api.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}'
   ```

---

## Troubleshooting

### CORS Errors
- Make sure `CLIENT_URL` in backend matches your frontend URL
- Check CORS configuration in `server/server.js`

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### Build Failures
- Check Node version compatibility
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

---

## Monitoring & Maintenance

### Recommended Tools
- **Uptime Monitoring:** UptimeRobot
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics
- **Logging:** LogRocket or Papertrail

### Regular Tasks
- Monitor API response times
- Check database size and performance
- Review error logs weekly
- Update dependencies monthly
- Backup database regularly

---

## Security Best Practices

1. **Never commit .env files** (already in .gitignore)
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable HTTPS** (automatic on most platforms)
4. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```
5. **Set up rate limiting** (future enhancement)
6. **Regular security audits**

---

## Custom Domain Setup

### For Frontend (Vercel)
1. Go to project settings
2. Add custom domain
3. Update DNS records
4. Wait for SSL certificate

### For Backend (Render)
1. Go to service settings
2. Add custom domain
3. Update DNS with CNAME record
4. SSL auto-configured

---

## Cost Estimates

### Free Tier Setup
- **MongoDB Atlas:** Free (512 MB)
- **Render/Railway:** Free tier available
- **Vercel/Netlify:** Free for personal projects
- **Total:** $0/month

### Paid Setup (Recommended for Production)
- **MongoDB Atlas:** $9-25/month
- **Render/Railway:** $7-15/month
- **Domain:** $10-15/year
- **Total:** ~$20-40/month

---

## Need Help?

If you encounter issues during deployment:
1. Check platform-specific documentation
2. Review deployment logs
3. Open an issue on GitHub
4. Join the Discord community (if available)

---

**Good luck with your deployment! 🚀**
