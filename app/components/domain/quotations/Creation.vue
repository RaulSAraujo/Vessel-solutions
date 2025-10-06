<script lang="ts" setup>
import { useQuotationsApi } from "~/composables/api/useQuotationsApi";
import type { FormQuotations } from "~/types/quotation";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useQuotationsApi();

const loading = ref(false);

async function creation(events: FormQuotations) {
  loading.value = true;

  const res = await api.createQuotation(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useQuotationsStore().addItem(res);

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
