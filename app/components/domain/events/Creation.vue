<script lang="ts" setup>
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { FormEvent } from "~/types/events";
import type { FormEventDrinks } from "~/types/event-drinks";
// components
import Form from "./form/index.vue";

type EventWithDrinks = FormEvent & { event_drinks: FormEventDrinks[] };

const emit = defineEmits(["close"]);

const api = useEventsApi();

const store = useEventsStore();
const {
  totalPercentageDrinks,
  estimatedQuantity,
  totalCost,
  totalRevenue,
  profitMargin,
} = storeToRefs(store);

const loading = ref(false);

async function creation(events: EventWithDrinks) {
  if (events.event_drinks.length === 0) {
    return $toast().error("Adicione pelo menos um drink.");
  }

  if (totalPercentageDrinks.value !== 100) {
    return $toast().error("A soma das porcentagens dos drinks deve ser 100%");
  }

  loading.value = true;

  const event = await api.createEvent({
    ...events,
    estimated_total_drinks: estimatedQuantity.value,
    total_cost: totalCost.value,
    total_revenue: totalRevenue.value,
    profit_margin: profitMargin.value,
  });

  if (!event) {
    loading.value = false;
    return;
  }

  const eventDrink = await api.upsertEventDrinks(event.id, events.event_drinks);

  if (!eventDrink) {
    loading.value = false;
    return;
  }

  useEventsStore().addItem(event);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card title="Novo evento" rounded="t-xl" prepend-icon="mdi-calendar">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
