// /router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import Dashboard from "@/components/Dashboard.vue";
import Dashboard2 from "@/components/Dashboard2.vue";

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
    {
        path:'/dashboard2',
        name: 'Dashboard2',
        component: Dashboard2
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;