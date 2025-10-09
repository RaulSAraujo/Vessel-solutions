<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

const props = defineProps<{
  units: Units[];
}>();

const store = useIngredientsStore();
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
    key: "unit_id",
    label: "Unidade",
    type: "array",
    op: "eq",
    options: props.units?.map((u) => ({ text: u.name, value: u.id })),
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
