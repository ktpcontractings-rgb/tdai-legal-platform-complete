/**
 * Stripe Payment Integration
 * Handles subscription billing, one-time payments, and payment processing
 */

import Stripe from "stripe";

// Initialize Stripe with API key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
});

// Pricing tiers
export const PRICING_TIERS = {
  FREE: {
    name: "Free",
    priceId: null,
    price: 0,
    features: ["1 question/month", "Basic AI assistance", "Community support"],
  },
  INDIVIDUAL: {
    name: "Individual",
    priceId: process.env.STRIPE_INDIVIDUAL_PRICE_ID,
    price: 49,
    features: [
      "Unlimited questions",
      "All legal specializations",
      "Priority support",
      "Document templates",
      "Email support",
    ],
  },
  SMALL_BUSINESS: {
    name: "Small Business",
    priceId: process.env.STRIPE_SMALL_BUSINESS_PRICE_ID,
    price: 199,
    features: [
      "Everything in Individual",
      "Multi-user access (up to 5)",
      "Contract review",
      "Compliance monitoring",
      "Phone support",
      "Dedicated account manager",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    price: null, // Custom pricing
    features: [
      "Everything in Small Business",
      "Unlimited users",
      "Custom AI agent training",
      "API access",
      "SLA guarantee",
      "White-label option",
      "24/7 priority support",
    ],
  },
};

// One-time service pricing
export const ONE_TIME_SERVICES = {
  TRAFFIC_TICKET: {
    name: "Traffic Ticket Defense",
    priceId: process.env.STRIPE_TRAFFIC_TICKET_PRICE_ID,
    price: 2999, // $29.99 in cents
    description: "AI-powered traffic ticket defense and consultation",
  },
  DOCUMENT_REVIEW: {
    name: "Document Review",
    priceId: process.env.STRIPE_DOCUMENT_REVIEW_PRICE_ID,
    price: 9999, // $99.99 in cents
    description: "Professional legal document review by AI agents",
  },
  CONSULTATION: {
    name: "One-Time Consultation",
    priceId: process.env.STRIPE_CONSULTATION_PRICE_ID,
    price: 14999, // $149.99 in cents
    description: "60-minute consultation with specialized AI legal agent",
  },
};

/**
 * Create a Stripe checkout session for subscription
 */
export async function createSubscriptionCheckout(
  userId: number,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId.toString(),
    metadata: {
      userId: userId.toString(),
    },
  });

  return session;
}

/**
 * Create a Stripe checkout session for one-time payment
 */
export async function createOneTimeCheckout(
  userId: number,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId.toString(),
    metadata: {
      userId: userId.toString(),
      ...metadata,
    },
  });

  return session;
}

/**
 * Create a customer portal session for managing subscriptions
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

/**
 * Get subscription details
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(
  userId: number,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  // Search for existing customer by email
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId: userId.toString(),
    },
  });

  return customer;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
