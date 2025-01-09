// /router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import Dashboard from "@/components/Dashboard.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path:'/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;