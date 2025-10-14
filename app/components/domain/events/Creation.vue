<script lang="ts" setup>
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { FormEvent } from "~/types/events";
// components
import Form from "./form/index.vue";

const emit = defineEmits(["close"]);

const api = useEventsApi();

const loading = ref(false);

async function creation(events: FormEvent) {
  loading.value = true;

  const res = await api.createEvent(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useEventsStore().addItem(res);

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
