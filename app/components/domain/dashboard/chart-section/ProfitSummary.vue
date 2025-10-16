<script lang="ts" setup>
interface ProfitData {
  date: string;
  cost: number;
  revenue: number;
  profit: number;
}

const isLoading = ref(true);
const profitData = ref<ProfitData[]>([]);

async function loadProfitSummary() {
  try {
    isLoading.value = true;

    const res = await $fetch("/api/reports/profit-summary");

    if (Array.isArray(res) && res.length > 0) {
      // O endpoint retorna diretamente um array com dados
      profitData.value = res;
    } else if (res && res.data && res.data.length > 0) {
      // Fallback caso a estrutura mude
      profitData.value = res.data;
    } else {
      // Se não há dados reais, usa dados de exemplo
      console.warn(
        "Nenhum dado de lucro real encontrado, usando dados de exemplo."
      );
      const sampleRes = await $fetch("/api/reports/profit-summary-simple");
      profitData.value = Array.isArray(sampleRes) ? sampleRes : [];
    }
  } catch (error) {
    console.error("Erro ao carregar o gráfico de lucro:", error);
    // Em caso de erro, tenta carregar dados de exemplo
    try {
      const sampleRes = await $fetch("/api/reports/profit-summary-simple");
      profitData.value = Array.isArray(sampleRes) ? sampleRes : [];
    } catch (sampleError) {
      console.error("Erro ao carregar dados de exemplo:", sampleError);
      profitData.value = [];
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadProfitSummary();
});
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" min-height="400">
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
      <v-skeleton-loader v-if="isLoading" type="image" height="300" />

      <div
        v-else-if="!profitData.length"
        class="d-flex flex-column align-center justify-center"
        style="height: 300px"
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
          :height="300"
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
