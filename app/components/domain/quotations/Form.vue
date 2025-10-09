<script setup lang="ts">
import { quotationSchema } from "~/schemas/quotation";

import type { Datum } from "~/types/quotations";
import type { Datum as Supplier } from "~/types/suppliers";
import type { Datum as Ingredient } from "~/types/ingredients";

const props = defineProps<{
  quotation?: Datum | null;
  loading: boolean;
  units: Units[];
  suppliers: Supplier[];
  ingredients: Ingredient[];
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: quotationSchema,
});

const { value: supplierId } = useField<string>("supplier_id");
const { value: ingredientId } = useField<string>("ingredient_id");
const { value: purchasePrice } = useField<number>("purchase_price");
const { value: purchaseQuantity } = useField<number>("purchase_quantity");
const { value: purchaseUnitId } = useField<number>("purchase_unit_id");
const { value: quotationDate } = useField<string | null>("quotation_date");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

onMounted(async () => {
  if (props.quotation) {
    supplierId.value = props.quotation.supplier_id;
    ingredientId.value = props.quotation.ingredient_id;
    purchasePrice.value = props.quotation.purchase_price;
    purchaseQuantity.value = props.quotation.purchase_quantity;
    purchaseUnitId.value = props.quotation.purchase_unit_id;
    quotationDate.value = formatDate(
      props.quotation.quotation_date,
      "DD/MM/YYYY"
    );
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiSelectField
          v-model="supplierId"
          :items="suppliers"
          item-value="id"
          item-title="name"
          label="Fornecedor"
          prepend-inner-icon="mdi-account"
          :error-messages="errors.supplier_id"
        />
      </v-col>

      <v-col cols="12">
        <UiSelectField
          v-model="ingredientId"
          :items="ingredients"
          item-value="id"
          item-title="name"
          label="Ingrediente"
          prepend-inner-icon="mdi-food-variant"
          :error-messages="errors.ingredient_id"
        />
      </v-col>

      <v-col cols="12">
        <UiNumberField
          v-model="purchasePrice"
          :min="0"
          :step="0.01"
          :precision="2"
          label="Preço de compra"
          :error-messages="errors.purchasePrice"
        />
      </v-col>

      <v-col cols="12">
        <UiNumberField
          v-model="purchaseQuantity"
          :min="0"
          :step="0.01"
          :precision="2"
          label="Quantidade"
          :error-messages="errors.purchaseQuantity"
        />
      </v-col>

      <v-col cols="12">
        <UiSelectField
          v-model="purchaseUnitId"
          :items="units"
          item-value="id"
          item-title="name"
          label="Unidade"
          prepend-inner-icon="mdi-ruler"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12">
        <UiDateField
          v-model="quotationDate"
          label="Data da cotação"
          :error-messages="errors.quotationDate"
          @save="quotationDate = $event"
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
