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
        # Prepare a cleaner prompt for Bedrock
        products_summary = []
        for rec in recommendations:
            products_summary.append(
                f"- {rec['productName']}: Current stock {rec['currentStock']}, "
                f"Reorder point {rec['reorderPoint']}, Need {rec['recommendedQuantity']} units"
            )
        
        prompt = f"""You are a retail inventory expert. Analyze these low-stock situations and provide brief, actionable insights.

Products needing reorder:
{chr(10).join(products_summary)}

For each product, provide a single sentence explaining:
- Why this reorder is important
- The business impact of not reordering
- Any urgency factors

Keep each insight to 1-2 sentences maximum. Be concise and actionable."""

        # Call Bedrock with Nova model format
        response = bedrock.invoke_model(
            modelId=os.environ['BEDROCK_MODEL_ID'],
            body=json.dumps({
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "inferenceConfig": {
                    "max_new_tokens": 1000,
                    "temperature": 0.7
                }
            })
        )
        
        response_body = json.loads(response['body'].read())
        
        # Extract text from Nova response format
        ai_response = ""
        if 'output' in response_body and 'message' in response_body['output']:
            content = response_body['output']['message'].get('content', [])
            if content and len(content) > 0:
                ai_response = content[0].get('text', '')
        
        print(f"AI Response: {ai_response}")
        
        # Parse AI response and enhance recommendations
        enhanced = []
        ai_insights = []
        
        # Try to extract insights from AI response
        if ai_response:
            # Split by lines and filter out empty lines
            lines = [line.strip() for line in ai_response.split('\n') if line.strip()]
            # Remove markdown formatting and bullet points
            for line in lines:
                cleaned = line.lstrip('- *•').strip()
                if cleaned and len(cleaned) > 20:  # Only meaningful insights
                    ai_insights.append(cleaned)
        
        for i, rec in enumerate(recommendations):
            recommendation_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            # Determine priority based on stock level
            if rec['currentStock'] == 0:
                priority = 'critical'
                confidence = 95
            elif rec['currentStock'] < rec['reorderPoint'] / 2:
                priority = 'high'
                confidence = 90
            else:
                priority = 'medium'
                confidence = 85
            
            # Get AI insight for this product or use fallback
            if i < len(ai_insights):
                insight = ai_insights[i]
            else:
                # Fallback insights based on stock level
                if rec['currentStock'] == 0:
                    insight = f"Critical: {rec['productName']} is out of stock. Immediate reorder required to prevent lost sales and customer dissatisfaction."
                elif rec['currentStock'] < rec['reorderPoint'] / 2:
                    insight = f"Urgent: {rec['productName']} stock is critically low. Reorder now to maintain inventory levels and avoid stockouts."
                else:
                    insight = f"Recommended: {rec['productName']} has reached reorder point. Timely restocking will ensure continuous availability."
            
            enhanced_rec = {
                'recommendationId': recommendation_id,
                'timestamp': timestamp,
                'type': 'inventory_reorder',
                'title': f"Reorder {rec['productName']}",
                'description': f"Current stock ({rec['currentStock']}) is below reorder point ({rec['reorderPoint']}). Recommend ordering {rec['recommendedQuantity']} units to maintain optimal inventory levels.",
                'priority': priority,
                'confidence': Decimal(str(confidence)),
                'category': 'inventory',
                'productId': rec['productId'],
                'productName': rec['productName'],
                'currentStock': Decimal(str(rec['currentStock'])),
                'recommendedQuantity': Decimal(str(rec['recommendedQuantity'])),
                'estimatedCost': Decimal(str(rec['estimatedCost'])),
                'status': 'pending',
                'aiInsight': insight[:300]  # Limit to 300 characters
            }
            enhanced.append(enhanced_rec)
        
        return enhanced
    
    except Exception as e:
        print(f"Bedrock error: {str(e)}")
        # Fallback to basic recommendations with good insights
        enhanced = []
        for rec in recommendations:
            recommendation_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            # Determine priority and insight based on stock level
            if rec['currentStock'] == 0:
                priority = 'critical'
                confidence = 95
                insight = f"Critical: {rec['productName']} is completely out of stock. Immediate reorder required to prevent lost sales and customer dissatisfaction."
            elif rec['currentStock'] < rec['reorderPoint'] / 2:
                priority = 'high'
                confidence = 90
                insight = f"Urgent: {rec['productName']} stock is critically low at {rec['currentStock']} units. Reorder now to maintain service levels."
            else:
                priority = 'medium'
                confidence = 85
                insight = f"Recommended: {rec['productName']} has reached reorder point. Timely restocking will ensure continuous availability for customers."
            
            enhanced_rec = {
                'recommendationId': recommendation_id,
                'timestamp': timestamp,
                'type': 'inventory_reorder',
                'title': f"Reorder {rec['productName']}",
                'description': f"Current stock ({rec['currentStock']}) is below reorder point ({rec['reorderPoint']}). Recommend ordering {rec['recommendedQuantity']} units to maintain optimal inventory levels.",
                'priority': priority,
                'confidence': Decimal(str(confidence)),
                'category': 'inventory',
                'productId': rec['productId'],
                'productName': rec['productName'],
                'currentStock': Decimal(str(rec['currentStock'])),
                'recommendedQuantity': Decimal(str(rec['recommendedQuantity'])),
                'estimatedCost': Decimal(str(rec['estimatedCost'])),
                'status': 'pending',
                'aiInsight': insight
            }
            enhanced.append(enhanced_rec)
        
        return enhanced
