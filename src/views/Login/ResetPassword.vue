<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center mb-4">Reset Password</h2>
      <p class="text-sm text-gray-600 text-center mb-6">
        Enter the OTP sent to your email and set a new password.
      </p>

      <div v-if="loading" class="flex justify-center mb-4">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>

      <div class="mb-4">
        <label for="otp" class="block text-sm font-medium text-gray-700">OTP*</label>
        <input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            v-model="otp"
        />
      </div>
      <button
          class="w-full text-sm text-purple-600 py-1 hover:underline mb-4"
          @click="resendOtp"
          :disabled="loading"
      >
        Resend OTP
      </button>

      <div v-if="showPassword">
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">New Password*</label>
          <input
              id="password"
              type="password"
              placeholder="New Password"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              v-model="newPassword"
              @input="validatePassword"
          />
          <p v-if="passwordError" class="text-red-600 text-sm mt-1">{{ passwordError }}</p>
        </div>

        <div class="mb-4">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password*</label>
          <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              v-model="confirmPassword"
          />
        </div>
      </div>

      <div class="mb-4">
        <button
            class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
            :disabled="loading || !otp"
            @click="handleResetPassword"
        >
          {{ buttonValue }}
        </button>
      </div>

      <div v-if="showMessage" class="p-4 mt-4 text-sm text-green-800 bg-green-100 rounded-lg" role="alert">
        {{ message }}
      </div>

      <div v-if="showError" class="p-4 mt-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import api from "../../api";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const buttonValue = ref('Verify Code');
const loading = ref(false);
const showMessage = ref(false);
const showError = ref(false);
const message = ref('');
const error = ref('');
const showPassword = ref(false);
const passwordError = ref('');

const handleResetPassword = async () => {
  if (!otp.value) {
    showError.value = true;
    error.value = "Code is required.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    showError.value = true;
    error.value = "Passwords do not match.";
    return;
  }

  showError.value = false;
  loading.value = true;

  try {
    await api.post('/verify-token', {
      code: otp.value,
      email: route.query.email as string,
    });

    showPassword.value = true;
    buttonValue.value = "Reset Password";

    if (newPassword.value) {
      await api.post('/reset-password', {
        email: route.query.email as string,
        newPassword: newPassword.value,
      });

      showMessage.value = true;
      message.value = "Your password has been reset successfully.";

      await router.push({
        path: '/login',
        query: { message: "Your password has been reset, please login!" },
      });
    }
  } catch (err: unknown) {
    console.error(err);
    showError.value = true;
    error.value = "Failed to reset password. Please try again.";
  } finally {
    loading.value = false;
  }
};

const resendOtp = async () => {
  loading.value = true;
  showError.value = false;
  try {
    await api.post('/resend-token', { email: route.query.email as string });
    showMessage.value = true;
    message.value = "A new OTP has been sent to your email.";
  } catch (err: unknown) {
    console.error(err);
    showError.value = true;
    error.value = err.response.data.message;
  } finally {
    loading.value = false;
  }
};

const validatePassword = () => {
  const password = newPassword.value;
  if (password.length < 8) {
    passwordError.value = "Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(password)) {
    passwordError.value = "Password must contain at least one uppercase letter.";
  } else if (!/[0-9]/.test(password)) {
    passwordError.value = "Password must contain at least one number.";
  } else {
    passwordError.value = '';
  }
};
</script>