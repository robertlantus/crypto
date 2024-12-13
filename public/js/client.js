// client.js

// Refactored

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    fetchWatchlists();
});

// Constants for DOM elements
const messageContainer = document.getElementById('messageContainer');
const userDisplay = document.getElementById('userDisplay');
const watchlistArticle = document.getElementById('watchlistArticle');
const logoutButton = document.getElementById('logout');
const createButton = document.getElementById('create');
const watchlistModal = document.getElementById('watchlistModal');
const closeModal = document.getElementById('closeModal');
const cancelWatchlist = document.getElementById('cancelWatchlist');
const saveWatchlist = document.getElementById('saveWatchlist');
const watchlistNameInput = document.getElementById('watchlistName');
const watchlistContainer = document.getElementById('watchlistContainer');

// Utility functions
const getAuthToken = () => localStorage.getItem('authToken');
const redirectToIndex = () => window.location.replace('/index.html');

// Display a message
const displayMessage = (message, type = 'success') => {
    messageContainer.textContent = message;
    messageContainer.className = `message is-${type}`;
    messageContainer.style.display = 'block';
};

// Hide a message
const clearMessage = () => {
    messageContainer.textContent = '';
    messageContainer.style.display = 'none';
};

// Initialize the app
const initializeApp = () => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
        displayMessage(successMessage);
        localStorage.removeItem('successMessage');
    }

    const authToken = getAuthToken();
    if (authToken) {
        const userName = localStorage.getItem('userName') || 'User';
        userDisplay.textContent = `Welcome, ${userName}!`;
        watchlistArticle.style.display = 'flex';
    } else {
        userDisplay.textContent = 'Please log in to access your watchlist';
        logoutButton.style.display = 'none';
        watchlistArticle.style.display = 'none';
    }

    logoutButton.addEventListener('click', handleLogout);
    setupModalControls();
};

// Handle logout
const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('successMessage');
    redirectToIndex();
};

// Set up modal controls
const setupModalControls = () => {
    createButton.addEventListener('click', () => {
        watchlistModal.classList.add('is-active');
    });

    [closeModal, cancelWatchlist].forEach(button => {
        button.addEventListener('click', () => {
            watchlistModal.classList.remove('is-active');
        });
    });

    saveWatchlist.addEventListener('click', handleSaveWatchlist);
};

// Fetch watchlists
const fetchWatchlists = async () => {
    const authToken = getAuthToken();

    if (!authToken) {
        watchlistContainer.innerHTML = 'You need to log in to view your watchlists';
        redirectToIndex();
        return;
    }

    try {
        const response = await fetch('/api/watchlists', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const watchlists = await response.json();
            renderWatchlists(watchlists);
        } else {
            const errorData = await response.json();
            displayMessage(errorData.message, 'danger');
        }
    } catch (error) {
        console.error('Error fetching watchlists:', error);
        displayMessage('An error occurred. Please try again later.', 'danger');
    }
};

// Render watchlists dynamically
const renderWatchlists = (watchlists) => {

    if (!watchlists.length) {
        watchlistContainer.innerHTML = 'You do not have any watchlists.';
        return;
    }

    watchlistContainer.innerHTML = '';
    const list = document.createElement('ul');

    watchlists.forEach(watchlist => {

        const li = document.createElement('li');
        li.classList.add('watchlist-item');
        li.setAttribute('data-id', watchlist._id);
        
        // Watchlist name
        const nameSpan = document.createElement('span');
        nameSpan.textContent = watchlist.name;
        nameSpan.classList.add('watchlist-name');

        // Delete icon
        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.setAttribute('title', 'Delete Watchlist');

        // Font Awesome trash icon
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa', 'fa-trash');
        deleteIcon.appendChild(trashIcon);


        // Append to list item
        li.appendChild(nameSpan);
        li.appendChild(deleteIcon);
        list.appendChild(li);

    });
    watchlistContainer.appendChild(list);
};

// Handle save watchlist
const handleSaveWatchlist = async () => {

    const watchlistName = watchlistNameInput.value.trim();

    if (!watchlistName) {
        alert('Please enter a name for your watchlist');
        return;
    }

    try {
        // Get user's token from local storage
        const authToken = getAuthToken();

        const response = await fetch('/api/watchlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ name: watchlistName })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        // Await the resolved JSON response
        const result = await response.json();
        // console.log('Backend response:', result);

        // Use the `name` property of the `watchlist` object from the backend response
        displayMessage(`Watchlist "${result.watchlist.name}" created successfully!`);
        fetchWatchlists();

    } catch (error) {
        console.error('Error creating watchlist:', error);
        alert('Failed to create watchlist. Please try again.');
    } finally {
        watchlistModal.classList.remove('is-active');
        watchlistNameInput.value = '';
    }
};

// Add event listener to the container
document.getElementById('watchlistContainer').addEventListener('click', async (event) => {

    // Check if the clicked element or its parent has the `delete-icon` class
    const deleteIcon = event.target.closest('.delete-icon');
    if (!deleteIcon) return; // Exit if not clicking on the delete icon

    const watchlistItem = deleteIcon.closest('.watchlist-item');
    const watchlistId = watchlistItem.getAttribute('data-id');
    console.log('Watchlist ID:', watchlistId);

    // Confirm deletion
    const confirmDelete = confirm('Are you sure you want to delete this watchlist?');
    if (!confirmDelete) return;

    try {
        // Get the user's auth token from localStorage
        const authToken = localStorage.getItem('authToken');

        // Send delete request to the backend
        const response = await fetch(`/api/watchlists/${watchlistId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete watchlist: ${response.status}`);
        }

        const result = await response.json();
        console.log('Backend response:', result);

        // Remove the watchlist from the DOM
        watchlistItem.remove();
        alert('Watchlist deleted successfully!');

        // Use the `name` property of the `watchlist` object from the backend response
        displayMessage(`Watchlist "${result.watchlist.name}" deleted successfully!`);
        // fetchWatchlists();

    } catch (error) {
        console.error('Error deleting watchlist:', error);
        alert('Could not delete the watchlist. Please try again.');
    }
});


// --------------------------------------------------------------------------------------------

// // Initial Signup or Login

// document.addEventListener('DOMContentLoaded', () => {

//     const messageContainer = document.getElementById('messageContainer'); 
//     const userDisplay = document.getElementById('userDisplay');
//     const watchlistArticle = document.getElementById('watchlistArticle');
//     const logoutButton = document.getElementById('logout');

//     // Check if a success message is stored in localStorage

//     const successMessage = localStorage.getItem('successMessage');

//     if (successMessage) {
//         // Display the success message
//         messageContainer.textContent = successMessage;
//         messageContainer.style.display = 'block';

//         // Clear the message from localStorage
//         // localStorage.removeItem('successItem');
//     }

//     // Check if user is logged in by verifying the presence of the auth token

//     const authToken = localStorage.getItem('authToken');
    
//     if (authToken) {
//         // Decode token to display user details
//         // const user = JSON.parse(localStorage.getItem('user'));

//         // Get user email from localStorage
//         const userName = localStorage.getItem('userName');

//         userDisplay.textContent = `Welcome ${userName} !`;   
//         watchlistArticle.style.display = 'flex'; 

//     } else {

//         userDisplay.textContent = 'Please log in to access your watchlist';
//         logoutButton.style.display = 'none';
//         watchlistArticle.style.display = 'none';
//     }

//     // Log out function
//     function logout() {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userName');
//         localStorage.removeItem('successMessage');
//         // window.location.href = '/index.html';
//         window.location.replace('/index.html');
//     }

//     logoutButton.addEventListener('click', logout);
// });

// // Handle modal visibility and send the new watchlist name to the backend.

// document.addEventListener('DOMContentLoaded', () => {

//     const createButton = document.getElementById('create');
//     const watchlistModal = document.getElementById('watchlistModal');
//     const closeModal = document.getElementById('closeModal');
//     const cancelWatchlist = document.getElementById('cancelWatchlist');
//     const saveWatchlist = document.getElementById('saveWatchlist');
//     const watchlistNameInput = document.getElementById('watchlistName');

//     // Open the modal

//     createButton.addEventListener('click', () => {
//         console.log('Create new modal');
//         watchlistModal.classList.add('is-active');
//     });

//     // Close the modal (both close button and cancel button)

//     // closeModal.addEventListener('click', () => {
//     //     watchlistModal.classList.remove('is-active');
//     // });

//     // cancelWatchlist.addEventListener('click', () => {
//     //     watchlistModal.classList.remove('is-active');
//     // });

//     // Close modal -- second

//     [closeModal, cancelWatchlist].forEach(button => {
//         button.addEventListener('click', () => {
//             watchlistModal.classList.remove('is-active');
//         });
//     });

//     saveWatchlist.addEventListener('click', async () => {

//         const watchlistName = watchlistNameInput.value.trim();

//         if (!watchlistName) {
//             alert('Please enter a name for your watchlist');
//             return;
//         }

//         try {
//             // Get user's token
//             const authToken = localStorage.getItem('authToken');

//             const response = await fetch('/api/watchlists', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer: ${authToken} `
//                 },
//                 body: JSON.stringify({ name: watchlistName })
//             });

//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status}`);
//             }

//             const result = response.json();
//             console.log('Watchlist created:', result);
//             alert(`Watchlist ${watchlistName} created successfully!`);

//             // const watchlist = document.getElementById('watchlist');
//             // let li = document.createElement('li');
//             // li.innerText = `${watchlistName}`;
//             // watchlist.append(li);

//         } catch (error) {
//             console.error('Error creating watchlist', error);
//             alert('Failed to create watchlist. Please try again.')
//         }

//         finally {
//             watchlistModal.classList.remove('is-active');
//             watchlistNameInput.value = '';
//         }
//     });
// });

// document.addEventListener('DOMContentLoaded', () => {
//     fetchWatchlists();
// });

// async function fetchWatchlists() {
    
//     const watchlistContainer = document.getElementById('watchlistContainer');

//     // Retrieve the token from localStorage
//     const authToken = localStorage.getItem('authToken');

//     if (!authToken) {
//         watchlistContainer.innerHTML = 'You need to log in to view your watchlists';
//         window.location.replace('/login.html');
//         return;
//     }

//     try {
//         const response = await fetch('/api/watchlists', {
//             method: 'GET',
//             headers: {
//                 // Include the token in the Authorization header
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.ok) {
//             const watchlists = await response.json();

//             if (watchlists.length === 0) {
//                 watchlistContainer.innerHTML = 'You do not have any watchlists';
//                 return;
//             }

//             // Render watchlists dynamically
//             watchlistContainer.innerHTML = '';
//             const list = document.createElement('ul');
//             watchlists.forEach(watchlist => {
//                 const li = document.createElement('li');
//                 li.innerText = `${watchlist.name}`;
//                 list.appendChild(li);
//                 watchlistContainer.appendChild(list);
//             });
//         } else {
//             const errorData = await response.json();
//             console.error('Failed to fetch watchlists:', errorData.message);
//             watchlistContainer.innerHTML = `<p>Error: ${errorData.message}</p>`;
//         }
        
//     } catch (error) {
//         console.error('Error fetching watchlists:', error);
//         watchlistContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
//     }
// }