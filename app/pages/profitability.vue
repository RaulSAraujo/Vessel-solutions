<script setup lang="ts">
import { usePeriodFilter } from "~/composables/usePeriodFilter";

// Meta
definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Composables
const { currentPeriod, updatePeriod } = usePeriodFilter();
</script>

<template>
  <div>
    <!-- Header com filtros -->
    <HeaderPeriod
      id="tutorial-profitability-header"
      title="Lucratividade de Eventos"
      description="Análise detalhada da lucratividade e performance financeira dos eventos"
      :period="currentPeriod"
      @update:period="updatePeriod"
    />

    <v-container fluid class="py-6">
      <!-- Overview Cards -->
      <div id="tutorial-profitability-overview">
      <ProfitabilityOverview :period="currentPeriod" />
      </div>

      <v-row class="mt-6">
        <!-- Gráfico de Tendência -->
        <v-col cols="12" lg="8">
          <div id="tutorial-profitability-chart">
          <ProfitabilityChart :period="currentPeriod" />
          </div>
        </v-col>

        <!-- Insights -->
        <v-col cols="12" lg="4">
          <div id="tutorial-profitability-insights">
          <ProfitabilityInsights :period="currentPeriod" />
          </div>
        </v-col>
      </v-row>

      <!-- Tabela Detalhada -->
      <v-row class="mt-6">
        <v-col cols="12">
          <div id="tutorial-profitability-table">
          <ProfitabilityTable :period="currentPeriod" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
