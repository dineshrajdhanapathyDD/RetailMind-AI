#!/usr/bin/env python3
import aws_cdk as cdk
from stacks.infrastructure_stack import InfrastructureStack

app = cdk.App()

InfrastructureStack(
    app, 
    "RetailMindAIStack",
    description="RetailMind AI - MVP Infrastructure"
)

app.synth()
