<script lang="ts" setup>
// componentes
import type { Datum } from "~/types/quotations";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
]);

const store = useQuotationsStore();
const { page, itemsPerPage, items, totalItems, loading, selectedQuotation } =
  storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Fornecedor", key: "suppliers.name", maxWidth: 120 },
  { title: "Ingrediente", key: "ingredients.name", maxWidth: 150 },
  { title: "Preço", key: "purchase_price", minWidth: 100 },
  { title: "Quantidade", key: "purchase_quantity" },
  { title: "Unidade", key: "units.name", minWidth: 100, maxWidth: 130 },
  { title: "Data da cotação", key: "quotation_date", minWidth: 160 },
  { title: "Criado em", key: "created_at", minWidth: 120 },
  { title: "Atualizado em", key: "updated_at", minWidth: 150 },
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

    <template #item.suppliers.name="{ item }">
      <UiTextWithTooltip :text="item.suppliers.name" />
    </template>

    <template #item.ingredients.name="{ item }">
      <UiTextWithTooltip :text="item.ingredients.name" />
    </template>

    <template #item.units.name="{ item }">
      <UiTextWithTooltip
        :text="`${item.units.name} (${item.units.abbreviation})`"
      />
    </template>

    <template #item.purchase_price="{ item }">
      {{ formatCurrency(item.purchase_price) }}
    </template>

    <template #item.quotation_date="{ item }">
      {{ formatDate(item.quotation_date) }}
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
