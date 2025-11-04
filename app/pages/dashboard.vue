<script setup lang="ts">
import { usePeriodFilter } from "~/composables/usePeriodFilter";

definePageMeta({
  middleware: ["auth"],
});

const { mobile } = useDisplay();
const { currentPeriod, updatePeriod } = usePeriodFilter();

// Tutorial com Driver.js
const tutorial = useTutorialDriver();

const isReady = ref(false);

// Delay de 200ms antes de renderizar os componentes
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  isReady.value = true;
});

// Limpar tutorial ao desmontar
onUnmounted(() => {
  if (process.client) {
    tutorial.destroy();
  }
});
</script>

<template>
  <v-container :fluid="!mobile" :class="{ 'px-2': mobile }">
    <div
      v-if="!isReady"
      class="d-flex justify-center align-center"
      style="height: 200px"
    >
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <template v-else>
      <HeaderPeriod
        id="tutorial-header-period"
        title="Dashboard"
        description="Visão geral completa do seu negócio de coquetelaria"
        :period="currentPeriod"
        @update:period="updatePeriod"
      />

      <!-- KPI Cards Section -->
      <div id="tutorial-kpi-section">
        <DashboardKpiSection :period="currentPeriod" />
      </div>

      <!-- Main Content Grid -->
      <v-row :dense="mobile">
        <!-- Left Column - Charts -->
        <v-col
          id="tutorial-charts-section"
          cols="12"
          :lg="mobile ? 12 : 8"
          :order="mobile ? 2 : 1"
        >
          <v-row :dense="mobile">
            <!-- Monthly Events Chart -->
            <v-col cols="12" :md="mobile ? 12 : 6">
              <DashboardChartSectionMonthlyEvents :period="currentPeriod" />
            </v-col>

            <!-- Profit Summary Chart -->
            <v-col cols="12" :md="mobile ? 12 : 6">
              <DashboardChartSectionProfitSummary :period="currentPeriod" />
            </v-col>

            <!-- Event Trend Chart -->
            <v-col cols="12">
              <DashboardChartSectionEventTrendChart :period="currentPeriod" />
            </v-col>
          </v-row>
        </v-col>

        <!-- Right Column - Sidebar -->
        <v-col cols="12" :lg="mobile ? 12 : 4" :order="mobile ? 1 : 2">
          <v-row :dense="mobile">
            <!-- Quick Actions - Show first on mobile -->
            <v-col cols="12">
              <div id="tutorial-quick-actions">
                <DashboardQuickActions />
              </div>
            </v-col>

            <!-- Recent Activity -->
            <v-col cols="12">
              <div id="tutorial-recent-activity">
                <DashboardRecentActivity :period="currentPeriod" />
              </div>
            </v-col>

            <!-- Top Clients -->
            <v-col cols="12">
              <div id="tutorial-top-clients">
                <DashboardTopClients :period="currentPeriod" />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
