<script setup lang="ts">
import { useGetUnits } from "~/composables/api/useGetUnits";
import { useGetSuppliers } from "~/composables/api/useGetSuppliers";
import { useGetIngredients } from "~/composables/api/useGetIngredients";

definePageMeta({
  middleware: ["auth"],
});

const filterDrawer = ref(false);
const dialogCreation = ref(false);
const dialogUpdate = ref(false);
const dialogDelete = ref(false);

const { data: units, status: unitsStatus } = useGetUnits({ lazy: true });
const { data: suppliers, status: suppliersStatus } = useGetSuppliers({
  lazy: true,
});
const { data: ingredients, status: ingredientsStatus } = useGetIngredients({
  lazy: true,
});
</script>

<template>
  <v-container fluid>
    <div class="d-flex flex-row align-center mb-4 text-primary">
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

    <QuotationsTable
      @open-creation="dialogCreation = true"
      @open-update="dialogUpdate = true"
      @open-filter="filterDrawer = true"
      @open-delete="dialogDelete = true"
    />

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
      @close="dialogCreation = false"
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
