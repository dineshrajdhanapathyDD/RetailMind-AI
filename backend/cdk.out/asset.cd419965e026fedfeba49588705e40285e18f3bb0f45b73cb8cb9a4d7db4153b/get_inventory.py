import json
import os
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
inventory_table = dynamodb.Table(os.environ['INVENTORY_TABLE'])
products_table = dynamodb.Table(os.environ['PRODUCTS_TABLE'])

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def handler(event, context):
    """Get inventory data with product details"""
    try:
        # Scan inventory table
        response = inventory_table.scan()
        inventory_items = response.get('Items', [])
        
        # Enrich with product data
        enriched_items = []
        for item in inventory_items:
            product_response = products_table.get_item(
                Key={'productId': item['productId']}
            )
            product = product_response.get('Item', {})
            
            enriched_item = {
                **item,
                'productName': product.get('name', 'Unknown'),
                'category': product.get('category', 'Unknown'),
                'price': product.get('price', 0),
                'status': get_inventory_status(
                    item.get('currentStock', 0),
                    item.get('reorderPoint', 0)
                )
            }
            enriched_items.append(enriched_item)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'items': enriched_items,
                'count': len(enriched_items)
            }, cls=DecimalEncoder)
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }

def get_inventory_status(current_stock, reorder_point):
    """Determine inventory status"""
    if current_stock == 0:
        return 'critical'
    elif current_stock <= reorder_point:
        return 'low'
    elif current_stock <= reorder_point * 2:
        return 'optimal'
    else:
        return 'overstock'
