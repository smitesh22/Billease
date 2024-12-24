<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="mb-8">
      <div class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
        <span class="text-gray-500 text-sm">Logo</span>
      </div>
    </div>
    <div class="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center mb-4">Login</h2>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email address*</label>
        <input
            id="email"
            type="email"
            placeholder="Email address"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password*</label>
        <input
            id="password"
            type="password"
            placeholder="Password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <button
          class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300  font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
      >
        Log In
      </button>
    </div>

  </div>

</template>
<script setup lang="ts">
</script>