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
import axios from 'axios';

  export default {
    data() {
      return {
        username: '',
        watchlists: [],
        newWatchlistName: '',

      };
    },

    created() {
      // Retrieve the username from localStorage
      this.username = localStorage.getItem('username') || 'Guest';
    },

    mounted() {
        // Invoke fetchWatchlists when the component is mounted
        // console.log('mounted hook triggered');
        this.fetchWatchlists();
    },

    methods: {

        async fetchWatchlists() {
            // console.log('fetchWatchlists called'); // Confirm function is invoked

            try {
                const token = localStorage.getItem('authToken');
                // console.log('Auth Token:', token);

                const response = await axios.get('/api/watchlists', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // console.log('Full response:', response);
                // console.log('Response data:', response.data);

                // Assign watchlists array from response
                this.watchlists = response.data.watchlists;

            } catch (error) {
                console.error('Error fetching watchlists:', error.response?.data || error.message);
            }
        },

        async createWatchlist() {
            try {
                const token = localStorage.getItem('authToken');

                const response = await axios.post(
                    '/api/watchlists',
                    { name: this.newWatchlistName },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                this.watchlists.push(response.data.watchlist);
                this.newWatchlistName = '';

            } catch (error) {
                console.error('Error creating watchlist:', error.response?.data || error.message);
            }
        },

        async editWatchlist(watchlist) {

        },

        async deleteWatchlist(id) {
            try {
                const token = localStorage.getItem('authToken');

                await axios.delete(`/api/watchlists/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                this.watchlists = this.watchlists.filter(watchlist => watchlist._id !== id);

            } catch (error) {
                console.error('Error deleting watchlist:', error.response?.data || error.message);
            }
        },

        handleLogout() {
            localStorage.removeItem('username');
            localStorage.removeItem('authToken');
            // alert('You have been logged out');
            this.$router.push('/');                     // Redirect to homepage
        }
    }
}

</script>
  
<style scoped>

    .watchlist-name {
        font-size: 18px;
    }

</style>