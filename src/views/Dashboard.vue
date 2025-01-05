<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <header class="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
      <div class="text-lg font-bold">Logo</div>
      <div class="flex items-center space-x-4">
        <div v-if="!privilegedUser" class="text-gray-500">
          <a href="/pricing">Pricing</a>
        </div>
        <div class="relative">
          <button
              class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-gray-800"
              @click="toggleModal"
          >
            {{ userInitials }}
          </button>
          <div
              v-if="showModal"
              class="fixed inset-0 z-10 bg-black bg-opacity-25 flex items-center justify-center"
              @click.self="closeModal"
          >
            <div class="bg-white rounded shadow-lg p-6">
              <p class="text-lg font-medium mb-4">Are you sure you want to log out?</p>
              <button
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  @click="logout"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../store/user.ts";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const privilegedUser = ref(false);
const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const closeModal = () => {
  showModal.value = false;
};

const userInitials = computed(() => {
  let firstName, lastName;
  if(userStore.user.firstName && userStore.user.lastName) {
    firstName = userStore.user.firstName;
    lastName = userStore.user.lastName;
  }else{
    firstName = "User";
    lastName = "";
  }
  console.log(userStore.user);
  console.log(firstName, lastName);
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
});

onMounted(() => {
  privilegedUser.value = userStore.isPrivileged;
});

const logout = () => {
  userStore.clearAuthToken();
  router.push("/");
};
</script>

<style scoped>
/* Optional styling */
</style>
