<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { FormClient } from "~/types/client";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useClientsApi();

const store = useClientStore();
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

  useClientStore().updateItem(res);

  loading.value = false;

  emit("close");
}

function reset() {
  selectedClient.value = null;
}
</script>

<template>
  <v-dialog width="300" @after-leave="reset">
    <v-card title="Atualizar Cliente" rounded="xl">
      <v-card-text>
        <Form :client="selectedClient" :loading="loading" @submit="update" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
