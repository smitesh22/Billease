<template>
  <div class="w-full flex justify-center bg-gray-50">
    <div
        class="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-3xl
             bg-purple-50 flex flex-col px-6 py-3 rounded-3xl border border-gray-300 shadow-md">

    <div class="w-full flex flex-col items-start">

      <!-- Image Preview Positioned Correctly Above Attach Button at Start -->
      <div v-if="chatStore.uploadedImage" class="relative w-16 h-16 bg-gray-200 flex items-center justify-center shadow-md border border-gray-300 rounded-lg mb-2">
        <img :src="chatStore.uploadedImage.preview" alt="Selected Image" class="w-full h-full object-cover rounded-lg" />
        <button class="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-300 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-400 text-xs" @click="removeImage" :disabled="chatStore.loading">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="w-full flex items-center justify-between">
        <!-- Attach & Camera Buttons -->
        <div class="flex items-center space-x-3 ml-0">
          <!-- Attach Button -->
          <input type="file" accept="image/*" id="file-upload-attach" class="hidden" @change="handleFileUpload" :disabled="chatStore.loading" />
          <label for="file-upload-attach" class="flex items-center space-x-2 px-5 py-3 text-white bg-purple-500 hover:bg-purple-600 rounded-2xl shadow transition duration-200 cursor-pointer">
            <i class="fa-solid fa-paperclip text-lg"></i>
            <span class="font-medium text-lg">Attach</span>
          </label>

          <!-- Camera Button -->
          <input type="file" accept="image/*" id="file-upload-camera" capture="environment" class="hidden" @change="handleFileUpload" :disabled="chatStore.loading" />
          <label for="file-upload-camera" class="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-2xl w-14 h-14 cursor-pointer transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300">
            <i class="fa-solid fa-camera text-lg"></i>
          </label>
        </div>

        <!-- Fixed Position Generate Button -->
        <button class="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-2xl text-white font-semibold text-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                aria-label="Send Message"
                :disabled="!chatStore.uploadedImage || chatStore.loading"
                @click="sendMessage">
          Generate!
        </button>
      </div>
    </div>
  </div>
  </div>
</template>


<script setup lang="ts">
import {useChatStore, welcomeMessage} from '../../store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import api from '../../api';
import { useUserStore } from "../../store/user";
const chatStore = useChatStore();
const userStore = useUserStore();
import { format } from 'date-fns';

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  const file = files[0];
  if (!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      chatStore.setUploadedImage({ preview: e.target.result as string, file: file });
    }
  };
  reader.readAsDataURL(file);
  (event.target as HTMLInputElement).value = '';
};

const removeImage = () => {
  chatStore.setUploadedImage(null);
};

const sendMessage = async () => {
  chatStore.messages = chatStore.messages.filter(msg => msg.content !== welcomeMessage);
  chatStore.loading = true;
  chatStore.addMessage({
    type: "image",
    content: chatStore.uploadedImage?.preview ?? "",
    isHtml: true,
    timestamp: format(new Date(), "yyyy-MM-dd HH:mm"),
    userInitials: userStore.getUserInitials,
  });

  chatStore.addMessage({
    type: "response",
    content: `
      <div class="flex items-center space-x-2">
        <div class="animate-spin h-5 w-5 border-4 border-gray-300 border-t-purple-500 rounded-full"></div>
        <span>LedgeFast is processing your image...</span>
      </div>
    `,
    isHtml: true
  });

  const formData = new FormData();
  if (chatStore.uploadedImage) {
    formData.append("file", chatStore.uploadedImage.file);
  }

  try {
    const fileUploadResponse = await api.post("/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${useUserStore().authToken}`
      },
    });
    console.log(fileUploadResponse);
    const contentObjectId = fileUploadResponse.data.contentObject.id;
    const response = await api.get(`/process-image?id=${contentObjectId}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${useUserStore().authToken}` }
    });

    chatStore.messages = chatStore.messages.filter(msg => !msg.content.includes("LedgeFast is processing your image..."));

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const fileUrl = window.URL.createObjectURL(blob);
    const excelFormData = new FormData();
    excelFormData.append("file", blob, `${uuidv4()}.xlsx`);

    await api.post("/file?type=content-object/excel", excelFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${useUserStore().authToken}`
      },
    });

    chatStore.addMessage({
      type: "bot",
      content: `
        <div class="flex flex-col items-start space-y-2 p-3 rounded-lg">
          <p>📂 Your processed Excel file is ready for download:</p>
          <a href="${fileUrl}" download="${contentObjectId}.xlsx"
             class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2">
            <span>Download Excel File</span>
          </a>
        </div>
      `,
      isHtml: true,
      timestamp : format(new Date(), "yyyy-MM-dd HH:mm")
    });

  } catch (error) {
    let errorMessage = "❌ Upload failed. Please try again.";
    const err = error as any;
    errorMessage = err.status === 429
        ? "You've reached the request limit. Please consider upgrading to the paid version for unlimited access, or wait for the limit to reset. Thank you for your patience!"
        : errorMessage;
    chatStore.messages = chatStore.messages.filter(msg => !msg.content.includes("LedgeFast is processing your image..."));
    chatStore.addMessage({ type: "bot", content: errorMessage });
  } finally {
    chatStore.uploadedImage = null;
    chatStore.loading = false;
  }
};
</script>