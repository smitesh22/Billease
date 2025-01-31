<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="mb-8">
        <img src="/logo.svg" alt="Logo">
    </div>
    <div class="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center mb-4">Welcome Back!</h2>

      <!-- Email Input -->
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

      <!-- Password Input with Show/Hide Toggle -->
      <div class="mb-4 relative">
        <label for="password" class="block text-sm font-medium text-gray-700">Password*</label>
        <div class="relative">
        <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 pr-10"
            v-model="password"
        />
        <!-- Eye Toggle Button -->
        <button
            type="button"
            class="absolute inset-y-0 right-2 flex items-center px-2"
            @click="togglePassword"
        ><img :src="showPassword ? hideIcon : showIcon" alt="Toggle Password" class="w-6 h-6 cursor-pointer" />
        </button>
        </div>
      </div>

      <!-- Forgot Password -->
      <div class="flex justify-left">
        <a href="/forgot-password" class="text-sm text-purple-600 mb-2 hover:underline">Forgot password?</a>
      </div>

      <!-- Login Button -->
      <div class="mb-4">
        <button
            class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
            @click="handleSubmit"
        >
          Log In
        </button>

        <!-- Warning & Success Messages -->
        <div v-if="showWarning" aria-live="polite" class="p-4 mt-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
          {{ warning }}
        </div>

        <div v-if="showMessage" aria-live="polite" class="p-4 mt-4 mb-4 text-sm text-green-800 bg-green-100 rounded-lg" role="alert">
          {{ message }}
        </div>

        <!-- Divider -->
        <div class="flex items-center my-6">
          <div class="border-t border-gray-300 flex-grow"></div>
          <span class="px-2 text-gray-500 text-sm">OR</span>
          <div class="border-t border-gray-300 flex-grow"></div>
        </div>


        <!-- Google Login Button -->
        <button
            class="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50"
            @click="signInWithGoogle"
        >
          <img src="/google-icon.svg" class="h-5 w-5 mr-2" alt="Google Logo" />
          <span class="text-sm font-medium text-gray-700">Sign In with Google</span>
        </button>
        <!-- Register Link -->
        <div class="text-center text-sm text-gray-500 mt-4">
          Don't have an account?
          <a href="/signup" class="text-purple-600 hover:underline">Register</a>
        </div>
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
import {useGoogleAuth} from "../../componsables/useGoogleAuth";
const { signInWithGoogle } = useGoogleAuth();

const userStore = useUserStore();
const email = ref('');
const password = ref('');
const showPassword = ref(false); // Toggle visibility state

const showWarning = ref(false);
const showMessage = ref(false);
const message = ref('');
const warning = ref('');

const router = useRouter();
const route = useRoute();

// Define image paths (Make sure they are inside the public or assets folder)
const showIcon = "/showPassword.svg";
const hideIcon = "/hidePassword.svg";

// Handle show/hide password toggle
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

onMounted(() => {
  if (typeof route.query.message === "string") {
    showMessage.value = true;
    message.value = route.query.message;
  }

  if (localStorage.authToken) {
    router.push('/dashboard');
  }
});

const handleSubmit = async () => {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  if (isValidEmail) {
    try {
      console.log("Logging in...");
      const response = await api.post('login', {
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
        privileged: response.data.privileged,
      });

      console.log("Logged in successfully, token stored in localStorage");
      await router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error logging in:", error);
      showWarning.value = true;
      if (error instanceof AxiosError && error.response?.data?.message === "User is not verified") {
        warning.value = error.response.data.message;
        await router.push({
          path: '/verify',
          query: { email: email.value },
        });
      } else if (error.response?.data?.message) {
        warning.value = error.response.data.message;
      }
    }
  } else {
    showWarning.value = true;
    warning.value = "Invalid email address.";
  }
};
</script>
