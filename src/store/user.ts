import { defineStore } from "pinia";
import type User from "../models/user.ts";

export const useUserStore = defineStore("user", {
    state: () => ({
        authToken: localStorage.getItem("authToken") || null, // Initialize from localStorage
        user: JSON.parse(localStorage.getItem("user") || "null") as User || null,
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
        },
        setSubscriptionSetToEnd(subscriptionEndDate: string) {
            this.user.subscriptionSetToEnd = true;
            this.user.subscriptionEndDate = subscriptionEndDate;
            localStorage.setItem("user", JSON.stringify(this.user));
        },
        clearSubscriptionSetToEnd(){
            this.user.subscriptionSetToEnd = false;
            this.user.subscriptionEndDate = null;
            localStorage.setItem("user", JSON.stringify(this.user));
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.authToken,
        getUser: (state) => state.user,
        isPrivileged: (state) => state.user?.privileged || false,
        isSubscriptionSetToEnd: (state) => state.user?.subscriptionSetToEnd,
        getUserInitials(state) {
            const firstName = state.user?.firstName || "U";
            const lastName = state.user?.lastName || "";
            return (firstName.charAt(0) + (lastName.charAt(0) || "")).toUpperCase();
        }
    },
});
