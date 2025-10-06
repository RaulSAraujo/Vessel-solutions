<script lang="ts" setup>
import { useQuotationApi } from "~/composables/api/useQuotationApi";
import type { FormQuotations } from "~/types/quotation";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useQuotationApi();

const store = useQuotationStore();
const { selectedQuotation } = storeToRefs(store);

const loading = ref(false);

async function update(events: FormQuotations) {
  if (!selectedQuotation.value) return;

  loading.value = true;

  const res = await api.updateQuotation(selectedQuotation.value?.id, events);

  if (!res) {
    loading.value = false;
    return;
  }

  store.updateItem(res);

  loading.value = false;

  emit("close");
}

function reset() {
  selectedQuotation.value = null;
}
</script>

<template>
  <v-dialog width="300" @after-leave="reset">
    <v-card title="Atualizar ingrediente" rounded="xl">
      <v-card-text>
        <Form
          :ingredient="selectedQuotation"
          :loading="loading"
          @submit="update"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
