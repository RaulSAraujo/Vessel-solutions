<script lang="ts" setup>
import type { Datum } from "~/types/drinks";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
]);

const store = useDrinksStore();
const { page, itemsPerPage, items, totalItems, loading, selectedDrink } =
  storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Nome", key: "name", minWidth: 200 },
  { title: "Descrição", key: "description", maxWidth: 150 },
  { title: "Custo", key: "calculated_cost" },
  { title: "Preço venda", key: "selling_price", minWidth: 140 },
  { title: "Marg. Lucro (%)", key: "profit_margin_percentage", minWidth: 155 },
  { title: "Criado em", key: "created_at", minWidth: 120 },
  { title: "Atualizado em", key: "updated_at", minWidth: 150 },
];

function handleOpenUpdate(drink: Datum) {
  selectedDrink.value = drink;
  emit("openUpdate");
}

function handleOpenDelete(drink: Datum) {
  selectedDrink.value = drink;
  emit("openDelete");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de bebidas"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchDrinks"
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
        @click="store.fetchDrinks"
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

    <template #item.name="{ item }">
      <v-list-item
        :title="item.name"
        density="compact"
        lines="one"
        class="px-0"
      >
        <template #prepend>
          <v-avatar
            start
            size="28"
            color="grey"
            density="compact"
            class="mr-n2"
          >
            <v-icon color="white" size="16">mdi-image</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </template>

    <template #item.description="{ item }">
      <UiTextWithTooltip :text="item.description" />
    </template>

    <template #item.profit_margin_percentage="{ item }">
      {{ item.profit_margin_percentage.toFixed(1) }}
    </template>

    <template #item.calculated_cost="{ item }">
      {{ formatCurrency(item.calculated_cost) }}
    </template>

    <template #item.selling_price="{ item }">
      {{ formatCurrency(item.selling_price) }}
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
