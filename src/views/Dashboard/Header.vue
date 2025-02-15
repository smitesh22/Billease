<template>
  <header class="bg-gray-200 py-4 px-8 flex justify-between items-center">
    <div class="flex items-center space-x-2">
      <img src="/logo.svg" alt="Logo" class="h-10">
      <img v-if="userStore.isPrivileged" src="/pro.svg" alt="Pro" class="h-6 mb-5">
    </div>
    <div class="flex items-center space-x-4">
      <div v-if="privilegedUser" class="text-gray-500">
        <a href="/pricing">Pricing</a>
      </div>
      <div class="relative">
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-800" @click="toggleModal">
          {{ userStore.getUserInitials }}
        </button>
        <div v-if="showModal" class="fixed inset-0 z-10 bg-black bg-opacity-25 flex items-center justify-center" @click.self="closeModal">
          <Settings @close="closeModal"/>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../store/user';
import { useRouter } from "vue-router";
import { useChatStore } from "../../store/chatStore";
import Settings from "./Settings.vue";

const userStore = useUserStore();
const privilegedUser = computed(() => userStore.isSubscriptionSetToEnd || !userStore.isPrivileged);
const showModal = ref(false);

const toggleModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>
