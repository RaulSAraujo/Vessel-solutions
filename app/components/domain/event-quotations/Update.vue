<script lang="ts" setup>
import { useEventQuotationsApi } from "~/composables/api/useEventQuotationsApi";

import type {
  FormEventQuotation,
  FormEventQuotationDrink,
} from "~/types/event-quotations";

// components
import Form from "./form/index.vue";

type EventQuotationWithDrinks = FormEventQuotation & {
  event_quotation_drinks: FormEventQuotationDrink[];
};

const emit = defineEmits(["close"]);

const api = useEventQuotationsApi();

const store = useEventQuotationsStore();
const { selectedEventQuotation, totalPercentageDrinks } = storeToRefs(store);

const loading = ref(false);

async function update(eventQuotation: EventQuotationWithDrinks) {
  if (!selectedEventQuotation.value) return;

  if (totalPercentageDrinks.value !== 100) {
    return $toast().error("A soma das porcentagens dos drinks deve ser 100%");
  }

  loading.value = true;

  const quotation = await api.updateEventQuotation(
    selectedEventQuotation.value?.id,
    {
      ...eventQuotation,
    }
  );

  if (!quotation) {
    loading.value = false;
    return;
  }

  const eventQuotationDrink = await api.upsertEventQuotationDrinks(
    quotation.id,
    eventQuotation.event_quotation_drinks
  );

  if (!eventQuotationDrink) {
    loading.value = false;
    return;
  }

  store.updateItem(quotation);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card title="Atualizar proposta/orçamento" rounded="xl">
      <v-card-text>
        <Form
          :event-quotation="selectedEventQuotation"
          :loading="loading"
          @submit="update"
        />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
