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

  <!-- Confirmation Modal for Delete Account -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-[400px]">
      <p class="text-xl font-bold text-center">Are you sure?</p>
      <p class="text-center mt-2">Deleting your account is irreversible, You can lose your subscription. Do you really want to proceed?</p>
      <div class="flex justify-center space-x-4 mt-5">
        <button class="bg-red-600 text-white px-4 py-2 rounded-xl" @click="confirmDelete">Yes, Delete</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded-xl" @click="showDeleteConfirm = false">No, Cancel</button>
      </div>
    </div>
  </div>
  <!--- Confirmation Modal for unsubscribe -->
  <div v-if="showUnsubscribeConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-[400px]">
      <p class="text-xl font-bold text-center">Are you sure?</p>
      <p class="text-center mt-2">You can subscribe back anytime you want! Do you really want to proceed?</p>
      <div class="flex justify-center space-x-4 mt-5">
        <button class="bg-red-600 text-white px-4 py-2 rounded-xl" @click="confirmUnsubscribe">Yes, Unsubscribe</button>
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
import {formatDate} from "date-fns/format";

const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();
const emit = defineEmits(["close"]);
const showDeleteConfirm = ref(false);
const showUnsubscribeConfirm = ref(false);
const isSubscriptionToEnd = computed(() => userStore.isSubscriptionSetToEnd);
const isPrivileged = computed(() => userStore.isPrivileged);

const logout = () => {
  userStore.clearAuthToken();
  chatStore.clearMessages();
  router.push("/");
  emit("close"); // Close modal after logout
};

const confirmDelete = async () => {
  showDeleteConfirm.value = true;
  const userId = userStore.getUser.id;
  try {
    const res = await api.delete(`/user?id=${userId}`, {
      headers: { Authorization: `Bearer ${useUserStore().authToken}` },
    });
    if (res.status === 204) {
      await router.push('/login');
      userStore.clearAuthToken();
      showDeleteConfirm.value = false;
    } else {
      console.error(res);
    }
  } catch (error) {
    console.error("Error deleting account:", error);
  }
};

const confirmUnsubscribe = async () => {
  showUnsubscribeConfirm.value = true;
  const userId = userStore.getUser.id;

  try {
    const res = await api.delete(`/cancel-subscription?userId=${userId}`, {
      headers: {Authorization: `Bearer ${useUserStore().authToken}`}
    });
    userStore.setSubscriptionSetToEnd(res.data.date);
    showUnsubscribeConfirm.value = false;

    await router.push({
      path: "/dashboard",
      query: { message: `You have unsubscribed from current plan, you have pro user functionalities till ${formatDate(res.data.date, 'd MMM yyyy')}` }
    });
  } catch (error) {
    console.error("Error deleting account:", error);
  }
};
</script>
