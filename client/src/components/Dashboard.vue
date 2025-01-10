<template>

<div>
    <div class="box is-flex is-justify-content-space-between p-6">
        <h1>Welcome, {{ username }} !</h1>
        <button class="button is-danger" @click="handleLogout">Logout</button>
    </div>
    
    <div>
      <h2>Your Watchlists:</h2>
      <ul v-if="watchlists.length > 0">
        <li v-for="watchlist in watchlists" :key="watchlist._id">
          <span>{{ watchlist.name }}</span>
          <!-- <button @click="editWatchlist(watchlist)">Edit</button> -->
          <!-- <button @click="deleteWatchlist(watchlist._id)">Delete</button> -->
        </li>
      </ul>
      <p v-else>No watchlists found. Create one below!</p>
    </div>
    <!-- <div>
      <h2>Create a New Watchlist</h2>
      <form @submit.prevent="createWatchlist">
        <input
          type="text"
          v-model="newWatchlistName"
          placeholder="Watchlist Name"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div> -->
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

        handleLogout() {
            localStorage.removeItem('username');
            localStorage.removeItem('authToken');
            // alert('You have been logged out');
            this.$router.push('/');                     // Redirect to homepage
        },
    }

}

</script>
  
<style scoped>

/* .dashboard {
  padding: 20px;
} */



</style>