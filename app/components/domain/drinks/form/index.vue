<script setup lang="ts">
import { drinkSchema } from "~/schemas/drink";

import type { Datum, FormDrink, DrinkIngredients } from "~/types/drinks";
import type { Datum as IngredientWithRelations } from "~/types/ingredients";

// components
import Table from "./Table.vue";
import FindIngredient from "./FindIngredient.vue";

const props = defineProps<{
  drink?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const drinkIngredients = ref<DrinkIngredients[]>([]);
const selectedIngredient = ref<string | IngredientWithRelations | null>(null);

const { handleSubmit, errors } = useForm<FormDrink>({
  validationSchema: drinkSchema,
});

const { value: name } = useField<string>("name");
const { value: type } = useField<string>("type");

const onSubmit = handleSubmit((values) => {
  emit("submit", {
    ...values,
    drink_ingredients: drinkIngredients.value,
  });
});

watch(selectedIngredient, async () => {
  if (selectedIngredient.value && typeof selectedIngredient.value == "object") {
    drinkIngredients.value.push({
      quantity: 1,
      ingredients: selectedIngredient.value,
    });

    selectedIngredient.value = null;
  }
});

onMounted(async () => {
  if (props.drink) {
    name.value = props.drink.name;
    type.value = props.drink.type;
    drinkIngredients.value = props.drink.drink_ingredients;
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiTextField
          v-model="name"
          v-maska="'Ax'"
          label="Nome do drink"
          prepend-inner-icon="mdi-glass-cocktail"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="type"
          v-maska="'Ax'"
          label="Tipo do drink"
          prepend-inner-icon="mdi-information-variant"
          :error-messages="errors.type"
        />
      </v-col>

      <v-col cols="12">
        <FindIngredient v-model="selectedIngredient" />
      </v-col>

      <v-col cols="12">
        <Table
          :drink-ingredients="drinkIngredients"
          @delete="drinkIngredients.splice(drinkIngredients.indexOf($event), 1)"
        />
      </v-col>

      <v-col cols="12" class="d-flex justify-center">
        <v-btn type="submit" color="primary" block :loading="loading">
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
