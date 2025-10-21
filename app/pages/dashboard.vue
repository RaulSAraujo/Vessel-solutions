<script setup lang="ts">
import { usePeriodFilter } from "~/composables/usePeriodFilter";

definePageMeta({
  middleware: ["auth"],
});

const { currentPeriod, updatePeriod } = usePeriodFilter();
</script>

<template>
  <v-container fluid>
    <HeaderPeriod
      title="Dashboard"
      description="Visão geral completa do seu negócio de coquetelaria"
      :period="currentPeriod"
      @update:period="updatePeriod"
    />

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
