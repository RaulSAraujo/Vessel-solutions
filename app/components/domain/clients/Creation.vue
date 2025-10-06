<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { FormClient } from "~/types/clients";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useClientsApi();

const loading = ref(false);

async function creation(events: FormClient) {
  loading.value = true;

  const res = await api.createClient(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useClientsStore().addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card title="Novo Cliente" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
