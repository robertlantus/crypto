// client.js

document.addEventListener('DOMContentLoaded', () => {

    const messageContainer = document.getElementById('messageContainer'); 
    const userDisplay = document.getElementById('userDisplay');
    const watchlistArticle = document.getElementById('watchlistArticle');
    const logoutButton = document.getElementById('logout');

    // Check if a success message is stored in localStorage

    const successMessage = localStorage.getItem('successMessage');

    if (successMessage) {
        // Display the success message
        messageContainer.textContent = successMessage;
        messageContainer.style.display = 'block';

        // Clear the message from localStorage
        // localStorage.removeItem('successItem');
    }

    // Check if user is logged in by verifying the presence of the auth token

    const authToken = localStorage.getItem('authToken');
    
    if (authToken) {
        // Decode token to display user details
        // const user = JSON.parse(localStorage.getItem('user'));

        // Get user email from localStorage
        const userEmail = localStorage.getItem('userEmail');

        userDisplay.textContent = `Welcome ${userEmail}`;   
        watchlistArticle.style.display = 'flex'; 
    } else {
        userDisplay.textContent = 'Please log in to access your watchlist';
        logoutButton.style.display = 'none';
        watchlistArticle.style.display = 'none';
    }

    // Log out function
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('successMessage');
        // window.location.href = '/index.html';
        window.location.replace('/index.html');
    }

    logoutButton.addEventListener('click', logout);
});