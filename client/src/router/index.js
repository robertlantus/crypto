// /router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import Dashboard from "@/components/Dashboard.vue";
import Dashboard2 from "@/components/Dashboard2.vue";
import Coins from "@/components/Coins.vue";

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
    {
        path:'/:id',
        name: 'Coins',
        component: Coins
    },
    {
        path: '/watchlists/:id',
        name: 'Watchlist',
        component: Coins,
        props: true, // Ensure route params are passed as props
    },
    

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;