<script setup lang="ts">
import { categorySchema } from "~/schemas/category";

import type { Datum } from "~/types/categories";

const props = defineProps<{
  category?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: categorySchema,
});

const { value: name } = useField<string>("name");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.category) {
  name.value = props.category.name;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiTextField
          v-model="name"
          v-maska="'Ax'"
          label="Nome da categoria"
          prepend-inner-icon="mdi-account"
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
