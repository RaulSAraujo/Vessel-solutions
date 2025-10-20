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
      title="Consumo de Ingredientes"
      description="Análise do consumo e utilização de ingredientes nos eventos"
      :period="currentPeriod"
      @update:period="updatePeriod"
    />

    <v-container fluid class="py-6">
      <!-- Overview Cards -->
      <IngredientConsumptionOverview :period="currentPeriod" />

      <v-row class="mt-6">
        <!-- Gráfico de Consumo -->
        <v-col cols="12" lg="8">
          <IngredientConsumptionChart :period="currentPeriod" />
        </v-col>

        <!-- Insights -->
        <v-col cols="12" lg="4">
          <IngredientConsumptionInsights :period="currentPeriod" />
        </v-col>
      </v-row>

      <!-- Tabela Detalhada -->
      <v-row class="mt-6">
        <v-col cols="12">
          <IngredientConsumptionTable :period="currentPeriod" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
