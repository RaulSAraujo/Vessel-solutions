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
const { value: phone } = useField<string>("phone");
const { value: phoneOptional } = useField<string | null>("phone_optional");
const { value: email } = useField<string>("email");
const { value: document } = useField<string>("document");
const { value: zipCode } = useField<string>("zip_code");
const { value: city } = useField<string>("city");
const { value: state } = useField<string>("state");
const { value: neighborhood } = useField<string>("neighborhood");
const { value: street } = useField<string>("street");
const { value: number } = useField<string>("number");
const { value: additionalInfo } = useField<string>("additional_info");

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
  // Client
  name.value = props.client.name;
  phone.value = props.client.phone;
  phoneOptional.value = props.client.phone_optional;
  email.value = props.client.email;
  document.value = props.client.document;

  // Address
  zipCode.value = props.client.client_addresses.zip_code;
  city.value = props.client.client_addresses.city;
  state.value = props.client.client_addresses.state;
  neighborhood.value = props.client.client_addresses.neighborhood;
  street.value = props.client.client_addresses.street;
  number.value = props.client.client_addresses.number;
  additionalInfo.value = props.client.client_addresses.additional_info;
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row dense justify="center">
      <v-col cols="12" md="8">
        <UiTextField
          v-model="name"
          label="Nome completo"
          prepend-inner-icon="mdi-account"
          :error-messages="errors.name"
        />
      </v-col>

      <v-col cols="12" md="4">
        <UiTextField
          v-model="email"
          label="E-mail"
          type="email"
          prepend-inner-icon="mdi-email"
          :error-messages="errors.email"
        />
      </v-col>

      <v-col cols="12" md="4">
        <UiTextField
          v-model="document"
          v-maska="options"
          label="Cpf/Cnpj"
          prepend-inner-icon="mdi-card-account-details"
          :error-messages="errors.document"
        />
      </v-col>

      <v-col cols="12" md="4">
        <UiTextField
          v-model="phone"
          v-maska="optionsPhone"
          label="Telefone"
          prepend-inner-icon="mdi-phone"
          :error-messages="errors.phone"
        />
      </v-col>

      <v-col cols="12" md="4">
        <UiTextField
          v-model="phoneOptional"
          v-maska="optionsPhone"
          label="Telefone opcional"
          prepend-inner-icon="mdi-phone"
          :error-messages="errors.phoneOptional"
        />
      </v-col>

      <v-col cols="12" md="3">
        <ViaCep
          v-model="zipCode"
          :error-messages="errors.zipCode"
          @update-city="city = $event"
          @update-state="state = $event"
          @update-neighborhood="neighborhood = $event"
          @update-street="street = $event"
        />
      </v-col>

      <v-col cols="12" md="4">
        <UiTextField
          v-model="city"
          v-maska="'Ax'"
          label="Cidade"
          prepend-inner-icon="mdi-city"
          :error-messages="errors.city"
        />
      </v-col>

      <v-col cols="12" md="1">
        <UiTextField
          v-model="state"
          v-maska="'AA'"
          label="Uf"
          :error-messages="errors.state"
        />
      </v-col>

      <v-col cols="12" md="4">
        <UiTextField
          v-model="neighborhood"
          v-maska="'Ax'"
          label="Bairro"
          prepend-inner-icon="mdi-home-city"
          :error-messages="errors.neighborhood"
        />
      </v-col>

      <v-col cols="12" md="9">
        <UiTextField
          v-model="street"
          v-maska="'Ax'"
          label="Rua"
          prepend-inner-icon="mdi-road"
          :error-messages="errors.street"
        />
      </v-col>

      <v-col cols="12" md="3">
        <UiTextField
          v-model="number"
          v-maska="'N'"
          label="Numero"
          prepend-inner-icon="mdi-numeric"
          :error-messages="errors.number"
        />
      </v-col>

      <v-col cols="12">
        <UiTextField
          v-model="additionalInfo"
          v-maska="'Ax'"
          counter="200"
          label="Complemento"
          :error-messages="errors.additional_info"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-btn type="submit" color="primary" block :loading="loading">
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
