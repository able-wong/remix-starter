# Firebase App Hosting Secrets Setup Guide

This guide explains how to set up secrets for Firebase App Hosting deployment using Firebase CLI.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project initialized
- Firebase App Hosting configured

## Method 1: Using Firebase CLI (Recommended)

Firebase CLI provides built-in commands to manage secrets for App Hosting:

### Step 1: Create and Set Secrets

```bash
# Login to Firebase
firebase login

# Set a secret using Firebase CLI
# This creates the secret in Secret Manager and grants permissions automatically
firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY

# You'll be prompted to enter the secret value
# For JSON values, you can paste the entire JSON

# Set other secrets
firebase apphosting:secrets:set GOOGLE_GENERATIVE_AI_API_KEY
firebase apphosting:secrets:set GOOGLE_GENERATIVE_AI_MODEL_NAME
```

### Step 2: Grant Permissions (Automatic)

When you use `firebase apphosting:secrets:set`, Firebase CLI automatically:

- Creates the secret in Google Secret Manager
- Grants the App Hosting service account access to read the secret
- Makes it available to your App Hosting backend

### Step 3: List and Manage Secrets

```bash
# List all secrets configured for App Hosting
firebase apphosting:secrets:list

# View secret details (without revealing the value)
firebase apphosting:secrets:describe FIREBASE_SERVICE_ACCOUNT_KEY

# Delete a secret
firebase apphosting:secrets:delete FIREBASE_SERVICE_ACCOUNT_KEY

# Update a secret value
firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY --force
```

## Method 2: Using Google Cloud CLI (Alternative)

If you need more control or are migrating existing secrets:

### Step 1: Create Secrets in Google Secret Manager

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project ID (replace with your actual project ID)
export PROJECT_ID="your-firebase-project-id"
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "your-firebase-project-id" ]; then
  echo "Error: Please set PROJECT_ID to your actual Firebase project ID"
  exit 1
fi
gcloud config set project $PROJECT_ID

# Create the secret for Firebase Service Account (replace with actual JSON content)
SERVICE_ACCOUNT_JSON='{"your": "service-account-json-content"}'
if [ "$SERVICE_ACCOUNT_JSON" = '{"your": "service-account-json-content"}' ]; then
  echo "Error: Please replace SERVICE_ACCOUNT_JSON with your actual service account JSON"
  exit 1
fi
echo -n "$SERVICE_ACCOUNT_JSON" | gcloud secrets create FIREBASE_SERVICE_ACCOUNT_KEY --data-file=-

# Create other secrets as needed (replace with actual values)
API_KEY='your-api-key-value'
if [ "$API_KEY" = 'your-api-key-value' ]; then
  echo "Error: Please replace API_KEY with your actual API key"
  exit 1
fi
echo -n "$API_KEY" | gcloud secrets create GOOGLE_GENERATIVE_AI_API_KEY --data-file=-
```

### Step 2: Grant Firebase App Hosting Access

```bash
# Use Firebase CLI to grant access to existing secrets
firebase apphosting:secrets:grantaccess FIREBASE_SERVICE_ACCOUNT_KEY
firebase apphosting:secrets:grantaccess GOOGLE_GENERATIVE_AI_API_KEY

# This grants the App Hosting service account the necessary permissions
```

## Step 3: Configure Secrets in apphosting.yaml

Update your `apphosting.yaml` file to reference the secrets:

```yaml
# apphosting.yaml
env:
  - variable: FIREBASE_PROJECT_ID
    value: "your-project-id"

  - variable: FIREBASE_SERVICE_ACCOUNT_KEY
    secret: FIREBASE_SERVICE_ACCOUNT_KEY

  - variable: GOOGLE_GENERATIVE_AI_API_KEY
    secret: GOOGLE_GENERATIVE_AI_API_KEY
    availability:
      - BUILD
      - RUNTIME

runConfig:
  cpu: 1
  memoryMiB: 512
  concurrency: 100
```

## Step 4: Verify Secret Access

After deploying, you can verify that secrets are accessible:

```bash
# List all secrets in the project
gcloud secrets list

# View secret versions (without revealing the value)
gcloud secrets versions list FIREBASE_SERVICE_ACCOUNT_KEY

# Check IAM policy for a secret
gcloud secrets get-iam-policy FIREBASE_SERVICE_ACCOUNT_KEY
```

## Step 5: Deploy with Firebase CLI

Deploy your application with the configured secrets:

```bash
# Deploy to Firebase App Hosting
firebase apphosting:deploy

# Or if using a specific backend
firebase apphosting:backends:list
firebase apphosting:backends:deploy BACKEND_ID
```

## Important Security Notes

1. **Never commit secrets to version control** - Always use Secret Manager
2. **Use least privilege principle** - Only grant access to the specific service accounts that need it
3. **Rotate secrets regularly** - Update secret values periodically
4. **Monitor secret access** - Use Cloud Audit Logs to track secret access

## Troubleshooting

### Permission Denied Errors

If you see "Permission denied" errors when the app tries to access secrets:

```bash
# Check if the service account has the correct role
gcloud secrets get-iam-policy FIREBASE_SERVICE_ACCOUNT_KEY

# Re-add the IAM binding if missing
gcloud secrets add-iam-policy-binding FIREBASE_SERVICE_ACCOUNT_KEY \
  --member="serviceAccount:firebase-apphosting-compute@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Secret Not Found Errors

If secrets aren't found during deployment:

```bash
# Verify the secret exists
gcloud secrets describe FIREBASE_SERVICE_ACCOUNT_KEY

# Check the secret name matches exactly in apphosting.yaml
# Secret names are case-sensitive
```

### Updating Secret Values

To update a secret value:

```bash
# Add a new version to an existing secret
echo -n 'new-secret-value' | gcloud secrets versions add FIREBASE_SERVICE_ACCOUNT_KEY --data-file=-

# The new version will be used automatically on the next deployment
```

## Environment Variables Available

After setup, these environment variables will be available in your app:

- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Service account JSON for server-side Firebase operations
- `GOOGLE_GENERATIVE_AI_API_KEY` - API key for Gemini AI (if configured)

Access them in your code:

```typescript
// In your app
const projectId = process.env.FIREBASE_PROJECT_ID;
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
```

## Additional Resources

- [Firebase App Hosting Documentation](https://firebase.google.com/docs/app-hosting)
- [Google Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [IAM Roles for Secret Manager](https://cloud.google.com/secret-manager/docs/access-control)
