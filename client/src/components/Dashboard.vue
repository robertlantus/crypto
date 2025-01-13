<template>

<div>
    <div class="box is-flex is-justify-content-space-between p-6">
        <div class="logo">
            <router-link to="/">gecko</router-link>
        </div>
        <button class="button is-danger" @click="handleLogout">Logout</button>
    </div>
    
    <div class="block mx-6">
        <h1 class="is-size-4 mb-3">Welcome, {{ username }} !</h1>

        <div class="block is-flex is-justify-content-space-between">
            <div class="block">
                <h2 class="mb-2">Your Watchlists:</h2>
                <div class="block">
                    <ul class="ml-4" v-if="watchlists.length > 0">
                        <li 
                            v-for="watchlist in watchlists" 
                            :key="watchlist._id" 
                            class="is-flex is-align-items-center is-justify-content-space-between mb-2 p-2 box"
                        >
                            <!-- <span class="watchlist-name mr-2">{{ watchlist.name }}</span> -->
                             <a @click="goToCoinsPage(watchlist._id)" class="watchlist-name mr-2">{{ watchlist.name }}</a>
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

                    <p v-else>No watchlists found. Create one to get started!</p>
                </div>

            </div>

            <div class="box new">
                <h2 class="mb-2">Create a New Watchlist</h2>
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

                <!-- Render error message if watchlist name already exists -->
                <p v-if="errorMessageNew" class="error">{{ errorMessageNew }}</p>
            </div>

        </div>

        <div v-if="editMode" class="box edit" >
    
            <form @submit.prevent="updateWatchlist">
                <div class="field">
                    <label class="label has-text-weight-normal" for="edit-watchlist-name">New Watchlist Name</label>
                    <div class="control">
                        <input
                        id="edit-watchlist-name"
                        type="text"
                        v-model="editWatchlistName"
                        placeholder="Enter new watchlist name"
                        required
                        class="input is-primary"
                        />
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-primary">Save</button>
                    </div>
                    <div class="control">
                        <button type="button" @click="cancelEdit" class="button is-light">Cancel</button>
                    </div>
                </div>
            </form>

            <!-- Render error message if watchlist name already exists -->
            <p v-if="errorMessageEdit" class="error">{{ errorMessageEdit }}</p>
        </div>
    </div>

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
        editWatchlistId: null,
        editWatchlistName: '',
        editMode: false,
        errorMessage: '',
        errorMessageNew: '',
        errorMessageEdit: ''
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

            this.errorMessageNew = '';         // Reset error message before request

            try {
                const token = localStorage.getItem('authToken');

                // const response = await axios.post(
                //     '/api/watchlists',
                //     { name: this.newWatchlistName },
                //     { headers: { Authorization: `Bearer ${token}` } }
                // );

                // console.log(response.data.links);

                // this.watchlists.push(response.data.watchlist);
                // this.newWatchlistName = '';

                // Dynamically find the POST link for creating a watchlist
                const postLink = {
                    rel: 'self',
                    href: '/api/watchlists',
                    method: 'POST'
                };

                if (!postLink || postLink.method.toLowerCase() !== 'post') {
                    throw new Error('No valid POST link found in the response');
                }

                // Make the dynamic POST request
                const response = await axios({
                    method: postLink.method,
                    url: postLink.href,
                    data: { name: this.newWatchlistName },
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('Watchlist created successfully:', response.data);

                // Use the `links` in the response for further navigation or requests
                const responseLinks = response.data.links;
                console.log('Available links:', responseLinks);

                // Add the new watchlist to the list without refetching all
                this.watchlists.push(response.data.watchlist);

                // Reset the input field
                this.newWatchlistName = '';

            } catch (error) {

                if (error.response && error.response.status === 409) {
                    // Backend returns 409 for existing watchlist
                    this.errorMessageNew = `Watchlist named "${this.newWatchlistName}" already exists.`;
                } else {
                    // Generic error handling
                    console.error('Error creating watchlist:', error.response?.data || error.message);
                    this.errorMessageNew = 'An error occurred. Please try again.';
                }
            }
        },

        editWatchlist(watchlist) {
            this.editWatchlistId = watchlist._id;
            this.editWatchlistName = watchlist.name;
            this.editMode = true;
            this.errorMessageEdit = ''; 
        },

        async updateWatchlist() {

            this.errorMessageEdit = '';     // Reset error message before request

            try {
                const token = localStorage.getItem('authToken');

                const response = await axios.patch(
                    `/api/watchlists/${this.editWatchlistId}`,
                    { name: this.editWatchlistName },
                    { headers: { Authorization: `Bearer ${token}` }
                });

                // Find the index of the watchlist to update
                const index = this.watchlists.findIndex(
                    (watchlist) => watchlist._id === this.editWatchlistId
                );

                // Directly update the array element
                if (index !== -1) {
                    this.watchlists[index] = response.data.watchlist;
                }

                this.cancelEdit();

            } catch (error) {

                if (error.response && error.response.status === 409) {
                    // Backend returns 409 for existing watchlist
                    this.errorMessageEdit = `A watchlist with the name "${this.editWatchlistName}" already exists.`;
                } else {
                    // Generic error handling
                    console.error('Error creating watchlist:', error.response?.data || error.message);
                    this.errorMessageEdit = 'An error occurred. Please try again.';
                }
            }
        },

        cancelEdit() {
            this.editMode = false;
            this.editWatchlistId = null;
            this.editWatchlistName = '';
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

        goToCoinsPage(watchlistId) {
            this.$router.push({ name: 'Coins', params: { id: watchlistId } });
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

    h2, label {
        font-size: 18px;
    }

    a, a:link, a:visited, a:hover, a:active {
        color: inherit;
        text-decoration: inherit;
        font-weight: inherit;
    }

    .watchlist-name {
        font-size: 18px;
    }

    .new, .edit {
        min-width: 440px;
        height: 190px;
    }

    .error {
        color: red;
        margin: 8px;
    }

</style>