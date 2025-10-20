<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useIngredientConsumption } from "~/composables/useIngredientConsumption";
import type { IngredientConsumption } from "~/composables/useIngredientConsumption";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, formatQuantity, loadConsumptionData, exportToCSV } =
  useIngredientConsumption();

// Função para formatar moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Dados reativos
const consumptionData = ref<IngredientConsumption[]>([]);
const totalItems = ref(0);
const itemsPerPage = ref<10 | 25 | 50>(10);
const currentPage = ref(1);

// Headers da tabela
const headers = [
  { title: "Ingrediente", key: "name", sortable: true },
  { title: "Unidade", key: "unit", sortable: true },
  { title: "Quantidade Total", key: "totalQuantity", sortable: true },
  { title: "Custo Total", key: "totalCost", sortable: true },
  { title: "Custo/Unidade", key: "averageCostPerUnit", sortable: true },
  { title: "Eventos", key: "eventsUsed", sortable: true },
  { title: "Custo/Evento", key: "costPerEvent", sortable: true },
];

async function fetchConsumptionData() {
  const response = await loadConsumptionData(props.period);
  if (response?.data) {
    consumptionData.value = response.data;
    totalItems.value = response.data.length;
  } else {
    consumptionData.value = [];
    totalItems.value = 0;
  }
}

// Computed para adicionar custo por evento
const consumptionDataWithCalculations = computed(() => {
  return consumptionData.value.map((item) => ({
    ...item,
    costPerEvent: item.eventsUsed > 0 ? item.totalCost / item.eventsUsed : 0,
  }));
});

const handleExport = () => {
  exportToCSV(consumptionData.value);
};

// Watchers
watch(() => props.period, fetchConsumptionData, { deep: true });

onMounted(fetchConsumptionData);
</script>

<template>
  <UiTable
    v-model:page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="consumptionDataWithCalculations"
    item-value="name"
    :items-length="totalItems"
    :loading="loading"
    title="Consumo Detalhado de Ingredientes"
    class="elevation-0 pb-2"
    density="compact"
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

    <!-- Nome do Ingrediente -->
    <template #item.name="{ item }">
      <div class="d-flex align-center">
        <v-avatar size="32" color="info" class="me-3">
          <v-icon size="16" color="white">mdi-food-variant</v-icon>
        </v-avatar>
        <div>
          <div class="text-body-2 font-weight-medium">
            {{ item.name }}
          </div>
        </div>
      </div>
    </template>

    <!-- Unidade -->
    <template #item.unit="{ item }">
      <v-chip size="small" variant="tonal" color="info">
        {{ item.unit }}
      </v-chip>
    </template>

    <!-- Quantidade Total -->
    <template #item.totalQuantity="{ item }">
      <div class="text-body-2 font-weight-medium">
        {{ formatQuantity(item.totalQuantity, item.unit) }}
      </div>
    </template>

    <!-- Custo Total -->
    <template #item.totalCost="{ item }">
      <div class="text-body-2 font-weight-medium text-error">
        {{ formatCurrency(item.totalCost) }}
      </div>
    </template>

    <!-- Custo por Unidade -->
    <template #item.averageCostPerUnit="{ item }">
      <div class="text-body-2 text-medium-emphasis">
        {{ formatCurrency(item.averageCostPerUnit) }}
      </div>
    </template>

    <!-- Eventos -->
    <template #item.eventsUsed="{ item }">
      <div class="text-body-2 font-weight-medium text-primary">
        {{ item.eventsUsed }}
      </div>
    </template>

    <!-- Custo por Evento -->
    <template #item.costPerEvent="{ item }">
      <div class="text-body-2 font-weight-medium text-warning">
        {{ formatCurrency(item.costPerEvent) }}
      </div>
    </template>
  </UiTable>
</template>
