<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <header class="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
      <div class="text-lg font-bold">Logo</div>
      <div class="flex items-center space-x-4">
        <div v-if="!privilegedUser" class="text-gray-500"><a href="/pricing" >Pricing</a></div>
        <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-800" @click="logout">Log Out</button>

      </div>
    </header>

  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "../store/user.ts";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const privilegedUser = ref(false);
onMounted(() => {
  privilegedUser.value = userStore.isPrivileged
})

const logout = () => {
  userStore.clearAuthToken();
  router.push('/')
}
</script>