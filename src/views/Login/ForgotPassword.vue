<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
      <p class="text-sm text-gray-600 text-center mb-6">
        Enter your email address and we will send you a link to reset your password.
      </p>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email address*</label>
        <input
            id="email"
            type="email"
            placeholder="Email address"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            v-model="email"
        />
      </div>

      <div class="mb-4">
        <button
            class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
            :disabled="loading"
            @click="handleForgotPassword"
        >
          {{ loading ? "Sending..." : "Send Reset Link" }}
        </button>
      </div>

      <div v-if="showMessage" class="p-4 mt-4 text-sm text-green-800 bg-green-100 rounded-lg" role="alert">
        {{ message }}
      </div>

      <div v-if="showError" class="p-4 mt-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
        {{ error }}
      </div>

      <div class="text-center text-sm text-gray-500 mt-4">
        Remembered your password?
        <a href="/login" class="text-purple-600 hover:underline">Log In</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../../api";
import {useRouter} from "vue-router";

const email = ref('');
const loading = ref(false);
const showMessage = ref(false);
const showError = ref(false);
const message = ref('');
const error = ref('');

const router = useRouter();

const handleForgotPassword = async () => {
  if (!email.value) {
    showError.value = true;
    error.value = "Please enter your email address.";
    return;
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  if (!isValidEmail) {
    showError.value = true;
    error.value = "Invalid email address.";
    return;
  }

  loading.value = true;
  showError.value = false;

  try {
    await api.post('/resend-token', { email: email.value });
    showMessage.value = true;
    message.value = "Password reset link has been sent to your email.";

    await router.push({
      path: "/reset-password",
      query: { email: email.value }
    });
  } catch (err: unknown) {
    console.error(err);
    showError.value = true;
    error.value = "Failed to send reset link. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>