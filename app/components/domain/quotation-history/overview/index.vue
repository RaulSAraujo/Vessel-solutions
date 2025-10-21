<script setup lang="ts">
import { watch, onMounted } from "vue";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useQuotationHistory } from "~/composables/useQuotationHistory";

import Card from "./Card.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, overview, loadQuotationData } = useQuotationHistory();

async function fetchOverview() {
  await loadQuotationData(props.period);
}

onMounted(fetchOverview);
watch(() => props.period, fetchOverview, { deep: true });
</script>

<template>
  <v-row>
    <!-- Total de Cotações -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Total de Cotações"
        :value="overview.totalQuotations"
        icon="mdi-file-document-multiple"
        color="primary"
        :loading="loading"
      />
    </v-col>

    <!-- Valor Total das Cotações -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Valor Total das Cotações"
        :value="formatCurrency(overview.totalValue)"
        icon="mdi-currency-usd"
        color="success"
        :loading="loading"
      />
    </v-col>

    <!-- Preço Médio por Unidade -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Preço Médio por Unidade"
        :value="formatCurrency(overview.averageQuotationValue)"
        icon="mdi-chart-line"
        color="info"
        :loading="loading"
      />
    </v-col>

    <!-- Fornecedores -->
    <v-col cols="12" sm="6" md="3">
      <Card
        title="Fornecedores"
        :value="overview.totalSuppliers"
        icon="mdi-truck-delivery"
        color="warning"
        :loading="loading"
      />
    </v-col>
  </v-row>
</template>
