<template>
    <div>
      <h1>Coin Details</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <h2>{{ coin.name }} ({{ coin.symbol.toUpperCase() }})</h2>
        <img :src="coin.image" :alt="coin.name" style="width: 100px;" />
        <p>Current Price: {{ formatCurrency(coin.current_price) }}</p>
        <p>Market Cap: {{ formatCurrency(coin.market_cap) }}</p>
        <p>24h High: {{ formatCurrency(coin.high_24h) }}</p>
        <p>24h Low: {{ formatCurrency(coin.low_24h) }}</p>
        <p>ATH: {{ formatCurrency(coin.ath) }}</p>
        <p>Last Updated: {{ formatDate(coin.last_updated) }}</p>
      </div>
    </div>
  </template>
  
  <script>

  import { fetchCoinDataById } from '../../services/marketsService';
  
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        coin: null,
        error: null,
        loading: true,
      };
    },
    methods: {
      async fetchCoinDetails() {
        try {
          this.loading = true;
          const response = await fetchCoinDataById(this.id);
          console.log('API Response:', response.data); 
          if (response.data && response.data.data.length > 0) {
            this.coin = response.data.data[0]; 
          } else {
            this.error = 'Coin data not found';
          }
        } catch (err) {
          console.error('Error fetching coin details:', err);
          this.error = 'Failed to fetch coin details';
        } finally {
          this.loading = false;
        }
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      },
      formatDate(date) {
        return new Date(date).toLocaleString();
      },
    },
    mounted() {
      this.fetchCoinDetails();
    },
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  
  img {
    display: block;
    margin: 10px auto;
  }
  </style>
  