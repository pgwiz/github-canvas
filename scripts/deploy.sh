#!/bin/bash

# GitHub Stats Card - Deployment Script
# Deploys the application to Vercel

echo "🚀 Deploying GitHub Stats Card to Vercel"
echo "========================================="
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in to Vercel
echo "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please log in to Vercel:"
    vercel login
fi

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."

# Check for production flag
if [ "$1" == "--prod" ] || [ "$1" == "-p" ]; then
    echo "Deploying to PRODUCTION..."
    vercel --prod
else
    echo "Deploying to PREVIEW..."
    echo "(Use --prod flag for production deployment)"
    vercel
fi

echo ""
echo "========================================="
echo "✅ Deployment complete!"
echo ""
