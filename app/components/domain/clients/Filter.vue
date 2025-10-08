<script lang="ts" setup>
import type { MaskInputOptions } from "maska";
import type { FilterDefinition } from "~/types/filter";

const store = useClientsStore();
const { activeFilters } = storeToRefs(store);

const options = reactive<MaskInputOptions>({
  mask: ["###.###.###-##", "##.###.###/####-##"],
  eager: true,
});

const optionsPhone = reactive<MaskInputOptions>({
  mask: ["(##) ####-####", "(##) #####-####"],
  eager: true,
});

const filterDefinitions = ref<FilterDefinition[]>([
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
    key: "document",
    label: "Documento",
    type: "string",
    op: "eq",
    layout: {
      mask: options,
      clearable: true,
    },
  },
  {
    key: "phone",
    label: "Telefone",
    type: "string",
    op: "eq",
    layout: {
      mask: optionsPhone,
      clearable: true,
    },
  },
  {
    key: "client_addresses.zip_code",
    label: "CEP",
    type: "string",
    op: "eq",
    layout: {
      mask: "#####-###",
      clearable: true,
    },
  },
  {
    key: "client_addresses.city",
    label: "Cidade",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "client_addresses.state",
    label: "UF",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "client_addresses.neighborhood",
    label: "Bairro",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "client_addresses.street",
    label: "Rua",
    type: "string",
    op: "ilike",
    layout: {
      clearable: true,
    },
  },
  {
    key: "client_addresses.number",
    label: "N°",
    type: "string",
    op: "ilike",
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
      @clear="store.fetchClients"
      @search="store.fetchClients"
    />
  </v-navigation-drawer>
</template>
