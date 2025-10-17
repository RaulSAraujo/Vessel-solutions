<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";

interface EventTrendData {
  month: string;
  events: number;
  revenue: number;
}

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const reportsApi = useReportsApi();
const isLoading = ref(true);
const eventTrendData = ref<EventTrendData[]>([]);

const categories = {
  events: {
    name: "Eventos",
    color: "#3b82f6",
  },
  revenue: {
    name: "Receita (R$)",
    color: "#10b981",
  },
};

const xFormatter = (i: number): string => {
  return eventTrendData.value[i]?.month || "";
};

const yFormatter = (tick: number) => tick.toString();

async function loadEventTrendData() {
  try {
    isLoading.value = true;

    const periodParams = props.period
      ? {
          start_date: props.period.startDate,
          end_date: props.period.endDate,
        }
      : undefined;

    const res = await reportsApi.getEventTrend(periodParams);

    if (Array.isArray(res) && res.length > 0) {
      eventTrendData.value = res;
    }
  } catch (error) {
    console.error("Erro ao carregar dados de tendência:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadEventTrendData();
});

// Recarregar dados quando o período mudar
watch(() => props.period, loadEventTrendData, { deep: true });
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" height="450">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon icon="mdi-chart-line" class="mr-2" color="primary" />
        Tendência de Eventos e Receita
      </div>
      <v-btn
        icon="mdi-refresh"
        variant="text"
        size="small"
        :loading="isLoading"
        @click="loadEventTrendData"
      />
    </v-card-title>

    <v-card-text>
      <v-skeleton-loader v-if="isLoading" type="image" height="300" />

      <div
        v-else-if="!eventTrendData.length"
        class="d-flex flex-column align-center justify-center"
        style="height: 300px"
      >
        <v-icon
          icon="mdi-chart-line-variant"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        />
        <p class="text-h6 text-medium-emphasis">Nenhum dado disponível</p>
        <p class="text-body-2 text-medium-emphasis">
          Adicione eventos para ver a tendência
        </p>
      </div>

      <template v-else>
        <LineChart
          :data="eventTrendData"
          :height="300"
          :categories="categories"
          :y-axis="['events', 'revenue']"
          :x-num-ticks="eventTrendData.length"
          :y-num-ticks="6"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.Top"
          :hide-legend="false"
          x-label="Mês"
          y-label="Quantidade / Valor"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
