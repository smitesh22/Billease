// store/chatStore.ts
import { defineStore } from 'pinia';
import { ref, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import api from '../api';
import { useUserStore } from './user';

export const welcomeMessage = 'Welcome back! Simplify your expense tracking in seconds—just attach your receipt images below, and let our AI engine convert them into an Excel file.';

export const useChatStore = defineStore('chat', () => {
    const messages = ref<{ type: string; content: string; isHtml?: boolean; timestamp?: string, userInitials?: string }[]>([]);
    const uploadedImage = ref<{ preview: string; file: File } | null>(null);
    const loading = ref(false);
    const userStore = useUserStore();

    const addMessage = (message: { type: string; content: string; isHtml?: boolean; timestamp?: string; userInitials?: string }) => {
        messages.value.unshift(message);
    };

    const setUploadedImage = (image: { preview: string; file: File } | null) => {
        uploadedImage.value = image;
    };

    const fetchMessages = async () => {
        if (userStore.isAuthenticated) {
            const fetchedMessages = [];
            if (userStore.isPrivileged) {
                try {
                    const response = await api.get('/content-object', {
                        headers: { Authorization: `Bearer ${userStore.authToken}` },
                    });
                    if (response.data && Array.isArray(response.data)) {
                        response.data.forEach(contentObject => {
                            if (contentObject.type === 'content-object/excel') {
                                fetchedMessages.unshift({
                                    type: 'bot',
                                    content: `<div class='flex flex-col items-start space-y-2 p-3 mt-0 rounded-lg'>
                                    <p>Your processed Excel file is ready for download 📂:</p>
                                    <a href="${contentObject.extensions["content-object-extension/location"]}" download target="_blank"
                                       class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-purple-500 hover:bg-purple-600 transition">
                                      Download your file
                                    </a>                                                
                                  </div>`,
                                    timestamp: format(new Date(contentObject.createdOn), "yyyy-MM-dd HH:mm"),
                                    isHtml: true
                                });
                            } else if (contentObject.type === 'content-object/image') {
                                fetchedMessages.unshift({
                                    type: 'image',
                                    content: contentObject.extensions["content-object-extension/location"],
                                    timestamp: format(new Date(contentObject.createdOn), "yyyy-MM-dd HH:mm"),
                                    userInitials: userStore.getUserInitials
                                });
                            }
                        });
                    }
                    fetchedMessages.unshift({ type: 'bot', content: welcomeMessage, timestamp: format(new Date(), "yyyy-MM-dd HH:mm") });
                } catch (error) {
                    console.error("Error fetching previous content objects:", error);
                }
            } else {
                fetchedMessages.unshift({ type: 'bot', content: welcomeMessage, timestamp: format(new Date(), "yyyy-MM-dd HH:mm") });
            }

            // Instead of replacing, merge the messages
            messages.value = [...messages.value, ...fetchedMessages];
        }
    };

    onMounted(() => {
        fetchMessages().catch(error => console.error("Error in onMounted fetchMessages:", error));
    });

    watch(() => userStore.isAuthenticated, (isAuthenticated) => {
        if (!isAuthenticated) {
            clearMessages();
        }
        fetchMessages().catch(error => console.error("Error in watch fetchMessages:", error));
    });
    const clearMessages = () => {
        messages.value = [];
    };

    return { messages, uploadedImage, loading, addMessage, setUploadedImage, clearMessages };
});
