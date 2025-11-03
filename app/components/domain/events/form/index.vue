<script setup lang="ts">
import { eventSchema } from "~/schemas/event";
import { useEventsApi } from "~/composables/api/useEventsApi";

import type { Datum as Event } from "~/types/events";

// Components
import Fields from "./fields/index.vue";
import Drinks from "./drinks/index.vue";

const props = defineProps<{
  event?: Event | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit", "update:estimated-quantity"]);

const api = useEventsApi();

const store = useEventsStore();
const { drinks, loadingDrinks } = storeToRefs(store);

const { handleSubmit, errors, values } = useForm({
  validationSchema: eventSchema,
});

const onSubmit = handleSubmit((values) => {
  emit("submit", {
    ...values,
    event_drinks: drinks.value.map((e) => ({
      id: e.id, // Incluir ID para permitir atualização
      drink_percentage: e.drink_percentage,
      drink_name: e.drink_name,
      drink_description: e.drink_description,
      drink_image_url: e.drink_image_url,
      drink_calculated_cost: e.drink_calculated_cost,
      drink_selling_price: e.drink_selling_price,
      drink_profit_margin_percentage: e.drink_profit_margin_percentage,
    })),
  });
});

onMounted(async () => {
  drinks.value = [];

  if (!props.event || !props.event.id) return;

  loadingDrinks.value = true;
  const res = await api.getEventDrinks(props.event.id);

  if (res) {
    for (const drink of res) {
      drinks.value.push({
        id: drink.id,
        drink_name: drink.drink_name,
        drink_description: drink.drink_description,
        drink_image_url: drink.drink_image_url,
        drink_calculated_cost: drink.drink_calculated_cost || 0,
        drink_selling_price: drink.drink_selling_price || 0,
        drink_profit_margin_percentage:
          drink.drink_profit_margin_percentage || 0,
        drink_percentage: drink.drink_percentage || 0,
      });
    }
  }

  loadingDrinks.value = false;
});

onUnmounted(() => {
  store.resetForm();
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <Fields :event="event" :errors="errors" />

    <v-divider class="my-4" />

    <Drinks :event="event" :form="values" />

    <v-btn type="submit" color="primary" block :loading="loading">
      Salvar
    </v-btn>
  </v-form>
</template>
