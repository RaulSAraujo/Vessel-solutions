<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";
import type { Datum as Supplier } from "~/types/suppliers";
import type { Datum as Ingredient } from "~/types/ingredients";

const props = defineProps<{
  units: Units[];
  suppliers: Supplier[];
  ingredients: Ingredient[];
}>();

const store = useQuotationsStore();
const { activeFilters } = storeToRefs(store);

const filterDefinitions = ref<FilterDefinition[]>([
  {
    key: "suppliers.name",
    label: "Fornecedores",
    type: "array",
    op: "eq",
    options: props.suppliers?.map((u) => ({ text: u.name, value: u.name })),
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
    options: props.ingredients?.map((u) => ({ text: u.name, value: u.name })),
    layout: {
      clearable: true,
      combobox: true,
    },
  },
  {
    key: "units.name",
    label: "Unidade",
    type: "array",
    op: "eq",
    options: props.units?.map((u) => ({ text: u.name, value: u.name })),
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
