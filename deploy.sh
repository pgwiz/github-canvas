#!/bin/bash
set -e

# Load environment variables from .env
# Load environment variables from .env, handling Windows line endings
if [ -f .env ]; then
  echo "Loading .env file..."
  # Read line by line to handle quoting and exporting robustly
  while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ $key =~ ^#.* ]] && continue
    [[ -z $key ]] && continue
    
    # Remove \r from value and key
    key=$(echo "$key" | tr -d '\r')
    value=$(echo "$value" | tr -d '\r')
    
    # Remove quotes from value
    value=${value%\"}
    value=${value#\"}
    value=${value%\'}
    value=${value#\'}
    
    export "$key"="$value"
  done < .env
fi

# Debug Access Token (print first 5 chars only)
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "SUPABASE_ACCESS_TOKEN is set: ${SUPABASE_ACCESS_TOKEN:0:5}..."
    # CRITICAL: Pass this variable to Windows binaries (like npx.exe) via WSLENV
    export WSLENV=SUPABASE_ACCESS_TOKEN:$WSLENV
else
    echo "ERROR: SUPABASE_ACCESS_TOKEN is NOT set."
fi

# Project Configuration
PROJECT_ID=${VITE_SUPABASE_PROJECT_ID:-"edxiyetfcnugrmxhmvpq"}

# Check for Access Token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "Error: SUPABASE_ACCESS_TOKEN is not set in .env"
  exit 1
fi

echo "Using Project ID: $PROJECT_ID"
echo "Syncing secrets..."

echo "Using npx at: $(which npx)"

# We use SUPABASE_SERVICE_ROLE_KEY from .env but map it to SERVICE_ROLE_KEY for the function
npx supabase secrets set --project-ref "$PROJECT_ID" \
  "GEMINI_API_KEY=$GEMINI_API_KEY" \
  "GITHUB_TOKEN=$GITHUB_TOKEN" \
  "SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"

echo "Secrets synced."

# Deploy Functions
echo "Deploying Supabase Edge Functions..."

# Iterate over directories in supabase/functions
for dir in supabase/functions/*/; do
    # Remove trailing slash and get directory name
    func_name=$(basename "$dir")
    
    echo "Deploying $func_name..."
    
    # Run deployment
    npx supabase functions deploy "$func_name" \
      --project-ref "$PROJECT_ID" \
      --no-verify-jwt \
      --legacy-bundle \
      --debug
done

echo "All functions deployed successfully!"
