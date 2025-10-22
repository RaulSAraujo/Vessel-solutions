<script lang="ts" setup>
import type { FilterDefinition } from "~/types/filter";

const store = useEventsStore();
const { activeFilters } = storeToRefs(store);

const filterDefinitions = ref<FilterDefinition[]>([
  {
    key: "clients.name",
    label: "Nome do Cliente",
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
      { value: "proposal", text: "Proposta" },
      { value: "confirmed", text: "Confirmado" },
      { value: "in_progress", text: "Em andamento" },
      { value: "completed", text: "Concluído" },
      { value: "cancelled", text: "Cancelado" },
      { value: "purchase", text: "Comprar" },
    ],
    layout: {
      clearable: true,
    },
  },
  {
    key: "audience_profile",
    label: "Perfil da Audiência",
    type: "array",
    op: "eq",
    options: [
      { value: "casual", text: "Casual" },
      { value: "corporate", text: "Corporativo" },
      { value: "premium", text: "Premium" },
    ],
    layout: {
      clearable: true,
    },
  },
  {
    key: "location",
    label: "Localização",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "start_time",
    label: "Data de Início",
    type: "date",
    op: "eq",
    layout: {
      clearable: true,
    },
  },
  {
    key: "end_time",
    label: "Data de Fim",
    type: "date",
    op: "eq",
    layout: {
      clearable: true,
    },
  },
  {
    key: "guest_count",
    label: "Número de Convidados",
    type: "number",
    op: "between",
    layout: {
      min: 0,
      max: 1000,
      step: 1,
    },
  },
  {
    key: "total_cost",
    label: "Custo Total",
    type: "currency",
    op: "between",
    defaultValue: [0, 100000],
    layout: {
      min: 0,
      max: 100000,
      step: 0.01,
    },
  },
  {
    key: "total_revenue",
    label: "Receita Total",
    type: "currency",
    op: "between",
    defaultValue: [0, 100000],
    layout: {
      min: 0,
      max: 100000,
      step: 0.01,
    },
  },
  {
    key: "profit_margin",
    label: "Margem de Lucro (%)",
    type: "number",
    op: "between",
    layout: {
      min: 0,
      max: 100,
      step: 0.1,
    },
  },
  {
    key: "distance",
    label: "Distância (km)",
    type: "number",
    op: "between",
    layout: {
      min: 0,
      max: 1000,
      step: 0.1,
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
