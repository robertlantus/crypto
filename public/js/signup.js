
// signup.js

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
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // console.log(response);

        const data = await response.json();
        // console.log(data);

        if (response.ok) {
            
            const token = data.token;

            // Save token and user data in localStorage
            localStorage.setItem('authToken', token);

            // Decode the token to extract the email
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userEmail = payload.email;

            // Store the decoded email in localStorage
            localStorage.setItem('userEmail', userEmail);
            
            localStorage.setItem('successMessage', 'User registered successfully!');
            
            // alert('User registered successfully!');
            
            // Redirect to client page
            // window.location.href = '/client.html';       
            window.location.replace('/client.html');
            
        } else {

            // console.error(`Login failed: ${data.error}`);
            // alert(`Login failed: ${data.error}`);

            // Handle different status codes for more specific errors

            let userMessage = `Signup failed: 
                                ${data.error}`;

            localStorage.setItem('successMessage', 'User registration failed!');

            console.log(`Signup failed (status ${response.status}): ${data.error}`);
            displayErrorMessage(userMessage);
        }

    } catch (error) {
        // console.error('Signup error:', error);
        displayErrorMessage(`An error occurred while processing your request. 
                            Please try again later.`);
    }
});

// Function to display error messages on the page

function displayErrorMessage(message) {
    if (errorMessageContainer) {
        errorMessageContainer.innerHTML = message;
        errorMessageContainer.style.display = 'block';
        errorMessageContainer.style.color = 'red';
    }
}