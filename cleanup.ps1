# RetailMind AI - Quick Cleanup Script
# This script will delete all AWS resources to stop charges

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RetailMind AI - Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will DELETE all AWS resources:" -ForegroundColor Yellow
Write-Host "  - Lambda functions" -ForegroundColor Yellow
Write-Host "  - DynamoDB tables (and all data)" -ForegroundColor Yellow
Write-Host "  - API Gateway" -ForegroundColor Yellow
Write-Host "  - S3 bucket (and all data)" -ForegroundColor Yellow
Write-Host "  - IAM roles" -ForegroundColor Yellow
Write-Host "  - CloudWatch logs" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Are you sure you want to delete everything? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "Cleanup cancelled." -ForegroundColor Green
    exit
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Cyan

# Navigate to backend directory
Set-Location backend

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\Activate.ps1

# Run CDK destroy
Write-Host ""
Write-Host "Deleting CloudFormation stack..." -ForegroundColor Cyan
cdk destroy --force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "All AWS resources have been deleted." -ForegroundColor Green
Write-Host "Your AWS bill will stop accumulating charges." -ForegroundColor Green
Write-Host ""
Write-Host "To redeploy later, run:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  cdk deploy" -ForegroundColor White
Write-Host ""
