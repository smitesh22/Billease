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
            v-model="email"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password*</label>
        <input
            id="password"
            type="password"
            placeholder="Password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            v-model="password"
        />
      </div>
      <div class="mb-4">
        <button
            class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300  font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
            @click="handleSubmit"
        >
          Log In
        </button>

        <div class="text-center text-sm text-gray-500 mt-4">
          Dont have an account?
          <a href="/signup" class="text-green-600 hover:underline">Register</a>
        </div>
        <p v-if="showWarning" class="text-red-500 text-sm mt-1" aria-live="polite">
          {{ warning }}</p>

        <p v-if="showMessage" class="text-green-500 text-sm mt-1" aria-live="polite">
          {{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import api from "../../api";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../store/user.ts";
import { AxiosError } from "axios";

const userStore = useUserStore();

const email = ref('');
const password = ref('');
const showWarning = ref(false);
const showMessage = ref(false);
const message = ref('');
let warning = ref('');

const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (typeof route.query.message === "string") {
    showMessage.value = true;
    message.value = route.query.message;
  }

  if (localStorage.authToken) {
    router.push('/app');
  }
});

const handleSubmit = async () => {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  if (isValidEmail) {
    try {
      const response = await api.post('/login', {
        email: email.value,
        password: password.value
      });

      localStorage.setItem("authToken", response.data.token);
      userStore.setAuthToken(response.data.token);

      // Set user data in the store
      userStore.setUser({
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        isVerified: response.data.verified,
      });

      console.log("Logged in successfully, token stored in localStorage");
      await router.push("/app");
    } catch (error: unknown) {
      showWarning.value = true;

      if (error instanceof AxiosError && error.response?.data?.message === "User is not verified") {
        warning.value = error.response.data.message;
        await router.push({
          path: '/verify',
          query: { email: email.value },
        });
      }
    }
  } else {
    showWarning.value = true;
    warning.value = "Invalid email address.";
  }
};
</script>
