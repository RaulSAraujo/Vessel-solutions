<script setup lang="ts">
import { useGetUnits } from "~/composables/api/useGetUnits";

definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);

const { data: units, status } = useGetUnits({ lazy: true });
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-glass-cocktail" />
      <span class="text-h5">Bebidas</span>
    </div>

    <DrinksFilter v-model="filterDrawer" />

    <DrinksTable
      v-if="status === 'success'"
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />

    <DrinksCreation
      v-model="dialogCreation"
      :units="units"
      @close="dialogCreation = false"
    />

    <DrinksUpdate
      v-model="dialogUpdate"
      :units="units"
      @close="dialogUpdate = false"
    />

    <DrinksDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
