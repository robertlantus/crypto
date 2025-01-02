// /router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import CoinDetails2 from "@/components/CoinDetails2.vue";
import CoinDetails from "@/views/CoinDetails.vue";
import CoinDetails3 from "@/components/CoinDetails3.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/coin-details/:id',
        name: 'CoinDetails3',
        component: CoinDetails3,
        props: true, // This allows the `id` to be passed as a prop to the CoinDetails2 component
    },
    {
        path: '/coins/:id',      // Dynamic route for coin details
        name: 'CoinDetails',
        component: CoinDetails,
        props: true             // Pass route params as props to the component
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;