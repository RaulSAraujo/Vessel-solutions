<script setup lang="ts">
import { useIngredientsApi } from "~/composables/api/useIngredientsApi";
import { ingredientSchema } from "~/schemas/ingredient";

import type { Datum } from "~/types/ingredient";

const props = defineProps<{
  ingredient?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: ingredientSchema,
});

const { value: name } = useField<string>("name");
const { value: unit_id } = useField<string>("unit_id");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.ingredient) {
  name.value = props.ingredient.name;
  unit_id.value = props.ingredient.unit_id;
}

const units = await useIngredientsApi().getUnits();
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
          v-model="unit_id"
          :items="units || []"
          item-value="id"
          item-title="name"
          label="Unidade"
          prepend-inner-icon="mdi-ruler"
          :error-messages="errors.name"
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
