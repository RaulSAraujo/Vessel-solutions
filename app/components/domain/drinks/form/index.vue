<script setup lang="ts">
import { drinkSchema } from "~/schemas/drink";

import type { Datum as Drink } from "~/types/drinks";
import type { Datum as Ingredient } from "~/types/ingredients";
import type { TableDrinkIngredients } from "~/types/drink-ingredient";

// components
import Table from "./Table.vue";
import FindIngredient from "./FindIngredient.vue";

const props = defineProps<{
  drink?: Drink | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const drinkIngredients = ref<TableDrinkIngredients[]>([]);
const selectedIngredient = ref<string | Ingredient | null>(null);

const { handleSubmit, errors } = useForm({
  validationSchema: drinkSchema,
});

const { value: name } = useField<string>("name");
const { value: categoryId } = useField<string | null>("category_id");
const { value: description } = useField<string | null>("description");

const onSubmit = handleSubmit((values) => {
  emit("submit", {
    ...values,
    drink_ingredients: drinkIngredients.value,
  });
});

watch(selectedIngredient, async () => {
  if (selectedIngredient.value && typeof selectedIngredient.value == "object") {
    drinkIngredients.value.push({
      ingredient_id: selectedIngredient.value.id,
      name: selectedIngredient.value.name,
      quantity: 0,
      unit_id: null,
      ingredient_unit_id: selectedIngredient.value.unit_id,
      real_cost_per_base_unit: selectedIngredient.value.real_cost_per_base_unit,
    });

    selectedIngredient.value = null;
  }
});

onMounted(async () => {
  if (props.drink) {
    name.value = props.drink.name;
    description.value = props.drink.description;
    categoryId.value = props.drink.category_id;
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12" md="3">
        <UiTextField
          v-model="name"
          v-maska="'Ax'"
          label="Nome"
          prepend-inner-icon="mdi-glass-cocktail"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12" md="3">
        <UiTextField
          v-model="categoryId"
          v-maska="'Ax'"
          label="Categoria"
          prepend-inner-icon="mdi-information-variant"
          :error-messages="errors.categoryId"
        />
      </v-col>

      <v-col cols="12" md="6">
        <UiTextField
          v-model="description"
          v-maska="'Ax'"
          label="Descrição"
          prepend-inner-icon="mdi-comment"
          :error-messages="errors.description"
        />
      </v-col>

      <v-col cols="12">
        <FindIngredient v-model="selectedIngredient" />
      </v-col>

      <v-col cols="12">
        <Table :drink-ingredients="drinkIngredients" />
        <!-- @delete="drinkIngredients.splice(drinkIngredients.indexOf($event), 1)" -->
      </v-col>

      <v-col cols="12" class="d-flex justify-center">
        <v-btn type="submit" color="primary" block :loading="loading">
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
