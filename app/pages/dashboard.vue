<script setup lang="ts">
import { usePeriodFilter } from "~/composables/usePeriodFilter";

definePageMeta({
  middleware: ["auth"],
});

const { currentPeriod, updatePeriod } = usePeriodFilter();
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

      <div class="d-flex align-center">
        <v-btn
          rounded="lg"
          class="mr-2"
          color="grey"
          variant="outlined"
          icon="mdi-refresh"
          density="comfortable"
          @click="$router.go(0)"
        />

        <UiPeriodFilter @update:period="updatePeriod" />
      </div>
    </div>

    <!-- KPI Cards Section -->
    <DashboardKpiSection :period="currentPeriod" />

    <!-- Main Content Grid -->
    <v-row>
      <!-- Left Column - Charts -->
      <v-col cols="12" lg="8">
        <v-row>
          <!-- Monthly Events Chart -->
          <v-col cols="12" md="6">
            <DashboardChartSectionMonthlyEvents :period="currentPeriod" />
          </v-col>

          <!-- Profit Summary Chart -->
          <v-col cols="12" md="6">
            <DashboardChartSectionProfitSummary :period="currentPeriod" />
          </v-col>

          <!-- Event Trend Chart -->
          <v-col cols="12">
            <DashboardChartSectionEventTrendChart :period="currentPeriod" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Column - Sidebar -->
      <v-col cols="12" lg="4">
        <v-row>
          <!-- Recent Activity -->
          <v-col cols="12">
            <DashboardRecentActivity :period="currentPeriod" />
          </v-col>

          <!-- Quick Actions -->
          <v-col cols="12">
            <DashboardQuickActions />
          </v-col>

          <!-- Top Clients -->
          <v-col cols="12">
            <DashboardTopClients :period="currentPeriod" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
