
<template>
    <div>
        <div class="box is-flex is-justify-content-space-between p-6">
            <div class="logo">
                <router-link to="/">gecko</router-link>
            </div>
            <button class="button is-danger" @click="handleLogout">Logout</button>
        </div>

        <div class="block is-flex is-justify-content-space-between">
            <div class="block mx-6">
                <h1 class="is-size-4 mb-6">You are logged in as: {{ username }} </h1>
                <h2 class="is-size-5 my-3"><span class="has-text-weight-medium">{{ watchlistName }}</span></h2>
            </div>
            <div class="block mx-6 mt-4">
                <form @submit.prevent="addCoin">
                    <input 
                        v-model="newCoin" 
                        placeholder="Enter coin ID (ex: bitcoin)" 
                        class="input mb-2"
                    />
                    <button type="submit" class="button is-primary">Add Coins</button>
                </form>
            </div>
        </div>

        <div class="container is-fluid">
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
                </tr>
                </tbody>
            </table>
            <p v-else class="is-size-5 ml-4">Add coins to this watchlist</p>
            </div>
        </div>

    </div>

        <!-- Coin Details Modal -->
        <CoinModal
            v-if="showCoinModal"
            :show="showCoinModal"
            :coinId="selectedCoinId"
            @close="closeCoinModal"
        />

</template>


<script>
import axios from 'axios';
import CoinModal from '../components/CoinModal.vue';

export default {

    components: {
        CoinModal
    },

    data() {
        return {
            username: '',
            watchlistName: '',
            coins: [],
            newCoin: '',
            error: '',
            showCoinModal: false,       // Controls whether the modal is displayed
            selectedCoinId: null        // Stores the ID of the selected coin
        };
    },

    methods: {

        async fetchWatchlistData() {
            const watchlistId = this.$route.params.id;

            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`api/watchlists/${watchlistId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // console.log('Fetched data:', response.data);

                this.watchlistName = response.data.name;
                this.coins = response.data.coins || [];
            } catch (error) {
                console.error('Error fetching watchlist:', error.response?.data || error.message);
            }
        },

        async addCoin() {

            const token = localStorage.getItem('authToken');
            const watchlistId = this.$route.params.id;

            if (!this.newCoin.trim()) {
                alert('Please enter a valid coin ID');
                return;
            }

            try {
                const response = await axios.post(`/api/watchlists/${watchlistId}/add-coins`,
                    { ids: [this.newCoin.trim()] },                 // Send the coin ID in the request body as an array
                    { headers: { Authorization: `Bearer ${token}` }
                });

                // console.log('Response from addCoin:', response.data);

                // Re-fetch the watchlist to get full coin details
                await this.fetchWatchlistData();

                this.newCoin = ''; // Clear the input field

            } catch (error) {
                console.error('Error adding coin:', error.response?.data || error.message);
            }
        },

        openCoinModal(id) {
            this.selectedCoinId = id;       // Set the selected coin ID
            this.showCoinModal = true;      // Show the modal
        },

        closeCoinModal() {
            this.showCoinModal = false;     // Hide the modal
            this.selectedCoinId = null;     // Clear the selected coin ID
        },

        handleLogout() {
            localStorage.removeItem('username');
            localStorage.removeItem('authToken');
            // alert('You have been logged out');
            this.$router.push('/');                     // Redirect to homepage
        }
    },

    created() {
        // Retrieve the username from localStorage
        this.username = localStorage.getItem('username') || 'Guest';
    },

    mounted() {
        this.fetchWatchlistData();
    }
}

</script>


<style scoped>

img {
    display: block;
    cursor: pointer;
    width: 20px;
    height: 20px;
}

.img {
    padding-top: 2px;
}

.coin-name {
    color: #222;
}

.coin-name:hover {
    color: #000;
    cursor: pointer;
}

</style>