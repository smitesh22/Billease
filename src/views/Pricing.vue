<template>
  <div class="min-h-screen bg-gray-50" id="pricing">
    <!-- Pricing Section -->
    <section class="container mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-gray-800">Affordable Pricing Plans</h2>
        <p class="text-lg text-gray-600 mt-2">Choose a plan that fits your needs perfectly.</p>
      </div>

      <!-- Tabs -->
      <div class="flex justify-center mb-10">
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

      <!-- Plans -->
      <div class="flex flex-col md:flex-row justify-center gap-8">
        <!-- Basic Plan -->
        <div class="bg-white shadow-lg rounded-lg p-8 w-full md:w-1/3">
          <h3 class="text-2xl font-semibold text-gray-800">Basic Plan</h3>
          <p class="text-gray-500 mt-2">Ideal for personal use.</p>
          <div class="text-4xl font-bold text-gray-900 mt-6">
            <span>{{ isMonthly ? '€9' : '€97.20' }}</span>
            <span class="text-xl font-medium text-gray-500">/{{ isMonthly ? 'mo' : 'yr' }}</span>
          </div>
          <ul class="text-gray-600 mt-6 space-y-3">
            <li>✔ Receipt uploads up to 10</li>
            <li>✔ Excel file conversion</li>
            <li>✔ User-friendly interface</li>
            <li>✔ Chatbot assistance</li>
            <li>✔ Access previous files</li>
            <li>✔ 24/7 customer support</li>
          </ul>
          <button class="w-full bg-black text-white text-lg font-medium py-3 mt-6 rounded-md hover:bg-gray-800">
            Get Started
          </button>
        </div>

        <!-- Business Plan -->
        <div class="bg-white shadow-lg rounded-lg p-8 w-full md:w-1/3">
          <h3 class="text-2xl font-semibold text-gray-800">Business Plan</h3>
          <p class="text-gray-500 mt-2">Perfect for small businesses.</p>
          <div class="text-4xl font-bold text-gray-900 mt-6">
            <span>{{ isMonthly ? '€19' : '€205.20' }}</span>
            <span class="text-xl font-medium text-gray-500">/{{ isMonthly ? 'mo' : 'yr' }}</span>
          </div>
          <ul class="text-gray-600 mt-6 space-y-3">
            <li>✔ Receipt uploads up to 50</li>
            <li>✔ Advanced analytics tools</li>
            <li>✔ Team collaboration features</li>
            <li>✔ Customizable dashboards</li>
            <li>✔ Secure data storage</li>
            <li>✔ Priority customer support</li>
          </ul>
          <button class="w-full bg-black text-white text-lg font-medium py-3 mt-6 rounded-md hover:bg-gray-800">
            Get Started
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isMonthly = ref(true);

const switchToMonthly = () => {
  isMonthly.value = true;
};

const switchToYearly = () => {
  isMonthly.value = false;
};
</script>
