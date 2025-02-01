<template>
  <div class="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-3xl bg-white shadow-lg flex flex-col items-center px-4 py-3 rounded-xl border border-gray-200" :class="{ 'opacity-50 pointer-events-none': chatStore.loading }">
    <div class="w-full flex justify-start mb-3 px-9">
      <div v-if="chatStore.uploadedImage" class="relative w-16 h-16 bg-gray-200 flex items-center justify-center shadow-md border border-gray-300 rounded-lg">
        <img :src="chatStore.uploadedImage.preview" alt="Selected Image" class="w-full h-full object-cover rounded-lg" />
        <button class="absolute top-1 right-1 bg-gray-300 text-black rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600" @click="removeImage" :disabled="chatStore.loading">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    <div class="flex items-center justify-between w-full px-4">
      <div class="flex items-center space-x-4">
        <input type="file" accept="image/*" id="file-upload-attach" class="hidden" @change="handleFileUpload" :disabled="chatStore.loading" />
        <label for="file-upload-attach" class="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300">
          <i class="fa-solid fa-paperclip"></i>
        </label>
        <input type="file" accept="image/*" id="file-upload-camera" capture="environment" class="hidden" @change="handleFileUpload" :disabled="chatStore.loading" />
        <label for="file-upload-camera" class="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300">
          <i class="fa-solid fa-camera-retro"></i>
        </label>
      </div>
      <button class="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300" aria-label="Send Message" :disabled="!chatStore.uploadedImage || chatStore.loading" @click="sendMessage">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '../../store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import api from '../../api';
import { useUserStore } from "../../store/user";
const chatStore = useChatStore();

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
  chatStore.messages = chatStore.messages.filter(msg => msg.content !== "Hello! How can I help you today?");
  chatStore.loading = true;
  chatStore.addMessage({ type: "image", content: chatStore.uploadedImage.preview });

  chatStore.addMessage({ type: "response", content: "AI is processing your image..." });

  const formData = new FormData();
  formData.append("file", chatStore.uploadedImage.file);

  try {
    const fileUploadResponse = await api.post("/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${useUserStore().authToken}`
      },
    });

    const contentObjectId = fileUploadResponse.data.contentObject.id;
    const response = await api.get(`/process-image?id=${contentObjectId}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${useUserStore().authToken}` }
    });

    chatStore.messages = chatStore.messages.filter(msg => msg.content !== "AI is processing your image...");

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
      type: "response",
      content: `
        <div class="flex flex-col items-start space-y-2 p-3 rounded-lg">
          <p>📂 Your processed Excel file is ready for download:</p>
          <a href="${fileUrl}" download="${contentObjectId}.xlsx"
             class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2">
            <span>Download Excel File</span>
          </a>
        </div>
      `,
      isHtml: true
    });

  } catch (error) {
    let errorMessage = "❌ Upload failed. Please try again.";
    console.error(error);
    errorMessage = error.status === 429
        ? "You've reached the request limit. Please consider upgrading to the paid version for unlimited access, or wait for the limit to reset. Thank you for your patience!"
        : errorMessage;
    chatStore.messages = chatStore.messages.filter(msg => msg.content !== "AI is processing your image...");
    chatStore.addMessage({ type: "response", content: errorMessage });
  } finally {
    chatStore.uploadedImage = null;
    chatStore.loading = false;
  }
};
</script>
