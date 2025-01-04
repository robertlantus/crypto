

<script setup>

import { ref, onMounted } from 'vue';
import { fetchMarketData } from '../../services/marketsService.js';
import CoinDetails from './CoinDetails.vue';

// State variables
const marketData = ref([]);
const error = ref(null);

// Modal state
const showModal = ref(false);
const selectedCoinId = ref(null);

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

// Open modal
const openModal = (id) => {
    selectedCoinId.value = id;
    showModal.value = true;
}

// Close modal
const closeModal = () => {
    showModal.value = false;
    selectedCoinId.value = null;
}

onMounted(() => {
    loadMarketData();
});

</script>

<template>

    <header class="">
      <div class="box is-flex is-justify-content-space-between p-6">
        <div class="logo">
            <router-link to="/">gecko</router-link>
        </div>
        <div class="login-section is-flex is-justify-content-space-between">
            <div class="login mx-3">
                <a href="/login.html" class="button is-primary is-light is-responsive has-text-success is-outlined">
                    <i class="fa-solid fa-user"></i><span class="pl-2">Login</span>
                </a>
            </div>
            <div class="signup mx-3">
                <a href="/signup.html" class="button is-primary is-light is-responsive has-text-success">
                    <i class="fa-solid fa-user-plus"></i><span class="pl-2">Sign up</span>
                </a>
            </div>
        </div>
      </div>
      <div class="content is-flex is-justify-content-center py-6">
        <h1>Welcome to the gecko app</h1>
      </div>
    </header>

    <main class="">
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
                    <!-- <router-link :to="{ name: 'CoinDetails', params: { id: coin.id } }"> -->
                        <div class="img">
                            <img 
                                v-bind:src="coin.image" 
                                :alt="`{{ coin.name }} image`"
                                @click="openModal(coin.id)"   
                            />
                        </div>
                    <!-- </router-link> -->
                </td>
                <td>
                    <!-- <router-link :to="{ name: 'CoinDetails', params: { id: coin.id } }" class="coin-name"> -->
                    <span @click="openModal(coin.id)" class="coin-name">
                        {{ coin.name }} {{ coin.symbol.toUpperCase() }}
                    </span>
                    <!-- </router-link> -->
                    
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

    <div v-if="showModal" class="modal is-active">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Coin Details</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <CoinDetails :id="selectedCoinId" />
        </section>
        <footer class="modal-card-foot">
          <button @click="closeModal" class="button is-danger">Close</button>
        </footer>
      </div>
    </div>

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


