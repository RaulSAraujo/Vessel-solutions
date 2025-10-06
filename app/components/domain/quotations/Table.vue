<script lang="ts" setup>
// componentes
import type { Datum } from "~/types/quotation";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
]);

const store = useQuotationStore();
const { page, itemsPerPage, items, totalItems, loading, selectedQuotation } =
  storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Fornecedor", key: "suppliers.name" },
  { title: "Ingrediente", key: "ingredients.name" },
  { title: "Unidade", key: "ingredients.units.name" },
  { title: "Preço", key: "purchase_price" },
  { title: "Criado em", key: "created_at" },
  { title: "Atualizado em", key: "updated_at" },
];

function handleOpenUpdate(quotation: Datum) {
  selectedQuotation.value = quotation;
  emit("openUpdate");
}

function handleOpenDelete(quotation: Datum) {
  selectedQuotation.value = quotation;
  emit("openDelete");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de cotações"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchQuotations"
  >
    <template #buttons>
      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-filter-variant"
        @click="$emit('openFilter')"
      />

      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        icon="mdi-refresh"
        density="comfortable"
        @click="store.fetchQuotations"
      />

      <v-btn
        rounded="xl"
        color="grey"
        icon="mdi-plus"
        variant="text"
        density="comfortable"
        @click="$emit('openCreation')"
      />
    </template>

    <template #item.actions="{ item }">
      <UiTableActions
        @edit="handleOpenUpdate(item)"
        @delete="handleOpenDelete(item)"
      />
    </template>

    <template #item.ingredients.units.name="{ item }">
      {{ item.ingredients.units.name }} ({{
        item.ingredients.units.abbreviation
      }})
    </template>

    <template #item.purchase_price="{ item }">
      {{ formatCurrency(item.purchase_price) }}
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
