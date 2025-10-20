<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useProfitability } from "~/composables/useProfitability";

import Card from "./Card.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, formatPercentage, loadProfitabilityOverview } =
  useProfitability();

// Dados reativos
const overview = ref({
  totalRevenue: 0,
  totalCost: 0,
  totalProfit: 0,
  profitMargin: 0,
  averageEventValue: 0,
  totalEvents: 0,
});

async function fetchOverview() {
  const data = await loadProfitabilityOverview(props.period);
  overview.value = data;
}

onMounted(fetchOverview);
watch(() => props.period, fetchOverview, { deep: true });
</script>

<template>
  <v-row>
    <!-- Receita Total -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Receita Total"
        :value="formatCurrency(overview.totalRevenue)"
        icon="mdi-currency-usd"
        color="success"
        :loading="loading"
      />
    </v-col>

    <!-- Lucro Total -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Lucro Total"
        :value="formatCurrency(overview.totalProfit)"
        icon="mdi-trending-up"
        color="primary"
        :loading="loading"
      />
    </v-col>

    <!-- Margem de Lucro -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Margem de Lucro"
        :value="formatPercentage(overview.profitMargin)"
        icon="mdi-percent"
        color="info"
        :loading="loading"
      />
    </v-col>

    <!-- Ticket Médio -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Ticket Médio"
        :value="formatCurrency(overview.averageEventValue)"
        icon="mdi-chart-line"
        color="warning"
        :loading="loading"
      />
    </v-col>
  </v-row>
</template>
