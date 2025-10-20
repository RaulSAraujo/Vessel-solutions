<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useIngredientConsumption } from "~/composables/useIngredientConsumption";

// Components
import Card from "./Card.vue";
import ProgressDistribution from "./ProgressDistribution.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, formatQuantity, loadConsumptionInsights } =
  useIngredientConsumption();

// Dados reativos
const insights = ref({
  mostUsedIngredient: null as any,
  mostExpensiveIngredient: null as any,
  averageCostPerEvent: 0,
  totalIngredients: 0,
  totalEvents: 0,
  costDistribution: {
    high: 0,
    medium: 0,
    low: 0,
  },
});

async function fetchInsights() {
  const data = await loadConsumptionInsights(props.period);
  insights.value = data;
}

onMounted(fetchInsights);

watch(() => props.period, fetchInsights, { deep: true });
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" height="450">
    <h3 class="text-h6 font-weight-bold mb-4">Insights de Consumo</h3>

    <div
      v-if="loading"
      class="d-flex align-center justify-center"
      style="height: 300px"
    >
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <div v-else class="space-y-4">
      <!-- Ingrediente Mais Usado -->
      <Card
        title="Mais Usado"
        :subtitle="insights.mostUsedIngredient?.name"
        :value="
          formatQuantity(
            insights.mostUsedIngredient?.totalQuantity || 0,
            insights.mostUsedIngredient?.unit || ''
          )
        "
        icon="mdi-food-variant"
        color="primary"
      />

      <!-- Ingrediente Mais Caro -->
      <Card
        title="Mais Caro"
        :subtitle="insights.mostExpensiveIngredient?.name"
        :value="
          formatCurrency(insights.mostExpensiveIngredient?.totalCost || 0)
        "
        icon="mdi-currency-usd"
        color="error"
      />

      <!-- Custo Médio por Evento -->
      <Card
        title="Custo Médio/Evento"
        :value="formatCurrency(insights.averageCostPerEvent)"
        icon="mdi-chart-line"
        color="warning"
      />

      <!-- Distribuição de Custos -->
      <ProgressDistribution
        :items="[
          {
            label: 'Alto Custo',
            value: insights.costDistribution.high,
            total: insights.totalIngredients,
            color: 'error',
          },
          {
            label: 'Médio Custo',
            value: insights.costDistribution.medium,
            total: insights.totalIngredients,
            color: 'warning',
          },
          {
            label: 'Baixo Custo',
            value: insights.costDistribution.low,
            total: insights.totalIngredients,
            color: 'success',
          },
        ]"
        :loading="loading"
      />
    </div>
  </v-card>
</template>
