import { defineStore } from "pinia";
import type User from "../models/user.ts";
import {computed} from "vue";

export const useUserStore = defineStore("user", {
    state: () => ({
        authToken: localStorage.getItem("authToken") || null, // Initialize from localStorage
        user: JSON.parse(localStorage.getItem("user") || "null"),
    }),
    actions: {
        setAuthToken(token: string) {
            this.authToken = token;
            localStorage.setItem("authToken", token);
        },
        clearAuthToken() {
            this.authToken = null;
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            this.clearUser();
        },
        setIsSubscribed(subscribed: boolean) {
            this.user.privileged = subscribed;
            localStorage.setItem("user", JSON.stringify(this.user));
        },
        setUser(user: User) {
            this.user = user;
            localStorage.setItem("user", JSON.stringify(user));
        },
        clearUser() {
            this.user = null;
            localStorage.removeItem("user");
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.authToken,
        getUser: (state) => state.user,
        isPrivileged: (state) => state.user?.privileged || false,
        getUserInitials(state) {
            const firstName = state.user?.firstName || "U";
            const lastName = state.user?.lastName || "";
            return (firstName.charAt(0) + (lastName.charAt(0) || "")).toUpperCase();
        }
    },
});
