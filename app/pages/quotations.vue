<script setup lang="ts">
import { useFetchUnits } from "~/composables/api/useUnitsApi";
import { useFetchSuppliers } from "~/composables/api/useSuppliersApi";
import { useFetchIngredients } from "~/composables/api/useIngredientsApi";

definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);
const dialogLinkToIngredient = ref(false);

const { data: units, status: unitsStatus } = useFetchUnits({ lazy: true });
const { data: suppliers, status: suppliersStatus } = useFetchSuppliers({
  lazy: true,
});
const { data: ingredients, status: ingredientsStatus } = useFetchIngredients({
  lazy: true,
});

function handleOpenLinkToIngredient() {
  dialogCreation.value = false;
  dialogLinkToIngredient.value = true;
}
</script>

<template>
  <v-container fluid>
    <div id="tutorial-quotations-header" class="d-flex flex-row align-center mb-4 text-primary">
      <v-icon size="28" class="mr-2" icon="mdi-handshake" />
      <span class="text-h5">Cotações</span>
    </div>

    <QuotationsFilter
      v-if="
        suppliersStatus === 'success' &&
        unitsStatus === 'success' &&
        ingredientsStatus === 'success'
      "
      v-model="filterDrawer"
      :units="units"
      :ingredients="ingredients"
      :suppliers="suppliers"
    />

    <div id="tutorial-quotations-table">
    <QuotationsTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />
    </div>

    <QuotationsCreation
      v-if="
        suppliersStatus === 'success' &&
        unitsStatus === 'success' &&
        ingredientsStatus === 'success'
      "
      v-model="dialogCreation"
      :units="units"
      :suppliers="suppliers"
      :ingredients="ingredients"
      @close="handleOpenLinkToIngredient"
    />

    <QuotationsLinkToIngredient
      v-model="dialogLinkToIngredient"
      @close="dialogLinkToIngredient = false"
    />

    <QuotationsUpdate
      v-if="
        suppliersStatus === 'success' &&
        unitsStatus === 'success' &&
        ingredientsStatus === 'success'
      "
      v-model="dialogUpdate"
      :units="units"
      :suppliers="suppliers"
      :ingredients="ingredients"
      @close="dialogUpdate = false"
    />

    <QuotationsDelete v-model="dialogDelete" @close="dialogDelete = false" />
  </v-container>
</template>
