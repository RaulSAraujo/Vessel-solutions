<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

const store = useEventsStore();
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
    key: "phone",
    label: "Telefone",
    type: "string",
    op: "eq",
    layout: {
      clearable: true,
    },
  },
  {
    key: "email",
    label: "Email",
    type: "string",
    op: "eq",
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
      @clear="store.fetchEvents"
      @search="store.fetchEvents"
    />
  </v-navigation-drawer>
</template>
