<script lang="ts" setup>
import { useQuotationApi } from "~/composables/api/useQuotationApi";

const emit = defineEmits(["close"]);

const api = useQuotationApi();

const store = useQuotationStore();
const { selectedQuotation } = storeToRefs(store);

const loading = ref(false);

async function deleteIngredient() {
  if (!selectedQuotation.value) return;

  loading.value = true;

  const res = await api.deleteQuotation(selectedQuotation.value?.id);

  if (!res) {
    loading.value = false;
    return;
  }

  store.deleteItem(selectedQuotation.value);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog max-width="400">
    <v-card rounded="xl">
      <v-card-title class="text-h6"> Confirmação de Exclusão </v-card-title>
      <v-card-text>
        Tem certeza de que deseja excluir este item? Esta ação não pode ser
        desfeita.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" text @click="$emit('close')"> Cancelar </v-btn>
        <v-btn color="error" text @click="deleteIngredient"> Confirmar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
