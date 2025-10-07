<script lang="ts" setup>
import { useDrinksApi } from "~/composables/api/useDrinksApi";
import type { FormDrink } from "~/types/drinks";
// components
import Form from "./form/index.vue";

const emit = defineEmits(["close"]);

const api = useDrinksApi();

const store = useDrinksStore();
const { selectedDrink } = storeToRefs(store);

const loading = ref(false);

async function update(events: FormDrink) {
  if (!selectedDrink.value) return;

  loading.value = true;

  const res = await api.updateDrink(selectedDrink.value?.id, events);

  if (!res) {
    loading.value = false;
    return;
  }

  store.updateItem(res);

  loading.value = false;

  emit("close");
}

function reset() {
  selectedDrink.value = null;
}
</script>

<template>
  <v-dialog width="450" @after-leave="reset">
    <v-card title="Atualizar receita" rounded="xl">
      <v-card-text>
        <Form :drink="selectedDrink" :loading="loading" @submit="update" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
