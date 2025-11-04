<script lang="ts" setup>
import { useSuppliersApi } from "~/composables/api/useSuppliersApi";
import type { FormSupplier } from "~/types/suppliers";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useSuppliersApi();

const loading = ref(false);

async function creation(events: FormSupplier) {
  loading.value = true;

  const res = await api.createSupplier(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useSuppliersStore().addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card id="tutorial-suppliers-form" title="Novo fornecedor" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
