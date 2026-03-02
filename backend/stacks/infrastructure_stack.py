from aws_cdk import (
    Stack,
    aws_dynamodb as dynamodb,
    aws_lambda as lambda_,
    aws_apigateway as apigateway,
    aws_s3 as s3,
    aws_iam as iam,
    RemovalPolicy,
    Duration,
)
from constructs import Construct

class InfrastructureStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # S3 Bucket for data storage
        data_bucket = s3.Bucket(
            self, "DataBucket",
            bucket_name=f"retailmind-data-{self.account}",
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        # DynamoDB Tables
        products_table = dynamodb.Table(
            self, "ProductsTable",
            table_name="retailmind-products",
            partition_key=dynamodb.Attribute(
                name="productId",
                type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        inventory_table = dynamodb.Table(
            self, "InventoryTable",
            table_name="retailmind-inventory",
            partition_key=dynamodb.Attribute(
                name="storeId",
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="productId",
                type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        recommendations_table = dynamodb.Table(
            self, "RecommendationsTable",
            table_name="retailmind-recommendations",
            partition_key=dynamodb.Attribute(
                name="recommendationId",
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="timestamp",
                type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # IAM Role for Lambda with Bedrock access
        lambda_role = iam.Role(
            self, "LambdaExecutionRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                )
            ]
        )

        # Grant Bedrock access
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                actions=[
                    "bedrock:InvokeModel",
                    "bedrock:InvokeModelWithResponseStream"
                ],
                resources=["*"]
            )
        )

        # Grant DynamoDB access
        products_table.grant_read_write_data(lambda_role)
        inventory_table.grant_read_write_data(lambda_role)
        recommendations_table.grant_read_write_data(lambda_role)
        data_bucket.grant_read_write(lambda_role)

        # Lambda Functions
        get_inventory_fn = lambda_.Function(
            self, "GetInventoryFunction",
            runtime=lambda_.Runtime.PYTHON_3_12,
            handler="get_inventory.handler",
            code=lambda_.Code.from_asset("lambda/inventory"),
            role=lambda_role,
            timeout=Duration.seconds(30),
            environment={
                "INVENTORY_TABLE": inventory_table.table_name,
                "PRODUCTS_TABLE": products_table.table_name,
            }
        )

        generate_recommendations_fn = lambda_.Function(
            self, "GenerateRecommendationsFunction",
            runtime=lambda_.Runtime.PYTHON_3_12,
            handler="generate_recommendations.handler",
            code=lambda_.Code.from_asset("lambda/recommendations"),
            role=lambda_role,
            timeout=Duration.seconds(60),
            environment={
                "INVENTORY_TABLE": inventory_table.table_name,
                "PRODUCTS_TABLE": products_table.table_name,
                "RECOMMENDATIONS_TABLE": recommendations_table.table_name,
                "BEDROCK_MODEL_ID": "anthropic.claude-3-sonnet-20240229-v1:0"
            }
        )

        get_recommendations_fn = lambda_.Function(
            self, "GetRecommendationsFunction",
            runtime=lambda_.Runtime.PYTHON_3_12,
            handler="get_recommendations.handler",
            code=lambda_.Code.from_asset("lambda/recommendations"),
            role=lambda_role,
            timeout=Duration.seconds(30),
            environment={
                "RECOMMENDATIONS_TABLE": recommendations_table.table_name,
            }
        )

        # API Gateway
        api = apigateway.RestApi(
            self, "RetailMindAPI",
            rest_api_name="RetailMind AI API",
            description="API for RetailMind AI MVP",
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
            )
        )

        # API Resources and Methods
        inventory_resource = api.root.add_resource("inventory")
        inventory_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(get_inventory_fn)
        )

        recommendations_resource = api.root.add_resource("recommendations")
        recommendations_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(get_recommendations_fn)
        )
        recommendations_resource.add_method(
            "POST",
            apigateway.LambdaIntegration(generate_recommendations_fn)
        )
