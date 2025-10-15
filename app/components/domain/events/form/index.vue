<script setup lang="ts">
import { eventSchema } from "~/schemas/event";
import type { Datum as Event } from "~/types/events";
import type { TableDrinks } from "~/types/event-drinks";

// Components
import Fields from "./Fields.vue";
import Drinks from "./drinks/index.vue";

defineProps<{
  event?: Event | null;
  loading: boolean;
}>();

const emit = defineEmits(["submit", "update:estimated-quantity"]);

const drinks = ref<TableDrinks[]>([]);

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
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <Fields :event="event" :errors="errors" />

    <Drinks
      :drinks="drinks"
      :event="event"
      :form="values"
      @add="drinks.push($event)"
      @delete="drinks.splice(drinks.indexOf($event), 1)"
    />

    <v-btn type="submit" color="primary" block :loading="loading">
      Salvar
    </v-btn>
  </v-form>
</template>
