<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";
import type { DrinkCategories } from "~/types/drink-categories";

const props = defineProps<{
  categories: DrinkCategories[];
}>();

const store = useDrinksStore();
const { activeFilters } = storeToRefs(store);

const filterDefinitions = ref<FilterDefinition[]>([
  {
    key: "name",
    label: "Nome",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "drink_categories.name",
    label: "Categoria",
    type: "array",
    op: "eq",
    options: props.categories?.map((u) => ({ text: u.name, value: u.name })),
    layout: {
      clearable: true,
    },
  },
  {
    key: "description",
    label: "Descrição",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "calculated_cost",
    label: "Preço de custo",
    type: "currency",
    op: "between",
    layout: {
      min: 0,
      max: 100,
      step: 0.01,
    },
  },
  {
    key: "selling_price",
    label: "Preço de venda",
    type: "currency",
    op: "between",
    layout: {
      min: 0,
      max: 100,
      step: 0.01,
    },
  },
  {
    key: "profit_margin_percentage",
    label: "Margem de lucro (%)",
    type: "currency",
    op: "between",
    layout: {
      min: 0,
      max: 100,
    },
  },
]);
</script>

<template>
  <v-navigation-drawer temporary location="right" width="280" class="pa-2">
    <UiFilter
      v-model="activeFilters"
      :filter-definitions="filterDefinitions"
      @clear="store.fetchDrinks"
      @search="store.fetchDrinks"
    />
  </v-navigation-drawer>
</template>
