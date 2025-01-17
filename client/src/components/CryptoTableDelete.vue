

<script setup>

import { defineProps, defineEmits } from 'vue';

// Define props
defineProps({
    coins: {
            type: Array,
            required: true,
            default: () => []
        },
    error: {
        type: String,
        default: null
    }
});

// Emit events
// const emit = defineEmits(['open-modal', 'remove-coin']);

const emit = defineEmits([
  /**
   * Emitted when a coin modal is opened.
   * @param {string} id - The ID of the selected coin.
   */
  'open-modal',
  /**
   * Emitted when a coin is removed.
   * @param {string} id - The ID of the coin to be removed.
   */
  'remove-coin',
]);

// Methods
const openCoinModal = (id) => {
    if (!id) {
      console.error('Invalid coin ID provided');
      return;
    }
    // Emit the event to parent
    emit('open-modal', id);
};

const removeCoin = (id) => {
  if (!id) {
    console.error('Invalid coin ID provided');
    return;
  }
  emit('remove-coin', id);
};

</script>

<template>
    <div class="table-container">
      <p v-if="error">{{ error }}</p>
      <table v-if="coins.length" class="table is-striped is-narrow is-fullwidth is-hoverable">
          <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col"></th>
                <th scope="col">Coin</th>
                <th scope="col">Price (USD)</th>
                <th scope="col">24h</th>
                <th scope="col">24h Volume</th>
                <th scope="col">Market Cap</th>
                <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="coin in coins" :key="coin.id">
              <td>{{ coin.market_cap_rank }}</td>
              <td>
                  <div class="img">
                      <img 
                          v-bind:src="coin.image" 
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

