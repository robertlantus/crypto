
<script>
import { ref, watch, toRefs } from 'vue';
import { signupUser, loginUser } from '../../services/authService.js';
import { useRouter } from 'vue-router';

export default {
    props: {
        showAuthModal: {
            type: Boolean,
            required: true,
        },
        authMode: {
            type: String,
            required: true,
            validator: (value) => ['login', 'signup'].includes(value),
        },
    },

    emits: ['update:showAuthModal', 'authSuccess', 'signupSuccess', 'loginSuccess'],

    setup(props, { emit }) {

        const { showAuthModal } = toRefs(props);
        const username = ref('');
        const email = ref('');
        const password = ref('');
        const error = ref('');
        const message = ref('');
        const router = useRouter();

        const handleAuth = async () => {

            // Clear previous error and message
            error.value = '';
            message.value = '';

            try {
                const userData = {
                    username: username.value, 
                    email: email.value,
                    password: password.value
                };

                if (props.authMode === 'login') {

                    const isloggedIn = await loginUser({ 
                        username: userData.username, 
                        password: userData.password 
                    });

                    // console.log(isloggedIn);

                    if (isloggedIn) {
                        // Store the username in localStorage
                        // localStorage.setItem('username', username.value);

                        localStorage.setItem('username', userData.username);
                        localStorage.setItem('authToken', isloggedIn.data.token);

                        emit('loginSuccess');
                        // console.log('Logging in:', username.value);

                        // Redirect to Dashboard
                        router.push('/dashboard');
                    }
                    
                } else if (props.authMode === 'signup') {

                    const isSignedUp = await signupUser(userData);

                    if (isSignedUp) {

                        message.value = 'Sign up successful. Switching to login in 5 seconds.';
                        
                        setTimeout(() => {
                            emit('signupSuccess');  // Emit signup success event after delay
                            message.value = '';     // Clear the message
                        }, 5000);

                        // console.log('Signup completed. Emitting signup success.');

                    } else {
                        message.value = 'Signup failed. Please try again.';
                    }
            
                    // console.log('Signing up:', username.value, email.value);
                }

                // emit('update:showAuthModal', false);
                emit('authSuccess');

            } catch (err) {

                console.log(err.response.status);
                console.log(err.response.data.message);

                if (err.response && err.response.status === 409) {
                    error.value = err.response.data.message || 'This username is already registered. Please try another username.';
                } else if (err.response && err.response.status === 400) {
                    error.value = err.response.data.message || 'Invalid request. Please check your input.';
                } else if (err.response && err.response.status === 401) {
                    error.value = err.response.data.message || 'Invalid username or password. Please check your credentials.';
                } else if (err.response && err.response.status === 403) {
                    error.value = err.response.data.message || 'Access denied. You may not have the required permissions.';
                } else if (err.response && err.response.status === 500) {
                    error.value = err.response.data.message || 'Server error. Please try again later.';
                } else {
                    error.value = err.message || 'Authentication failed. Please try again.';
                }
                
            }
        };

        watch(showAuthModal, (newValue) => {
            if (!newValue) {
                username.value = '';
                email.value = '';
                password.value = '';
                error.value = '';
                message.value = '';
            }
        });

        return {
            username,
            email,
            password,
            error,
            message,
            handleAuth
        };
    }
};
</script>


<template>
  <div v-if="showAuthModal" class="modal is-active">
    <div class="modal-background" @click="$emit('update:showAuthModal', false)"></div>
    <div class="modal-card">

      <header class="modal-card-head">
        <p class="modal-card-title">{{ authMode === 'login' ? 'Login' : 'Sign Up' }}</p>
        <button class="delete" aria-label="close" @click="$emit('update:showAuthModal', false)"></button>
      </header>

      <section class="modal-card-body">
        <div class="field">
            <label class="label">Username</label>
            <div class="control">
                <input 
                    type="text" 
                    class="input" 
                    v-model="username"
                    placeholder="Enter your username" 
                    required
                />
            </div>
        </div>
        <div v-if="authMode === 'signup'" class="field">
            <label class="label">Email</label>
            <div class="control">
                <input 
                    type="email" 
                    class="input" 
                    v-model="email"
                    placeholder="Enter your email"
                    required 
                />
            </div>
        </div>
        <div class="field">
            <label class="label">Password</label>
            <div class="control">
                <input 
                    type="password" 
                    class="input" 
                    v-model="password"
                    placeholder="Enter your password" 
                    required
                />
            </div>
        </div>
        <p v-if="error" class="has-text-danger">{{ error }}</p>
      </section>

      <footer class="modal-card-foot">
        
        <!-- Buttons -->
        <div v-if="!message" class="button-container">
            <button class="button is-primary" @click="handleAuth">
                {{ authMode === 'login' ? 'Login' : 'Sign Up' }}
            </button>
            <button class="button ml-2" @click="$emit('update:showAuthModal', false)">Cancel</button>
        </div>
        
        <!-- Message -->
        <div v-if="message" class="message">
            {{ message }}
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>

.modal-card {
  width: 400px;
  max-width: 90%;
}

.message {
    color: darkgreen;
}
</style>
