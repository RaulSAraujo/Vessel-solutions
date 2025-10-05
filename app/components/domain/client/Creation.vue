<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { FormClient } from "~/types/client";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useClientsApi();

const loading = ref(false);

async function creation(events: FormClient) {
  loading.value = true;

  const res = await api.createClient(events);

  if (!res) {
    $toast().error("Não foi possível criar o cliente.");
    loading.value = false;
    return;
  }

  useClientStore().addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card title="Novo Cliente" rounded="xl">
      <v-card-text>
        <Form :client="null" :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
