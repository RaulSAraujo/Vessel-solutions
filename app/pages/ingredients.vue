<script setup lang="ts">
import { useFetchUnits } from "~/composables/api/useUnitsApi";

definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
const dialogQuotation = ref(false);

const { data: units, status } = useFetchUnits({ lazy: true });
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-food-variant" />
      <span class="text-h5">Ingredientes</span>
    </div>

    <IngredientsFilter
      v-if="status === 'success'"
      v-model="filterDrawer"
      :units="units"
    />

    <IngredientsTable
      v-if="status === 'success'"
      :units="units"
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
      @open-quotation="dialogQuotation = true"
    />

    <IngredientsCreation
      v-if="status === 'success'"
      v-model="dialogCreation"
      :units="units"
      @close="dialogCreation = false"
    />

    <IngredientsUpdate
      v-if="status === 'success'"
      v-model="dialogUpdate"
      :units="units"
      @close="dialogUpdate = false"
    />

    <IngredientsSelectQuotation v-model="dialogQuotation" />

    <IngredientsDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
