<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <header class="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
      <div class="text-lg font-bold" @click="goToHomePage">Logo</div>
      <div class="flex items-center space-x-4">
        <div class="text-gray-500">More Options</div>
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-800" @click="goToLogIn">Log In</button>
        <button class="bg-purple-600 text-white px-4 py-2 rounded" @click="goToSignUp">Sign Up</button>
      </div>
    </header>

    <!-- Main Section -->
    <main class="container mx-auto px-8 py-16">
      <div class="flex items-center space-x-8">
        <!-- Text Section -->
        <div class="w-1/2">
          <h1 class="text-4xl font-bold mb-4">
            Transform Your Receipts into Excel Effortlessly
          </h1>
          <p class="text-gray-600 mb-6">
            Welcome to ZenPay, where managing your finances becomes a breeze.
            Upload your receipts and invoices, and watch them convert into organized Excel files in seconds.
          </p>
          <div class="flex space-x-4">
            <button class="bg-black text-white px-6 py-2 rounded">Get Started</button>
            <button class="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded">Learn More</button>
          </div>
        </div>

        <!-- Image Section -->
        <div class="w-1/2">
          <div class="bg-gray-200 h-72 flex items-center justify-center rounded">
            <div class="text-gray-400">Image Placeholder</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()
const goToHomePage = () => {
  router.push("/")
}
const goToSignUp = () => {
  router.push("/signup")
}

const goToLogIn = () => {
  router.push("/login")
}
// You can add any additional setup if required
</script>

<style scoped>
/* You can add specific styles here if needed */
</style>
