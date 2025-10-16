<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";

// components
import Card from "./Card.vue";

const reportsApi = useReportsApi();

const totalEvents = ref(0);
const totalProfit = ref(0);
const totalClients = ref(0);
const totalDrinks = ref(0);
const averageEventValue = ref(0);
const monthlyGrowth = ref(0);
const loading = ref(false);

async function fetchKPIs() {
  loading.value = true;

  try {
    const overview = await reportsApi.getKpisOverview();

    if (overview) {
      totalClients.value = overview.data.clients.count;
      totalEvents.value = overview.data.events.count;
      totalProfit.value = overview.data.events.total_cost;
      totalDrinks.value = overview.data.drinks?.count || 0;
      averageEventValue.value =
        totalEvents.value > 0 ? totalProfit.value / totalEvents.value : 0;
      monthlyGrowth.value = overview.data.monthly_growth || 0;
    }
  } catch (error) {
    console.error("Erro ao carregar KPIs:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchKPIs);
</script>

<template>
  <v-row>
    <!-- Eventos Concluídos -->
    <v-col cols="12" sm="6" md="3">
      <Card
        color="primary"
        :loading="loading"
        :title="totalEvents"
        icon="mdi-calendar-check"
        description="Eventos concluídos"
        :trend="monthlyGrowth"
        trend-label="vs mês anterior"
      />
    </v-col>

    <!-- Lucro Total -->
    <v-col cols="12" sm="6" md="3">
      <Card
        color="success"
        :loading="loading"
        icon="mdi-currency-usd"
        description="Lucro bruto total"
        :title="`R$ ${totalProfit.toFixed(2)}`"
        :subtitle="`Média: R$ ${averageEventValue.toFixed(2)}`"
      />
    </v-col>

    <!-- Clientes -->
    <v-col cols="12" sm="6" md="3">
      <Card
        color="info"
        :loading="loading"
        :title="totalClients"
        icon="mdi-account-group"
        description="Clientes cadastrados"
      />
    </v-col>

    <!-- Bebidas -->
    <v-col cols="12" sm="6" md="3">
      <Card
        color="warning"
        :loading="loading"
        :title="totalDrinks"
        icon="mdi-glass-cocktail"
        description="Bebidas cadastradas"
      />
    </v-col>
  </v-row>
</template>
