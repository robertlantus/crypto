<template>

<div class="dashboard">
    <h1>Welcome, {{ username }}</h1>
    <button class="button is-danger" @click="handleLogout">Logout</button>
    <!-- <div>
      <h2>Your Watchlists</h2>
      <ul v-if="watchlists.length > 0">
        <li v-for="watchlist in watchlists" :key="watchlist._id">
          <span>{{ watchlist.name }}</span>
          <button @click="editWatchlist(watchlist)">Edit</button>
          <button @click="deleteWatchlist(watchlist._id)">Delete</button>
        </li>
      </ul>
      <p v-else>No watchlists found. Create one below!</p>
    </div> -->
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
  export default {
    data() {
      return {
        username: '',
      };
    },
    created() {
      // Retrieve the username from localStorage
      this.username = localStorage.getItem('username') || 'Guest';
    },
  };
  </script>
  