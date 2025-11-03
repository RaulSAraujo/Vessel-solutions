<script lang="ts" setup>
import type { Datum as Drink } from "~/types/drinks";
import type {
  FormEventQuotation,
  EventQuotation,
} from "~/types/event-quotations";

// components
import Table from "./table/index.vue";
import FindDrink from "./FindDrink.vue";

type SelectedDrink = Drink;

const props = defineProps<{
  form: Partial<FormEventQuotation>;
  eventQuotation?: EventQuotation | null;
}>();

const store = useEventQuotationsStore();

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
    store.addSelectedDrink(selectedDrink.value);

    selectedDrink.value = null;
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

    <Table class="my-5" :form="form" :event-quotation="eventQuotation" />
  </div>
</template>
