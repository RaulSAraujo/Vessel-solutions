<script setup lang="ts">
import ViaCep from "./ViaCep.vue";
import { clientSchema } from "~/schemas/client";

import type { Datum } from "~/types/clients";
import type { MaskInputOptions } from "maska";

const props = defineProps<{
  client?: Datum | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit"]);

const { handleSubmit, errors } = useForm({
  validationSchema: clientSchema,
});

const { value: name } = useField<string>("name");
const { value: city } = useField<string>("city");
const { value: phone } = useField<string>("phone");
const { value: email } = useField<string>("email");
const { value: address } = useField<string>("address");
const { value: document } = useField<string>("document");
const { value: zip_code } = useField<string>("zip_code");

const options = reactive<MaskInputOptions>({
  mask: ["###.###.###-##", "##.###.###/####-##"],
  eager: true,
});

const optionsPhone = reactive<MaskInputOptions>({
  mask: ["(##) ####-####", "(##) #####-####"],
  eager: true,
});

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

if (props.client) {
  name.value = props.client.name;
  city.value = props.client.city;
  phone.value = props.client.phone;
  email.value = props.client.email;
  address.value = props.client.address;
  document.value = props.client.document;
  zip_code.value = props.client.zip_code;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense>
      <v-col cols="12">
        <UiTextField
          v-model="name"
          label="Nome do Cliente"
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
          v-maska="optionsPhone"
          label="Telefone"
          prepend-inner-icon="mdi-phone"
          :error-messages="errors.phone"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="document"
          v-maska="options"
          label="Cpf/Cnpj"
          prepend-inner-icon="mdi-card-account-details"
          :error-messages="errors.document"
        />
      </v-col>

      <v-col cols="12">
        <ViaCep
          v-model="zip_code"
          :error-messages="errors.zip_code"
          @update-city="city = $event"
          @update-address="address = $event"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="city"
          v-maska="'Ax'"
          label="Cidade"
          prepend-inner-icon="mdi-city"
          :error-messages="errors.city"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="address"
          v-maska="'Ax'"
          label="Endereço"
          prepend-inner-icon="mdi-home-city"
          :error-messages="errors.address"
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
