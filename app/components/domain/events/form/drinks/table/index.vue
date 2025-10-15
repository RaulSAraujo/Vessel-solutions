<script lang="ts" setup>
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { TableDrinks } from "~/types/event-drinks";
import type { FormEvent, Datum as Event } from "~/types/events";

//Components
import Name from "./Name.vue";
import BottomTable from "./BottomTable.vue";
import DrinkPercentage from "./DrinkPercentage.vue";

const props = defineProps<{
  form: Partial<FormEvent>;
  event?: Event | null;
}>();

const dayjs = useDayjs();
const api = useEventsApi();

const store = useEventsStore();
const { drinks, estimatedQuantity } = storeToRefs(store);

const loadingDelete = ref(false);

const headers = [
  { title: "Ações", key: "actions", maxWidth: 60 },
  { title: "Nome", key: "name", minWidth: 200 },
  { title: "Categoria", key: "category", minWidth: 200 },
  { title: "Custo", key: "calculated_cost", minWidth: 140 },
  { title: "Preço venda", key: "selling_price", minWidth: 140 },
  { title: "Marg. Lucro (%)", key: "profit_margin_percentage", minWidth: 155 },
  { title: "% do drink", key: "drink_percentage", minWidth: 150 },
];

watch(
  () => props.form,
  async () => {
    if (
      props.form.start_time &&
      props.form.end_time &&
      props.form.guest_count &&
      props.form.audience_profile
    ) {
      const validStartTime = dayjs(
        props.form.start_time,
        "DD/MM/YYYY HH:mm"
      ).isValid();
      const validEndTime = dayjs(
        props.form.end_time,
        "DD/MM/YYYY HH:mm"
      ).isValid();

      if (!validStartTime || !validEndTime) return;

      estimatedQuantity.value = await useCalculateEstimatedDrinkQuantity(
        props.form.audience_profile,
        new Date(formatDateTimeToDB(props.form.start_time)),
        new Date(formatDateTimeToDB(props.form.end_time)),
        props.form.guest_count
      );
    }
  },
  { deep: true }
);

async function removeDrink(item: TableDrinks) {
  if (props.event?.id && item.drink_id) {
    loadingDelete.value = true;

    const res = await api.deleteEventDrink(props.event?.id, item.drink_id);

    if (!res) {
      loadingDelete.value = false;
      return;
    }

    loadingDelete.value = false;
  }

  store.removeDrink(item);
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :disable-sort="true"
    :items="drinks"
    :hide-default-footer="true"
    class="border-sm rounded-xl"
  >
    <template #item.actions="{ item }">
      <v-btn
        color="red"
        size="small"
        variant="plain"
        icon="mdi-delete"
        :loading="loadingDelete"
        @click="removeDrink(item)"
      />
    </template>

    <template #item.name="{ item }">
      <Name :item="item" />
    </template>

    <template #item.calculated_cost="{ item }">
      {{ formatCurrency(item.calculated_cost) }}
    </template>

    <template #item.selling_price="{ item }">
      {{ formatCurrency(item.selling_price) }}
    </template>

    <template #item.profit_margin_percentage="{ item }">
      {{ item.profit_margin_percentage.toFixed(1) }}
    </template>

    <template #item.drink_percentage="{ item }">
      <DrinkPercentage
        v-model="item.drink_percentage"
        :drinks="drinks"
        :item="item"
      />
    </template>

    <template #bottom>
      <BottomTable />
    </template>
  </v-data-table>
</template>
