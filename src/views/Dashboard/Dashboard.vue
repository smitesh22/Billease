<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Flash Message -->
    <div
        v-if="$route.query.message"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-4 rounded-lg flex items-center justify-between w-[90%] md:w-[50%] z-50 shadow-md"
    >
      <span class="text-sm font-medium">{{ $route.query.message }}</span>
      <button @click="closeMessage" class="ml-4 text-sm font-bold underline hover:opacity-80">
        Close
      </button>
    </div>

    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <div class="flex flex-1 justify-center w-full px-4 sm:px-6 lg:px-16 flex-wrap">
      <!-- Ads (Only for non-privileged users) -->
      <div v-if="!privilegedUser" class="lg:w-1/5 flex-shrink-0">
        <ins
            ref="adSlotLeft"
            class="adsbygoogle ad-visible"
            style="display: block; width: 300px; height: 250px;"
            data-ad-client="ca-pub-5606984689103956"
            data-ad-slot="5802327330"
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
      </div>

      <!-- Chat Messages -->
      <div :class="mainClasses">
        <ChatMessages />
      </div>

      <!-- Ads (Only for non-privileged users) -->
      <div v-if="!privilegedUser" class="lg:w-1/5 flex-shrink-0">
        <ins
            ref="adSlotRight"
            class="adsbygoogle ad-visible"
            style="display: block; width: 300px; height: 250px;"
            data-ad-client="ca-pub-5606984689103956"
            data-ad-slot="5802327330"
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="w-full flex justify-center mt-auto py-3 !bg-transparent bottom-bar">
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

import { ref, computed, onMounted, nextTick } from "vue";
import { useUserStore } from "../../store/user";
import { useRouter } from "vue-router";
import Header from "./Header.vue";
import ChatMessages from "./ChatMessages.vue";
import BottomBar from "./BottomBar.vue";

const router = useRouter();
const userStore = useUserStore();
const privilegedUser = ref(false);
const adSlotLeft = ref(null);
const adSlotRight = ref(null);
const adsLoaded = ref(false);

onMounted(() => {
  privilegedUser.value = userStore.isPrivileged;

  if (!privilegedUser.value && !adsLoaded.value) {
    adsLoaded.value = true;

    // Ensure ads load only after the Google script is available
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      [adSlotLeft.value, adSlotRight.value].forEach((ad) => {
        if (ad) {
          window.adsbygoogle.push({});
        }
      });
    } else {
      console.warn("Google Ads script not loaded yet. Retrying...");
      setTimeout(() => {
        [adSlotLeft.value, adSlotRight.value].forEach((ad) => {
          if (ad && window.adsbygoogle) {
            window.adsbygoogle.push({});
          }
        });
      }, 2000);
    }
  }
});

const mainClasses = computed(() => {
  return privilegedUser.value
      ? "container mx-auto px-4 sm:px-8 lg:px-16 py-8 justify-center w-full"
      : "container mx-auto w-full sm:w-[80%] lg:w-[60%] px-4 sm:px-8 lg:px-16 py-8 justify-center";
});

const closeMessage = () => {
  nextTick(() => {
    router.replace({ path: router.currentRoute.value.path, query: {} });
  });
};
</script>

<style>
/* Force Ads to Always Be Visible */
.ad-visible {
  display: block !important;
  width: 300px !important;
  height: 250px !important;
  min-width: 300px;
  min-height: 90px;
  max-height: 250px;
  overflow: hidden;
  background: transparent;
}

@media (max-width: 768px) {
  .adsbygoogle {
    visibility: hidden;
    height: 0;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: transparent !important;
}
</style>
