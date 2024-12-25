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

      <p v-if="showWarning" class="text-red-500 text-sm mt-1" aria-live="polite">
        {{ warning }}</p>

      <p v-if="showMessage" class="text-green-500 text-sm mt-1" aria-live="polite">
        {{ message }}</p>

      <div class="mb-4">
      <button
          class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
          @click="handleSubmit"
      >
        Verify Email
      </button>
      </div>
      <button
          class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
          @click="resendCode"
      >
        Resend Code
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api";

const code = ref("");
const userEmail = ref<string | null>(null);

const showWarning = ref(false);
const showMessage = ref(false);
const message = ref("");
const warning = ref("");

const route = useRoute();
const router = useRouter();

onMounted(() => {
  if(localStorage.authToken){
    router.push('/app')
  }

  userEmail.value = route.query.email as string | null;
});

const handleSubmit = async () => {
  if (!userEmail.value) {
    console.error("User Email is not available.");
    return;
  }

  try {
    const response = await api.post("verify-user", {
      email: userEmail.value,
      code: code.value
    });

    await router.push({
      path: "/login",
      query: { message: "You have been registered!, Please log in!" }
    });

  } catch (error) {
    console.error(error);
    showWarning.value = true;
    warning.value = error.response.data.message;
  }
};

const resendCode = async () => {
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
    showWarning.value = error;
  }
}
</script>
