<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useIngredientConsumption } from "~/composables/useIngredientConsumption";
import type { IngredientConsumption } from "~/composables/useIngredientConsumption";

// Components
import Container from "./Container.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, loadConsumptionData } = useIngredientConsumption();
const consumptionData = ref<IngredientConsumption[]>([]);

// Configuração do gráfico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Top 10 Ingredientes por Custo",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: number) {
          return "R$ " + value.toFixed(2);
        },
      },
    },
  },
};

const chartData = computed(() => {
  if (!consumptionData.value.length) return [];

  // Pegar top 10 ingredientes por custo
  const topIngredients = consumptionData.value.slice(0, 10);

  return topIngredients.map((item, index) => ({
    name: item.name,
    value: item.totalCost,
    color: [
      "rgba(33, 150, 243, 0.8)",
      "rgba(76, 175, 80, 0.8)",
      "rgba(255, 193, 7, 0.8)",
      "rgba(156, 39, 176, 0.8)",
      "rgba(244, 67, 54, 0.8)",
      "rgba(0, 150, 136, 0.8)",
      "rgba(255, 152, 0, 0.8)",
      "rgba(121, 85, 72, 0.8)",
      "rgba(63, 81, 181, 0.8)",
      "rgba(233, 30, 99, 0.8)",
    ][index % 10],
  }));
});

async function loadData() {
  const response = await loadConsumptionData(props.period);
  if (response?.data) {
    consumptionData.value = response.data;
  } else {
    consumptionData.value = [];
  }
}

const handleExport = () => {
  // TODO: Implementar exportação do gráfico
  console.log("Exportar gráfico de consumo");
};

onMounted(loadData);
watch(() => props.period, loadData, { deep: true });
</script>

<template>
  <Container
    title="Consumo de Ingredientes"
    :loading="loading"
    :empty="consumptionData.length === 0"
    @export="handleExport"
  >
    <ClientOnly>
      <BarChart :data="chartData" :options="chartOptions" />
      <template #fallback>
        <div class="d-flex align-center justify-center h-100">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>
    </ClientOnly>
  </Container>
</template>
