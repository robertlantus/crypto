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
        const userName = localStorage.getItem('userName');

        userDisplay.textContent = `Welcome ${userName} !`;   
        watchlistArticle.style.display = 'flex'; 

    } else {

        userDisplay.textContent = 'Please log in to access your watchlist';
        logoutButton.style.display = 'none';
        watchlistArticle.style.display = 'none';
    }

    // Log out function
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
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

            // const watchlist = document.getElementById('watchlist');
            // let li = document.createElement('li');
            // li.innerText = `${watchlistName}`;
            // watchlist.append(li);

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

document.addEventListener('DOMContentLoaded', () => {
    fetchWatchlists();
});

async function fetchWatchlists() {
    
    const watchlistContainer = document.getElementById('watchlistContainer');

    // Retrieve the token from localStorage
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        watchlistContainer.innerHTML = 'You need to log in to view your watchlists';
        window.location.replace('/login.html');
        return;
    }

    try {
        const response = await fetch('/api/watchlists', {
            method: 'GET',
            headers: {
                // Include the token in the Authorization header
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const watchlists = await response.json();

            if (watchlists.length === 0) {
                watchlistContainer.innerHTML = 'You do not have any watchlists';
                return;
            }

            // Render watchlists dynamically
            watchlistContainer.innerHTML = '';
            const list = document.createElement('ul');
            watchlists.forEach(watchlist => {
                const li = document.createElement('li');
                li.innerText = `${watchlist.name}`;
                list.appendChild(li);
                watchlistContainer.appendChild(list);
            });
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch watchlists:', errorData.message);
            watchlistContainer.innerHTML = `<p>Error: ${errorData.message}</p>`;
        }
        
    } catch (error) {
        console.error('Error fetching watchlists:', error);
        watchlistContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
    }
}