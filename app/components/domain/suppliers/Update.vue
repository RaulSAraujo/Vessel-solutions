<script lang="ts" setup>
import { useSuppliersApi } from "~/composables/api/useSuppliersApi";
import type { FormSupplier } from "~/types/supplier";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useSuppliersApi();

const store = useSuppliersStore();
const { selectedSupplier } = storeToRefs(store);

const loading = ref(false);

async function update(events: FormSupplier) {
  if (!selectedSupplier.value) return;

  loading.value = true;

  const res = await api.updateSupplier(selectedSupplier.value?.id, events);

  if (!res) {
    loading.value = false;
    return;
  }

  store.updateItem(res);

  loading.value = false;

  emit("close");
}

function reset() {
  selectedSupplier.value = null;
}
</script>

<template>
  <v-dialog width="300" @after-leave="reset">
    <v-card title="Atualizar fornecedor" rounded="xl">
      <v-card-text>
        <Form
          :supplier="selectedSupplier"
          :loading="loading"
          @submit="update"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
