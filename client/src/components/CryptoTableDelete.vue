

<script setup>

import { defineProps, defineEmits } from 'vue';

// Define props
defineProps({
    coins: {
            type: Array,
            required: true
        },
    error: {
        type: String,
        default: null
    }
});

// Emit events
const emit = defineEmits(['open-modal', 'remove-coin']);

// Methods
const openCoinModal = (id) => {
    // Emit the event to parent
    emit('open-modal', id);
};

const removeCoin = (id) => {
  emit('remove-coin', id);
};

</script>

<template>
    <div class="table-container">
      <p v-if="error">{{ error }}</p>
      <table v-if="coins.length" class="table is-striped is-narrow is-fullwidth is-hoverable">
          <thead>
            <tr>
                <th>#</th>
                <th></th>
                <th>Coin</th>
                <th>Price (USD)</th>
                <th>24h</th>
                <th>24h Volume</th>
                <th>Market Cap</th>
                <th></th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="coin in coins" :key="coin.id">
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
              <td>
                  <button 
                      class="button is-small is-danger is-light" 
                      @click="removeCoin(coin.id)"
                  >
                      <span class="icon">
                          <i class="fa-solid fa-trash custom-icon"></i>
                      </span>
                  </button>
              </td>
          </tr>
          </tbody>
      </table>
      <p v-else class="is-size-5 ml-4">Add coins to this watchlist</p>
    </div>
</template>

