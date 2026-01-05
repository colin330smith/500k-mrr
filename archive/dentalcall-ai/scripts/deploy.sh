#!/bin/bash
# DentalCall AI - Production Deployment Script
# This script sets up all services and deploys the application

set -e

echo "🚀 DentalCall AI Production Deployment"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check required environment variables
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}❌ Missing required environment variable: $1${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} $1 is set"
}

echo "Checking environment variables..."
check_env "STRIPE_SECRET_KEY"
check_env "VAPI_API_KEY"
check_env "SUPABASE_SERVICE_ROLE_KEY"
check_env "RENDER_API_KEY"
echo ""

# Step 1: Set up Supabase
echo "📦 Step 1: Setting up Supabase..."
echo "Please run the following SQL in your Supabase SQL Editor:"
echo "https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/sql"
echo ""
echo "File: scripts/setup-supabase.sql"
echo ""
read -p "Press Enter when Supabase setup is complete..."
echo -e "${GREEN}✓${NC} Supabase configured"
echo ""

# Step 2: Configure Google OAuth in Supabase
echo "🔐 Step 2: Configure Google OAuth..."
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/auth/providers"
echo "2. Enable Google provider"
echo "3. Add these credentials:"
echo "   Client ID: $GOOGLE_CLIENT_ID"
echo "   Client Secret: [Use value from .env.local]"
echo "4. Add redirect URL to Google Cloud Console:"
echo "   https://fataxuuxjwibugjxekwm.supabase.co/auth/v1/callback"
echo ""
read -p "Press Enter when Google OAuth is configured..."
echo -e "${GREEN}✓${NC} Google OAuth configured"
echo ""

# Step 3: Set up Stripe products
echo "💳 Step 3: Setting up Stripe products..."
npm install
npx ts-node scripts/setup-stripe.ts
echo ""
read -p "Copy the price IDs to .env.local, then press Enter..."
echo -e "${GREEN}✓${NC} Stripe products created"
echo ""

# Step 4: Set up Vapi
echo "🎙️ Step 4: Setting up Vapi voice agent..."
npx ts-node scripts/setup-vapi.ts
echo ""
read -p "Copy the assistant ID to .env.local, then press Enter..."
echo -e "${GREEN}✓${NC} Vapi voice agent created"
echo ""

# Step 5: Deploy to Render
echo "🌐 Step 5: Deploying to Render..."
echo ""
echo "Option A: Deploy via Render Dashboard"
echo "  1. Go to: https://dashboard.render.com/select-repo?type=web"
echo "  2. Connect your GitHub repo"
echo "  3. Add environment variables from .env.local"
echo "  4. Deploy"
echo ""
echo "Option B: Deploy via API"
echo "  curl -X POST https://api.render.com/v1/services \\"
echo "    -H 'Authorization: Bearer $RENDER_API_KEY' \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d @render-service.json"
echo ""
read -p "Press Enter when deployment is complete..."
echo -e "${GREEN}✓${NC} Deployed to Render"
echo ""

# Step 6: Configure Stripe webhook
echo "🔗 Step 6: Configure Stripe webhook..."
echo ""
echo "1. Go to: https://dashboard.stripe.com/webhooks"
echo "2. Add endpoint: https://dentalcall-ai.onrender.com/api/stripe/webhook"
echo "3. Select events:"
echo "   - checkout.session.completed"
echo "   - customer.subscription.created"
echo "   - customer.subscription.updated"
echo "   - customer.subscription.deleted"
echo "   - invoice.payment_succeeded"
echo "   - invoice.payment_failed"
echo "4. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET"
echo ""
read -p "Press Enter when Stripe webhook is configured..."
echo -e "${GREEN}✓${NC} Stripe webhook configured"
echo ""

# Step 7: Connect Twilio to Vapi
echo "📞 Step 7: Connect phone number..."
echo ""
echo "1. Go to: https://dashboard.vapi.ai/phone-numbers"
echo "2. Import your Twilio number: +19728458338"
echo "3. Connect it to the DentalCall AI assistant"
echo ""
read -p "Press Enter when phone number is connected..."
echo -e "${GREEN}✓${NC} Phone number connected"
echo ""

# Done!
echo "========================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "========================================"
echo ""
echo "Your DentalCall AI is now live at:"
echo "  https://dentalcall-ai.onrender.com"
echo ""
echo "Next steps:"
echo "  1. Test signup flow"
echo "  2. Test Stripe payment (use test card 4242 4242 4242 4242)"
echo "  3. Test voice agent (call +19728458338)"
echo "  4. Run lead generation: npm run generate-leads"
echo ""
echo "Monitoring:"
echo "  - Render logs: https://dashboard.render.com"
echo "  - Stripe dashboard: https://dashboard.stripe.com"
echo "  - Vapi calls: https://dashboard.vapi.ai/calls"
echo "  - Supabase: https://supabase.com/dashboard"
echo ""
