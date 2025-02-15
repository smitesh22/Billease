import { loadStripe, Stripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "../secrets/secrets";

let stripePromise: Promise<Stripe | null>;

async function getStripeInstance() {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
}

export default getStripeInstance;
