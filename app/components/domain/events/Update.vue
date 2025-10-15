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
const { selectedEvent } = storeToRefs(store);

const loading = ref(false);

async function update(events: EventWithDrinks) {
  if (!selectedEvent.value) return;

  loading.value = true;

  const event = await api.updateEvent(selectedEvent.value?.id, events);

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
    <v-card title="Atualizar fornecedor" rounded="xl">
      <v-card-text>
        <Form :event="selectedEvent" :loading="loading" @submit="update" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
