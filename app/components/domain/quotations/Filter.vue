<script lang="ts" setup>
import { useIngredientsApi } from "~/composables/api/useIngredientsApi";
import { useQuotationsApi } from "~/composables/api/useQuotationsApi";
import type { FilterDefinition } from "~/types/filter";

const store = useQuotationsStore();
const { activeFilters } = storeToRefs(store);

const units = await useIngredientsApi().getUnits();
const suppliers = await useQuotationsApi().getSuppliers();
const ingredients = await useQuotationsApi().getIngredients();

const filterDefinitions = ref<FilterDefinition[]>([
  {
    key: "suppliers.name",
    label: "Fornecedores",
    type: "array",
    op: "eq",
    options: suppliers?.map((u) => ({ text: u.name, value: u.name })),
    layout: {
      clearable: true,
      combobox: true,
    },
  },
  {
    key: "ingredients.name",
    label: "Ingredientes",
    type: "array",
    op: "eq",
    options: ingredients?.map((u) => ({ text: u.name, value: u.name })),
    layout: {
      clearable: true,
      combobox: true,
    },
  },
  {
    key: "ingredients.units.name",
    label: "Unidade",
    type: "array",
    op: "eq",
    options: units?.map((u) => ({ text: u.name, value: u.name })),
    layout: {
      clearable: true,
    },
  },
  {
    key: "purchase_price",
    label: "Preço de Compra",
    type: "currency",
    op: "between",
  },
]);
</script>

<template>
  <v-navigation-drawer temporary location="right" width="280" class="pa-2">
    <UiFilter
      v-model="activeFilters"
      :filter-definitions="filterDefinitions"
      @clear="store.fetchQuotations"
      @search="store.fetchQuotations"
    />
  </v-navigation-drawer>
</template>
