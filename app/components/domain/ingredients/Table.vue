<script lang="ts" setup>
// componentes
import type { Datum } from "~/types/ingredients";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
]);

const store = useIngredientsStore();
const { page, itemsPerPage, items, totalItems, loading, selectedIngredient } =
  storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Nome", key: "name" },
  { title: "Unid.", key: "units.name" },
  { title: "Peso (g)", key: "unit_weight_g" },
  { title: "Vol. (ml)", key: "unit_volume_ml" },
  { title: "% Desperdício", key: "wastage_percentage" },
  { title: "Criado em", key: "created_at" },
  { title: "Atualizado em", key: "updated_at" },
];

function handleOpenUpdate(ingredient: Datum) {
  selectedIngredient.value = ingredient;
  emit("openUpdate");
}

function handleOpenDelete(ingredient: Datum) {
  selectedIngredient.value = ingredient;
  emit("openDelete");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de ingredientes"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchIngredients"
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
        @click="store.fetchIngredients"
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

    <template #item.units.name="{ item }">
      {{ item.units.name }} ({{ item.units.abbreviation }})
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
