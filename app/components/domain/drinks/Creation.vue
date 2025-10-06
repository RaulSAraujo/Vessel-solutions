<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { FormIngredients } from "~/types/ingredients";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useDrinksApi();

const loading = ref(false);

async function creation(events: FormIngredients) {
  loading.value = true;

  const res = await api.createDrink(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useDrinksStore().addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card title="Novo drink" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
