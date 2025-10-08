<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { FormClient } from "~/types/clients";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useClientsApi();

const store = useClientsStore();
const { selectedClient } = storeToRefs(store);

const loading = ref(false);

async function update(events: FormClient) {
  if (!selectedClient.value) return;

  loading.value = true;

  const res = await api.updateClient(selectedClient.value?.id, events);

  if (!res) {
    loading.value = false;
    return;
  }

  useClientsStore().updateItem(res);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card title="Atualizar Cliente" rounded="xl">
      <v-card-text>
        <Form :client="selectedClient" :loading="loading" @submit="update" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
