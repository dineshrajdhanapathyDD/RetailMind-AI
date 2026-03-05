# Project Structure

## Root Organization

```
RetailMind-AI/
├── backend/           # AWS CDK infrastructure and Lambda functions
├── frontend/          # React TypeScript application
├── docs/              # All project documentation
├── templates/         # Data import templates (CSV/JSON)
├── generated-diagrams/# Architecture diagrams
└── .kiro/             # Kiro configuration and specs
```

## Backend Structure

```
backend/
├── app.py                    # CDK app entry point
├── requirements.txt          # Python dependencies
├── cdk.json                  # CDK configuration
├── stacks/
│   ├── infrastructure_stack.py  # Main CDK stack definition
│   └── __init__.py
└── lambda/
    ├── inventory/
    │   └── get_inventory.py     # GET /inventory handler
    ├── recommendations/
    │   ├── generate_recommendations.py  # POST /recommendations
    │   ├── get_recommendations.py       # GET /recommendations
    │   └── update_recommendation.py     # PATCH /recommendations/{id}
    └── data/
        ├── seed_data.py         # POST /seed handler
        └── clear_all_data.py    # DELETE /clear-all handler
```

### Backend Conventions

- Each Lambda function is a separate file with a `handler` function
- Lambda code organized by domain (inventory, recommendations, data)
- Infrastructure defined in single stack (`infrastructure_stack.py`)
- Environment variables passed to Lambda for table names and config
- All Lambda functions use the same IAM role with Bedrock + DynamoDB access

## Frontend Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env                    # API URL configuration
├── public/
│   └── placeholder.svg
└── src/
    ├── main.tsx           # Application entry point
    ├── App.tsx            # Root component with routing
    ├── index.css          # Global styles + Tailwind
    ├── config.ts          # Environment config
    ├── components/
    │   ├── Layout.tsx              # Main layout with navigation
    │   ├── DataUploadModal.tsx     # Data seeding modal
    │   ├── RetailBackground.tsx    # Background component
    │   └── RetailImageGallery.tsx  # Image gallery component
    └── pages/
        ├── Dashboard.tsx           # Main dashboard page
        ├── Inventory.tsx           # Inventory listing page
        └── Recommendations.tsx     # AI recommendations page
```

### Frontend Conventions

- Pages represent routes (Dashboard, Inventory, Recommendations)
- Components are reusable UI elements
- Layout component wraps all pages with navigation
- Config file reads from environment variables
- TypeScript strict mode enabled
- Functional components with hooks (no class components)

## Documentation Structure

```
docs/
├── README.md                    # Documentation index
├── deployment/
│   ├── DEPLOYMENT.md           # AWS deployment guide
│   ├── CLEANUP.md              # Resource cleanup guide
│   └── BEDROCK_MODEL_UPDATE.md # Bedrock configuration
├── features/
│   ├── FRONTEND_ENHANCEMENTS.md
│   ├── IMAGE_INTEGRATION.md
│   ├── DATA_SEEDING.md
│   ├── INR_AND_FILE_UPLOAD_UPDATE.md
│   ├── RECOMMENDATIONS_INR_AND_ACTIONS.md
│   └── TASK_8_COMPLETION.md
└── templates/
    └── TEMPLATE_FILES_README.md
```

### Documentation Conventions

- Deployment docs in `deployment/` folder
- Feature-specific docs in `features/` folder
- Template guides in `templates/` folder
- Main README links to all documentation
- Each doc is self-contained with examples

## AWS Resources

### DynamoDB Tables
- `retailmind-products` - Product catalog (PK: productId)
- `retailmind-inventory` - Inventory levels (PK: storeId, SK: productId)
- `retailmind-recommendations` - AI recommendations (PK: recommendationId, SK: timestamp)

### Lambda Functions
- `GetInventoryFunction` - Fetch inventory data
- `GenerateRecommendationsFunction` - Generate AI recommendations
- `GetRecommendationsFunction` - Fetch recommendations
- `UpdateRecommendationFunction` - Accept/dismiss recommendations
- `SeedDataFunction` - Load sample or custom data
- `ClearAllDataFunction` - Clear all data from tables

### API Endpoints
- `GET /inventory` - List all inventory items
- `GET /recommendations` - List pending recommendations
- `POST /recommendations` - Generate new AI recommendations
- `PATCH /recommendations/{id}` - Update recommendation status
- `POST /seed` - Seed data (sample or file upload)
- `DELETE /clear-all` - Clear all data

## File Naming Conventions

- Python: snake_case (e.g., `infrastructure_stack.py`)
- TypeScript/React: PascalCase for components (e.g., `Dashboard.tsx`)
- Config files: lowercase with dots (e.g., `vite.config.ts`)
- Documentation: UPPERCASE.md (e.g., `DEPLOYMENT.md`)
- Templates: lowercase-with-dashes (e.g., `sample-data-template.csv`)

## Import Patterns

### Backend (Python)
```python
from aws_cdk import Stack, aws_lambda as lambda_
from constructs import Construct
import boto3
```

### Frontend (TypeScript)
```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
```

## Key Files to Know

- `backend/app.py` - CDK application entry point
- `backend/stacks/infrastructure_stack.py` - All AWS resources defined here
- `frontend/src/App.tsx` - React routing configuration
- `frontend/src/config.ts` - API URL configuration
- `frontend/.env` - Environment variables (not in git)
- `README.md` - Project overview and quick start
