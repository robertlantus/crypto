// /router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";

const routes = [
    {
        path: '/',
        neme: 'Home',
        component: HomePage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;