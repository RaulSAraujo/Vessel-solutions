<script lang="ts" setup>
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { FormEvent } from "~/types/events";
// components
import Form from "./Form.vue";

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
  <v-dialog width="300">
    <v-card title="Novo fornecedor" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
