<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <p class="text-gray-600 mb-6">
        We have just texted a code to your email. Please enter it below to securely login.
        We will never ask you to reveal this code. Never share this code with anyone as it can be used to gain access to your account.
      </p>
      <div class="mb-4">
        <input
            id="code"
            type="text"
            placeholder="Enter your code"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            v-model="code"
        />
      </div>


      <div v-if="showWarning" aria-live="polite" class="p-4 mt-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
        {{warning}}
      </div>

      <div v-if="showMessage" aria-live="polite" class="p-4 mt-4 mb-4 text-sm text-green-800 bg-green-100 rounded-lg" role="alert">
        {{message}}
      </div>
      <div class="mb-4">
        <button
            class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300 flex justify-center items-center"
            @click="handleSubmit"
            :disabled="isVerifying"
        >
          <span v-if="!isVerifying">Verify Email</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </button>
      </div>

      <button
          class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300 flex justify-center items-center"
          @click="resendCode"
          :disabled="isResending"
      >
        <span v-if="!isResending">Resend Code</span>
        <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api";
import router from "../../router";


const code = ref("");
const userEmail = ref<string | null>(null);

const showWarning = ref(false);
const showMessage = ref(false);
const message = ref("");
const warning = ref("");

const route = useRoute();

const isVerifying = ref(false);
const isResending = ref(false);

onMounted(() => {
  if(localStorage.authToken){
    router.push('/dashboard')
  }

  userEmail.value = route.query.email as string | null;
});

const handleSubmit = async () => {
  if (isVerifying.value || !userEmail.value) return; // Prevent multiple clicks
  isVerifying.value = true;

  if (!userEmail.value) {
    console.error("User Email is not available.");
    return;
  }

  try {
   await api.post("verify-token", {
      email: userEmail.value,
      code: code.value
    });

    await router.push({
      path: "/login",
      query: { message: "You have been registered!, Please log in!" }
    });

  } catch (error : any) {
    console.error(error);
    showWarning.value = true;
    warning.value = error.response.data.message;
  }

  isVerifying.value = false;
};

const resendCode = async () => {
  if (isResending.value) return; // Prevent multiple clicks
  isResending.value = true;

  try{
    const response = await api.post("resend-token", {
      email: userEmail.value,
    });
    if(response.status === 201){
      showMessage.value = true;
      message.value = response.data.message;
    }

  }catch(error: unknown){
    showWarning.value = true;
    message.value = error as string;
  }
  isResending.value = false;
}
</script>
