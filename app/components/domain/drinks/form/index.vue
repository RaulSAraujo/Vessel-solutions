<script setup lang="ts">
import { drinkSchema } from "~/schemas/drink";

import type { Datum as Drink } from "~/types/drinks";
import type { Datum as Ingredient } from "~/types/ingredients";
import type { TableDrinkIngredients } from "~/types/drink-ingredient";

// components
import Table from "./Table.vue";
import FindIngredient from "./FindIngredient.vue";

const props = defineProps<{
  units: Units[];
  loading: boolean;
  drink?: Drink | null;
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
const { value: profitMarginPercentage } = useField<number>(
  "profit_margin_percentage"
);

const onSubmit = handleSubmit((values) => {
  emit("submit", {
    ...values,
    drink_ingredients: drinkIngredients.value,
  });
});

watch(selectedIngredient, async () => {
  if (selectedIngredient.value && typeof selectedIngredient.value == "object") {
    if (!selectedIngredient.value.current_quotation_id) {
      selectedIngredient.value = null;

      return $toast().error(
        "Erro: É necessário que o ingrediente tenha uma cotação ativa."
      );
    }

    drinkIngredients.value.push({
      ingredient_id: selectedIngredient.value.id,
      name: selectedIngredient.value.name,
      quantity: 0,
      unit_id: null,
      ingredient_unit_id: selectedIngredient.value.unit_id,
      real_cost_per_base_unit: selectedIngredient.value.real_cost_per_base_unit,
      unit_volume_ml: selectedIngredient.value.unit_volume_ml,
      unit_weight_g: selectedIngredient.value.unit_weight_g,
      cost_unit: 0,
    });

    selectedIngredient.value = null;
  }
});

onMounted(async () => {
  if (props.drink) {
    name.value = props.drink.name;
    description.value = props.drink.description;
    categoryId.value = props.drink.category_id;
    profitMarginPercentage.value = props.drink.profit_margin_percentage || 0;
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
          :error-messages="errors.category_id"
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
        <v-slider
          v-model="profitMarginPercentage"
          min="0"
          max="100"
          color="primary"
          track-color="grey"
          :thumb-label="true"
          hide-details="auto"
          thumb-color="primary"
          label="Margem de Lucro (%)"
          :error="!!errors.profit_margin_percentage"
          :error-messages="errors.profit_margin_percentage"
        />
      </v-col>
    </v-row>

    <FindIngredient v-model="selectedIngredient" class="mt-5" />

    <Table :units="units" :drink-ingredients="drinkIngredients" class="my-5" />
    <!-- @delete="drinkIngredients.splice(drinkIngredients.indexOf($event), 1)" -->

    <v-btn type="submit" color="primary" block :loading="loading">
      Salvar
    </v-btn>
  </v-form>
</template>
