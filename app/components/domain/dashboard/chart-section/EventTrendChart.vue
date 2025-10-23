<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useDisplay } from "vuetify";

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
const { mobile } = useDisplay();
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
  <v-card
    elevation="2"
    :class="mobile ? 'pa-2' : 'pa-4'"
    class="border-sm"
    rounded="xl"
    :height="mobile ? '350' : '470'"
  >
    <v-card-title
      :class="mobile ? 'pa-2' : 'pa-4'"
      class="d-flex align-center justify-space-between"
    >
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-chart-line"
          :class="mobile ? 'mr-1' : 'mr-2'"
          color="primary"
        />
        <span :class="mobile ? 'text-caption' : 'text-h6'"
          >Tendência de Eventos e Receita</span
        >
      </div>
      <v-btn
        icon="mdi-refresh"
        variant="text"
        :size="mobile ? 'x-small' : 'small'"
        :loading="isLoading"
        @click="loadEventTrendData"
      />
    </v-card-title>

    <v-card-text :class="mobile ? 'pa-2' : 'pa-4'">
      <v-skeleton-loader
        v-if="isLoading"
        type="image"
        :height="mobile ? 200 : 340"
      />

      <div
        v-else-if="!eventTrendData.length"
        class="d-flex flex-column align-center justify-center"
        :style="mobile ? 'height: 200px' : 'height: 300px'"
      >
        <v-icon
          icon="mdi-chart-line-variant"
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
          Adicione eventos para ver a tendência
        </p>
      </div>

      <template v-else>
        <LineChart
          :data="eventTrendData"
          :height="mobile ? 270 : 340"
          :categories="categories"
          :y-axis="['events', 'revenue']"
          :x-num-ticks="eventTrendData.length"
          :y-num-ticks="mobile ? 4 : 6"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.TopCenter"
          :hide-legend="mobile"
          x-label="Mês"
          y-label="Quantidade / Valor"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
