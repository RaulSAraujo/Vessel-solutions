<script setup lang="ts">
import { useQuotationsApi } from "~/composables/api/useQuotationsApi";
import { quotationSchema } from "~/schemas/quotation";

import type { Datum } from "~/types/quotation";

const props = defineProps<{
  quotation?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: quotationSchema,
});

const { value: supplier_id } = useField<string>("supplier_id");
const { value: ingredient_id } = useField<string>("ingredient_id");
const { value: purchase_price } = useField<number>("purchase_price");
const { value: quotation_date } = useField<string | null>("quotation_date");

const suppliers = await useQuotationsApi().getSuppliers();
const ingredients = await useQuotationsApi().getIngredients();

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

onMounted(async () => {
  if (props.quotation) {
    supplier_id.value = props.quotation.supplier_id;
    ingredient_id.value = props.quotation.ingredient_id;
    purchase_price.value = props.quotation.purchase_price;
    quotation_date.value = props.quotation.quotation_date;
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiSelectField
          v-model="supplier_id"
          :items="suppliers || []"
          item-value="id"
          item-title="name"
          label="Fornecedor"
          prepend-inner-icon="mdi-account"
          :error-messages="errors.supplier_id"
        />
      </v-col>

      <v-col cols="12">
        <UiSelectField
          v-model="ingredient_id"
          :items="ingredients || []"
          item-value="id"
          item-title="name"
          label="Ingrediente"
          prepend-inner-icon="mdi-food-variant"
          :error-messages="errors.ingredient_id"
        />
      </v-col>

      <v-col cols="12">
        <UiNumberField
          v-model="purchase_price"
          :min="0"
          :step="0.01"
          :precision="2"
          label="Preço de compra"
          :error-messages="errors.purchase_price"
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
