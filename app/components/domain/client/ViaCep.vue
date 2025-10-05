<script lang="ts" setup>
import type { FetchError } from "ofetch";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  errorMessages: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "updateCity", "updateAddress"]);

const loadingViaCep = ref(false);
const cepError = ref<string | null>(null);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

async function getViaCep() {
  try {
    cepError.value = null;
    loadingViaCep.value = true;

    if (!internalValue.value || internalValue.value.length < 8) return;

    const res = await $fetch("/api/via-cep", {
      query: {
        cep: internalValue.value,
      },
    });

    emit("updateCity", res.localidade);
    emit("updateAddress", res.logradouro);
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
  <UiTextField
    v-model="internalValue"
    v-maska="'#####-###'"
    label="CEP"
    prepend-inner-icon="mdi-map-marker"
    :loading="loadingViaCep"
    :error-messages="errorMessages || cepError"
    @focus="cepError = null"
    @blur="getViaCep"
  />
</template>
