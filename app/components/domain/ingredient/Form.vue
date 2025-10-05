<script setup lang="ts">
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

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.ingredient) {
  name.value = props.ingredient.name;
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

      <v-col cols="12" class="d-flex justify-center">
        <v-btn type="submit" color="primary" block :loading="loading">
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
