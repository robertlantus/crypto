

<script setup>

import { ref, onMounted } from 'vue';
import { fetchMarketData } from '../../services/marketsService.js';
import AuthModal from '../components/AuthModal.vue';
// import CoinModal from '../components/CoinModal.vue';
import CryptoTable from '@/components/CryptoTable.vue';

// State variables
const marketData = ref([]);
const error = ref(null);

// Coin Details Modal state
// const showCoinModal = ref(false);
// const selectedCoinId = ref(null);

// Login / Signup Modal state
const showAuthModal = ref(false);
const authMode = ref('login');  // 'login' or 'signup'

// Handle Signup success
const handleSignupSuccess = () => {
    // console.log('Signup successful. Switching to login mode.');
    authMode.value = 'login'; // Switch to login mode
    showAuthModal.value = true; // Open the modal in login mode
};

// Handle Login success
const handleLoginSuccess = () => {
    showAuthModal.value = false;        // Close the modal
    // console.log('Login successful. Modal closed.');
}

// Load market data
const loadMarketData = async () => {
    try {
        const response = await fetchMarketData();
        // console.log(response);
        // console.log(response.data);
        // console.log(response.data.data);
        marketData.value = response.data.data;

    } catch (err) {
        error.value = err.message || 'Failed to fetch market data';
    }
};

// Open Coin Details modal
// const openCoinModal = (id) => {
//     selectedCoinId.value = id;
//     showCoinModal.value = true;
// };

// Close Coin Details modal
// const closeCoinModal = () => {
//     showCoinModal.value = false;
//     selectedCoinId.value = null;
// };

// Open Login modal
const openLoginModal = () => {
    authMode.value = 'login';      
    showAuthModal.value = true;
};

// Open Signup modal
const openSignupModal = () => {
    authMode.value = 'signup';      
    showAuthModal.value = true;
};

onMounted(() => {
    loadMarketData();
});

</script>

<template>

    <header>

      <div class="box is-flex is-justify-content-space-between p-6">

        <div class="logo">
            <router-link to="/">gecko</router-link>
        </div>

        <div class="login-section is-flex is-justify-content-space-between">
            <div class="login mx-3">
                <button 
                    @click="openLoginModal"
                    class="button is-primary is-light is-responsive has-text-success is-outlined"
                >
                    <i class="fa-solid fa-user"></i><span class="pl-2">Login</span>
                </button>
            </div>
            <div class="signup mx-3">
                <button 
                    @click="openSignupModal"
                    class="button is-primary is-light is-responsive has-text-success"
                >
                    <i class="fa-solid fa-user-plus"></i><span class="pl-2">Sign Up</span>
                </button>
            </div>
        </div>

      </div>

      <div class="content is-flex is-justify-content-center py-6">
        <h1>Welcome to the gecko app</h1>
      </div>

    </header>

    <main>
      <div class="container is-fluid">

        <!-- <CryptoTable
            :marketData="marketData"
            :error="error"
            @open-modal="openCoinModal"
        /> -->

        <CryptoTable
            :marketData="marketData"
            :error="error"
        />

      </div>
    </main>

    <!-- Coin Details Modal -->
    <!-- <CoinModal
        v-if="showCoinModal"
        :show="showCoinModal"
        :coinId="selectedCoinId"
        @close="closeCoinModal"
    /> -->

    <!-- Import the AuthModal -->
    <AuthModal
        v-model:showAuthModal="showAuthModal"
        :authMode="authMode"
        @signupSuccess="handleSignupSuccess"
        @loginSuccess="handleLoginSuccess"
    />

</template>

<style scoped>

</style>


