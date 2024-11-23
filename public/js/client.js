// client.js

// Initial Signup or Login

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

// Handle modal visibility and send the new watchlist name to the backend.

document.addEventListener('DOMContentLoaded', () => {

    const createButton = document.getElementById('create');
    const watchlistModal = document.getElementById('watchlistModal');
    const closeModal = document.getElementById('closeModal');
    const cancelWatchlist = document.getElementById('cancelWatchlist');
    const saveWatchlist = document.getElementById('saveWatchlist');
    const watchlistNameInput = document.getElementById('watchlistName');

    // Open the modal

    createButton.addEventListener('click', () => {
        console.log('Create new modal');
        watchlistModal.classList.add('is-active');
    });

    // Close the modal (both close button and cancel button)

    // closeModal.addEventListener('click', () => {
    //     watchlistModal.classList.remove('is-active');
    // });

    // cancelWatchlist.addEventListener('click', () => {
    //     watchlistModal.classList.remove('is-active');
    // });

    // Close modal -- second

    [closeModal, cancelWatchlist].forEach(button => {
        button.addEventListener('click', () => {
            watchlistModal.classList.remove('is-active');
        });
    });

    saveWatchlist.addEventListener('click', async () => {

        const watchlistName = watchlistNameInput.value.trim();

        if (!watchlistName) {
            alert('Please enter a name for your watchlist');
            return;
        }

        try {
            // Get user's token
            const authToken = localStorage.getItem('authToken');

            const response = await fetch('/api/watchlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer: ${authToken} `
                },
                body: JSON.stringify({ name: watchlistName })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = response.json();
            console.log('Watchlist created:', result);
            alert(`Watchlist ${watchlistName} created successfully!`);

        } catch (error) {
            console.error('Error creating watchlist', error);
            alert('Failed to create watchlist. Please try again.')
        }

        finally {
            watchlistModal.classList.remove('is-active');
            watchlistNameInput.value = '';
        }
    });
});