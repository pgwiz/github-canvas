#!/bin/bash
set -e

echo "Deploying Supabase Edge Functions..."

# Project Configuration
PROJECT_ID="edxiyetfcnugrmxhmvpq"

# Sync Secrets (uses env vars from Vercel)
npx supabase@latest secrets set --project-ref "$PROJECT_ID" \
  "GEMINI_API_KEY=$GEMINI_API_KEY" \
  "GITHUB_TOKEN=$GIT_TOKEN" \
  "SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"

echo "Secrets synced."

# Deploy all functions
npx supabase@latest functions deploy --project-ref "$PROJECT_ID" --no-verify-jwt

echo "All functions deployed successfully!"
