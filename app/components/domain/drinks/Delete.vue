<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";

const emit = defineEmits(["close"]);

const api = useDrinksApi();

const store = useDrinksStore();
const { selectedDrink } = storeToRefs(store);

const loading = ref(false);

async function destroy() {
  if (!selectedDrink.value) return;

  loading.value = true;

  const res = await api.deleteDrink(selectedDrink.value?.id);

  if (!res) {
    loading.value = false;
    return;
  }

  store.deleteItem(selectedDrink.value);

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
        <v-btn color="error" text @click="destroy"> Confirmar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
