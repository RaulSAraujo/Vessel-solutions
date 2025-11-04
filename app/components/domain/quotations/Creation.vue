<script lang="ts" setup>
import { useQuotationsApi } from "~/composables/api/useQuotationsApi";
import type { FormQuotations } from "~/types/quotations";
import type { Datum as Supplier } from "~/types/suppliers";
import type { Datum as Ingredient } from "~/types/ingredients";
// components
import Form from "./Form.vue";

defineProps<{
  units: Units[];
  suppliers: Supplier[];
  ingredients: Ingredient[];
}>();

const emit = defineEmits(["close"]);

const api = useQuotationsApi();

const store = useQuotationsStore();
const { selectedQuotation } = storeToRefs(store);

const loading = ref(false);

async function creation(events: FormQuotations) {
  loading.value = true;

  const res = await api.createQuotation(events);

  if (!res) {
    loading.value = false;
    return;
  }

  selectedQuotation.value = res;

  store.addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card id="tutorial-quotations-form" title="Nova cotação" rounded="xl">
      <v-card-text>
        <Form
          :units="units"
          :suppliers="suppliers"
          :ingredients="ingredients"
          :loading="loading"
          @submit="creation"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
