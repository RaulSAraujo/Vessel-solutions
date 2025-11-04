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
const {
  totalPercentageDrinks,
  estimatedQuantity,
  totalCost,
  totalRevenue,
  profitMargin,
} = storeToRefs(store);

const loading = ref(false);

async function creation(eventQuotation: EventQuotationWithDrinks) {
  if (eventQuotation.event_quotation_drinks.length === 0) {
    return $toast().error("Adicione pelo menos um drink.");
  }

  if (totalPercentageDrinks.value !== 100) {
    return $toast().error("A soma das porcentagens dos drinks deve ser 100%");
  }

  loading.value = true;

  const quotation = await api.createEventQuotation({
    ...eventQuotation,
    estimated_total_drinks: estimatedQuantity.value,
    total_cost: totalCost.value,
    total_revenue: totalRevenue.value,
    profit_margin: profitMargin.value,
  });

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

  useEventQuotationsStore().addItem(quotation);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card
      id="tutorial-event-quotations-form"
      title="Nova proposta/orçamento"
      rounded="t-xl"
      prepend-icon="mdi-file-document-multiple"
    >
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
