<script setup lang="ts">
import { eventSchema } from "~/schemas/event";
import { useEventsApi } from "~/composables/api/useEventsApi";

import type { Datum as Event } from "~/types/events";

// Components
import Fields from "./Fields.vue";
import Drinks from "./drinks/index.vue";

const props = defineProps<{
  event?: Event | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit", "update:estimated-quantity"]);

const api = useEventsApi();

const store = useEventsStore();
const { drinks } = storeToRefs(store);

const { handleSubmit, errors, values } = useForm({
  validationSchema: eventSchema,
});

const onSubmit = handleSubmit((values) => {
  emit("submit", {
    ...values,
    event_drinks: drinks.value.map((e) => ({
      drink_id: e.drink_id,
      drink_percentage: e.drink_percentage,
    })),
  });
});

onMounted(async () => {
  if (!props.event || !props.event.id) return;

  drinks.value = [];

  const res = await api.getEventDrinks(props.event.id);

  if (res) {
    for (const drink of res) {
      drinks.value.push({
        drink_id: drink.drink_id,
        name: drink.drinks.name,
        category: drink.drinks.drink_categories.name,
        description: drink.drinks.description,
        image_url: drink.drinks.image_url,
        calculated_cost: drink.drinks.calculated_cost || 0,
        selling_price: drink.drinks.selling_price || 0,
        profit_margin_percentage: drink.drinks.profit_margin_percentage || 0,
        drink_percentage: drink.drink_percentage || 0,
      });
    }
  }
});
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <Fields :event="event" :errors="errors" />

    <Drinks :event="event" :form="values" />

    <v-btn type="submit" color="primary" block :loading="loading">
      Salvar
    </v-btn>
  </v-form>
</template>
