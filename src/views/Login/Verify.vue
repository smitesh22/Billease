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

      <button
          class="w-full bg-purple-600 text-white py-2 rounded-lg disabled:bg-gray-300 font-medium hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
          @click="handleSubmit"
      >
        Verify Email
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api";

const code = ref("");
const userId = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

onMounted(() => {
  userId.value = route.query.id as string | null;
});

const handleSubmit = async () => {
  if (!userId.value) {
    console.error("User ID is not available.");
    return;
  }

  try {
    await api.post("verify-user", {
      id: userId.value,
      code: code.value
    });

    await router.push({
      path: "/login",
      query: { message: "You have been registered!, Please log in!" }
    });

  } catch (error) {
    console.error(error);
  }
};
</script>
