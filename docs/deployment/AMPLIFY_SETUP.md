# Quick AWS Amplify Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Deploy Backend (if not already done)
```bash
cd backend
source venv/bin/activate
cdk deploy
```
**Save the API URL from output!**

### Step 2: Set Up Amplify Console

1. Go to: https://console.aws.amazon.com/amplify/
2. Click **"New app"** → **"Host web app"**
3. Connect your **GitHub repository**: `RetailMind-AI`
4. Select branch: **`main`**
5. Amplify auto-detects `amplify.yml` ✅

### Step 3: Add Environment Variable

In Amplify Console:
1. Click **"Advanced settings"**
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/prod`
3. Click **"Save and deploy"**

### Step 4: Wait for Build (3-5 minutes)

Watch the build progress:
- ✅ Provision
- ✅ Build
- ✅ Deploy
- ✅ Verify

### Step 5: Access Your App

Your app will be live at:
```
https://main.YOUR-APP-ID.amplifyapp.com
```

## 📋 Checklist

- [ ] Backend deployed via CDK
- [ ] API Gateway URL saved
- [ ] GitHub repository connected to Amplify
- [ ] `amplify.yml` file in root directory
- [ ] Environment variable `VITE_API_URL` set in Amplify
- [ ] Build completed successfully
- [ ] App accessible at Amplify URL
- [ ] Dashboard loads with premium UI
- [ ] Theme toggle works
- [ ] AI Chat Assistant works
- [ ] API calls successful (check browser console)

## 🔧 Files You Need

### 1. `amplify.yml` (root directory)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
        - echo "VITE_API_URL=$VITE_API_URL" > .env
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### 2. Environment Variable in Amplify Console
```
VITE_API_URL=https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/prod
```

## 🔄 Continuous Deployment

Every time you push to `main`:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Amplify automatically:
1. Detects the push
2. Runs the build
3. Deploys the new version
4. Updates the live site

## 🐛 Common Issues

### Issue: "No index.html detected"
**Solution**: The `amplify.yml` file fixes this. Make sure it's in the root directory.

### Issue: API calls fail
**Solution**: 
1. Check `VITE_API_URL` is set in Amplify Console
2. Verify backend CORS allows Amplify domain
3. Check browser console for exact error

### Issue: Build fails
**Solution**: 
1. Check build logs in Amplify Console
2. Verify `npm run build` works locally
3. Check all dependencies are in `package.json`

## 💰 Cost

**Estimated Monthly Cost**: ₹300-500 (~$4-6)

- Build minutes: ₹240-400
- Hosting: ₹0.01
- Data transfer: ₹60

**Free Tier**: 1,000 build minutes/month

## 📚 Full Documentation

For detailed instructions, see:
- [Complete Amplify Deployment Guide](docs/deployment/AMPLIFY_DEPLOYMENT.md)
- [Backend Deployment Guide](docs/deployment/DEPLOYMENT.md)

## 🆘 Need Help?

1. Check build logs in Amplify Console
2. Verify environment variables are set
3. Test backend API directly with curl/Postman
4. Check browser console for frontend errors

---

**Your API URL**: `https://5z0tedmlig.execute-api.us-east-2.amazonaws.com/prod`

**Next Steps**: 
1. Commit `amplify.yml` to your repository
2. Set up Amplify in AWS Console
3. Add environment variable
4. Deploy and test!
