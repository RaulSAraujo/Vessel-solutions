<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { Datum } from "~/types/drinks";
// components
import Form from "./form/index.vue";

defineProps<{
  units: Units[];
}>();

const emit = defineEmits(["close"]);

const api = useDrinksApi();

const loading = ref(false);

async function creation(events: Datum) {
  loading.value = true;

  const drink = await api.createDrink(events);

  if (!drink?.id) {
    loading.value = false;
    return;
  }

  // const drinkIngredients = await api.createDrinkIngredients(
  //   drink.id,
  // );

  // if (!drinkIngredients) {
  //   loading.value = false;
  //   return;
  // }

  // const item = { ...drink, drink_ingredients: drinkIngredients };

  // useDrinksStore().addItem(item);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card
      rounded="t-xl"
      title="Nova receita"
      prepend-icon="mdi-bookmark-outline"
    >
      <v-card-text>
        <Form :loading="loading" :units="units" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
