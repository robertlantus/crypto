
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
            // console.log('API response:', response.data);
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
        <div class="is-flex is-flex-direction-row is-align-items-center">
            <img :src="coin.image" :alt="coin.name" style="width: 40px; height: 40px;" />
            <div class="ml-6 is-size-4">
                {{ coin.name }} ( {{ coin.symbol.toUpperCase() }} )
            </div>
        </div>
        <div class="mt-4">
            <p><span class="has-text-weight-medium mr-1">Last updated:</span> {{ formatDate(coin.last_updated) }}</p>
            <p><span class="has-text-weight-medium mr-1">Current Price:</span> ${{ coin.current_price.toLocaleString() }}</p>
            <p><span class="has-text-weight-medium mr-1">24h Low:</span> ${{ coin.low_24h }}</p>
            <p><span class="has-text-weight-medium mr-1">24h High:</span> ${{ coin.high_24h }}</p>
            <p><span class="has-text-weight-medium mr-1">24h Change:</span> {{ coin.price_change_percentage_24h.toFixed(2) }}%</p>
            <p><span class="has-text-weight-medium mr-1">Total Volume:</span> ${{ coin.total_volume.toLocaleString() }}</p>
            <p><span class="has-text-weight-medium mr-1">Market Cap</span>: ${{ coin.market_cap.toLocaleString() }}</p>
            <p><span class="has-text-weight-medium mr-1">Market Cap Change 24h:</span> ${{ Number(coin.market_cap_change_24h.toFixed()).toLocaleString() }}</p>
            <p><span class="has-text-weight-medium mr-1">Market Cap Percentage Change 24h:</span> {{ coin.market_cap_change_percentage_24h.toLocaleString() }}%</p>
            <p><span class="has-text-weight-medium mr-1">Circulating supply:</span> {{ Number(coin.circulating_supply.toFixed()).toLocaleString() }}</p>
            <p><span class="has-text-weight-medium mr-1">Total supply:</span> {{ Number(coin.total_supply.toFixed()).toLocaleString() }}</p>
            <p><span class="has-text-weight-medium mr-1">All Time High:</span> ${{ coin.ath.toLocaleString() }}</p>
            <p><span class="has-text-weight-medium mr-1">Ath change:</span> {{ coin.ath_change_percentage.toFixed(2) }}%</p>
            <p><span class="has-text-weight-medium mr-1">Ath date:</span> {{ formatDate(coin.ath_date) }}</p>
            <p><span class="has-text-weight-medium mr-1">All Time Low:</span> ${{ coin.atl.toLocaleString() }}</p>
        </div>
      </div>
    </div>
</template>

