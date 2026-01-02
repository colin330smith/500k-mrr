#!/usr/bin/env npx ts-node
/**
 * DentalCall AI - Stripe Setup Script
 * Creates products, prices, and webhook configuration
 *
 * Run: npx ts-node scripts/setup-stripe.ts
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async function setupStripe() {
  console.log('🚀 Setting up Stripe for DentalCall AI...\n');

  try {
    // Create Products
    console.log('Creating products...');

    const starterProduct = await stripe.products.create({
      name: 'DentalCall AI Starter',
      description: 'AI Receptionist for solo practitioners - 500 minutes/month',
      metadata: { tier: 'starter' },
    });
    console.log(`✅ Created Starter product: ${starterProduct.id}`);

    const professionalProduct = await stripe.products.create({
      name: 'DentalCall AI Professional',
      description: 'AI Receptionist for growing practices - 2,000 minutes/month',
      metadata: { tier: 'professional', popular: 'true' },
    });
    console.log(`✅ Created Professional product: ${professionalProduct.id}`);

    const businessProduct = await stripe.products.create({
      name: 'DentalCall AI Business',
      description: 'AI Receptionist for multi-location practices - 5,000 minutes/month',
      metadata: { tier: 'business' },
    });
    console.log(`✅ Created Business product: ${businessProduct.id}`);

    // Create Monthly Prices
    console.log('\nCreating monthly prices...');

    const starterMonthlyPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 29900, // $299.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { tier: 'starter', billing: 'monthly' },
    });
    console.log(`✅ Starter Monthly: ${starterMonthlyPrice.id} ($299/mo)`);

    const professionalMonthlyPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 59900, // $599.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { tier: 'professional', billing: 'monthly' },
    });
    console.log(`✅ Professional Monthly: ${professionalMonthlyPrice.id} ($599/mo)`);

    const businessMonthlyPrice = await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 99900, // $999.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { tier: 'business', billing: 'monthly' },
    });
    console.log(`✅ Business Monthly: ${businessMonthlyPrice.id} ($999/mo)`);

    // Create Annual Prices (20% discount)
    console.log('\nCreating annual prices (20% off)...');

    const starterAnnualPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 286800, // $2,868/year ($239/mo)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { tier: 'starter', billing: 'annual' },
    });
    console.log(`✅ Starter Annual: ${starterAnnualPrice.id} ($239/mo billed annually)`);

    const professionalAnnualPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 574800, // $5,748/year ($479/mo)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { tier: 'professional', billing: 'annual' },
    });
    console.log(`✅ Professional Annual: ${professionalAnnualPrice.id} ($479/mo billed annually)`);

    const businessAnnualPrice = await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 958800, // $9,588/year ($799/mo)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { tier: 'business', billing: 'annual' },
    });
    console.log(`✅ Business Annual: ${businessAnnualPrice.id} ($799/mo billed annually)`);

    // Create Customer Portal Configuration
    console.log('\nConfiguring customer portal...');

    const portalConfig = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'DentalCall AI - Manage Your Subscription',
      },
      features: {
        customer_update: {
          enabled: true,
          allowed_updates: ['email', 'address'],
        },
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other',
            ],
          },
        },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: starterProduct.id,
              prices: [starterMonthlyPrice.id, starterAnnualPrice.id],
            },
            {
              product: professionalProduct.id,
              prices: [professionalMonthlyPrice.id, professionalAnnualPrice.id],
            },
            {
              product: businessProduct.id,
              prices: [businessMonthlyPrice.id, businessAnnualPrice.id],
            },
          ],
        },
      },
    });
    console.log(`✅ Portal configured: ${portalConfig.id}`);

    // Output environment variables
    console.log('\n📋 Add these to your .env.local:\n');
    console.log(`STRIPE_STARTER_PRICE_ID=${starterMonthlyPrice.id}`);
    console.log(`STRIPE_PROFESSIONAL_PRICE_ID=${professionalMonthlyPrice.id}`);
    console.log(`STRIPE_BUSINESS_PRICE_ID=${businessMonthlyPrice.id}`);
    console.log(`STRIPE_STARTER_ANNUAL_PRICE_ID=${starterAnnualPrice.id}`);
    console.log(`STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID=${professionalAnnualPrice.id}`);
    console.log(`STRIPE_BUSINESS_ANNUAL_PRICE_ID=${businessAnnualPrice.id}`);

    console.log('\n✅ Stripe setup complete!');
    console.log('\n⚠️  Remember to set up webhooks at:');
    console.log('   https://dashboard.stripe.com/webhooks');
    console.log('   Endpoint: https://dentalcall.ai/api/stripe/webhook');
    console.log('   Events: checkout.session.completed, customer.subscription.*, invoice.*');

  } catch (error) {
    console.error('❌ Error setting up Stripe:', error);
    process.exit(1);
  }
}

setupStripe();
