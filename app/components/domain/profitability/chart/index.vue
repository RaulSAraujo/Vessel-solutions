<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useProfitability } from "~/composables/useProfitability";

// Components
import Container from "./Container.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, loadProfitData } = useProfitability();
const profitData = ref<
  ReturnType<typeof loadProfitData> extends Promise<infer T> ? T : never
>([]);

const xFormatter = (i: number): string => {
  return chartData.value[i]?.date || "";
};

const yFormatter = (tick: number) => `R$ ${tick.toFixed(2)}`;

const chartData = computed(() => {
  if (!profitData.value.length) return [];

  return profitData.value.map((item) => {
    return {
      date: item.date,
      revenue: parseFloat(item.revenue || "0"),
      cost: parseFloat(item.cost || "0"),
      profit: parseFloat(item.profit || "0"),
    };
  });
});

const categories = {
  revenue: {
    name: "Receita",
    color: "#4caf50",
  },
  cost: {
    name: "Custo",
    color: "#f44336",
  },
  profit: {
    name: "Lucro",
    color: "#2196f3",
  },
};

async function loadData() {
  const data = await loadProfitData(props.period);
  profitData.value = data;
}

const handleExport = () => {
  // TODO: Implementar exportação do gráfico
};

onMounted(loadData);

watch(() => props.period, loadData, { deep: true });
</script>

<template>
  <Container
    title="Evolução da Lucratividade"
    :loading="loading"
    :empty="profitData.length === 0"
    @export="handleExport"
  >
    <ClientOnly>
      <LineChart
        :data="chartData"
        :height="300"
        :categories="categories"
        :y-axis="['revenue', 'cost', 'profit']"
        :x-num-ticks="chartData.length"
        :y-num-ticks="6"
        :y-grid-line="true"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :legend-position="LegendPosition.Top"
        :hide-legend="false"
        x-label="Data"
        y-label="Valor (R$)"
      />

      <template #fallback>
        <div class="d-flex align-center justify-center h-100">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>
    </ClientOnly>
  </Container>
</template>
