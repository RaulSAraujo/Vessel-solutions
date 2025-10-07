<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { DrinkIngredients } from "~/types/drinks";

defineProps<{
  drinkIngredients: DrinkIngredients[];
}>();

const emit = defineEmits(["delete"]);

const api = useDrinksApi();

const loading = ref(false);

const headers = [
  { title: "Ações", key: "actions", maxWidth: 60 },
  { title: "Nome", key: "ingredients.name", maxWidth: 90 },
  { title: "Quantidade", key: "quantity" },
  { title: "Uni.", key: "ingredients.units.abbreviation" },
];

async function deleteIngredient(drinkIngredient: DrinkIngredients) {
  if (drinkIngredient.id) {
    loading.value = true;

    const res = await api.deleteDrinkIngredient(drinkIngredient.id);

    if (!res) {
      loading.value = false;
      return;
    }

    loading.value = false;
  }

  emit("delete", drinkIngredient);
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="drinkIngredients"
    :disable-sort="true"
    :hide-default-footer="true"
  >
    <template #item.actions="{ item }">
      <v-btn
        color="red"
        size="small"
        variant="plain"
        icon="mdi-delete"
        @click="deleteIngredient(item)"
      />
    </template>

    <template #item.ingredients.name="{ item }">
      <UiTextWithTooltip :text="item.ingredients.name" />
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
  </v-data-table>
</template>
