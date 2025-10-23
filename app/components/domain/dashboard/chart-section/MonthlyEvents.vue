<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useDisplay } from "vuetify";

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

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const reportsApi = useReportsApi();
const { mobile } = useDisplay();
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

    const periodParams = props.period
      ? {
          start_date: props.period.startDate,
          end_date: props.period.endDate,
        }
      : undefined;

    const res = await reportsApi.getMonthlyEvents(periodParams);

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

// Recarregar dados quando o período mudar
watch(() => props.period, loadMonthlyEventsChart, { deep: true });
</script>

<template>
  <v-card
    elevation="2"
    :class="mobile ? 'pa-2' : 'pa-4'"
    class="border-sm"
    rounded="xl"
    :min-height="mobile ? '300' : '400'"
  >
    <v-card-title
      :class="mobile ? 'pa-2' : 'pa-4'"
      class="d-flex align-center justify-space-between"
    >
      <span :class="mobile ? 'text-body-1' : 'text-h6'">Eventos por mês</span>
      <v-btn
        icon="mdi-refresh"
        variant="text"
        :size="mobile ? 'x-small' : 'small'"
        @click="loadMonthlyEventsChart"
      />
    </v-card-title>

    <v-card-text :class="mobile ? 'pa-2' : 'pa-4'">
      <v-skeleton-loader
        v-if="isLoading"
        type="image"
        :height="mobile ? 200 : 300"
      />

      <div
        v-else-if="!chartData.length"
        class="d-flex flex-column align-center justify-center"
        :style="mobile ? 'height: 200px' : 'height: 300px'"
      >
        <v-icon
          icon="mdi-calendar-alert"
          :size="mobile ? 48 : 64"
          color="grey-lighten-1"
          :class="mobile ? 'mb-2' : 'mb-4'"
        />
        <p
          :class="mobile ? 'text-body-1' : 'text-h6'"
          class="text-medium-emphasis"
        >
          Nenhum dado disponível
        </p>
        <p
          :class="mobile ? 'text-caption' : 'text-body-2'"
          class="text-medium-emphasis"
        >
          Adicione eventos para ver o gráfico
        </p>
      </div>

      <template v-else>
        <BarChart
          :data="chartData"
          :height="mobile ? 210 : 300"
          :categories="chartLegendCategories"
          :y-axis="['Número de Eventos']"
          :x-num-ticks="chartData.length"
          :y-num-ticks="mobile ? 5 : 10"
          :radius="mobile ? 5 : 10"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.TopCenter"
          :hide-legend="true"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
