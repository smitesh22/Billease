<script setup lang="ts">
import { useUserStore } from "./store/user";
import { onMounted, onUnmounted } from "vue";
import api from "./api";

const userStore = useUserStore();
let intervalId: number;

onMounted(() => {
  intervalId = window.setInterval(() => {
    const subscriptionEndDate = userStore.user?.subscriptionEndDate;
    if (subscriptionEndDate) {
      checkSubscriptionStatus(subscriptionEndDate);
    }
  }, 60000 * 5);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const checkSubscriptionStatus = async (subscriptionEndDate: string) => {
  const currentDate = new Date();
  const endDate = new Date(subscriptionEndDate);

  if (endDate < currentDate) {
    try {
      await api.put("/user", {
        privileged: false,
      });
      userStore.setIsSubscribed(false); // Update Pinia store
      console.log("User set to unpaid");
    } catch (error) {
      console.error("Failed to set user to unpaid:", error);
    }
  }
};
</script>

<template>
  <router-view />
</template>

<style scoped></style>
