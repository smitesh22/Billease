import { defineStore } from "pinia";
import type User from "../models/user.ts";

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
        setUser(user: User) {
            this.user = user;
            localStorage.setItem("user", JSON.stringify(user));
        },
        clearUser() {
            this.user = null;
            localStorage.removeItem("user");
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.authToken,
        getUser: (state) => state.user,
    },
});
