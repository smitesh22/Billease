<template>
  <div class="min-h-screen bg-gray-50 bg-[url('/background.svg')] bg-cover bg-center">

    <!-- Header Section -->
    <div class="custom-header bg-gray-100 border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div class="text-lg font-bold cursor-pointer" @click="goToHomePage">
        <img src="/logo.svg" alt="Logo" class="h-10">
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-gray-500"><a href="#pricing" class="text-gray-500 hover:underline">Pricing</a></div>
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-800" @click="goToLogIn">Log In</button>
        <button class="bg-purple-600 text-white px-4 py-2 rounded-xl" @click="goToSignUp">Sign Up</button>
      </div>
    </div>

    <!-- Main Section -->
    <main class="container mx-auto px-8 py-24 flex flex-col items-center text-center">
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
          <button class="bg-black text-white px-8 py-3 rounded-lg text-lg"><a href="/signup">Get Started</a></button>
          <button class="bg-gray-100 hover:bg-gray-200 px-8 py-3 rounded-lg text-lg"><a href="#cards">Learn More</a></button>
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

const router = useRouter();
const user = useUserStore();

onMounted(() => {
  if (user.isAuthenticated) {
    router.push("/dashboard");
  }
});

const goToHomePage = () => router.push("/");
const goToSignUp = () => router.push("/signup");
const goToLogIn = () => router.push("/login");
</script>

<style scoped>
.custom-header {
  /* Add any specific styles if needed */
}
</style>
