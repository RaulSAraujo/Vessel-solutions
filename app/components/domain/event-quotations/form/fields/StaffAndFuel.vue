<script lang="ts" setup>
import type { EventQuotation } from "~/types/event-quotations";

const props = defineProps<{
  eventQuotation?: EventQuotation | null;
  errors: Partial<Record<string, string | undefined>>;
}>();

const store = useEventQuotationsStore();
const { eventDurationHours, staffCost, fuelCost } = storeToRefs(store);

const bartenderCost = ref(0);
const helperCost = ref(0);

const { value: distance } = useField<number>("distance");
const { value: bartenderHourlyRate } = useField<number | null>(
  "bartender_hourly_rate"
);
const { value: numBartenders } = useField<number | null>("num_bartenders");
const { value: helperHourlyRate } = useField<number | null>(
  "helper_hourly_rate"
);
const { value: numHelpers } = useField<number | null>("num_helpers");
const { value: fuelCostPerKm } = useField<number | null>("fuel_cost_per_km");

watch(
  [
    bartenderHourlyRate,
    numBartenders,
    eventDurationHours,
    helperHourlyRate,
    numHelpers,
  ],
  () => {
    bartenderCost.value =
      (bartenderHourlyRate.value || 0) *
      (numBartenders.value || 0) *
      eventDurationHours.value;

    helperCost.value =
      (helperHourlyRate.value || 0) *
      (numHelpers.value || 0) *
      eventDurationHours.value;

    staffCost.value = parseFloat(
      (bartenderCost.value + helperCost.value).toFixed(2)
    );
  }
);

watch([distance, fuelCostPerKm], () => {
  if (distance.value && fuelCostPerKm.value) {
    fuelCost.value = parseFloat(
      (distance.value * fuelCostPerKm.value).toFixed(2)
    );
  }
});

onMounted(async () => {
  if (props.eventQuotation) {
    distance.value = props.eventQuotation.distance;
    bartenderHourlyRate.value = props.eventQuotation.bartender_hourly_rate;
    numBartenders.value = props.eventQuotation.num_bartenders;
    helperHourlyRate.value = props.eventQuotation.helper_hourly_rate;
    numHelpers.value = props.eventQuotation.num_helpers;
    fuelCostPerKm.value = props.eventQuotation.fuel_cost_per_km;
  }
});
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="4">
      <div class="d-flex align-center ga-2">
        <UiNumberField
          id="tutorial-event-quotations-form-num-bartenders"
          v-model="numBartenders"
          label="Número de Bartenders"
          prepend-inner-icon="mdi-account-tie"
          :error-messages="errors.num_bartenders"
        />

        <UiNumberField
          id="tutorial-event-quotations-form-bartender-hourly-rate"
          v-model="bartenderHourlyRate"
          label="Taxa Horária do Bartender (R$)"
          prepend-inner-icon="mdi-currency-usd"
          :min="0"
          :step="0.01"
          :precision="2"
          :error-messages="errors.bartender_hourly_rate"
        />

        <div class="d-flex flex-column align-center">
          <span class="text-caption mr-1">Total:</span>
          <span class="text-caption font-weight-bold text-primary">
            {{ formatCurrency(bartenderCost) }}
          </span>
        </div>
      </div>
    </v-col>

    <v-col cols="12" md="4">
      <div class="d-flex align-center ga-2">
        <UiNumberField
          id="tutorial-event-quotations-form-num-helpers"
          v-model="numHelpers"
          label="Número de Ajudantes"
          prepend-inner-icon="mdi-account-group"
          :error-messages="errors.num_helpers"
        />

        <UiNumberField
          id="tutorial-event-quotations-form-helper-hourly-rate"
          v-model="helperHourlyRate"
          label="Taxa Horária dos Ajudantes (R$)"
          prepend-inner-icon="mdi-currency-usd"
          :min="0"
          :step="0.01"
          :precision="2"
          :error-messages="errors.helper_hourly_rate"
        />

        <div class="d-flex flex-column align-center">
          <span class="text-caption mr-1">Total:</span>
          <span class="text-caption font-weight-bold text-primary">
            {{ formatCurrency(helperCost) }}
          </span>
        </div>
      </div>
    </v-col>

    <v-col id="tutorial-event-quotations-form-distance" cols="12" md="2">
      <UiNumberField
        v-model="distance"
        label="Km"
        prepend-inner-icon="mdi-road-variant"
        :min="0"
        :precision="2"
        :error-messages="errors.distance"
      />
    </v-col>

    <v-col id="tutorial-event-quotations-form-fuel-cost" cols="12" md="2">
      <UiNumberField
        v-model="fuelCostPerKm"
        label="Custo Combustível/km (R$)"
        prepend-inner-icon="mdi-gas-station"
        :min="0"
        :precision="2"
        :error-messages="errors.fuel_cost_per_km"
      />
    </v-col>
  </v-row>
</template>
