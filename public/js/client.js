// client.js

document.addEventListener('DOMContentLoaded', () => {

    const userDisplay = document.getElementById('userDisplay');
    const watchlistArticle = document.getElementById('watchlistArticle');
    const logoutButton = document.getElementById('logout');

    // Check if user is logged in by verifying the presence of the auth token

    const authToken = localStorage.getItem('authToken');
    

    if (authToken) {
        // Decode token to display user details
        const user = JSON.parse(localStorage.getItem('user'));

        userDisplay.textContent = `Welcome ${user.email}`;   
        watchlistArticle.style.display = 'block'; 
    } else {
        userDisplay.textContent = 'Please log in to access your watchlist';
        logoutButton.style.display = 'none';
        watchlistArticle.style.display = 'none';
    }

    // Log out function
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }

    logoutButton.addEventListener('click', logout);
});