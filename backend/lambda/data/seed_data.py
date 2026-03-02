import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')

# Sample data
SAMPLE_PRODUCTS = [
    {
        'productId': 'PROD001',
        'name': 'Wireless Mouse',
        'sku': 'WM-001',
        'category': 'Electronics',
        'brand': 'TechPro',
        'price': Decimal('29.99'),
        'cost': Decimal('15.00')
    },
    {
        'productId': 'PROD002',
        'name': 'USB-C Cable',
        'sku': 'UC-002',
        'category': 'Electronics',
        'brand': 'TechPro',
        'price': Decimal('12.99'),
        'cost': Decimal('5.00')
    },
    {
        'productId': 'PROD003',
        'name': 'Laptop Stand',
        'sku': 'LS-003',
        'category': 'Accessories',
        'brand': 'ErgoDesk',
        'price': Decimal('49.99'),
        'cost': Decimal('25.00')
    },
    {
        'productId': 'PROD004',
        'name': 'Mechanical Keyboard',
        'sku': 'MK-004',
        'category': 'Electronics',
        'brand': 'KeyMaster',
        'price': Decimal('89.99'),
        'cost': Decimal('45.00')
    },
    {
        'productId': 'PROD005',
        'name': 'Webcam HD',
        'sku': 'WC-005',
        'category': 'Electronics',
        'brand': 'VisionTech',
        'price': Decimal('69.99'),
        'cost': Decimal('35.00')
    }
]

SAMPLE_INVENTORY = [
    {
        'storeId': 'STORE001',
        'productId': 'PROD001',
        'currentStock': 5,
        'reservedStock': 0,
        'availableStock': 5,
        'reorderPoint': 10,
        'maxStock': 50
    },
    {
        'storeId': 'STORE001',
        'productId': 'PROD002',
        'currentStock': 25,
        'reservedStock': 2,
        'availableStock': 23,
        'reorderPoint': 20,
        'maxStock': 100
    },
    {
        'storeId': 'STORE001',
        'productId': 'PROD003',
        'currentStock': 8,
        'reservedStock': 1,
        'availableStock': 7,
        'reorderPoint': 15,
        'maxStock': 30
    },
    {
        'storeId': 'STORE001',
        'productId': 'PROD004',
        'currentStock': 0,
        'reservedStock': 0,
        'availableStock': 0,
        'reorderPoint': 5,
        'maxStock': 20
    },
    {
        'storeId': 'STORE001',
        'productId': 'PROD005',
        'currentStock': 12,
        'reservedStock': 0,
        'availableStock': 12,
        'reorderPoint': 10,
        'maxStock': 25
    }
]

def handler(event, context):
    """Seed sample data into DynamoDB tables"""
    try:
        products_table = dynamodb.Table('retailmind-products')
        inventory_table = dynamodb.Table('retailmind-inventory')
        
        # Seed products
        for product in SAMPLE_PRODUCTS:
            products_table.put_item(Item=product)
        
        # Seed inventory
        for inventory in SAMPLE_INVENTORY:
            inventory_table.put_item(Item=inventory)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Sample data seeded successfully',
                'products': len(SAMPLE_PRODUCTS),
                'inventory': len(SAMPLE_INVENTORY)
            })
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
