import {createRouter, createWebHistory} from "vue-router";

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
            path: "/hello-world",
            name: "Hello World",
            component: () => import("../components/HelloWorld.vue"),
        }
    ]
});

export default router;