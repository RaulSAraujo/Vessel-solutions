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
      id="tutorial-quotation-history-header"
      title="Histórico de Cotações Unitárias"
      description="Análise do histórico de cotações unitárias e variação de preços de fornecedores"
      :period="currentPeriod"
      @update:period="updatePeriod"
    />

    <v-container fluid class="py-6">
      <!-- Aviso sobre Cotações Unitárias -->
      <v-alert id="tutorial-quotation-history-info" type="info" variant="tonal" class="mb-6" rounded="xl">
        <template #prepend>
          <v-icon>mdi-information</v-icon>
        </template>
        <div class="text-body-1">
          <strong>Cotações Unitárias:</strong> Cada cotação representa o preço
          por unidade de um ingrediente específico. O valor total é igual ao
          preço por unidade cotado pelo fornecedor.
        </div>
      </v-alert>

      <!-- Overview Cards -->
      <div id="tutorial-quotation-history-overview">
        <QuotationHistoryOverview :period="currentPeriod" />
      </div>

      <v-row class="mt-6">
        <!-- Gráfico de Tendência de Preços -->
        <v-col cols="12" lg="8">
          <div id="tutorial-quotation-history-chart">
            <QuotationHistoryChart :period="currentPeriod" />
          </div>
        </v-col>

        <!-- Insights -->
        <v-col cols="12" lg="4">
          <div id="tutorial-quotation-history-insights">
            <QuotationHistoryInsights :period="currentPeriod" />
          </div>
        </v-col>
      </v-row>

      <!-- Tabela Detalhada -->
      <v-row class="mt-6">
        <v-col cols="12">
          <div id="tutorial-quotation-history-table">
            <QuotationHistoryTable :period="currentPeriod" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
