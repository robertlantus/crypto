// /router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import CoinDetails2 from "@/components/CoinDetails2.vue";
import CoinDetails from "@/views/CoinDetails.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    // {
    //     path: '/coin-details/:id',   // Options API
    //     name: 'CoinDetails2',
    //     component: CoinDetails2,
    //     props: true, // This allows the `id` to be passed as a prop to the CoinDetails2 component
    // },
    // {
    //     path: '/coin-details/:id',      // Dynamic route for coin details
    //     name: 'CoinDetails',
    //     component: CoinDetails,
    //     props: true             // Pass route params as props to the component
    //                             // This allows the `id` to be passed as a prop to the CoinDetails2 component
    // }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;