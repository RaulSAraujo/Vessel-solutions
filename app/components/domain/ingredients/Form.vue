<script setup lang="ts">
import { ingredientSchema } from "~/schemas/ingredient";

import type { Datum } from "~/types/ingredients";

const props = defineProps<{
  ingredient?: Datum | null;
  loading: boolean;
  units: { id: string; name: string }[];
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: ingredientSchema,
});

const { value: name } = useField<string>("name");
const { value: unitId } = useField<string>("unit_id");
const { value: unitVolumeMl } = useField<number | null>("unit_volume_ml");
const { value: unitWeightG } = useField<number | null>("unit_weight_g");
const { value: wastagePercentage } = useField<number>("wastage_percentage");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.ingredient) {
  name.value = props.ingredient.name;
  unitId.value = props.ingredient.unit_id;
  unitVolumeMl.value = props.ingredient.unit_volume_ml;
  unitWeightG.value = props.ingredient.unit_weight_g;
  wastagePercentage.value = props.ingredient.wastage_percentage;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiTextField
          v-model="name"
          v-maska="'Ax'"
          label="Nome do ingrediente"
          prepend-inner-icon="mdi-food-apple"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12">
        <UiSelectField
          v-model="unitId"
          :items="units || []"
          item-value="id"
          item-title="name"
          label="Unidade"
          prepend-inner-icon="mdi-ruler"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="unitVolumeMl"
          v-maska="'###'"
          label="Volume da unidade (ml)"
          prepend-inner-icon="mdi-beaker"
          :error-messages="errors.unitVolumeMl"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="unitWeightG"
          v-maska="'###'"
          label="Peso da unidade (g)"
          prepend-inner-icon="mdi-weight"
          :error-messages="errors.unitWeightG"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="wastagePercentage"
          v-maska="'##'"
          label="Percentual de desperdício"
          prepend-inner-icon="mdi-percent"
          :error-messages="errors.wastage_percentage"
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
