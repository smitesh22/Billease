import { useRouter } from "vue-router";
import api from "../api/index.ts";

export function useGoogleAuth() {
    const router = useRouter();

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

            const { token } = event.data || {}; // Ensure event.data is not undefined

            if (token) {
                localStorage.setItem("authToken", token);
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
