<script lang="ts" setup>
import { useReportsApi } from "~/composables/api/useReportsApi";

// components
import Card from "./Card.vue";

const reportsApi = useReportsApi();

const totalEvents = ref(0);
const totalProfit = ref(0);
const totalClients = ref(0);
const loading = ref(false);

async function fetchKPIs() {
  loading.value = true;

  const overview = await reportsApi.getKpisOverview();

  if (overview) {
    totalClients.value = overview.data.clients.count;
    totalEvents.value = overview.data.events.count;
    totalProfit.value = totalProfit.value = overview.data.events.total_cost;
  }

  loading.value = false;
}

onMounted(fetchKPIs);
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <Card
        color="primary"
        :loading="loading"
        :title="totalEvents"
        icon="mdi-calendar-check"
        description="Eventos Realizados"
      />
    </v-col>

    <v-col cols="12" md="4">
      <Card
        color="success"
        :loading="loading"
        icon="mdi-currency-usd"
        description="Lucro Bruto Total"
        :title="`R$ ${totalProfit.toFixed(2)}`"
      />
    </v-col>

    <v-col cols="12" md="4">
      <Card
        color="info"
        :loading="loading"
        :title="totalClients"
        icon="mdi-account-group"
        description="Clientes Ativos"
      />
    </v-col>
  </v-row>
</template>
