import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env
  .VITE_STRIPE_PUBLISHABLE_KEY as string;

if (!stripePublishableKey) {
  console.warn("VITE_STRIPE_PUBLISHABLE_KEY is not set in .env");
}

export const stripePromise = loadStripe(stripePublishableKey);
