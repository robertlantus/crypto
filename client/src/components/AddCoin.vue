
<template>
    <div class="content new">
      <label for="searchCoin" class="ml-1 is-size-5">Add a Coin:</label>
      <input
        id="searchCoin"
        type="text"
        v-model="searchQuery"
        placeholder="Type to search for a coin..."
        @input="filterCoins"
        class="input is-primary my-2"
      />

      <!-- Coin List -->
      <ul v-if="filteredCoins.length" class="coin-list">
        <li
          v-for="coin in filteredCoins"
          :key="coin.id"
          @click="addCoin(coin)"
          class="coin-item"
        >
            <div class="is-flex is-justify-content-start">
                <div class="coin-image mr-3">
                    <img
                        v-bind:src="coin.image" 
                    />
                </div>
                <span class="coin-name">{{ coin.name }} ({{ coin.symbol.toUpperCase() }})</span>
            </div>
        </li>
      </ul>
      <p v-else-if="searchQuery.trim()" class="ml-1">No coins found.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "AddCoin",
    props: {
      coins: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        searchQuery: "", // Tracks the user's input
        filteredCoins: [], // Stores filtered coins
      };
    },
    methods: {

        filterCoins() {
            if (this.searchQuery.trim() === '') {
                this.filteredCoins = []; // Show nothing if input is empty
            } else {
                const query = this.searchQuery.toLowerCase();
                this.filteredCoins = this.coins.filter((coin) =>
                coin.name.toLowerCase().startsWith(query) || coin.symbol.toLowerCase().startsWith(query)
                );
            }
        },

      addCoin(coin) {
        // Emits the selected coin to the parent component
        this.$emit("add-coin", coin);
        this.searchQuery = ""; // Clear input after selection
        this.filteredCoins = []; // Clear filtered list
      },
    },
  };
  </script>
  
  <style scoped>

    .new {
        width: 440px;
        height: 190px;
    }

    .coin-list {
        position: absolute;
        z-index: 99;
        width: 400px;
        background-color: #fff;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        list-style-type: none;
        margin: 0;
        padding: 1rem;
    }

    .coin-item {
        padding-block: .5rem;
    }

    .coin-image {
        margin-top: 2px;
    }

  </style>
  