

<script setup>

import { ref, onMounted } from 'vue';
import { fetchMarketData } from '../../services/marketsService.js';
import AuthModal from '../components/AuthModal.vue';
import CoinModal from '../components/CoinModal.vue';

// State variables
const marketData = ref([]);
const error = ref(null);

// Coin Details Modal state
const showCoinModal = ref(false);
const selectedCoinId = ref(null);

// Login / Signup Modal state
const showAuthModal = ref(false);
const authMode = ref('login');  // 'login' or 'signup'

// Handle Signup success
const handleSignupSuccess = () => {
    console.log('Signup successful. Switching to login mode.');
    authMode.value = 'login'; // Switch to login mode
    showAuthModal.value = true; // Open the modal in login mode
};

// Handle Login success
const handleLoginSuccess = () => {
    showAuthModal.value = false;        // Close the modal
    console.log('Login successful. Modal closed.');
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
const openCoinModal = (id) => {
    selectedCoinId.value = id;
    showCoinModal.value = true;
};

// Close Coin Details modal
const closeCoinModal = () => {
    showCoinModal.value = false;
    selectedCoinId.value = null;
};

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
        <div class="table-container">
          <p v-if="error">{{ error }}</p>
          <table v-if="marketData.length" class="table is-striped is-narrow is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>#</th>
                <th></th>
                <th>Coin</th>
                <th>Price (USD)</th>
                <th>24h</th>
                <th>24h Volume</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="coin in marketData" :key="coin.id">
                <td>{{ coin.market_cap_rank }}</td>
                <td>
                    <div class="img">
                        <img 
                            v-bind:src="coin.image" 
                            :alt="`{{ coin.name }} image`"
                            @click="openCoinModal(coin.id)"   
                        />
                    </div>

                </td>
                <td>
                    <span @click="openCoinModal(coin.id)" class="coin-name">
                        {{ coin.name }} {{ coin.symbol.toUpperCase() }}
                    </span>
                </td>
                <td>${{ coin.current_price.toFixed(2) }}</td>
                <td>{{ coin.price_change_percentage_24h.toFixed(2) }}%</td>
                <td>$ {{ coin.total_volume.toLocaleString() }}</td>
                <td>$ {{ coin.market_cap.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>No market data available</p>
        </div>
      </div>
    </main>

    <!-- Coin Details Modal -->
    <CoinModal
        v-if="showCoinModal"
        :show="showCoinModal"
        :coinId="selectedCoinId"
        @close="closeCoinModal"
    />

    <!-- Import the AuthModal -->
    <AuthModal
        v-model:showAuthModal="showAuthModal"
        :authMode="authMode"
        @signupSuccess="handleSignupSuccess"
        @loginSuccess="handleLoginSuccess"
    />

</template>

<style scoped>

.logo a {
    font-family: monospace;
    font-size: 32px;
    color: green;
}

.logo a:hover {
    color: darkgreen;
}

.coin-name {
    color: #222;
}

.coin-name:hover {
    color: #000;
    cursor: pointer;
}

img {
    display: block;
    cursor: pointer;
    width: 20px;
    height: 20px;
}

.img {
    padding-top: 2px;
}

</style>


