<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { FormDrink } from "~/types/drinks";
// components
import Form from "./form/index.vue";

const emit = defineEmits(["close"]);

const api = useDrinksApi();

const loading = ref(false);

async function creation(events: FormDrink) {
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
  <v-dialog width="450">
    <v-card title="Nova receita" rounded="xl">
      <v-card-text>
        <Form :loading="loading" @submit="creation" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
