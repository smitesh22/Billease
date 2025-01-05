<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <header class="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
      <div class="text-lg font-bold">Logo</div>
      <div class="flex items-center space-x-4">
        <div v-if="!privilegedUser" class="text-gray-500">
          <a href="/pricing">Pricing</a>
        </div>
        <div class="relative">
          <button
              class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-gray-800"
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

    <main class="container  mx-auto px-8 py-16 relative">
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
              ? 'bg-purple-200 self-end text-right'
              : 'bg-purple-200 self-start text-left',
          ]"
        >
          <!-- If message is an image -->
          <div v-if="message.type === 'image'">
            <img :src="message.content" alt="User uploaded image" class="rounded-lg max-w-full" />
          </div>
          <!-- If message is text -->
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
            id="file-upload"
            class="hidden"
            multiple
            @change="handleFileUpload"
            :disabled="loading"
        />
        <label
            for="file-upload"
            class="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110 focus:ring-2 focus:ring-purple-300"
            :class="{ 'opacity-50 pointer-events-none': loading }"
        >
          <i class="fa-solid fa-paperclip"></i>
        </label>

        <!-- Attachment Preview Section -->
        <div class="flex-grow mx-4 flex items-center space-x-4 overflow-x-auto">
          <div
              v-for="(file, index) in uploadedImages"
              :key="index"
              class="relative w-16 h-16 bg-gray-200 flex items-center justify-center shadow-md border border-gray-300 rounded-lg"
          >
            <img
                :src="file.preview"
                :alt="'Image ' + index"
                class="w-full h-full object-cover rounded-lg"
            />
            <!-- Remove Button -->
            <button
                class="absolute top-1 right-1 bg-gray-300 text-black rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                @click="removeImage(index)"
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
            :disabled="uploadedImages.length === 0 || loading"
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

const router = useRouter();
const userStore = useUserStore();
const privilegedUser = ref(false);
const showModal = ref(false);
const uploadedImages = ref<{ preview: string; file: File }[]>([]);
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

  if (!files) return;
  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          uploadedImages.value.push({
            preview: e.target.result as string,
            file: file,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  });

  (event.target as HTMLInputElement).value = "";
};

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1);
};

const sendMessage = async () => {
  loading.value = true;

  uploadedImages.value.forEach((image) => {
    messages.value.unshift({ type: "image", content: image.preview });
  });

  const formData = new FormData();
  uploadedImages.value.forEach((image) => {
    formData.append("images", image.file);
  });

  try {
    const response = await fetch("/api/process-images", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    messages.value.unshift({ type: "response", content: data.message });
  } catch (error) {
    messages.value.unshift({
      type: "response",
      content: `Error: Failed to process the images. ${error.message}`,
    });
    console.error("Error:", error);
  } finally {
    uploadedImages.value = [];
    loading.value = false;
  }
};
</script>
