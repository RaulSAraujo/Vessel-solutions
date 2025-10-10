<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { TableDrinkIngredients } from "~/types/drink-ingredient";

defineProps<{
  drinkIngredients: TableDrinkIngredients[];
}>();

const emit = defineEmits(["delete"]);

const api = useDrinksApi();

const loading = ref(false);

const headers = [
  { title: "Ações", key: "actions", maxWidth: 60 },
  { title: "Nome", key: "name", maxWidth: 90 },
  { title: "Quantidade", key: "quantity" },
  { title: "Unid. base", key: "unit_id" },
  { title: "C.R.U.B", key: "real_cost_per_base_unit" },
  { title: "Custo unitário", key: "cost_unit" },
];

async function deleteIngredient(item: TableDrinkIngredients) {
  if (item.drink_Ingredient_id) {
    loading.value = true;

    const res = await api.deleteDrinkIngredient(item.drink_Ingredient_id);

    if (!res) {
      loading.value = false;
      return;
    }

    loading.value = false;
  }

  emit("delete", item);
}

function calculeCostUnit(item: TableDrinkIngredients) {
  if (!item.real_cost_per_base_unit) return;

  return (item.real_cost_per_base_unit * item.quantity)
    .toFixed(2)
    .replaceAll(".", ",");
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="drinkIngredients"
    :disable-sort="true"
    :hide-default-footer="true"
  >
    <template #header.real_cost_per_base_unit>
      <span class="text-right">
        C.R.U.B

        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              icon="mdi-information-outline"
              color="grey"
            />
          </template>

          <template #default>
            <p>Custo Real Unidade Base</p>
          </template>
        </v-tooltip>
      </span>
    </template>

    <template #item.actions="{ item }">
      <v-btn
        color="red"
        size="small"
        variant="plain"
        icon="mdi-delete"
        :loading="loading"
        @click="deleteIngredient(item)"
      />
    </template>

    <template #item.name="{ item }">
      <UiTextWithTooltip :text="item.name" />
    </template>

    <template #item.quantity="{ item }">
      <UiNumberField
        v-model="item.quantity"
        :min="1"
        :step="0.01"
        :precision="2"
        control-variant="stacked"
      />
    </template>

    <template #item.real_cost_per_base_unit="{ item }">
      <span class="mr-2">R$ {{ item.real_cost_per_base_unit }}</span>
    </template>

    <template #item.cost_unit="{ item }">
      <span class="mr-2">R$ {{ calculeCostUnit(item) }}</span>
    </template>
  </v-data-table>
</template>
