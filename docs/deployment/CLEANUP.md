# RetailMind AI - Cleanup Guide

## 🛑 Stop AWS Services to Avoid Charges

### Quick Cleanup (Delete Everything)

```bash
cd backend
.\venv\Scripts\Activate.ps1
cdk destroy
```

When prompted, type `y` to confirm deletion.

This will delete:
- ✅ All Lambda functions
- ✅ All DynamoDB tables (and data)
- ✅ API Gateway
- ✅ S3 bucket (and data)
- ✅ IAM roles
- ✅ CloudWatch logs

**Time to complete**: 2-3 minutes

---

## 💰 Cost Breakdown

### Current Monthly Costs:
- **DynamoDB** (3 tables): $1-2/month
- **Lambda** (3 functions): $0.20/month (mostly free tier)
- **API Gateway**: $3.50/month per million requests
- **S3 Storage**: $0.023/GB/month
- **CloudWatch Logs**: $0.50/month

**Total**: ~$5-10/month

### Bedrock Costs (Pay-per-use only):
- **Claude 3 Sonnet**: $0.003/1K input tokens, $0.015/1K output tokens
- Only charged when generating recommendations
- ~$0.01-0.05 per recommendation generation

---

## 🔄 Alternative: Pause Without Deleting

If you want to keep your infrastructure but reduce costs:

### 1. Stop Frontend (Free - runs locally)
```bash
# Just close the terminal or press Ctrl+C
```

### 2. Keep Backend but Don't Use It
- DynamoDB on-demand: Only pay for actual reads/writes
- Lambda: Only pay when invoked
- API Gateway: Only pay for requests
- **Cost if not used**: ~$0.50/month (just storage)

### 3. Delete Only DynamoDB Tables (Biggest cost)
```bash
aws dynamodb delete-table --table-name retailmind-products
aws dynamodb delete-table --table-name retailmind-inventory
aws dynamodb delete-table --table-name retailmind-recommendations
```

**Savings**: ~$1-2/month

---

## 📊 Cost Optimization Tips

### Free Tier Benefits (First 12 months):
- **Lambda**: 1M requests/month free
- **API Gateway**: 1M requests/month free (first 12 months)
- **DynamoDB**: 25GB storage + 25 WCU + 25 RCU free
- **S3**: 5GB storage free
- **CloudWatch**: 10 custom metrics free

### To Minimize Costs:
1. **Don't generate recommendations frequently** (Bedrock charges per use)
2. **Delete when not actively developing**
3. **Use AWS Free Tier** (covers most Lambda/API Gateway usage)
4. **Monitor with AWS Cost Explorer**

---

## 🔍 Check Current Costs

### View Your AWS Bill:
1. Go to AWS Console → Billing Dashboard
2. Click "Bills" in left sidebar
3. View current month charges by service

### Set Up Cost Alerts:
```bash
# Create a billing alarm (via AWS Console)
1. Go to CloudWatch → Alarms
2. Create Alarm → Select Metric → Billing → Total Estimated Charge
3. Set threshold (e.g., $10)
4. Add email notification
```

---

## 🚀 Redeploy Later

If you delete everything, you can redeploy anytime:

```bash
cd backend
.\venv\Scripts\Activate.ps1
cdk deploy
python seed_data_script.py
```

**Time to redeploy**: 3-5 minutes

---

## ⚠️ Important Notes

### Before Deleting:
- ✅ **Backup data** if needed (DynamoDB tables will be deleted)
- ✅ **Save API Gateway URL** if you want to reference it later
- ✅ **Export any important data** from DynamoDB

### What Gets Deleted:
- ❌ All Lambda functions and code
- ❌ All DynamoDB tables and data
- ❌ API Gateway endpoints
- ❌ S3 bucket and contents
- ❌ CloudWatch logs
- ❌ IAM roles created by CDK

### What Stays:
- ✅ Your local code (backend and frontend)
- ✅ CDK bootstrap stack (reusable)
- ✅ AWS account and credentials

---

## 🎯 Recommended Actions

### For Active Development:
- Keep everything running
- Monitor costs weekly
- Use AWS Free Tier benefits

### For Paused Development:
- Delete the stack with `cdk destroy`
- Redeploy when needed
- **Cost**: $0/month

### For Demo/Presentation:
- Deploy 1 hour before demo
- Delete immediately after
- **Cost**: ~$0.01 per demo

---

## 📞 Need Help?

### Check Stack Status:
```bash
aws cloudformation describe-stacks --stack-name RetailMindAIStack
```

### List All Resources:
```bash
aws cloudformation list-stack-resources --stack-name RetailMindAIStack
```

### Force Delete (if stuck):
```bash
cdk destroy --force
```

---

## 💡 Pro Tips

1. **Set up AWS Budget**: Get alerts before costs exceed threshold
2. **Use AWS Cost Explorer**: Track daily spending
3. **Tag resources**: Add tags for better cost tracking
4. **Review monthly**: Check AWS bill on 1st of each month
5. **Delete test stacks**: Don't leave test deployments running

---

## Summary

**To stop all charges immediately:**
```bash
cd backend
.\venv\Scripts\Activate.ps1
cdk destroy
```

**Estimated time**: 2-3 minutes
**Cost after deletion**: $0/month
**Can redeploy**: Yes, anytime in 3-5 minutes
