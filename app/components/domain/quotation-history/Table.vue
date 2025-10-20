<script setup lang="ts">
import { watch, onMounted } from "vue";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
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
} = useQuotationHistory();

async function fetchQuotations() {
  await loadQuotationData(props.period);
}

// Watchers
watch(() => props.period, fetchQuotations, { deep: true });

onMounted(fetchQuotations);
</script>

<template>
  <UiTable
    :headers="headers"
    :items="quotationsWithCalculations"
    :loading="loading"
    title="Histórico de Cotações"
    class="elevation-0 pb-2"
    density="compact"
    :items-per-page="25"
  >
    <template #buttons>
      <v-btn
        color="primary"
        variant="plain"
        size="small"
        icon="mdi-download"
        @click="handleExport"
      />
    </template>

    <!-- Nome do Fornecedor -->
    <template #item.supplier_name="{ item }">
      <div class="d-flex align-center">
        <v-avatar size="32" color="warning" class="me-3">
          <v-icon size="16" color="white">mdi-truck-delivery</v-icon>
        </v-avatar>
        <div>
          <div class="text-body-2 font-weight-medium">
            {{ item.supplier_name }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.suppliers?.contact_person || "N/A" }}
          </div>
        </div>
      </div>
    </template>

    <!-- Data -->
    <template #item.created_at="{ item }">
      <div class="text-body-2">
        {{ formatDate(item.created_at) }}
      </div>
    </template>

    <!-- Valor Total -->
    <template #item.total_value="{ item }">
      <div class="text-body-2 font-weight-medium text-success">
        {{ formatCurrency(parseFloat(item.total_value || "0")) }}
      </div>
    </template>

    <!-- Contagem de Itens -->
    <template #item.items_count="{ item }">
      <div class="text-body-2 font-weight-medium text-info">
        {{ item.items_count }} itens
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
