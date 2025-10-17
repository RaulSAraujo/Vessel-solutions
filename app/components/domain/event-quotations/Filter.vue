<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

const store = useEventQuotationsStore();
const { activeFilters } = storeToRefs(store);

const filterDefinitions = ref<FilterDefinition[]>([
  {
    key: "client_name",
    label: "Nome do Cliente",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "client_email",
    label: "Email do Cliente",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "client_phone",
    label: "Telefone",
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
      { value: "draft", text: "Rascunho" },
      { value: "sent", text: "Enviado" },
      { value: "approved", text: "Aprovado" },
      { value: "rejected", text: "Rejeitado" },
      { value: "converted", text: "Convertido" },
    ],
    layout: {
      clearable: true,
    },
  },
  {
    key: "start_time",
    label: "Data do Evento",
    type: "date",
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
      @clear="store.fetchEventQuotations"
      @search="store.fetchEventQuotations"
    />
  </v-navigation-drawer>
</template>
