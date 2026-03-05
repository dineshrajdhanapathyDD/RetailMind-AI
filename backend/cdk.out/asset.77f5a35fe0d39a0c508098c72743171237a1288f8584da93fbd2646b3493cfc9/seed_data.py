import json
import boto3
import os
import csv
import io
import base64
from decimal import Decimal
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

SAMPLE_PRODUCTS = [
    {
        'productId': 'PROD001',
        'name': 'Wireless Mouse',
        'sku': 'WM-001',
        'category': 'Electronics',
        'brand': 'TechPro',
        'price': Decimal('2499.00'),
        'cost': Decimal('1250.00'),
        'currency': 'INR'
    },
    {
        'productId': 'PROD002',
        'name': 'USB-C Cable',
        'sku': 'UC-002',
        'category': 'Electronics',
        'brand': 'TechPro',
        'price': Decimal('1099.00'),
        'cost': Decimal('450.00'),
        'currency': 'INR'
    },
    {
        'productId': 'PROD003',
        'name': 'Laptop Stand',
        'sku': 'LS-003',
        'category': 'Accessories',
        'brand': 'ErgoDesk',
        'price': Decimal('4199.00'),
        'cost': Decimal('2100.00'),
        'currency': 'INR'
    },
    {
        'productId': 'PROD004',
        'name': 'Mechanical Keyboard',
        'sku': 'MK-004',
        'category': 'Electronics',
        'brand': 'KeyMaster',
        'price': Decimal('7499.00'),
        'cost': Decimal('3750.00'),
        'currency': 'INR'
    },
    {
        'productId': 'PROD005',
        'name': 'Webcam HD',
        'sku': 'WC-005',
        'category': 'Electronics',
        'brand': 'VisionTech',
        'price': Decimal('5899.00'),
        'cost': Decimal('2950.00'),
        'currency': 'INR'
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

def parse_csv_data(csv_content):
    """Parse CSV content and return products and inventory lists"""
    products = []
    inventory = []
    
    csv_reader = csv.DictReader(io.StringIO(csv_content))
    
    for row in csv_reader:
        product = {
            'productId': row.get('productId', ''),
            'name': row.get('name', ''),
            'sku': row.get('sku', ''),
            'category': row.get('category', ''),
            'brand': row.get('brand', ''),
            'price': Decimal(str(row.get('price', '0'))),
            'cost': Decimal(str(row.get('cost', '0'))),
            'currency': row.get('currency', 'INR')
        }
        products.append(product)
        
        inv = {
            'storeId': row.get('storeId', 'STORE001'),
            'productId': row.get('productId', ''),
            'currentStock': int(row.get('currentStock', 0)),
            'reservedStock': int(row.get('reservedStock', 0)),
            'availableStock': int(row.get('availableStock', 0)),
            'reorderPoint': int(row.get('reorderPoint', 10)),
            'maxStock': int(row.get('maxStock', 100))
        }
        inventory.append(inv)
    
    return products, inventory

def parse_json_data(json_content):
    """Parse JSON content and return products and inventory lists"""
    data = json.loads(json_content)
    
    products = []
    inventory = []
    
    for item in data.get('products', []):
        product = {
            'productId': item.get('productId', ''),
            'name': item.get('name', ''),
            'sku': item.get('sku', ''),
            'category': item.get('category', ''),
            'brand': item.get('brand', ''),
            'price': Decimal(str(item.get('price', '0'))),
            'cost': Decimal(str(item.get('cost', '0'))),
            'currency': item.get('currency', 'INR')
        }
        products.append(product)
        
        inv = {
            'storeId': item.get('storeId', 'STORE001'),
            'productId': item.get('productId', ''),
            'currentStock': int(item.get('currentStock', 0)),
            'reservedStock': int(item.get('reservedStock', 0)),
            'availableStock': int(item.get('availableStock', 0)),
            'reorderPoint': int(item.get('reorderPoint', 10)),
            'maxStock': int(item.get('maxStock', 100))
        }
        inventory.append(inv)
    
    return products, inventory

def handler(event, context):
    """Lambda handler to seed sample data or upload external data"""
    try:
        products_table_name = os.environ.get('PRODUCTS_TABLE')
        inventory_table_name = os.environ.get('INVENTORY_TABLE')
        
        products_table = dynamodb.Table(products_table_name)
        inventory_table = dynamodb.Table(inventory_table_name)
        
        # Check if this is a file upload or sample data request
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}
        upload_type = body.get('type', 'sample')
        
        if upload_type == 'file':
            # Handle file upload
            file_content = body.get('fileContent', '')
            file_type = body.get('fileType', 'csv')
            
            if file_type == 'csv':
                products, inventory = parse_csv_data(file_content)
            elif file_type == 'json':
                products, inventory = parse_json_data(file_content)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
        else:
            # Use sample data
            products = SAMPLE_PRODUCTS
            inventory = SAMPLE_INVENTORY
        
        # Seed products
        for product in products:
            products_table.put_item(Item=product)
        
        # Seed inventory
        for inv in inventory:
            inventory_table.put_item(Item=inv)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'message': 'Data seeded successfully',
                'productsCount': len(products),
                'inventoryCount': len(inventory),
                'type': upload_type
            })
        }
        
    except Exception as e:
        print(f"Error seeding data: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
