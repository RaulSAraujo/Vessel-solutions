<script lang="ts" setup>
import type { DrinkCategories } from "~/types/drink-categories";

defineProps<{ categories: DrinkCategories[] }>();
</script>

<template>
  <UiComboboxField
    label="Categoria"
    :items="categories"
    item-value="id"
    item-title="name"
    hide-details="auto"
    prepend-inner-icon="mdi-information-variant"
  />
</template>
