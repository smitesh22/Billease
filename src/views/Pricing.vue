<template>
  <div class="min-h-screen items-center bg-gray-50 w-full rounded-xl" id="pricing">
    <section class="container mx-auto px-3 py-16">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-gray-800">Affordable Pricing Plans</h2>
        <p class="text-lg text-gray-600 mt-2">Choose a plan that fits your needs perfectly.</p>
      </div>

      <div class="flex justify-center rounded-3xl mb-10">
        <button
            class="px-6 py-2 text-lg font-medium rounded-l-md transition-all"
            :class="{
            'bg-black text-white': isMonthly,
            'bg-gray-200 text-gray-800': !isMonthly,
          }"
            @click="switchToMonthly"
        >
          Monthly
        </button>
        <button
            class="px-6 py-2 text-lg font-medium rounded-r-md transition-all"
            :class="{
            'bg-black text-white': !isMonthly,
            'bg-gray-200 text-gray-800': isMonthly,
          }"
            @click="switchToYearly"
        >
          Yearly
        </button>
      </div>

      <div class="flex flex-col md:flex-row justify-center gap-8">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full md:w-1/3 border border-gray-300">
          <h3 class="text-2xl font-semibold text-gray-800">Free Plan</h3>
          <div class="text-4xl font-bold text-gray-900 mt-6">$0
            <span class="text-xl font-medium text-gray-500">/mo</span>
          </div>
          <ul class="text-gray-600 mt-6 space-y-3">
            <li>✔ 3 receipts per day</li>
            <li>✔ Excel file conversion</li>
            <li>✔ Intuitive, user-friendly experience</li>
            <li>✖ No ad-free experience</li>
          </ul>
          <button class="w-full bg-gray-400 text-white text-lg font-medium py-3 mt-6 rounded-xl cursor-not-allowed">
            Free Plan Active
          </button>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-8 w-full md:w-1/3">
          <h3 class="text-2xl font-semibold text-gray-800">Pro Plan</h3>
          <div class="text-4xl font-bold text-gray-900 mt-6">
            <span>{{ isMonthly ? '$4.99' : '$49.99' }}</span>
            <span class="text-xl font-medium text-gray-500">/{{ isMonthly ? 'mo' : 'yr' }}</span>
          </div>
          <div v-if="!isMonthly" class="mt-2 inline-block bg-green-100 text-green-800 text-sm font-semibold py-1 px-3 rounded-full">
            17% Discount on Yearly Plan!
          </div>
          <ul class="text-gray-600 mt-6 space-y-3">
            <li>✔ Unlimited image uploads</li>
            <li>✔ Ad free experience</li>
            <li>✔ Excel file conversion</li>
            <li>✔ Intuitive, user-friendly interface</li>
            <li>✔ Access and manage previous files</li>
          </ul>
          <button
              class="w-full bg-black text-white text-lg font-medium py-3 mt-6 rounded-xl hover:bg-gray-800 flex justify-center items-center"
              @click="handleSubmit"
              :disabled="isLoading"
          >
            <svg
                v-if="isLoading"
                class="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span v-if="!isLoading">Get Started</span>
            <span v-else>Loading...</span>
          </button>
        </div>
      </div>

      <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-semibold mb-4">Payment Details</h2>
          <div id="payment-element" class="mb-4"></div>
          <div class="flex justify-end items-center mt-4">
            <span v-if="processing" class="text-gray-500 mr-4">Processing...</span>
            <button
                type="button"
                @click="closeModal"
                class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                :disabled="processing"
            >
              Cancel
            </button>
            <button
                @click="handlePayment"
                class="bg-blue-500 text-white px-4 py-2 rounded"
                :class="{ 'opacity-50 cursor-not-allowed': processing }"
                :disabled="processing"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import api from "../api/index";
import {
  STRIPE_PRICEID_MONTHLY,
  STRIPE_PRICEID_YEARLY,
  STRIPE_PUBLISHABLE_KEY
} from "../secrets/secrets";
import { useUserStore } from "../store/user";
import {useRouter} from "vue-router";

const router = useRouter();
const user = useUserStore();
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
let stripe = null;
let elements = null;

const isMonthly = ref(true);
const isOpen = ref(false);
const processing = ref(false);
const isLoading = ref(false);

const switchToMonthly = () => {
  isMonthly.value = true;
};

const switchToYearly = () => {
  isMonthly.value = false;
};

const openModal = async () => {
  try {
    const priceId = isMonthly.value ? STRIPE_PRICEID_MONTHLY : STRIPE_PRICEID_YEARLY;
    const response = await api.post("create-payment", {
      priceId,
      userId: user.getUser.id,
      userName: user.getUser.firstName + " " + user.getUser.lastName,
      userEmail: user.getUser.email,
    });

    if (response) {
      const clientSecret = response.data.clientSecret;
      stripe = await stripePromise;
      elements = stripe.elements({clientSecret});

      isOpen.value = true;
      await nextTick();

      const paymentElement = elements.create("payment");
      paymentElement.mount("#payment-element");
    }
  } catch (error) {
    console.error("Error initializing subscription:", error);
  }
};

const closeModal = () => {
  isOpen.value = false;
};

const handleSubmit = async () => {
  console.log("User isAuthenticated:", user.isAuthenticated);
  isLoading.value = true;
  if (user.isAuthenticated) {
    await openModal();
  } else {
    await router.push("/login");
  }
  isLoading.value = false;
};
const handlePayment = async () => {
  try {
    processing.value = true;
    console.log("Processing payment...");
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    });

    if (error) {
      console.error("Payment failed:", error.message);
    } else {
      console.log("Subscription succeeded!");
      console.log("Payment intent:", paymentIntent);
      await api.post("verify-payment", {
        userId: user.getUser.id,
        subscriptionType: isMonthly.value ? "monthly" : "yearly",
      })
      user.setIsSubscribed(true);
      user.clearSubscriptionSetToEnd();
      await router.push({
        path: "/dashboard",
        query: { message: "Subscription successful! Welcome to the Pro plan!" }
      });
      closeModal();
    }
  } catch (error) {
    console.error("Payment error:", error);
  } finally {
    processing.value = false;
  }
};
</script>

<style>
/* Add any necessary custom styling */
</style>
