
<script>
import { ref, watch, toRefs } from 'vue';
import { signupUser, loginUser } from '../../services/authService';

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
    emits: ['update:showAuthModal', 'authSuccess'],
    setup(props, { emit }) {
        const { showAuthModal } = toRefs(props);
        const username = ref('');
        const email = ref('');
        const password = ref('');
        const error = ref('');

        const handleAuth = async () => {
            try {
                const userData = {
                    username: username.value, 
                    email: email.value,
                    password: password.value,
                };

                if (props.authMode === 'login') {
                    await loginUser({ username: userData.username, password: userData.password });
                    console.log('Logging in:', username.value);
                } else if (props.authMode === 'signup') {
                    await signupUser(userData);
                    console.log('Signing up:', username.value, email.value);
                }
                emit('update:showAuthModal', false);
                emit('authSuccess');
            } catch (err) {
                error.value = err.message || 'Authentication failed';
            }
        };

        watch(showAuthModal, (newValue) => {
            if (!newValue) {
                username.value = '';
                email.value = '';
                password.value = '';
                error.value = '';
            }
        });

        return {
            username,
            email,
            password,
            error,
            handleAuth,
        };
    },
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
        <button class="button is-primary" @click="handleAuth">
          {{ authMode === 'login' ? 'Login' : 'Sign Up' }}
        </button>
        <button class="button ml-2" @click="$emit('update:showAuthModal', false)">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-card {
  width: 400px;
  max-width: 90%;
}
</style>
