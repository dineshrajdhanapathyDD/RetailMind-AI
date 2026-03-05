# Data Seeding Feature

## Overview
The RetailMind AI application now includes a convenient data seeding feature that allows you to quickly populate your database with sample products and inventory data for testing and demonstration purposes.

## Features

### Frontend
- **Seed Data Button**: Located in the Dashboard hero section (top right)
- **Modal Interface**: Beautiful modal with sample data preview
- **Sample Products Display**: Shows 5 sample products with details:
  - Wireless Mouse ($29.99, 5 in stock)
  - USB-C Cable ($12.99, 25 in stock)
  - Laptop Stand ($49.99, 8 in stock)
  - Mechanical Keyboard ($89.99, 0 in stock)
  - Webcam HD ($69.99, 12 in stock)
- **Loading States**: Visual feedback during data loading
- **Success Confirmation**: Shows success message and auto-refreshes data

### Backend
- **New Lambda Function**: `SeedDataFunction`
- **API Endpoint**: `POST /seed`
- **Data Seeded**:
  - 5 products in `retailmind-products` table
  - 5 inventory items in `retailmind-inventory` table

## How to Use

1. **Open the Dashboard**: Navigate to the main dashboard page
2. **Click "Seed Data"**: Button located in the top-right of the hero section
3. **Review Sample Data**: Modal shows preview of products to be loaded
4. **Click "Load Sample Data"**: Initiates the seeding process
5. **Wait for Confirmation**: Success message appears when complete
6. **Data Refreshes**: Page automatically reloads to show new data

## API Details

### Endpoint
```
POST https://5z0tedmlig.execute-api.us-east-2.amazonaws.com/prod/seed
```

### Response
```json
{
  "message": "Data seeded successfully",
  "productsCount": 5,
  "inventoryCount": 5
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Technical Implementation

### Files Modified
- `frontend/src/pages/Dashboard.tsx` - Added modal integration
- `frontend/src/components/DataUploadModal.tsx` - Created modal component
- `frontend/src/config.ts` - Added seed endpoint
- `backend/lambda/data/seed_data.py` - Created Lambda function
- `backend/stacks/infrastructure_stack.py` - Added Lambda and API Gateway route
- `frontend/.env` - Updated API URL

### Lambda Function
- **Runtime**: Python 3.12
- **Timeout**: 30 seconds
- **Environment Variables**:
  - `PRODUCTS_TABLE`: retailmind-products
  - `INVENTORY_TABLE`: retailmind-inventory
- **IAM Permissions**: Read/write access to DynamoDB tables

## Benefits

1. **Quick Testing**: Instantly populate database for testing
2. **Demo Ready**: Perfect for demonstrations and presentations
3. **Consistent Data**: Same sample data every time
4. **User Friendly**: Simple one-click operation
5. **Visual Feedback**: Clear loading and success states

## Future Enhancements

Potential improvements for future versions:
- Upload custom CSV/JSON files
- Clear existing data before seeding
- Multiple data sets to choose from
- Bulk data import from external sources
- Data validation and error reporting
