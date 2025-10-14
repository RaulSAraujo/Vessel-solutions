<script setup lang="ts">
import { useFetchUnits } from "~/composables/api/useUnitsApi";
import { useFetchDrinkCategories } from "~/composables/api/useDrinksApi";

definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);

const { data: units, status: unitsStatus } = useFetchUnits({ lazy: true });

const { data: categories, status: categoriesStatus } = useFetchDrinkCategories({
  lazy: true,
});
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-glass-cocktail" />
      <span class="text-h5">Bebidas</span>
    </div>

    <DrinksFilter
      v-if="categoriesStatus === 'success'"
      v-model="filterDrawer"
      :categories="categories"
    />

    <DrinksTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />

    <DrinksCreation
      v-if="unitsStatus === 'success' && categoriesStatus === 'success'"
      v-model="dialogCreation"
      :units="units"
      :categories="categories"
      @close="dialogCreation = false"
    />

    <DrinksUpdate
      v-if="unitsStatus === 'success' && categoriesStatus === 'success'"
      v-model="dialogUpdate"
      :units="units"
      :categories="categories"
      @close="dialogUpdate = false"
    />

    <DrinksDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
