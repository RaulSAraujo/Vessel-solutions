<script lang="ts" setup>
import { useIngredientApi } from "~/composables/api/useIngredientApi";
import type { FormIngredients } from "~/types/ingredient";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useIngredientApi();

const loading = ref(false);

async function creation(events: FormIngredients) {
  loading.value = true;

  const res = await api.createIngredient(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useIngredientStore().addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card title="Novo ingrediente" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
