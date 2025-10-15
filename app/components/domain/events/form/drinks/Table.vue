<script lang="ts" setup>
import dayjs from "dayjs";
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { TableDrinks } from "~/types/event-drinks";
import type { FormEvent, Datum as Event } from "~/types/events";

const props = defineProps<{
  form: Partial<FormEvent>;
  event?: Event | null;
  drinks: TableDrinks[];
}>();

const emit = defineEmits(["delete"]);

const api = useEventsApi();

const estimatedQuantity = ref(0);
const loadingDelete = ref(false);
const totalCurrentPercentage = computed(() => {
  return props.drinks.reduce(
    (sum, drink) => sum + (drink.drink_percentage || 0),
    0
  );
});

const headers = [
  { title: "Ações", key: "actions", maxWidth: 60 },
  { title: "Nome", key: "name", minWidth: 200 },
  { title: "Categoria", key: "category", minWidth: 200 },
  { title: "Preço venda", key: "selling_price", minWidth: 140 },
  { title: "Marg. Lucro (%)", key: "profit_margin_percentage", minWidth: 155 },
  { title: "% Bebida", key: "drink_percentage", minWidth: 150 },
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

/**
 * Calcula a porcentagem máxima permitida para um drink específico,
 * garantindo que a soma total de todos os drinks não exceda 100%.
 *
 * @param {object} item - O objeto do drink que está sendo editado (contém drink_percentage).
 * @returns {number} - O valor máximo que o input de porcentagem pode aceitar para este drink.
 */
const getMaxPercentageForInput = (item: TableDrinks) => {
  // Verifica se o store e os drinks estão disponíveis
  if (!item || !props.drinks) {
    return 100; // Se não há drinks, o máximo é 100%
  }

  // Calcula a soma das porcentagens de TODOS os outros drinks, excluindo o 'item'.
  const sumOfOtherDrinksPercentages = props.drinks.reduce((sum, drink) => {
    if (drink !== item) {
      return sum + (drink.drink_percentage || 0);
    }

    return sum;
  }, 0);

  // O valor máximo que o 'item' pode ter é 100% menos a soma dos outros drinks.
  const maxAllowed = 100 - sumOfOtherDrinksPercentages;

  // Garante que o valor máximo não seja negativo (caso a soma dos outros já exceda 100%)
  // e que não exceda 100 (embora 100 - sum já cuide disso se sum for positivo).
  return Math.max(0, maxAllowed);
};

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

  emit("delete", item);
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
      <v-list-item
        :title="item.name"
        density="compact"
        lines="one"
        class="px-0"
      >
        <template #prepend>
          <v-menu
            v-if="item.image_url"
            offset="15"
            location="top end"
            :open-on-hover="true"
            scroll-strategy="close"
            open-delay="500"
          >
            <template #activator="{ props: bind }">
              <v-avatar
                v-bind="bind"
                :image="item.image_url"
                start
                size="28"
                color="grey"
                density="compact"
                class="mr-n2"
              />
            </template>

            <v-card width="200" max-height="200" rounded="lg">
              <v-img :src="item.image_url" />
            </v-card>
          </v-menu>

          <v-avatar
            v-else
            start
            size="28"
            color="grey"
            density="compact"
            class="mr-n2"
          >
            <v-icon color="white" size="16">mdi-image</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </template>

    <template #item.selling_price="{ item }">
      {{ formatCurrency(item.selling_price) }}
    </template>

    <template #item.profit_margin_percentage="{ item }">
      {{ item.profit_margin_percentage.toFixed(1) }}
    </template>

    <template #item.drink_percentage="{ item }">
      <UiNumberField
        v-model="item.drink_percentage"
        :min="0"
        :max="getMaxPercentageForInput(item)"
      />
    </template>

    <template #bottom>
      <v-toolbar
        density="compact"
        rounded="b-xl"
        color="transparent"
        border="t-thin"
      >
        <template #title>
          <div class="d-flex ga-4">
            <div class="d-flex align-center">
              <span class="text-button mr-1">Quantidade estimada:</span>

              <span class="text-h6 font-weight-bold text-primary">
                {{ estimatedQuantity }}
              </span>
            </div>

            <div class="d-flex align-center">
              <span class="text-button mr-1">Total (%):</span>

              <span class="text-h6 font-weight-bold text-primary">
                {{ totalCurrentPercentage }}
              </span>
            </div>
          </div>
        </template>
      </v-toolbar>
    </template>
  </v-data-table>
</template>
