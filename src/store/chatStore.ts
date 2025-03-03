import { defineStore } from 'pinia';
import { ref, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import api from '../api';
import { useUserStore } from './user';

export const welcomeMessage = 'Welcome back! Simplify your expense tracking in seconds—just attach your receipt images below, and let our AI engine convert them into an Excel file.';

export const useChatStore = defineStore('chat', () => {
    const messages = ref<{ type: string; content: string; isHtml?: boolean; timestamp?: string; userInitials?: string }[]>(
        JSON.parse(localStorage.getItem("chatMessages") || "[]")
    );
    const uploadedImage = ref<{ preview: string; file: File } | null>(null);
    const loading = ref(false);
    const userStore = useUserStore();

    const addMessage = (message: { type: string; content: string; isHtml?: boolean; timestamp?: string; userInitials?: string }) => {
        messages.value.unshift(message);
        localStorage.setItem("chatMessages", JSON.stringify(messages.value));
    };

    const setUploadedImage = (image: { preview: string; file: File } | null) => {
        uploadedImage.value = image;
    };

    const fetchMessages = async () => {
        if (!userStore.isAuthenticated) return;

        let storedMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");

        if (userStore.isPrivileged) {
            try {
                const response = await api.get('/content-object', {
                    headers: { Authorization: `Bearer ${userStore.authToken}` },
                });

                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach(contentObject => {
                        const newMessage = {
                            type: contentObject.type === 'content-object/excel' ? 'bot' : 'image',
                            content: contentObject.extensions["content-object-extension/location"],
                            timestamp: format(new Date(contentObject.createdOn), "yyyy-MM-dd HH:mm"),
                            userInitials: userStore.getUserInitials,
                            isHtml: contentObject.type === 'content-object/excel'
                        };

                        if (!storedMessages.some(msg => msg.timestamp === newMessage.timestamp)) {
                            storedMessages.unshift(newMessage);
                        }
                    });
                }
            } catch (error) {
                console.error("Error fetching previous content objects:", error);
            }
        }

        // ✅ Correct check for existing welcome message
        if (!storedMessages.some(msg => msg.content === welcomeMessage)) {
            storedMessages.unshift({
                type: "bot",
                content: welcomeMessage,
                timestamp: new Date().toISOString()
            });
        }

        messages.value = storedMessages;
        localStorage.setItem("chatMessages", JSON.stringify(messages.value));
    };

    const clearMessages = () => {
        messages.value = [];
        localStorage.removeItem("chatMessages");
    };

    onMounted(() => {
        fetchMessages().catch(error => console.error("Error in onMounted fetchMessages:", error));
    });

    watch(() => userStore.isAuthenticated, (isAuthenticated) => {
        if (!isAuthenticated) {
            clearMessages();
        } else {
            fetchMessages().catch(error => console.error("Error in watch fetchMessages:", error));
        }
    });

    return { messages, uploadedImage, loading, addMessage, setUploadedImage, clearMessages };
});
