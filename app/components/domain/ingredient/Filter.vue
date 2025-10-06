<script lang="ts" setup>
import { useIngredientApi } from "~/composables/api/useIngredientApi";
import type { FilterDefinition } from "~/types/filter";

const store = useIngredientStore();
const { activeFilters } = storeToRefs(store);

const units = await useIngredientApi().getUnits();

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
    key: "unit_id",
    label: "Unidade",
    type: "array",
    op: "eq",
    options: units?.map((u) => ({ text: u.name, value: u.id })),
    layout: {
      clearable: true,
    },
  },
]);
</script>

<template>
  <v-navigation-drawer temporary location="right" width="280" class="pa-2">
    <UiFilter
      v-model="activeFilters"
      :filter-definitions="filterDefinitions"
      @clear="store.fetchIngredients"
      @search="store.fetchIngredients"
    />
  </v-navigation-drawer>
</template>
