# 🚀 Quick Deploy Guide - Lead CRM

## ⚡ Fast Track Deployment (15 minutes)

Your MongoDB database is already set up! Just deploy frontend and backend.

---

## 📍 Step 1: Deploy Backend API (5 min)

### Deploy to Render (Free)

1. **Go to** → https://render.com/register
2. **Sign up** with your GitHub account
3. Click **"New +"** → **"Web Service"**
4. **Connect Repository**: `Samson-lgs/Future_FS_02`
5. **Configure**:
   ```
   Name:          lead-crm-backend
   Runtime:       Node
   Region:        (choose closest to you)
   Branch:        main
   Root Directory: (leave empty)
   Build Command: npm install
   Start Command: node server/server.js
   ```

   ⚠️ **Important**: Make sure Start Command is exactly `node server/server.js`

6. **Environment Variables** (Click "Advanced"):
   ```
   NODE_ENV    = production
   PORT        = 5000
   MONGODB_URI = mongodb+srv://sanjaysamson0522_db_user:sanjay0522@portfolio-cluster.fxcr1vo.mongodb.net/lead-crm?retryWrites=true&w=majority
   JWT_SECRET  = lead_crm_secret_2024_production_key_xyz123
   CLIENT_URL  = (leave empty for now)
   ```

7. **Click "Create Web Service"**
8. ⏳ Wait 3-5 minutes for deployment
   
   **While waiting, whitelist Render's IPs in MongoDB:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" → `0.0.0.0/0`
   - Click "Confirm"
   
9. **Copy your URL**: `https://lead-crm-backend-XXXX.onrender.com`

---

## 🎨 Step 2: Deploy Frontend (5 min)

### Deploy to Vercel (Free)

1. **Go to** → https://vercel.com/signup
2. **Sign up** with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. **Import** `Samson-lgs/Future_FS_02`
5. **Configure**:
   ```
   Framework Preset:  Create React App
   Root Directory:    client
   Build Command:     npm run build
   Output Directory:  build
   ```

6. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://lead-crm-backend-XXXX.onrender.com/api
   ```
   *(Use your backend URL from Step 1)*

7. **Click "Deploy"**
8. ⏳ Wait 2-3 minutes
9. **Copy your URL**: `https://your-project.vercel.app`

---

## 🔗 Step 3: Connect Frontend & Backend (2 min)

1. **Go back to Render**
2. Select your backend service
3. **Environment** → Edit `CLIENT_URL`
4. **Set value**: `https://your-project.vercel.app`
5. **Save** (triggers automatic redeploy)

---

## ✅ Step 4: Test Your Live App (3 min)

1. **Open**: `https://your-project.vercel.app`
2. **Register** a new account
3. **Login** and create a test lead
4. **Verify** all features work

---

## 🎉 You're Live!

Your CRM is now deployed at:
- **Frontend**: https://your-project.vercel.app
- **Backend**: https://lead-crm-backend-XXXX.onrender.com
- **Database**: MongoDB Atlas ✅

---

## 🔄 Auto-Deploy

Every time you `git push` to GitHub:
- Frontend auto-deploys to Vercel
- Backend auto-deploys to Render

---

## 💡 Important Notes

**Render Free Tier:**
- App sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds
- Perfect for testing/demo

**Vercel Free Tier:**
- Unlimited deployments
- Always fast (no sleep)
- 100GB bandwidth/month

---

## 🆘 Troubleshooting

**Error: "Cannot find module '/opt/render/project/src/start'"?**
- Go to your Render service → Settings
- Find "Start Command"
- Change it to: `node server/server.js`
- Click "Save Changes" (this will redeploy)

**Can't connect to database?**
- Check MongoDB Atlas Network Access
- Add IP: `0.0.0.0/0` (allow from anywhere)
- Click "Confirm"

**Frontend not loading?**
- Check Vercel deployment logs
- Verify `REACT_APP_API_URL` is correct
- Clear browser cache and reload

**Backend error?**
- Check Render logs (Logs tab)
- Verify all environment variables are set
- Check that MONGODB_URI is complete (no extra spaces)

---

## 📱 Share Your App

Your live URLs to share:
```
https://your-project.vercel.app
```

---

**Need help?** Check full guide in [DEPLOYMENT.md](./DEPLOYMENT.md)
