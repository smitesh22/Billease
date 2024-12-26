import {createRouter, createWebHistory} from "vue-router";
import {useUserStore} from "../store/user.ts";

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
            component: () => import("../views/Login/Login.vue")
        },
        {
            path: "/app",
            name: "App",
            component: () => import("../views/App.vue"),
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
            component: () => import("../views/Login/Verify.vue")
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
        }
    ]
});

export default router;