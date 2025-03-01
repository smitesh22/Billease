<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-lg p-6 w-[450px] max-h-[90vh]">
      <!-- Modal Header -->
      <div class="flex justify-center items-center mt-5 mb-5">
        <p class="text-2xl justify-center font-extrabold">Account Settings</p>
      </div>

      <hr class="border-gray-900 mb-5" />

      <!-- Delete Account -->
      <div class="flex justify-between items-center py-2">
        <p class="text-lg font-medium">Delete your account</p>
        <button class="bg-purple-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl" @click="showDeleteConfirm = true">
          Delete Account
        </button>
      </div>

      <!-- Unsubscribe -->
      <div v-if="isPrivileged && !isSubscriptionToEnd" class="flex justify-between items-center mt-5 py-2">
        <p class="text-lg font-medium">End your membership</p>
        <button class="bg-purple-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl" @click="showUnsubscribeConfirm = true">
          Unsubscribe
        </button>
      </div>

      <!-- Log Out -->
      <div class="flex justify-between items-center mt-5 py-2">
        <p class="text-lg font-medium">Log out from your account</p>
        <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl flex" @click="logout">
          <img src="/logout.svg" alt="logo" class="w-5 h-5 mr-4 mt-0.5"/>
          Log Out
        </button>
      </div>

      <div class="flex justify-center items-center mt-5 py-2">
        <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl flex" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-[400px]">
      <p class="text-xl font-bold text-center">Are you sure?</p>
      <p class="text-center mt-2">Deleting your account is irreversible. Do you really want to proceed?</p>
      <div class="flex justify-center space-x-4 mt-5">
        <button
            class="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center justify-center"
            @click="confirmDelete"
            :disabled="isDeleting"
        >
          <svg v-if="isDeleting" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-if="!isDeleting">Yes, Delete</span>
          <span v-else>Processing...</span>
        </button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded-xl" @click="showDeleteConfirm = false">No, Cancel</button>
      </div>
    </div>
  </div>

  <!-- Unsubscribe Confirmation Modal -->
  <div v-if="showUnsubscribeConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-[400px]">
      <p class="text-xl font-bold text-center">Are you sure?</p>
      <p class="text-center mt-2">You can subscribe back anytime. Do you really want to proceed?</p>
      <div class="flex justify-center space-x-4 mt-5">
        <button
            class="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center justify-center"
            @click="confirmUnsubscribe"
            :disabled="isUnsubscribing"
        >
          <svg v-if="isUnsubscribing" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-if="!isUnsubscribing">Yes, Unsubscribe</span>
          <span v-else>Processing...</span>
        </button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded-xl" @click="showUnsubscribeConfirm = false">No, Cancel</button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { useUserStore } from '../../store/user';
import { useRouter } from "vue-router";
import { useChatStore } from "../../store/chatStore";
import api from "../../api";
import { format } from "date-fns";
import { useRoute } from "vue-router";

const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();
const emit = defineEmits(["close"]);

const showDeleteConfirm = ref(false);
const showUnsubscribeConfirm = ref(false);
const isDeleting = ref(false);
const isUnsubscribing = ref(false);
const route = useRoute();

const isSubscriptionToEnd = computed(() => userStore.isSubscriptionSetToEnd);
const isPrivileged = computed(() => userStore.isPrivileged);

const logout = () => {
  userStore.clearAuthToken();
  chatStore.clearMessages();
  router.push("/");
  emit("close");
};

onMounted(() => {
  if (userStore.isAuthenticated && !route.query.message) {
    router.push("/dashboard");
  }
});


const confirmDelete = async () => {
  isDeleting.value = true;
  const userId = userStore.getUser?.id;
  try {
    const res = await api.delete(`/user?id=${userId}`, {
      headers: { Authorization: `Bearer ${useUserStore().authToken}` },
    });
    if (res.status === 204) {
      userStore.clearAuthToken();
      showDeleteConfirm.value = false;
      await router.push({
        path: "/",
        query: { message: `You have successfully deleted your account and data!` }
      });
    } else {
      console.error(res);
    }
  } catch (error) {
    console.error("Error deleting account:", error);
  } finally {
    isDeleting.value = false;
  }
};

const confirmUnsubscribe = async () => {
  isUnsubscribing.value = true;
  const userId = userStore.getUser?.id;

  try {
    const res = await api.delete(`/cancel-subscription?userId=${userId}`, {
      headers: { Authorization: `Bearer ${useUserStore().authToken}` }
    });
    userStore.setSubscriptionSetToEnd(res.data.date);
    showUnsubscribeConfirm.value = false;

    await router.push({
      path: "/dashboard",
      query: { message: `You have unsubscribed from the current plan. You have pro functionalities till ${format(new Date(res.data.date), 'd MMM yyyy')}` }
    });
  } catch (error) {
    console.error("Error unsubscribing:", error);
  } finally {
    isUnsubscribing.value = false;
  }
};
</script>
