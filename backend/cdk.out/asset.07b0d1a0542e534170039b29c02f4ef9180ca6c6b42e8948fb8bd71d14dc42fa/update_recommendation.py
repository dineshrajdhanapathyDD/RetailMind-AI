import json
import os
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
recommendations_table = dynamodb.Table(os.environ['RECOMMENDATIONS_TABLE'])

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def handler(event, context):
    """Update recommendation status (accept/dismiss)"""
    try:
        # Get recommendation ID from path
        path_params = event.get('pathParameters', {}) or {}
        recommendation_id = path_params.get('id')
        
        if not recommendation_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Recommendation ID is required'})
            }
        
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        new_status = body.get('status')
        
        if new_status not in ['accepted', 'dismissed', 'pending']:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid status. Must be accepted, dismissed, or pending'})
            }
        
        # Get the recommendation first
        get_response = recommendations_table.scan(
            FilterExpression='recommendationId = :id',
            ExpressionAttributeValues={':id': recommendation_id}
        )
        
        items = get_response.get('Items', [])
        if not items:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Recommendation not found'})
            }
        
        item = items[0]
        
        # Update the recommendation status
        update_response = recommendations_table.update_item(
            Key={
                'recommendationId': item['recommendationId'],
                'timestamp': item['timestamp']
            },
            UpdateExpression='SET #status = :status',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={':status': new_status},
            ReturnValues='ALL_NEW'
        )
        
        updated_item = update_response.get('Attributes', {})
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': f'Recommendation {new_status} successfully',
                'recommendation': updated_item
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
