<script setup lang="ts">
import { usePeriodFilter } from "~/composables/usePeriodFilter";

// Meta
definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Composables
const { currentPeriod, updatePeriod } = usePeriodFilter();

// Componentes
import ReportsHeader from "~/components/ReportsHeader.vue";
import QuotationHistoryOverview from "~/components/domain/quotation-history/overview/index.vue";
import QuotationHistoryChart from "~/components/domain/quotation-history/chart/index.vue";
import QuotationHistoryTable from "~/components/domain/quotation-history/Table.vue";
import QuotationHistoryInsights from "~/components/domain/quotation-history/insights/index.vue";

// Breadcrumbs
const breadcrumbs = [
  { title: "Dashboard", to: "/dashboard" },
  { title: "Relatórios", to: "/reports" },
  { title: "Histórico de Cotações", to: "/reports/quotation-history" },
];
</script>

<template>
  <div>
    <!-- Header com filtros -->
    <ReportsHeader
      title="Histórico de Cotações"
      description="Análise do histórico de cotações e variação de preços de fornecedores"
      :breadcrumbs="breadcrumbs"
      :period="currentPeriod"
      @update:period="updatePeriod"
    />

    <v-container fluid class="py-6">
      <!-- Overview Cards -->
      <QuotationHistoryOverview :period="currentPeriod" />

      <v-row class="mt-6">
        <!-- Gráfico de Tendência de Preços -->
        <v-col cols="12" lg="8">
          <QuotationHistoryChart :period="currentPeriod" />
        </v-col>

        <!-- Insights -->
        <v-col cols="12" lg="4">
          <QuotationHistoryInsights :period="currentPeriod" />
        </v-col>
      </v-row>

      <!-- Tabela Detalhada -->
      <v-row class="mt-6">
        <v-col cols="12">
          <QuotationHistoryTable :period="currentPeriod" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
