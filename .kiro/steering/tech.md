# Technology Stack

## Backend

- **Infrastructure**: AWS CDK (Python)
- **Runtime**: Python 3.12
- **Compute**: AWS Lambda (serverless functions)
- **Database**: Amazon DynamoDB (NoSQL, pay-per-request billing)
- **API**: Amazon API Gateway (REST)
- **AI/ML**: Amazon Bedrock (Nova Premier model: `us.amazon.nova-premier-v1:0`)
- **Storage**: Amazon S3
- **Dependencies**: boto3, aws-cdk-lib, pydantic, python-dotenv

## Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Common Commands

### Backend

```bash
cd backend

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# CDK operations
cdk bootstrap              # First-time setup
cdk diff                   # Preview changes
cdk deploy                 # Deploy to AWS
cdk destroy                # Remove all resources

# Testing
pytest
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Development
npm run dev                # Start dev server (port 3000)

# Build
npm run build              # TypeScript compile + Vite build
npm run preview            # Preview production build

# Linting
npm run lint               # ESLint check
```

## Architecture Patterns

- **Serverless-first**: All compute via Lambda functions
- **Infrastructure as Code**: AWS CDK for all infrastructure
- **API-driven**: REST API with CORS enabled for all origins
- **Component-based UI**: React functional components with TypeScript
- **Query-based data fetching**: React Query for server state
- **Environment-based config**: `.env` files for frontend API URL

## Key Conventions

- Lambda timeout: 30s (standard), 60s (AI generation, data operations)
- DynamoDB removal policy: DESTROY (dev-friendly, auto-cleanup)
- Python runtime: 3.12 across all Lambda functions
- Frontend dev server: Port 3000
- API Gateway: Default CORS enabled for development
