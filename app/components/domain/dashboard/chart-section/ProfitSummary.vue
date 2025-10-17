<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";

interface ProfitData {
  date: string;
  cost: string;
  revenue: string;
  profit: string;
}

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const reportsApi = useReportsApi();
const isLoading = ref(true);
const profitData = ref<ProfitData[]>([]);

async function loadProfitSummary() {
  try {
    isLoading.value = true;

    const periodParams = props.period
      ? {
          start_date: props.period.startDate,
          end_date: props.period.endDate,
        }
      : undefined;

    const res = await reportsApi.getProfitSummary(periodParams);

    if (Array.isArray(res) && res.length > 0) {
      profitData.value = res;
    }
  } catch (error) {
    console.error("Erro ao carregar o gráfico de lucro:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadProfitSummary();
});

// Recarregar dados quando o período mudar
watch(() => props.period, loadProfitSummary, { deep: true });
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" height="400">
    <v-card-title class="d-flex align-center justify-space-between">
      Resumo de Lucros
      <v-btn
        icon="mdi-refresh"
        variant="text"
        size="small"
        @click="loadProfitSummary"
      />
    </v-card-title>

    <v-card-text>
      <v-skeleton-loader v-if="isLoading" type="image" height="280" />

      <div
        v-else-if="!profitData.length"
        class="d-flex flex-column align-center justify-center"
        style="height: 280px"
      >
        <v-icon
          icon="mdi-chart-areaspline-variant"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        />
        <p class="text-h6 text-medium-emphasis">Nenhum dado disponível</p>
        <p class="text-body-2 text-medium-emphasis">
          Complete alguns eventos para ver o gráfico
        </p>
      </div>

      <template v-else>
        <AreaChart
          :data="profitData"
          :height="280"
          :categories="{
            profit: { name: 'Lucro', color: '#4caf50' },
            cost: { name: 'Custo', color: '#f44336' },
            revenue: { name: 'Receita', color: '#2196f3' },
          }"
          :y-axis="['Valor (R$)']"
          :x-num-ticks="profitData.length"
          :y-num-ticks="8"
          :y-grid-line="true"
          :legend-position="LegendPosition.Top"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
