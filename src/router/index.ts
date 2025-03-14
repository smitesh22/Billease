import {createRouter, createWebHistory} from "vue-router";
import {useUserStore} from "../store/user";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import("../views/HomePage.vue")
        },
        {
            path: "/signup",
            name: "SignUp",
            component: () => import("../views/Login/SignUp.vue")
        },
        {
            path: "/login",
            name: "LogIn",
            component: () => import("../views/Login/LogIn.vue")
        },
        {
            path: "/dashboard",
            name: "Dashboard",
            component: () => import("../views/Dashboard/Dashboard.vue"),
            beforeEnter: (_to, _from, next) => {
                const userStore = useUserStore()
                if(userStore.isAuthenticated){
                    next()
                }else{
                    next('/login')
                }
            }
        },
        {
            path: "/verify",
            name: "verify",
            component: () => import("../views/Login/Verify.vue"),
            beforeEnter: (_to, from, next) => {
                if (from.name === "SignUp") {
                    next();
                } else {
                    next("/");
                }
            }
        },
        {
            path: "/pricing",
            name: "pricing",
            component: () => import("../views/Pricing.vue")
        },
        {
            path: "/hello-world",
            name: "Hello World",
            component: () => import("../components/HelloWorld.vue"),
        },
        {
            path: "/forgot-password",
            name: "Forgot Password",
            component: () => import("../views/Login/ForgotPassword.vue")
        },
        {
            path: "/reset-password",
            name: "Reset Password",
            component: () => import("../views/Login/ResetPassword.vue"),
            beforeEnter: (_to, from, next) => {
                if (from.name === "Forgot Password") {
                    next(); // Allow navigation if coming from Forgot Password
                } else {
                    next("/"); // Redirect to home if not coming from Forgot Password
                }
            }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.path === "/") {
            return { top: 0 };
        }
        if (savedPosition) {
            return savedPosition;
        }
        return {};
    }
});

export default router;