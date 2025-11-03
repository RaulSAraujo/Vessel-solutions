<script setup lang="ts">
import { drinkSchema } from "~/schemas/drink";

import type { Datum as Drink } from "~/types/drinks";
import type { Datum as Ingredient } from "~/types/ingredients";
import type { TableDrinkIngredients } from "~/types/drink-ingredient";

// components
import Table from "./Table.vue";
import FindIngredient from "./FindIngredient.vue";
import { useDrinksApi } from "~/composables/api/useDrinksApi";

const props = defineProps<{
  units: Units[];
  loading: boolean;
  drink?: Drink | null;
}>();

const emit = defineEmits(["submit", "calculatedCost", "sellingPrice"]);

const api = useDrinksApi();

const loadingDrinkIngredients = ref(false);
const drinkIngredients = ref<TableDrinkIngredients[]>([]);
const selectedIngredient = ref<string | Ingredient | null>(null);

const { handleSubmit, errors } = useForm({
  validationSchema: drinkSchema,
});

const { value: name } = useField<string>("name");
const { value: imageUrl } = useField<string>("image_url");
const { value: description } = useField<string | null>("description");
const { value: profitMarginPercentage } = useField<number>(
  "profit_margin_percentage"
);

const onSubmit = handleSubmit((values) => {
  const calculatedCost = drinkIngredients.value.reduce(
    (a, b) => a + b.cost_unit,
    0
  );

  emit("submit", {
    ...values,
    calculated_cost: calculatedCost,
    selling_price: calculatedCost * (1 + profitMarginPercentage.value / 100),
    drink_ingredients: drinkIngredients.value.map((e) => ({
      ingredient_id: e.ingredient_id,
      quantity: e.quantity,
      unit_id: e.unit_id,
      new: e.new,
    })),
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
      new: true,
    });

    selectedIngredient.value = null;
  }
});

onMounted(async () => {
  if (props.drink) {
    name.value = props.drink.name;
    description.value = props.drink.description;
    imageUrl.value = props.drink.image_url || "";
    profitMarginPercentage.value = props.drink.profit_margin_percentage || 0;

    loadingDrinkIngredients.value = true;
    const res = await api.getDrinkIngredients(props.drink.id);

    if (res) {
      drinkIngredients.value = res.map((e) => {
        const costUnit = calculeCostUnit({
          ingredient_id: e.ingredients.id,
          name: e.ingredients.name,
          quantity: e.quantity,
          unit_id: e.unit_id,
          ingredient_unit_id: e.ingredients.unit_id,
          real_cost_per_base_unit: e.ingredients.real_cost_per_base_unit,
          unit_volume_ml: e.ingredients.unit_volume_ml,
          unit_weight_g: e.ingredients.unit_weight_g,
          cost_unit: 0,
        });

        return {
          ingredient_id: e.ingredients.id,
          name: e.ingredients.name,
          quantity: e.quantity,
          unit_id: e.unit_id,
          ingredient_unit_id: e.ingredients.unit_id,
          real_cost_per_base_unit: e.ingredients.real_cost_per_base_unit,
          unit_volume_ml: e.ingredients.unit_volume_ml,
          unit_weight_g: e.ingredients.unit_weight_g,
          cost_unit: parseFloat(costUnit.toFixed(2)),
          new: false,
        };
      });
    }

    loadingDrinkIngredients.value = false;
  }
});

function deleteItem(item: TableDrinkIngredients) {
  drinkIngredients.value.splice(drinkIngredients.value.indexOf(item), 1);
}

function calculeCostUnit(item: TableDrinkIngredients) {
  try {
    const converted = convertQuantity(
      item.quantity,
      item.ingredient_unit_id,
      item.unit_id!,
      props.units,
      {
        unit_volume_ml: item.unit_volume_ml,
        unit_weight_g: item.unit_weight_g,
      }
    );

    const itemCost = converted * (item.real_cost_per_base_unit || 0);

    return parseFloat(itemCost.toFixed(2));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return 0;
  }
}
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

      <v-col cols="12" md="6">
        <UiTextField
          v-model="description"
          v-maska="'Ax'"
          label="Descrição"
          prepend-inner-icon="mdi-comment"
          :error-messages="errors.description"
        />
      </v-col>

      <v-col cols="12" md="3">
        <UiTextField
          v-model="imageUrl"
          label="Url da Imagem"
          prepend-inner-icon="mdi-image"
          :error-messages="errors.image_url"
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

    <Table
      class="my-5"
      :units="units"
      :drink-id="drink?.id"
      :loading="loadingDrinkIngredients"
      :drink-ingredients="drinkIngredients"
      @delete="deleteItem"
    />

    <v-btn type="submit" color="primary" block :loading="loading">
      Salvar
    </v-btn>
  </v-form>
</template>
