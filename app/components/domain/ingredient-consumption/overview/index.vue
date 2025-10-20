<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useIngredientConsumption } from "~/composables/useIngredientConsumption";

import Card from "./Card.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, loadConsumptionOverview } = useIngredientConsumption();

// Dados reativos
const overview = ref({
  totalCost: 0,
  totalIngredients: 0,
  totalEvents: 0,
  averageCostPerEvent: 0,
});

async function fetchOverview() {
  const data = await loadConsumptionOverview(props.period);
  overview.value = data;
}

onMounted(fetchOverview);
watch(() => props.period, fetchOverview, { deep: true });
</script>

<template>
  <v-row>
    <!-- Custo Total -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Custo Total"
        :value="formatCurrency(overview.totalCost)"
        icon="mdi-currency-usd"
        color="error"
        :loading="loading"
      />
    </v-col>

    <!-- Total de Ingredientes -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Ingredientes Únicos"
        :value="overview.totalIngredients"
        icon="mdi-food-variant"
        color="info"
        :loading="loading"
      />
    </v-col>

    <!-- Total de Eventos -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Eventos Analisados"
        :value="overview.totalEvents"
        icon="mdi-calendar-check"
        color="primary"
        :loading="loading"
      />
    </v-col>

    <!-- Custo Médio por Evento -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Custo Médio/Evento"
        :value="formatCurrency(overview.averageCostPerEvent)"
        icon="mdi-chart-line"
        color="warning"
        :loading="loading"
      />
    </v-col>
  </v-row>
</template>
