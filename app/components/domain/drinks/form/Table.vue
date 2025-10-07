<script lang="ts" setup>
import type { DrinkIngredients } from "~/types/drinks";

defineProps<{
  ingredients: DrinkIngredients[];
}>();

defineEmits(["delete"]);

const headers = [
  { title: "Ações", key: "actions", maxWidth: 60 },
  { title: "Nome", key: "ingredients.name", maxWidth: 90 },
  { title: "Quantidade", key: "quantity" },
  { title: "Uni.", key: "ingredients.units.abbreviation" },
];
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="ingredients"
    :disable-sort="true"
    :hide-default-footer="true"
  >
    <template #item.actions="{ item }">
      <v-icon
        color="red"
        size="small"
        icon="mdi-delete"
        @click="$emit('delete', item)"
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
