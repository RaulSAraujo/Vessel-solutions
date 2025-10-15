<script lang="ts" setup>
import { useEventsApi } from "~/composables/api/useEventsApi";

import type { Datum as Drink } from "~/types/drinks";
import type { TableDrinks } from "~/types/event-drinks";
import type { FormEvent, Datum as Event } from "~/types/events";

// components
import Table from "./Table.vue";
import FindDrink from "./FindDrink.vue";

type SelectedDrink = Drink & { drink_categories: { name: string } };

const props = defineProps<{
  form: Partial<FormEvent>;
  event?: Event | null;
  drinks: TableDrinks[];
}>();

const emit = defineEmits(["add", "delete"]);

const api = useEventsApi();

const selectedDrink = ref<string | SelectedDrink | null>(null);

const disabledFindDrink = computed(() => {
  return (
    !props.form.start_time ||
    !props.form.end_time ||
    !props.form.guest_count ||
    !props.form.audience_profile
  );
});

watch(selectedDrink, async () => {
  if (selectedDrink.value && typeof selectedDrink.value == "object") {
    emit("add", {
      drink_id: selectedDrink.value.id,
      name: selectedDrink.value.name,
      category: selectedDrink.value.drink_categories.name,
      description: selectedDrink.value.description,
      image_url: selectedDrink.value.image_url,
      calculated_cost: selectedDrink.value.calculated_cost || 0,
      selling_price: selectedDrink.value.selling_price || 0,
      profit_margin_percentage:
        selectedDrink.value.profit_margin_percentage || 0,
      drink_percentage: 0,
    });

    selectedDrink.value = null;
  }
});

onMounted(async () => {
  if (!props.event || !props.event.id) return;

  const drinks = await api.getEventDrinks(props.event.id);

  if (drinks) {
    for (const drink of drinks) {
      emit("add", {
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
  <div>
    <FindDrink
      v-model="selectedDrink"
      :disabled="disabledFindDrink"
      class="mt-5"
    />

    <Table
      class="my-5"
      :form="form"
      :event="event"
      :drinks="drinks"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>
