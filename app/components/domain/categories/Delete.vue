<script lang="ts" setup>
import { useCategoriesApi } from "~/composables/api/useCategoriesApi";

const emit = defineEmits(["close"]);

const api = useCategoriesApi();

const store = useCategoriesStore();
const { selectedCategory } = storeToRefs(store);

const loading = ref(false);

async function deleteCategory() {
  if (!selectedCategory.value) return;

  loading.value = true;

  const res = await api.deleteCategory(selectedCategory.value?.id);

  if (!res) {
    loading.value = false;
    return;
  }

  store.deleteItem(selectedCategory.value);

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
        <v-btn color="error" text @click="deleteCategory"> Confirmar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
