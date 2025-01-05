import { loadStripe } from "@stripe/stripe-js";
import {STRIPE_PUBLISHABLE_KEY} from "../secrets/secrets.ts";

const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);

export default stripe;