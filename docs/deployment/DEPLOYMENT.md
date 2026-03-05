# RetailMind AI - Deployment Guide

## Quick Start (5 minutes)

### Step 1: Deploy Backend Infrastructure

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cdk deploy
```

Save the API Gateway URL from the output.

### Step 2: Seed Sample Data

Create a file `backend/lambda/data/seed_data.py` and run:

```bash
# Manually invoke via AWS Console or CLI
aws lambda invoke \
  --function-name <SEED_FUNCTION_NAME> \
  response.json
```

### Step 3: Start Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=<YOUR_API_GATEWAY_URL>" > .env
npm run dev
```

### Step 4: Test the Application

1. Open `http://localhost:3000`
2. View Dashboard
3. Click "Generate Recommendations"
4. View AI-powered recommendations

## Detailed Deployment Steps

### Prerequisites Checklist

- [ ] AWS Account with admin access
- [ ] AWS CLI installed and configured
- [ ] Python 3.12+ installed
- [ ] Node.js 18+ installed
- [ ] Amazon Bedrock access enabled (Claude models)

### Enable Amazon Bedrock

1. Go to AWS Console → Amazon Bedrock
2. Click "Model access" in left sidebar
3. Click "Manage model access"
4. Enable "Claude 3 Sonnet"
5. Click "Save changes"
6. Wait for status to show "Access granted"

### Backend Deployment

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify AWS credentials
aws sts get-caller-identity

# Bootstrap CDK (first time only)
cdk bootstrap

# Synthesize CloudFormation template (optional - to preview)
cdk synth

# Deploy infrastructure
cdk deploy

# Note the outputs:
# - API Gateway URL
# - DynamoDB table names
# - Lambda function names
```

### Seed Sample Data

Option 1: Using AWS CLI

```bash
aws lambda invoke \
  --function-name RetailMindAIStack-SeedDataFunction \
  --payload '{}' \
  response.json

cat response.json
```

Option 2: Using AWS Console

1. Go to Lambda console
2. Find "RetailMindAIStack-SeedDataFunction"
3. Click "Test" tab
4. Create new test event (empty JSON: `{}`)
5. Click "Test"

### Frontend Deployment

#### Local Development

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
VITE_API_URL=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod
EOF

# Start development server
npm run dev
```

#### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

#### Deploy to AWS Amplify (Optional)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

## Verification Steps

### 1. Test Backend APIs

```bash
# Get API Gateway URL from CDK output
API_URL="https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod"

# Test inventory endpoint
curl $API_URL/inventory

# Test recommendations endpoint
curl $API_URL/recommendations

# Generate new recommendations
curl -X POST $API_URL/recommendations
```

### 2. Test Frontend

1. Open browser to `http://localhost:3000`
2. Verify Dashboard loads with KPI cards
3. Navigate to Inventory page
4. Verify products are displayed
5. Navigate to Recommendations page
6. Click "Generate New Recommendations"
7. Verify recommendations appear

### 3. Test AI Integration

1. Go to Recommendations page
2. Click "Generate New Recommendations"
3. Wait 10-15 seconds
4. Verify recommendations include:
   - Product names
   - Current stock levels
   - Recommended quantities
   - Confidence scores
   - AI insights

## Troubleshooting

### Issue: CDK Deploy Fails

**Error**: "Need to perform AWS calls for account..."

**Solution**:
```bash
cdk bootstrap aws://ACCOUNT_ID/REGION
```

### Issue: Bedrock Access Denied

**Error**: "AccessDeniedException: Could not access model"

**Solution**:
1. Go to Bedrock console
2. Enable model access for Claude
3. Wait for approval
4. Redeploy Lambda functions

### Issue: CORS Errors in Frontend

**Error**: "Access-Control-Allow-Origin header is missing"

**Solution**:
- Verify API Gateway has CORS enabled
- Check CDK stack includes CORS configuration
- Redeploy API Gateway

### Issue: Empty Inventory/Recommendations

**Solution**:
1. Verify seed data Lambda ran successfully
2. Check DynamoDB tables have data:
```bash
aws dynamodb scan --table-name retailmind-products
aws dynamodb scan --table-name retailmind-inventory
```

### Issue: Frontend Can't Connect to API

**Solution**:
1. Verify `.env` file has correct API URL
2. Check API Gateway URL format:
   - Should include `/prod` at the end
   - Should start with `https://`
3. Restart frontend dev server

## Cleanup

To avoid AWS charges, delete all resources:

```bash
# Delete CDK stack
cd backend
cdk destroy

# Confirm deletion
# Type 'y' when prompted
```

This will delete:
- Lambda functions
- DynamoDB tables
- API Gateway
- S3 buckets
- IAM roles

## Production Considerations

Before deploying to production:

1. **Security**
   - [ ] Add Amazon Cognito authentication
   - [ ] Implement API key authentication
   - [ ] Enable AWS WAF on API Gateway
   - [ ] Use VPC for Lambda functions

2. **Monitoring**
   - [ ] Set up CloudWatch alarms
   - [ ] Enable X-Ray tracing
   - [ ] Configure log retention

3. **Performance**
   - [ ] Enable DynamoDB auto-scaling
   - [ ] Configure Lambda reserved concurrency
   - [ ] Add CloudFront for frontend

4. **Cost Optimization**
   - [ ] Review DynamoDB capacity mode
   - [ ] Set up cost alerts
   - [ ] Enable S3 lifecycle policies

## Support

For issues or questions:
1. Check CloudWatch Logs for Lambda errors
2. Review API Gateway execution logs
3. Check browser console for frontend errors
