<template>
  <div class="chat-messages flex flex-col-reverse space-y-4 space-y-reverse max-w-3xl mx-auto p-4 rounded-lg bg-gray-50 h-[calc(70vh-80px)] overflow-y-auto">
    <div v-for="(message, index) in chatStore.messages" :key="index" :class="[ 'p-4 rounded-lg max-w-sm animate__animated animate__fadeInUp', message.type === 'user' || message.type === 'image' ? 'bg-purple-200  self-end text-right' : 'self-start text-left', ]">
      <div v-if="message.type === 'image'">
        <img :src="message.content" alt="User uploaded image" class="rounded-lg max-w-full" />
      </div>
      <div v-else-if="message.isHtml" v-html="message.content"></div>
      <div v-else>{{ message.content }}</div>
      <div class="text-xs text-gray-500 mt-1" :class="message.type === 'bot' ? 'text-left' : 'text-right'" v-if="message.timestamp">
        {{ message.timestamp }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '../../store/chatStore';

const chatStore = useChatStore();
</script>
