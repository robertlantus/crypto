
// signup.js

const form = document.getElementById('loginForm');
form.addEventListener('submit', signUpUser);

async function signUpUser(e) {
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
            alert('User registered successfully!');
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}