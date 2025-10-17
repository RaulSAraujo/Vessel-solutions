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
  selectedEvent,
  totalPercentageDrinks,
  estimatedQuantity,
  totalCost,
  totalRevenue,
  profitMargin,
} = storeToRefs(store);

const loading = ref(false);

async function update(events: EventWithDrinks) {
  if (!selectedEvent.value) return;

  if (totalPercentageDrinks.value !== 100) {
    return $toast().error("A soma das porcentagens dos drinks deve ser 100%");
  }

  loading.value = true;

  const event = await api.updateEvent(selectedEvent.value?.id, {
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

  store.updateItem(event);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card title="Atualizar evento" rounded="xl">
      <v-card-text>
        <Form :event="selectedEvent" :loading="loading" @submit="update" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
