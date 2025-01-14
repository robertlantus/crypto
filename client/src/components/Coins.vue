
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

                <div class="block">
                    <!-- Back to Dashboard -->
                    <router-link to="/dashboard" class="button is-link">All Watchlists</router-link>
                </div>

                <h2 class="is-size-5 my-3"><span class="has-text-weight-medium">{{ watchlistName }}</span></h2>
            </div>
            <div class="block mx-6 mt-4">

                <form @submit.prevent="addCoin">
                    <input 
                        v-model="newCoin" 
                        placeholder="Enter coin ID (ex: bitcoin)" 
                        class="input mb-2"
                    />
                    <button type="submit" class="button is-primary">Add Coin</button>

                    <!-- Display validation error -->
                    <p v-if="validationError" class="has-text-danger mt-2">{{ validationError }}</p>
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
                                <i class="fa-solid fa-trash"></i>
                            </span>
                        </button>
                    </td>
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
            watchlistId: '',
            error: '',
            validationError: '',
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

            // Clear any existing validation error
            this.validationError = '';

            if (!this.newCoin.trim()) {
                this.validationError = 'Please enter a valid coin ID';
                return;
            }

            try {
                // Make the API request to add the coin
                const response = await axios.post(`/api/watchlists/${watchlistId}/add-coins`,
                    { ids: [this.newCoin.trim()] },                 // Send the coin ID in the request body as an array
                    { headers: { Authorization: `Bearer ${token}` }
                });

                // console.log('Response from addCoin:', response.data);

                // Re-fetch the watchlist to get full coin details and update the UI
                await this.fetchWatchlistData();

                // Clear the input field and error message
                this.newCoin = ''; 
                this.validationError = '';

            } catch (error) {
                console.error('Error adding coin:', error.response?.data || error.message);

                // Handle 404 server-side errors
                if (error.response?.status === 404) {
                    this.validationError = `Coin not found: "${this.newCoin.trim()}"`;
                } else {
                    this.validationError = 'An unexpected error occurred. Please try again.';
                }
            }
        },

        async removeCoin(coinId) {

            const token = localStorage.getItem('authToken');
            const watchlistId = this.watchlistId;       // Reference the initialized watchlistId

            console.log('Token:', token);
            console.log('Watchlist ID (method):', watchlistId);

            try {
                const response = await axios.patch(`/api/watchlists/${this.watchlistId}/remove-coins`, 
                    { ids: [coinId] },        // Send the coin ID as an array
                    { headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200) {
                    // Update the local state by filtering out the removed coin
                    this.coins = this.coins.filter((coin) => coin.id !== coinId);
                }
            } catch (error) {
                console.error('Error removing coin:', error);
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
        // Assign watchlist ID from route params
        this.watchlistId = this.$route.params.id;
        console.log('Watchlist ID (mounted):', this.watchlistId); // Debugging
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