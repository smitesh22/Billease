<template>
  <header class="bg-gray-200 py-4 px-8 flex justify-between items-center">
    <div><img src="/logo.svg" alt="Logo" class="h-10"></div>
    <div class="flex items-center space-x-4">
      <div v-if="!privilegedUser" class="text-gray-500">
        <a href="/pricing">Pricing</a>
      </div>
      <div class="relative">
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-800" @click="toggleModal">
          {{ userInitials }}
        </button>
        <div v-if="showModal" class="fixed inset-0 z-10 bg-black bg-opacity-25 flex items-center justify-center" @click.self="closeModal">
          <div class="bg-white rounded shadow-lg p-6">
            <p class="text-lg font-medium mb-4">Are you sure you want to log out?</p>
            <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" @click="logout">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../store/user';
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const privilegedUser = ref(userStore.isPrivileged);
const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const closeModal = () => {
  showModal.value = false;
};

const userInitials = computed(() => {
  const { firstName = "User", lastName = "" } = userStore.user;
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
});

const logout = () => {
  userStore.clearAuthToken();
  router.push("/");
};
</script>