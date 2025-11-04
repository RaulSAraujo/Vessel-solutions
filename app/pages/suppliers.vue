<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
</script>

<template>
  <v-container fluid>
    <div id="tutorial-suppliers-header" class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-truck-delivery-outline" />
      <span class="text-h5">Fornecedores</span>
    </div>

    <SuppliersFilter v-model="filterDrawer" />

    <div id="tutorial-suppliers-table">
    <SuppliersTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />
    </div>

    <SuppliersCreation
      v-model="dialogCreation"
      @close="dialogCreation = false"
    />

    <SuppliersUpdate v-model="dialogUpdate" @close="dialogUpdate = false" />

    <SuppliersDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
