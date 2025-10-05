<script setup lang="ts">
import { clientSchema } from "~/schemas/client";
import type { FetchError } from "ofetch";
import type { Datum } from "~/types/client";
import type { MaskInputOptions } from "maska";

defineProps<{
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

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

const loadingViaCep = ref(false);
const cepError = ref<string | null>(null);

async function getViaCep() {
  try {
    cepError.value = null;
    loadingViaCep.value = true;

    if (!zip_code.value || zip_code.value.length < 8) return;

    const res = await $fetch("/api/via-cep", {
      query: {
        cep: zip_code.value,
      },
    });

    city.value = res.localidade;
    address.value = res.logradouro;
  } catch (error) {
    const err = error as FetchError;
    console.error("API handler error:", err);
    cepError.value = "Erro ao buscar CEP. Tente novamente.";
  } finally {
    loadingViaCep.value = false;
  }
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
          v-maska="'(##) #####-####'"
          label="Telefone"
          prepend-inner-icon="mdi-phone"
          placeholder="(XX) XXXXX-XXXX"
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
        <UiTextField
          v-model="zip_code"
          v-maska="'#####-###'"
          label="CEP"
          prepend-inner-icon="mdi-map-marker"
          :loading="loadingViaCep"
          :error-messages="errors.zip_code || cepError"
          @focus="cepError = null"
          @blur="getViaCep"
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
