#!/bin/bash

# GitHub Stats Card - Setup Script
# This script helps set up the project for production deployment

echo "🚀 GitHub Stats Card - Setup Script"
echo "===================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
else
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please edit it with your values"
fi

# Check for required tools
echo ""
echo "Checking required tools..."

if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node -v)"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm -v)"
else
    echo "❌ npm not found"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for Vercel CLI
echo ""
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI installed"
else
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "===================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Run 'npm run dev' to start locally"
echo "3. Run 'vercel' to deploy to Vercel"
echo ""
echo "Optional: Add GITHUB_TOKEN for higher API rate limits"
echo "Get one at: https://github.com/settings/tokens"
echo ""
