<script setup lang="ts">
import { watch, onMounted } from "vue";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useQuotationHistory } from "~/composables/useQuotationHistory";

import Card from "./Card.vue";
import ProgressDistribution from "./ProgressDistribution.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, insights, loadQuotationData } = useQuotationHistory();

async function fetchInsights() {
  await loadQuotationData(props.period);
}

onMounted(fetchInsights);

watch(() => props.period, fetchInsights, { deep: true });
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" height="470">
    <h3 class="text-h6 font-weight-bold mb-4">
      Insights de Cotações Unitárias
    </h3>

    <div
      v-if="loading"
      class="d-flex align-center justify-center"
      style="height: 300px"
    >
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <div v-else class="space-y-4">
      <!-- Top Fornecedor -->
      <Card
        title="Top Fornecedor"
        :subtitle="insights.topSupplier?.name"
        :value="`${formatCurrency(insights.topSupplier?.totalValue || 0)} (${
          insights.topSupplier?.totalQuotations || 0
        } cotações)`"
        icon="mdi-trophy"
        color="success"
      />

      <!-- Preço Médio por Unidade -->
      <Card
        title="Preço Médio por Unidade"
        :value="formatCurrency(insights.averageQuotationValue)"
        icon="mdi-chart-line"
        color="info"
      />

      <!-- Total de Fornecedores -->
      <Card
        title="Total de Fornecedores"
        :value="insights.totalSuppliers"
        icon="mdi-account-group"
        color="primary"
      />

      <!-- Variação de Preços -->
      <ProgressDistribution
        :items="[
          {
            label: 'Alta Variação (>20%)',
            value: insights.priceVariation.high,
            total:
              insights.priceVariation.high +
              insights.priceVariation.medium +
              insights.priceVariation.low,
            color: 'error',
          },
          {
            label: 'Média Variação (10-20%)',
            value: insights.priceVariation.medium,
            total:
              insights.priceVariation.high +
              insights.priceVariation.medium +
              insights.priceVariation.low,
            color: 'warning',
          },
          {
            label: 'Baixa Variação (<10%)',
            value: insights.priceVariation.low,
            total:
              insights.priceVariation.high +
              insights.priceVariation.medium +
              insights.priceVariation.low,
            color: 'success',
          },
        ]"
        :loading="loading"
      />
    </div>
  </v-card>
</template>
