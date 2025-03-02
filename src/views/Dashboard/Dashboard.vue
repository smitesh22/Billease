<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Flash Message -->
    <div v-if="$route.query.message"
         class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between w-[90%] md:w-[50%] z-50">
      <span class="text-sm font-medium">{{ $route.query.message }}</span>
      <button @click="closeMessage" class="ml-4 text-sm font-bold underline hover:opacity-80">Close</button>
    </div>

    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <div class="flex flex-1 justify-center w-full px-6 lg:px-16">
      <!-- Ads (Only for non-privileged users) -->
      <div v-if="!privilegedUser" class="hidden lg:flex flex-shrink-0 w-1/5">
        <ins class="adsbygoogle"
             style="display:block; width: 100%; height: auto;"
             data-ad-client="ca-pub-5606984689103956"
             data-ad-slot="5802327330"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      <!-- Chat Messages -->
      <div :class="mainClasses">
        <ChatMessages />
      </div>

      <!-- Ads (Only for non-privileged users) -->
      <div v-if="!privilegedUser" class="hidden lg:flex flex-shrink-0 w-1/5">
        <ins class="adsbygoogle"
             style="display:block; width: 100%; height: auto;"
             data-ad-client="ca-pub-5606984689103956"
             data-ad-slot="5802327330"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bg-gray-50 w-full flex justify-center mt-auto">
      <BottomBar />
    </div>
  </div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    adsbygoogle: any;
  }
}
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

  if (!privilegedUser.value) {
    setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Google Ads failed to load:", e);
      }
    }, 1000);
  }
});

const mainClasses = computed(() => {
  return privilegedUser.value
      ? "container mx-auto px-16 py-16 justify-center w-full"
      : "container mx-auto w-[60%] px-16 py-16 justify-center";
});

const closeMessage = () => {
  router.replace({ path: router.currentRoute.value.path, query: {} });
};
</script>

<style>
.placeholder {
  min-height: 0 !important;
  overflow: hidden;
}

.placeholder ins.adsbygoogle {
  display: block !important;
  width: 100% !important;
  min-height: 0 !important;
}
</style>
