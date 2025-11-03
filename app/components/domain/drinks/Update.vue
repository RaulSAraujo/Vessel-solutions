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

const store = useDrinksStore();
const { selectedDrink } = storeToRefs(store);

const loading = ref(false);

async function update(events: DrinkWithIngredients) {
  if (!selectedDrink.value) return;

  loading.value = true;

  const drink = await api.updateDrink(selectedDrink.value?.id, events);

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

  store.updateItem(drink);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card
      rounded="xl"
      title="Atualizar receita"
      prepend-icon="mdi-bookmark-outline"
    >
      <v-card-text>
        <Form
          :drink="selectedDrink"
          :units="units"
          :loading="loading"
          @submit="update"
          @selling-price="selectedDrink!.selling_price = $event"
          @calculated-cost="selectedDrink!.calculated_cost = $event"
        />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
