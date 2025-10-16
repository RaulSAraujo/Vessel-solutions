<script lang="ts" setup>
interface DrinkCostData {
  color: string;
  name: string;
  value: number;
}

const isLoading = ref(true);
const drinkCostData = ref<DrinkCostData[]>([]);

async function loadDrinkCostDistribution() {
  try {
    isLoading.value = true;

    const res = await $fetch("/api/reports/drink-cost-distribution");

    if (Array.isArray(res) && res.length > 0) {
      // O endpoint retorna diretamente um array com dados
      drinkCostData.value = res;
    } else if (res && res.data && res.data.length > 0) {
      // Fallback caso a estrutura mude
      drinkCostData.value = res.data;
    } else {
      drinkCostData.value = [];
      console.warn("Nenhum dado de distribuição de custos recebido.");
    }
  } catch (error) {
    console.error(
      "Erro ao carregar o gráfico de distribuição de custos:",
      error
    );
    drinkCostData.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadDrinkCostDistribution();
});
</script>

<template>
  <v-card elevation="2" class="pa-4 border-sm" rounded="xl" min-height="400">
    <v-card-title class="d-flex align-center justify-space-between">
      Distribuição de Custos por Categoria
      <v-btn
        icon="mdi-refresh"
        variant="text"
        size="small"
        @click="loadDrinkCostDistribution"
      />
    </v-card-title>

    <v-card-text>
      <v-skeleton-loader v-if="isLoading" type="image" height="300" />

      <div
        v-else-if="!drinkCostData.length"
        class="d-flex flex-column align-center justify-center"
        style="height: 300px"
      >
        <v-icon
          icon="mdi-chart-donut-variant"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        />
        <p class="text-h6 text-medium-emphasis">Nenhum dado disponível</p>
        <p class="text-body-2 text-medium-emphasis">
          Adicione bebidas para ver a distribuição
        </p>
      </div>

      <template v-else>
        <div class="d-flex align-center">
          <div style="flex: 1">
            <DonutChart
              :data="drinkCostData"
              :height="300"
              :categories="{
                value: { name: 'Custo', color: '#ff9800' },
              }"
              :y-axis="['Custo (R$)']"
              :legend-position="LegendPosition.Right"
            />
          </div>

          <div class="ml-4" style="flex: 1">
            <v-list density="compact">
              <v-list-item
                v-for="item in drinkCostData"
                :key="item.name"
                class="px-0"
              >
                <template #prepend>
                  <v-avatar :color="item.color" size="16" />
                </template>

                <v-list-item-title class="text-body-2">
                  {{ item.name }}
                </v-list-item-title>

                <template #append>
                  <div class="text-caption text-medium-emphasis">
                    R$ {{ item.value.toFixed(2) }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>
