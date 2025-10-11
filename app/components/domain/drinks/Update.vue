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

const store = useDrinksStore();
const { selectedDrink } = storeToRefs(store);

const loading = ref(false);

async function update(events: Datum) {
  if (!selectedDrink.value) return;

  loading.value = true;

  const drink = await api.updateDrink(selectedDrink.value?.id, events);

  if (!drink?.id) {
    loading.value = false;
    return;
  }

  // const item = { ...drink, drink_ingredients: [] } as Datum;

  // const update = events.drink_ingredients.filter((e) => e.id);
  // if (update.length > 0) {
  //   const drinkIngredients = await api.updateDrinkIngredients(update);

  //   if (!drinkIngredients) {
  //     loading.value = false;
  //     return;
  //   }

  //   item.drink_ingredients.push(...update);
  // }

  // const create = events.drink_ingredients.filter((e) => !e.id);
  // if (create.length > 0) {
  //   const drinkIngredients = await api.createDrinkIngredients(drink.id, create);

  //   if (!drinkIngredients) {
  //     loading.value = false;
  //     return;
  //   }

  //   item.drink_ingredients.push(...drinkIngredients);
  // }

  // store.updateItem(item);

  // loading.value = false;

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
        />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
