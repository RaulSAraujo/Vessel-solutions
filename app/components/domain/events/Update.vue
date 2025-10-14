<script lang="ts" setup>
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { FormEvent } from "~/types/events";
// components
import Form from "./form/index.vue";

const emit = defineEmits(["close"]);

const api = useEventsApi();

const store = useEventsStore();
const { selectedEvent } = storeToRefs(store);

const loading = ref(false);

async function update(events: FormEvent) {
  if (!selectedEvent.value) return;

  loading.value = true;

  const res = await api.updateEvent(selectedEvent.value?.id, events);

  if (!res) {
    loading.value = false;
    return;
  }

  store.updateItem(res);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card title="Atualizar fornecedor" rounded="xl">
      <v-card-text>
        <Form :supplier="selectedEvent" :loading="loading" @submit="update" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
