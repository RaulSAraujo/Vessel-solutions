<script setup lang="ts">
import { watch, onMounted } from "vue";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import type { VDataTableServerOptions } from "~/types/data-table";
import { useQuotationHistory } from "~/composables/useQuotationHistory";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const {
  loading,
  headers,
  quotationsWithCalculations,
  handleExport,
  loadQuotationData,
  page,
  totalItems,
  itemsPerPage,
} = useQuotationHistory();

async function fetchQuotations(options?: VDataTableServerOptions) {
  await loadQuotationData(props.period, options);
}

// Watchers
watch(
  () => props.period,
  () => fetchQuotations(),
  { deep: true }
);

onMounted(() => fetchQuotations());
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="quotationsWithCalculations"
    :loading="loading"
    :total-items="totalItems"
    title="Histórico de Cotações Unitárias"
    class="elevation-0 pb-2"
    density="compact"
    @update:options="fetchQuotations"
  >
    <template #buttons>
      <v-btn icon="mdi-information" variant="text" size="small" color="info">
        <v-icon>mdi-information</v-icon>
        <v-tooltip activator="parent" location="top">
          <div class="text-body-2">
            <strong>Cotações Unitárias:</strong><br />
            Cada linha representa uma cotação unitária de um ingrediente.<br />
            O preço é o valor cotado por unidade específica.
          </div>
        </v-tooltip>
      </v-btn>

      <v-btn
        color="primary"
        variant="plain"
        size="small"
        icon="mdi-download"
        @click="handleExport"
      />
    </template>

    <!-- Nome do Fornecedor -->
    <template #item.suppliers.name="{ item }">
      <div class="d-flex align-center">
        <v-avatar size="32" color="warning" class="me-3">
          <v-icon size="16" color="white">mdi-truck-delivery</v-icon>
        </v-avatar>
        <div>
          <div class="text-body-2 font-weight-medium">
            {{ item.suppliers?.name || "N/A" }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.suppliers?.phone || "N/A" }}
          </div>
        </div>
      </div>
    </template>

    <!-- Nome do Ingrediente -->
    <template #item.ingredients.name="{ item }">
      <div class="text-body-2 font-weight-medium">
        {{ item.ingredients?.name || "N/A" }}
      </div>
    </template>

    <!-- Quantidade Unitária -->
    <template #item.purchase_quantity="{ item }">
      <div class="text-body-2">
        {{ item.purchase_quantity }}
      </div>
    </template>

    <!-- Unidade -->
    <template #item.units.name="{ item }">
      <div class="text-body-2">
        {{ item.units?.name || "N/A" }}
        <span class="text-caption text-medium-emphasis">
          ({{ item.units?.abbreviation || "N/A" }})
        </span>
      </div>
    </template>

    <!-- Data da Cotação -->
    <template #item.quotation_date="{ item }">
      <div class="text-body-2">
        {{ item.quotation_date ? formatDate(item.quotation_date) : "N/A" }}
      </div>
    </template>

    <!-- Valor Total (Preço por Unidade) -->
    <template #item.total_value="{ item }">
      <div class="text-body-2 font-weight-medium text-success">
        {{ formatCurrency(item.purchase_price) }}
      </div>
    </template>

    <!-- Data de Criação -->
    <template #item.created_at="{ item }">
      <div class="text-body-2">
        {{ formatDate(item.created_at) }}
      </div>
    </template>

    <!-- Ações -->
    <template #item.actions>
      <v-btn
        icon="mdi-eye"
        variant="text"
        size="small"
        color="primary"
        @click="() => {}"
      >
        <v-icon>mdi-eye</v-icon>
        <v-tooltip activator="parent" location="top"> Ver Detalhes </v-tooltip>
      </v-btn>
    </template>
  </UiTable>
</template>
