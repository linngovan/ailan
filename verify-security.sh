#!/bin/bash

# Security Verification Script
# This script verifies that the API key is not exposed in the client bundle

echo "🔍 Security Verification Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if .env.local exists and is gitignored
echo "Test 1: Checking .env.local configuration..."
if [ -f ".env.local" ]; then
    if grep -q "*.local" .gitignore; then
        echo -e "${GREEN}✓ .env.local is properly gitignored${NC}"
    else
        echo -e "${RED}✗ WARNING: .env.local is NOT gitignored!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ .env.local not found (this is OK for production)${NC}"
fi

# Test 2: Build the project
echo ""
echo "Test 2: Building production bundle..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Test 3: Search for API key patterns in dist folder
echo ""
echo "Test 3: Scanning build output for API key exposure..."

# Common API key patterns
PATTERNS=(
    "AIzaSy"
    "GEMINI_API_KEY"
    "process.env.API_KEY"
    "x-goog-api-key"
)

FOUND_ISSUES=0

for pattern in "${PATTERNS[@]}"; do
    if grep -r "$pattern" dist/ > /dev/null 2>&1; then
        echo -e "${RED}✗ SECURITY ISSUE: Found '$pattern' in build output!${NC}"
        FOUND_ISSUES=$((FOUND_ISSUES + 1))
    fi
done

if [ $FOUND_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ No API key patterns found in build output${NC}"
else
    echo -e "${RED}✗ FAILED: Found $FOUND_ISSUES security issues${NC}"
    exit 1
fi

# Test 4: Check if API proxy exists
echo ""
echo "Test 4: Verifying API proxy setup..."
if [ -f "api/gemini.ts" ]; then
    echo -e "${GREEN}✓ API proxy file exists${NC}"
else
    echo -e "${RED}✗ API proxy file not found${NC}"
    exit 1
fi

# Test 5: Check vite.config.ts doesn't expose API key
echo ""
echo "Test 5: Checking Vite configuration..."
if grep -q "process.env.GEMINI_API_KEY" vite.config.ts; then
    echo -e "${RED}✗ WARNING: vite.config.ts still references API key!${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Vite config is secure${NC}"
fi

# Summary
echo ""
echo "================================"
echo -e "${GREEN}✓ All security checks passed!${NC}"
echo ""
echo "Your application is secure and ready for deployment."
echo ""
echo "Next steps:"
echo "1. Set GEMINI_API_KEY in Vercel environment variables"
echo "2. Deploy to Vercel"
echo "3. Test the deployed application"
