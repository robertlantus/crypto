
<template>

<!-- Login / Signup Modal -->

<div v-if="showAuthModal" class="modal is-active">
        <div class="modal-background" @click="closeAuthModal"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ authMode === 'login' ? 'Login' : 'Sign Up' }}
                </p>
                <button class="delete" aria-label="close" @click="closeAuthModal"></button>
            </header>

            <section class="modal-card-body">
                <form @submit.prevent="handleAuth">
                    <div class="field">
                        <label class="label">Username</label>
                        <div class="control">
                            <input 
                                type="text" 
                                class="input" 
                                v-model="form.username"
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
                                v-model="form.email"
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
                                v-model="form.password"
                                placeholder="Enter your password" 
                                required
                            />
                        </div>
                    </div>
                    <div class="field">
                        <button class="button is-primary" type="submit">
                            {{ authMode === 'login' ? 'Login' : 'Sign Up' }}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    </div>

</template>


<script setup>

import { ref } from 'vue';
import { signupUser, loginUser } from '../../services/authService';

// Props
// const showAuthModal = ref(false);   // Modal visibility (v-model)
// const authMode = ref('login');      // 'login' or 'signup'

// Props
defineProps({
    showAuthModal: {
        type: Boolean,  // Receives the modal visibility state
        required: true
    },
    authMode: {
        type: String,       // Receives the mode ('login' or 'signup')
        required: true,
        validator: (value) => ['login', 'signup'].includes(value)   // Validates 'login' or 'signup'
    }
});

// Emit function to update parent
const emit = defineEmits(['update:showAuthModal', 'authSuccess']);

// State
const email = ref('');
const password = ref('');
const error = ref('');

// Form data
// const form = ref({
//     username: '',
//     email: '',
//     password: ''
// });

// const handleAuth = async () => {
    
//     try {
//         const userData = { ...form.value };

//         const response = 
//             authMode === 'login'
//             ? await loginUser({ username: userData.username, password: userData.password })
//             : await signupUser(userData);

//         alert(response.data.message); // Show a success message

//         if (authMode === 'login') {
//             localStorage.setItem('token', response.data.token)  // Store JWT token
//         }

//         // Emit close event
//         closeAuthModal();

//     } catch (error) {
//         console.error(error);
//         alert(error.response?.data?.message || 'An error occurred. Please try again.');
//     }
// }

// Handle authentication
const handleAuth = async () => {
    try {
        if (authMode === 'login') {
            await loginUser({ username: userData.username, password: userData.password });
            console.log('Logging in:', email.value);
        } else if (authMode === 'signup') {
            await signupUser(userData);
            console.log('Signing up:', email.value);
        }
        // On success, emit the event to close the modal
        emit('update:showAuthModal', false);
        emit('authSuccess');

    } catch (err) {
        error.value = err.message || 'Authentication failed';
    }
};

// Watch for changes to close modal when `showAuthModal` is false
watch(() => showAuthModal, (newValue) => {
    if (!newValue) {
        email.value = '';
        password.value = '';
        error.value = '';
    }
});

// const closeAuthModal = () => {
//     resetForm();
//     emit('update:showAuthModal', false); // Notify the parent to close the modal
// };

// const resetForm = () => {
//     form.value = {
//         username: '',
//         email: '',
//         password: ''
//     };
// };

</script>