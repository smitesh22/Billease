<template>
  <div class="min-h-screen bg-gray-50 bg-[url('/background.svg')] bg-cover bg-center">

    <!-- Header Section -->
    <div class="custom-header bg-gray-100 border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div class="text-lg font-bold cursor-pointer" @click="goToHomePage">
        <img src="/logo.svg" alt="Logo" class="h-10">
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-gray-500"><button @click=scrollToPricing class="text-gray-500 hover:underline">Pricing</button></div>
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-800" @click="goToLogIn">Log In</button>
        <button class="bg-purple-600 text-white px-4 py-2 rounded-xl" @click="goToSignUp">Sign Up</button>
      </div>
    </div>

    <!-- Main Section -->
    <main class="container mx-auto px-8 py-24 flex flex-col items-center text-center">
      <div v-if="$route.query.message" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between w-[90%] md:w-[50%] z-50">
        <span class="text-sm font-medium">{{ $route.query.message }}</span>
        <button @click="closeMessage" class="ml-4 text-sm font-bold underline hover:opacity-80">Close</button>
      </div>
      <div class="w-full max-w-4xl flex flex-col items-center">
        <h1 class="text-5xl font-bold mb-8 leading-relaxed">
          Transform Your Receipts into Excel
          <span class="bg-purple-600 text-white px-2 py-1 rounded-md">Effortlessly</span> 🚀
        </h1>
        <p class="text-gray-600 mb-10 text-lg max-w-2xl">
          Welcome to LedgeFast, where managing your finances becomes a breeze.
          Upload your receipts and invoices, and watch them convert into organized Excel files in seconds.
        </p>
        <div class="flex space-x-6">
          <button
              class="bg-black text-white px-8 py-3 rounded-lg text-lg"
              @click="gotToSignUp">Get Started
          </button>

          <button
              class="bg-gray-100 hover:bg-gray-200 px-8 py-3 rounded-lg text-lg"
              @click="scrollToCards"
          >
            Learn More
          </button>
        </div>
      </div>

      <!-- Cards-->
      <Cards id="cards" />

      <!-- Pricing-->
      <Pricing id="pricing" />
    </main>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Pricing from "./Pricing.vue";
import Cards from "./Cards.vue";
import { onMounted } from "vue";
import { useUserStore } from "../store/user";
import {API_URL, STRIPE_PRICEID_MONTHLY, STRIPE_PRICEID_YEARLY, STRIPE_PUBLISHABLE_KEY} from "../secrets/secrets";

const router = useRouter();
const user = useUserStore();

onMounted(() => {
  if (user.isAuthenticated) {
    router.push("/dashboard");
  }
});
const scrollToCards = () => {
  const element = document.getElementById("cards");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const gotToSignUp = () => {
  router.push('/signup')
}

const closeMessage = () => {
  router.replace({ path: router.currentRoute.value.path, query: {} });
}

const scrollToPricing = () => {
  const element = document.getElementById("pricing");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const goToHomePage = () => router.push("/");
const goToSignUp = () => router.push("/signup");
const goToLogIn = () => router.push("/login");
</script>

<style scoped>
.custom-header {
  /* Add any specific styles if needed */
}
</style>
