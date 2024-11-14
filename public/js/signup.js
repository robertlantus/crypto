
// signup.js

const form = document.getElementById('loginForm');

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

        const data = await response.json();
        // console.log(data);

        if (response.ok) {

            // Save token and user data in localStorage

            // localStorage.setItem('message', data.message);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            

            alert('User registered successfully!');
            // Redirect to client page
            // window.location.href = '/client.html';       
            window.location.replace('/client.html');
        } else {
            console.error(`Login failed: ${data.error}`);
            alert(`Login failed: ${data.error}`);
        }

    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
    }
});