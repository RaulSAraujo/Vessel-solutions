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
    <ReportsHeader
      title="Lucratividade de Eventos"
      description="Análise detalhada da lucratividade e performance financeira dos eventos"
      :period="currentPeriod"
      @update:period="updatePeriod"
    />

    <v-container fluid class="py-6">
      <!-- Overview Cards -->
      <ProfitabilityOverview :period="currentPeriod" />

      <v-row class="mt-6">
        <!-- Gráfico de Tendência -->
        <v-col cols="12" lg="8">
          <ProfitabilityChart :period="currentPeriod" />
        </v-col>

        <!-- Insights -->
        <v-col cols="12" lg="4">
          <ProfitabilityInsights :period="currentPeriod" />
        </v-col>
      </v-row>

      <!-- Tabela Detalhada -->
      <v-row class="mt-6">
        <v-col cols="12">
          <ProfitabilityTable :period="currentPeriod" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
