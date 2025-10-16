<script lang="ts" setup>
interface ChartDataItem {
  month: string;
  "Número de Eventos": number;
}

interface ChartCategories {
  [key: string]: {
    name: string;
    color: string;
  };
}

const isLoading = ref(true);
const chartData = ref<ChartDataItem[]>([]);
const chartLegendCategories = ref<ChartCategories>({});

const xFormatter = (i: number): string => {
  return chartData.value[i]?.month || "";
};

const yFormatter = (tick: number) => tick.toString();

async function loadMonthlyEventsChart() {
  try {
    isLoading.value = true;

    const res = await $fetch("/api/reports/monthly-events");

    if (res && res.data) {
      chartData.value = res.data;
      chartLegendCategories.value = res.categories || {};
    } else {
      chartData.value = [];
      chartLegendCategories.value = {};
      console.warn("Nenhum dado de eventos mensais recebido.");
    }
  } catch (error) {
    console.error("Erro ao carregar o gráfico de eventos mensais:", error);
    chartData.value = [];
    chartLegendCategories.value = {};
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadMonthlyEventsChart();
});
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" min-height="400">
    <v-card-title class="d-flex align-center justify-space-between">
      Eventos por mês
      <v-btn
        icon="mdi-refresh"
        variant="text"
        size="small"
        @click="loadMonthlyEventsChart"
      />
    </v-card-title>

    <v-card-text>
      <v-skeleton-loader v-if="isLoading" type="image" height="300" />

      <div
        v-else-if="!chartData.length"
        class="d-flex flex-column align-center justify-center"
        style="height: 300px"
      >
        <v-icon
          icon="mdi-calendar-alert"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        />
        <p class="text-h6 text-medium-emphasis">Nenhum dado disponível</p>
        <p class="text-body-2 text-medium-emphasis">
          Adicione eventos para ver o gráfico
        </p>
      </div>

      <template v-else>
        <BarChart
          :data="chartData"
          :height="300"
          :categories="chartLegendCategories"
          :y-axis="['Número de Eventos']"
          :x-num-ticks="chartData.length"
          :y-num-ticks="10"
          :radius="10"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.Top"
          :hide-legend="true"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
