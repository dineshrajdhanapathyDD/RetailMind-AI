# RetailMind AI - MVP

An AWS-powered intelligent retail decision engine that leverages Amazon Bedrock for AI-powered inventory recommendations and automated business actions.

## Architecture

- **Backend**: AWS CDK (Python), Lambda, DynamoDB, API Gateway, Amazon Bedrock
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **AI**: Amazon Bedrock (Claude model) for intelligent recommendations

## Features

✅ Real-time inventory monitoring
✅ AI-powered recommendations using Amazon Bedrock
✅ Automated reorder suggestions
✅ Interactive dashboard with KPIs
✅ Serverless architecture

## Prerequisites

- Python 3.12+
- Node.js 18+
- AWS Account with Bedrock access
- AWS CLI configured

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy infrastructure
cdk deploy
```

### 2. Seed Sample Data

After deployment, run the seed data Lambda function:

```bash
aws lambda invoke \
  --function-name RetailMindAIStack-SeedDataFunction \
  --payload '{}' \
  response.json
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=<YOUR_API_GATEWAY_URL>" > .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Generate Recommendations

1. Open the dashboard at `http://localhost:3000`
2. Click "Generate Recommendations" button
3. View AI-powered recommendations in the Recommendations page

## Project Structure

```
RetailMind-AI/
├── backend/
│   ├── stacks/
│   │   └── infrastructure_stack.py
│   ├── lambda/
│   │   ├── inventory/
│   │   ├── recommendations/
│   │   └── data/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /inventory` - Get all inventory items
- `GET /recommendations` - Get all recommendations
- `POST /recommendations` - Generate new recommendations

## AWS Services Used

- **Amazon Bedrock**: AI-powered recommendation generation
- **AWS Lambda**: Serverless compute for business logic
- **Amazon DynamoDB**: NoSQL database for products, inventory, and recommendations
- **Amazon API Gateway**: RESTful API endpoints
- **Amazon S3**: Data storage
- **AWS CDK**: Infrastructure as Code

## Cost Optimization

This MVP uses:
- DynamoDB On-Demand pricing (pay per request)
- Lambda with minimal memory allocation
- API Gateway REST API (cheaper than HTTP API for MVP)
- S3 Standard storage

Estimated monthly cost: $5-20 for development/testing

## Next Steps

- [ ] Add Amazon Cognito authentication
- [ ] Implement Step Functions for automated workflows
- [ ] Add real-time updates with AppSync
- [ ] Deploy frontend to AWS Amplify
- [ ] Add CloudWatch monitoring and alarms
- [ ] Implement automated testing

## Troubleshooting

### Bedrock Access Denied

Ensure your AWS account has access to Amazon Bedrock:
1. Go to AWS Console → Bedrock
2. Request model access for Claude models
3. Wait for approval (usually instant)

### CDK Deploy Fails

```bash
# Check AWS credentials
aws sts get-caller-identity

# Ensure CDK is bootstrapped
cdk bootstrap aws://ACCOUNT-ID/REGION
```

### Frontend Can't Connect to API

1. Check API Gateway URL in `.env` file
2. Ensure CORS is enabled on API Gateway
3. Check browser console for errors

## License

MIT
