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

        let storedMessages: { type: string; content: string; timestamp: string }[] = JSON.parse(
            localStorage.getItem("chatMessages") || "[]"
        );

        if (userStore.isPrivileged) {
            try {
                const response = await api.get('/content-object', {
                    headers: { Authorization: `Bearer ${userStore.authToken}` },
                });

                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach(contentObject => {
                        const newMessage = {
                            type: contentObject.type === 'content-object/excel' ? 'bot' : 'image',
                            content: contentObject.type === 'content-object/image' ?
                                contentObject.extensions["content-object-extension/location"] :
                                `
                                    <div class="flex flex-col items-start space-y-2 p-3 rounded-lg">
                                      <p>📂 Your processed Excel file is ready for download:</p>
                                      <a href="${contentObject.extensions["content-object-extension/location"]}" download="${contentObject.id}.xlsx"
                                         class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2">
                                        <span>Download Excel File</span>
                                      </a>
                                    </div>
                                `,
                            timestamp: format(new Date(contentObject.createdOn), "yyyy-MM-dd HH:mm"),
                            userInitials: userStore.getUserInitials,
                            isHtml: contentObject.type === 'content-object/excel'
                        };
                        if (!storedMessages.some((msg: { content: string }) => msg.content === newMessage.content)) {
                            storedMessages.unshift(newMessage);
                        }
                    });
                }
            } catch (error) {
                console.error("Error fetching previous content objects:", error);
            }
        }

        // ✅ Corrected type inference for `msg`
        if (!storedMessages.some((msg: { content: string }) => msg.content === welcomeMessage)) {
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

    watch(() => userStore.isAuthenticated, (isAuthenticated) => {
        if (!isAuthenticated) {
            clearMessages();
        } else {
            fetchMessages().catch(error => console.error("Error in watch fetchMessages:", error));
        }
    });

    return { messages, uploadedImage, loading, addMessage, setUploadedImage, clearMessages };
});
