<script lang="ts" setup>
import { useQuotationsApi } from "~/composables/api/useQuotationsApi";
import type { FormQuotations } from "~/types/quotations";
import type { Datum as Supplier } from "~/types/suppliers";
import type { Datum as Ingredient } from "~/types/ingredients";
// components
import Form from "./Form.vue";

defineProps<{
  units: { id: string; name: string }[];
  suppliers: Supplier[];
  ingredients: Ingredient[];
}>();

const emit = defineEmits(["close"]);

const api = useQuotationsApi();

const store = useQuotationsStore();
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
    <v-card title="Atualizar cotação" rounded="xl">
      <v-card-text>
        <Form
          :units="units"
          :suppliers="suppliers"
          :ingredients="ingredients"
          :quotation="selectedQuotation"
          :loading="loading"
          @submit="update"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
