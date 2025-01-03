
<script setup>
    import { ref, onMounted } from 'vue';
    import { fetchCoinDataById } from '../../services/marketsService.js';

    // Define props
    const props = defineProps({
        id : {
            type: String,
            required: true
        }
    });

    // State variables
    const coin = ref(null);         // Holds coin details
    const loading = ref(true);      // Indicates loading state
    const error = ref(null);        // Holds error messages

    // Fetch coin details
    const fetchCoinDetails = async () => {
        try {
            // console.log(`Fetching details for coin ID: ${props.id}`);
            const response = await fetchCoinDataById(props.id);
            console.log('API response:', response.data);
            coin.value = response.data.data[0]; 
            loading.value = false;
        } catch (error) {
            console.error('Error fetching coin details:', err);
            error.value = 'Failed to load coin details. Please try again.';
            loading.value = false;
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    }

    // Fetch data when the component is mounted
    onMounted(() => {
        fetchCoinDetails();
    });

</script>

<template>
    <div>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <h1>Coin Details</h1>
        <div>
            <img :src="coin.image" :alt="coin.name" style="width: 30px;" />
            {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
        </div>
        <p>Last updated: {{ formatDate(coin.last_updated) }}</p>
        <p>Current Price: ${{ coin.current_price.toLocaleString() }}</p>
        <p>24h Low: ${{ coin.low_24h }}</p>
        <p>24h High: ${{ coin.high_24h }}</p>
        <p>Market Cap: ${{ coin.market_cap.toLocaleString() }}</p>
        <p>24h Change: {{ coin.price_change_percentage_24h.toFixed(2) }}%</p>
        <p>All Time High: ${{ coin.ath.toLocaleString() }}</p>
        <p>All Time Low: ${{ coin.atl.toLocaleString() }}</p>
        
      </div>
    </div>
</template>

