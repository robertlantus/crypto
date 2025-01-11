<template>

    <div>
        <div class="box is-flex is-justify-content-space-between p-6">
            <div class="logo">
                <router-link to="/">gecko</router-link>
            </div>
            <button class="button is-danger" @click="handleLogout">Logout</button>
        </div>
        
        <div class="block m-6">
            <h1 class="is-size-4 mb-3">Welcome, {{ username }} !</h1>
    
            <div class="block is-flex is-justify-content-space-between">
                <div class="block">
                    <h2 class="is-size-5 mb-2">Your Watchlists:</h2>
                    <div class="block">
                        <ul class="ml-4" v-if="watchlists.length > 0">
                            <li 
                                v-for="watchlist in watchlists" 
                                :key="watchlist._id" 
                                class="is-flex is-align-items-center is-justify-content-space-between mb-2 p-2 box"
                            >
                                <span class="watchlist-name mr-2">{{ watchlist.name }}</span>
                                <div>
                                    <button 
                                        class="button is-small is-info is-light mr-2" 
                                        @click="editWatchlist(watchlist)"
                                    >
                                        <span class="icon">
                                            <i class="fa-solid fa-pen"></i>
                                        </span>
                                    </button>
                                    <button 
                                        class="button is-small is-danger is-light" 
                                        @click="deleteWatchlist(watchlist._id)"
                                    >
                                        <span class="icon">
                                            <i class="fa-solid fa-trash"></i>
                                        </span>
                                    </button>
                                </div>
                            </li>
                        </ul>
    
                        <p v-else>No watchlists found. Create one!</p>
                    </div>
    
                </div>
    
                <div>
                    <h2 class="is-size-5 mb-2">Create a New Watchlist</h2>
                    <form @submit.prevent="createWatchlist">
                        <input
                            type="text"
                            v-model="newWatchlistName"
                            placeholder="Watchlist Name"
                            required
                            class="input is-primary mb-2"
                        />
                        <button type="submit" class="button is-primary">Create</button>
                    </form>
                </div>
            </div>
        </div>
        
    
        <!-- <div v-if="editMode">
          <h2>Edit Watchlist</h2>
          <form @submit.prevent="updateWatchlist">
            <input
              type="text"
              v-model="editWatchlistName"
              placeholder="New Watchlist Name"
              required
            />
            <button type="submit">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </form>
        </div> -->
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
        const newWatchlistName = ref('');
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

        // Create a new watchlist
        const createWatchlist = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No auth token found');
                    return;
                }

                if (!newWatchlistName.value.trim()) {
                    console.error("Watchlist name cannot be empty");
                    return;
                }

                // Send POST request
                const response = await axios.post(
                    '/api/watchlists',
                    { name: newWatchlistName.value.trim() },                   // Correctly use `.value`
                    { headers: { Authorization: `Bearer ${token}`} }
                );

                // Add new watchlist to the list
                watchlists.value.push(response.data.watchlist);
                newWatchlistName.value = '';

            } catch (error) {
                console.error('Error creating watchlist:', error.response?.data || error.message);
            }
        };

        // Edit an existing watchlist
        const editWatchlist = async (watchlist) => {

        }

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
        });

        // Return to template
        return {
            username,
            newWatchlistName,
            watchlists,
            createWatchlist,
            editWatchlist,
            deleteWatchlist,        // Expose deleteWatchlist to the template
            handleLogout,
        };
    }
};

</script>

<style scoped>

</style>