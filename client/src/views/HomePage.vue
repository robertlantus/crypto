

<script setup>
  import { ref, onMounted } from 'vue';
  import { fetchMarketData } from '../../services/marketsService.js';

  const marketData = ref([]);
  const error = ref(null);

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

  onMounted(() => {
    loadMarketData();
  });

</script>

<template>
  <div id="app">

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
                    <router-link :to="{ name: 'CoinDetails', params: { id: coin.id } }">
                        <div class="mt-1">
                            <img v-bind:src="coin.image" :alt="`{{ coin.name }} image`">
                        </div>
                    </router-link>
                </td>
                <td>
                    <router-link :to="{ name: 'CoinDetails', params: { id: coin.id } }">
                    {{ coin.name }} 
                    </router-link>
                    ({{ coin.symbol.toUpperCase() }})
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
  </div>
</template>

<style scoped>
img {
  width: 20px;
  height: 20px;
}
</style>


