<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useDisplay } from "vuetify";

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
const { mobile } = useDisplay();
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
  <v-card
    elevation="2"
    :class="mobile ? 'pa-2' : 'pa-4'"
    class="border-sm"
    rounded="xl"
    :height="mobile ? '300' : '440'"
  >
    <v-card-title
      :class="mobile ? 'pa-2' : 'pa-4'"
      class="d-flex align-center justify-space-between"
    >
      <span :class="mobile ? 'text-body-1' : 'text-h6'">Resumo de Lucros</span>
      <v-btn
        icon="mdi-refresh"
        variant="text"
        :size="mobile ? 'x-small' : 'small'"
        @click="loadProfitSummary"
      />
    </v-card-title>

    <v-card-text :class="mobile ? 'pa-2' : 'pa-4'">
      <v-skeleton-loader
        v-if="isLoading"
        type="image"
        :height="mobile ? 200 : 300"
      />

      <div
        v-else-if="!profitData.length"
        class="d-flex flex-column align-center justify-center"
        :style="mobile ? 'height: 200px' : 'height: 300px'"
      >
        <v-icon
          icon="mdi-chart-areaspline-variant"
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
          Complete alguns eventos para ver o gráfico
        </p>
      </div>

      <template v-else>
        <AreaChart
          :data="profitData"
          :height="mobile ? 210 : 300"
          :categories="{
            profit: { name: 'Lucro', color: '#4caf50' },
            cost: { name: 'Custo', color: '#f44336' },
            revenue: { name: 'Receita', color: '#2196f3' },
          }"
          :y-axis="['Valor (R$)']"
          :x-num-ticks="profitData.length"
          :y-num-ticks="mobile ? 5 : 8"
          :y-grid-line="true"
          :legend-position="LegendPosition.TopCenter"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
