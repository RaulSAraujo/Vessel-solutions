<script lang="ts" setup>
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { FormEvent } from "~/types/events";
import type { FormEventDrinks } from "~/types/event-drinks";
// components
import Form from "./form/index.vue";

type EventWithDrinks = FormEvent & { event_drinks: FormEventDrinks[] };

const emit = defineEmits(["close"]);

const api = useEventsApi();

const loading = ref(false);

async function creation(events: EventWithDrinks) {
  loading.value = true;

  const event = await api.createEvent(events);

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

  emit("close");

  loading.value = false;
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
