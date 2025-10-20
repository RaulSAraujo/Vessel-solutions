<script lang="ts" setup>
import type { EventQuotation } from "~/types/event-quotations";

// componentes
import Status from "./Status.vue";

const emit = defineEmits([
  "openFilter",
  "openCreation",
  "openUpdate",
  "openDelete",
  "openConvert",
]);

const store = useEventQuotationsStore();
const {
  page,
  itemsPerPage,
  items,
  totalItems,
  loading,
  selectedEventQuotation,
} = storeToRefs(store);

const headers = [
  { title: "Ações", key: "actions", sortable: false },
  { title: "Status", key: "status", minWidth: 120 },
  { title: "Cliente", key: "client_name", minWidth: 150 },
  { title: "Endereço completo", key: "location", minWidth: 175, maxWidth: 180 },
  { title: "Nº de convidados", key: "guest_count", minWidth: 163 },
  { title: "Inicio do evento", key: "start_time", minWidth: 160 },
  { title: "Final do evento", key: "end_time", minWidth: 160 },
  { title: "Distância (km)", key: "distance", minWidth: 150 },
  { title: "Perfil", key: "audience_profile", minWidth: 100 },
  { title: "Custo total", key: "total_cost", minWidth: 120 },
  { title: "Receita total", key: "total_revenue", minWidth: 140 },
  { title: "Margem de lucro", key: "profit_margin", minWidth: 160 },
  { title: "Quant. estimada", key: "estimated_total_drinks", minWidth: 157 },
  {
    title: "Taxa Bartender (R$/h)",
    key: "bartender_hourly_rate",
    minWidth: 180,
  },
  { title: "Nº Bartenders", key: "num_bartenders", minWidth: 130 },
  { title: "Custo Combustível/km", key: "fuel_cost_per_km", minWidth: 180 },
  { title: "Criado em", key: "created_at", minWidth: 120 },
  { title: "Atualizado em", key: "updated_at", minWidth: 145 },
];

function handleOpenUpdate(eventQuotation: EventQuotation) {
  selectedEventQuotation.value = eventQuotation;
  emit("openUpdate");
}

function handleOpenDelete(eventQuotation: EventQuotation) {
  selectedEventQuotation.value = eventQuotation;
  emit("openDelete");
}

function handleOpenConvert(eventQuotation: EventQuotation) {
  selectedEventQuotation.value = eventQuotation;
  emit("openConvert");
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    title="Lista de propostas e orçamentos"
    :items="items"
    item-value="id"
    :headers="headers"
    :loading="loading"
    :total-items="totalItems"
    class="rounded-b-lg rounded-t-xl"
    @update:options="store.fetchEventQuotations"
  >
    <template #buttons>
      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        density="comfortable"
        icon="mdi-filter-variant"
        @click="$emit('openFilter')"
      />

      <v-btn
        rounded="xl"
        color="grey"
        variant="text"
        icon="mdi-refresh"
        density="comfortable"
        @click="store.fetchEventQuotations"
      />

      <v-btn
        rounded="xl"
        color="grey"
        icon="mdi-plus"
        variant="text"
        density="comfortable"
        @click="$emit('openCreation')"
      />
    </template>

    <template #item.actions="{ item }">
      <UiTableActions
        @edit="handleOpenUpdate(item)"
        @delete="handleOpenDelete(item)"
      >
        <template #items>
          <v-divider />

          <v-list-item
            title="Converter para Evento"
            base-color="success"
            @click="handleOpenConvert(item)"
          >
            <template #prepend>
              <v-icon size="small" start icon="mdi-calendar-plus" />
            </template>
          </v-list-item>
        </template>
      </UiTableActions>
    </template>

    <template #item.status="{ item }">
      <Status :status="item.status" />
    </template>

    <template #item.client_name="{ item }">
      <UiTextWithTooltip :text="item.client_name" />
    </template>

    <template #item.location="{ item }">
      <UiTextWithTooltip :text="item.location" />
    </template>

    <template #item.total_cost="{ item }">
      {{ formatCurrency(item.total_cost) }}
    </template>

    <template #item.total_revenue="{ item }">
      {{ formatCurrency(item.total_revenue) }}
    </template>

    <template #item.profit_margin="{ item }">
      {{ item.profit_margin }}%
    </template>

    <template #item.start_time="{ item }">
      {{ formatDate(item.start_time, "DD/MM [ás] HH:mm") }}
    </template>

    <template #item.end_time="{ item }">
      {{ formatDate(item.end_time, "DD/MM [ás] HH:mm") }}
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template #item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>

    <template #item.bartender_hourly_rate="{ item }">
      {{
        item.bartender_hourly_rate
          ? formatCurrency(item.bartender_hourly_rate)
          : "-"
      }}
    </template>

    <template #item.num_bartenders="{ item }">
      {{ item.num_bartenders || "-" }}
    </template>

    <template #item.fuel_cost_per_km="{ item }">
      {{ item.fuel_cost_per_km ? formatCurrency(item.fuel_cost_per_km) : "-" }}
    </template>
  </UiTable>
</template>
