<script setup lang="ts">
import { watch, onMounted } from "vue";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useQuotationHistory } from "~/composables/useQuotationHistory";

// Components
import Container from "./Container.vue";

interface Props {
  period?: PeriodFilter;
}

const props = defineProps<Props>();

const { loading, chartData, loadQuotationData } = useQuotationHistory();

async function loadData() {
  await loadQuotationData(props.period);
}

const handleExport = () => {
  // TODO: Implementar exportação do gráfico
  console.log("Exportar gráfico");
};

onMounted(loadData);

watch(() => props.period, loadData, { deep: true });
</script>

<template>
  <Container
    title="Análise de Fornecedores"
    :loading="loading"
    :empty="!chartData.length"
    @export="handleExport"
  >
    <ClientOnly>
      <BarChart
        :data="chartData"
        :height="370"
        :categories="{ fornecedor: { name: 'Fornecedor', color: 'primary' } }"
        :y-axis="['value']"
        :x-num-ticks="chartData.length"
        :y-num-ticks="10"
        :radius="10"
        :y-grid-line="true"
        :hide-legend="true"
      />

      <template #fallback>
        <div class="d-flex align-center justify-center h-100">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>
    </ClientOnly>
  </Container>
</template>
