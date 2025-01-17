

<script setup>

import { defineProps, defineEmits } from 'vue';

// Define props
defineProps({
    marketData: {
            type: Array,
            required: true
        },
    error: {
        type: String,
        default: null
    }
});

// Emit events
const emit = defineEmits(['open-modal']);

// Methods
const openCoinModal = (id) => {
    // Emit the event to parent
    emit('open-modal', id);
};

</script>

<template>
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
                  :src="coin.image" 
                  :alt="`${coin.name} image`"
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
</template>

