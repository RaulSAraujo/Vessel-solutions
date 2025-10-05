<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-account-group" />
      <span class="text-h5">Fornecedores</span>
    </div>

    <SupplierFilter v-model="filterDrawer" />

    <SupplierTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />

    <SupplierCreation
      v-model="dialogCreation"
      @close="dialogCreation = false"
    />

    <SupplierUpdate v-model="dialogUpdate" @close="dialogUpdate = false" />

    <SupplierDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
