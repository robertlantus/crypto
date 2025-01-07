<template>
    <div v-if="show" class="modal is-active">
      <div class="modal-background" @click="$emit('close')"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Coin Details</p>
          <button class="delete" aria-label="close" @click="$emit('close')"></button>
        </header>
        <section class="modal-card-body">
          <CoinDetails :id="coinId" />
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" @click="$emit('close')">Close</button>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import CoinDetails from './CoinDetails.vue';
  import { defineProps, defineEmits } from 'vue';
  
  defineProps({
    show: {
      type: Boolean,
      required: true,
    },
    coinId: {
      type: String,
      required: true,
    },
  });
  
  defineEmits(['close']);
  </script>
  
  <style scoped>
  .modal-card {
    width: 400px;
    max-width: 90%;
  }
  </style>
  