// store/chatStore.ts
import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import api from '../api';
import { useUserStore } from './user';

export const useChatStore = defineStore('chat', () => {
    const messages = ref<{ type: string; content: string; isHtml?: boolean; timestamp?: string }[]>([]);
    const uploadedImage = ref<{ preview: string; file: File } | null>(null);
    const loading = ref(false);
    const userStore = useUserStore();

    const addMessage = (message: { type: string; content: string; isHtml?: boolean; timestamp?: string }) => {
        messages.value.unshift(message);
    };

    const setUploadedImage = (image: { preview: string; file: File } | null) => {
        uploadedImage.value = image;
    };

    onMounted(async () => {
        if (userStore.isPrivileged) {
            try {
                const response = await api.get('/content-object', {
                    headers: { Authorization: `Bearer ${userStore.authToken}` },
                });
                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach(contentObject => {
                        if (contentObject.type === 'content-object/excel') {
                            messages.value.unshift({
                                type: 'bot',
                                content: `<div class='flex flex-col items-start space-y-2 p-3 rounded-lg'>
                            <p>📂 Your processed Excel file is ready for download:</p>
                            <a href="${contentObject.extensions["content-object-extension/location"]}" download
                               class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2">
                              <span>Download Excel File</span>
                            </a>
                          </div>`,
                                timestamp: format(new Date(contentObject.createdOn), "yyyy-MM-dd HH:mm"),
                                isHtml: true
                            });
                        } else if (contentObject.type === 'content-object/image') {
                            messages.value.unshift({
                                type: 'image',
                                content: contentObject.extensions["content-object-extension/location"],
                                timestamp: format(new Date(contentObject.createdOn), "yyyy-MM-dd HH:mm"),
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("Error fetching previous content objects:", error);
            }
        }
        messages.value.unshift({ type: 'bot', content: "Hello! How can I help you today?", timestamp: format(new Date(), "yyyy-MM-dd HH:mm") });
    });

    return { messages, uploadedImage, loading, addMessage, setUploadedImage };
});