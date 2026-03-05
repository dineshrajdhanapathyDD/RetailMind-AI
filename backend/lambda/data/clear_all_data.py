import json
import boto3
import os
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')

def handler(event, context):
    """Lambda handler to clear all data from DynamoDB tables"""
    try:
        products_table_name = os.environ.get('PRODUCTS_TABLE')
        inventory_table_name = os.environ.get('INVENTORY_TABLE')
        recommendations_table_name = os.environ.get('RECOMMENDATIONS_TABLE')
        
        products_table = dynamodb.Table(products_table_name)
        inventory_table = dynamodb.Table(inventory_table_name)
        recommendations_table = dynamodb.Table(recommendations_table_name)
        
        # Clear products table
        products_response = products_table.scan()
        products_deleted = 0
        for item in products_response.get('Items', []):
            products_table.delete_item(
                Key={'productId': item['productId']}
            )
            products_deleted += 1
        
        # Clear inventory table
        inventory_response = inventory_table.scan()
        inventory_deleted = 0
        for item in inventory_response.get('Items', []):
            inventory_table.delete_item(
                Key={
                    'storeId': item['storeId'],
                    'productId': item['productId']
                }
            )
            inventory_deleted += 1
        
        # Clear recommendations table
        recommendations_response = recommendations_table.scan()
        recommendations_deleted = 0
        for item in recommendations_response.get('Items', []):
            recommendations_table.delete_item(
                Key={
                    'recommendationId': item['recommendationId'],
                    'timestamp': item['timestamp']
                }
            )
            recommendations_deleted += 1
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
            },
            'body': json.dumps({
                'message': 'All data cleared successfully',
                'productsDeleted': products_deleted,
                'inventoryDeleted': inventory_deleted,
                'recommendationsDeleted': recommendations_deleted
            })
        }
        
    except Exception as e:
        print(f"Error clearing data: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
