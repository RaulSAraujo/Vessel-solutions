<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useProfitability } from "~/composables/useProfitability";

// Components
import Card from "./Card.vue";
import ProgressDistribution from "./ProgressDistribution.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, formatPercentage, loadProfitabilityInsights } =
  useProfitability();

// Dados reativos
const insights = ref({
  mostProfitableEvent: null as any,
  leastProfitableEvent: null as any,
  averageProfitMargin: 0,
  totalEvents: 0,
  profitableEvents: 0,
  unprofitableEvents: 0,
});

async function fetchInsights() {
  const data = await loadProfitabilityInsights(props.period);
  insights.value = data;
}

onMounted(fetchInsights);
watch(() => props.period, fetchInsights, { deep: true });
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" height="450">
    <h3 class="text-h6 font-weight-bold mb-4">Insights de Lucratividade</h3>

    <div
      v-if="loading"
      class="d-flex align-center justify-center"
      style="height: 300px"
    >
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <div v-else class="space-y-4">
      <!-- Evento Mais Lucrativo -->
      <Card
        title="Mais Lucrativo"
        :subtitle="insights.mostProfitableEvent?.name"
        :value="`${formatCurrency(
          insights.mostProfitableEvent?.profit || 0
        )} (${insights.mostProfitableEvent?.margin?.toFixed(1)}%)`"
        icon="mdi-trending-up"
        color="success"
      />

      <!-- Evento Menos Lucrativo -->
      <Card
        title="Menos Lucrativo"
        :subtitle="insights.leastProfitableEvent?.name"
        :value="`${formatCurrency(
          insights.leastProfitableEvent?.profit || 0
        )} (${insights.leastProfitableEvent?.margin?.toFixed(1)}%)`"
        icon="mdi-trending-down"
        color="warning"
      />

      <!-- Margem Média -->
      <Card
        title="Margem Média"
        :value="formatPercentage(insights.averageProfitMargin)"
        icon="mdi-percent"
        color="info"
      />

      <!-- Distribuição de Eventos -->
      <ProgressDistribution
        :items="[
          {
            label: 'Lucrativos',
            value: insights.profitableEvents,
            total: insights.totalEvents,
            color: 'success',
          },
          {
            label: 'Não Lucrativos',
            value: insights.unprofitableEvents,
            total: insights.totalEvents,
            color: 'error',
          },
        ]"
        :loading="loading"
      />
    </div>
  </v-card>
</template>
