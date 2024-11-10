
// login.js

const form = document.getElementById('loginForm');

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

        if (!response.ok) {
            alert('Login failed');
            throw new Error('Login failed');
        } 

        const data = await response.json();
        // console.log(data);
        alert('Login successfull');
        window.location.href = '/index.html';

        
    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
    }
});