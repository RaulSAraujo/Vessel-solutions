<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { FormClient, FormClientAddresses } from "~/types/clients";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useClientsApi();

const loading = ref(false);

async function creation(events: FormClient & FormClientAddresses) {
  loading.value = true;

  const res = await api.createClientAndAddress(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useClientsStore().addItem(res);

  loading.value = false;

  emit("close");
}
</script>

<template>
  <v-bottom-sheet content-class="rounded-t-xl">
    <v-card id="tutorial-clients-form" title="Novo Cliente" rounded="t-xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
