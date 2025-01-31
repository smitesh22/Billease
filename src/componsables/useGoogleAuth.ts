import { useRouter } from "vue-router";
import api from "../api/index.ts";
import {useUserStore} from "../store/user";

export function useGoogleAuth() {
    const router = useRouter();
    const userStore = useUserStore();
    const signInWithGoogle = () => {
        const googleAuthUrl = `${api.defaults.baseURL}/auth/google`;

        const popup = window.open(
            googleAuthUrl,
            "googleSignIn",
            "width=500,height=600"
        );

        if (!popup) {
            console.error("Popup blocked by the browser. Please allow popups.");
            return;
        }

        window.addEventListener("message", (event) => {
            if (!event.origin.includes(api.defaults.baseURL)) {
                return; // Ignore messages from unknown origins
            }

            const { token, user } = event.data || {};

            if (token) {
                localStorage.setItem("authToken", token);
                userStore.setAuthToken(token);
                // Set user data in the store
                userStore.setUser({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isVerified: user.verified,
                    privileged: user.privileged,
                });
                router.push("/dashboard");

            } else {
                console.error("Google authentication failed: No token received.");
            }
        });

        // Polling fallback
        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
            }
        }, 1000);
    };

    return { signInWithGoogle };
}
