# AWS Amplify Deployment Guide

This guide covers deploying the RetailMind AI frontend to AWS Amplify.

## Architecture Overview

- **Frontend**: AWS Amplify (React + Vite)
- **Backend**: AWS CDK (Lambda, DynamoDB, API Gateway, Bedrock)
- **Deployment**: Separate deployments with API Gateway URL connection

## Prerequisites

1. AWS Account with appropriate permissions
2. Backend already deployed via CDK (see [DEPLOYMENT.md](./DEPLOYMENT.md))
3. API Gateway URL from backend deployment
4. GitHub repository connected to AWS Amplify

## Step 1: Deploy Backend First

Before deploying the frontend, ensure your backend is deployed:

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
cdk deploy
```

**Save the API Gateway URL** from the CDK output:
```
Outputs:
InfrastructureStack.ApiEndpoint = https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/prod
```

## Step 2: Set Up AWS Amplify

### Option A: AWS Console (Recommended)

1. **Go to AWS Amplify Console**
   - Navigate to: https://console.aws.amazon.com/amplify/
   - Click "New app" → "Host web app"

2. **Connect Repository**
   - Select "GitHub" as your Git provider
   - Authorize AWS Amplify to access your repository
   - Select your repository: `RetailMind-AI`
   - Select branch: `main` (or your default branch)

3. **Configure Build Settings**
   - Amplify will auto-detect the `amplify.yml` file
   - Review the build settings (should match the amplify.yml)
   - Click "Next"

4. **Add Environment Variables**
   - Click "Advanced settings"
   - Add environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/prod`
   - Click "Next"

5. **Review and Deploy**
   - Review all settings
   - Click "Save and deploy"
   - Wait for the build to complete (3-5 minutes)

### Option B: AWS CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in your project
cd RetailMind-AI
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

## Step 3: Configure Environment Variables in Amplify Console

1. **Navigate to your Amplify app**
   - Go to: AWS Amplify Console → Your App

2. **Go to Environment Variables**
   - Click "App settings" → "Environment variables"

3. **Add the API URL**
   - Click "Manage variables"
   - Add variable:
     - Variable name: `VITE_API_URL`
     - Value: `https://YOUR-API-ID.execute-api.us-east-2.amazonaws.com/prod`
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy this version" on the latest deployment

## Step 4: Verify Deployment

1. **Access Your App**
   - Find your Amplify URL: `https://main.YOUR-APP-ID.amplifyapp.com`
   - Open in browser

2. **Test Functionality**
   - ✅ Dashboard loads with premium UI
   - ✅ Theme toggle works (light/dark mode)
   - ✅ AI Chat Assistant opens
   - ✅ Navigate to Inventory page
   - ✅ Navigate to Recommendations page
   - ✅ Click "Seed Data" button
   - ✅ Load sample data successfully
   - ✅ Generate AI recommendations
   - ✅ Accept/Dismiss recommendations work

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Check for any errors
   - Verify API calls are going to correct endpoint

## Continuous Deployment

AWS Amplify automatically deploys when you push to your connected branch:

```bash
# Make changes to frontend
cd frontend
# ... make your changes ...

# Commit and push
git add .
git commit -m "Update frontend"
git push origin main

# Amplify will automatically:
# 1. Detect the push
# 2. Run the build from amplify.yml
# 3. Deploy the new version
# 4. Update the live site
```

## Build Configuration (amplify.yml)

The `amplify.yml` file in the root directory configures the build:

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

**Key Points:**
- `preBuild`: Installs dependencies and creates `.env` file from environment variable
- `build`: Runs Vite production build
- `artifacts.baseDirectory`: Points to `frontend/dist` where Vite outputs files
- `cache`: Caches `node_modules` for faster builds

## Custom Domain (Optional)

1. **Go to Domain Management**
   - Amplify Console → Your App → "Domain management"

2. **Add Custom Domain**
   - Click "Add domain"
   - Enter your domain (e.g., `retailmind.example.com`)
   - Follow DNS configuration instructions

3. **SSL Certificate**
   - Amplify automatically provisions SSL certificate
   - Wait for DNS propagation (can take up to 48 hours)

## Environment-Specific Deployments

### Development Environment

```bash
# Create a dev branch
git checkout -b dev

# Push to GitHub
git push origin dev

# In Amplify Console:
# 1. Go to "App settings" → "Branch management"
# 2. Click "Connect branch"
# 3. Select "dev" branch
# 4. Add environment variable for dev API:
#    VITE_API_URL=https://YOUR-DEV-API-ID.execute-api.us-east-2.amazonaws.com/prod
```

### Production Environment

- Use `main` branch for production
- Set production API URL in environment variables
- Enable branch protection in GitHub

## Monitoring and Logs

### Build Logs

1. Go to Amplify Console → Your App
2. Click on a deployment
3. View build logs for each phase:
   - Provision
   - Build
   - Deploy
   - Verify

### Access Logs

1. Go to "Monitoring" tab
2. View:
   - Request count
   - Data transfer
   - Error rates
   - Response times

### CloudWatch Integration

Amplify automatically sends logs to CloudWatch:
- Log group: `/aws/amplify/YOUR-APP-ID`
- View in CloudWatch Console

## Troubleshooting

### Build Fails: "No index.html detected"

**Problem**: Amplify can't find the built files

**Solution**: 
- Verify `amplify.yml` exists in root directory
- Check `baseDirectory: frontend/dist` is correct
- Ensure `npm run build` completes successfully

### API Calls Fail with CORS Error

**Problem**: Backend CORS not configured for Amplify domain

**Solution**:
```python
# In backend/stacks/infrastructure_stack.py
api = apigateway.RestApi(
    self, "RetailMindApi",
    rest_api_name="RetailMind API",
    default_cors_preflight_options=apigateway.CorsOptions(
        allow_origins=["*"],  # Or specify your Amplify domain
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )
)
```

### Environment Variable Not Working

**Problem**: `VITE_API_URL` is undefined in the app

**Solution**:
1. Check environment variable is set in Amplify Console
2. Verify `amplify.yml` creates `.env` file in preBuild
3. Redeploy after adding environment variable
4. Check `frontend/src/config.ts` reads from `import.meta.env.VITE_API_URL`

### Build Takes Too Long

**Problem**: Build exceeds 15 minutes

**Solution**:
- Enable caching in `amplify.yml` (already configured)
- Use `npm ci` instead of `npm install` (already configured)
- Consider upgrading Amplify build compute type

## Cost Estimation

**AWS Amplify Pricing (India Region):**

- **Build minutes**: ₹8 per build minute
  - Average build: 3-5 minutes = ₹24-40 per build
  - ~10 builds/month = ₹240-400/month

- **Hosting**: ₹1.20 per GB stored
  - Frontend bundle: ~5-10 MB = ₹0.01/month

- **Data transfer**: ₹60 per GB
  - Light usage: ~1 GB/month = ₹60/month

**Total Estimated Cost**: ₹300-500/month (~$4-6/month)

**Free Tier**:
- 1,000 build minutes/month
- 15 GB data transfer/month
- 5 GB storage

## Best Practices

1. **Use Environment Variables**
   - Never commit API URLs to code
   - Use Amplify environment variables
   - Different URLs for dev/staging/prod

2. **Enable Branch Deployments**
   - `main` → Production
   - `dev` → Development
   - Feature branches → Preview deployments

3. **Monitor Build Times**
   - Keep builds under 5 minutes
   - Use caching effectively
   - Optimize dependencies

4. **Security**
   - Enable HTTPS only (default)
   - Use custom domain with SSL
   - Configure proper CORS on backend

5. **Performance**
   - Enable Amplify CDN (default)
   - Optimize bundle size
   - Use code splitting

## Updating the Deployment

### Update Frontend Code

```bash
# Make changes
cd frontend
# ... edit files ...

# Test locally
npm run dev

# Build and test
npm run build
npm run preview

# Commit and push
git add .
git commit -m "Update: description of changes"
git push origin main

# Amplify auto-deploys
```

### Update Backend API URL

```bash
# Deploy new backend
cd backend
cdk deploy

# Get new API URL from output
# Update in Amplify Console:
# App settings → Environment variables → VITE_API_URL

# Redeploy frontend
# Deployments → Redeploy this version
```

## Rollback

If a deployment fails or has issues:

1. Go to Amplify Console → Your App → "Deployments"
2. Find the last working deployment
3. Click "Redeploy this version"
4. Confirm rollback

## Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Vite Build Configuration](https://vitejs.dev/guide/build.html)
- [Backend Deployment Guide](./DEPLOYMENT.md)
- [Cleanup Guide](./CLEANUP.md)

---

**Need Help?**
- Check build logs in Amplify Console
- Review CloudWatch logs
- Verify environment variables are set correctly
- Ensure backend is deployed and accessible
