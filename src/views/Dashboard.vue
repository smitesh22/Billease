<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <header class=" bg-gray-200 py-4 px-8 flex justify-between items-center">
      <div><img src="/logo.svg" alt="Logo" class="h-10"></div>
      <div class="flex items-center space-x-4">
        <div v-if="!privilegedUser" class="text-gray-500">
          <a href="/pricing">Pricing</a>
        </div>
        <div class="relative">
          <button
              class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-800"
              @click="toggleModal"
          >
            {{ userInitials }}
          </button>
          <div
              v-if="showModal"
              class="fixed inset-0 z-10 bg-black bg-opacity-25 flex items-center justify-center"
              @click.self="closeModal"
          >
            <div class="bg-white rounded shadow-lg p-6">
              <p class="text-lg font-medium mb-4">Are you sure you want to log out?</p>
              <button
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  @click="logout"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-8 py-16 relative">
      <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
      />

      <link
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          rel="stylesheet"
      />

      <!-- Chat Interface -->
      <div
          class="chat-messages flex flex-col-reverse space-y-4 space-y-reverse max-w-3xl mx-auto p-4 rounded-lg bg-gray-50 h-[calc(70vh-80px)] overflow-y-auto"
          style="padding-bottom: 100px;"
      >
        <!-- Render chat messages -->
        <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
            'p-4 rounded-lg max-w-sm animate__animated animate__fadeInUp',
            message.type === 'user' || message.type === 'image'
              ? 'bg-purple-200  self-end text-right'
              : 'self-start text-left',
          ]"
        >
          <!-- If message is an image -->
          <div v-if="message.type === 'image'">
            <img :src="message.content" alt="User uploaded image" class="rounded-lg max-w-full" />
          </div>
          <!-- If message is a downloadable link -->
          <div v-else-if="message.isHtml" v-html="message.content"></div>
          <!-- If message is plain text -->
          <div v-else>{{ message.content }}</div>
        </div>
      </div>

      <!-- Bottom Upload Bar -->
      <div
          class="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-3xl bg-white shadow-lg flex items-center px-4 py-3 rounded-full border border-gray-200 justify-between"
          :class="{ 'opacity-50 pointer-events-none': loading }"
      >
        <!-- Attach Button -->
        <input
            type="file"
            accept="image/*"
            id="file-upload-attach"
            class="hidden"
            @change="handleFileUpload"
            :disabled="loading"
        />
        <label
            for="file-upload-attach"
            class="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300 mr-4"
            :class="{ 'opacity-50 pointer-events-none': loading }"
        >
          <i class="fa-solid fa-paperclip"></i>
        </label>

        <!-- Camera Button -->
        <input
            type="file"
            accept="image/*"
            id="file-upload-camera"
            capture="environment"
            class="hidden"
            @change="handleFileUpload"
            :disabled="loading"
        />
        <label
            for="file-upload-camera"
            class="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300"
            :class="{ 'opacity-50 pointer-events-none': loading }"
        >
          <i class="fa-solid fa-camera-retro"></i>
        </label>

        <!-- Attachment Preview Section (Only One Image) -->
        <div class="flex-grow mx-4 flex items-center justify-center">
          <div
              v-if="uploadedImage"
              class="relative w-16 h-16 bg-gray-200 flex items-center justify-center shadow-md border border-gray-300 rounded-lg"
          >
            <img
                :src="uploadedImage.preview"
                alt="Selected Image"
                class="w-full h-full object-cover rounded-lg"
            />
            <!-- Remove Button -->
            <button
                class="absolute top-1 right-1 bg-gray-300 text-black rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                @click="removeImage"
                :disabled="loading"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Send Button -->
        <button
            class="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300"
            aria-label="Send Message"
            :disabled="!uploadedImage || loading"
            @click="sendMessage"
        >
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";
import api from "../api";

const router = useRouter();
const userStore = useUserStore();
const privilegedUser = ref(false);
const showModal = ref(false);
const uploadedImage = ref<{ preview: string; file: File } | null>(null);
const messages = ref<{ type: string; content: string }[]>([
  { type: "bot", content: "Hello! How can I help you today?" },
]);
const loading = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const closeModal = () => {
  showModal.value = false;
};

const userInitials = computed(() => {
  const { firstName = "User", lastName = "" } = userStore.user;
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
});

onMounted(() => {
  privilegedUser.value = userStore.isPrivileged;
});

const logout = () => {
  userStore.clearAuthToken();
  router.push("/");
};

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const file = files[0]; // Only take the first file
  if (!file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      uploadedImage.value = {
        preview: e.target.result as string,
        file: file,
      };
    }
  };
  reader.readAsDataURL(file);

  (event.target as HTMLInputElement).value = "";
};

const removeImage = () => {
  uploadedImage.value = null;
};

const sendMessage = async () => {
  if (!uploadedImage) return;

  loading.value = true;
  messages.value.unshift({ type: "image", content: uploadedImage.value.preview });

  // Display AI processing message
  const processingMessage = { type: "response", content: "AI is processing your image..." };
  messages.value.unshift(processingMessage);

  const formData = new FormData();
  formData.append("file", uploadedImage.value.file);

  try {
    const fileUploadResponse = await api.post("/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${useUserStore().authToken}`,
      },
    });

    const contentObjectId = fileUploadResponse.data.contentObject.id;

    // Request processed file (Excel)
    const response = await api.get(`/process-image?id=${contentObjectId}`, {
      responseType: "blob",
    });

    messages.value = messages.value.filter(msg => msg.content !== "AI is processing your image...");

    // Convert response into a downloadable file URL
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const fileUrl = window.URL.createObjectURL(blob);

    // Better formatted download message
    messages.value.unshift({
      type: "response",
      content: `
        <div class="flex flex-col items-start space-y-2 p-3 rounded-lg">
          <p>Your image was processed!, you can download it here</p>
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
    console.log(error.status);
    errorMessage = error.status === 429
        ? "You've reached the request limit. Please consider upgrading to the paid version for unlimited access, or wait for the limit to reset. Thank you for your patience!"
        : errorMessage;
    messages.value = messages.value.filter(msg => msg.content !== "AI is processing your image...");
    messages.value.unshift({ type: "response", content: errorMessage });
  } finally {
    uploadedImage.value = null;
    loading.value = false;
  }
};

</script>
