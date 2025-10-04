<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

const store = useClientStore();
const { activeFilters } = storeToRefs(store);

const eventFilters = ref<FilterDefinition[]>([
  {
    key: "name",
    label: "Nome do Cliente",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "email",
    label: "E-mail",
    type: "string",
    op: "eq",
    layout: {
      clearable: true,
    },
  },
  {
    key: "tax_id",
    label: "Documento",
    type: "string",
    op: "eq",
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
]);
</script>

<template>
  <v-navigation-drawer temporary location="right" width="280" class="pa-2">
    <UiFilter
      v-model="activeFilters"
      :event-filters="eventFilters"
      @clear="store.fetchClients"
      @search="store.fetchClients"
    />
  </v-navigation-drawer>
</template>
