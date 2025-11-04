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
      id="tutorial-ingredient-consumption-header"
      title="Consumo de Ingredientes"
      description="Análise do consumo e utilização de ingredientes nos eventos"
      :period="currentPeriod"
      @update:period="updatePeriod"
    />

    <v-container fluid class="py-6">
      <!-- Overview Cards -->
      <div id="tutorial-ingredient-consumption-overview">
      <IngredientConsumptionOverview :period="currentPeriod" />
      </div>

      <v-row class="mt-6">
        <!-- Gráfico de Consumo -->
        <v-col cols="12" lg="8">
          <div id="tutorial-ingredient-consumption-chart">
          <IngredientConsumptionChart :period="currentPeriod" />
          </div>
        </v-col>

        <!-- Insights -->
        <v-col cols="12" lg="4">
          <div id="tutorial-ingredient-consumption-insights">
          <IngredientConsumptionInsights :period="currentPeriod" />
          </div>
        </v-col>
      </v-row>

      <!-- Tabela Detalhada -->
      <v-row class="mt-6">
        <v-col cols="12">
          <div id="tutorial-ingredient-consumption-table">
          <IngredientConsumptionTable :period="currentPeriod" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
