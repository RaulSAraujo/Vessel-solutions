<script lang="ts" setup>
// componentes
import type { Datum } from "~/types/suppliers";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
]);

const store = useSuppliersStore();
const { page, itemsPerPage, items, totalItems, loading, selectedSupplier } =
  storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Nome", key: "name" },
  { title: "Telefone", key: "phone" },
  { title: "E-mail", key: "email" },
  { title: "Observação", key: "observation", maxWidth: 150 },
  { title: "Criado em", key: "created_at" },
  { title: "Atualizado em", key: "updated_at" },
];

function handleOpenUpdate(supplier: Datum) {
  selectedSupplier.value = supplier;
  emit("openUpdate");
}

function handleOpenDelete(supplier: Datum) {
  selectedSupplier.value = supplier;
  emit("openDelete");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de fornecedores"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchSuppliers"
  >
    <template #buttons>
      <v-btn
        id="tutorial-suppliers-btn-filter"
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-filter-variant"
        @click="$emit('openFilter')"
      />

      <v-btn
        id="tutorial-suppliers-btn-refresh"
        rounded="xl"
        color="grey"
        variant="text"
        icon="mdi-refresh"
        density="comfortable"
        @click="store.fetchSuppliers"
      />

      <v-btn
        id="tutorial-suppliers-btn-create"
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
        :tutorial-id="item.id === items[0]?.id ? 'tutorial-suppliers' : ''"
        @edit="handleOpenUpdate(item)"
        @delete="handleOpenDelete(item)"
      />
    </template>

    <template #item.observation="{ item }">
      <UiTextWithTooltip :text="item.observation" />
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
