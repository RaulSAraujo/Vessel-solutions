<script lang="ts" setup>
import { useClientsApi } from "~/composables/api/useClientsApi";
import type { FormClient, FormClientAddresses } from "~/types/clients";
// components
import Form from "~/components/domain/clients/Form.vue";

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
    <v-card
      title="Cadastrar cliente e endereço"
      rounded="t-xl"
      prepend-icon="mdi-account-plus"
    >
      <v-card-text>
        <p>Apos a criação do cliente</p>

        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
