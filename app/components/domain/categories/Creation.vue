<script lang="ts" setup>
import { useCategoriesApi } from "~/composables/api/useCategoriesApi";
import type { FormCategory } from "~/types/categories";
// components
import Form from "./Form.vue";

const emit = defineEmits(["close"]);

const api = useCategoriesApi();

const loading = ref(false);

async function creation(events: FormCategory) {
  loading.value = true;

  const res = await api.createCategory(events);

  if (!res) {
    loading.value = false;
    return;
  }

  useCategoriesStore().addItem(res);

  emit("close");

  loading.value = false;
}
</script>

<template>
  <v-dialog width="300">
    <v-card title="Novo categoria" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
