<template>
  <div class="chat-messages flex flex-col-reverse space-y-4 space-y-reverse mx-auto p-4 rounded-lg bg-gray-50 h-[calc(70vh-80px)] overflow-y-auto">
    <div v-for="(message, index) in chatStore.messages" :key="index"
         class="flex items-start space-x-2 p-6 rounded-lg max-w-sm animate__animated animate__fadeInUp"
         :class="message.type === 'user' || message.type === 'image' ? 'self-end text-right flex-row-reverse' : 'self-start text-left'">

      <!-- Chatbot Logo (for bot messages) -->
      <img v-if="message.type === 'bot'"
           src="/logo.svg" alt="Flatboat Logo"
           class="w-8 h-8 rounded-full shadow-md" />

      <!-- Message Content -->
      <div class="relative">
        <div v-if="message.type === 'image'" class="flex flex-col items-end">
          <img
              :src="message.content"
              alt="User uploaded image"
              class="rounded-lg max-w-full cursor-pointer transition-transform transform hover:scale-105"
              @click="openImageModal(message.content)"
          />

          <!-- Timestamp & User Initials for Image Messages -->
          <div v-if="message.timestamp" class="mt-1 text-xs flex items-center justify-end text-gray-500">
            <span>{{ message.timestamp }}</span>
            <div class="flex items-center justify-center w-6 h-6 min-w-[24px] min-h-[24px] rounded-full bg-purple-500 text-white font-bold text-xs shrink-0 ml-2">
              {{ message.userInitials }}
            </div>
          </div>
        </div>
        <div v-else-if="message.isHtml" v-html="message.content"></div>
        <div v-else>{{ message.content }}</div>

        <!-- Timestamp & User Initials for Text Messages -->
        <div v-if="message.timestamp && message.type !== 'image'" class="mt-1 text-xs flex items-center"
             :class="message.type === 'bot' ? 'text-left justify-start text-gray-500' : 'text-right justify-end text-gray-500'">

          <!-- Bot Message: Timestamp Only (Left) -->
          <span v-if="message.type === 'bot'">{{ message.timestamp }}</span>

          <!-- User Message: Timestamp + Initials (Right) -->
          <div v-else class="flex items-center space-x-1">
            <span>{{ message.timestamp }}</span>
            <div class="flex items-center justify-center w-6 h-6 min-w-[24px] min-h-[24px] rounded-full bg-purple-500 text-white font-bold text-xs shrink-0">
              {{ message.userInitials }}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Image Modal -->
  <div v-if="modalImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeImageModal">
    <img :src="modalImage" class="max-w-full max-h-full " @click.stop />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '../../store/chatStore';
import {computed, onMounted, ref} from 'vue';
import { useUserStore } from "../../store/user";

const chatStore = useChatStore();
const userStore = useUserStore();
const modalImage = ref<string | null>(null);

const openImageModal = (imageUrl: string) => {
  modalImage.value = imageUrl;
};

const closeImageModal = () => {
  modalImage.value = null;
};

onMounted(() => {
})
</script>

<style>
</style>
