<script lang="ts" setup>
import { useQuotationApi } from "~/composables/api/useQuotationApi";
import type { FormQuotations } from "~/types/quotation";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useQuotationApi();

const loading = ref(false);

async function creation(events: FormQuotations) {
  loading.value = true;

  const res = await api.createQuotation(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useQuotationStore().addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card title="Nova cotação" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
