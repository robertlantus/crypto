
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

            <div class="mr-6">
                <!-- AddCoin component -->
                <AddCoin :coins="allCoins" @add-coin="handleAddCoin" />
            </div>

        </div>

        <div class="container is-fluid">

            <CryptoTableDelete
                :coins="coins"
                :error="error"
                @open-modal="openCoinModal"
                @remove-coin="removeCoin"
            />

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
import CoinModal from './CoinModal.vue';
import AddCoin from './AddCoin.vue';
import CryptoTableDelete from './CryptoTableDelete.vue';

export default {

    name: "Coins",

    components: {
        CoinModal,
        AddCoin,
        CryptoTableDelete
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
            selectedCoinId: null,        // Stores the ID of the selected coin
            allCoins: [], // Full list of coins fetched from your backend
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
                // console.log('Fetched data coins:', response.data.coins);

                this.watchlistName = response.data.name;
                this.coins = response.data.coins || [];
            } catch (error) {
                console.error('Error fetching watchlist:', error.response?.data || error.message);
            }
        },

        // Dynamic search and addition of coins to watchlist

        async fetchAllCoins() {
            // Fetch all coins from your backend and populate allCoins
            const response = await axios.get("/api/coins/markets"); // Adjust API route
            this.allCoins = response.data.data;
        },

        async handleAddCoin(coin) {
            // Logic to handle adding a coin to the user's watchlist
            try {
                const token = localStorage.getItem("authToken");
                const watchlistId = this.$route.params.id;

                await axios.post(`/api/watchlists/${watchlistId}/add-coins`,
                    { ids: [coin.id] },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // alert(`${coin.name} added to your watchlist!`);

                // Re-fetch the watchlist to get full coin details and update the UI
                await this.fetchWatchlistData();

            } catch (error) {
                console.error('Error adding coin:', error.response?.data || error.message);
            }
        },

        async removeCoin(coinId) {

            const token = localStorage.getItem('authToken');
            const watchlistId = this.watchlistId;       // Reference the initialized watchlistId

            // console.log('Token:', token);
            // console.log('Watchlist ID (method):', watchlistId);

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
        // console.log('Watchlist ID (mounted):', this.watchlistId); // Debugging
        this.fetchAllCoins();
    }
}

</script>


<style scoped>

</style>