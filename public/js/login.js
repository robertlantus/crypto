
// login.js

// Clear localStorage on page load
window.addEventListener('load', () => {
    localStorage.removeItem('successMessage');
});

const form = document.getElementById('loginForm');
const errorMessageContainer = document.getElementById('errorMessageContainer');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;            

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            
            const token = data.token;

            // Save token and user data in localStorage
            localStorage.setItem('authToken', token);

            // Decode the token to extract the email
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userEmail = payload.email;

            // Store the decoded email in localStorage
            localStorage.setItem('userEmail', userEmail);

            localStorage.setItem('successMessage', 'Login successful!');

            // alert('Login successful');
            // window.location.href = '/client.html';
            window.location.replace('/client.html');
        } else {
            // Handle different status codes for more specific errors

            let userMessage = `Login failed: 
                                ${data.error}`;

            localStorage.setItem('successMessage', 'User login failed!');

            console.error(`Login failed (status ${response.status}): ${data.error}`);
            displayErrorMessage(userMessage);
        }
    } catch (error) {
        // console.error('Login error:', error);
        displayErrorMessage(`An error occurred while processing your request. 
                            Please try again later.`);
    }
});

// Function to display error messages on the page

function displayErrorMessage(message) {
    if (errorMessageContainer) {
        errorMessageContainer.textContent = message;
        errorMessageContainer.style.display = 'block';
        errorMessageContainer.style.color = 'red';
    }
}