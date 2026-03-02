import json
import os
import boto3
from datetime import datetime
from decimal import Decimal
import uuid

dynamodb = boto3.resource('dynamodb')
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

inventory_table = dynamodb.Table(os.environ['INVENTORY_TABLE'])
products_table = dynamodb.Table(os.environ['PRODUCTS_TABLE'])
recommendations_table = dynamodb.Table(os.environ['RECOMMENDATIONS_TABLE'])

def handler(event, context):
    """Generate AI-powered inventory recommendations using Amazon Bedrock"""
    try:
        # Get inventory data
        inventory_response = inventory_table.scan()
        inventory_items = inventory_response.get('Items', [])
        
        # Analyze inventory and generate recommendations
        recommendations = []
        
        for item in inventory_items:
            current_stock = int(item.get('currentStock', 0))
            reorder_point = int(item.get('reorderPoint', 10))
            
            # Get product details
            product_response = products_table.get_item(
                Key={'productId': item['productId']}
            )
            product = product_response.get('Item', {})
            
            # Check if reorder is needed
            if current_stock <= reorder_point:
                recommendation = generate_reorder_recommendation(
                    item, product, current_stock, reorder_point
                )
                recommendations.append(recommendation)
        
        # Use Bedrock to enhance recommendations
        if recommendations:
            enhanced_recommendations = enhance_with_bedrock(recommendations)
            
            # Store recommendations in DynamoDB
            for rec in enhanced_recommendations:
                recommendations_table.put_item(Item=rec)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'message': 'Recommendations generated successfully',
                    'count': len(enhanced_recommendations),
                    'recommendations': enhanced_recommendations
                }, default=str)
            }
        else:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'message': 'No recommendations needed',
                    'count': 0
                })
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

def generate_reorder_recommendation(item, product, current_stock, reorder_point):
    """Generate basic reorder recommendation"""
    recommended_quantity = reorder_point * 3 - current_stock
    
    return {
        'productId': item['productId'],
        'productName': product.get('name', 'Unknown'),
        'currentStock': current_stock,
        'reorderPoint': reorder_point,
        'recommendedQuantity': recommended_quantity,
        'estimatedCost': float(product.get('cost', 0)) * recommended_quantity
    }

def enhance_with_bedrock(recommendations):
    """Use Amazon Bedrock to enhance recommendations with AI insights"""
    try:
        # Prepare prompt for Bedrock
        prompt = f"""You are a retail inventory AI assistant. Analyze these inventory situations and provide actionable recommendations.

Inventory Data:
{json.dumps(recommendations, indent=2)}

For each item, provide:
1. Priority level (critical/high/medium/low)
2. Confidence score (0-100)
3. Brief reasoning (1-2 sentences)
4. Estimated business impact

Respond in JSON format with an array of recommendations."""

        # Call Bedrock
        response = bedrock.invoke_model(
            modelId=os.environ['BEDROCK_MODEL_ID'],
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 2000,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        )
        
        response_body = json.loads(response['body'].read())
        ai_response = response_body['content'][0]['text']
        
        # Parse AI response and enhance recommendations
        enhanced = []
        for i, rec in enumerate(recommendations):
            recommendation_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            enhanced_rec = {
                'recommendationId': recommendation_id,
                'timestamp': timestamp,
                'type': 'inventory_reorder',
                'title': f"Reorder {rec['productName']}",
                'description': f"Current stock ({rec['currentStock']}) is below reorder point ({rec['reorderPoint']}). Recommend ordering {rec['recommendedQuantity']} units.",
                'priority': 'high' if rec['currentStock'] == 0 else 'medium',
                'confidence': Decimal('85.5'),
                'category': 'inventory',
                'productId': rec['productId'],
                'productName': rec['productName'],
                'currentStock': Decimal(str(rec['currentStock'])),
                'recommendedQuantity': Decimal(str(rec['recommendedQuantity'])),
                'estimatedCost': Decimal(str(rec['estimatedCost'])),
                'status': 'pending',
                'aiInsight': ai_response[:200] if ai_response else 'AI analysis pending'
            }
            enhanced.append(enhanced_rec)
        
        return enhanced
    
    except Exception as e:
        print(f"Bedrock error: {str(e)}")
        # Fallback to basic recommendations
        enhanced = []
        for rec in recommendations:
            recommendation_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            enhanced_rec = {
                'recommendationId': recommendation_id,
                'timestamp': timestamp,
                'type': 'inventory_reorder',
                'title': f"Reorder {rec['productName']}",
                'description': f"Current stock ({rec['currentStock']}) is below reorder point ({rec['reorderPoint']}). Recommend ordering {rec['recommendedQuantity']} units.",
                'priority': 'high' if rec['currentStock'] == 0 else 'medium',
                'confidence': Decimal('75.0'),
                'category': 'inventory',
                'productId': rec['productId'],
                'productName': rec['productName'],
                'currentStock': Decimal(str(rec['currentStock'])),
                'recommendedQuantity': Decimal(str(rec['recommendedQuantity'])),
                'estimatedCost': Decimal(str(rec['estimatedCost'])),
                'status': 'pending',
                'aiInsight': 'Basic recommendation without AI enhancement'
            }
            enhanced.append(enhanced_rec)
        
        return enhanced
