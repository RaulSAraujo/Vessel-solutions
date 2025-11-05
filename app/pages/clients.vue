<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "subscription"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
</script>

<template>
  <v-container fluid>
    <div id="tutorial-clients-header" class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-account-group" />
      <span class="text-h5">Clientes</span>
    </div>

    <ClientsFilter v-model="filterDrawer" />

    <div id="tutorial-clients-table">
    <ClientsTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />
    </div>

    <ClientsCreation v-model="dialogCreation" @close="dialogCreation = false" />

    <ClientsUpdate v-model="dialogUpdate" @close="dialogUpdate = false" />

    <ClientsDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
