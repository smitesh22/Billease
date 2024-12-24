<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <!-- Logo Section -->
    <div class="mb-8">
      <div class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
        <span class="text-gray-500 text-sm">Logo</span>
      </div>
    </div>

    <!-- Form Section -->
    <div class="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center mb-4">Create an account</h2>

      <!-- Email Input -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email address*</label>
        <input
            id="email"
            type="email"
            placeholder="Email address"
            v-model="email"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
        <p v-if="!isEmailValid" class="text-red-500 text-sm mt-1" aria-live="polite">
          Invalid email address.
        </p>
      </div>

      <div class="mb-4" v-if="showPassword">
        <label for="password" class="block text-sm font-medium text-gray-700">Password*</label>
        <input
            id="password"
            type="password"
            placeholder="Password"
            v-model="password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />

        <div class="space-y-2 mt-4">
          <div class="flex items-center">
            <span :class="{'text-green-500': isLowercase, 'text-red-500': !isLowercase}">{{
                isLowercase ? '✔️' : '❌'
              }}</span>
            <span class="ml-2">At least one lowercase letter</span>
          </div>
          <div class="flex items-center">
            <span :class="{'text-green-500': isUppercase, 'text-red-500': !isUppercase}">{{
                isUppercase ? '✔️' : '❌'
              }}</span>
            <span class="ml-2">At least one uppercase letter</span>
          </div>
          <div class="flex items-center">
            <span :class="{'text-green-500': isDigit, 'text-red-500': !isDigit}">{{ isDigit ? '✔️' : '❌' }}</span>
            <span class="ml-2">At least one digit</span>
          </div>
          <div class="flex items-center">
            <span :class="{'text-green-500': isSpecialChar, 'text-red-500': !isSpecialChar}">{{
                isSpecialChar ? '✔️' : '❌'
              }}</span>
            <span class="ml-2">At least one special character</span>
          </div>
          <div class="flex items-center">
            <span :class="{'text-green-500': isLengthValid, 'text-red-500': !isLengthValid}">{{
                isLengthValid ? '✔️' : '❌'
              }}</span>
            <span class="ml-2">At least 8 characters</span>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <button
          class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300  font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
          @click="validateUserData"
          :disabled="!isPasswordValid && buttonValue === 'Get Code'"
      >
        {{ buttonValue }}
      </button>

      <!-- Login Link -->
      <div class="text-center text-sm text-gray-500 mt-4">
        Already have an account?
        <a href="/login" class="text-green-600 hover:underline">Login</a>
      </div>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="border-t border-gray-300 flex-grow"></div>
        <span class="px-2 text-gray-500 text-sm">OR</span>
        <div class="border-t border-gray-300 flex-grow"></div>
      </div>

      <!-- Social Login Buttons -->
      <div class="space-y-3">
        <button
            class="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50">
          <div class="h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <span class="text-xs text-gray-500">G</span>
          </div>
          <span class="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>
        <button
            class="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50">
          <div class="h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <span class="text-xs text-gray-500">M</span>
          </div>
          <span class="text-sm font-medium text-gray-700">Continue with Microsoft Account</span>
        </button>
        <button
            class="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50">
          <div class="h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <span class="text-xs text-gray-500">A</span>
          </div>
          <span class="text-sm font-medium text-gray-700">Continue with Apple</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from "vue";

const email = ref("");
const password = ref("");
const buttonValue = ref("Continue");
const isEmailValid = ref(true);
let isPasswordValid = ref(false);
const showPassword = ref(false);

const isLowercase = computed(() => /[a-z]/.test(password.value));
const isUppercase = computed(() => /[A-Z]/.test(password.value));
const isDigit = computed(() => /\d/.test(password.value));
const isSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value));
const isLengthValid = computed(() => password.value.length >= 8);

isPasswordValid = computed(() => {
  return isLowercase.value && isUppercase.value && isDigit.value && isSpecialChar.value && isLengthValid.value;
});

const validateUserData = () => {
  if (buttonValue.value === "Continue") {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

    isEmailValid.value = isValidEmail;
    showPassword.value = isValidEmail;

    if (isValidEmail) {
      buttonValue.value = "Get Code";
    }
  } else {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    isPasswordValid.value = passwordRegex.test(password.value);
  }

  console.log(email.value);
  console.log(password.value);
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
