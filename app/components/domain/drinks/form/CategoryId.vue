<script lang="ts" setup>
import type { DrinkCategories } from "~/types/drink-categories";

defineProps<{ categories: DrinkCategories[] }>();

const search = ref<string>("");
</script>

<template>
  <UiComboboxField
    v-model:search="search"
    label="Categoria"
    :items="categories"
    item-value="id"
    item-title="name"
    hide-details="auto"
    prepend-inner-icon="mdi-information-variant"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          No results matching "<strong>{{ search }}</strong
          >". Press <kbd>enter</kbd> to create a new one
        </v-list-item-title>
      </v-list-item>
    </template>
  </UiComboboxField>
</template>
