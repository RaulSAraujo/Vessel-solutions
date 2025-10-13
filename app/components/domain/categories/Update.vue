<script lang="ts" setup>
import { useCategoriesApi } from "~/composables/api/useCategoriesApi";
import type { FormCategory } from "~/types/categories";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useCategoriesApi();

const store = useCategoriesStore();
const { selectedCategory } = storeToRefs(store);

const loading = ref(false);

async function update(events: FormCategory) {
  if (!selectedCategory.value) return;

  loading.value = true;

  const res = await api.updateCategory(selectedCategory.value?.id, events);

  if (!res) {
    loading.value = false;
    return;
  }

  store.updateItem(res);

  loading.value = false;

  emit("close");
}

function reset() {
  selectedCategory.value = null;
}
</script>

<template>
  <v-dialog width="300" @after-leave="reset">
    <v-card title="Atualizar fornecedor" rounded="xl">
      <v-card-text>
        <Form
          :supplier="selectedCategory"
          :loading="loading"
          @submit="update"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
