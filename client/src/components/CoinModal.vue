
<template>

    <div v-if="show" class="modal is-active">
        <div class="modal-background" @click="onClose"></div>
        <div class="modal-card">

            <header class="modal-card-head">
                <p class="modal-card-title">Coin Details</p>
            <button class="delete" aria-label="close" @click="onClose"></button>
            </header>

            <section class="modal-card-body">
                <CoinDetails :id="coinId" />
            </section>

            <footer class="modal-card-foot">
                <button @click="onClose" class="button is-danger">Close</button>
            </footer>
        </div>
    </div>

</template>

<script>

import CoinDetails from './CoinDetails.vue';

export default {
    name: 'CoinModal',
    components: { CoinDetails },
    props: {
        show: {
            type: Boolean,
            required: true
        },
        coinId: {
            type: String,
            required: true
        }
    },
    emits: ['close'],
    setup(_, { emit }) {
        const onClose = () => {
            emit('close')
        };

        return { onClose };
    }
};

</script>