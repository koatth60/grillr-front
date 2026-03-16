import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

// Keep named export for backwards compat — lazily resolved
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

export const PLANS = {
  FREE: {
    name: "Free",
    sessions: 3,
    price: 0,
    priceId: null,
  },
  PRO: {
    name: "Pro",
    sessions: Infinity,
    price: 9,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
  },
} as const;

export type Plan = keyof typeof PLANS;
