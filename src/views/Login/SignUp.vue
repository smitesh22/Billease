<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <!-- Logo Section -->
    <div class="mb-8">
      <img src="/logo.svg" alt="Logo">
    </div>

    <!-- Form Section -->
    <div class="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center mb-4">Create an account</h2>

      <!-- Email Input -->
      <div class="mb-4">
        <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email address*</label>
        <input
            id="email"
            type="email"
            placeholder="Email address"
            v-model="email"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
        </div>
        <div class="mb-4">
        <label for="firstname" class="block text-sm font-medium text-gray-700">First Name*</label>
        <input
            id="firstname"
            type="text"
            placeholder="First Name"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            v-model="firstName"
        />
        </div>
        <div class="mb-4">
        <label for="lastname" class="block text-sm font-medium text-gray-700">Last Name</label>
        <input
            id="lastname"
            type="text"
            placeholder="Last Name"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            v-model="lastName"
        />
        </div>
        <div v-if="showWarning" aria-live="polite" class="p-4 mt-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
          {{warning}}
        </div>
      </div>

      <div class="mb-4" v-if="showPassword">
        <label for="password" class="block text-sm font-medium text-gray-700">Password*</label>
        <div class="relative">
          <input
              id="password"
              :type="showPasswordField ? 'text' : 'password'"
              placeholder="Password"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 pr-10"
              v-model="password"
          />
          <!-- Eye Toggle Button -->
          <button
              type="button"
              class="absolute inset-y-0 right-2 flex items-center px-2"
              @click="togglePassword"
          ><img :src="showPasswordField ? hideIcon : showIcon" alt="Toggle Password" class="w-6 h-6 cursor-pointer" />
          </button>
        </div>

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
      <div v-if="showLoginWarning" aria-live="polite" class="p-4 mt-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
        {{warning}}
      </div>
      <button
          class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300 flex justify-center items-center"
          @click="validateUserData"
          :disabled="!isPasswordValid && buttonValue === 'Get Code' || isLoading"
      >
        <span v-if="!isLoading">{{ buttonValue }}</span>
        <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </button>

      <!-- Login Link -->
      <div class="text-center text-sm text-gray-500 mt-4">
        Already have an account?
        <a href="/login" class="text-purple-600 hover:underline">Login</a>
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
        <span class="text-sm font-medium text-gray-700">Continue with Google</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import api from "../../api/index.ts";
import {useRouter} from "vue-router";
import {useUserStore} from "../../store/user.ts";

const router = useRouter();
const email = ref("");
const password = ref("");
const firstName = ref('')
const lastName = ref('')
const buttonValue = ref("Continue");

const showIcon = "/showPassword.svg";
const hideIcon = "/hidePassword.svg";

const userStore = useUserStore();

const warning = ref("");
const showLoginWarning = ref(false);
const showWarning = ref(false);
const isEmailValid = ref(true);
const isPasswordValid = computed(() => {
  return isLowercase.value && isUppercase.value && isDigit.value && isSpecialChar.value && isLengthValid.value;
});
const showPassword = ref(false);
const showPasswordField = ref(false);
const isLoading = ref(false);

const isLowercase = computed(() => /[a-z]/.test(password.value));
const isUppercase = computed(() => /[A-Z]/.test(password.value));
const isDigit = computed(() => /\d/.test(password.value));
const isSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value));
const isLengthValid = computed(() => password.value.length >= 8);
import {useGoogleAuth} from "../../componsables/useGoogleAuth";
const { signInWithGoogle } = useGoogleAuth();

onMounted(() => {
  if(localStorage.authToken){
    router.push('/dashboard');
  }
})
const validateUserData = async () => {
  if (isLoading.value) return; // Prevent multiple clicks
  isLoading.value = true; // Start loading animation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  const isValidFirstName = firstName.value && firstName.value.length > 0;

  isEmailValid.value = isValidEmail;
  showPassword.value = isValidEmail && isValidFirstName;

  if (isValidEmail && isValidFirstName) {
    showWarning.value = false;
    buttonValue.value = "Get Code";
  } else {
    showWarning.value = true;
    isLoading.value = false; // Stop loading if validation fails
    if (!isValidEmail) {
      warning.value = "Please enter a valid email address";
    } else {
      warning.value = "First name is required";
    }
  }

  if (buttonValue.value === "Get Code" && isValidEmail && isValidFirstName && isPasswordValid.value) {
    try {
      const response = await api.post("/register", {
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value,
      });

      await router.push({
        path: '/verify',
        query: {email: email.value},
      })


    } catch (error) {
      if (error.response && error.response.data) {
        // Access error message only if response and data are available
        warning.value = error.response.data.message;
        showLoginWarning.value = true;
      } else {
        // Handle other types of errors (e.g., network errors)
        warning.value = "An unexpected error occurred. Please try again.";
        showLoginWarning.value = true;
      }
    }
  }
  isLoading.value = false;
};

const togglePassword = () => {
  showPasswordField.value = !showPasswordField.value;
};

</script>

<style scoped>
/* Add custom styles if needed */
</style>
