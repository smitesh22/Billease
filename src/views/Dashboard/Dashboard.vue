<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <Header/>

    <main class="container mx-auto px-8 py-16 relative">
      <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
      />

      <link
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          rel="stylesheet"
      />

      <ChatMessages />
      <BottomBar />
    </main>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../store/user";
import { useRouter } from "vue-router";
import Header from "./Header.vue";
import ChatMessages from "./ChatMessages.vue";
import BottomBar from "./BottomBar.vue";

const router = useRouter();
const userStore = useUserStore();
const privilegedUser = ref(false);

onMounted(async () => {
  privilegedUser.value = userStore.isPrivileged;
  });
</script>

<style>
</style>
