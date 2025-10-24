<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

// Usar store diretamente
const store = usePurchaseListStore();
const { activeFilters } = storeToRefs(store);

const filterDefinitions = ref<FilterDefinition[]>([
  {
    key: "ingredients.name",
    label: "Ingrediente",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "status",
    label: "Status",
    type: "array",
    op: "eq",
    options: [
      { text: "Pendente", value: "pending" },
      { text: "Comprado", value: "purchased" },
      { text: "Cancelado", value: "cancelled" },
    ],
    layout: {
      clearable: true,
    },
  },
  {
    key: "quantity_needed",
    label: "Quantidade",
    type: "currency",
    op: "between",
    defaultValue: [0, 1000],
    layout: {
      min: 0,
      max: 1000,
    },
  },
  {
    key: "estimated_cost",
    label: "Custo Estimado",
    type: "currency",
    op: "between",
    defaultValue: [0, 10000],
    layout: {
      min: 0,
      max: 10000,
      step: 0.01,
    },
  },
]);
</script>

<template>
  <v-navigation-drawer temporary location="right" width="280" class="pa-2">
    <UiFilter
      v-model="activeFilters"
      :filter-definitions="filterDefinitions"
      @clear="store.fetchPurchaseList"
      @search="store.fetchPurchaseList"
    />
  </v-navigation-drawer>
</template>
