<script lang="ts" setup>
import type { Datum } from "~/types/ingredients";

const props = defineProps<{
  units: Units[];
}>();

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
  "openQuotation",
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
  { title: "Custo unit.", key: "unit_cost", sortable: false },
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

function handleOpenQuotation(ingredient: Datum) {
  selectedIngredient.value = ingredient;
  emit("openQuotation");
}

function calculateUnitCost(item: Datum) {
  if (!item.quotations) return 0;

  const purchasePrice = item.quotations?.purchase_price || 0;
  const purchaseQuantity = item.quotations?.purchase_quantity || 0;
  const purchaseUnitId = item.quotations?.purchase_unit_id || 0;
  const ingredientBaseUnitId = item.unit_id;
  const wastagePercentage = item.wastage_percentage;

  const ingredientDetails: IngredientDetails = {
    unit_weight_g: item.unit_weight_g,
    unit_volume_ml: item.unit_volume_ml,
  };

  // Converter a quantidade de compra para a unidade base do ingrediente
  const convertedQuantityToBaseUnit = convertQuantity(
    purchaseQuantity,
    purchaseUnitId,
    ingredientBaseUnitId,
    props.units,
    ingredientDetails
  );

  if (convertedQuantityToBaseUnit <= 0) {
    return 0;
  }

  // Calcular o Custo Base por Unidade Base (sem desperdício)
  const costPerBaseUnitRaw = purchasePrice / convertedQuantityToBaseUnit;

  // Aplicar o Desperdício
  const realCostPerBaseUnit =
    costPerBaseUnitRaw * (1 + wastagePercentage / 100);

  return parseFloat(realCostPerBaseUnit.toFixed(4));
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
      >
        <template #items>
          <v-list-item
            title="Selecionar cotação"
            base-color="success"
            @click="handleOpenQuotation(item)"
          >
            <template #prepend>
              <v-icon size="small" start icon="mdi-currency-usd" />
            </template>
          </v-list-item>
        </template>
      </UiTableActions>
    </template>

    <template #item.units.name="{ item }">
      {{ item.units.name }} ({{ item.units.abbreviation }})
    </template>

    <template #item.unit_cost="{ item }">
      {{ calculateUnitCost(item) }}
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </UiTable>
</template>
