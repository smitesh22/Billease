<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <header class="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
      <div class="text-lg font-bold" @click="goToHomePage">Logo</div>
      <div class="flex items-center space-x-4">
        <div class="text-gray-500">More Options</div>
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-800" @click="logout">Log Out</button>

      </div>
    </header>

  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "../store/user.ts";
import {onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  console.log(userStore.getUser);
})


const logout = () => {
  userStore.clearAuthToken();
  router.push('/')
}
</script>