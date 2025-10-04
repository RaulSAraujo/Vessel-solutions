<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const drawer = ref(false);
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-account-group" />
      <span class="text-h5">Gerenciamento de Clientes</span>
    </div>

    <ClientFilter v-model="drawer" />

    <ClientTable @open-creation="drawer = true" @open-filter="drawer = true" />
  </v-container>
</template>
