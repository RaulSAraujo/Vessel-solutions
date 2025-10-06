<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

const store = useQuotationStore();
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
    key: "created_at",
    label: "Criado em",
    type: "date",
    op: "eq",
    layout: {
      clearable: true,
      multiple: true,
    },
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
