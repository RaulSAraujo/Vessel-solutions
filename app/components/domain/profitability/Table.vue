<script setup lang="ts">
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import { useProfitability } from "~/composables/useProfitability";

interface Props {
  period?: PeriodFilter;
}

defineProps<Props>();

const {
  events,
  loading,
  totalItems,
  itemsPerPage,
  currentPage,
  headers,
  getStatusColor,
  fetchEvents,
} = useProfitability();

const handleExport = () => {
  // Implementar exportação da tabela para CSV
  const csvContent = [
    // Cabeçalho
    [
      "Evento",
      "Cliente",
      "Data",
      "Status",
      "Receita",
      "Custo",
      "Lucro",
      "Margem (%)",
    ].join(","),
    // Dados
    ...events.value.map((event) =>
      [
        `"${event.location}"`,
        `"${event.clients?.name || "N/A"}"`,
        `"${formatDate(event.start_time.toString())}"`,
        `"${event.status || "N/A"}"`,
        event.total_revenue || 0,
        event.total_cost || 0,
        event.estimated_profit,
        event.profit_margin.toFixed(2),
      ].join(",")
    ),
  ].join("\n");

  // Criar e baixar arquivo
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `eventos-lucratividade-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <UiTable
    v-model:page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="events"
    item-value="id"
    :items-length="totalItems"
    :loading="loading"
    title="Eventos por Lucratividade"
    class="elevation-0 pb-2"
    density="compact"
    @update:options="(props) => fetchEvents(props, period)"
  >
    <template #buttons>
      <v-btn
        color="primary"
        variant="plain"
        size="small"
        icon="mdi-download"
        @click="handleExport"
      />
    </template>

    <!-- Nome do Evento -->
    <template #item.location="{ item }">
      <div class="d-flex align-center">
        <v-avatar size="32" color="primary" class="me-3">
          <v-icon size="16" color="white">mdi-calendar-check</v-icon>
        </v-avatar>

        <div class="text-truncate">
          <div class="text-body-2">
            {{ item.location }}
          </div>

          <div class="text-caption text-medium-emphasis">
            {{ item.audience_profile }}
          </div>
        </div>
      </div>
    </template>

    <!-- Cliente -->
    <template #item.clients="{ item }">
      <div class="text-body-2">{{ item.clients?.name || "N/A" }}</div>
    </template>

    <!-- Data do Evento -->
    <template #item.start_time="{ item }">
      <div class="text-body-2">
        {{ formatDate(item.start_time) }}
      </div>
    </template>

    <!-- Status -->
    <template #item.status="{ item }">
      <v-chip
        :color="getStatusColor(item.status || '')"
        size="small"
        variant="tonal"
      >
        {{ item.status || "N/A" }}
      </v-chip>
    </template>

    <!-- Receita -->
    <template #item.total_revenue="{ item }">
      <div class="text-body-2 font-weight-medium text-success">
        {{ formatCurrency(item.total_revenue) }}
      </div>
    </template>

    <!-- Custo -->
    <template #item.total_cost="{ item }">
      <div class="text-body-2 text-error">
        {{ formatCurrency(item.total_cost) }}
      </div>
    </template>

    <!-- Lucro -->
    <template #item.estimated_profit="{ item }">
      <div
        class="text-body-2 font-weight-medium"
        :class="item.estimated_profit >= 0 ? 'text-success' : 'text-error'"
      >
        {{ formatCurrency(item.estimated_profit) }}
      </div>
    </template>

    <!-- Margem de Lucro -->
    <template #item.profit_margin="{ item }">
      <div
        class="text-body-2 font-weight-medium"
        :class="item.profit_margin >= 0 ? 'text-success' : 'text-error'"
      >
        {{ item.profit_margin.toFixed(1) }}%
      </div>
    </template>
  </UiTable>
</template>
