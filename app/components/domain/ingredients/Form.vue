<script setup lang="ts">
import { ingredientSchema } from "~/schemas/ingredient";

import type { Datum } from "~/types/ingredients";

const myProps = defineProps<{
  ingredient?: Datum | null;
  loading: boolean;
  units: Units[];
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: ingredientSchema,
});

const { value: name } = useField<string>("name");
const { value: unitId } = useField<number>("unit_id");
const { value: unitVolumeMl } = useField<number | null>("unit_volume_ml");
const { value: unitWeightG } = useField<number | null>("unit_weight_g");
const { value: wastagePercentage } = useField<number>("wastage_percentage");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (myProps.ingredient) {
  name.value = myProps.ingredient.name;
  unitId.value = myProps.ingredient.unit_id;
  unitVolumeMl.value = myProps.ingredient.unit_volume_ml;
  unitWeightG.value = myProps.ingredient.unit_weight_g;
  wastagePercentage.value = myProps.ingredient.wastage_percentage;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col id="tutorial-ingredients-form-name" cols="12">
        <UiTextField
          v-model="name"
          v-maska="'Ax'"
          label="Nome do ingrediente"
          prepend-inner-icon="mdi-food-apple"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col id="tutorial-ingredients-form-unit" cols="12">
        <UiAutocompleteField
          v-model="unitId"
          :items="units || []"
          item-value="id"
          item-title="name"
          label="Unidade"
          prepend-inner-icon="mdi-ruler"
          :error-messages="errors.unitId"
        >
          <template #item="{ props, item }">
            <v-list-item
              lines="one"
              elevation="0"
              v-bind="props"
              :title="item.raw.name"
            >
              <template #append>
                <span class="text-caption">({{ item.raw.abbreviation }})</span>
              </template>
            </v-list-item>
          </template>
        </UiAutocompleteField>
      </v-col>

      <v-col id="tutorial-ingredients-form-volume" cols="12">
        <UiTextField
          v-model="unitVolumeMl"
          v-maska="'####'"
          label="Volume da unidade (ml)"
          prepend-inner-icon="mdi-beaker"
          :error-messages="errors.unitVolumeMl"
        />
      </v-col>

      <v-col id="tutorial-ingredients-form-weight" cols="12">
        <UiTextField
          v-model="unitWeightG"
          v-maska="'####'"
          label="Peso da unidade (g)"
          prepend-inner-icon="mdi-weight"
          :error-messages="errors.unitWeightG"
        />
      </v-col>

      <v-col id="tutorial-ingredients-form-wastage" cols="12">
        <UiNumberField
          v-model="wastagePercentage"
          :min="0"
          :max="100"
          control-variant="stacked"
          label="Percentual de desperdício"
          prepend-inner-icon="mdi-percent"
          dirty
          :error-messages="errors.wastage_percentage"
        />
      </v-col>

      <v-col id="tutorial-ingredients-form-submit" cols="12" class="d-flex justify-center">
        <v-btn type="submit" color="primary" block :loading="loading">
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
