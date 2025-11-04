<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { FormDrink } from "~/types/drinks";
import type { FormDrinkIngredients } from "~/types/drink-ingredient";
// components
import Form from "./form/index.vue";

type DrinkWithIngredients = FormDrink & {
  drink_ingredients: FormDrinkIngredients[];
};

defineProps<{
  units: Units[];
}>();

const emit = defineEmits(["close"]);

const api = useDrinksApi();

const loading = ref(false);

async function creation(events: DrinkWithIngredients) {
  if (events.drink_ingredients.length === 0) {
    return $toast().error("Adicione pelo menos um ingrediente.");
  }

  loading.value = true;

  const drink = await api.createDrink(events);

  if (!drink?.id) {
    loading.value = false;
    return;
  }

  const drinkIngredients = await api.upsertDrinkIngredients(
    drink.id,
    events.drink_ingredients
  );

  if (!drinkIngredients) {
    loading.value = false;
    return;
  }

  useDrinksStore().addItem(drink);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card
      id="tutorial-drinks-form"
      rounded="t-xl"
      title="Nova receita"
      prepend-icon="mdi-bookmark-outline"
    >
      <v-card-text>
        <Form
          :loading="loading"
          :units="units"
          @submit="creation"
        />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
