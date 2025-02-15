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
        messages.value = [];
        if (userStore.isAuthenticated) {
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
                                    content: `<div class='flex flex-col items-start space-y-2 p-3 mt-0 rounded-lg'>
                                    <p>Your processed Excel file is ready for download 📂:</p>
                                    <a
                                      href="${contentObject.extensions["content-object-extension/location"]}"
                                      download
                                      target="_blank"
                                      class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        fill="none"
                                        class="w-5 h-5 mr-2 -ml-1"
                                      >
                                        <path
                                          d="M12 4v12m8-8l-8 8-8-8"
                                          stroke-width="2"
                                          stroke-linejoin="round"
                                          stroke-linecap="round"
                                        ></path>
                                      </svg>
                                      Download your file
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
                                    userInitials: userStore.getUserInitials
                                });
                            }
                        });
                    }
                    messages.value.unshift({ type: 'bot', content: welcomeMessage, timestamp: format(new Date(), "yyyy-MM-dd HH:mm") });
                } catch (error) {
                    console.error("Error fetching previous content objects:", error);
                }
            }else{
                messages.value.unshift({ type: 'bot', content: welcomeMessage, timestamp: format(new Date(), "yyyy-MM-dd HH:mm") });
            }
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
