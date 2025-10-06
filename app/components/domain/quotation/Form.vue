<script setup lang="ts">
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

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.quotation) {
  supplier_id.value = props.quotation.supplier_id;
  ingredient_id.value = props.quotation.ingredient_id;
  purchase_price.value = props.quotation.purchase_price;
  quotation_date.value = props.quotation.quotation_date;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiTextField
          v-model="supplier_id"
          v-maska="'Ax'"
          label="Nome do ingrediente"
          prepend-inner-icon="mdi-food-apple"
          :error-messages="errors.supplier_id"
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
