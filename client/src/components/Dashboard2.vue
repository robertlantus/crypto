<template>

    <div>
        <div class="box is-flex is-justify-content-space-between p-6">
            <div class="logo">
                <router-link to="/">gecko</router-link>
            </div>
            <button class="button is-danger" @click="handleLogout">Logout</button>
        </div>
    
        <div class="block ml-6">
            <h1 class="is-size-4">Welcome, {{ username }} !</h1>
            <h2 class="is-size-5">Your Watchlists:</h2>
            <ul class="ml-4" v-if="watchlists.length > 0">
                <li v-for="watchlist in watchlists" :key="watchlist._id">
                <span>{{ watchlist.name }}</span>
                <!-- <button @click="editWatchlist(watchlist)">Edit</button> -->
                <button @click="deleteWatchlist(watchlist._id)">
                    <span><i class="fa-solid fa-trash"></i></span>
                </button>
                </li>
            </ul>
            <p v-else>No watchlists found. Create one below!</p>
        </div>
    </div>
</template>

<script>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {

    setup() {
        // Reactive variables
        const username = ref(localStorage.getItem('username' || 'Guest'));
        const watchlists = ref([]);
        const router = useRouter();
        
        // Fetch watchlists
        const fetchWatchlists = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No auth token found');
                    return;
                }

                const response = axios.get('/api/watchlists', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Assign watchlists array from response
                watchlists.value = (await response).data.watchlists;

            } catch (error) {
                console.error('Error fetching watchlists:', error.response?.data || error.message);
            }
        };

        // Delete a watchlist by it's ID
        const deleteWatchlist = async (watchlistId) => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No auth token found');
                    return;
                }

                await axios.delete(`/api/watchlists/${watchlistId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Remove the deleted watchlist from the local state
                watchlists.value = watchlists.value.filter(watchlist => watchlist._id !== watchlistId);
                console.log(`Watchlist with ID ${watchlistId} deleted successfully.`);

            } catch (error) {
                console.error('Error deleting watchlist:', error.response?.data || error.message);
            }
        };

        // Handle logout
        const handleLogout = () => {
            localStorage.removeItem('username');
            localStorage.removeItem('authToken');
            router.push('/');                           // Redirect to homepage
        };

        // Lifecycle hook to fetch watchlists on component mount
        onMounted(() => {
            fetchWatchlists();
            // deleteWatchlist();
        });

        // Return to template
        return {
            username,
            watchlists,
            deleteWatchlist,        // Expose deleteWatchlist to the template
            handleLogout,
        };
    }
};

</script>

<style scoped>

</style>