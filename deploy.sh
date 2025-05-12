#!/bin/bash

set -euo pipefail

echo "🔐 Reading .env and setting Firebase Function secrets..."

# Check that .env exists
if [ ! -f .env ]; then
  echo "❌ .env file not found!"
  exit 1
fi

# Load environment variables from .env
set -a
source .env
set +a

# Require project ID
if [[ -z "${VITE_FIREBASE_PROJECT_ID:-}" ]]; then
  echo "❌ VITE_FIREBASE_PROJECT_ID is not set in .env"
  exit 1
fi

PROJECT_ID="$VITE_FIREBASE_PROJECT_ID"

echo "📛 Using Firebase project: $PROJECT_ID"

# Push all VITE_ prefixed keys as Firebase secrets
for key in $(grep -E '^VITE_' .env | cut -d= -f1); do
  value="${!key}"
  echo "🔧 Setting secret: $key"
  firebase functions:secrets:set "$key" --value="$value" --project "$PROJECT_ID"
done

echo "🛠️  Building frontend with environment variables..."
npm run build

echo "🚀 Deploying to Firebase Hosting and Functions..."
firebase deploy --only hosting,functions --project "$PROJECT_ID"

echo "✅ Deployment complete."
