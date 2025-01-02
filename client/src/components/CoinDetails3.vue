  
  <template>
    <div>
      <h1>Coin Details for {{ id }}</h1>
      <div v-if="loading">Loading coin details...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <h2>{{ coin.name }} ({{ coin.symbol.toUpperCase() }})</h2>
        <p>Current Price: ${{ coin.current_price.toLocaleString() }}</p>
        <p>Market Cap: ${{ coin.market_cap.toLocaleString() }}</p>
        <p>24h Change: {{ coin.price_change_percentage_24h.toFixed(2) }}%</p>
        <p>ATH: ${{ coin.ath.toLocaleString() }}</p>
        <p>ATL: ${{ coin.atl.toLocaleString() }}</p>
        <!-- Add more fields as needed -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Define props
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
  });
  
  // State variables
  const coin = ref(null); // Holds coin details
  const loading = ref(true); // Indicates loading state
  const error = ref(null); // Holds error messages
  
  // Fetch coin details
  const fetchCoinDetails = async () => {
    try {
      console.log(`Fetching details for coin ID: ${props.id}`);
      const response = await axios.get(`/api/coins/markets/${props.id}`);
      console.log('API response:', response.data);
      coin.value = response.data.data[0]; // Assuming the API returns data in this structure
      loading.value = false;
    } catch (err) {
      console.error('Error fetching coin details:', err);
      error.value = 'Failed to load coin details. Please try again.';
      loading.value = false;
    }
  };
  
  // Fetch data when the component is mounted
  onMounted(() => {
    fetchCoinDetails();
  });
  </script>
  
  <style scoped>
  </style>
  