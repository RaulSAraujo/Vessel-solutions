<script setup lang="ts">
import { drinkSchema } from "~/schemas/drink";

import type { Datum } from "~/types/drinks";

const props = defineProps<{
  drink?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: drinkSchema,
});

const { value: name } = useField<string>("name");
const { value: is_alcoholic } = useField<boolean>("is_alcoholic");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.drink) {
  name.value = props.drink.name;
  is_alcoholic.value = props.drink.is_alcoholic;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiTextField
          v-model="name"
          v-maska="'Ax'"
          label="Nome do drink"
          prepend-inner-icon="mdi-glass-cocktail"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12">
        <v-checkbox
          v-model="is_alcoholic"
          label="Alcoólico"
          hide-details="auto"
          color="primary"
          :error-messages="errors.is_alcoholic"
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
