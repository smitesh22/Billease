import { useRouter } from "vue-router";
import api from "../api/index";
import { useUserStore } from "../store/user";

export function useGoogleAuth() {
    const router = useRouter();
    const userStore = useUserStore();

    const signInWithGoogle = () => {
        const googleAuthUrl = `${api.defaults.baseURL as string}/auth/google`;

        const popup = window.open(
            googleAuthUrl,
            "googleSignIn",
            "width=500,height=600"
        );

        if (!popup) {
            console.error("Popup blocked by the browser. Please allow popups.");
            return;
        }

        const handleAuthMessage = (event: MessageEvent) => {
            if (!event.origin.includes(api.defaults.baseURL as string)) return;

            const { token, user } = event.data || {};
            console.log(user);
            if (token) {
                localStorage.setItem("authToken", token);
                userStore.setAuthToken(token);
                userStore.setUser({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isVerified: user.verified,
                    isPrivileged: user.privileged,
                    isSubscriptionSetToEnd: !!user?.extensions?.userTypes.subscriptionEndDate,
                    subscriptionEndDate : user?.extensions?.userTypes.subscriptionEndDate || null
                });

                // Ensure we clean up event listener after receiving the message
                window.removeEventListener("message", handleAuthMessage);
                router.push("/dashboard");
                window.focus();
            } else {
                console.error("Google authentication failed: No token received.");
            }
        };

        // Add event listener for authentication message
        window.addEventListener("message", handleAuthMessage);

        // Periodically check if popup is closed, then remove event listener
        const checkPopup = setInterval(() => {
            if (!popup) {
                clearInterval(checkPopup);
                window.removeEventListener("message", handleAuthMessage);
            }
        }, 1000);
    };

    return { signInWithGoogle };
}
