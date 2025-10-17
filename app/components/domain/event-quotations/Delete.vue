<script lang="ts" setup>
import { useEventQuotationsApi } from "~/composables/api/useEventQuotationsApi";

const emit = defineEmits(["close"]);

const api = useEventQuotationsApi();

const store = useEventQuotationsStore();
const { selectedEventQuotation } = storeToRefs(store);

const loading = ref(false);

async function deleteEventQuotation() {
  if (!selectedEventQuotation.value) return;

  loading.value = true;

  const res = await api.deleteEventQuotation(selectedEventQuotation.value?.id);

  if (!res) {
    loading.value = false;
    return;
  }

  store.deleteItem(selectedEventQuotation.value);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog max-width="400">
    <v-card rounded="xl">
      <v-card-title class="text-h6"> Confirmação de Exclusão </v-card-title>
      <v-card-text>
        Tem certeza de que deseja excluir esta proposta/orçamento? Esta ação não
        pode ser desfeita.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" text @click="$emit('close')"> Cancelar </v-btn>
        <v-btn
          color="error"
          text
          :loading="loading"
          @click="deleteEventQuotation"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
