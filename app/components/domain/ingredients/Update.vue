<script lang="ts" setup>
import { useIngredientsApi } from "~/composables/api/useIngredientsApi";
import type { FormIngredients } from "~/types/ingredients";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useIngredientsApi();

const store = useIngredientsStore();
const { selectedIngredient } = storeToRefs(store);

const loading = ref(false);

async function update(events: FormIngredients) {
  if (!selectedIngredient.value) return;

  loading.value = true;

  const res = await api.updateIngredient(selectedIngredient.value?.id, events);

  if (!res) {
    loading.value = false;
    return;
  }

  store.updateItem(res);

  loading.value = false;

  emit("close");
}

function reset() {
  selectedIngredient.value = null;
}
</script>

<template>
  <v-dialog width="300" @after-leave="reset">
    <v-card title="Atualizar ingrediente" rounded="xl">
      <v-card-text>
        <Form
          :ingredient="selectedIngredient"
          :loading="loading"
          @submit="update"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
