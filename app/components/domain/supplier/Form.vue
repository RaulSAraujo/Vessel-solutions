<script setup lang="ts">
import { supplierSchema } from "~/schemas/supplier";

import type { Datum } from "~/types/supplier";

const props = defineProps<{
  supplier?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: supplierSchema,
});

const { value: name } = useField<string>("name");
const { value: phone } = useField<string | null>("phone");
const { value: email } = useField<string | null>("email");
const { value: observation } = useField<string | null>("observation");

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.supplier) {
  name.value = props.supplier.name;
  phone.value = props.supplier.phone;
  email.value = props.supplier.email;
  observation.value = props.supplier.observation;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiTextField
          v-model="name"
          v-maska="'Ax'"
          label="Nome do fornecedor"
          prepend-inner-icon="mdi-account"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="email"
          label="E-mail"
          type="email"
          prepend-inner-icon="mdi-email"
          :error-messages="errors.email"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="phone"
          v-maska="'(##) #####-####'"
          label="Telefone"
          prepend-inner-icon="mdi-phone"
          placeholder="(XX) XXXXX-XXXX"
          :error-messages="errors.phone"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="observation"
          v-maska="'Ax'"
          label="Observação"
          prepend-inner-icon="mdi-comment"
          :error-messages="errors.observation"
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
