# Data Upload Template Files

## Overview
This folder contains template files for uploading custom product and inventory data to RetailMind AI.

## Available Templates

### 1. CSV Template (`sample-data-template.csv`)
- **Format**: Comma-Separated Values
- **Products**: 10 sample products
- **Best For**: Excel users, bulk data entry
- **How to Use**:
  1. Open in Excel, Google Sheets, or any spreadsheet software
  2. Modify existing rows or add new ones
  3. Keep the header row unchanged
  4. Save as CSV format
  5. Upload via RetailMind AI dashboard

### 2. JSON Template (`sample-data-template.json`)
- **Format**: JavaScript Object Notation
- **Products**: 10 sample products
- **Best For**: Developers, API integrations
- **How to Use**:
  1. Open in any text editor
  2. Add/modify products in the `products` array
  3. Maintain valid JSON syntax
  4. Save the file
  5. Upload via RetailMind AI dashboard

## Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `productId` | String | Yes | Unique product identifier | PROD001 |
| `name` | String | Yes | Product name | Wireless Mouse |
| `sku` | String | Yes | Stock Keeping Unit | WM-001 |
| `category` | String | Yes | Product category | Electronics |
| `brand` | String | Yes | Brand name | TechPro |
| `price` | Number | Yes | Selling price in INR | 2499 |
| `cost` | Number | Yes | Cost price in INR | 1250 |
| `currency` | String | Yes | Currency code | INR |
| `storeId` | String | Yes | Store identifier | STORE001 |
| `currentStock` | Number | Yes | Current stock quantity | 5 |
| `reservedStock` | Number | Yes | Reserved/allocated stock | 0 |
| `availableStock` | Number | Yes | Available for sale | 5 |
| `reorderPoint` | Number | Yes | Minimum stock before reorder | 10 |
| `maxStock` | Number | Yes | Maximum stock capacity | 50 |

## CSV Format Example

```csv
productId,name,sku,category,brand,price,cost,currency,storeId,currentStock,reservedStock,availableStock,reorderPoint,maxStock
PROD001,Wireless Mouse,WM-001,Electronics,TechPro,2499,1250,INR,STORE001,5,0,5,10,50
PROD002,USB-C Cable,UC-002,Electronics,TechPro,1099,450,INR,STORE001,25,2,23,20,100
```

## JSON Format Example

```json
{
  "products": [
    {
      "productId": "PROD001",
      "name": "Wireless Mouse",
      "sku": "WM-001",
      "category": "Electronics",
      "brand": "TechPro",
      "price": 2499,
      "cost": 1250,
      "currency": "INR",
      "storeId": "STORE001",
      "currentStock": 5,
      "reservedStock": 0,
      "availableStock": 5,
      "reorderPoint": 10,
      "maxStock": 50
    }
  ]
}
```

## Sample Products Included

The templates include 10 sample products:

1. **Wireless Mouse** - ₹2,499 (5 in stock)
2. **USB-C Cable** - ₹1,099 (25 in stock)
3. **Laptop Stand** - ₹4,199 (8 in stock)
4. **Mechanical Keyboard** - ₹7,499 (0 in stock - triggers alerts)
5. **Webcam HD** - ₹5,899 (12 in stock)
6. **Bluetooth Speaker** - ₹3,499 (15 in stock)
7. **Phone Charger** - ₹899 (30 in stock)
8. **Monitor Stand** - ₹3,299 (6 in stock)
9. **Desk Lamp** - ₹2,199 (10 in stock)
10. **Cable Organizer** - ₹599 (50 in stock)

## How to Upload

### Step 1: Prepare Your Data
- Download the appropriate template (CSV or JSON)
- Edit the file with your product data
- Ensure all required fields are filled
- Validate the format

### Step 2: Upload via Dashboard
1. Open RetailMind AI Dashboard
2. Click "Seed Data" button (top-right)
3. Select "Upload File" tab
4. Click the upload zone or drag your file
5. Verify the file is selected
6. Click "Upload & Load Data"

### Step 3: Verify Upload
- Wait for success message
- Page will auto-refresh
- Check Dashboard for new products
- Verify inventory counts
- Review AI recommendations

## Tips & Best Practices

### CSV Tips:
- Use Excel or Google Sheets for easy editing
- Don't modify the header row
- Ensure no extra commas in product names
- Save as CSV (not Excel format)
- Check for special characters

### JSON Tips:
- Use a JSON validator before uploading
- Maintain proper array structure
- Use double quotes for strings
- Don't add trailing commas
- Indent for readability

### Data Quality:
- Use unique productId for each item
- Ensure price > cost for profitability
- Set realistic reorderPoint values
- Keep availableStock = currentStock - reservedStock
- Use consistent category names

## Validation Rules

The system validates:
- ✅ File type (CSV or JSON only)
- ✅ Required fields present
- ✅ Numeric fields are numbers
- ✅ ProductId is unique
- ✅ Stock values are non-negative
- ✅ Price and cost are positive

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid file type" | Wrong file format | Use .csv or .json only |
| "Missing required field" | Field not provided | Check all required fields |
| "Invalid JSON syntax" | JSON formatting error | Validate JSON structure |
| "Duplicate productId" | Same ID used twice | Use unique IDs |

## Support

For issues or questions:
1. Check field descriptions above
2. Validate your file format
3. Review sample data in templates
4. Check error messages in modal
5. Refer to main documentation

## Version History

- **v1.0** (Current) - Initial templates with INR pricing
  - 10 sample products
  - CSV and JSON formats
  - All required fields included
  - Indian Rupee currency

---

**Ready to upload?** Use these templates to quickly populate your RetailMind AI database with custom product data!
