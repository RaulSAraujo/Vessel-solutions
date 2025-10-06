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
      <v-icon size="28" class="mr-2" icon="mdi-food-variant" />
      <span class="text-h5">Ingredientes</span>
    </div>

    <IngredientsFilter v-model="filterDrawer" />

    <IngredientsTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />

    <IngredientsCreation
      v-model="dialogCreation"
      @close="dialogCreation = false"
    />

    <IngredientsUpdate v-model="dialogUpdate" @close="dialogUpdate = false" />

    <IngredientsDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
