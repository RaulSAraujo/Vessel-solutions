<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <v-container fluid>
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold text-primary mb-2">Dashboard</h1>
        <p class="text-body-1 text-medium-emphasis">
          Visão geral completa do seu negócio de coquetelaria
        </p>
      </div>

      <div class="d-flex gap-3">
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus"
          to="/events"
        >
          Novo Evento
        </v-btn>

        <v-btn
          color="secondary"
          variant="outlined"
          prepend-icon="mdi-refresh"
          @click="$router.go(0)"
        >
          Atualizar
        </v-btn>
      </div>
    </div>

    <!-- KPI Cards Section -->
    <DashboardKpiSection />

    <!-- Main Content Grid -->
    <v-row>
      <!-- Left Column - Charts -->
      <v-col cols="12" lg="8">
        <v-row>
          <!-- Monthly Events Chart -->
          <v-col cols="12" md="6">
            <DashboardChartSectionMonthlyEvents />
          </v-col>

          <!-- Profit Summary Chart -->
          <v-col cols="12" md="6">
            <DashboardChartSectionProfitSummary />
          </v-col>

          <!-- Drink Cost Distribution -->
          <v-col cols="12">
            <DashboardChartSectionDrinkCostDistribution />
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Column - Sidebar -->
      <v-col cols="12" lg="4">
        <v-row>
          <!-- Recent Activity -->
          <v-col cols="12">
            <DashboardRecentActivity />
          </v-col>

          <!-- Quick Actions -->
          <v-col cols="12">
            <DashboardQuickActions />
          </v-col>

          <!-- Top Clients -->
          <v-col cols="12">
            <DashboardTopClients />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
